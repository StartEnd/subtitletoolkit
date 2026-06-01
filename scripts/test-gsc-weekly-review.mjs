import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/prepare-gsc-weekly-review.mjs');
const tempDir = mkdtempSync(join(tmpdir(), 'subtitletoolkit-weekly-review-'));

function write(path, contents) {
	mkdirSync(dirname(join(tempDir, path)), { recursive: true });
	writeFileSync(join(tempDir, path), contents);
}

function run(args) {
	return spawnSync(process.execPath, [scriptPath, ...args], {
		cwd: tempDir,
		encoding: 'utf8',
	});
}

function assertExit(result, code) {
	if (result.status !== code) {
		throw new Error(`Expected exit ${code}, got ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
	}
}

function assertIncludes(output, expected) {
	if (!output.includes(expected)) {
		throw new Error(`Expected output to include ${JSON.stringify(expected)}\n\nOutput:\n${output}`);
	}
}

try {
	const missing = run([
		'--organic-pageviews', '123',
		'--tool-starts', '12',
		'--tool-outputs', '3',
		'--week-of', '2026-06-08',
	]);
	assertExit(missing, 1);
	assertIncludes(missing.stdout, 'FAIL queries export exists - gsc-exports/queries.csv');
	assertIncludes(missing.stdout, 'Weekly review inputs are not ready.');

	write('gsc-exports/queries.csv', 'Top queries,Clicks,Impressions,CTR,Position\n');
	write('gsc-exports/pages.csv', 'Top pages,Clicks,Impressions,CTR,Position\n');

	const ready = run([
		'--organic-pageviews', '123',
		'--tool-starts', '12',
		'--tool-outputs', '3',
		'--week-of', '2026-06-08',
	]);
	assertExit(ready, 0);
	assertIncludes(ready.stdout, 'PASS queries export exists - gsc-exports/queries.csv');
	assertIncludes(ready.stdout, 'PASS promotion log state known - PROMOTION_LOG.md not found; analyzer will treat as no promotion evidence');
	assertIncludes(ready.stdout, 'pnpm gsc:analyze -- --queries gsc-exports/queries.csv --pages gsc-exports/pages.csv --promotion-log PROMOTION_LOG.md --week-of 2026-06-08 --organic-pageviews 123 --tool-starts 12 --tool-outputs 3');
	assertIncludes(ready.stdout, 'Weekly review inputs are ready.');

	const missingMetrics = run(['--week-of', '2026-06-08']);
	assertExit(missingMetrics, 1);
	assertIncludes(missingMetrics.stdout, 'FAIL organic pageviews provided - missing');
	assertIncludes(missingMetrics.stdout, '--organic-pageviews <organic-pageviews>');

	const invalidWeek = run([
		'--organic-pageviews', '123',
		'--tool-starts', '12',
		'--tool-outputs', '3',
		'--week-of', '2026/06/08',
	]);
	assertExit(invalidWeek, 1);
	assertIncludes(invalidWeek.stderr, '--week-of must use YYYY-MM-DD format.');

	console.log('GSC weekly review helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
