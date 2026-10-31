import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        date: z.coerce.date(),
        updated: z.coerce.date(),
        author: z.string(),
        description: z.string().optional(),
        excerpt: z.string().optional(),
        seo_title: z.string().optional(),
        featured_image: image().optional(),
        featured_image_alt: z.string().optional(),
      })
      .transform(({ description, excerpt, ...post }) => ({
        ...post,
        summary: description ?? excerpt ?? '',
      })),
});

export const collections = { blog };
