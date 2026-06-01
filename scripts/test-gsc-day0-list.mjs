import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/prepare-gsc-day0-submission.mjs');
const tempDir = join(tmpdir(), `subtitletoolkit-gsc-day0-list-${process.pid}`);

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

function runGit(args) {
	return spawnSync('git', args, {
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

function assertNotIncludes(output, unexpected) {
	if (output.includes(unexpected)) {
		throw new Error(`Expected output not to include ${JSON.stringify(unexpected)}\n\nOutput:\n${output}`);
	}
}

try {
	write('GSC_DAY0_URLS.md', `# GSC Day 0 Submission URLs

## Sitemap

- [ ] \`https://subtitletoolkit.tools/sitemap-index.xml\`

## URL Inspection Requests

### Primary queue

- [ ] \`https://subtitletoolkit.tools/\`
- [ ] \`https://subtitletoolkit.tools/tools/srt-to-vtt/\`

### Current search-growth batch

- [ ] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`);

	const valid = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
		'--next-review-days', '5',
	]);
	assertExit(valid, 0);
	assertIncludes(valid.stdout, '1. https://subtitletoolkit.tools/sitemap-index.xml');
	assertIncludes(valid.stdout, '2. https://subtitletoolkit.tools/tools/srt-to-vtt/');
	assertIncludes(valid.stdout, 'Primary queue only. Use `--batch current` after Google starts showing crawl or impression movement.');
	assertIncludes(valid.stdout, '| 2026-06-01 | song | Yes | 2 | 2026-06-06 | Submitted primary Day 0 URL Inspection queue after production gate passed. |');
	assertIncludes(valid.stdout, '## Evidence Record Command');
	assertNotIncludes(valid.stdout, '## Deployment Warning');
	assertIncludes(valid.stdout, 'pnpm promotion:record -- --date 2026-06-01 --channel gsc --source "Search Console" --status submitted --notes "Submitted primary Day 0 sitemap plus 2 URL Inspection requests; next review 2026-06-06"');
	assertIncludes(valid.stdout, 'pnpm gsc:day0:record -- --submitted-on 2026-06-01 --submitted-by "song" --batch primary --next-review-days 5');

	const current = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
		'--batch', 'current',
	]);
	assertExit(current, 0);
	assertIncludes(current.stdout, '1. https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/');
	assertIncludes(current.stdout, '| 2026-06-01 | song | Yes | 1 | 2026-06-08 | Submitted current Day 0 URL Inspection queue after production gate passed. |');
	assertIncludes(current.stdout, 'pnpm promotion:record -- --date 2026-06-01 --channel gsc --source "Search Console" --status submitted --notes "Submitted current Day 0 sitemap plus 1 URL Inspection requests; next review 2026-06-08"');

	const all = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
		'--batch', 'all',
	]);
	assertExit(all, 0);
	assertIncludes(all.stdout, '3. https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/');
	assertIncludes(all.stdout, '| 2026-06-01 | song | Yes | 3 | 2026-06-08 | Submitted all Day 0 URL Inspection queue after production gate passed. |');

	const invalidDate = run(['--submitted-on', '2026/06/01']);
	assertExit(invalidDate, 1);
	assertIncludes(invalidDate.stderr, '--submitted-on must use YYYY-MM-DD format.');

	const invalidBatch = run(['--batch', 'everything']);
	assertExit(invalidBatch, 1);
	assertIncludes(invalidBatch.stderr, '--batch must be one of: primary, current, all.');

	assertExit(runGit(['init', '-b', 'main']), 0);
	assertExit(runGit(['config', 'user.email', 'test@example.com']), 0);
	assertExit(runGit(['config', 'user.name', 'Test User']), 0);
	assertExit(runGit(['add', 'GSC_DAY0_URLS.md']), 0);
	assertExit(runGit(['commit', '-m', 'Initial queue']), 0);
	assertExit(runGit(['update-ref', 'refs/remotes/origin/main', 'HEAD']), 0);
	write('dirty-marker.txt', 'uncommitted local change\n');

	const dirty = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
	]);
	assertExit(dirty, 0);
	assertIncludes(dirty.stdout, '## Deployment Warning');
	assertIncludes(dirty.stdout, 'Git sync: 0 ahead, 0 behind origin/main');
	assertIncludes(dirty.stdout, 'Worktree: uncommitted changes');
	assertIncludes(dirty.stdout, 'Commit or discard local changes, push/pull as needed, deploy, and rerun `pnpm verify:gsc:submit-ready` before using this queue for manual Search Console requests.');

	rmSync(join(tempDir, 'dirty-marker.txt'), { force: true });
	write('deploy-marker.txt', 'local-only change\n');
	assertExit(runGit(['add', 'deploy-marker.txt']), 0);
	assertExit(runGit(['commit', '-m', 'Local queue change']), 0);

	const ahead = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
	]);
	assertExit(ahead, 0);
	assertIncludes(ahead.stdout, '## Deployment Warning');
	assertIncludes(ahead.stdout, 'Worktree: clean');
	assertIncludes(ahead.stdout, 'Git sync: 1 ahead, 0 behind origin/main');
	assertIncludes(ahead.stdout, 'Commit or discard local changes, push/pull as needed, deploy, and rerun `pnpm verify:gsc:submit-ready` before using this queue for manual Search Console requests.');

	const originMain = runGit(['rev-parse', '--short', 'origin/main']).stdout.trim();
	write('GSC_DAY0_URLS.md', `# GSC Day 0 Submission URLs

Latest production gate: \`pnpm verify:gsc:submit-ready\` passed on 2026-06-01 against the live \`${originMain}\` deployment.

## Sitemap

- [ ] \`https://subtitletoolkit.tools/sitemap-index.xml\`

## URL Inspection Requests

### Primary queue

- [ ] \`https://subtitletoolkit.tools/\`

### Current search-growth batch

- [ ] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`);
	assertExit(runGit(['add', 'GSC_DAY0_URLS.md']), 0);
	assertExit(runGit(['commit', '-m', 'Record production gate']), 0);

	const aheadWithCurrentGate = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
	]);
	assertExit(aheadWithCurrentGate, 0);
	assertNotIncludes(aheadWithCurrentGate.stdout, '## Deployment Warning');
	assertIncludes(aheadWithCurrentGate.stdout, '1. https://subtitletoolkit.tools/sitemap-index.xml');
	assertIncludes(aheadWithCurrentGate.stdout, '1. https://subtitletoolkit.tools/');

	console.log('GSC Day 0 list helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
