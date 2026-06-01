import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const verifyLive = args.includes('--live') || process.env.GSC_DAY0_LIVE === '1';
const baseUrl = (process.env.GSC_DAY0_BASE_URL || 'https://subtitletoolkit.tools').replace(/\/$/, '');
const distDir = resolve(process.env.GSC_DAY0_DIST_DIR || 'dist');
const day0Path = resolve(process.env.GSC_DAY0_FILE || 'GSC_DAY0_URLS.md');
const fetchRetries = Number.parseInt(process.env.GSC_DAY0_FETCH_RETRIES || '2', 10);
const fetchRetryDelayMs = Number.parseInt(process.env.GSC_DAY0_FETCH_RETRY_DELAY_MS || '1000', 10);
const fetchTimeoutMs = Number.parseInt(process.env.GSC_DAY0_FETCH_TIMEOUT_MS || '15000', 10);

function readRequiredFile(path) {
	if (!existsSync(path)) {
		throw new Error(`Missing file: ${path}`);
	}

	return readFileSync(path, 'utf8');
}

function day0Urls() {
	const markdown = readRequiredFile(day0Path);
	const matches = [...markdown.matchAll(/`(https:\/\/subtitletoolkit\.tools(?:\/[^`]*)?)`/g)];
	return matches.map((match) => match[1]);
}

function uniqueUrls(urls) {
	return [...new Set(urls)];
}

function pathForUrl(url) {
	return new URL(url).pathname;
}

function htmlFileForPath(path) {
	return path.endsWith('/')
		? join(distDir, path, 'index.html')
		: join(distDir, path.replace(/^\//, ''));
}

function expectedCanonical(path) {
	return `${baseUrl}${path}`;
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchText(url) {
	let lastError;

	for (let attempt = 0; attempt <= fetchRetries; attempt += 1) {
		try {
			const response = await fetch(url, {
				redirect: 'follow',
				signal: AbortSignal.timeout(fetchTimeoutMs),
			});

			if (!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`);
			}

			return response.text();
		} catch (error) {
			lastError = error;

			if (attempt < fetchRetries) {
				await sleep(fetchRetryDelayMs);
			}
		}
	}

	throw lastError;
}

async function fetchRedirect(url) {
	let lastError;

	for (let attempt = 0; attempt <= fetchRetries; attempt += 1) {
		try {
			const response = await fetch(url, {
				method: 'HEAD',
				redirect: 'manual',
				signal: AbortSignal.timeout(fetchTimeoutMs),
			});

			return {
				status: response.status,
				location: response.headers.get('location') ?? '',
			};
		} catch (error) {
			lastError = error;

			if (attempt < fetchRetries) {
				await sleep(fetchRetryDelayMs);
			}
		}
	}

	throw lastError;
}

async function readPageHtml(path) {
	if (verifyLive) {
		return {
			exists: true,
			html: await fetchText(`${baseUrl}${path}`),
			detail: `${baseUrl}${path}`,
		};
	}

	const htmlPath = htmlFileForPath(path);
	if (!existsSync(htmlPath)) {
		return {
			exists: false,
			html: '',
			detail: htmlPath,
		};
	}

	return {
		exists: true,
		html: readRequiredFile(htmlPath),
		detail: htmlPath,
	};
}

async function checkPage(url, sitemapXml) {
	const path = pathForUrl(url);
	let page;

	try {
		page = await readPageHtml(path);
	} catch (error) {
		return {
			path,
			checks: [
				{
					label: verifyLive ? 'live page fetches successfully' : 'dist page exists',
					ok: false,
					detail: error.message,
				},
			],
		};
	}

	if (!page.exists) {
		return {
			path,
			checks: [
				{
					label: 'dist page exists',
					ok: false,
					detail: page.detail,
				},
			],
		};
	}

	const html = page.html;
	const canonical = html.match(/<link rel="canonical" href="([^"]+)"\s*\/?>(?:<\/link>)?/i)?.[1] ?? '';
	const robots = html.match(/<meta name="robots" content="([^"]+)"\s*\/?>(?:<\/meta>)?/i)?.[1] ?? '';
	const expected = expectedCanonical(path);

	const checks = [
		{
			label: verifyLive ? 'live page fetches successfully' : 'dist page exists',
			ok: true,
		},
		{
			label: 'canonical matches final URL',
			ok: canonical === expected,
			detail: canonical || 'missing canonical',
		},
		{
			label: 'not marked noindex',
			ok: !/noindex/i.test(robots),
			detail: robots || 'no robots meta',
		},
		{
			label: 'present in sitemap',
			ok: sitemapXml.includes(`<loc>${expected}</loc>`),
		},
	];

	return { path, checks };
}

const sourceLabel = verifyLive ? baseUrl : distDir;

