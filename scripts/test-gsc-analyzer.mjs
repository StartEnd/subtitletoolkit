import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/analyze-gsc-export.mjs');
const tempDir = mkdtempSync(join(tmpdir(), 'subtitletoolkit-gsc-'));

function write(path, contents) {
	mkdirSync(dirname(join(tempDir, path)), { recursive: true });
	writeFileSync(join(tempDir, path), contents);
}

function writePage(path, title) {
	const pageDir = path === '/' ? 'dist' : join('dist', path.replace(/^\//, ''));
	mkdirSync(join(tempDir, pageDir), { recursive: true });
	writeFileSync(join(tempDir, pageDir, 'index.html'), `<title>${title}</title>`);
}

function runAnalyzer(args) {
	return spawnSync(process.execPath, [scriptPath, ...args], {
		cwd: tempDir,
		encoding: 'utf8',
	});
}

function assertIncludes(output, expected) {
	if (!output.includes(expected)) {
		throw new Error(`Expected output to include ${JSON.stringify(expected)}\n\nOutput:\n${output}`);
	}
}

function assertExit(result, code) {
	if (result.status !== code) {
		throw new Error(`Expected exit ${code}, got ${result.status}\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
	}
}

try {
	writePage('/tools/srt-to-vtt/', 'SRT to VTT Converter Online - Free, No Upload');
	writePage('/tools/subtitle-delay-fixer/', 'Fix Subtitle Delay Online - Free, No Upload');

	write('queries.csv', `Top queries,Clicks,Impressions,CTR,Position
srt to vtt,0,20,0%,12.5
subtitle delay fixer,2,40,5%,7.0
`);

	write('pages.csv', `Top pages,Clicks,Impressions,CTR,Position
https://subtitletoolkit.tools/tools/srt-to-vtt,0,20,0%,12.5
https://subtitletoolkit.tools/tools/subtitle-delay-fixer,2,40,5%,7.0
`);

	const notReady = runAnalyzer([
		'--queries', 'queries.csv',
		'--pages', 'pages.csv',
		'--organic-pageviews', '900',
	]);
	assertExit(notReady, 0);
	assertIncludes(notReady.stdout, '| srt to vtt | https://subtitletoolkit.tools/tools/srt-to-vtt/ | 0/20 clicks/impr, pos 12.5 |');
	assertIncludes(notReady.stdout, '| Organic pageviews last 28 days | 900 | 1000 | no |');
	assertIncludes(notReady.stdout, 'Ad gate met: no');

	write('pages-ready.csv', `Top pages,Clicks,Impressions,CTR,Position
${Array.from({ length: 20 }, (_, index) => {
	const id = index + 1;
	const clicks = id <= 10 ? 1 : 0;
	return `https://subtitletoolkit.tools/tools/page-${id},${clicks},20,5%,8`;
}).join('\n')}
`);

	const ready = runAnalyzer([
		'--queries', 'queries.csv',
		'--pages', 'pages-ready.csv',
		'--organic-pageviews', '1000',
	]);
	assertExit(ready, 0);
	assertIncludes(ready.stdout, '| Pages with organic impressions | 20 | 20 | yes |');
	assertIncludes(ready.stdout, '| Pages with organic clicks | 10 | 10 | yes |');
	assertIncludes(ready.stdout, 'Ad gate met: yes');

	const invalidPageviews = runAnalyzer([
		'--queries', 'queries.csv',
		'--organic-pageviews', 'nope',
	]);
	assertExit(invalidPageviews, 1);
	assertIncludes(invalidPageviews.stderr, '--organic-pageviews must be a non-negative integer.');

	console.log('GSC analyzer regression tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
