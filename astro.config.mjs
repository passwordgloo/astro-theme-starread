import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import starreadTheme from "astro-theme-starread";

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
    plugins: [tailwindcss(), starreadTheme()],
  },

  markdown: {
    gfm:true
  },

  integrations: [react()],
});