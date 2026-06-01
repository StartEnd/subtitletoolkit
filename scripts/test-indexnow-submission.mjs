import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/prepare-indexnow-submission.mjs');
const tempDir = join(tmpdir(), `subtitletoolkit-indexnow-${process.pid}`);

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

## URL Inspection Requests

### Primary queue

- [ ] \`https://subtitletoolkit.tools/\`
- [ ] \`https://subtitletoolkit.tools/tools/srt-to-vtt/\`

### Current search-growth batch

- [ ] \`https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/\`

## After Submission
`);

	const primary = run([]);
	assertExit(primary, 0);
	assertIncludes(primary.stdout, 'Mode: dry-run');
	assertIncludes(primary.stdout, 'URL count: 2');
	assertIncludes(primary.stdout, '"host": "subtitletoolkit.tools"');
	assertIncludes(primary.stdout, '"https://subtitletoolkit.tools/tools/srt-to-vtt/"');
	assertIncludes(primary.stdout, 'Dry run only. Add `--live` after the key file is deployed and you want to notify IndexNow.');

	const current = run(['--batch', 'current']);
	assertExit(current, 0);
	assertIncludes(current.stdout, 'URL count: 1');
	assertIncludes(current.stdout, '"https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/"');

	const all = run(['--batch', 'all']);
	assertExit(all, 0);
	assertIncludes(all.stdout, 'URL count: 3');

	const invalidBatch = run(['--batch', 'everything']);
	assertExit(invalidBatch, 1);
	assertIncludes(invalidBatch.stderr, '--batch must be one of: primary, current, all.');

	const invalidKeyLocation = run(['--key-location', 'https://example.com/indexnow-key.txt']);
	assertExit(invalidKeyLocation, 1);
	assertIncludes(invalidKeyLocation.stderr, '--key-location must be an https://subtitletoolkit.tools/ URL.');

	console.log('IndexNow submission helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
