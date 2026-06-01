import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
  pnpm indexnow:submit

Optional:
  --file GSC_DAY0_URLS.md
  --batch primary|current|all
  --endpoint https://api.indexnow.org/indexnow
  --key 1c7b9f240dbf4d4ca4d7c569f1b27c3a
  --key-location https://subtitletoolkit.tools/indexnow-key.txt
  --live

By default this is a dry run. Use --live only after the URL batch should actually be submitted to IndexNow.`);
}

if (hasFlag('--help')) {
	usage();
	process.exit(0);
}

const day0Path = resolve(getArg('--file') || 'GSC_DAY0_URLS.md');
const batch = getArg('--batch') || 'primary';
const endpoint = getArg('--endpoint') || 'https://api.indexnow.org/indexnow';
const key = getArg('--key') || '1c7b9f240dbf4d4ca4d7c569f1b27c3a';
const keyLocation = getArg('--key-location') || 'https://subtitletoolkit.tools/indexnow-key.txt';
const live = hasFlag('--live');

if (!['primary', 'current', 'all'].includes(batch)) {
	console.error('--batch must be one of: primary, current, all.');
	process.exit(1);
}

if (!/^https:\/\//.test(endpoint)) {
	console.error('--endpoint must start with https://.');
	process.exit(1);
}

if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
	console.error('--key must be 8 to 128 alphanumeric or hyphen characters.');
	process.exit(1);
}

if (!/^https:\/\/subtitletoolkit\.tools\//.test(keyLocation)) {
	console.error('--key-location must be an https://subtitletoolkit.tools/ URL.');
	process.exit(1);
}

if (!existsSync(day0Path)) {
	console.error(`Missing Day 0 file: ${day0Path}`);
	process.exit(1);
}

const markdown = readFileSync(day0Path, 'utf8');

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
) || '';
const primaryInspectionUrls = unique(checklistUrls(primaryInspectionSection));
const currentInspectionUrls = unique(checklistUrls(currentInspectionSection));
const urlList = {
	primary: primaryInspectionUrls,
	current: currentInspectionUrls,
	all: unique([...primaryInspectionUrls, ...currentInspectionUrls]),
}[batch];

if (urlList.length === 0) {
	console.error(`No ${batch} URLs found in ${day0Path}.`);
	process.exit(1);
}

const payload = {
	host: 'subtitletoolkit.tools',
	key,
	keyLocation,
	urlList,
};

console.log('# IndexNow Submission Helper\n');
console.log(`Source: ${day0Path}`);
console.log(`Batch: ${batch}`);
console.log(`Endpoint: ${endpoint}`);
console.log(`Mode: ${live ? 'live' : 'dry-run'}`);
console.log(`URL count: ${urlList.length}\n`);
console.log('## Payload\n');
console.log(JSON.stringify(payload, null, 2));

if (!live) {
	console.log('\nDry run only. Add `--live` after the key file is deployed and you want to notify IndexNow.');
	process.exit(0);
}

const response = await fetch(endpoint, {
	method: 'POST',
	headers: {
		'content-type': 'application/json; charset=utf-8',
	},
	body: JSON.stringify(payload),
});

const body = await response.text();

if (!response.ok) {
	console.error(`IndexNow submission failed with HTTP ${response.status}.`);
	if (body) console.error(body);
	process.exit(1);
}

console.log(`\nIndexNow accepted ${urlList.length} ${batch} URLs with HTTP ${response.status}.`);
if (body) console.log(body);
console.log('\n## Evidence Record Command\n');
console.log('Run this after the live IndexNow submission succeeds so weekly reviews can match Bing/Yandex discovery movement to the action.');
console.log(`pnpm promotion:record -- --channel indexnow --source IndexNow --status submitted --notes "Submitted ${batch} queue with ${urlList.length} URLs"`);
