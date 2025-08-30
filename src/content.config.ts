import { defineCollection, z } from 'astro:content';

// 文章内容集合定义
export const collections = {
  articles: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.date().optional(),
      categories: z.array(z.string()).optional(),
      cover: z.string().default('/defaultCover.jpg'),
      tags: z.array(z.string()).optional(),
    }),
  }),
};