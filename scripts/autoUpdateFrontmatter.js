#!/usr/bin/env node

console.log(`
███████╗████████╗ █████╗  ██████╗      ██████╗ ███████╗ █████╗ ██████╗ 
██╔════╝╚══██╔══╝██╔══██╗ ██╔══██╗     ██╔══██╗██╔════╝██╔══██╗██╔══██╗ 
███████╗   ██║   ███████║ ██████╔╝     ██████╔╝█████╗  ███████║██║  ██║
╚════██║   ██║   ██╔══██║ ██╔══██╗     ██╔══██╗██╔══╝  ██╔══██║██║  ██║
███████║   ██║   ██║  ██║ ██║  ██║     ██║  ██║███████╗██║  ██║██████╔╝    
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═╝  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝
`);

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function showProgress(current, total, status = '') {
  if (total === 0) return;
  const barLength = 30;
  const progress = Math.floor((current / total) * barLength);
  const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${status} [${bar}] ${percentage}% (${current}/${total})`);
}

function generateHexString(length = 6) {
  const safeLength = Math.max(2, Math.min(32, length));
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < safeLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generatePermalink(collection, slug, filePath) {
  if (collection === 'notes' && filePath) {
    const pathParts = filePath.split(path.sep);
    const notesIndex = pathParts.indexOf('notes');
    if (notesIndex !== -1 && notesIndex < pathParts.length - 2) {
      const folderName = pathParts[notesIndex + 1];
      return `/${folderName}/${generateHexString(6)}/`;
    }
  }
  return `/${collection}/${generateHexString(6)}/`;
}

function getCurrentDate() {
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

function updateFrontmatter(filePath, collection, fullPath) {
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
    let hasPermalink = false;
    let hasDate = false;
    let slug = path.basename(filePath, path.extname(filePath));
    
    for (const line of frontmatterLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('permalink:')) {
        hasPermalink = true;
      } else if (trimmed.startsWith('date:')) {
        hasDate = true;
      } else if (trimmed.startsWith('slug:')) {
        slug = trimmed.split(':')[1].trim().replace(/['"]/g, '');
      }
    }
    
    if (hasPermalink && hasDate) {
      return false;
    }
    
    const updatedFrontmatterLines = [...frontmatterLines];
    
    if (!hasPermalink) {
      updatedFrontmatterLines.push(`permalink: ${generatePermalink(collection, slug, fullPath)}`);
    }
    
    if (!hasDate) {
      updatedFrontmatterLines.push(`date: ${getCurrentDate()}`);
    }
    
    const updatedLines = [
      ...lines.slice(0, frontmatterStart + 1),
      ...updatedFrontmatterLines,
      ...lines.slice(frontmatterEnd)
    ];
    
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');
    console.log(`已更新frontmatter: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`处理文件时出错 ${filePath}:`, error.message);
    return false;
  }
}

function countMarkdownFiles(dir) {
  let count = 0;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      count += countMarkdownFiles(itemPath);
    } else if (path.extname(item).toLowerCase() === '.md') {
      count++;
    }
  }
  return count;
}

function processDirectoryWithProgress(dir, collection, totalFiles, progress) {
  let updatedCount = 0;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      updatedCount += processDirectoryWithProgress(itemPath, collection, totalFiles, progress);
    } else if (path.extname(item).toLowerCase() === '.md') {
      const updated = updateFrontmatter(itemPath, collection, itemPath);
      if (updated) {
        updatedCount++;
      }
      progress.processed++;
      const status = collection === 'articles' ? '📝 正在处理文章' : '📋 正在处理笔记';
      showProgress(progress.processed, totalFiles, status);
    }
  }
  return updatedCount;
}

function processDirectory(directory, collection) {
  try {
    if (!fs.existsSync(directory)) {
      return 0;
    }
    
    const totalFiles = countMarkdownFiles(directory);
    if (totalFiles === 0) {
      return 0;
    }
    
    const progress = { processed: 0 };
    const updatedCount = processDirectoryWithProgress(directory, collection, totalFiles, progress);
    process.stdout.write('\n');
    return updatedCount;
    
  } catch (error) {
    console.error(`❌ 处理目录时出错 ${directory}:`, error.message);
    return 0;
  }
}

function main() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const articlesDir = path.join(contentDir, 'articles');
  const notesDir = path.join(contentDir, 'notes');
  
  console.log('🔍 开始检查和更新frontmatter...\n');
  
  let totalUpdated = 0;
  
  if (fs.existsSync(articlesDir)) {
    console.log('📝 处理articles目录...');
    const articlesUpdated = processDirectory(articlesDir, 'articles');
    totalUpdated += articlesUpdated;
    console.log(`✅ articles目录更新了 ${articlesUpdated} 个文件\n`);
  }
  
  if (fs.existsSync(notesDir)) {
    console.log('📋 处理notes目录...');
    const notesUpdated = processDirectory(notesDir, 'notes');
    totalUpdated += notesUpdated;
    console.log(`✅ notes目录更新了 ${notesUpdated} 个文件\n`);
  }
  
  console.log(`📊 总计更新了 ${totalUpdated} 个文件`);
  
  if (totalUpdated > 0) {
    console.log('\n🔄 注意：已更新frontmatter文件。请重新启动开发服务器以应用更改。');
  }
}

if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main();
}

export default function autoUpdatePermalink() {
  return {
    name: 'auto-update-permalink',
    hooks: {
      'astro:config:setup': async () => {
        console.log('✨ 自动更新永久链接...');
        try {
          main();
          console.log('🎉 永久链接更新完成');
        } catch (error) {
          console.error(`❌ 更新永久链接失败: ${error.message}`);
          throw error;
        }
      },
    },
  };
}