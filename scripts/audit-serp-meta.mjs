import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const distDir = resolve(process.env.SERP_AUDIT_DIST_DIR || 'dist');
const maxTitleLength = Number.parseInt(process.env.SERP_AUDIT_MAX_TITLE || '60', 10);
const maxDescriptionLength = Number.parseInt(process.env.SERP_AUDIT_MAX_DESCRIPTION || '160', 10);

if (!existsSync(distDir)) {
	console.error(`Missing dist directory: ${distDir}. Run pnpm build first.`);
	process.exit(1);
}

function walkHtml(dir) {
	const files = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = resolve(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...walkHtml(path));
		} else if (entry.name.endsWith('.html')) {
			files.push(path);
		}
	}
	return files;
}

function routeForFile(filePath) {
	const path = relative(distDir, filePath).replace(/\/index\.html$/, '/');
	return path === 'index.html' ? '/' : `/${path}`;
}

function shouldAuditRoute(route) {
	return route === '/' || route === '/tools/' || route === '/guides/' || route.startsWith('/tools/') || route.startsWith('/guides/');
}

function htmlDecode(value) {
	return value
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');
}

function extractMeta(html) {
	return {
		title: htmlDecode(html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? ''),
		description: htmlDecode(html.match(/<meta\s+name="description"\s+content="([^"]*)"\s*\/?>/i)?.[1]?.trim() ?? ''),
	};
}

const audited = walkHtml(distDir)
	.map((filePath) => ({ filePath, route: routeForFile(filePath) }))
	.filter(({ route }) => shouldAuditRoute(route))
	.sort((a, b) => a.route.localeCompare(b.route));

const titleMap = new Map();
const descriptionMap = new Map();
const failures = [];

for (const page of audited) {
	const html = readFileSync(page.filePath, 'utf8');
	const meta = extractMeta(html);

	if (!meta.title) {
		failures.push(`${page.route}: missing <title>`);
	} else if (meta.title.length > maxTitleLength) {
		failures.push(`${page.route}: title too long (${meta.title.length}/${maxTitleLength}) "${meta.title}"`);
	}

	if (!meta.description) {
		failures.push(`${page.route}: missing meta description`);
	} else if (meta.description.length > maxDescriptionLength) {
		failures.push(`${page.route}: description too long (${meta.description.length}/${maxDescriptionLength}) "${meta.description}"`);
	}

	if (meta.title) {
		const routes = titleMap.get(meta.title) || [];
		routes.push(page.route);
		titleMap.set(meta.title, routes);
	}

	if (meta.description) {
		const routes = descriptionMap.get(meta.description) || [];
		routes.push(page.route);
		descriptionMap.set(meta.description, routes);
	}
}

for (const [title, routes] of titleMap.entries()) {
	if (routes.length > 1) {
		failures.push(`duplicate title on ${routes.join(', ')}: "${title}"`);
	}
}

for (const [description, routes] of descriptionMap.entries()) {
	if (routes.length > 1) {
		failures.push(`duplicate description on ${routes.join(', ')}: "${description}"`);
	}
}

if (failures.length > 0) {
	console.error(`SERP meta audit failed for ${audited.length} pages:`);
	for (const failure of failures) console.error(`FAIL ${failure}`);
	process.exit(1);
}

console.log(`SERP meta audit passed for ${audited.length} pages.`);
