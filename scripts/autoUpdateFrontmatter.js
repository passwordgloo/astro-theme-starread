#!/usr/bin/env node

// 显示 ASCII 艺术字标题
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
import { execSync } from 'child_process';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// 为了支持作为 Astro 插件使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 进度条工具函数
function showProgress(current, total, status = '') {
  const barLength = 30;
  const progress = Math.floor((current / total) * barLength);
  const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${status} [${bar}] ${percentage}% (${current}/${total})`);
}

// 生成16进制随机字符串
function generateHexString(length = 6) {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成永久链接
function generatePermalink(collection, slug, filePath) {
  // 对于notes目录，如果是文件夹下的文件，使用文件夹名称作为前缀，不包含notes
  if (collection === 'notes' && filePath) {
    const pathParts = filePath.split(path.sep);
    // 查找notes目录在路径中的位置
    const notesIndex = pathParts.indexOf('notes');
    if (notesIndex !== -1 && notesIndex < pathParts.length - 2) {
      // 如果文件在notes的子文件夹中，使用子文件夹名称，不包含notes前缀
      const folderName = pathParts[notesIndex + 1];
      const hexString = generateHexString(6);
      return `/${folderName}/${hexString}/`;
    }
  }
  // 生成标准的永久链接
  const hexString = generateHexString(6);
  return `/${collection}/${hexString}/`;
}

// 获取当前日期字符串，格式为 YYYY-MM-DD HH:mm:ss
function getCurrentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 解析frontmatter并更新
function updateFrontmatter(filePath, collection, fullPath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // 查找frontmatter边界
    let frontmatterStart = -1;
    let frontmatterEnd = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '---' && frontmatterStart === -1) {
        frontmatterStart = i;
      } else if (lines[i].trim() === '---' && frontmatterStart !== -1 && i > frontmatterStart) {
        frontmatterEnd = i;
        break;
      }
    }
    
    if (frontmatterStart === -1 || frontmatterEnd === -1) {
      console.log(`未找到frontmatter: ${filePath}`);
      return false;
    }
    
    // 提取frontmatter内容
    const frontmatterLines = lines.slice(frontmatterStart + 1, frontmatterEnd);
    const frontmatterContent = frontmatterLines.join('\n');
    
    // 检查是否已包含permalink和date
    let hasPermalink = false;
    let hasDate = false;
    let slug = path.basename(filePath, path.extname(filePath));
    
    for (const line of frontmatterLines) {
      if (line.trim().startsWith('permalink:')) {
        hasPermalink = true;
      }
      if (line.trim().startsWith('date:')) {
        hasDate = true;
      }
      if (line.trim().startsWith('slug:')) {
        slug = line.trim().split(':')[1].trim().replace(/['"]/g, '');
      }
    }
    
    // 如果都已存在，不需要更新
    if (hasPermalink && hasDate) {
      return false;
    }
    
    // 更新frontmatter
    const updatedFrontmatterLines = [...frontmatterLines];
    
    if (!hasPermalink) {
      updatedFrontmatterLines.push(`permalink: ${generatePermalink(collection, slug, fullPath)}`);
    }
    
    if (!hasDate) {
      updatedFrontmatterLines.push(`date: ${getCurrentDate()}`);
    }
    
    // 重建文件内容
    const updatedLines = [
      ...lines.slice(0, frontmatterStart + 1),
      ...updatedFrontmatterLines,
      ...lines.slice(frontmatterEnd)
    ];
    
    const updatedContent = updatedLines.join('\n');
    
    // 保存文件
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`已更新frontmatter: ${filePath}`);
    return true;
    
  } catch (error) {
    console.error(`处理文件时出错 ${filePath}:`, error);
    return false;
  }
}

// 处理目录中的所有markdown文件
function processDirectory(directory, collection) {
  try {
    const files = fs.readdirSync(directory);
    let updatedCount = 0;
    let totalFiles = 0;
    let processed = 0;
    
    // 先统计总文件数
    function countFiles(dir) {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
          countFiles(itemPath);
        } else if (path.extname(item).toLowerCase() === '.md') {
          totalFiles++;
        }
      }
    }
    countFiles(directory);
    
    // 处理文件并显示进度
    function processWithProgress(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          // 递归处理子目录
          processWithProgress(itemPath);
        } else if (path.extname(item).toLowerCase() === '.md') {
          // 处理markdown文件
          const updated = updateFrontmatter(itemPath, collection, itemPath);
          if (updated) {
            updatedCount++;
          }
          processed++;
          
          // 显示进度条
          const status = collection === 'articles' ? '📝 正在处理文章' : '📋 正在处理笔记';
          showProgress(processed, totalFiles, status);
        }
      }
    }
    
    if (totalFiles > 0) {
      processWithProgress(directory);
      process.stdout.write('\n'); // 换行
    }
    
    return updatedCount;
    
  } catch (error) {
    console.error(`❌ 处理目录时出错 ${directory}:`, error);
    return 0;
  }
}

// 主函数
function main() {
  const contentDir = path.join(process.cwd(), 'src', 'content');
  const articlesDir = path.join(contentDir, 'articles');
  const notesDir = path.join(contentDir, 'notes');
  
  console.log('🔍 开始检查和更新frontmatter...');
  console.log('');
  
  let totalUpdated = 0;
  
  // 处理articles目录
  if (fs.existsSync(articlesDir)) {
    console.log('📝 处理articles目录...');
    const articlesUpdated = processDirectory(articlesDir, 'articles');
    totalUpdated += articlesUpdated;
    console.log(`✅ articles目录更新了 ${articlesUpdated} 个文件`);
  }
  
  // 处理notes目录
  if (fs.existsSync(notesDir)) {
    console.log('📋 处理notes目录...');
    const notesUpdated = processDirectory(notesDir, 'notes');
    totalUpdated += notesUpdated;
    console.log(`✅ notes目录更新了 ${notesUpdated} 个文件`);
  }
  
  console.log(`\n📊 总计更新了 ${totalUpdated} 个文件`);
  
  // 如果有文件更新，提示重新启动开发服务器
  if (totalUpdated > 0) {
    console.log('');
    console.log('🔄 注意：已更新frontmatter文件。请重新启动开发服务器以应用更改。');
    console.log('🚀 开始构建项目...');
  }
}

// 执行主函数
// 如果作为脚本直接运行，则执行 main 函数
if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  main();
}

// 导出作为 Astro 插件使用的功能
export default function autoUpdatePermalink() {
  return {
    name: 'auto-update-permalink',
    hooks: {
      'astro:config:setup': async () => {
        console.log('✨ 自动更新永久链接...');
        
        // 直接调用 main 函数而不是通过 exec
        try {
          main();
          console.log('🎉 永久链接更新完成');
        } catch (error) {
          console.error(`❌ 更新永久链接失败: ${error}`);
          throw error;
        }
      },
    },
  };
}