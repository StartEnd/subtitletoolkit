const args = process.argv.slice(2);

function getArg(name) {
	const index = args.indexOf(name);
	return index >= 0 ? args[index + 1] : null;
}

function usage() {
	console.log(`Usage:
  pnpm promotion:kit

Optional:
  --submitted-on YYYY-MM-DD
  --section directory|reddit|hn|tracking|all

Prints copy-ready promotion assets and tracking rows for the current search-growth push.`);
}

if (args.includes('--help')) {
	usage();
	process.exit(0);
}

const submittedOn = getArg('--submitted-on') || new Date().toISOString().slice(0, 10);
const section = getArg('--section') || 'all';

if (!/^\d{4}-\d{2}-\d{2}$/.test(submittedOn)) {
	console.error('--submitted-on must use YYYY-MM-DD format.');
	process.exit(1);
}

if (!['directory', 'reddit', 'hn', 'tracking', 'all'].includes(section)) {
	console.error('--section must be one of: directory, reddit, hn, tracking, all.');
	process.exit(1);
}

const siteUrl = 'https://subtitletoolkit.tools';
const siteName = 'Subtitle Toolkit';
const tagline = 'Free browser-local subtitle converter and repair tool for SRT, VTT, and ASS - files never leave your device.';
const longDescription = `Subtitle Toolkit is a free, privacy-first web app for converting, repairing, validating, extracting, and cleaning subtitle files. It supports SRT, VTT (WebVTT), and ASS (Advanced SubStation) formats, with dedicated browser-local tools for format conversion, timing drift, malformed files, validators, transcript extraction, and embedded subtitle extraction.

All processing happens locally in the browser. Files are never uploaded to a server. There is no signup, no account, no upload limit, and no paywall.

Use cases:
- Converting SRT subtitles to VTT for HTML5 video players
- Converting ASS subtitles to SRT for YouTube uploads
- Fixing constant-offset subtitle delay
- Validating SRT and WebVTT files before upload or browser playback
- Cleaning subtitle formatting before delivery
- Extracting embedded text subtitle tracks from video files
- Removing styling from ASS files when targeting simple players

The site also includes practical guides covering common subtitle workflows: format comparisons, conversion how-tos, sync fixes, validation, extraction, and delivery patterns for YouTube, Plex, JW Player, Video.js, Vimeo, and HTML5 video.

Built with Astro and hosted on Cloudflare Pages. Static, fast, and no backend subtitle handling.`;

const tags = 'subtitle, srt, vtt, webvtt, ass, caption, converter, video, free, privacy, browser-based, no-signup, html5';
const categories = 'Video & Movies, Online Services, Developer Tools, File Conversion';
const directoryTargets = [
	{ name: 'AlternativeTo', channel: 'directory', url: 'https://alternativeto.net/', notes: 'Submitted directory listing for Subtitle Toolkit' },
	{ name: 'tinytools.directory', channel: 'directory', url: 'https://tinytools.directory/', notes: 'Submitted directory listing for Subtitle Toolkit' },
	{ name: 'SaaSHub', channel: 'directory', url: 'https://www.saashub.com/', notes: 'Submitted directory listing for Subtitle Toolkit' },
	{ name: 'GitHub awesome subtitle list', channel: 'awesome', url: 'https://github.com/search?q=awesome+subtitle&type=repositories', notes: 'Submitted or opened an awesome-list PR for Subtitle Toolkit' },
];

function printHeader(title) {
	console.log(`\n## ${title}\n`);
}

