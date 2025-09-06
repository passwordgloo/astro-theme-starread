import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default function starreadTheme() {
  const themeDir = dirname(fileURLToPath(import.meta.url));

  return {
    name: "astro-theme-starread",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          integrations: [tailwind(), react()],
          vite: {   
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
                gfm:true
            },
        });
      }
    }
  };
}
