import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        'starread.config': 'starread.config.ts'
      }
    }
  },
  site: "https://www.example.com",
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    gfm:true
  },

  integrations: [react()],
});