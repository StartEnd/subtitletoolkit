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

	const current = run([
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
		'--batch', 'current',
	]);
	assertExit(current, 0);
	assertIncludes(current.stdout, '1. https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/');
	assertIncludes(current.stdout, '| 2026-06-01 | song | Yes | 1 | 2026-06-08 | Submitted current Day 0 URL Inspection queue after production gate passed. |');

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

	console.log('GSC Day 0 list helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
