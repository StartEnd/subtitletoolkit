import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { userInfo } from 'node:os';

const args = process.argv.slice(2);

function getArg(name) {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : null;
}

function usage() {
	console.log(`Usage:
  pnpm gsc:day0:list

Optional:
  --file GSC_DAY0_URLS.md
  --submitted-on YYYY-MM-DD
  --submitted-by name
  --next-review-days 7

This prints the sitemap, URL Inspection queue, and a Submission Record row to paste into GSC_DAY0_URLS.md after the manual Search Console work is done.`);
}

if (args.includes('--help')) {
	usage();
	process.exit(0);
}

const day0Path = resolve(getArg('--file') || 'GSC_DAY0_URLS.md');
const submittedOn = getArg('--submitted-on') || new Date().toISOString().slice(0, 10);
const submittedBy = getArg('--submitted-by') || userInfo().username || '';
const nextReviewDays = Number.parseInt(getArg('--next-review-days') || '7', 10);

if (!/^\d{4}-\d{2}-\d{2}$/.test(submittedOn)) {
	console.error('--submitted-on must use YYYY-MM-DD format.');
	process.exit(1);
}

if (!Number.isFinite(nextReviewDays) || nextReviewDays < 1) {
	console.error('--next-review-days must be a positive integer.');
	process.exit(1);
}

if (!existsSync(day0Path)) {
	console.error(`Missing Day 0 file: ${day0Path}`);
	process.exit(1);
}

const markdown = readFileSync(day0Path, 'utf8');

function addDays(dateString, days) {
	const date = new Date(`${dateString}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString().slice(0, 10);
}

function sectionBetween(text, startHeading, endHeading) {
	const start = text.indexOf(startHeading);
	if (start < 0) return '';
	const afterStart = start + startHeading.length;
	const end = text.indexOf(endHeading, afterStart);
	return text.slice(afterStart, end < 0 ? text.length : end);
}

function checklistUrls(text) {
	return [...text.matchAll(/^- \[[ xX]\] `(https:\/\/subtitletoolkit\.tools[^`]*)`/gm)]
		.map((match) => match[1]);
}

function unique(values) {
	return [...new Set(values)];
}

const sitemapSection = sectionBetween(markdown, '## Sitemap', '## URL Inspection Requests');
const inspectionSection = sectionBetween(markdown, '## URL Inspection Requests', '## After Submission');
const sitemapUrls = unique(checklistUrls(sitemapSection));
const inspectionUrls = unique(checklistUrls(inspectionSection));
const nextReviewDate = addDays(submittedOn, nextReviewDays);

if (sitemapUrls.length === 0) {
	console.error('No sitemap URL found in the Sitemap section.');
	process.exit(1);
}

if (inspectionUrls.length === 0) {
	console.error('No URL Inspection requests found in the URL Inspection Requests section.');
	process.exit(1);
}

console.log('# GSC Day 0 Submission Helper\n');
console.log(`Source: ${day0Path}`);
console.log(`Submitted on: ${submittedOn}`);
console.log(`Submitted by: ${submittedBy}`);
console.log(`Next review date: ${nextReviewDate}\n`);

console.log('## Sitemap To Submit\n');
sitemapUrls.forEach((url, index) => {
	console.log(`${index + 1}. ${url}`);
});

console.log('\n## URL Inspection Queue\n');
inspectionUrls.forEach((url, index) => {
	console.log(`${index + 1}. ${url}`);
});

console.log('\n## Submission Record Row\n');
console.log('Paste this row into the Submission Record table after the manual GSC work is complete.');
console.log('| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |');
console.log('| --- | --- | --- | ---: | --- | --- |');
console.log(`| ${submittedOn} | ${submittedBy} | Yes | ${inspectionUrls.length} | ${nextReviewDate} | Submitted sitemap and Day 0 URL Inspection queue after production gate passed. |`);

console.log('\n## After Manual Submission\n');
console.log('1. Check off submitted items in GSC_DAY0_URLS.md.');
console.log('2. Paste the Submission Record row above into GSC_DAY0_URLS.md.');
console.log('3. Add the same date to GSC_WEEKLY_TRACKER.md if it is not already recorded.');
console.log('4. Wait 5 to 7 days, export GSC Queries/Pages and same-window Plausible data, then run pnpm gsc:analyze.');
