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
				label: 'homepage no-upload title promise',
				match: '<title>Free Subtitle Tools - No Upload | Subtitle Toolkit</title>',
			},
			{
				label: 'homepage no-upload meta description',
				match: 'Convert, fix, and clean SRT, VTT, and ASS subtitle files for free. No signup, no upload, and browser-local processing for private caption workflows.',
			},
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
			{
				label: 'FAQ schema for delay questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What's the difference between delay and drift\?/
			},
			{
				label: 'guide Article schema includes query tags',
				match: /"keywords"\s*:\s*"subtitle delay, subtitle sync, timing, repair, offset"/
			},
			{
				label: 'breadcrumb schema includes current guide URL',
				match: /"name"\s*:\s*"How to fix subtitle delay"[\s\S]*"item"\s*:\s*"https:\/\/subtitletoolkit\.tools\/guides\/how-to-fix-subtitle-delay\/"/
			},
			{
				label: 'guide links to related workflow tools',
				match: 'Continue with a related subtitle tool',
			},
			{
				label: 'guide related tool click analytics placement',
				match: 'data-guide-tool-placement="related-tools"',
			},
		],
	},
	{
		path: '/guides/fix-subtitle-sync-after-a-scene-cut/',
		expect: [
			{
				label: 'scene-cut sync guide CTR title',
				match: '<title>Fix Subtitle Sync After a Scene Cut - Shift One Section</title>',
			},
			{
				label: 'scene-cut sync guide no-upload meta description',
				match: 'Fix subtitle sync after a scene cut without shifting the whole file. Move only the affected subtitle range online with no upload or signup.',
			},
			{
				label: 'scene-cut sync guide opens partial shifter',
				match: 'href="/tools/partial-subtitle-shifter/"',
			},
			{
				label: 'FAQ schema for scene-cut sync questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can I fix multiple edits at once\?/
			},
			{
				label: 'scene-cut Article schema includes query tags',
				match: /"keywords"\s*:\s*"subtitle scene cut, partial subtitle shifter, subtitle sync fix, video edit subtitles"/
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
			{
				label: 'FAQ schema for SRT to VTT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can I convert VTT back to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-fix-invalid-webvtt-timestamps/',
		expect: [
			{
				label: 'FAQ schema for invalid WebVTT timestamps',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What makes a WebVTT timestamp invalid\?/
			},
			{
				label: 'invalid WebVTT guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/how-to-validate-webvtt-files/',
		expect: [
			{
				label: 'WebVTT validation guide CTR title',
				match: '<title>WebVTT Validator Guide - Check VTT Captions Online</title>',
			},
			{
				label: 'WebVTT validation guide no-upload meta description',
				match: 'Validate WebVTT files before HTML5 video playback. Check WEBVTT headers, timestamp dots, cue structure, and browser caption errors with no upload.',
			},
			{
				label: 'WebVTT validation guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'FAQ schema for WebVTT validation questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What if validation passes but captions still do not show\?/
			},
		],
	},
	{
		path: '/guides/how-to-validate-srt-files/',
		expect: [
			{
				label: 'SRT validation guide CTR title',
				match: '<title>SRT Validator Guide - Check Subtitle Files Before Upload</title>',
			},
			{
				label: 'SRT validation guide no-upload meta description',
				match: 'Validate SRT files before YouTube, Vimeo, or editor upload. Check timestamps, cue numbers, blank lines, and subtitle structure with no upload.',
			},
			{
				label: 'SRT validation guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for SRT validation questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What if validation passes but YouTube rejects my file\?/
			},
		],
	},
	{
		path: '/guides/how-to-clean-subtitle-formatting-before-upload/',
		expect: [
			{
				label: 'FAQ schema for subtitle cleanup questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What's the difference between cleaning and validating\?/
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-youtube/',
		expect: [
			{
				label: 'FAQ schema for YouTube subtitle format questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Does YouTube support VTT\?/
			},
			{
				label: 'YouTube format guide opens YouTube converter',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/best-srt-settings-for-youtube-upload/',
		expect: [
			{
				label: 'YouTube SRT settings guide CTR title',
				match: '<title>Best SRT Settings for YouTube Upload - Caption Checklist</title>',
			},
			{
				label: 'YouTube SRT settings guide meta description',
				match: 'Use the best SRT settings for YouTube upload: comma timestamps, sequential cue numbers, UTF-8 encoding, clean text, and readable line breaks.',
			},
			{
				label: 'YouTube SRT settings guide opens converter tool',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'YouTube SRT settings guide links to SRT validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube SRT settings questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What are the best SRT settings for YouTube upload\?/
			},
		],
	},
	{
		path: '/guides/srt-vs-ass-for-youtube-captions/',
		expect: [
			{
				label: 'YouTube SRT vs ASS guide CTR title',
				match: '<title>SRT vs ASS for YouTube Captions - Which Format to Upload?</title>',
			},
			{
				label: 'YouTube SRT vs ASS guide meta description',
				match: 'Compare SRT vs ASS for YouTube captions. Learn why SRT is safer for upload, what ASS styling YouTube ignores, and when to convert ASS to SRT.',
			},
			{
				label: 'YouTube SRT vs ASS guide opens ASS to SRT tool',
				match: 'href="/tools/ass-to-srt/"',
			},
			{
				label: 'YouTube SRT vs ASS guide links to YouTube converter',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'FAQ schema for YouTube SRT vs ASS questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Should I upload SRT or ASS captions to YouTube\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-youtube/',
		expect: [
			{
				label: 'YouTube subtitle conversion guide CTR title',
				match: '<title>Convert Subtitles for YouTube - VTT or ASS to SRT</title>',
			},
			{
				label: 'YouTube subtitle conversion guide meta description',
				match: 'Convert VTT, ASS, or SSA subtitles to YouTube-ready SRT captions. Fix timestamp format, remove unsupported styling, and validate before upload.',
			},
			{
				label: 'YouTube subtitle conversion guide opens converter tool',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'YouTube subtitle conversion guide links to validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube subtitle conversion questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can I convert VTT subtitles to SRT for YouTube\?/
			},
		],
	},
	{
		path: '/guides/how-to-prepare-subtitles-for-youtube-upload/',
		expect: [
			{
				label: 'YouTube upload preparation guide CTR title',
				match: '<title>Prepare Subtitles for YouTube Upload - SRT Checklist</title>',
			},
			{
				label: 'YouTube upload preparation guide meta description',
				match: 'Prepare subtitles for YouTube upload with a clean SRT checklist. Fix timing, formatting, encoding, cue order, and upload errors before publishing.',
			},
			{
				label: 'YouTube upload preparation guide opens cleaner tool',
				match: 'href="/tools/subtitle-cleaner/"',
			},
			{
				label: 'YouTube upload preparation guide links to SRT validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube upload preparation questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What should I check before uploading subtitles to YouTube\?/
			},
		],
	},
	{
		path: '/guides/why-youtube-subtitles-upload-failed/',
		expect: [
			{
				label: 'YouTube upload failure guide CTR title',
				match: '<title>YouTube Subtitle Upload Failed - Fix SRT Caption Errors</title>',
			},
			{
				label: 'YouTube upload failure guide repair meta description',
				match: 'Fix YouTube subtitle upload failures by checking SRT timestamps, cue numbers, encoding, file type, and unsupported styling before uploading again.',
			},
			{
				label: 'YouTube upload failure guide opens converter tool',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'YouTube upload failure guide links to validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube upload failure questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why did my YouTube subtitle upload fail\?/
			},
		],
	},
	{
		path: '/guides/why-srt-file-wont-upload/',
		expect: [
			{
				label: 'SRT upload failure guide CTR title',
				match: '<title>SRT File Won&#39;t Upload - Fix Subtitle Format Errors</title>',
			},
			{
				label: 'SRT upload failure guide repair meta description',
				match: 'Fix an SRT file that will not upload by checking timestamp commas, cue numbers, blank lines, encoding, file structure, and unsupported markup.',
			},
			{
				label: 'SRT upload failure guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'SRT upload failure guide links to timestamp fixer',
				match: 'href="/tools/fix-srt-timestamps/"',
			},
			{
				label: 'FAQ schema for SRT upload failure questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why will my SRT file not upload\?/
			},
		],
	},
	{
		path: '/guides/how-to-remove-subtitle-line-numbers/',
		expect: [
			{
				label: 'line number guide opens line number tool',
				match: 'href="/tools/remove-srt-line-numbers/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-malformed-srt-timestamps/',
		expect: [
			{
				label: 'malformed SRT timestamp guide opens timestamp fixer',
				match: 'href="/tools/fix-srt-timestamps/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-vtt-mime-type-for-html5-video/',
		expect: [
			{
				label: 'VTT MIME guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/why-subtitles-do-not-show-in-html5-video/',
		expect: [
			{
				label: 'FAQ schema for HTML5 subtitle troubleshooting',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing in HTML5 video\?/
			},
			{
				label: 'HTML5 troubleshooting guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
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
			{
				label: 'HowTo schema for tool workflow',
				match: /"@type"\s*:\s*"HowTo"/,
			},
			{
				label: 'visible ordered tool workflow steps',
				match: /<ol\b[\s\S]*Add a supported subtitle file/,
			},
			{
				label: 'tool edit quality analytics event',
				match: 'subtitle_tool_edit_input',
			},
			{
				label: 'download analytics avoids local filenames',
				match: 'output_extension',
			},
			{
				label: 'tool ad placeholder stays below workspace',
				after: ['class="workspace"', 'data-ad-slot="tool-below-workflow"'],
			},
			{
				label: 'tool ad placeholder is hidden from assistive tech',
				match: 'data-ad-slot="tool-below-workflow" aria-hidden="true"',
			},
			{
				label: 'tool page does not enable ads before readiness gate',
				absent: 'data-ads-enabled="true"',
			},
		],
	},
	{
		path: '/privacy-policy/',
		expect: [
			{
				label: 'privacy policy says analytics avoids local file names',
				match: 'Analytics events do not intentionally include subtitle text or local file names.',
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
	{
		path: '/llms.txt',
		expect: [
			{
				label: 'llms lists YouTube converter tool',
				match: 'https://subtitletoolkit.tools/tools/youtube-subtitle-converter/',
			},
			{
				label: 'llms lists SRT validator tool',
				match: 'https://subtitletoolkit.tools/tools/srt-validator/',
			},
			{
				label: 'llms lists WebVTT validator tool',
				match: 'https://subtitletoolkit.tools/tools/webvtt-validator/',
			},
			{
				label: 'llms lists SRT timestamp fixer tool',
				match: 'https://subtitletoolkit.tools/tools/fix-srt-timestamps/',
			},
			{
				label: 'llms lists invalid WebVTT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-invalid-webvtt-timestamps/',
			},
			{
				label: 'llms lists HTML5 subtitle troubleshooting guide',
				match: 'https://subtitletoolkit.tools/guides/why-subtitles-do-not-show-in-html5-video/',
			},
			{
				label: 'llms lists malformed SRT timestamp guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-malformed-srt-timestamps/',
			},
			{
				label: 'llms lists scene-cut sync guide',
				match: 'https://subtitletoolkit.tools/guides/fix-subtitle-sync-after-a-scene-cut/',
			},
			{
				label: 'llms lists WebVTT validation guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-validate-webvtt-files/',
			},
			{
				label: 'llms lists SRT validation guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-validate-srt-files/',
			},
			{
				label: 'llms lists YouTube upload failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/',
			},
			{
				label: 'llms lists YouTube subtitle conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-youtube/',
			},
			{
				label: 'llms lists YouTube upload preparation guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-prepare-subtitles-for-youtube-upload/',
			},
			{
				label: 'llms lists YouTube SRT settings guide',
				match: 'https://subtitletoolkit.tools/guides/best-srt-settings-for-youtube-upload/',
			},
			{
				label: 'llms lists YouTube SRT vs ASS guide',
				match: 'https://subtitletoolkit.tools/guides/srt-vs-ass-for-youtube-captions/',
			},
			{
				label: 'llms lists SRT upload failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-srt-file-wont-upload/',
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

	if (expectation.after) {
		const [first, second] = expectation.after;
		const firstIndex = html.indexOf(first);
		const secondIndex = html.indexOf(second);
		return {
			ok: firstIndex >= 0 && secondIndex > firstIndex,
			actual: `${firstIndex}, ${secondIndex}`,
			expected: `${first} before ${second}`,
		};
	}

	if (expectation.absent) {
		return {
			ok: !html.includes(expectation.absent),
			actual: html.includes(expectation.absent) ? 'present' : 'absent',
			expected: 'absent',
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
