#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.join(process.cwd(), 'src/content');
const outputPath = path.join(process.cwd(), 'public/data.json');
const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');

const SUPPORTED_LANGS = ['zh', 'en', 'ja', 'ko', 'ru'];
const DEFAULT_LANG = 'zh';

let siteUrl = '';
try {
  const configContent = fs.readFileSync(astroConfigPath, 'utf8');
  const siteMatch = configContent.match(/site:\s*["']([^"']+)["']/);
  if (siteMatch && siteMatch[1]) {
    siteUrl = siteMatch[1].replace(/\/$/, '');
  }
} catch (error) {
  console.warn('读取astro.config.mjs文件失败:', error.message);
}

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content: fileContent };
  }
  
  const frontmatterText = match[1];
  const content = match[2];
  const data = {};
  
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
        } catch (e) {
          const arrayContent = valuePart.slice(1, -1).trim();
          data[currentKey] = arrayContent
            ? arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''))
            : [];
        }
      } else if (valuePart.toLowerCase() === 'true') {
        data[currentKey] = true;
      } else if (valuePart.toLowerCase() === 'false') {
        data[currentKey] = false;
      } else if (!isNaN(valuePart) && valuePart !== '') {
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

function showProgress(current, total, status = '') {
  if (total === 0) return;
  const barLength = 30;
  const progress = Math.floor((current / total) * barLength);
  const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${status} [${bar}] ${percentage}% (${current}/${total})`);
}

function countMarkdownFiles(dir) {
  let count = 0;
  function countInDir(dir) {
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

function getPathInfo(filePath) {
  // 新结构: 
  // 默认语言: src/content/theme.md -> topic: theme, lang: zh, id: theme
  // 其他语言: src/content/en/theme.md -> topic: theme, lang: en, id: en/theme
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

function processContent(contentDir, index, progress) {
  if (!fs.existsSync(contentDir)) {
    console.log(`⚠️  ${contentDir} 目录不存在，跳过处理`);
    return;
  }
  
  function processRecursive(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        processRecursive(itemPath);
      } else if (path.extname(item).toLowerCase() === '.md') {
        try {
          const fileContent = fs.readFileSync(itemPath, 'utf8');
          const { data, content } = parseFrontmatter(fileContent);
          
          let coverPath = data.cover || '/defaultCover.jpg';
          if (coverPath && !coverPath.startsWith('http') && siteUrl) {
            coverPath = siteUrl + coverPath;
          }
          
          const { topic, lang, id } = getPathInfo(itemPath);
          
          let route;
          if (lang === DEFAULT_LANG) {
            route = `/${topic}`;
          } else {
            route = `/${lang}/${topic}`;
          }
          
          index.push({
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
          });
          
          progress.processed++;
          showProgress(progress.processed, progress.total, '📄 正在处理内容');
        } catch (error) {
          console.error(`处理文件 ${itemPath} 失败:`, error.message);
        }
      }
    }
  }
  
  processRecursive(contentDir);
  console.log(`\n✅ 处理完成 ${contentDir} 目录`);
}

export function generateIndex() {
  const index = [];
  const totalFiles = countMarkdownFiles(contentDir);
  
  if (totalFiles === 0) {
    console.log('未找到 markdown 文件');
    return;
  }
  
  const progress = { processed: 0, total: totalFiles };
  
  processContent(contentDir, index, progress);
  
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`📝 索引生成成功: ${outputPath}`);
}

if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  console.log('🔍 开始生成索引文件...');
  generateIndex();
  console.log('🎉 索引文件生成完成');
}

export default function autoIndex() {
  return {
    name: 'auto-index',
    hooks: {
      'astro:config:setup': async () => {
        console.log('✨ 自动生成索引文件...');
        try {
          generateIndex();
          console.log('🎉 索引文件生成完成');
        } catch (error) {
          console.error(`❌ 生成索引文件失败: ${error.message}`);
          throw error;
        }
      },
    },
  };
}
