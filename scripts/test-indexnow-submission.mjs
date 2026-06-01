import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

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

function runAsync(args) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, [scriptPath, ...args], {
			cwd: tempDir,
			stdio: ['ignore', 'pipe', 'pipe'],
		});
		let stdout = '';
		let stderr = '';
		child.stdout.setEncoding('utf8');
		child.stderr.setEncoding('utf8');
		child.stdout.on('data', (chunk) => { stdout += chunk; });
		child.stderr.on('data', (chunk) => { stderr += chunk; });
		child.on('error', reject);
		child.on('close', (status) => resolve({ status, stdout, stderr }));
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

function listen(server) {
	return new Promise((resolve, reject) => {
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			server.off('error', reject);
			resolve(server.address().port);
		});
	});
}

function close(server) {
	return new Promise((resolve, reject) => {
		server.close((error) => error ? reject(error) : resolve());
	});
}

let indexNowPayload = null;

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
	assertIncludes(primary.stdout, 'Key check: not needed');
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

	const skipKeyCheckDryRun = run(['--skip-key-check']);
	assertExit(skipKeyCheckDryRun, 1);
	assertIncludes(skipKeyCheckDryRun.stderr, '--skip-key-check can only be used with --live.');

	const allowLocalDryRun = run(['--allow-local-test-urls']);
	assertExit(allowLocalDryRun, 1);
	assertIncludes(allowLocalDryRun.stderr, '--allow-local-test-urls can only be used with --live.');

	const server = http.createServer((request, response) => {
		if (request.url === '/indexnow-key.txt') {
			response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
			response.end('test-indexnow-key');
			return;
		}

		if (request.url === '/bad-indexnow-key.txt') {
			response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
			response.end('wrong-key');
			return;
		}

		if (request.url === '/indexnow') {
			let body = '';
			request.setEncoding('utf8');
			request.on('data', (chunk) => { body += chunk; });
			request.on('end', () => {
				indexNowPayload = JSON.parse(body);
				response.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
				response.end('accepted');
			});
			return;
		}

		response.writeHead(404);
		response.end('not found');
	});

	const port = await listen(server);
	try {
		const badKey = await runAsync([
			'--live',
			'--allow-local-test-urls',
			'--key', 'test-indexnow-key',
			'--key-location', `http://127.0.0.1:${port}/bad-indexnow-key.txt`,
			'--endpoint', `http://127.0.0.1:${port}/indexnow`,
		]);
		assertExit(badKey, 1);
		assertIncludes(badKey.stdout, 'Checking public IndexNow key');
		assertIncludes(badKey.stderr, 'IndexNow key check failed: deployed key does not match the submission key.');

		const live = await runAsync([
			'--live',
			'--allow-local-test-urls',
			'--key', 'test-indexnow-key',
			'--key-location', `http://127.0.0.1:${port}/indexnow-key.txt`,
			'--endpoint', `http://127.0.0.1:${port}/indexnow`,
		]);
		assertExit(live, 0);
		assertIncludes(live.stdout, 'Key check: required');
		assertIncludes(live.stdout, 'IndexNow key check passed.');
		assertIncludes(live.stdout, 'IndexNow accepted 2 primary URLs with HTTP 200.');
		assertIncludes(live.stdout, 'pnpm promotion:record -- --channel indexnow --source IndexNow --status submitted --notes "Submitted primary queue with 2 URLs"');
		if (indexNowPayload?.key !== 'test-indexnow-key') {
			throw new Error(`Expected posted key to be test-indexnow-key, got ${indexNowPayload?.key}`);
		}
		if (indexNowPayload?.urlList?.length !== 2) {
			throw new Error(`Expected 2 posted URLs, got ${indexNowPayload?.urlList?.length}`);
		}
	} finally {
		await close(server);
	}

	console.log('IndexNow submission helper tests passed.');
} finally {
	rmSync(tempDir, { recursive: true, force: true });
}
