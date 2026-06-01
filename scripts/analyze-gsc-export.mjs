import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { todayInLocalTimeZone } from './lib/local-date.mjs';

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
  --organic-pageviews 0
  --tool-starts 0
  --tool-outputs 0
  --promotion-log PROMOTION_LOG.md
  --week-of YYYY-MM-DD
  --site https://subtitletoolkit.tools

The script expects Google Search Console CSV exports with columns like:
  Top queries, Clicks, Impressions, CTR, Position
  Top pages, Clicks, Impressions, CTR, Position`);
}

const queriesPath = getArg('--queries');
const pagesPath = getArg('--pages');
const minImpressions = Number.parseInt(getArg('--min-impressions') || '10', 10);
const organicPageviewsArg = getArg('--organic-pageviews');
const organicPageviews = organicPageviewsArg === null ? null : Number.parseInt(organicPageviewsArg, 10);
const toolStartsArg = getArg('--tool-starts');
const toolStarts = toolStartsArg === null ? null : Number.parseInt(toolStartsArg, 10);
const toolOutputsArg = getArg('--tool-outputs');
const toolOutputs = toolOutputsArg === null ? null : Number.parseInt(toolOutputsArg, 10);
const promotionLogPath = getArg('--promotion-log');
const promotionLogExists = promotionLogPath ? existsSync(resolve(promotionLogPath)) : false;
const weekOf = getArg('--week-of') || todayInLocalTimeZone();
const siteUrl = (getArg('--site') || 'https://subtitletoolkit.tools').replace(/\/$/, '');

if (!/^\d{4}-\d{2}-\d{2}$/.test(weekOf)) {
	console.error('--week-of must use YYYY-MM-DD format.');
	process.exit(1);
}

if (organicPageviewsArg !== null && (!Number.isFinite(organicPageviews) || organicPageviews < 0)) {
	console.error('--organic-pageviews must be a non-negative integer.');
	process.exit(1);
}

if (toolStartsArg !== null && (!Number.isFinite(toolStarts) || toolStarts < 0)) {
	console.error('--tool-starts must be a non-negative integer.');
	process.exit(1);
}

if (toolOutputsArg !== null && (!Number.isFinite(toolOutputs) || toolOutputs < 0)) {
	console.error('--tool-outputs must be a non-negative integer.');
	process.exit(1);
}

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

function parseMarkdownTable(text, expectedHeaders) {
	const rows = text
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.startsWith('|') && line.endsWith('|'));

	if (rows.length < 3) return [];

	const headers = rows[0]
		.split('|')
		.slice(1, -1)
		.map(normalizeHeader);
	const expected = expectedHeaders.map(normalizeHeader);
	if (!expected.every((header, index) => headers[index] === header)) return [];

	return rows.slice(2).map((line) => {
		const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
		const record = {};
		headers.forEach((header, index) => {
			record[header] = cells[index] ?? '';
		});
		return record;
	}).filter((record) => Object.values(record).some((value) => value !== ''));
}

function readPromotionLog(path) {
	if (!path) return [];
	const resolved = resolve(path);
	if (!existsSync(resolved)) {
		return [];
	}

	return parseMarkdownTable(readFileSync(resolved, 'utf8'), [
		'Date',
		'Channel',
		'Source',
		'Status',
		'URL',
		'Notes',
	]).filter((record) => record.date !== 'Date').map((record) => ({
		date: record.date,
		channel: record.channel,
		source: record.source,
		status: record.status,
		url: record.url,
		notes: record.notes,
	}));
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
	if (!urlOrPath.startsWith('http')) return normalizeSitePath(urlOrPath);
	try {
		return normalizeSitePath(new URL(urlOrPath).pathname);
	} catch {
		return normalizeSitePath(urlOrPath);
	}
}

function normalizeSitePath(path) {
	if (!path) return '';
	const cleanPath = path.split('?')[0].split('#')[0] || '/';
	if (cleanPath === '/') return '/';
	return cleanPath.endsWith('/') ? cleanPath : `${cleanPath}/`;
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

function weightedAveragePosition(rows) {
	const rowsWithImpressions = rows.filter((row) => row.impressions > 0 && row.position > 0);
	const weightedImpressions = rowsWithImpressions.reduce((total, row) => total + row.impressions, 0);
	if (weightedImpressions === 0) return 0;

	return rowsWithImpressions.reduce(
		(total, row) => total + row.position * row.impressions,
		0,
	) / weightedImpressions;
}

function percent(clicks, impressions) {
	if (impressions === 0) return '0.00%';
	return `${((clicks / impressions) * 100).toFixed(2)}%`;
}

function metricSummary(rows) {
	const impressions = rows.reduce((total, row) => total + row.impressions, 0);
	const clicks = rows.reduce((total, row) => total + row.clicks, 0);

	return {
		clicks,
		impressions,
		ctr: percent(clicks, impressions),
		position: weightedAveragePosition(rows),
	};
}

function gateStatus(ok) {
	return ok ? 'yes' : 'no';
}

function metricOrUnknown(value) {
	return value === null ? 'unknown' : String(value);
}

function rateOrUnknown(numerator, denominator) {
	if (numerator === null || denominator === null) return 'unknown';
	if (denominator === 0) return '0.00%';
	return `${((numerator / denominator) * 100).toFixed(2)}%`;
}

function addDays(dateString, days) {
	const date = new Date(`${dateString}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
}

