import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_SLUGS } from './config';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(CATEGORY_SLUGS),
      tags: z.array(z.string()).default([]),
      series: z.string().optional(),
      seriesOrder: z.number().int().positive().optional(),
      draft: z.boolean().default(false),
      // 조회수 애널리틱스 연동 전까지, pinned/views로 홈 "인기 글" 노출을 임시 제어.
      pinned: z.boolean().default(false),
      views: z.number().int().nonnegative().optional(),
      heroImage: image().optional(),
    }),
});

export const collections = { posts };
