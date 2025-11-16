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
});