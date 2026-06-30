import { themeConfig } from '../../starread.config';

const supportedLangs = themeConfig.i18n?.languages?.map(l => l.code) || ['zh', 'en', 'ja', 'ko', 'ru'];
const defaultLang = themeConfig.i18n?.defaultLang || 'zh';

export function getLangFromUrl(url: string): string {
  const path = url.replace(/^\/|\/$/g, '');
  const firstSegment = path.split('/')[0];
  
  if (supportedLangs.includes(firstSegment)) {
    return firstSegment;
  }
  
  return defaultLang;
}

export function getPathWithoutLang(url: string): string {
  const path = url.replace(/^\/|\/$/g, '');
  const segments = path.split('/');
  
  if (supportedLangs.includes(segments[0])) {
    return '/' + segments.slice(1).join('/');
  }
  
  return '/' + path;
}

export function switchLangPath(url: string, targetLang: string): string {
  if (targetLang === defaultLang) {
    return getPathWithoutLang(url);
  }
  
  const basePath = getPathWithoutLang(url);
  return `/${targetLang}${basePath}`;
}

export function getCurrentLocale(lang: string) {
  const localeKey = lang === defaultLang ? '/' : `/${lang}/`;
  return themeConfig.locales?.[localeKey] || {};
}

export function useTranslations(lang: string) {
  const locale = getCurrentLocale(lang);
  
  return {
    site: {
      title: locale.site?.title || themeConfig.site.title,
      footer: {
        text: locale.site?.footer?.text || themeConfig.site.footer.text,
      },
    },
    widget: {
      author: {
        name: locale.widget?.author?.name || themeConfig.widget.author.name,
        description: locale.widget?.author?.description || themeConfig.widget.author.description,
      },
      ad: {
        title: locale.widget?.ad?.title || themeConfig.widget.ad.title,
        description: locale.widget?.ad?.description || themeConfig.widget.ad.description,
        buttonText: locale.widget?.ad?.buttonText || themeConfig.widget.ad.buttonText,
      },
      categories: locale.widget?.categories || themeConfig.widget.categories,
      carousel: {
        title: locale.widget?.carousel?.title || themeConfig.widget.carousel.title,
      },
      banner: {
        title: locale.widget?.banner?.title || themeConfig.widget.banner.title,
        tags: locale.widget?.banner?.tags || themeConfig.widget.banner.tags,
      },
    },
    navbar: locale.navbar || themeConfig.navbar,
    sidebar: {
      progress: locale.sidebar?.progress || '字数统计',
      author: locale.sidebar?.author || '作者',
      ad: locale.sidebar?.ad || '广告',
      tagcloud: locale.sidebar?.tagcloud || '标签云',
      statistic: locale.sidebar?.statistic || '站点统计',
      toc: locale.sidebar?.toc || '文章目录',
    },
    search: {
      placeholder: locale.search?.placeholder || '搜索文档 (⌘K)',
      noResults: locale.search?.noResults || '没有找到与 "{query}" 相关的内容，请尝试其他关键词',
      loading: locale.search?.loading || '正在搜索...',
      initialTip: locale.search?.initialTip || '支持使用键盘进行导航，Windows用户请用Ctrl 替换 ⌘',
      clear: locale.search?.clear || '清除搜索',
      viewDetails: locale.search?.viewDetails || '查看详情',
      shortcuts: {
        open: locale.search?.shortcuts?.open || '打开搜索',
        browse: locale.search?.shortcuts?.browse || '浏览',
        select: locale.search?.shortcuts?.select || '选择',
        close: locale.search?.shortcuts?.close || '关闭',
      },
    },
    selectText: locale.selectText || '选择语言',
    label: locale.label || '简体中文',
  };
}

export interface WidgetConfig {
  [key: string]: boolean;
}

export type LoadedWidget = {
  key: string;
  component: any;
};

import fs from 'fs';
import path from 'path';
import type { IndexEntry, PathInfo } from '../../scripts/type/frontmatter';

const SUPPORTED_LANGS = ['zh', 'en', 'ja', 'ko', 'ru'];
const DEFAULT_LANG = 'zh';

