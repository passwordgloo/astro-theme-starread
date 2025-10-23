---
title: Star Read Astro Blog Theme
categories: [主题说明]
description: Star Read is a brilliant, clean, and sophisticated Astro blog theme. It offers multiple installation methods, has a well structured project layout, and comes with features like modern UI, search support, responsive design, theme toggling, and more. It also provides detailed configurations for search, theme customization, and comment systems.
cover: https://picsum.photos/800/400?random=1
date: 2025-10-20
---

<div align="center">
  <img src="https://origin.picgo.net/2025/09/20/starread9dd6dc8d9d8dc4eb.png" alt="starread" border="0">
   🏴󠁧󠁢󠁥󠁮󠁧󠁿 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/README.md">English Document</a> | 
  🇨🇳 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMECN.md">中文文档</a> | 
  🇯🇵 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEJA.md">日本語ドキュメント</a> | 
  🇰🇷 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMEKO.md">한국어 문서</a> | 
  🇷🇺 <a href="https://github.com/passwordgloo/astro-theme-starread/blob/master/READMERU.md">Русская документация</a>
</div>


# Star Read - Astro Blog Theme

>A brilliant yet clean and sophisticated Astro theme with star-like quality

## 📦 Installation

### Method 1: Initialize via CLI Tool

| Package Manager | Recommended Command                          |
|----------------|-------------------------------------------|
| pnpm / pnpx    | `pnpm dlx astro-theme-starread init` or `pnpx astro-theme-starread init` |
| npm (npx)      | `npx astro-theme-starread init`           |
| Yarn           | `yarn dlx astro-theme-starread init` (Requires Yarn v2+) |

>[!note]
>We provide a `create` command to facilitate creating a theme in a specified folder

1. Create Project: Depending on your package manager, choose one of the following commands:

```bash
# Using pnpm
pnpm create astro-theme-starread my-blog

# Using npm
npx create-astro-theme-starread my-blog

# Using yarn
yarn create astro-theme-starread my-blog

# Using cnpm
cnpm init astro-theme-starread my-blog
```

2. Enter Project Directory:

```bash
cd my-blog
```

3. Install Dependencies:

```bash
pnpm install
```

4. Start Development Server:

```bash
pnpm dev
```

### Method 2: Install using `astro` template

>[!warning]
>This method requires accessing the GitHub repository, ensure network connectivity.

| Package Manager | Command                                        |
|----------------|---------------------------------------------|
| pnpm           | `pnpm create astro@latest --template passwordgloo/astro-theme-starread` |
| npm            | `npm create astro@latest -- --template passwordgloo/astro-theme-starread` |
| yarn           | `yarn create astro --template passwordgloo/astro-theme-starread` |

### Method 3: Install from Source

>[!warning]
>This method requires accessing the GitHub repository, ensure network connectivity.


```bash
git clone https://github.com/passwordgloo/astro-theme-starread
cd astro-theme-starread
pnpm install
```

>[!note]
>After installation, run the development server:
```bash
pnpm dev
```

## 📂 Project Structure

```text
/
├── src/
│   ├── components/     # Component files
│   ├── content/        # Content configuration
│   ├── layouts/        # Layout templates
│   ├── pages/          # Page routes
│   └── styles/         # Style files
├── public/             # Static assets
└── dist/               # Build output
```

## 🚀 Features

- 🎨 Modern UI Design
- 🔍 Support for Local Search (Pagefind) and Algolia Search
- 📱 Responsive Design
- 🌙 Dark/Light Theme Toggle
- 🏷️ Tag and Category Support
- 📊 Article Statistics and Author Information Display

## 🔍 Search

### Local Search

Local search is used by default. For first-time use, run `pnpm local` to build local index

### Algolia Search

>[!important]
>It is recommended to use environment variables for configuration in production to avoid exposing sensitive information in code.

1. Edit `starread.config.ts` to select Algolia search
```ts
export const themeConfig: starreadthemeconfig = {
  search: {
    // Search provider: 'local', 'algolia'
      provider: 'algolia',
    }
}
```

2. Create and edit `.env` file in root directory

>[!note]
>Algolia search requires your Algolia Application ID, Search Key, Index Name, and Admin API Key.

>[!tip]
>If you don't have an Algolia account, you need to register and create an application first.

```txt
PUBLIC_ALGOLIA_APP_ID=Your Algolia Application ID
PUBLIC_ALGOLIA_SEARCH_KEY=Your Algolia Search Key
PUBLIC_ALGOLIA_INDEX_NAME=Your Index Name
ALGOLIA_WRITE_API_KEY=Your Write API Key (for index upload)
```

3. Push Index to Algolia

Run `pnpm algolia` to push local index to Algolia

## ⚙️ Custom Configuration

You can customize theme configuration by modifying the `starread.config.ts` file in the root directory, including website title, navigation menu, author information, sidebar component display, etc.

Example configuration items:
```typescript
// Modify website title
site: {
  title: 'My Blog',
  // ...other configurations
}

// Custom navigation menu
nav: [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  // ...other menu items
]
```

## 🔧 Twikoo Comment Configuration

To enable Twikoo comment system, please modify the `envId` value on line 13 of `src/components/Comment.astro` file to your [Twikoo environment address](https://twikoo.js.org/backend.html).

```js
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.twikoo) {
      window.twikoo.init({
        envId: 'https://example.com',// Your environment address
        el: '#tcomment',
        path: window.location.pathname
      });
    } else {
      console.error('Twikoo failed to load, please check the local Twikoo location or CDN address');
    }
  });
</script>
```


## 🧞 Commands

| Command                 | Description                                       |
| :----------------------- | :--------------------------------------------- |
| `pnpm install`           | Install dependencies                           |
| `pnpm dev`               | Start local development server `localhost:4321` |
| `pnpm preview`           | Preview build results locally                   |
| `pnpm local`             | Run automatic indexing script and build production site |
| `pnpm algolia`           | Push data to Algolia search                      |
| `pnpm changelog`         | Generate changelog                              |
| `pnpm release`           | Version management (update version number, generate commits, etc.) |