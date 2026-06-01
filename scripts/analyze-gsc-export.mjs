import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const args = process.argv.slice(2);

function getArg(name) {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : null;
}

function usage() {
	console.log(`Usage:
  pnpm gsc:analyze -- --queries path/to/queries.csv --pages path/to/pages.csv

Optional:
  --min-impressions 10
  --site https://subtitletoolkit.tools

The script expects Google Search Console CSV exports with columns like:
  Top queries, Clicks, Impressions, CTR, Position
  Top pages, Clicks, Impressions, CTR, Position`);
}

const queriesPath = getArg('--queries');
const pagesPath = getArg('--pages');
const minImpressions = Number.parseInt(getArg('--min-impressions') || '10', 10);
const siteUrl = (getArg('--site') || 'https://subtitletoolkit.tools').replace(/\/$/, '');

if (args.includes('--help') || (!queriesPath && !pagesPath)) {
	usage();
	process.exit(args.includes('--help') ? 0 : 1);
}

function parseCsv(text) {
	const rows = [];
	let row = [];
	let cell = '';
	let quoted = false;

	for (let i = 0; i < text.length; i += 1) {
		const char = text[i];
		const next = text[i + 1];

		if (char === '"') {
			if (quoted && next === '"') {
				cell += '"';
				i += 1;
			} else {
				quoted = !quoted;
			}
			continue;
		}

		if (char === ',' && !quoted) {
			row.push(cell);
			cell = '';
			continue;
		}

		if ((char === '\n' || char === '\r') && !quoted) {
			if (char === '\r' && next === '\n') i += 1;
			row.push(cell);
			if (row.some((value) => value.trim() !== '')) rows.push(row);
			row = [];
			cell = '';
			continue;
		}

		cell += char;
	}

	if (cell || row.length > 0) {
		row.push(cell);
		if (row.some((value) => value.trim() !== '')) rows.push(row);
	}

	return rows;
}

function normalizeHeader(header) {
	return header.trim().toLowerCase().replace(/\s+/g, ' ');
}

function readCsvRecords(path) {
	const resolved = resolve(path);
	if (!existsSync(resolved)) {
		throw new Error(`Missing CSV file: ${resolved}`);
	}

	const rows = parseCsv(readFileSync(resolved, 'utf8'));
	if (rows.length < 2) return [];

	const headers = rows[0].map(normalizeHeader);
	return rows.slice(1).map((row) => {
		const record = {};
		headers.forEach((header, index) => {
			record[header] = row[index]?.trim() ?? '';
		});
		return record;
	});
}

function numberValue(value) {
	if (!value) return 0;
	return Number.parseFloat(String(value).replace(/[% ,]/g, '')) || 0;
}

function getField(record, names) {
	for (const name of names) {
		if (record[name] !== undefined) return record[name];
	}
	return '';
}

function toMetricRows(records, entityNames) {
	return records.map((record) => ({
		entity: getField(record, entityNames),
		clicks: numberValue(getField(record, ['clicks'])),
		impressions: numberValue(getField(record, ['impressions'])),
		ctr: getField(record, ['ctr']),
		position: numberValue(getField(record, ['position', 'avg position', 'average position'])),
	})).filter((row) => row.entity);
}

function mdEscape(value) {
	return String(value).replace(/\|/g, '\\|');
}

function shortPath(urlOrPath) {
	if (!urlOrPath.startsWith('http')) return urlOrPath;
	try {
		return new URL(urlOrPath).pathname;
	} catch {
		return urlOrPath;
	}
}

function listKnownSitePaths() {
	const distDir = resolve('dist');
	if (!existsSync(distDir)) return [];

	const paths = [];
	function walk(dir, prefix = '') {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (entry.isDirectory()) {
				walk(resolve(dir, entry.name), `${prefix}/${entry.name}`);
				continue;
			}

			if (entry.name === 'index.html') paths.push(`${prefix || '/'}/`.replace('//', '/'));
		}
	}

	walk(distDir);
	return paths.filter((path) => !['/404/'].includes(path)).sort();
}

