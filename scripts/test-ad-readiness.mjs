import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/verify-ad-readiness.mjs');
const tempDir = mkdtempSync(join(tmpdir(), 'subtitletoolkit-ad-ready-'));

function write(path, contents) {
	mkdirSync(dirname(join(tempDir, path)), { recursive: true });
	writeFileSync(join(tempDir, path), contents);
}

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
	write('dist/index.html', '<main><div class="ad-slot" data-ad-slot="home-below-trust" aria-hidden="true"></div></main>');
	write('dist/tools/srt-to-vtt/index.html', '<section class="workspace"></section><div class="ad-slot" data-ad-slot="tool-below-workflow" aria-hidden="true"></div>');

	const missing = run(['--skip-build', '--dist', join(tempDir, 'dist')]);
	assertExit(missing, 1);
	assertIncludes(missing.stderr, '--organic-pageviews is required.');

	const notReady = run([
		'--skip-build', '--dist', join(tempDir, 'dist'),
		'--organic-pageviews', '999',
		'--pages-with-impressions', '20',
		'--pages-with-clicks', '10',
		'--tool-starts', '100',
		'--tool-outputs', '20',
	]);
	assertExit(notReady, 1);
	assertIncludes(notReady.stdout, 'FAIL organic pageviews gate - 999/1000');
	assertIncludes(notReady.stdout, 'Ad readiness gate failed.');

	const ready = run([
		'--skip-build', '--dist', join(tempDir, 'dist'),
		'--organic-pageviews', '1000',
		'--pages-with-impressions', '20',
		'--pages-with-clicks', '10',
		'--tool-starts', '100',
		'--tool-outputs', '20',
	]);
	assertExit(ready, 0);
	assertIncludes(ready.stdout, 'PASS organic pageviews gate - 1000/1000');
	assertIncludes(ready.stdout, 'PASS tool output rate gate - 20.00%/10%');
	assertIncludes(ready.stdout, 'Ad readiness gate passed.');

	write('dist/tools/srt-to-vtt/index.html', '<div data-ad-slot="tool-below-workflow" aria-hidden="true"></div><section class="workspace"></section>');
	const badPlacement = run([
		'--skip-build', '--dist', join(tempDir, 'dist'),
		'--organic-pageviews', '1000',
		'--pages-with-impressions', '20',
		'--pages-with-clicks', '10',
		'--tool-starts', '100',
		'--tool-outputs', '20',
	]);
	assertExit(badPlacement, 1);
	assertIncludes(badPlacement.stdout, 'FAIL tool ad slot stays below workspace');

	console.log('Ad readiness helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
