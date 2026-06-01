import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

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
  pnpm promotion:record -- --channel directory --source AlternativeTo --url https://example.com --status submitted

Required:
  --channel gsc|indexnow|directory|reddit|hn|awesome|other
  --source name

Optional:
  --date YYYY-MM-DD
  --status submitted|published|rejected|commented|reviewed|other
  --url https://...
  --notes text
  --file PROMOTION_LOG.md
  --dry-run

Appends a local promotion evidence row for later GSC/Plausible attribution.`);
}

if (hasFlag('--help')) {
	usage();
	process.exit(0);
}

const validChannels = ['gsc', 'indexnow', 'directory', 'reddit', 'hn', 'awesome', 'other'];
const validStatuses = ['submitted', 'published', 'rejected', 'commented', 'reviewed', 'other'];
const date = getArg('--date') || new Date().toISOString().slice(0, 10);
const channel = getArg('--channel');
const source = getArg('--source');
const status = getArg('--status') || 'submitted';
const url = getArg('--url') || '';
const notes = getArg('--notes') || '';
const logPath = resolve(getArg('--file') || 'PROMOTION_LOG.md');

function fail(message) {
	console.error(message);
	process.exit(1);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
	fail('--date must use YYYY-MM-DD format.');
}

if (!validChannels.includes(channel)) {
	fail(`--channel must be one of: ${validChannels.join(', ')}.`);
}

if (!source || source.trim().length === 0) {
	fail('--source is required.');
}

if (!validStatuses.includes(status)) {
	fail(`--status must be one of: ${validStatuses.join(', ')}.`);
}

if (url && !/^https:\/\//.test(url)) {
	fail('--url must start with https:// when provided.');
}

function mdCell(value) {
	return String(value)
		.replace(/\r?\n/g, ' ')
		.replace(/\|/g, '\\|')
		.trim();
}

const row = `| ${mdCell(date)} | ${mdCell(channel)} | ${mdCell(source)} | ${mdCell(status)} | ${mdCell(url)} | ${mdCell(notes)} |`;

const header = `# Promotion Evidence Log

Use this file to record external actions only after they actually happen. Keep rows short so weekly GSC/Plausible reviews can match traffic movement to a specific action.

| Date | Channel | Source | Status | URL | Notes |
| --- | --- | --- | --- | --- | --- |
`;

if (hasFlag('--dry-run')) {
	console.log(row);
	process.exit(0);
}

mkdirSync(dirname(logPath), { recursive: true });
if (!existsSync(logPath) || readFileSync(logPath, 'utf8').trim().length === 0) {
	appendFileSync(logPath, header);
}

appendFileSync(logPath, `${row}\n`);
console.log(`Recorded promotion action in ${logPath}`);
console.log(row);
