import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const verifyDist = process.env.SEO_VERIFY_DIST === '1';
const baseUrl = (process.env.SEO_VERIFY_BASE_URL || 'https://subtitletoolkit.tools').replace(/\/$/, '');
const distDir = resolve(process.env.SEO_VERIFY_DIST_DIR || 'dist');
const retries = Number.parseInt(process.env.SEO_VERIFY_RETRIES || '0', 10);
const retryDelayMs = Number.parseInt(process.env.SEO_VERIFY_RETRY_DELAY_MS || '30000', 10);

function getExpectedLastmod() {
	try {
		return new Date(execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim()).toISOString();
	} catch {
		return null;
	}
}

const expectedLastmod = process.env.SEO_VERIFY_EXPECTED_LASTMOD || getExpectedLastmod();

const checks = [
	{
		path: '/',
		expect: [
			{
				label: 'homepage links to priority delay tool',
				match: '/tools/subtitle-delay-fixer/',
			},
			{
				label: 'homepage links to priority extraction tool',
				match: '/tools/extract-subtitles-from-video/',
			},
			{
				label: 'homepage links to priority guide',
				match: '/guides/why-subtitles-do-not-show-in-html5-video/',
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitle-delay/',
		expect: [
			{
				label: 'updated guide title',
				match: '<title>Fix Subtitle Delay Online - SRT, VTT, ASS Timing Guide</title>',
			},
			{
				label: 'above-content related tool link',
				match: 'href="/tools/subtitle-time-shifter/"',
			},
			{
				label: 'guide tool CTA analytics event',
				match: 'guide_tool_cta_click',
			},
			{
				label: 'top guide tool CTA placement',
				match: 'data-guide-tool-placement="top"',
			},
			{
				label: 'updated guide meta description',
				match: 'Fix subtitles that appear too early or too late. Measure the offset, shift SRT, VTT, or ASS timing online, and download a corrected file with no upload.',
			},
			{
				label: 'single Article JSON-LD block',
				count: /"@type"\s*:\s*"Article"/g,
				expectedCount: 1,
			},
		],
	},
	{
		path: '/guides/how-to-convert-srt-to-vtt-for-html5-video/',
		expect: [
			{
				label: 'updated SRT to VTT guide title',
				match: '<title>SRT to VTT for HTML5 Video - Free Converter Guide</title>',
			},
			{
				label: 'updated SRT to VTT meta description',
				match: 'Convert SRT subtitles to WebVTT for HTML5 video. Add the WEBVTT header, fix timestamp syntax, and create a browser-ready VTT file locally.',
			},
			{
				label: 'footer links to priority guide',
				match: 'SRT to VTT for HTML5',
			},
		],
	},
	{
		path: '/guides/how-to-convert-vtt-to-srt-for-legacy-subtitle-editors/',
		expect: [
			{
				label: 'updated VTT to SRT guide title',
				match: '<title>VTT to SRT Converter Guide - Free WebVTT to SubRip</title>',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-mkv/',
		expect: [
			{
				label: 'updated MKV extraction guide title',
				match: '<title>Extract Subtitles from MKV - Free No Upload Guide</title>',
			},
		],
	},
	{
		path: '/tools/srt-to-vtt/',
		expect: [
			{
				label: 'CTR-oriented SRT to VTT tool title',
				match: '<title>SRT to VTT Converter Online - Free, No Upload</title>',
			},
			{
				label: 'SRT to VTT no-upload meta description',
				match: 'Convert SRT subtitles to VTT online for free. Create a WebVTT file for HTML5 video locally in your browser with no signup or upload.',
			},
		],
	},
	{
		path: '/tools/subtitle-delay-fixer/',
		expect: [
			{
				label: 'CTR-oriented delay fixer tool title',
				match: '<title>Fix Subtitle Delay Online - Free, No Upload</title>',
			},
			{
				label: 'delay fixer no-upload meta description',
				match: 'Fix subtitle delay online for SRT, VTT, and ASS files. Shift captions earlier or later locally in your browser with no signup or upload.',
			},
		],
	},
	{
		path: '/tools/srt-validator/',
		expect: [
			{
				label: 'CTR-oriented SRT validator tool title',
				match: '<title>SRT Validator Online - Free Subtitle Checker</title>',
			},
			{
				label: 'SRT validator no-upload meta description',
				match: 'Validate SRT subtitles online for free. Check timestamp format, cue order, numbering, and upload errors locally with no signup or upload.',
			},
		],
	},
	{
		path: '/tools/webvtt-validator/',
		expect: [
			{
				label: 'CTR-oriented WebVTT validator tool title',
				match: '<title>WebVTT Validator Online - Free VTT Checker</title>',
			},
			{
				label: 'WebVTT validator local meta description',
				match: 'Validate WebVTT captions online for free. Check the WEBVTT header, timestamp syntax, cue order, and browser caption issues locally.',
			},
		],
	},
	{
		path: '/tools/srt-to-ass/',
		expect: [
			{
				label: 'updated SRT to ASS tool title',
				match: '<title>SRT to ASS Converter - Convert Subtitles Online Free</title>',
			},
			{
				label: 'free software schema field',
				match: /"isAccessibleForFree"\s*:\s*true/,
			},
		],
	},
	{
		path: '/tools/',
		expect: [
			{
				label: 'updated tools index title',
				match: '<title>Free Subtitle Tools - Convert, Fix, Clean SRT, VTT, ASS</title>',
			},
		],
	},
	{
		path: '/guides/',
		expect: [
			{
				label: 'high-intent guide section',
				match: 'High-intent subtitle problems to fix first.',
			},
		],
	},
	{
		path: '/guides/conversion-guides/',
		expect: [
			{
				label: 'updated conversion hub title',
				match: '<title>Subtitle Conversion Guides - SRT, VTT, ASS Workflows</title>',
			},
		],
	},
	{
		path: '/guides/sync-fixes/',
		expect: [
			{
				label: 'updated sync fixes hub title',
				match: '<title>Subtitle Sync Fixes - Timing, Delay, and VTT Errors</title>',
			},
		],
	},
	{
		path: '/sitemap-0.xml',
		expect: [
			{
				label: expectedLastmod
					? 'sitemap lastmod matches current commit time'
					: 'sitemap includes lastmod entries',
				match: expectedLastmod
					? `<lastmod>${expectedLastmod}</lastmod>`
					: /<lastmod>\d{4}-\d{2}-\d{2}T/,
			},
		],
	},
];

async function fetchHtml(path) {
	if (verifyDist) {
		const filePath = path.endsWith('/')
			? join(distDir, path, 'index.html')
			: join(distDir, path.replace(/^\//, ''));

		if (!existsSync(filePath)) {
			throw new Error(`missing dist file: ${filePath}`);
		}

		return readFileSync(filePath, 'utf8');
	}

	const url = `${baseUrl}${path}`;
	const response = await fetch(url, {
		redirect: 'follow',
		signal: AbortSignal.timeout(15_000),
	});

	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText}`);
	}

	return response.text();
}

function checkExpectation(html, expectation) {
	if (expectation.count) {
		const count = html.match(expectation.count)?.length ?? 0;
		return {
			ok: count === expectation.expectedCount,
			actual: String(count),
			expected: String(expectation.expectedCount),
		};
	}

	const ok =
		typeof expectation.match === 'string'
			? html.includes(expectation.match)
			: expectation.match.test(html);

	return { ok };
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runChecks() {
	let failed = false;

	for (const check of checks) {
		let html;

		try {
			html = await fetchHtml(check.path);
		} catch (error) {
			failed = true;
			console.error(`FAIL ${check.path}: ${error.message}`);
			continue;
		}

		for (const expectation of check.expect) {
			const result = checkExpectation(html, expectation);

			if (result.ok) {
				console.log(`PASS ${check.path}: ${expectation.label}`);
				continue;
			}

			failed = true;
			const detail = result.expected
				? ` expected ${result.expected}, got ${result.actual}`
				: '';
			console.error(`FAIL ${check.path}: ${expectation.label}${detail}`);
		}
	}

	return !failed;
}

console.log(
	verifyDist
		? `Verifying SEO output in ${distDir}`
		: `Verifying SEO deployment at ${baseUrl}`,
);

for (let attempt = 0; attempt <= retries; attempt += 1) {
	if (attempt > 0) {
		console.log(`Retrying SEO verification (${attempt}/${retries})...`);
	}

	const passed = await runChecks();

	if (passed) {
		console.log('SEO verification passed.');
		process.exit(0);
	}

	if (attempt < retries) {
		await sleep(retryDelayMs);
	}
}

console.error(
	verifyDist
		? 'SEO dist verification failed. Run pnpm build and inspect the generated HTML.'
		: 'SEO deployment verification failed. Confirm the latest Cloudflare Pages deployment is live.',
);
process.exit(1);
