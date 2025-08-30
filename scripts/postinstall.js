#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 配置文件路径
const targetConfigPath = path.resolve(__dirname, '../src/starread.config.ts');
const packageJsonPath = path.resolve(__dirname, '../package.json');

// 1. 生成主题配置文件
function generateConfigFile() {
  // 从config.ts提取接口定义并生成默认配置
  const defaultConfig = `import type { starreadthemeconfig } from '../scripts/config';

export const themeConfig: starreadthemeconfig = {
  site: {
    title: 'StarRead Theme',
    favicon: '/favicon.svg',
    defaultCover: '/defaultCover.jpg',
    logo: {
      image: '/logo.svg',
      darkImage: '/logo-dark.svg',
      text: 'StarRead',
      alt: 'StarRead Logo'
    }
  },
  author: {
    name: 'Your Name',
    description: 'Theme author description',
    avatar: '',
    social: {}
  },
  ad: {
    title: 'Sponsored Content',
    description: 'Discover amazing products',
    buttonText: 'Learn More',
    link: '#'
  },
  nav: [],
  categories: [],
  sidebar: {
    home: {
      statsWidget: true,
      authorWidget: true,
      adWidget: true,
      tag: true,
      recommendedArticles: true
    },
    article: {
      authorWidget: true,
      tag: true,
      toc: true
    }
  },
  footer: {
    text: '© 2023 StarRead Theme. All rights reserved.'
  },
  articleLoad: {
    type: 'auto',
    defaultLimit: 20,
    initialLoad: 10,
    loadMore: 5
  },
  search: {
    provider: 'local',
    algolia: {
      enabled: false,
      appId: '',
      searchKey: '',
      indexName: ''
    }
  }
};
`;

  fs.writeFileSync(targetConfigPath, defaultConfig, 'utf8');
  console.log(`✅ 主题配置文件已生成: ${targetConfigPath}`);
}

// 2. 更新package.json脚本
function updatePackageJson() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // 添加或更新脚本
  packageJson.scripts = {
    ...packageJson.scripts,
    "dev": "astro dev",
    "build": "astro build"
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log(`✅ package.json脚本已配置`);
}

// 3. 输出欢迎信息
function showWelcomeMessage() {
  console.log(`\n🎉 欢迎使用StarRead主题\n`);
  console.log(`📚 主题配置文件: ${targetConfigPath}`);
  console.log(`💻 开发预览: pnpm dev`);
  console.log(`🚀 打包发布: pnpm build\n`);
  console.log(`✨ 开始使用吧！如有问题，请查看文档或提交issue。\n`);
}

// 主执行流程
async function main() {
  try {
    generateConfigFile();
    updatePackageJson();
    showWelcomeMessage();
  } catch (error) {
    console.error('❌ 初始化过程中出错:', error.message);
    process.exit(1);
  }
}

main();