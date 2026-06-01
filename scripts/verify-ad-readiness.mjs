import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

function getArg(name) {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : null;
}

function hasFlag(name) {
	return args.includes(name);
}

function usage() {
	console.log(`Usage:
  pnpm ads:ready -- --organic-pageviews 1000 --pages-with-impressions 20 --pages-with-clicks 10 --tool-starts 100 --tool-outputs 20

Optional:
  --dist dist
  --skip-build

Fails closed unless traffic, GSC, tool engagement, and static ad safety checks all pass.`);
}

if (hasFlag('--help')) {
	usage();
	process.exit(0);
}

function integerArg(name) {
	const raw = getArg(name);
	if (raw === null) return null;
	const parsed = Number.parseInt(raw, 10);
	if (!Number.isFinite(parsed) || parsed < 0) {
		console.error(`${name} must be a non-negative integer.`);
		process.exit(1);
	}
	return parsed;
}

const organicPageviews = integerArg('--organic-pageviews');
const pagesWithImpressions = integerArg('--pages-with-impressions');
const pagesWithClicks = integerArg('--pages-with-clicks');
const toolStarts = integerArg('--tool-starts');
const toolOutputs = integerArg('--tool-outputs');
const distDir = resolve(getArg('--dist') || 'dist');

function fail(message) {
	console.error(message);
	process.exit(1);
}

for (const [name, value] of [
	['--organic-pageviews', organicPageviews],
	['--pages-with-impressions', pagesWithImpressions],
	['--pages-with-clicks', pagesWithClicks],
	['--tool-starts', toolStarts],
	['--tool-outputs', toolOutputs],
]) {
	if (value === null) fail(`${name} is required.`);
}

if (!hasFlag('--skip-build')) {
	const build = spawnSync('pnpm', ['build'], { stdio: 'inherit' });
	if (build.status !== 0) process.exit(build.status ?? 1);
}

function readDistPage(path) {
	const filePath = path === '/'
		? resolve(distDir, 'index.html')
		: resolve(distDir, path.replace(/^\//, ''), 'index.html');
	if (!existsSync(filePath)) fail(`Missing built page: ${filePath}`);
	return readFileSync(filePath, 'utf8');
}

function check(label, passed, detail = '') {
	console.log(`${passed ? 'PASS' : 'FAIL'} ${label}${detail ? ` - ${detail}` : ''}`);
	return passed;
}

const toolHtml = readDistPage('/tools/srt-to-vtt/');
const homeHtml = readDistPage('/');
const cssPath = resolve('src/styles/global.css');
const staticCss = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';

const results = [];
results.push(check('organic pageviews gate', organicPageviews >= 1000, `${organicPageviews}/1000`));
results.push(check('pages with impressions gate', pagesWithImpressions >= 20, `${pagesWithImpressions}/20`));
results.push(check('pages with clicks gate', pagesWithClicks >= 10, `${pagesWithClicks}/10`));
results.push(check('tool starts present', toolStarts > 0, String(toolStarts)));
results.push(check('tool outputs present', toolOutputs > 0, String(toolOutputs)));
results.push(check('tool output rate gate', toolStarts > 0 && toolOutputs / toolStarts >= 0.1, `${toolStarts === 0 ? '0.00' : ((toolOutputs / toolStarts) * 100).toFixed(2)}%/10%`));
results.push(check('tool ad slot stays below workspace', toolHtml.indexOf('class="workspace"') >= 0 && toolHtml.indexOf('class="workspace"') < toolHtml.indexOf('data-ad-slot="tool-below-workflow"')));
results.push(check('tool ad slot hidden while inactive', toolHtml.includes('data-ad-slot="tool-below-workflow" aria-hidden="true"')));
results.push(check('home ad slot hidden while inactive', homeHtml.includes('data-ad-slot="home-below-trust" aria-hidden="true"')));
results.push(check('ads are not enabled by default', !toolHtml.includes('data-ads-enabled="true"') && !homeHtml.includes('data-ads-enabled="true"')));
results.push(check('ad slots remain gated by explicit flag', staticCss.includes("[data-ads-enabled='true'] .ad-slot")));

if (results.every(Boolean)) {
	console.log('\nAd readiness gate passed. Verify mobile layout manually before adding real ad network scripts.');
	process.exit(0);
}

console.log('\nAd readiness gate failed. Keep ads disabled and continue search growth or tool UX work.');
process.exit(1);
