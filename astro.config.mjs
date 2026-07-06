// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import autoUpdatePermalink from './scripts/autoUpdateFrontmatter.js';
import autoIndex from './scripts/autoindex.js';

// https://astro.build/config
export default defineConfig({
	site: 'https://star.iglooblog.top',
	output: 'static',
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				'@theme': '/src/index.ts',
				'@theme/': '/src/',
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
	integrations: [mdx(), sitemap(), autoIndex(), autoUpdatePermalink()],
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en', 'ja', 'ko', 'ru'],
		routing: {
			prefixDefaultLocale: false,
		},
	},
});
