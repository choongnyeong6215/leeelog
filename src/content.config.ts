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
      // 현재 코드에서는 사용하지 않음. 추후 정렬/추천 기능에 재활용할 수 있어 필드만 남겨둠.
      pinned: z.boolean().default(false),
      views: z.number().int().nonnegative().optional(),
      heroImage: image().optional(),
    }),
});

export const collections = { posts };
