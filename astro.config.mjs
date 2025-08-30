import { defineConfig } from "astro/config";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [pagefind(),],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    gfm:true
  },
});
