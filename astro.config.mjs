// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
   markdown: {
    shikiConfig: {
      // 从 Shiki 的内置主题中选择 (或者添加你自己的)
      // https://shiki.style/themes
      theme: 'dracula',
      // 或者, 提供多个主题
      // 请参阅下面的注释，了解如何使用双明/暗主题
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // 禁用默认配色
      // https://shiki.style/guide/dual-themes#without-default-color
      // (添加于 v4.12.0)
      defaultColor: false,
      // 添加自定义语言
      // 注意：Shiki 内置了无数语言，包括 .astro！
      // https://shiki.style/languages
      langs: [],
      // 为语言添加自定义别名
      // 将别名映射到 Shiki 语言 ID：https://shiki.style/languages#bundled-languages
      // https://shiki.style/guide/load-lang#custom-language-aliases
      langAlias: {
        cjs: "javascript"
      },
      // 启用自动换行以防止水平滚动
      wrap: true,
      // 添加自定义转换器：https://shiki.style/guide/transformers
      // 在这里找到常用的转换器：https://shiki.style/packages/transformers
      transformers: [],
    },
     gfm: true
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          unused: true
        },
        mangle: true
      }
    }
  }
});