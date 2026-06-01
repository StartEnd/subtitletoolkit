// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { execSync } from 'node:child_process';

function getBuildLastmod() {
	try {
		return new Date(execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim());
	} catch {
		return new Date();
	}
}

const buildLastmod = getBuildLastmod();

// https://astro.build/config
export default defineConfig({
	site: 'https://subtitletoolkit.tools',
	integrations: [
		mdx(),
		sitemap({
			lastmod: buildLastmod,
		}),
	],
});
