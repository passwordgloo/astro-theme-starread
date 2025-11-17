import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import remarkGithubAlerts from 'remark-github-blockquote-alert';
import autoUpdatePermalink from './scripts/autoUpdateFrontmatter.js';
import autoIndex from './scripts/autoindex.js';
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.example.com",
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
    gfm: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [autoUpdatePermalink(), autoIndex(), sitemap()],
  // 启用预获取功能，加快页面导航速度
  prefetch: {
    defaultStrategy: 'hover', // 鼠标悬停时预获取
    prefetchAll: false // 不默认预获取所有链接
  }
});