async function checkRedirectVariant(url, expectedLocation) {
	try {
		const response = await fetchRedirect(url);
		return {
			ok: response.status >= 300 && response.status < 400 && response.location === expectedLocation,
			detail: `${response.status} ${response.location || 'missing location'}`,
		};
	} catch (error) {
		return {
			ok: false,
			detail: error.message,
		};
	}
}

async function runLiveRedirectChecks(urls) {
	if (!verifyLive) return true;

	let passed = true;
	const canonicalUrls = urls
		.filter((url) => !url.endsWith('/sitemap-index.xml'))
		.filter((url) => ['/', '/tools/srt-to-vtt/'].includes(new URL(url).pathname));

	for (const canonicalUrl of canonicalUrls) {
		const url = new URL(canonicalUrl);
		const variants = [
			{
				label: 'www host redirects to canonical host',
				url: `https://www.${url.hostname}${url.pathname}`,
			},
			{
				label: 'http redirects to https canonical URL',
				url: `http://${url.hostname}${url.pathname}`,
			},
		];

		for (const variant of variants) {
			const result = await checkRedirectVariant(variant.url, canonicalUrl);
			if (result.ok) {
				console.log(`PASS ${url.pathname}: ${variant.label}`);
				continue;
			}

			passed = false;
			console.error(`FAIL ${url.pathname}: ${variant.label} (${result.detail})`);
		}
	}

	return passed;
}

function checkRobotsTxt(robotsTxt) {
	return [
		{
			label: 'robots allows all user agents',
			ok: /^User-agent:\s*\*/im.test(robotsTxt),
		},
		{
			label: 'robots allows root crawl',
			ok: /^Allow:\s*\/\s*$/im.test(robotsTxt),
		},
		{
			label: 'robots does not disallow root',
			ok: !/^Disallow:\s*\/\s*$/im.test(robotsTxt),
		},
		{
			label: 'robots points to sitemap index',
			ok: robotsTxt.includes(`Sitemap: ${baseUrl}/sitemap-index.xml`),
		},
	];
}

async function run() {
	const urls = day0Urls();
	const dedupedUrls = uniqueUrls(urls);

	if (urls.length === 0) {
		throw new Error(`No Day 0 URLs found in ${day0Path}`);
	}

	if (dedupedUrls.length !== urls.length) {
		const seen = new Set();
		const duplicates = urls.filter((url) => {
			if (seen.has(url)) return true;
			seen.add(url);
			return false;
		});

		throw new Error(`Duplicate Day 0 URLs found: ${duplicates.join(', ')}`);
	}

	const sitemapIndex = verifyLive
		? await fetchText(`${baseUrl}/sitemap-index.xml`)
		: readRequiredFile(join(distDir, 'sitemap-index.xml'));
	const sitemapXml = verifyLive
		? await fetchText(`${baseUrl}/sitemap-0.xml`)
		: readRequiredFile(join(distDir, 'sitemap-0.xml'));
	const robotsTxt = verifyLive
		? await fetchText(`${baseUrl}/robots.txt`)
		: readRequiredFile(join(distDir, 'robots.txt'));
	let failed = false;

	if (!sitemapIndex.includes(`<loc>${baseUrl}/sitemap-0.xml</loc>`)) {
		failed = true;
		console.error(`FAIL /sitemap-index.xml: points to ${baseUrl}/sitemap-0.xml`);
	} else {
		console.log(`PASS /sitemap-index.xml: points to ${baseUrl}/sitemap-0.xml`);
	}

	for (const check of checkRobotsTxt(robotsTxt)) {
		if (check.ok) {
			console.log(`PASS /robots.txt: ${check.label}`);
			continue;
		}

		failed = true;
		console.error(`FAIL /robots.txt: ${check.label}`);
	}

	for (const url of dedupedUrls) {
		if (url.endsWith('/sitemap-index.xml')) continue;

		const result = await checkPage(url, sitemapXml);
		for (const check of result.checks) {
			if (check.ok) {
				console.log(`PASS ${result.path}: ${check.label}`);
				continue;
			}

			failed = true;
			const detail = check.detail ? ` (${check.detail})` : '';
			console.error(`FAIL ${result.path}: ${check.label}${detail}`);
		}
	}

	const redirectsPassed = await runLiveRedirectChecks(dedupedUrls);
	failed = failed || !redirectsPassed;

	if (failed) {
		console.error('GSC Day 0 verification failed. Fix failed index signals before URL inspection requests.');
		process.exit(1);
	}

	console.log(`GSC Day 0 verification passed for ${dedupedUrls.length - 1} URLs plus sitemap index from ${sourceLabel}.`);
}

try {
	await run();
} catch (error) {
	console.error(error.message);
	process.exit(1);
}
