import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { getSubtitleCatalog } from '../src/lib/subtitles/catalog.ts';

const guidesDir = resolve('src/content/guides');

if (!existsSync(guidesDir)) {
	console.error(`Missing guides directory: ${guidesDir}`);
	process.exit(1);
}

const validToolIds = new Set(getSubtitleCatalog('en').tools.map((tool) => tool.id));
const failures = [];

function readGuideFiles(dir) {
	const files = [];

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = resolve(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...readGuideFiles(path));
		} else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
			files.push(path);
		}
	}

	return files;
}

function getFrontmatter(source) {
	if (!source.startsWith('---\n')) return null;

	const end = source.indexOf('\n---', 4);
	if (end === -1) return null;

	return source.slice(4, end).split('\n');
}

function auditFrontmatter(filePath, lines) {
	const keyCounts = new Map();
	let primaryTool = null;
	let currentFaqHasQuestion = false;
	let currentFaqHasAnswer = false;
	let faqIndex = 0;

	function closeFaq() {
		if (faqIndex === 0) return;

		if (!currentFaqHasQuestion || !currentFaqHasAnswer) {
			failures.push(
				`${filePath}: faq ${faqIndex} must include both question and answer`,
			);
		}
	}

	for (const line of lines) {
		const topLevelMatch = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);

		if (topLevelMatch) {
			const [, key, rawValue = ''] = topLevelMatch;
			keyCounts.set(key, (keyCounts.get(key) || 0) + 1);

			if (key === 'primaryTool') {
				primaryTool = rawValue.trim();
			}
		}

		if (line.match(/^\s+-\s+question:\s+.+/)) {
			closeFaq();
			faqIndex += 1;
			currentFaqHasQuestion = true;
			currentFaqHasAnswer = false;
			continue;
		}

		if (faqIndex > 0 && line.match(/^\s+answer:\s+.+/)) {
			currentFaqHasAnswer = true;
		}
	}

	closeFaq();

	for (const [key, count] of keyCounts.entries()) {
		if (count > 1) {
			failures.push(`${filePath}: duplicate frontmatter key "${key}"`);
		}
	}

	if (primaryTool && !validToolIds.has(primaryTool)) {
		failures.push(`${filePath}: unknown primaryTool "${primaryTool}"`);
	}
}

for (const filePath of readGuideFiles(guidesDir)) {
	const frontmatter = getFrontmatter(readFileSync(filePath, 'utf8'));

	if (!frontmatter) {
		failures.push(`${filePath}: missing frontmatter`);
		continue;
	}

	auditFrontmatter(filePath, frontmatter);
}

if (failures.length > 0) {
	console.error(`Content metadata audit failed with ${failures.length} issue(s):`);
	for (const failure of failures) console.error(`FAIL ${failure}`);
	process.exit(1);
}

console.log('Content metadata audit passed.');
