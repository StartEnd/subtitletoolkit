import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/show-growth-status.mjs');
const tempDir = mkdtempSync(join(tmpdir(), 'subtitletoolkit-growth-status-'));

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
`);

	const pending = run(['--today', '2026-06-01']);
	assertExit(pending, 0);
	assertIncludes(pending.stdout, 'Sitemap checklist: 0/1 checked');
	assertIncludes(pending.stdout, 'Primary URL Inspection queue: 0/2 checked');
	assertIncludes(pending.stdout, 'Submission record: pending');
	assertIncludes(pending.stdout, 'If submitted today, next review date: 2026-06-08');
	assertIncludes(pending.stdout, 'Latest GSC evidence: promotion log not created yet');
	assertIncludes(pending.stdout, 'Run `pnpm verify:gsc:submit-ready`.');
	assertIncludes(pending.stdout, 'Run the `gsc:day0:record` command printed by `pnpm gsc:day0:list`.');
	assertIncludes(pending.stdout, 'Run the `promotion:record` command printed by `pnpm gsc:day0:list`.');

	write('GSC_DAY0_URLS.md', `# GSC Day 0 Submission URLs

## Submission Record

| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |
| --- | --- | --- | ---: | --- | --- |
| 2026-06-01 | song | Yes | 2 | 2026-06-08 | Submitted primary Day 0 URL Inspection queue after production gate passed. |

## Sitemap

- [x] \`https://subtitletoolkit.tools/sitemap-index.xml\`

## URL Inspection Requests

### Primary queue

- [x] \`https://subtitletoolkit.tools/\`
- [x] \`https://subtitletoolkit.tools/tools/srt-to-vtt/\`

### Current search-growth batch

- [ ] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`);

	const submittedNoEvidence = run(['--today', '2026-06-02']);
	assertExit(submittedNoEvidence, 0);
	assertIncludes(submittedNoEvidence.stdout, 'Submission record: submitted on 2026-06-01 by song (2 URL Inspection requests)');
	assertIncludes(submittedNoEvidence.stdout, 'Review timing: 6 day(s) remaining');
	assertIncludes(submittedNoEvidence.stdout, 'Latest GSC evidence: promotion log not created yet');
	assertIncludes(submittedNoEvidence.stdout, 'Run the `promotion:record` command from `pnpm gsc:day0:list`');

	write('PROMOTION_LOG.md', `# Promotion Evidence Log

| Date | Channel | Source | Status | URL | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-06-01 | gsc | Search Console | submitted | | Submitted primary Day 0 sitemap plus 2 URL Inspection requests; next review 2026-06-08 |
`);

	const withEvidence = run(['--today', '2026-06-09']);
	assertExit(withEvidence, 0);
	assertIncludes(withEvidence.stdout, 'Review timing: due now');
	assertIncludes(withEvidence.stdout, 'Latest GSC evidence: 2026-06-01 - Submitted primary Day 0 sitemap plus 2 URL Inspection requests; next review 2026-06-08');
	assertIncludes(withEvidence.stdout, 'Wait for the review date, export GSC Queries/Pages and same-window analytics, then run `pnpm gsc:analyze`.');

	const invalidDate = run(['--today', '2026/06/01']);
	assertExit(invalidDate, 1);
	assertIncludes(invalidDate.stderr, '--today must use YYYY-MM-DD format.');

	console.log('Growth status helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
