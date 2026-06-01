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

function git(cwd, args) {
	const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
	if (result.status !== 0) {
		throw new Error(`git ${args.join(' ')} failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
	}
	return result.stdout.trim();
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
	assertIncludes(pending.stdout, 'Deploy status: unavailable outside a git checkout or without origin/main');
	assertIncludes(pending.stdout, 'IndexNow key file: not found');
	assertIncludes(pending.stdout, 'Latest production gate: not recorded');
	assertIncludes(pending.stdout, 'Primary URL Inspection queue: 0/2 checked');
	assertIncludes(pending.stdout, 'Current URL Inspection queue: 0/1 checked');
	assertIncludes(pending.stdout, 'Submission record: pending');
	assertIncludes(pending.stdout, 'If submitted today, next review date: 2026-06-08');
	assertIncludes(pending.stdout, 'Latest GSC evidence: promotion log not created yet');
	assertIncludes(pending.stdout, 'Public key file: missing');
	assertIncludes(pending.stdout, 'Latest IndexNow evidence: promotion log not created yet');
	assertIncludes(pending.stdout, 'Next IndexNow action: deploy a public key file before live submission.');
	assertIncludes(pending.stdout, 'Priority external submissions: 0/4 recorded');
	assertIncludes(pending.stdout, 'Missing external submissions: AlternativeTo, tinytools.directory, SaaSHub, GitHub awesome subtitle list');
	assertIncludes(pending.stdout, 'Run `pnpm verify:gsc:submit-ready`.');
	assertIncludes(pending.stdout, 'Run the `gsc:day0:record` command printed by `pnpm gsc:day0:list`.');
	assertIncludes(pending.stdout, 'Run the `promotion:record` command printed by `pnpm gsc:day0:list`.');

	write('GSC_DAY0_URLS.md', `# GSC Day 0 Submission URLs

Latest production gate: \`pnpm verify:gsc:submit-ready\` passed on 2026-06-01 against the live \`c28fe59\` deployment using verifier commit \`d4a1d38\`.

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

	const pendingAfterGate = run(['--today', '2026-06-01']);
	assertExit(pendingAfterGate, 0);
	assertIncludes(pendingAfterGate.stdout, 'Latest production gate: `pnpm verify:gsc:submit-ready` passed on 2026-06-01 against the live `c28fe59` deployment using verifier commit `d4a1d38`.');
	assertIncludes(pendingAfterGate.stdout, '1. Run `pnpm gsc:day0:list` and submit the sitemap plus primary URL Inspection queue in Search Console.');
	assertIncludes(pendingAfterGate.stdout, '2. Run the `gsc:day0:record` command printed by `pnpm gsc:day0:list`.');
	assertIncludes(pendingAfterGate.stdout, '3. Run the `promotion:record` command printed by `pnpm gsc:day0:list`.');

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
	write('public/indexnow-key.txt', '1c7b9f240dbf4d4ca4d7c569f1b27c3a\n');

	const submittedNoEvidence = run(['--today', '2026-06-02']);
	assertExit(submittedNoEvidence, 0);
	assertIncludes(submittedNoEvidence.stdout, 'Submission record: submitted on 2026-06-01 by song (2 URL Inspection requests)');
	assertIncludes(submittedNoEvidence.stdout, 'IndexNow key file:');
	assertIncludes(submittedNoEvidence.stdout, 'Current URL Inspection queue: 0/1 checked');
	assertIncludes(submittedNoEvidence.stdout, 'Review timing: 6 day(s) remaining');
	assertIncludes(submittedNoEvidence.stdout, 'Latest GSC evidence: promotion log not created yet');
	assertIncludes(submittedNoEvidence.stdout, 'Public key file: ready');
	assertIncludes(submittedNoEvidence.stdout, 'Next IndexNow action: after deployment, run `pnpm indexnow:submit`, then `pnpm indexnow:submit -- --live` if the key URL is live.');
	assertIncludes(submittedNoEvidence.stdout, 'Priority external submissions: 0/4 recorded');
	assertIncludes(submittedNoEvidence.stdout, 'Run the `promotion:record` command from `pnpm gsc:day0:list`');

	write('PROMOTION_LOG.md', `# Promotion Evidence Log

| Date | Channel | Source | Status | URL | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-06-01 | gsc | Search Console | submitted | | Submitted primary Day 0 sitemap plus 2 URL Inspection requests; next review 2026-06-08 |
| 2026-06-01 | directory | AlternativeTo | submitted | https://alternativeto.net/ | Submitted directory listing for Subtitle Toolkit |
`);

	const withEvidence = run(['--today', '2026-06-09']);
	assertExit(withEvidence, 0);
	assertIncludes(withEvidence.stdout, 'Review timing: due now');
	assertIncludes(withEvidence.stdout, 'Latest GSC evidence: 2026-06-01 - Submitted primary Day 0 sitemap plus 2 URL Inspection requests; next review 2026-06-08');
	assertIncludes(withEvidence.stdout, 'Latest IndexNow evidence: missing from promotion log');
	assertIncludes(withEvidence.stdout, 'Priority external submissions: 1/4 recorded');
	assertIncludes(withEvidence.stdout, 'Missing external submissions: tinytools.directory, SaaSHub, GitHub awesome subtitle list');
	assertIncludes(withEvidence.stdout, 'After deployment, run `pnpm indexnow:submit -- --live`, then record it with `pnpm promotion:record -- --channel indexnow --source IndexNow --status submitted`.');

	write('PROMOTION_LOG.md', `# Promotion Evidence Log

| Date | Channel | Source | Status | URL | Notes |
| --- | --- | --- | --- | --- | --- |
| 2026-06-01 | gsc | Search Console | submitted | | Submitted primary Day 0 sitemap plus 2 URL Inspection requests; next review 2026-06-08 |
| 2026-06-01 | indexnow | IndexNow | submitted | | Submitted primary queue with 2 URLs |
| 2026-06-01 | directory | AlternativeTo | submitted | https://alternativeto.net/ | Submitted directory listing for Subtitle Toolkit |
| 2026-06-01 | directory | tinytools.directory | submitted | https://tinytools.directory/ | Submitted directory listing for Subtitle Toolkit |
| 2026-06-01 | directory | SaaSHub | submitted | https://www.saashub.com/ | Submitted directory listing for Subtitle Toolkit |
| 2026-06-01 | awesome | GitHub awesome subtitle list | submitted | https://github.com/search?q=awesome+subtitle&type=repositories | Submitted or opened an awesome-list PR for Subtitle Toolkit |
`);

	const withAllPromotion = run(['--today', '2026-06-09']);
	assertExit(withAllPromotion, 0);
	assertIncludes(withAllPromotion.stdout, 'Latest IndexNow evidence: 2026-06-01 - Submitted primary queue with 2 URLs');
	assertIncludes(withAllPromotion.stdout, 'Priority external submissions: 4/4 recorded');
	assertIncludes(withAllPromotion.stdout, 'After primary crawl or impression movement appears, run `pnpm gsc:day0:list -- --batch current` and submit the current search-growth queue.');

	write('GSC_DAY0_URLS.md', `# GSC Day 0 Submission URLs

## Submission Record

| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |
| --- | --- | --- | ---: | --- | --- |
| 2026-06-01 | song | Yes | 3 | 2026-06-08 | Submitted all Day 0 URL Inspection queue after production gate passed. |

## Sitemap

- [x] \`https://subtitletoolkit.tools/sitemap-index.xml\`

## URL Inspection Requests

### Primary queue

- [x] \`https://subtitletoolkit.tools/\`
- [x] \`https://subtitletoolkit.tools/tools/srt-to-vtt/\`

### Current search-growth batch

- [x] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`);

	const allSubmitted = run(['--today', '2026-06-09']);
	assertExit(allSubmitted, 0);
	assertIncludes(allSubmitted.stdout, 'Current URL Inspection queue: 1/1 checked');
	assertIncludes(allSubmitted.stdout, 'Priority external submissions: 4/4 recorded');
	assertIncludes(allSubmitted.stdout, 'Wait for the review date, export GSC Queries/Pages and same-window analytics, then run `pnpm gsc:analyze`.');

	const originDir = join(tempDir, 'origin.git');
	const cloneDir = join(tempDir, 'repo');
	git(tempDir, ['init', '--bare', originDir]);
	git(tempDir, ['clone', originDir, cloneDir]);
	git(cloneDir, ['config', 'user.email', 'test@example.com']);
	git(cloneDir, ['config', 'user.name', 'Test User']);
	git(cloneDir, ['checkout', '-B', 'main']);
	writeFileSync(join(cloneDir, 'GSC_DAY0_URLS.md'), `# GSC Day 0 Submission URLs

Latest production gate: \`pnpm verify:gsc:submit-ready\` passed.

## Submission Record

| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |
| --- | --- | --- | ---: | --- | --- |
| | | No | 0 | | |

## Sitemap

- [ ] \`https://subtitletoolkit.tools/sitemap-index.xml\`

## URL Inspection Requests

### Primary queue

- [ ] \`https://subtitletoolkit.tools/\`

### Current search-growth batch

- [ ] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`);
	mkdirSync(join(cloneDir, 'public'), { recursive: true });
	writeFileSync(join(cloneDir, 'public/indexnow-key.txt'), '1c7b9f240dbf4d4ca4d7c569f1b27c3a\n');
	git(cloneDir, ['add', 'GSC_DAY0_URLS.md', 'public/indexnow-key.txt']);
	git(cloneDir, ['commit', '-m', 'Initial growth files']);
	git(cloneDir, ['push', 'origin', 'HEAD:main']);
	git(cloneDir, ['branch', '--set-upstream-to=origin/main', 'main']);
	writeFileSync(join(cloneDir, 'README.md'), 'local growth tooling change\n');
	git(cloneDir, ['add', 'README.md']);
	git(cloneDir, ['commit', '-m', 'Local growth tooling change']);

	const pendingDeploy = spawnSync(process.execPath, [scriptPath, '--today', '2026-06-01'], {
		cwd: cloneDir,
		encoding: 'utf8',
	});
	assertExit(pendingDeploy, 0);
	assertIncludes(pendingDeploy.stdout, 'Git sync: 1 ahead, 0 behind origin/main');
	assertIncludes(pendingDeploy.stdout, 'Deploy status: pending push/deploy');
	assertIncludes(pendingDeploy.stdout, 'Next IndexNow action: push and deploy the local commits before live submission.');
	assertIncludes(pendingDeploy.stdout, '1. Push and deploy the 1 local commit(s) so production includes the current growth tooling.');
	assertIncludes(pendingDeploy.stdout, '2. Run `pnpm verify:gsc:submit-ready` after deployment finishes.');
	assertIncludes(pendingDeploy.stdout, '3. Continue with the GSC sitemap plus primary URL Inspection queue only after the live gate passes.');

	const invalidDate = run(['--today', '2026/06/01']);
	assertExit(invalidDate, 1);
	assertIncludes(invalidDate.stderr, '--today must use YYYY-MM-DD format.');

	console.log('Growth status helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
