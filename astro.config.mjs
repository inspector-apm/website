// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://inspector.dev',
  trailingSlash: 'always',
  integrations: [sitemap()],
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
