import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Algolia 配置信息（管理 API Key，不是前端 Search Key）
const APP_ID = '';
const ADMIN_API_KEY = '';
const INDEX_NAME = '';

// 获取项目根目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(process.cwd(), 'public', 'data.json');
console.log(`📂 读取数据文件: ${dataPath}`);

// 读取 JSON
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// 保证有 objectID
const records = data.map((item, i) => ({
  objectID: item.objectID || `${i + 1}`,
  ...item
}));

// 初始化客户端（v4 API）
const client = algoliasearch(APP_ID, ADMIN_API_KEY);
const index = client.initIndex(INDEX_NAME);

// 推送数据
(async () => {
  try {
    const { objectIDs } = await index.saveObjects(records);
    console.log(`✅ 成功推送 ${objectIDs.length} 条数据到 Algolia 索引 ${INDEX_NAME}`);
  } catch (err) {
    console.error('❌ 推送失败:', err);
  }
})();
