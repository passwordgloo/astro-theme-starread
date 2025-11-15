#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
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

// 原生解析 frontmatter 的函数
function parseFrontmatter(fileContent) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);
  
  if (match) {
    const frontmatterText = match[1];
    const content = match[2];
    const data = {};
    
    // 简单的 YAML 解析，支持基本的键值对
    const lines = frontmatterText.split('\n');
    let currentKey = '';
    let currentValue = '';
    let inMultiline = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 跳过空行和注释
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      // 检查多行值（使用 | 或 >）
      if (inMultiline) {
        if (trimmedLine.startsWith('-') || trimmedLine.includes(':')) {
          // 新的键值对开始，保存当前值
          data[currentKey] = currentValue.trim();
          currentKey = '';
          currentValue = '';
          inMultiline = false;
        } else {
          // 继续添加到多行值
          currentValue += '\n' + line;
          continue;
        }
      }
      
      // 检查数组
      if (trimmedLine.startsWith('- ')) {
        const arrayItem = trimmedLine.substring(2).trim();
        if (Array.isArray(data[currentKey])) {
          data[currentKey].push(arrayItem);
        } else if (currentKey) {
          data[currentKey] = [data[currentKey], arrayItem];
        }
        continue;
      }
      
      // 检查键值对
      const colonIndex = trimmedLine.indexOf(':');
      if (colonIndex !== -1) {
        currentKey = trimmedLine.substring(0, colonIndex).trim();
        const valuePart = trimmedLine.substring(colonIndex + 1).trim();
        
        // 检查多行值标记
        if (valuePart === '|' || valuePart === '>') {
          inMultiline = true;
          currentValue = '';
        } 
        // 检查数组
        else if (valuePart.startsWith('[')) {
          // 简单的数组解析，处理 YAML 数组的简写形式
          try {
            // 替换 YAML 的单引号为双引号，以便 JSON.parse 能解析
            const jsonArrayStr = valuePart.replace(/'/g, '"');
            data[currentKey] = JSON.parse(jsonArrayStr);
          } catch (e) {
            // 解析失败，尝试手动解析
            const arrayContent = valuePart.slice(1, -1).trim();
            if (arrayContent) {
              data[currentKey] = arrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''));
            } else {
              data[currentKey] = [];
            }
          }
        } 
        // 检查布尔值
        else if (valuePart.toLowerCase() === 'true') {
          data[currentKey] = true;
        } else if (valuePart.toLowerCase() === 'false') {
          data[currentKey] = false;
        }
        // 检查数字
        else if (!isNaN(valuePart) && valuePart !== '') {
          data[currentKey] = Number(valuePart);
        }
        // 检查字符串
        else if ((valuePart.startsWith('"') && valuePart.endsWith('"')) || 
                 (valuePart.startsWith("'") && valuePart.endsWith("'"))) {
          data[currentKey] = valuePart.substring(1, valuePart.length - 1);
        }
        // 其他情况作为字符串
        else {
          data[currentKey] = valuePart;
        }
      }
    }
    
    // 保存最后一个多行值
    if (inMultiline && currentKey) {
      data[currentKey] = currentValue.trim();
    }
    
    return { data, content };
  }
  
  // 没有 frontmatter 的情况
  return { data: {}, content: fileContent };
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
            
            // 解析 frontmatter (原生实现)
            const { data, content } = parseFrontmatter(fileContent);
            
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
