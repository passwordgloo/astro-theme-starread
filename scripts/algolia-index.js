#!/usr/bin/env node

/**
 * Algolia索引脚本
 * 用于手动建立本地文章索引并推送到Algolia
 * 使用方法: pnpm algolia
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import algoliasearch from 'algoliasearch';
import matter from 'gray-matter';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 项目根目录
const rootDir = path.resolve(__dirname, '..');

// 读取环境变量
function loadEnv() {
  try {
    const envPath = path.resolve(rootDir, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, value] = line.split('=').map(part => part.trim());
        if (key && !key.startsWith('#')) {
          process.env[key] = value;
        }
      });
    }
  } catch (error) {
    console.warn('加载.env文件失败:', error.message);
  }
}

// 获取Algolia配置
function getAlgoliaConfig() {
  return {
    appId: process.env.ALGOLIA_APP_ID || '',
    apiKey: process.env.ALGOLIA_ADMIN_KEY || '',
    indexName: process.env.ALGOLIA_INDEX_NAME || 'articles'
  };
}

// 读取文章内容
async function readArticles() {
  const articlesDir = path.resolve(rootDir, 'src/content/articles');
  const articles = [];
  
  try {
    // 读取文章目录
    const files = fs.readdirSync(articlesDir);
    
    for (const file of files) {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        const filePath = path.resolve(articlesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // 解析文章frontmatter
        const { data, content } = matter(fileContent);
        
        // 提取文章ID（文件名不含扩展名）
        const id = path.basename(file, path.extname(file));
        
        // 提取文章slug（如果没有指定则使用ID）
        const slug = data.slug || id;
        
        // 准备索引数据
        articles.push({
          objectID: id,
          id: id,
          slug: slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          content: content || '',
          categories: data.categories || [],
          tags: data.tags || [],
          date: data.date ? new Date(data.date).toISOString() : new Date().toISOString()
        });
      }
    }
    
    console.log(`成功读取 ${articles.length} 篇文章`);
    return articles;
  } catch (error) {
    console.error('读取文章失败:', error);
    return [];
  }
}

// 推送索引到Algolia
async function pushToAlgolia(articles, config) {
  if (!articles.length) {
    console.log('没有文章可索引');
    return;
  }
  
  if (!config.appId || !config.apiKey || !config.indexName) {
    console.error('Algolia配置不完整，请检查环境变量');
    console.error('需要设置: ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX_NAME');
    return;
  }
  
  try {
    console.log(`开始推送索引到Algolia (${config.indexName})...`);
    
    // 初始化Algolia客户端
    const client = algoliasearch(config.appId, config.apiKey);
    const index = client.initIndex(config.indexName);
    
    // 批量推送文章
    const { objectIDs } = await index.saveObjects(articles);
    
    console.log(`成功推送 ${objectIDs.length} 篇文章到Algolia索引`);
    
    // 设置搜索属性
    await index.setSettings({
      searchableAttributes: ['title', 'content', 'description', 'categories', 'tags'],
      attributesForFaceting: ['categories', 'tags'],
      customRanking: ['desc(date)']
    });
    
    console.log('Algolia索引设置已更新');
    
  } catch (error) {
    console.error('推送索引到Algolia失败:', error);
  }
}

// 主函数
async function main() {
  console.log('=== Algolia索引工具 ===');
  
  // 加载环境变量
  loadEnv();
  
  // 获取Algolia配置
  const algoliaConfig = getAlgoliaConfig();
  
  // 读取文章
  const articles = await readArticles();
  
  // 推送索引
  await pushToAlgolia(articles, algoliaConfig);
  
  console.log('=== 索引任务完成 ===');
}

// 执行主函数
main().catch(error => {
  console.error('程序执行失败:', error);
  process.exit(1);
});