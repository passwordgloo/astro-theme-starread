import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 使用Node.js原生方式读取.env文件
import { existsSync, readFileSync } from 'node:fs';
const envPath = path.resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=').map(part => part.trim());
    if (key && !key.startsWith('#')) {
      process.env[key] = value;
    }
  });
  console.log(`✅ 成功加载.env文件: ${envPath}`);
}
import { algoliasearch } from 'algoliasearch';
import fs from 'fs';
import { generateIndex } from './autoindex.js';

// 生成索引
generateIndex();

// ===== Algolia 配置信息 =====
// 注意：使用的是 Admin API Key（仅后端用）
const APP_ID = process.env.PUBLIC_ALGOLIA_APP_ID;
const ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || process.env.ALGOLIA_WRITE_API_KEY;
const INDEX_NAME = process.env.PUBLIC_ALGOLIA_INDEX_NAME;

// 检查必需的配置
if (!APP_ID) {
  console.error('❌ 错误: 缺少 PUBLIC_ALGOLIA_APP_ID 环境变量');
  console.error('   请在 .env 文件中添加: PUBLIC_ALGOLIA_APP_ID=你的AppID');
  process.exit(1);
}

if (!ADMIN_API_KEY) {
  console.error('❌ 错误: 缺少 ALGOLIA_ADMIN_API_KEY 环境变量');
  console.error('   请在 .env 文件中添加: ALGOLIA_ADMIN_API_KEY=你的AdminAPIKey');
  console.error('   注意: 需要使用 Algolia Admin API Key (不是 Search API Key)');
  console.error('   可以在 Algolia Dashboard -> API Keys -> All API Keys 中创建');
  process.exit(1);
}

if (!INDEX_NAME) {
  console.error('❌ 错误: 缺少 PUBLIC_ALGOLIA_INDEX_NAME 环境变量');
  console.error('   请在 .env 文件中添加: PUBLIC_ALGOLIA_INDEX_NAME=你的索引名称');
  process.exit(1);
}

// ===== 读取项目根目录下的 public/data.json =====
const dataPath = path.join(process.cwd(), 'public', 'data.json');
console.log(`📂 读取数据文件: ${dataPath}`);

// 读取 JSON 文件
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

// 读取 siteUrl（同步方式）
let siteUrl = '';
try {
  const astroConfigPath = path.join(process.cwd(), 'astro.config.mjs');
  const configContent = fs.readFileSync(astroConfigPath, 'utf8');
  const siteMatch = configContent.match(/site:\s*["']([^"']+)["']/);
  if (siteMatch && siteMatch[1]) {
    siteUrl = siteMatch[1].replace(/\/$/, ''); // 移除末尾的斜杠
    console.log(`🌐 检测到站点URL: ${siteUrl}`);
  }
} catch (error) {
  console.warn('⚠️ 读取astro.config.mjs文件失败，使用默认URL:', error.message);
}

// 确保每条记录有 objectID，并处理URL字段
// 优化内容大小，截断过长的content字段以符合Algolia的10000字节限制
const records = data.map((item, i) => {
  // 截断content字段，保留搜索所需的前1000个字符
  const truncatedContent = item.content ? item.content.substring(0, 1000) : '';

  // 计算完整URL
  const fullUrl = item.permalink && `${siteUrl || 'http://localhost:4321'}${item.permalink}`;

  return {
    objectID: item.objectID || `${i + 1}_${item.collection || 'articles'}`,
    title: item.title || 'Untitled',
    description: item.description || '',
    cover: item.cover,
    categories: item.categories,
    tags: item.tags,
    date: item.date || '',
    content: truncatedContent, // 使用截断后的内容
    url: fullUrl,
    route: item.permalink,
    permalink: item.permalink,
    collection: item.collection || 'articles'
  };
});

// ===== 初始化 Algolia 客户端（v5 API）=====
const client = algoliasearch(APP_ID, ADMIN_API_KEY);

(async () => {
  try {
    // 推送数据
    const res = await client.saveObjects({
      indexName: INDEX_NAME,
      objects: records,
      autoGenerateObjectIDIfNotExist: true,
    });

    console.log(`✅ 推送成功！任务 ID: ${res.taskID}，共 ${records.length} 条数据`);
    console.log('🎯 数据已写入索引完成！');

    // 设置索引配置（注意 v5 要用 indexSettings）
    await client.setSettings({
      indexName: INDEX_NAME,
      indexSettings: {
        searchableAttributes: ["title", "content", "description", "categories", "tags", "url"],
        attributesToSnippet: ["content:100"], // <== 必须有
        customRanking: ["desc(date)"], // 按日期降序排序
        // 确保永久链接被正确索引
        attributesForFaceting: ["categories", "tags", "collection"]
      },
    });

    console.log("⚙️ 索引配置已更新！");
  } catch (err) {
    console.error('❌ 推送失败:', err);
  }
})();