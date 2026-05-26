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
		build: {
			charset: 'utf-8',
		},
	},
	integrations: [mdx(), sitemap(), autoIndex(), autoUpdatePermalink()],
});
	},
	integrations: [mdx(), sitemap(), autoIndex(), autoUpdatePermalink()],
});
