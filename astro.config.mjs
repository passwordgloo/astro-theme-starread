// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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