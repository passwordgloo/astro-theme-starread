import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import remarkGithubAlerts from 'remark-github-blockquote-alert';
import autoUpdatePermalink from './scripts/autoUpdateFrontmatter.js';
import autoIndex from './scripts/autoindex.js';

export default defineConfig({
  site: "https://www.example.com",
  markdown: {
    remarkPlugins: [remarkGithubAlerts],
    gfm: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), autoUpdatePermalink(), autoIndex()],
});