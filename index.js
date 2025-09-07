import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export default function starreadTheme() {
  const themeDir = dirname(fileURLToPath(import.meta.url));

  return {
    name: "astro-theme-starread",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {   
            resolve: {
              alias: {
                "@starread": join(themeDir, "src")
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
          }
        });
      }
    }
  };
}