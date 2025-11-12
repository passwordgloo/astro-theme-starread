<div align="center">
  <img src="https://origin.picgo.net/2025/09/20/starread9dd6dc8d9d8dc4eb.png" alt="starread" border="0">
  <p>
    <img src="https://img.shields.io/npm/v/astro-theme-starread?logo=npm" alt="NPM Version">
    <img src="https://img.shields.io/github/v/tag/passwordgloo/astro-theme-starread?logo=github" alt="GitHub Tag">
    <img src="https://img.shields.io/github/created-at/passwordgloo/astro-theme-starread?logo=markdown" alt="Created At">
    <img src="https://img.shields.io/github/last-commit/passwordgloo/astro-theme-starread?logo=Git" alt="Last Commit">
</p>
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

### Method 4: As a dependency in existing Astro project

You can install the theme as a dependency in your existing Astro project and use its components, layouts, and pages directly from node_modules. This is the recommended way to use the theme in Astro 5 projects.

1. **Install the theme package**:

```bash
# Using pnpm
pnpm add astro-theme-starread

# Using npm
npm install astro-theme-starread

# Using yarn
yarn add astro-theme-starread
```

**Direct access to theme components and layouts in node_modules:**

After installation, you can directly import and use components and layouts from the theme package in your Astro files. The components and layouts are accessible through the package's main entry point, making it easy to integrate them into your project.

2. **Import and use components directly from node_modules**:

```astro
---
// Import components directly from the theme in node_modules
import { NavBar, ThemeToggle, ArticleInfo, AuthorWidget, TagCloud } from 'astro-theme-starread';
---

<html>
  <head>
    <title>My Astro Blog</title>
    <!-- Import theme styles if needed -->
    <link rel="stylesheet" href="node_modules/astro-theme-starread/src/styles/global.css" />
  </head>
  <body>
    <!-- Use the NavBar component from node_modules -->
    <NavBar />
    
    <!-- Use the ThemeToggle component from node_modules -->
    <ThemeToggle />
    
    <article>
      <!-- Use the ArticleInfo component with props -->
      <ArticleInfo 
        title="My Article"
        date="2024-01-01"
        author="Author Name"
      />
      <p>Article content here...</p>
    </article>
    
    <aside>
      <!-- Use sidebar components -->
      <AuthorWidget />
      <TagCloud />
    </aside>
  </body>
</html>
```

3. **Use layouts directly from node_modules**:

```astro
---
// Import layout directly from the theme in node_modules
import { article as ArticleLayout } from 'astro-theme-starread';

// Apply the layout from node_modules
export const layout = ArticleLayout;

// Your content
export const content = {
  title: "My Blog Post",
  date: "2024-01-01",
  author: "Author Name",
  tags: ["tech", "blogging"]
};
---

<!-- This content will be rendered inside the layout from node_modules -->
<main>
  <p>This is the content of my blog post. It will be rendered inside the article layout from the theme.</p>
</main>
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

By default, local search is used, which is suitable for offline use on the local end and does not require user configuration.

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
| `pnpm algolia`           | Push data to Algolia search                      |
| `pnpm release`           | Version management (update version number, generate commits, etc.) |