function htmlTitleForPath(path) {
	const filePath = resolve('dist', path === '/' ? 'index.html' : path.replace(/^\//, ''), 'index.html');
	if (!existsSync(filePath)) return '';
	const html = readFileSync(filePath, 'utf8');
	return html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? '';
}

function tokensFor(value) {
	return String(value)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.split(/\s+/)
		.filter((token) => token.length >= 2)
		.filter((token) => !['to', 'for', 'and', 'the', 'with', 'free', 'online'].includes(token));
}

function buildPageCandidates(paths) {
	return paths
		.filter((path) => path.startsWith('/tools/') || path.startsWith('/guides/'))
		.map((path) => ({
			path,
			title: htmlTitleForPath(path),
			searchText: `${path} ${htmlTitleForPath(path)}`.toLowerCase().replace(/[^a-z0-9]+/g, ' '),
			tokens: tokensFor(`${path} ${htmlTitleForPath(path)}`),
		}));
}

function likelyPageForQuery(query, candidates) {
	const queryTokens = tokensFor(query);
	const queryPhrase = query.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
	if (queryTokens.length === 0 || candidates.length === 0) return '';

	const scored = candidates
		.map((candidate) => {
			let score = queryTokens.reduce(
				(total, token) => total + (candidate.tokens.includes(token) ? 1 : 0),
				0,
			);

			if (queryPhrase && candidate.searchText.includes(queryPhrase)) score += 3;
			if (!['/tools/', '/guides/'].includes(candidate.path)) score += 0.5;

			return { ...candidate, score };
		})
		.filter((candidate) => candidate.score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			const aTool = a.path.startsWith('/tools/') ? 1 : 0;
			const bTool = b.path.startsWith('/tools/') ? 1 : 0;
			if (bTool !== aTool) return bTool - aTool;
			return a.path.length - b.path.length;
		});

	return scored[0]?.path ?? '';
}

function buildPageMetricMap(rows) {
	return new Map(rows.map((row) => [shortPath(row.entity), row]));
}

function pageMetricSummary(path, pageMetricMap) {
	if (!path) return 'unknown';
	const metrics = pageMetricMap.get(path);
	if (!metrics) return 'not in pages export';
	return `${metrics.clicks}/${metrics.impressions} clicks/impr, pos ${metrics.position.toFixed(1)}`;
}

let queryRows = [];
let pageRows = [];

try {
	if (queriesPath) {
		queryRows = toMetricRows(readCsvRecords(queriesPath), ['top queries', 'query', 'queries']);
	}
	if (pagesPath) {
		pageRows = toMetricRows(readCsvRecords(pagesPath), ['top pages', 'page', 'pages']);
	}
} catch (error) {
	console.error(error.message);
	process.exit(1);
}

const zeroClickQueries = queryRows
	.filter((row) => row.impressions >= minImpressions && row.clicks === 0)
	.sort((a, b) => b.impressions - a.impressions)
	.slice(0, 20);

const rankingQueries = queryRows
	.filter((row) => row.impressions > 0 && row.position >= 8 && row.position <= 30)
	.sort((a, b) => b.impressions - a.impressions)
	.slice(0, 20);

const knownPaths = listKnownSitePaths();
const pageCandidates = buildPageCandidates(knownPaths);
const pageMetricMap = buildPageMetricMap(pageRows);
const seenPagePaths = new Set(pageRows.map((row) => shortPath(row.entity)));
const indexedNoImpressionCandidates = knownPaths
	.filter((path) => !seenPagePaths.has(path))
	.filter((path) => path.startsWith('/tools/') || path.startsWith('/guides/'))
	.slice(0, 30);

console.log(`# GSC Opportunity Analysis\n`);
console.log(`Source: ${[queriesPath, pagesPath].filter(Boolean).map((path) => basename(path)).join(', ')}`);
console.log(`Minimum impressions for Bucket A: ${minImpressions}`);
console.log(`Site: ${siteUrl}\n`);

console.log('## Bucket A: Impressions >= threshold, Clicks = 0\n');
console.log('| Query | Likely page | Page metrics | Query impressions | Query position | Suggested next change |');
console.log('| --- | --- | --- | ---: | ---: | --- |');
if (zeroClickQueries.length === 0) {
	console.log('| No matching queries found | | | | | |');
} else {
	for (const row of zeroClickQueries) {
		const likelyPage = likelyPageForQuery(row.entity, pageCandidates);
		console.log(`| ${mdEscape(row.entity)} | ${likelyPage ? `${siteUrl}${likelyPage}` : 'Check GSC Pages tab'} | ${pageMetricSummary(likelyPage, pageMetricMap)} | ${row.impressions} | ${row.position.toFixed(1)} | Rewrite title/meta around the exact query promise. |`);
	}
}

console.log('\n## Bucket B: Average Position 8 To 30\n');
console.log('| Query | Likely page | Page metrics | Query impressions | Query position | Suggested next change |');
console.log('| --- | --- | --- | ---: | ---: | --- |');
if (rankingQueries.length === 0) {
	console.log('| No matching queries found | | | | | |');
} else {
	for (const row of rankingQueries) {
		const likelyPage = likelyPageForQuery(row.entity, pageCandidates);
		console.log(`| ${mdEscape(row.entity)} | ${likelyPage ? `${siteUrl}${likelyPage}` : 'Check GSC Pages tab'} | ${pageMetricSummary(likelyPage, pageMetricMap)} | ${row.impressions} | ${row.position.toFixed(1)} | Add 2-4 related internal links and one exact-answer section. |`);
	}
}

console.log('\n## Bucket C: Site Pages Missing From Pages Export\n');
console.log('| Page | Suggested next check |');
console.log('| --- | --- |');
if (!pagesPath) {
	console.log('| Provide --pages export to compare against built site paths. | |');
} else if (knownPaths.length === 0) {
	console.log('| Run `pnpm build` first to compare against local site paths. | |');
} else if (indexedNoImpressionCandidates.length === 0) {
	console.log('| No built guide/tool pages missing from the pages export. | |');
} else {
	for (const path of indexedNoImpressionCandidates) {
		console.log(`| ${siteUrl}${path} | Confirm indexed status, sitemap presence, and internal links. |`);
	}
}
