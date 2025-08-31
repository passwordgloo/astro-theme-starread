const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 定义源目录和目标文件路径
const articlesDir = path.join(__dirname, '../src/content/articles');
const outputPath = path.join(__dirname, '../public/data.json');

// 读取所有Markdown文件并生成索引
const generateIndex = () => {
  const index = [];

  // 读取文章目录
  const files = fs.readdirSync(articlesDir).filter(file => file.endsWith('.md'));

  files.forEach(file => {
    const filePath = path.join(articlesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // 解析frontmatter和内容
    const { data, content } = matter(fileContent);
    
    // 构建索引项
    index.push({
      title: data.title || 'Untitled',
      content: content.trim(),
      slug: `articles/${path.basename(file, '.md')}`
    });
  });

  // 写入JSON文件
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`索引生成成功: ${outputPath}`);
};

generateIndex();