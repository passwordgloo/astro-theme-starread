import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import autoUpdatePermalink from './scripts/autoUpdateFrontmatter.js';
import autoIndex from './scripts/autoindex.js';

export default defineConfig({
  site: "https://star.iglooblog.top",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), autoUpdatePermalink(), autoIndex()],
});