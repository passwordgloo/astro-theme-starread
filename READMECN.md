# Star Read - Astro博客主题

![NPM Version](https://img.shields.io/npm/v/astro-theme-starread?logo=npm)&emsp;![GitHub Tag](https://img.shields.io/github/v/tag/passwordgloo/astro-theme-starread?logo=github)&emsp;![Created At](https://img.shields.io/github/created-at/passwordgloo/astro-theme-starread?logo=markdown)&emsp;![Last Commit](https://img.shields.io/github/last-commit/passwordgloo/astro-theme-starread?logo=Git)

既有星光般的璀璨，又不失简洁和高端感的Astro主题

## 📦 安装

### 方法一：通过CLI工具初始化

| 包管理器       | 建议命令                                  |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` 或 `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init`（需 Yarn v2+） |

>[!note]
>我们提供了`create`命令，方便用户在指定文件夹创建主题

1. 创建项目： 根据您使用的包管理器，选择以下命令之一：

```bash
# 使用 pnpm
pnpm create astro-theme-starread my-blog

# 使用 npm
npx create-astro-theme-starread my-blog

# 使用 yarn
yarn create astro-theme-starread my-blog

# 使用 cnpm
cnpm init astro-theme-starread my-blog

```

2. 进入项目目录：

```bash

cd my-blog

```

3. 安装依赖：

```bash
pnpm install
```

4. 启动开发服务器：

```bash
pnpm dev
```

### 方法二：使用`astro`模版安装

>[!warning]
>该方式需访问Github仓库，确保网络畅通。

| 包管理器       | 命令                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### 方法三：源码安装

>[!warning]
>该方式需访问Github仓库，确保网络畅通。


```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>安装完成后，运行开发服务器：
```bash
pnpm dev
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

## 🔍 搜索

### 本地搜索

默认使用本地搜索，首次使用请运行`pnpm local` 建立本地索引

### Algolia搜索

>[!important]
>生产环境中建议使用环境变量方式配置，避免敏感信息暴露在代码中。

1. 编辑`starread.config.ts` 选择Algolia搜索
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // 搜索服务提供商: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. 根目录创建并编辑 `.env`文件

>[!note]
>Algolia搜索需要您的Algolia应用ID、搜索密钥、索引名称和管理员API密钥。

>[!tip]
>如果您没有Algolia账号，需要先注册并创建一个应用。

```env
PUBLIC_ALGOLIA_APP_ID=您的Algolia应用ID
PUBLIC_ALGOLIA_SEARCH_KEY=您的Algolia搜索密钥
PUBLIC_ALGOLIA_INDEX_NAME=您的索引名称
ALGOLIA_WRITE_API_KEY=您的写入API密钥（用于索引上传）
```

3. 推送索引到Algolia

运行`pnpm algolia` 推送本地索引到Algolia

## ⚙️ 自定义配置

您可以通过修改根目录下的 `starread.config.ts` 文件来自定义主题配置，包括网站标题、导航菜单、作者信息、侧边栏组件显示等。

示例配置项：
```typescript
// 修改网站标题
site: {
  title: '我的博客',
  // ...其他配置
}

// 自定义导航菜单
nav: [
  { name: '首页', href: '/' },
  { name: '关于', href: '/about' },
  // ...其他菜单项
]
```

## 🧞 命令

| 命令                     | 描述                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | 安装依赖                                       |
| `pnpm dev`               | 启动本地开发服务器 `localhost:4321`            |
| `pnpm preview`           | 本地预览构建结果                               |
| `pnpm local`             | 运行自动索引脚本并构建生产站点                 |
| `pnpm algolia`           | 推送数据到Algolia搜索                          |
| `pnpm changelog`         | 生成更新日志                                   |
| `pnpm release`           | 版本管理（更新版本号、生成提交等）             |
