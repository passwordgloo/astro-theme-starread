import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

export default function starreadTheme(options = {}) {
  const themeDir = dirname(fileURLToPath(import.meta.url));

  return {
    name: "astro-theme-starread",
    hooks: {
      "astro:config:setup": async ({ updateConfig }) => { 
        let configData = options.config;
        if (!configData) {
          try {
            const userConfigPath = new URL('./starread.config.ts', pathToFileURL(process.cwd()));
            const mod = await import(userConfigPath.href);
            configData = mod.default;
          } catch (err) {
            console.warn('未检测到 starread.config.ts，主题将使用默认配置。');
          }
        }

        console.log("加载到的主题配置：", configData);

        updateConfig({
          integrations: [react()],
          vite: {
            plugins: [tailwindcss()],
            resolve: {
              alias: {
                "@theme": join(themeDir, "src")
              },
            },
            optimizeDeps: {
              include: [
                "algoliasearch",
                "react-instantsearch",
                "@iconify/json",
                "@iconify/tailwind4"
              ]
            }
          },
          markdown: {
            gfm: true
          }
        });
      }
    }
  };
}
