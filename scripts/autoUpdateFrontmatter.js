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

function updateFrontmatter(filePath) {
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

function processDirectoryWithProgress(dir, totalFiles, progress) {
  let updatedCount = 0;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      updatedCount += processDirectoryWithProgress(itemPath, totalFiles, progress);
    } else if (path.extname(item).toLowerCase() === '.md') {
      const updated = updateFrontmatter(itemPath);
      if (updated) {
        updatedCount++;
      }
      progress.processed++;
      showProgress(progress.processed, totalFiles, '📄 正在处理内容');
    }
  }
  return updatedCount;
}

function processDirectory(directory) {
  try {
    if (!fs.existsSync(directory)) {
      return 0;
    }
    
    const totalFiles = countMarkdownFiles(directory);
    if (totalFiles === 0) {
      return 0;
    }
    
    const progress = { processed: 0 };
    const updatedCount = processDirectoryWithProgress(directory, totalFiles, progress);
    process.stdout.write('\n');
    return updatedCount;
    
  } catch (error) {
    console.error(`❌ 处理目录时出错 ${directory}:`, error.message);
    return 0;
  }
}

function main() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  
  console.log('🔍 开始检查和更新frontmatter...\n');
  
  const updatedCount = processDirectory(contentDir);
  
  console.log(`✅ 共更新了 ${updatedCount} 个文件`);
  
  if (updatedCount > 0) {
    console.log('\n🔄 注意：已更新frontmatter文件。请重新启动开发服务器以应用更改。');
  }
}

if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main();
}

export default function autoUpdateFrontmatter() {
  return {
    name: 'auto-update-frontmatter',
    hooks: {
      'astro:config:setup': async () => {
        console.log('✨ 自动更新frontmatter...');
        try {
          main();
          console.log('🎉 frontmatter更新完成');
        } catch (error) {
          console.error(`❌ 更新frontmatter失败: ${error.message}`);
          throw error;
        }
      },
    },
  };
}
