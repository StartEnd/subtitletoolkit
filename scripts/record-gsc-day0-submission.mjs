import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { userInfo } from 'node:os';
import { todayInLocalTimeZone } from './lib/local-date.mjs';

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
  pnpm gsc:day0:record -- --submitted-on YYYY-MM-DD

Optional:
  --file GSC_DAY0_URLS.md
  --submitted-by name
  --batch primary|current|all
  --next-review-days 7
  --dry-run

Run this only after the manual Search Console sitemap and URL Inspection work is complete.`);
}

if (hasFlag('--help')) {
	usage();
	process.exit(0);
}

const day0Path = resolve(getArg('--file') || 'GSC_DAY0_URLS.md');
const submittedOn = getArg('--submitted-on') || todayInLocalTimeZone();
const submittedBy = getArg('--submitted-by') || userInfo().username || '';
const batch = getArg('--batch') || 'primary';
const nextReviewDays = Number.parseInt(getArg('--next-review-days') || '7', 10);

function fail(message) {
	console.error(message);
	process.exit(1);
}

if (!['primary', 'current', 'all'].includes(batch)) {
	fail('--batch must be one of: primary, current, all.');
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(submittedOn)) {
	fail('--submitted-on must use YYYY-MM-DD format.');
}

if (!Number.isFinite(nextReviewDays) || nextReviewDays < 1) {
	fail('--next-review-days must be a positive integer.');
}

if (!existsSync(day0Path)) {
	fail(`Missing Day 0 file: ${day0Path}`);
}

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

function checkedLine(url) {
	return `- [x] \`${url}\``;
}

function checkUrls(markdown, urls) {
	let updated = markdown;
	for (const url of urls) {
		updated = updated.replace(`- [ ] \`${url}\``, checkedLine(url));
	}
	return updated;
}

function replaceOrAppendSubmissionRow(markdown, row) {
	const placeholder = '| | | No | 0 | | |';
	if (markdown.includes(placeholder)) {
		return markdown.replace(placeholder, row);
	}

	const separator = '| --- | --- | --- | ---: | --- | --- |';
	const index = markdown.indexOf(separator);
	if (index < 0) return markdown;
	const insertAt = index + separator.length;
	return `${markdown.slice(0, insertAt)}\n${row}${markdown.slice(insertAt)}`;
}

const markdown = readFileSync(day0Path, 'utf8');
const sitemapSection = sectionBetween(markdown, '## Sitemap', '## URL Inspection Requests');
const inspectionSection = sectionBetween(markdown, '## URL Inspection Requests', '## After Submission');
const primaryInspectionSection = sectionBetween(
	inspectionSection,
	'### Primary queue',
	'### Current search-growth batch',
) || inspectionSection;
const currentInspectionSection = sectionBetween(
	inspectionSection,
	'### Current search-growth batch',
	'__END_OF_URL_INSPECTION_REQUESTS__',
) || inspectionSection;

const sitemapUrls = unique(checklistUrls(sitemapSection));
const primaryInspectionUrls = unique(checklistUrls(primaryInspectionSection));
const currentInspectionUrls = unique(checklistUrls(currentInspectionSection));
const inspectionUrls = {
	primary: primaryInspectionUrls,
	current: currentInspectionUrls,
	all: unique([...primaryInspectionUrls, ...currentInspectionUrls]),
}[batch];
const nextReviewDate = addDays(submittedOn, nextReviewDays);
const row = `| ${submittedOn} | ${submittedBy} | Yes | ${inspectionUrls.length} | ${nextReviewDate} | Submitted ${batch} Day 0 URL Inspection queue after production gate passed. |`;

if (sitemapUrls.length === 0) {
	fail('No sitemap URL found in the Sitemap section.');
}

if (inspectionUrls.length === 0) {
	fail('No URL Inspection requests found in the URL Inspection Requests section.');
}

let updated = checkUrls(markdown, sitemapUrls);
updated = checkUrls(updated, inspectionUrls);
updated = replaceOrAppendSubmissionRow(updated, row);

if (hasFlag('--dry-run')) {
	console.log(updated);
	process.exit(0);
}

writeFileSync(day0Path, updated);
console.log(`Recorded ${batch} GSC Day 0 submission in ${day0Path}`);
console.log(row);
console.log(`Next review date: ${nextReviewDate}`);
