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

// 相邻文章接口定义
export interface AdjacentEntry {
  title: string;
  cover: string;
  date: string;
  permalink: string;
}

// 获取相邻文章信息工具函数
export async function getAdjacentEntries(currentPermalink: string, collection: 'articles' | 'notes'): Promise<{ prev: AdjacentEntry | null; next: AdjacentEntry | null }> {
  const entries = await getCollection(collection);
  // 使用优化后的泛型排序函数
  const sortedEntries = sortEntriesByDate(entries);
  
  const currentIndex = sortedEntries.findIndex(entry => entry.data.permalink === currentPermalink);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  // 修正逻辑：prev是当前文章之前的文章（更早的文章），next是当前文章之后的文章（更新的文章）
  const prev = currentIndex < sortedEntries.length - 1 ? sortedEntries[currentIndex + 1] : null;
  const next = currentIndex > 0 ? sortedEntries[currentIndex - 1] : null;
  
  // 使用更现代的可选链操作符和空值合并运算符
  const formatAdjacentEntry = (entry: typeof sortedEntries[0] | null): AdjacentEntry | null => entry ? {
    title: entry.data.title || 'Untitled',
    cover: getCoverImage(entry.data.cover),
    date: formatDate(entry.data.date),
    permalink: entry.data.permalink
  } : null;
  
  return {
    prev: formatAdjacentEntry(prev),
    next: formatAdjacentEntry(next)
  };
}

// 生成16进制随机字符串
export function generateHexString(length: number = 6): string {
  // 使用更现代的方式生成随机字符串
  const array = new Uint8Array(length / 2);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}

// 日期格式化工具函数
export function formatDate(dateString?: string | Date): string {
  // 如果字符串已包含时间部分，直接返回
  if (typeof dateString === 'string' && dateString.includes(' ')) {
    return dateString;
  }

  const date = dateString ? new Date(dateString) : new Date();
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return typeof dateString === 'string' ? dateString : '';
  }

  // 使用 Intl.DateTimeFormat 进行格式化，确保一致的输出格式
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date).replace(/\//g, '-');
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
export function sortEntriesByDate<T extends { data: { date?: string | Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA; // 降序排列，最新的文章在前
  });
}

// 文章数据预处理工具函数
export function processEntryData(entries: any[], collection: string): ProcessedEntry[] {
  return entries.map(entry => ({
    ...entry,
    processed: {
      date: formatDate(entry.data.date),
      cover: getCoverImage(entry.data.cover),
      author: getAuthorInfo(entry.data.author),
      categories: entry.data.categories || [],
      tags: entry.data.tags || [],
      views: entry.data.views || 0,
      permalink: entry.data.permalink
    }
  }));
}

// 计算文章字数（适用于中英文混合文本）
export function countWords(text: string): number {
  if (!text) return 0;
  
  // 移除HTML标签
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // 优化正则表达式，同时匹配中文字符和英文单词
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (plainText.match(/\b[a-zA-Z]+\b/g) || []).length;
  
  return chineseChars + englishWords;
}

// 生成静态路径的通用函数
export async function generateStaticPaths(collection: 'articles' | 'notes') {
  const entries = await getCollection(collection);
  
  // 使用已优化的泛型排序函数，保持代码一致性和可维护性
  const sortedEntries = [...sortEntriesByDate(entries)].reverse();
  
  return sortedEntries.map((entry, index) => {
    const prev = index > 0 ? sortedEntries[index - 1].data.permalink : null;
    const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1].data.permalink : null;
    
    return {
      params: { permalink: entry.data.permalink.replace(/^\//, '').replace(/\/$/, '') },
      props: { 
        entry,
        prev,
        next
      },
    };
  });
}