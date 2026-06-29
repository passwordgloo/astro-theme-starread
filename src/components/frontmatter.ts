import { getCollection } from 'astro:content';
import { themeConfig } from '../../starread.config';

interface Author {
  name?: string;
  avatar?: string;
}

export interface EntryData {
  title: string;
  date?: string | Date;
  cover?: string;
  author?: Author;
  categories?: string[];
  tags?: string[];
  views?: number;
  id?: string;
  lang?: string;
  description?: string;
}

interface ProcessedAuthor {
  name: string;
  avatar: string;
}

export interface ProcessedEntry {
  data: EntryData;
  body: string;
  _collection: string;
  id: string;
  processed?: {
    date: string;
    cover: string;
    author: ProcessedAuthor;
    categories: string[];
    category: string;
    tags: string[];
    views: number;
    id: string;
  };
}

export interface AdjacentEntry {
  title: string;
  cover: string;
  date: string;
  id: string;
}

export async function getAdjacentEntries(currentId: string, collection: 'docs'): Promise<{ prev: AdjacentEntry | null; next: AdjacentEntry | null }> {
  try {
    const entries = await getCollection(collection);
    const sortedEntries = sortEntriesByDate(entries);
    
    const currentIndex = sortedEntries.findIndex(entry => entry.id === currentId);
    
    if (currentIndex === -1) {
      return { prev: null, next: null };
    }
    
    const prev = currentIndex < sortedEntries.length - 1 ? sortedEntries[currentIndex + 1] : null;
    const next = currentIndex > 0 ? sortedEntries[currentIndex - 1] : null;
    
    const formatAdjacentEntry = (entry: typeof sortedEntries[0] | null): AdjacentEntry | null => {
      if (!entry?.id) return null;
      return {
        title: entry.data.title || 'Untitled',
        cover: getCoverImage(entry.data.cover),
        date: formatDate(entry.data.date),
        id: entry.id
      };
    };
    
    return {
      prev: formatAdjacentEntry(prev),
      next: formatAdjacentEntry(next)
    };
  } catch (error) {
    console.error('获取相邻文章时出错:', error);
    return { prev: null, next: null };
  }
}

export function generateHexString(length: number = 6): string {
  const safeLength = Math.max(2, Math.min(32, length));
  try {
    const array = new Uint8Array(Math.ceil(safeLength / 2));
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, safeLength);
  } catch {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < safeLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export function formatDate(dateString?: string | Date): string {
  if (typeof dateString === 'string' && dateString.includes(' ')) {
    return dateString;
  }

  let date: Date;
  if (!dateString) {
    date = new Date();
  } else if (dateString instanceof Date) {
    date = dateString;
  } else {
    date = new Date(dateString);
  }
  
  if (isNaN(date.getTime())) {
    return typeof dateString === 'string' ? dateString : '';
  }

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

export function getCoverImage(cover?: string): string {
  return cover || themeConfig.site.defaultCover || '/defaultCover.jpg';
}

export function getAuthorInfo(author?: Author): ProcessedAuthor {
  return {
    name: author?.name || themeConfig.widget.author.name || 'Anonymous',
    avatar: author?.avatar || themeConfig.widget.author.avatar || '/defaultAvatar.jpg'
  };
}

export function sortEntriesByDate<T extends { data: { date?: string | Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const getTime = (d?: string | Date) => {
      if (!d) return 0;
      const time = new Date(d).getTime();
      return isNaN(time) ? 0 : time;
    };
    return getTime(b.data.date) - getTime(a.data.date);
  });
}

export function processEntryData(entries: Array<{ data: EntryData; body: string; _collection: string; id: string }>, collection: string): ProcessedEntry[] {
  return entries.map(entry => ({
    ...entry,
    processed: {
      date: formatDate(entry.data.date),
      cover: getCoverImage(entry.data.cover),
      author: getAuthorInfo(entry.data.author),
      categories: Array.isArray(entry.data.categories) ? entry.data.categories : [],
      category: entry.data.categories?.[0] || '未分类',
      tags: Array.isArray(entry.data.tags) ? entry.data.tags : [],
      views: typeof entry.data.views === 'number' ? entry.data.views : 0,
      id: entry.id
    }
  }));
}

export function countWords(text: string): number {
  if (!text) return 0;
  const plainText = text.replace(/<[^>]*>/g, '');
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (plainText.match(/\b[a-zA-Z]+\b/g) || []).length;
  return chineseChars + englishWords;
}

export async function generateStaticPaths(collection: 'docs') {
  try {
    const entries = await getCollection(collection);
    const sortedEntries = [...sortEntriesByDate(entries)].reverse();
    
    return sortedEntries.map((entry, index) => {
      const prev = index > 0 ? sortedEntries[index - 1].id : null;
      const next = index < sortedEntries.length - 1 ? sortedEntries[index + 1].id : null;
      const id = entry.id;
      
      return {
        params: { id: id.replace(/^\//, '').replace(/\/$/, '') },
        props: { 
          entry,
          prev,
          next
        },
      };
    });
  } catch (error) {
    console.error('生成静态路径时出错:', error);
    return [];
  }
}