export function parseFrontmatter(fileContent: string): { data: Record<string, any>; content: string } {
  const normalizedContent = fileContent.replace(/\r\n/g, '\n');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = normalizedContent.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: fileContent };
  }
  
  const frontmatterText = match[1];
  const content = match[2];
  const data: Record<string, any> = {};
  
  const lines = frontmatterText.split('\n');
  let currentKey = '';
  let currentValue = '';
  let inMultiline = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    if (inMultiline) {
      if (trimmedLine.startsWith('-') || trimmedLine.includes(':')) {
        if (currentKey) {
          data[currentKey] = currentValue.trim();
        }
        currentKey = '';
        currentValue = '';
        inMultiline = false;
      } else {
        currentValue += '\n' + line;
        continue;
      }
    }
    
    if (trimmedLine.startsWith('- ')) {
      const arrayItem = trimmedLine.substring(2).trim();
      if (currentKey) {
        if (Array.isArray(data[currentKey])) {
          data[currentKey].push(arrayItem);
        } else {
          data[currentKey] = [data[currentKey], arrayItem];
        }
      }
      continue;
    }
    
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex !== -1) {
      currentKey = trimmedLine.substring(0, colonIndex).trim();
      const valuePart = trimmedLine.substring(colonIndex + 1).trim();
      
      if (valuePart === '|' || valuePart === '>') {
        inMultiline = true;
        currentValue = '';
      } else if (valuePart.startsWith('[')) {
        try {
          data[currentKey] = JSON.parse(valuePart.replace(/'/g, '"'));
        } catch {
          const arrayContent = valuePart.slice(1, -1).trim();
          data[currentKey] = arrayContent
            ? arrayContent.split(',').map((item: string) => item.trim().replace(/['"]/g, ''))
            : [];
        }
      } else if (valuePart.toLowerCase() === 'true') {
        data[currentKey] = true;
      } else if (valuePart.toLowerCase() === 'false') {
        data[currentKey] = false;
      } else if (!isNaN(Number(valuePart)) && valuePart !== '') {
        data[currentKey] = Number(valuePart);
      } else if (
        (valuePart.startsWith('"') && valuePart.endsWith('"')) ||
        (valuePart.startsWith("'") && valuePart.endsWith("'"))
      ) {
        data[currentKey] = valuePart.substring(1, valuePart.length - 1);
      } else {
        data[currentKey] = valuePart;
      }
    }
  }
  
  if (inMultiline && currentKey) {
    data[currentKey] = currentValue.trim();
  }
  
  return { data, content };
}

export function getPathInfo(filePath: string): PathInfo {
  const pathParts = filePath.split(path.sep);
  const contentIndex = pathParts.indexOf('content');
  
  if (contentIndex === -1) {
    return { topic: '', lang: DEFAULT_LANG, id: '' };
  }
  
  const fileName = path.basename(filePath);
  const fileBase = fileName.replace(/\.(md|mdx)$/, '');
  
  const nextPart = pathParts[contentIndex + 1];
  
  if (SUPPORTED_LANGS.includes(nextPart)) {
    const lang = nextPart;
    const remainingParts = pathParts.slice(contentIndex + 2);
    const topic = remainingParts.join('/').replace(/\.(md|mdx)$/, '');
    const id = `${lang}/${topic}`;
    return { topic, lang, id };
  } else {
    const topic = pathParts.slice(contentIndex + 1).join('/').replace(/\.(md|mdx)$/, '');
    return { topic, lang: DEFAULT_LANG, id: topic };
  }
}

export function getCurrentDate(): string {
  const date = new Date();
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

export function showProgress(current: number, total: number, status: string = ''): void {
  if (total === 0) return;
  const barLength = 30;
  const progress = Math.floor((current / total) * barLength);
  const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${status} [${bar}] ${percentage}% (${current}/${total})`);
}

export function countMarkdownFiles(dir: string): number {
  let count = 0;
  function countInDir(dir: string): void {
    if (!fs.existsSync(dir)) return;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      if (stats.isDirectory()) {
        countInDir(itemPath);
      } else if (path.extname(item).toLowerCase() === '.md') {
        count++;
      }
    }
  }
  countInDir(dir);
  return count;
}

export function generateIndexEntry(
  filePath: string, 
  siteUrl: string = ''
): IndexEntry | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = parseFrontmatter(fileContent);
    
    let coverPath = data.cover || '/defaultCover.jpg';
    if (coverPath && !coverPath.startsWith('http') && siteUrl) {
      coverPath = siteUrl + coverPath;
    }
    
    const { topic, lang, id } = getPathInfo(filePath);
    
    let route: string;
    if (lang === DEFAULT_LANG) {
      route = `/${topic}`;
    } else {
      route = `/${lang}/${topic}`;
    }
    
    return {
      title: data.title || 'Untitled',
      description: data.description || '',
      cover: coverPath,
      categories: Array.isArray(data.categories) ? data.categories : (data.categories ? [data.categories] : []),
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      date: data.date || '',
      content: content.trim(),
      id: id,
      topic: topic,
      lang: lang,
      route: route
    };
  } catch {
    return null;
  }
}

export function updateFrontmatter(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let frontmatterStart = -1;
    let frontmatterEnd = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        if (frontmatterStart === -1) {
          frontmatterStart = i;
        } else if (i > frontmatterStart) {
          frontmatterEnd = i;
          break;
        }
      }
    }
    
    if (frontmatterStart === -1 || frontmatterEnd === -1) {
      return false;
    }
    
    const frontmatterLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
    let hasDate = false;
    
    for (const line of frontmatterLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('date:')) {
        hasDate = true;
        break;
      }
    }
    
    if (hasDate) {
      return false;
    }
    
    const updatedFrontmatterLines = [...frontmatterLines];
    updatedFrontmatterLines.push(`date: ${getCurrentDate()}`);
    
    const updatedLines = [
      ...lines.slice(0, frontmatterStart + 1),
      ...updatedFrontmatterLines,
      ...lines.slice(frontmatterEnd)
    ];
    
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
    return true;
    
  } catch {
    return false;
  }
}
