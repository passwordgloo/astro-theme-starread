// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import autoUpdateFrontmatter from './scripts/AutoUpdateFrontmatter.js';
import autoIndex from './scripts/AutoIndex.js';
import { fileURLToPath, URL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
	site: 'https://star.iglooblog.top',
	output: 'static',
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp'
		}
	},
	compressHTML: true,
	build: {
		inlineStylesheets: 'auto'
	},
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@theme': 'astro-theme-starread',
				'@theme/components': 'astro-theme-starread/components',
				'@theme/layouts': 'astro-theme-starread/layouts',
				'@theme/widgets': 'astro-theme-starread/widgets',
				'@theme/utils': 'astro-theme-starread/utils',
				'@theme/styles': 'astro-theme-starread/styles',
				'@theme/scripts': 'astro-theme-starread/scripts',
				'@theme/config': 'astro-theme-starread/config',
				'@': '/src/',
				'@layouts': '/src/layouts/',
				'@components': '/src/components/',
				'@pages': '/src/pages/',
				'@scripts': '/scripts/',
				'@styles': '/src/styles/',
				'@utils': '/src/utils/',
				'@config': '/starread.config.ts'
			}
		}
	},
	integrations: [sitemap(), autoIndex(), autoUpdateFrontmatter()],
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en', 'ja', 'ko', 'ru'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});