import { searchClient } from '@algolia/client-search';
import { readFile } from "node:fs/promises";
import { fileURLToPath } from 'node:url';

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || 'articles';

export default function algoliaIntegration() {
  return {
    name: 'algolia-integration',
    hooks: {
      'astro:build:done': async ({ logger, dir }) => {
        if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
          logger.warn('Algolia APP ID 或 Admin Key 未设置，跳过索引上传');
          return;
        }

        try {
          const client = searchClient(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
          
          // 读取data.json文件
          const dataPath = new URL('./data.json', dir);
          const data = await readFile(fileURLToPath(dataPath), 'utf-8');
          
          if (!data) {
            throw new Error('在data.json中未找到数据');
          }

          const records = JSON.parse(data);
          if (!Array.isArray(records)) {
            throw new Error('数据格式无效：应为数组');
          }

          // 上传到Algolia
          const index = client.initIndex(ALGOLIA_INDEX_NAME);
          
          // 保存对象到索引
          const result = await index.saveObjects(records);
          
          logger.info(`成功上传 ${result.objectIDs.length} 条记录到 Algolia`);
          
          // 设置索引设置（可选）
          await index.setSettings({
            searchableAttributes: ['title', 'description', 'content', 'categories', 'tags'],
            attributesToHighlight: ['title', 'description', 'content'],
            attributesToSnippet: ['content:30'],
            customRanking: ['desc(date)'],
            attributesForFaceting: ['categories', 'tags'],
          });
          
          logger.info('Algolia 索引设置已更新');
          
        } catch (error) {
          logger.error(`Algolia 索引上传失败: ${error.message}`);
        }
      }
    }
  };
}