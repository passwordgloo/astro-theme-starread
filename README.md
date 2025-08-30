# Star Read - Astro博客主题

![NPM Version](https://img.shields.io/npm/v/astro-theme-starread?logo=npm)&emsp;![Version](https://img.shields.io/badge/Version-1.6.0-blueviolet?logo=github&style=flat)&emsp;![Created At](https://img.shields.io/github/created-at/passwordgloo/star-read?logo=markdown)&emsp;![Last Commit](https://img.shields.io/github/last-commit/passwordgloo/star-read?logo=Git)

一个现代化的Astro博客主题，支持多种搜索服务。

## 📦 安装

```bash
# 使用npm
npm install passwordgloo/astro-theme-starread

# 使用yarn
yarn add passwordgloo/astro-theme-starread

# 使用pnpm
pnpm install -D passwordgloo/astro-theme-starread
```

## 📂 项目结构

```text
/
├── src/
│   ├── components/     # 组件文件
│   ├── content/        # 内容配置
│   ├── layouts/        # 布局模板
│   ├── pages/          # 页面路由
│   └── styles/         # 样式文件
├── public/             # 静态资源
└── dist/               # 构建输出
```

## 🚀 特性

- 🎨 现代化UI设计
- 🔍 支持本地搜索（Pagefind）和Algolia搜索
- 📱 响应式设计
- 🌙 深色/浅色主题切换
- 🏷️ 标签和分类支持
- 📊 文章统计和作者信息展示

## 🔍 搜索配置

### 本地搜索（默认）
默认使用Pagefind进行本地搜索，无需额外配置。

### Algolia搜索
要使用Algolia搜索服务：

1. 复制 `.env.example` 为 `.env`
2. 在 [Algolia官网](https://www.algolia.com/) 注册账号并创建应用
3. 获取以下信息并填入 `.env`：
   ```
   ALGOLIA_APP_ID=your_app_id
   ALGOLIA_ADMIN_KEY=your_admin_key
   ALGOLIA_SEARCH_KEY=your_search_key
   ALGOLIA_INDEX_NAME=articles
   ```
4. 修改 `src/content/config.ts` 中的搜索配置：
   ```typescript
   search: {
     provider: 'algolia', // 改为 'algolia'
     // ... 其他配置
   }
   ```

构建时会自动生成 `data.json` 并上传到Algolia。

## 🧞 命令

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | 安装依赖                                        |
| `pnpm dev`             | 启动本地开发服务器 `localhost:4321`              |
| `pnpm build`           | 构建生产站点到 `./dist/`                        |
| `pnpm preview`         | 本地预览构建结果                                |