function printDirectoryKit() {
	printHeader('Directory Submission Copy');
	console.log(`Name: ${siteName}`);
	console.log(`URL: ${siteUrl}`);
	console.log(`Tagline: ${tagline}\n`);
	console.log('Long description:');
	console.log(longDescription);
	console.log(`\nTags: ${tags}`);
	console.log(`Categories: ${categories}`);
	console.log('Pricing: Free / Freeware');
	console.log('Platform: Online / Web-based');

	printHeader('Submission Assets');
	console.log('Logo PNG: public/logo-512.png');
	console.log('Fallback icon: public/favicon.svg or public/favicon.ico');
	console.log('Open graph image: public/og-preview.png');
	console.log('Screenshot target: https://subtitletoolkit.tools/');
	console.log('Recommended screenshot crop: homepage hero plus the first row of tool cards.');

	printHeader('Priority Directory Targets');
	directoryTargets.forEach((target, index) => {
		console.log(`${index + 1}. ${target.name} - ${target.url}`);
	});

	printHeader('Directory Evidence Commands');
	console.log('Run the matching command only after the external submission actually happens. Replace --url with the published listing or PR URL when one exists.');
	directoryTargets.forEach((target) => {
		console.log(`pnpm promotion:record -- --date ${submittedOn} --channel ${target.channel} --source "${target.name}" --url ${target.url} --status submitted --notes "${target.notes}"`);
	});
}

function printRedditKit() {
	printHeader('Reddit Search URLs');
	console.log('https://www.reddit.com/search/?q=convert+srt&sort=new&t=week');
	console.log('https://www.reddit.com/search/?q=vtt+subtitle&sort=new&t=week');
	console.log('https://www.reddit.com/search/?q=subtitle+out+of+sync&sort=new&t=week');
	console.log('https://www.reddit.com/search/?q=%22ass+to+srt%22&sort=new&t=month');
	console.log('https://www.reddit.com/search/?q=webvtt+html5&sort=new&t=month');

	printHeader('Low-Risk Reddit Reply Pattern');
	console.log('1. Answer the question directly first.');
	console.log('2. Mention the tool only when it exactly solves the problem.');
	console.log('3. Keep link usage below 10% of your total helpful comments.');
	console.log(`4. Use the full URL when needed: ${siteUrl}`);
}

function printHnKit() {
	printHeader('Hacker News Draft');
	console.log('Title: Show HN: Subtitle Toolkit - browser-local SRT/VTT/ASS converter');
	console.log(`URL: ${siteUrl}\n`);
	console.log('First comment:');
	console.log(`Hi HN,

Every time I needed to convert a subtitle file, I ended up on a site that wanted me to upload the file, sign up, or watch an ad before downloading the result. For something this small, that felt wrong, so I built Subtitle Toolkit.

Everything runs locally in the browser. The conversion logic is plain JS/TS, with no backend and no file upload. Files never leave your device. The site is static and hosted on Cloudflare Pages.

Currently it covers SRT, VTT, and ASS conversion, timing shifts, validators, formatting cleanup, transcript extraction, and embedded text subtitle extraction.

I would love feedback on ASS edge cases, subtitle formats worth adding next, and workflows that still feel awkward.`);
}

function printTrackingRows() {
	printHeader('Tracking Rows');
	console.log('| Site | Submitted date | Status | Published URL | 7-day referral/direct signal |');
	console.log('| --- | --- | --- | --- | --- |');
	console.log(`| AlternativeTo | ${submittedOn} | Submitted | | |`);
	console.log(`| tinytools.directory | ${submittedOn} | Submitted | | |`);
	console.log(`| SaaSHub | ${submittedOn} | Submitted | | |`);
	console.log(`| GitHub awesome (1) | ${submittedOn} | PR submitted | | |`);

	console.log('\n| Date | Subreddit | Post URL | Comment URL | Template | Karma | Status | Traffic signal |');
	console.log('| --- | --- | --- | --- | --- | ---: | --- | --- |');
	console.log(`| ${submittedOn} | | | | | | | |`);
}

console.log('# Promotion Submission Kit');
console.log(`Submitted on: ${submittedOn}`);
console.log(`Section: ${section}`);

if (section === 'directory' || section === 'all') printDirectoryKit();
if (section === 'reddit' || section === 'all') printRedditKit();
if (section === 'hn' || section === 'all') printHnKit();
if (section === 'tracking' || section === 'all') printTrackingRows();
