import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { algoliasearch } from 'algoliasearch';
import fs from 'fs';
import { generateIndex } from './autoindex.js';

// 生成索引
generateIndex();

// ===== Algolia 配置信息 =====
// 注意：使用的是 Admin API Key（仅后端用）
const APP_ID = process.env.PUBLIC_ALGOLIA_APP_ID;
const ADMIN_API_KEY = process.env.ALGOLIA_WRITE_API_KEY;
const INDEX_NAME = process.env.PUBLIC_ALGOLIA_INDEX_NAME;

// ===== 读取项目根目录下的 public/data.json =====
const dataPath = path.join(process.cwd(), 'public', 'data.json');
console.log(`📂 读取数据文件: ${dataPath}`);

// 读取 JSON 文件
const raw = fs.readFileSync(dataPath, 'utf-8');
const data = JSON.parse(raw);

// 确保每条记录有 objectID
const records = data.map((item, i) => ({
  objectID: item.objectID || `${i + 1}`,
  ...item
}));

// ===== 初始化 Algolia 客户端（v5 API）=====
const client = algoliasearch(APP_ID, ADMIN_API_KEY);

// ===== 推送数据到 Algolia =====
(async () => {
  try {
    const [res] = await client.saveObjects({
      indexName: INDEX_NAME,
      objects: records,
      autoGenerateObjectIDIfNotExist: true, // 如果没有objectID就自动生成
    });

    console.log(`✅ 推送成功！任务 ID: ${res.taskID}，共 ${records.length} 条数据`);

    // 可选：等待任务完成再退出
    await client.waitForTask({
      indexName: INDEX_NAME,
      taskID: res.taskID,
    });
    console.log('🎯 数据已写入索引完成！');
  } catch (err) {
    console.error('❌ 推送失败:', err);
  }
})();
