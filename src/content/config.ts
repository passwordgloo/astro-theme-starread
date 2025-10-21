import { defineCollection, z, type CollectionEntry } from 'astro:content';

// 定义文章集合
const articlesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // 标题是必需的，如果未提供，将在渲染时使用文章的一级标题
    title: z.string().optional(),
    // 如果用户提供了分类，则不能为空数组
    categories: z.array(z.string()).refine(arr => arr.length > 0, {
      message: '分类不能为空'
    }).optional(),
    // 如果用户提供了标签，则不能为空数组
    tags: z.array(z.string()).refine(arr => arr.length > 0, {
      message: '标签不能为空'
    }).optional(),
    // 如果用户提供了封面图，则必须是有效的URL
    cover: z.string().refine(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }, { message: '封面图必须是有效的URL' }).optional(),
    // 如果用户提供了描述，则不能为空字符串
    description: z.string().refine(desc => desc.trim().length > 0, {
      message: '描述不能为空'
    }).optional(),
    // 日期格式验证为yyyy-mm-dd hh:mm:ss
    // 日期可以是字符串或Date对象，但字符串必须符合yyyy-mm-dd hh:mm:ss格式
    date: z.union([
      z.string().refine(date => {
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        return regex.test(date);
      }, { message: '日期格式必须为yyyy-mm-dd hh:mm:ss' }),
      z.date()
    ]).optional(),
    // 下一篇文章的slug，如果提供则不能是空字符串
    next: z.string().refine(slug => slug.trim().length > 0, {
      message: '下一篇文章的slug不能为空'
    }).optional().nullable(),
    // 上一篇文章的slug，如果提供则不能是空字符串
    prev: z.string().refine(slug => slug.trim().length > 0, {
      message: '上一篇文章的slug不能为空'
    }).optional().nullable(),
  }),

})

export const collections = {
  articles: articlesCollection,
};