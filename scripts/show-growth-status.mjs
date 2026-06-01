import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);

function getArg(name) {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : null;
}

function usage() {
	console.log(`Usage:
  pnpm growth:status

Optional:
  --day0-file GSC_DAY0_URLS.md
  --indexnow-key-file public/indexnow-key.txt
  --promotion-log PROMOTION_LOG.md
  --today YYYY-MM-DD

Prints the current search-growth execution state without changing files.`);
}

if (args.includes('--help')) {
	usage();
	process.exit(0);
}

const day0Path = resolve(getArg('--day0-file') || 'GSC_DAY0_URLS.md');
const indexNowKeyPath = resolve(getArg('--indexnow-key-file') || 'public/indexnow-key.txt');
const promotionLogPath = resolve(getArg('--promotion-log') || 'PROMOTION_LOG.md');
const today = getArg('--today') || new Date().toISOString().slice(0, 10);

function fail(message) {
	console.error(message);
	process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) {
	fail('--today must use YYYY-MM-DD format.');
}

if (!existsSync(day0Path)) {
	fail(`Missing Day 0 file: ${day0Path}`);
}

function addDays(dateString, days) {
	const date = new Date(`${dateString}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
}

function daysUntil(dateString) {
	const oneDay = 24 * 60 * 60 * 1000;
	const from = new Date(`${today}T00:00:00Z`);
	const to = new Date(`${dateString}T00:00:00Z`);
	return Math.round((to - from) / oneDay);
}

function sectionBetween(text, startHeading, endHeading) {
	const start = text.indexOf(startHeading);
	if (start < 0) return '';
	const afterStart = start + startHeading.length;
	const end = text.indexOf(endHeading, afterStart);
	return text.slice(afterStart, end < 0 ? text.length : end);
}

function checklistStats(text) {
	const items = [...text.matchAll(/^- \[([ xX])\] `https:\/\/subtitletoolkit\.tools[^`]*`/gm)];
	return {
		total: items.length,
		checked: items.filter((match) => match[1].toLowerCase() === 'x').length,
	};
}

function parseTableRows(text, expectedHeaderPrefix) {
	const lines = text.split(/\r?\n/).map((line) => line.trim());
	const headerIndex = lines.findIndex((line) => line.startsWith(expectedHeaderPrefix));
	if (headerIndex < 0) return [];

	return lines.slice(headerIndex + 2)
		.filter((line) => line.startsWith('|') && line.endsWith('|'))
		.map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()))
		.filter((cells) => cells.some((cell) => cell.length > 0));
}

const day0Markdown = readFileSync(day0Path, 'utf8');
const latestProductionGate = day0Markdown.match(/^Latest production gate:\s*(.+)$/m)?.[1]?.trim() || null;
const sitemapSection = sectionBetween(day0Markdown, '## Sitemap', '## URL Inspection Requests');
const inspectionSection = sectionBetween(day0Markdown, '## URL Inspection Requests', '## After Submission');
const primarySection = sectionBetween(inspectionSection, '### Primary queue', '### Current search-growth batch') || inspectionSection;
const currentSection = sectionBetween(inspectionSection, '### Current search-growth batch', '## After Submission') || '';
const sitemapStats = checklistStats(sitemapSection);
const primaryStats = checklistStats(primarySection);
const currentStats = checklistStats(currentSection);

const submissionRows = parseTableRows(day0Markdown, '| Submitted on | Submitted by | Sitemap submitted? |');
const submittedRows = submissionRows.filter((cells) => cells[0] && cells[2] === 'Yes' && Number.parseInt(cells[3] || '0', 10) > 0);
const latestSubmission = submittedRows.at(-1) || null;

let promotionRows = [];
if (existsSync(promotionLogPath)) {
	promotionRows = parseTableRows(readFileSync(promotionLogPath, 'utf8'), '| Date | Channel | Source | Status | URL | Notes |')
		.filter((cells) => cells[0] && cells[1]);
}
const gscEvidenceRows = promotionRows.filter((cells) => cells[1] === 'gsc' && cells[3] === 'submitted');
const latestGscEvidence = gscEvidenceRows.at(-1) || null;
const indexNowEvidenceRows = promotionRows.filter((cells) => cells[1] === 'indexnow' && cells[3] === 'submitted');
const latestIndexNowEvidence = indexNowEvidenceRows.at(-1) || null;
const priorityPromotionSources = ['AlternativeTo', 'tinytools.directory', 'SaaSHub', 'GitHub awesome subtitle list'];
const submittedPromotionRows = promotionRows.filter((cells) => ['directory', 'awesome'].includes(cells[1]) && cells[3] === 'submitted');
const submittedPromotionSources = new Set(submittedPromotionRows.map((cells) => cells[2]));
const completedPromotionSources = priorityPromotionSources.filter((source) => submittedPromotionSources.has(source));
const missingPromotionSources = priorityPromotionSources.filter((source) => !submittedPromotionSources.has(source));

