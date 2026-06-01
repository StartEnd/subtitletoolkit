import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { userInfo } from 'node:os';
import { todayInLocalTimeZone } from './lib/local-date.mjs';

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
  --batch primary|current|all
  --next-review-days 7

This prints the sitemap, URL Inspection queue, and a Submission Record row to paste into GSC_DAY0_URLS.md after the manual Search Console work is done.`);
}

if (args.includes('--help')) {
	usage();
	process.exit(0);
}

const day0Path = resolve(getArg('--file') || 'GSC_DAY0_URLS.md');
const submittedOn = getArg('--submitted-on') || todayInLocalTimeZone();
const submittedBy = getArg('--submitted-by') || userInfo().username || '';
const batch = getArg('--batch') || 'primary';
const nextReviewDays = Number.parseInt(getArg('--next-review-days') || '7', 10);

if (!['primary', 'current', 'all'].includes(batch)) {
	console.error('--batch must be one of: primary, current, all.');
	process.exit(1);
}

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

function git(args) {
	const result = spawnSync('git', args, { encoding: 'utf8' });
	if (result.status !== 0) return null;
	return result.stdout.trim();
}

function deploymentStatus() {
	const counts = git(['rev-list', '--left-right', '--count', 'origin/main...HEAD']);
	const head = git(['rev-parse', '--short', 'HEAD']);
	const upstream = git(['rev-parse', '--short', 'origin/main']);
	const worktreeStatus = git(['status', '--porcelain']);

	if (!counts || !head || !upstream) {
		return { available: false };
	}

	const [behind, ahead] = counts.split(/\s+/).map((value) => Number.parseInt(value, 10));
	return {
		available: true,
		ahead: Number.isFinite(ahead) ? ahead : 0,
		behind: Number.isFinite(behind) ? behind : 0,
		dirty: worktreeStatus !== null && worktreeStatus.length > 0,
		head,
		upstream,
	};
}

function liveGateCommit(text) {
	return text.match(/^Latest production gate:.*live `([0-9a-f]{7,40})` deployment/m)?.[1] || null;
}

function needsDeploymentWarning(deploy, gateCommit) {
	if (!deploy.available) return false;
	if (deploy.dirty || deploy.behind > 0) return true;
	if (deploy.ahead > 0 && gateCommit !== deploy.upstream) return true;
	return false;
}

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
) || (() => {
	const legacyMarker = 'Submit these current search-growth batch URLs next.';
	const markerIndex = inspectionSection.indexOf(legacyMarker);
	return markerIndex >= 0 ? inspectionSection.slice(markerIndex) : '';
})();
const sitemapUrls = unique(checklistUrls(sitemapSection));
const primaryInspectionUrls = unique(checklistUrls(primaryInspectionSection));
const currentInspectionUrls = unique(checklistUrls(currentInspectionSection));
const inspectionUrls = {
	primary: primaryInspectionUrls,
	current: currentInspectionUrls,
	all: unique([...primaryInspectionUrls, ...currentInspectionUrls]),
}[batch];
const nextReviewDate = addDays(submittedOn, nextReviewDays);
const evidenceNotes = `Submitted ${batch} Day 0 sitemap plus ${inspectionUrls.length} URL Inspection requests; next review ${nextReviewDate}`;
const deploy = deploymentStatus();
const gateCommit = liveGateCommit(markdown);

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
console.log(`Batch: ${batch}`);
console.log(`Next review date: ${nextReviewDate}\n`);

if (needsDeploymentWarning(deploy, gateCommit)) {
	console.log('## Deployment Warning\n');
	console.log(`Local HEAD: ${deploy.head}`);
	console.log(`origin/main: ${deploy.upstream}`);
	console.log(`Git sync: ${deploy.ahead} ahead, ${deploy.behind} behind origin/main`);
	console.log(`Worktree: ${deploy.dirty ? 'uncommitted changes' : 'clean'}`);
	console.log('Commit or discard local changes, push/pull as needed, deploy, and rerun `pnpm verify:gsc:submit-ready` before using this queue for manual Search Console requests.\n');
}

console.log('## Sitemap To Submit\n');
sitemapUrls.forEach((url, index) => {
	console.log(`${index + 1}. ${url}`);
});

console.log('\n## URL Inspection Queue\n');
if (batch === 'primary') {
	console.log('Primary queue only. Use `--batch current` after Google starts showing crawl or impression movement.\n');
} else if (batch === 'current') {
	console.log('Current search-growth batch only. Use this after the primary queue has crawl or impression movement.\n');
} else {
	console.log('All queues. Use this only when you intentionally want the full list and understand the GSC request pace.\n');
}
inspectionUrls.forEach((url, index) => {
	console.log(`${index + 1}. ${url}`);
});

console.log('\n## Submission Record Row\n');
console.log('Paste this row into the Submission Record table after the manual GSC work is complete.');
console.log('| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |');
console.log('| --- | --- | --- | ---: | --- | --- |');
console.log(`| ${submittedOn} | ${submittedBy} | Yes | ${inspectionUrls.length} | ${nextReviewDate} | Submitted ${batch} Day 0 URL Inspection queue after production gate passed. |`);

console.log('\n## Evidence Record Command\n');
console.log('Run this after the manual GSC work is complete so the weekly review can connect GSC/Plausible movement to the submission date.');
console.log(`pnpm promotion:record -- --date ${submittedOn} --channel gsc --source "Search Console" --status submitted --notes "${evidenceNotes}"`);

console.log('\n## After Manual Submission\n');
console.log('1. Run this local record command after Search Console confirms the manual work is complete:');
console.log(`   pnpm gsc:day0:record -- --submitted-on ${submittedOn} --submitted-by "${submittedBy}" --batch ${batch} --next-review-days ${nextReviewDays}`);
console.log('2. Run the Evidence Record Command above.');
console.log('3. Add the same date to GSC_WEEKLY_TRACKER.md if it is not already recorded.');
console.log('4. Wait 5 to 7 days, export GSC Queries/Pages and same-window Plausible data, then run pnpm gsc:analyze.');
