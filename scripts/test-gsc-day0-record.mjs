import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/record-gsc-day0-submission.mjs');
const tempDir = mkdtempSync(join(tmpdir(), 'subtitletoolkit-gsc-day0-record-'));
const day0Path = join(tempDir, 'GSC_DAY0_URLS.md');

function write(path, contents) {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, contents);
}

function sampleDay0() {
	return `# GSC Day 0 Submission URLs

## Submission Record

| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |
| --- | --- | --- | ---: | --- | --- |
| | | No | 0 | | |

## Sitemap

- [ ] \`https://subtitletoolkit.tools/sitemap-index.xml\`

## URL Inspection Requests

### Primary queue

- [ ] \`https://subtitletoolkit.tools/\`
- [ ] \`https://subtitletoolkit.tools/tools/srt-to-vtt/\`

### Current search-growth batch

- [ ] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`;
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

function assertNotIncludes(output, expected) {
	if (output.includes(expected)) {
		throw new Error(`Expected output not to include ${JSON.stringify(expected)}\n\nOutput:\n${output}`);
	}
}

try {
	write(day0Path, sampleDay0());

	const dryRun = run([
		'--file', day0Path,
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
		'--next-review-days', '5',
		'--dry-run',
	]);
	assertExit(dryRun, 0);
	assertIncludes(dryRun.stdout, '- [x] `https://subtitletoolkit.tools/sitemap-index.xml`');
	assertIncludes(dryRun.stdout, '- [x] `https://subtitletoolkit.tools/tools/srt-to-vtt/`');
	assertIncludes(dryRun.stdout, '- [ ] `https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/`');
	assertIncludes(dryRun.stdout, '| 2026-06-01 | song | Yes | 2 | 2026-06-06 | Submitted primary Day 0 URL Inspection queue after production gate passed. |');
	assertIncludes(readFileSync(day0Path, 'utf8'), '| | | No | 0 | | |');

	const writePrimary = run([
		'--file', day0Path,
		'--submitted-on', '2026-06-01',
		'--submitted-by', 'song',
	]);
	assertExit(writePrimary, 0);
	assertIncludes(writePrimary.stdout, `Recorded primary GSC Day 0 submission in ${day0Path}`);
	const primaryLog = readFileSync(day0Path, 'utf8');
	assertIncludes(primaryLog, '- [x] `https://subtitletoolkit.tools/`');
	assertIncludes(primaryLog, '- [x] `https://subtitletoolkit.tools/tools/srt-to-vtt/`');
	assertIncludes(primaryLog, '- [ ] `https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/`');
	assertIncludes(primaryLog, '| 2026-06-01 | song | Yes | 2 | 2026-06-08 | Submitted primary Day 0 URL Inspection queue after production gate passed. |');
	assertNotIncludes(primaryLog, '| | | No | 0 | | |');

	write(day0Path, sampleDay0());
	const current = run([
		'--file', day0Path,
		'--submitted-on', '2026-06-02',
		'--submitted-by', 'song',
		'--batch', 'current',
	]);
	assertExit(current, 0);
	const currentLog = readFileSync(day0Path, 'utf8');
	assertIncludes(currentLog, '- [x] `https://subtitletoolkit.tools/sitemap-index.xml`');
	assertIncludes(currentLog, '- [ ] `https://subtitletoolkit.tools/`');
	assertIncludes(currentLog, '- [x] `https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/`');
	assertIncludes(currentLog, '| 2026-06-02 | song | Yes | 1 | 2026-06-09 | Submitted current Day 0 URL Inspection queue after production gate passed. |');

	const invalidBatch = run(['--file', day0Path, '--batch', 'later']);
	assertExit(invalidBatch, 1);
	assertIncludes(invalidBatch.stderr, '--batch must be one of: primary, current, all.');

	console.log('GSC Day 0 record helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