function trackerCell(value) {
	return value === null || value === undefined ? '' : String(value);
}

function opportunityAction(bucket) {
	return bucket === 'A'
		? 'Rewrite title/meta around the exact query promise.'
		: 'Add 2-4 related internal links and one exact-answer section.';
}

function opportunityReviewAfter(bucket) {
	return bucket === 'A' ? addDays(weekOf, 14) : addDays(weekOf, 21);
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

let promotionRows = [];
try {
	promotionRows = readPromotionLog(promotionLogPath);
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
const querySummary = metricSummary(queryRows);
const pageSummary = metricSummary(pageRows);
const pagesWithImpressions = pageRows.filter((row) => row.impressions > 0).length;
const pagesWithClicks = pageRows.filter((row) => row.clicks > 0).length;
const adReadiness = {
	organicPageviews: organicPageviews !== null && organicPageviews >= 1000,
	pagesWithImpressions: pagesWithImpressions >= 20,
	pagesWithClicks: pagesWithClicks >= 10,
};
const adGateMet = Object.values(adReadiness).every(Boolean);

console.log(`# GSC Opportunity Analysis\n`);
console.log(`Source: ${[queriesPath, pagesPath].filter(Boolean).map((path) => basename(path)).join(', ')}`);
console.log(`Minimum impressions for Bucket A: ${minImpressions}`);
console.log(`Site: ${siteUrl}\n`);

console.log('## Promotion Evidence Window\n');
console.log('Use this to connect external actions with same-window GSC/Plausible movement. Do not treat submissions as wins until referrals, impressions, or clicks move.');
console.log('| Date | Channel | Source | Status | URL | Notes |');
console.log('| --- | --- | --- | --- | --- | --- |');
if (!promotionLogPath) {
	console.log('| No promotion log provided | | | | | Run `pnpm promotion:record` after external actions, then pass `--promotion-log PROMOTION_LOG.md`. |');
} else if (!promotionLogExists) {
	console.log('| Promotion log not found | | | | | Missing local log is treated as no promotion evidence until `pnpm promotion:record` creates it. |');
} else if (promotionRows.length === 0) {
	console.log('| Promotion log has no rows | | | | | |');
} else {
	for (const row of promotionRows.slice(0, 20)) {
		console.log(`| ${mdEscape(row.date)} | ${mdEscape(row.channel)} | ${mdEscape(row.source)} | ${mdEscape(row.status)} | ${mdEscape(row.url)} | ${mdEscape(row.notes)} |`);
	}
}
	console.log('');

console.log('## Weekly Summary Helper\n');
console.log('Use the Pages export for page counts. Use the Queries export for top query opportunities.');
console.log('| Source | Impressions | Clicks | CTR | Avg position | Pages with impressions | Pages with clicks |');
console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
console.log(`| Queries export | ${querySummary.impressions} | ${querySummary.clicks} | ${querySummary.ctr} | ${querySummary.position.toFixed(1)} | | |`);
console.log(`| Pages export | ${pageSummary.impressions} | ${pageSummary.clicks} | ${pageSummary.ctr} | ${pageSummary.position.toFixed(1)} | ${pagesWithImpressions} | ${pagesWithClicks} |`);
console.log('');

console.log('### GSC_WEEKLY_TRACKER.md row\n');
console.log('Paste this into the Weekly Summary table, then replace the action/review fields if needed.');
console.log('| Week of | Impressions | Clicks | CTR | Avg position | Pages with impressions | Pages with clicks | Main action shipped | Next review date |');
console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |');
console.log(`| ${weekOf} | ${pageSummary.impressions} | ${pageSummary.clicks} | ${pageSummary.ctr} | ${pageSummary.position.toFixed(1)} | ${pagesWithImpressions} | ${pagesWithClicks} | Review GSC opportunity buckets and ship one focused batch. | ${addDays(weekOf, 7)} |`);
console.log('');

console.log('## Ad Readiness Gate\n');
console.log('Use organic pageviews from Plausible or another analytics source for the same 28-day window.');
console.log('| Gate item | Current | Target | Met? |');
console.log('| --- | ---: | ---: | --- |');
console.log(`| Organic pageviews last 28 days | ${metricOrUnknown(organicPageviews)} | 1000 | ${gateStatus(adReadiness.organicPageviews)} |`);
console.log(`| Pages with organic impressions | ${pagesWithImpressions} | 20 | ${gateStatus(adReadiness.pagesWithImpressions)} |`);
console.log(`| Pages with organic clicks | ${pagesWithClicks} | 10 | ${gateStatus(adReadiness.pagesWithClicks)} |`);
console.log(`\nAd gate met: ${adGateMet ? 'yes' : 'no'}\n`);

console.log('## Traffic Quality Snapshot\n');
console.log('Use same-window Plausible custom events. Tool starts = subtitle_tool_edit_input + subtitle_tool_adjust_setting + subtitle_tool_upload_file + subtitle_tool_load_sample. Tool outputs = subtitle_tool_copy_output + subtitle_tool_download_output.');
console.log('| Metric | Current | Rate |');
console.log('| --- | ---: | ---: |');
console.log(`| Organic pageviews | ${metricOrUnknown(organicPageviews)} | |`);
console.log(`| Tool starts | ${metricOrUnknown(toolStarts)} | ${rateOrUnknown(toolStarts, organicPageviews)} of organic pageviews |`);
console.log(`| Tool outputs | ${metricOrUnknown(toolOutputs)} | ${rateOrUnknown(toolOutputs, toolStarts)} of tool starts |`);
console.log('');

console.log('### GSC_WEEKLY_TRACKER.md traffic rows\n');
console.log('Paste these into the Ad Readiness Snapshot and Traffic Quality Snapshot tables.');
console.log('| Week of | Organic pageviews last 28 days | Pages with impressions | Pages with clicks | Gate met? | Notes |');
console.log('| --- | ---: | ---: | ---: | --- | --- |');
console.log(`| ${weekOf} | ${trackerCell(organicPageviews)} | ${pagesWithImpressions} | ${pagesWithClicks} | ${adGateMet ? 'Yes' : 'No'} | ${adGateMet ? 'Ad gate met by GSC and analytics thresholds; verify mobile ad UX before enabling ads.' : 'Continue search growth before enabling ads.'} |`);
console.log('');
console.log('| Week of | Tool starts | Starts / organic pageviews | Tool outputs | Outputs / tool starts | Notes |');
console.log('| --- | ---: | ---: | ---: | ---: | --- |');
console.log(`| ${weekOf} | ${trackerCell(toolStarts)} | ${rateOrUnknown(toolStarts, organicPageviews)} | ${trackerCell(toolOutputs)} | ${rateOrUnknown(toolOutputs, toolStarts)} | Compare query promise with actual tool starts and outputs. |`);
console.log('');

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

const nextActionRows = [];
for (const row of zeroClickQueries.slice(0, 5)) {
	const likelyPage = likelyPageForQuery(row.entity, pageCandidates);
	nextActionRows.push({ bucket: 'A', row, likelyPage });
}
for (const row of rankingQueries.slice(0, 5)) {
	const likelyPage = likelyPageForQuery(row.entity, pageCandidates);
	if (nextActionRows.some((item) => item.row.entity === row.entity)) continue;
	nextActionRows.push({ bucket: 'B', row, likelyPage });
}

console.log('\n## Next Batch Queue\n');
console.log('Use this as the shortlist for one focused edit batch. Prefer Bucket A when clicks are still zero.');
console.log('| Priority | Bucket | Query | Likely page | Impressions | Position | Next change | Review after |');
console.log('| ---: | --- | --- | --- | ---: | ---: | --- | --- |');
if (nextActionRows.length === 0) {
	console.log('| | No query opportunities found | | | | | | |');
} else {
	nextActionRows.slice(0, 8).forEach((item, index) => {
		const page = item.likelyPage ? `${siteUrl}${item.likelyPage}` : 'Check GSC Pages tab';
		console.log(`| ${index + 1} | ${item.bucket} | ${mdEscape(item.row.entity)} | ${page} | ${item.row.impressions} | ${item.row.position.toFixed(1)} | ${opportunityAction(item.bucket)} | ${opportunityReviewAfter(item.bucket)} |`);
	});
}
