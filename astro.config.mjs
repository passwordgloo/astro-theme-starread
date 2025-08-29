import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";
import algoliaIntegration from "./src/pages/search/algolia-integration.js";

export default defineConfig({
<<<<<<< HEAD
  integrations: [pagefind()],
=======
  integrations: [pagefind(), algoliaIntegration()],
>>>>>>> dev
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    gfm:true
  },
});
