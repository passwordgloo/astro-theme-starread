import { getCollection } from 'astro:content';
import { themeConfig } from '../../starread.config';

// 类型定义
export interface EntryData {
  title: string;
  date?: string | Date;
  cover?: string;
  author?: { name?: string; avatar?: string };
  categories?: string[];
  tags?: string[];
  views?: number;
  permalink?: string;
}

export interface ProcessedEntry {
  slug: string;
  data: EntryData;
  body: string;
  _collection: string;
  processed?: {
    date: string;
    cover: string;
    author: { name: string; avatar: string };
    categories: string[];
    tags: string[];
    views: number;
    permalink: string;
  };
}

// 生成16进制随机字符串
export function generateHexString(length: number = 6): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成永久链接
export function generatePermalink(collection: string, slug: string): string {
  // 直接使用slug作为永久链接，不包含collection前缀
  return slug;
}

// 日期格式化工具函数
export function formatDate(dateString?: string | Date): string {
  if (!dateString) {
    // 返回当前日期时间，格式为 YYYY-MM-DD HH:mm:ss
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  if (typeof dateString === 'string') {
    // 如果已经包含时间部分，直接返回
    if (dateString.includes(' ')) {
      return dateString;
    }
    // 处理 "2024-01-01" 或 "2024-01-01T12:00:00.000Z" 格式，添加时间部分
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return dateString;
  }
  
  if (dateString instanceof Date) {
    const year = dateString.getFullYear();
    const month = String(dateString.getMonth() + 1).padStart(2, '0');
    const day = String(dateString.getDate()).padStart(2, '0');
    const hours = String(dateString.getHours()).padStart(2, '0');
    const minutes = String(dateString.getMinutes()).padStart(2, '0');
    const seconds = String(dateString.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  // 返回默认日期时间格式
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 封面图片处理工具函数
export function getCoverImage(cover?: string): string {
  return cover || themeConfig.site.defaultCover;
}

// 作者信息处理工具函数
export function getAuthorInfo(author?: { name?: string; avatar?: string }) {
  return {
    name: author?.name || themeConfig.widget.author.name,
    avatar: author?.avatar || themeConfig.widget.author.avatar
  };
}

// 文章排序工具函数
export function sortEntriesByDate(entries: any[]): any[] {
  return [...entries].sort((a, b) => 
    new Date(b.data.date || 0).getTime() - new Date(a.data.date || 0).getTime()
  );
}

// 文章数据预处理工具函数
export function processEntryData(entries: any[], collection: string): any[] {
  return entries.map(entry => ({
    ...entry,
    processed: {
      date: formatDate(entry.data.date),
      cover: getCoverImage(entry.data.cover),
      author: getAuthorInfo(entry.data.author),
      categories: entry.data.categories || [],
      tags: entry.data.tags || [],
      views: entry.data.views || 0,
      permalink: entry.data.permalink || entry.slug
    }
  }));
}

// 获取相邻文章信息工具函数
export async function getAdjacentEntries(currentSlug: string, collection: 'articles' | 'notes'): Promise<{ prev: any; next: any }> {
  const entries = await getCollection(collection);
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.data.date || 0).getTime() - new Date(b.data.date || 0).getTime()
  );
  
  const currentIndex = sortedEntries.findIndex(entry => entry.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  const prev = currentIndex > 0 ? sortedEntries[currentIndex - 1] : null;
  const next = currentIndex < sortedEntries.length - 1 ? sortedEntries[currentIndex + 1] : null;
  
  return {
    prev: prev ? {
      slug: prev.slug,
      title: prev.data.title,
      cover: getCoverImage(prev.data.cover),
      date: formatDate(prev.data.date),
      permalink: (prev.data as any).permalink || prev.slug
    } : null,
    next: next ? {
      slug: next.slug,
      title: next.data.title,
      cover: getCoverImage(next.data.cover),
      date: formatDate(next.data.date),
      permalink: (next.data as any).permalink || next.slug
    } : null
  };
}

// 计算文章字数（适用于中英文混合文本）
export function countWords(text: string): number {
  if (!text) return 0;
  // 移除HTML标签
  const plainText = text.replace(/<[^>]*>/g, '');
  // 匹配中文字符和英文单词
  const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g) || [];
  const englishWords = plainText.match(/[a-zA-Z]+/g) || [];
  return chineseChars.length + englishWords.length;
}

// 生成静态路径的通用函数
export async function generateStaticPaths(collection: 'articles' | 'notes') {
  const entries = await getCollection(collection);
  
  // 按日期排序文章
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.data.date || 0).getTime() - new Date(b.data.date || 0).getTime()
  );
  
  return sortedEntries.map((entry, index) => {
    const prev = index > 0 ? sortedEntries[index - 1].slug : null;
    const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1].slug : null;
    
    return {
      params: { slug: entry.slug },
      props: { 
        entry,
        prev,
        next
      },
    };
  });
}