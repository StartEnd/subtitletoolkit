import { existsSync } from 'node:fs';
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
  pnpm gsc:review:ready -- --organic-pageviews 123 --tool-starts 12 --tool-outputs 3

Optional:
  --queries gsc-exports/queries.csv
  --pages gsc-exports/pages.csv
  --promotion-log PROMOTION_LOG.md
  --week-of YYYY-MM-DD

Checks local weekly review inputs and prints the exact gsc:analyze command.`);
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

const queriesPath = getArg('--queries') || 'gsc-exports/queries.csv';
const pagesPath = getArg('--pages') || 'gsc-exports/pages.csv';
const promotionLogPath = getArg('--promotion-log') || 'PROMOTION_LOG.md';
const weekOf = getArg('--week-of') || new Date().toISOString().slice(0, 10);
const organicPageviews = integerArg('--organic-pageviews');
const toolStarts = integerArg('--tool-starts');
const toolOutputs = integerArg('--tool-outputs');

if (!/^\d{4}-\d{2}-\d{2}$/.test(weekOf)) {
	console.error('--week-of must use YYYY-MM-DD format.');
	process.exit(1);
}

function shellQuote(value) {
	if (/^[A-Za-z0-9_./:=@+-]+$/.test(value)) return value;
	return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function line(label, ok, detail) {
	console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` - ${detail}` : ''}`);
	return ok;
}

const checks = [];
checks.push(line('queries export exists', existsSync(resolve(queriesPath)), queriesPath));
checks.push(line('pages export exists', existsSync(resolve(pagesPath)), pagesPath));
checks.push(line('organic pageviews provided', organicPageviews !== null, organicPageviews === null ? 'missing' : String(organicPageviews)));
checks.push(line('tool starts provided', toolStarts !== null, toolStarts === null ? 'missing' : String(toolStarts)));
checks.push(line('tool outputs provided', toolOutputs !== null, toolOutputs === null ? 'missing' : String(toolOutputs)));
checks.push(line('promotion log state known', true, existsSync(resolve(promotionLogPath)) ? promotionLogPath : `${promotionLogPath} not found; analyzer will treat as no promotion evidence`));

const command = [
	'pnpm gsc:analyze --',
	'--queries', shellQuote(queriesPath),
	'--pages', shellQuote(pagesPath),
	'--promotion-log', shellQuote(promotionLogPath),
	'--week-of', shellQuote(weekOf),
	'--organic-pageviews', organicPageviews === null ? '<organic-pageviews>' : String(organicPageviews),
	'--tool-starts', toolStarts === null ? '<tool-starts>' : String(toolStarts),
	'--tool-outputs', toolOutputs === null ? '<tool-outputs>' : String(toolOutputs),
].join(' ');

console.log('\n## Weekly Analyze Command\n');
console.log(command);

if (checks.every(Boolean)) {
	console.log('\nWeekly review inputs are ready. Run `pnpm build` before the analyze command if dist is stale.');
	process.exit(0);
}

console.log('\nWeekly review inputs are not ready. Export GSC Queries/Pages and fill same-window Plausible metrics first.');
process.exit(1);
