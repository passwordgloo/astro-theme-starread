import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://star.iglooblog.top",
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    gfm:true
  },

  integrations: [react()],
});