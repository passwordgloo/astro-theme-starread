import { defineCollection, z } from 'astro:content';

// 生成6位16进制随机字符串
function generateHexString(length = 6): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
      prev: z.string().nullable().optional(),
      next: z.string().nullable().optional(),
      permalink: z.string().default(() => `/articles/${generateHexString(6)}/`),
    }),
  }),
  notes: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.date().optional(),
      categories: z.array(z.string()).optional(),
      cover: z.string().default('/defaultCover.jpg'),
      tags: z.array(z.string()).optional(),
      prev: z.string().nullable().optional(),
      next: z.string().nullable().optional(),
      permalink: z.string().default(() => {
        // 注意：这里无法直接获取文件路径信息，
        // 在Astro构建时，会使用脚本中的逻辑来处理文件夹结构
        return `/notes/${generateHexString(6)}/`;
      }),
    }),
  }),
};