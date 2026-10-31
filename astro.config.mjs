// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

const posts = new URL('./src/content/blog/posts/', import.meta.url);

// The sitemap's last-modified dates, from each post's `updated` field.
const postDates = new Map(
  readdirSync(posts).map((file) => [
    file.replace('.md', ''),
    readFileSync(new URL(file, posts), 'utf8').match(/^updated: "(.+)"$/m)?.[1],
  ]),
);

/**
 * Shows the file name from a fence like ```php title="config/app.php" above the code.
 * @type {import('shiki').ShikiTransformer}
 */
const codeTitle = {
  name: 'code-title',
  pre(node) {
    const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1];

    if (title) node.properties['data-title'] = title;
  },
};

// https://astro.build/config
export default defineConfig({
  site: 'https://inspector.dev',
  trailingSlash: 'always',
  // Lets a parent's scoped class reach a child that applies the `class` prop to its root.
  scopedStyleStrategy: 'class',
  integrations: [
    sitemap({
      serialize(item) {
        const slug = new URL(item.url).pathname.replaceAll('/', '');

        return { ...item, lastmod: postDates.get(slug) };
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
      langAlias: { apacheconf: 'apache', env: 'dotenv' },
      transformers: [codeTitle],
    },
  },
  vite: {
    resolve: {
      alias: {
        '~components': fileURLToPath(
          new URL('./src/components', import.meta.url),
        ),
        '~styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '~assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '~consts': fileURLToPath(new URL('./src/consts', import.meta.url)),
      },
    },
  },
});
