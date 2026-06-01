import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const rootDir = process.cwd();
const scriptPath = join(rootDir, 'scripts/prepare-promotion-submission.mjs');

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

const directory = run(['--submitted-on', '2026-06-01', '--section', 'directory']);
assertExit(directory, 0);
assertIncludes(directory.stdout, '# Promotion Submission Kit');
assertIncludes(directory.stdout, 'Section: directory');
assertIncludes(directory.stdout, 'Name: Subtitle Toolkit');
assertIncludes(directory.stdout, 'URL: https://subtitletoolkit.tools');
assertIncludes(directory.stdout, 'AlternativeTo - https://alternativeto.net/');
assertIncludes(directory.stdout, 'GitHub awesome subtitle list - https://github.com/search?q=awesome+subtitle&type=repositories');
assertIncludes(directory.stdout, '## Directory Evidence Commands');
assertIncludes(directory.stdout, 'pnpm promotion:record -- --date 2026-06-01 --channel directory --source "AlternativeTo" --url https://alternativeto.net/ --status submitted --notes "Submitted directory listing for Subtitle Toolkit"');
assertIncludes(directory.stdout, 'pnpm promotion:record -- --date 2026-06-01 --channel directory --source "tinytools.directory" --url https://tinytools.directory/ --status submitted --notes "Submitted directory listing for Subtitle Toolkit"');
assertIncludes(directory.stdout, 'pnpm promotion:record -- --date 2026-06-01 --channel directory --source "SaaSHub" --url https://www.saashub.com/ --status submitted --notes "Submitted directory listing for Subtitle Toolkit"');
assertIncludes(directory.stdout, 'pnpm promotion:record -- --date 2026-06-01 --channel awesome --source "GitHub awesome subtitle list" --url https://github.com/search?q=awesome+subtitle&type=repositories --status submitted --notes "Submitted or opened an awesome-list PR for Subtitle Toolkit"');

const tracking = run(['--submitted-on', '2026-06-01', '--section', 'tracking']);
assertExit(tracking, 0);
assertIncludes(tracking.stdout, '| AlternativeTo | 2026-06-01 | Submitted | | |');
assertIncludes(tracking.stdout, '| 2026-06-01 | | | | | | | |');

const invalidDate = run(['--submitted-on', '2026/06/01']);
assertExit(invalidDate, 1);
assertIncludes(invalidDate.stderr, '--submitted-on must use YYYY-MM-DD format.');

const invalidSection = run(['--section', 'everything']);
assertExit(invalidSection, 1);
assertIncludes(invalidSection.stderr, '--section must be one of: directory, reddit, hn, tracking, all.');

console.log('Promotion submission helper tests passed.');
