import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        'starread.config': '/Users/igloo/astro-theme-starread/starread.config.ts'
      }
    }
  },
  site: "https://star.iglooblog.top",
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    gfm:true
  },

  integrations: [react()],
});