console.log('# Search Growth Status\n');
console.log(`Today: ${today}`);
console.log(`Day 0 file: ${day0Path}`);
console.log(`IndexNow key file: ${existsSync(indexNowKeyPath) ? indexNowKeyPath : 'not found'}`);
console.log(`Promotion log: ${existsSync(promotionLogPath) ? promotionLogPath : 'not found'}\n`);

console.log('## GSC Day 0\n');
console.log(`Latest production gate: ${latestProductionGate || 'not recorded'}`);
console.log(`Sitemap checklist: ${sitemapStats.checked}/${sitemapStats.total} checked`);
console.log(`Primary URL Inspection queue: ${primaryStats.checked}/${primaryStats.total} checked`);
console.log(`Current URL Inspection queue: ${currentStats.checked}/${currentStats.total} checked`);
if (latestSubmission) {
	const [submittedOn, submittedBy, , inspectionCount, reviewDate, notes] = latestSubmission;
	console.log(`Submission record: submitted on ${submittedOn} by ${submittedBy || 'unknown'} (${inspectionCount} URL Inspection requests)`);
	console.log(`Next review date: ${reviewDate || 'missing'}`);
	if (reviewDate) {
		const remaining = daysUntil(reviewDate);
		console.log(`Review timing: ${remaining <= 0 ? 'due now' : `${remaining} day(s) remaining`}`);
	}
	console.log(`Notes: ${notes || 'none'}`);
} else {
	console.log('Submission record: pending');
	console.log(`If submitted today, next review date: ${addDays(today, 7)}`);
}

console.log('\n## IndexNow\n');
console.log(`Public key file: ${existsSync(indexNowKeyPath) ? 'ready' : 'missing'}`);
if (latestIndexNowEvidence) {
	console.log(`Latest IndexNow evidence: ${latestIndexNowEvidence[0]} - ${latestIndexNowEvidence[5] || 'no notes'}`);
} else if (existsSync(promotionLogPath)) {
	console.log('Latest IndexNow evidence: missing from promotion log');
} else {
	console.log('Latest IndexNow evidence: promotion log not created yet');
}

if (!existsSync(indexNowKeyPath)) {
	console.log('Next IndexNow action: deploy a public key file before live submission.');
} else if (!latestIndexNowEvidence) {
	console.log('Next IndexNow action: after deployment, run `pnpm indexnow:submit`, then `pnpm indexnow:submit -- --live` if the key URL is live.');
} else {
	console.log('Next IndexNow action: wait for crawler movement before submitting another batch.');
}

console.log('\n## Promotion Evidence\n');
if (latestGscEvidence) {
	console.log(`Latest GSC evidence: ${latestGscEvidence[0]} - ${latestGscEvidence[5] || 'no notes'}`);
} else if (existsSync(promotionLogPath)) {
	console.log('Latest GSC evidence: missing from promotion log');
} else {
	console.log('Latest GSC evidence: promotion log not created yet');
}

console.log(`Priority external submissions: ${completedPromotionSources.length}/${priorityPromotionSources.length} recorded`);
if (missingPromotionSources.length > 0) {
	console.log(`Missing external submissions: ${missingPromotionSources.join(', ')}`);
}

console.log('\n## Next Action\n');
if (!latestSubmission) {
	if (!latestProductionGate) {
		console.log('1. Run `pnpm verify:gsc:submit-ready`.');
		console.log('2. Run `pnpm gsc:day0:list` and submit the sitemap plus primary URL Inspection queue in Search Console.');
		console.log('3. Run the `gsc:day0:record` command printed by `pnpm gsc:day0:list`.');
		console.log('4. Run the `promotion:record` command printed by `pnpm gsc:day0:list`.');
	} else {
		console.log('1. Run `pnpm gsc:day0:list` and submit the sitemap plus primary URL Inspection queue in Search Console.');
		console.log('2. Run the `gsc:day0:record` command printed by `pnpm gsc:day0:list`.');
		console.log('3. Run the `promotion:record` command printed by `pnpm gsc:day0:list`.');
	}
} else if (!latestGscEvidence) {
	console.log('Run the `promotion:record` command from `pnpm gsc:day0:list` so the submission can be attributed during weekly review.');
} else if (!latestIndexNowEvidence && existsSync(indexNowKeyPath)) {
	console.log('After deployment, run `pnpm indexnow:submit -- --live`, then record it with `pnpm promotion:record -- --channel indexnow --source IndexNow --status submitted`.');
} else if (completedPromotionSources.length < priorityPromotionSources.length) {
	console.log('Run `pnpm promotion:kit -- --section directory --check-assets`, submit the priority directory/awesome targets, then record each external action.');
} else if (currentStats.total > 0 && currentStats.checked === 0 && primaryStats.checked === primaryStats.total) {
	console.log('After primary crawl or impression movement appears, run `pnpm gsc:day0:list -- --batch current` and submit the current search-growth queue.');
} else {
	console.log('Wait for the review date, export GSC Queries/Pages and same-window analytics, then run `pnpm gsc:analyze`.');
}
