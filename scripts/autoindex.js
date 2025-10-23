#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// 为了支持作为 Astro 插件使用
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const articlesDir = path.join(process.cwd(), 'src/content/articles');
const notesDir = path.join(process.cwd(), 'src/content/notes');
const outputPath = path.join(process.cwd(), 'public/data.json');
const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');

// 读取并解析astro.config.mjs文件获取site配置
let siteUrl = '';
try {
  const configContent = fs.readFileSync(astroConfigPath, 'utf8');
  const siteMatch = configContent.match(/site:\s*["']([^"']+)["']/);
  if (siteMatch && siteMatch[1]) {
    siteUrl = siteMatch[1].replace(/\/$/, ''); // 移除末尾的斜杠
  }
} catch (error) {
  console.error('读取astro.config.mjs文件失败:', error);
}

// 进度条工具函数
function showProgress(current, total, status = '') {
  const barLength = 30;
  const progress = Math.floor((current / total) * barLength);
  const bar = '█'.repeat(progress) + '░'.repeat(barLength - progress);
  const percentage = Math.floor((current / total) * 100);
  process.stdout.write(`\r${status} [${bar}] ${percentage}% (${current}/${total})`);
}

// ===== 生成索引函数 =====
export function generateIndex() {
  const index = [];
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
  
  if (fs.existsSync(articlesDir)) {
    countFiles(articlesDir);
  }
  if (fs.existsSync(notesDir)) {
    countFiles(notesDir);
  }

  // 处理文章目录
  processDirectory(articlesDir, 'articles');
  
  // 处理笔记目录
  processDirectory(notesDir, 'notes');
  
  if (processed > 0) {
    process.stdout.write('\n'); // 换行
  }
  
  // 写入 JSON 文件
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`📝 索引生成成功: ${outputPath}`);
  
  // 处理单个目录的函数
  function processDirectory(dir, collection) {
    try {
      // 检查目录是否存在
      if (!fs.existsSync(dir)) {
        console.log(`⚠️  ${dir} 目录不存在，跳过处理`);
        return;
      }
      
      function processWithProgress(currentDir) {
        const items = fs.readdirSync(currentDir);
        
        for (const item of items) {
          const itemPath = path.join(currentDir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            // 递归处理子目录
            processWithProgress(itemPath);
          } else if (path.extname(item).toLowerCase() === '.md') {
            const fileContent = fs.readFileSync(itemPath, 'utf8');
            
            // 解析 frontmatter
            const { data, content } = matter(fileContent);
            
            // 处理cover路径，添加siteUrl前缀
            let coverPath = data.cover || '/defaultCover.jpg';
            if (coverPath && !coverPath.startsWith('http') && siteUrl) {
              coverPath = siteUrl + coverPath;
            }
            
            // 确定URL - 优先使用永久链接
            let url = data.permalink;
            if (!url && siteUrl) {
              // 对于notes目录，检查是否在子文件夹中
              if (collection === 'notes') {
                const relativePath = path.relative(notesDir, itemPath);
                const pathParts = relativePath.split(path.sep);
                if (pathParts.length > 1) {
                  // 如果文件在子文件夹中，使用子文件夹名称
                  const folderName = pathParts[0];
                  url = `${siteUrl}/notes/${folderName}/${path.basename(item, '.md')}/`;
                } else {
                  url = `${siteUrl}/notes/${path.basename(item, '.md')}/`;
                }
              } else {
                url = `${siteUrl}/${collection}/${path.basename(item, '.md')}/`;
              }
            }
            
            index.push({
              title: data.title || 'Untitled',
              description: data.description || '',
              cover: coverPath,
              categories: Array.isArray(data.categories)
                ? data.categories
                : data.categories
                ? [data.categories]
                : [],
              tags: Array.isArray(data.tags)
                ? data.tags
                : data.tags
                ? [data.tags]
                : [],
              date: data.date || '',
              content: content.trim(),
              slug: `${collection}/${path.basename(item, '.md')}`,
              url: url,
              permalink: data.permalink,
              collection: collection
            });
            
            processed++;
            
            // 显示进度条
            const status = collection === 'articles' ? '📝 正在处理文章' : '📋 正在处理笔记';
            showProgress(processed, totalFiles, status);
          }
        }
      }
      
      processWithProgress(dir);
      console.log(`✅ 处理完成 ${dir} 目录`);
    } catch (error) {
      console.error(`❌ 处理 ${dir} 目录失败:`, error);
    }
  }
}

// ===== 如果直接执行 autoindex.js，则运行 generateIndex() =====
if (import.meta.url === new URL(process.argv[1], import.meta.url).href) {
  console.log('🔍 开始生成索引文件...');
  generateIndex();
  console.log('🎉 索引文件生成完成');
}

// 导出作为 Astro 插件使用的功能
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
          console.error(`❌ 生成索引文件失败: ${error}`);
          throw error;
        }
      },
    },
  };
}
