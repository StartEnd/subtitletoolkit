import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/record-promotion-action.mjs');
const tempDir = mkdtempSync(join(tmpdir(), 'subtitletoolkit-promotion-record-'));
const logPath = join(tempDir, 'PROMOTION_LOG.md');

function run(args) {
	return spawnSync(process.execPath, [scriptPath, ...args], {
		cwd: rootDir,
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
	const dryRun = run([
		'--dry-run',
		'--date', '2026-06-01',
		'--channel', 'directory',
		'--source', 'AlternativeTo',
		'--status', 'submitted',
		'--url', 'https://alternativeto.net/',
		'--notes', 'Submitted primary listing',
	]);
	assertExit(dryRun, 0);
	assertIncludes(dryRun.stdout, '| 2026-06-01 | directory | AlternativeTo | submitted | https://alternativeto.net/ | Submitted primary listing |');

	const write = run([
		'--file', logPath,
		'--date', '2026-06-01',
		'--channel', 'gsc',
		'--source', 'Search Console',
		'--status', 'submitted',
		'--notes', 'Sitemap plus 21 primary URL Inspection requests',
	]);
	assertExit(write, 0);
	assertIncludes(write.stdout, `Recorded promotion action in ${logPath}`);
	const log = readFileSync(logPath, 'utf8');
	assertIncludes(log, '# Promotion Evidence Log');
	assertIncludes(log, '| 2026-06-01 | gsc | Search Console | submitted |  | Sitemap plus 21 primary URL Inspection requests |');

	const invalidChannel = run(['--channel', 'email', '--source', 'List']);
	assertExit(invalidChannel, 1);
	assertIncludes(invalidChannel.stderr, '--channel must be one of: gsc, directory, reddit, hn, awesome, other.');

	const invalidUrl = run(['--channel', 'directory', '--source', 'AlternativeTo', '--url', 'http://example.com']);
	assertExit(invalidUrl, 1);
	assertIncludes(invalidUrl.stderr, '--url must start with https:// when provided.');

	console.log('Promotion record helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
