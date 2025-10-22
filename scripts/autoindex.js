import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// ===== 获取目录路径 =====
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const articlesDir = path.join(process.cwd(), 'src/content/articles');
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

// ===== 生成索引函数 =====
export function generateIndex() {
  const index = [];

  // 读取 Markdown 文件
  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // 解析 frontmatter
    const { data, content } = matter(fileContent);

    // 处理cover路径，添加siteUrl前缀
    let coverPath = data.cover || '/defaultCover.jpg';
    if (coverPath && !coverPath.startsWith('http') && siteUrl) {
      coverPath = siteUrl + coverPath;
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
      slug: `articles/${path.basename(file, '.md')}`,
    });
  });

  // 写入 JSON 文件
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`📝 索引生成成功: ${outputPath}`);
}

// ===== 如果直接执行 autoindex.js，则运行 generateIndex() =====
if (import.meta.url === `file://${process.argv[1]}`) {
  generateIndex();
}
