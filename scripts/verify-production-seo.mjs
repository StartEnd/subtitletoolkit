import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const verifyDist = process.env.SEO_VERIFY_DIST === '1';
const baseUrl = (process.env.SEO_VERIFY_BASE_URL || 'https://subtitletoolkit.tools').replace(/\/$/, '');
const distDir = resolve(process.env.SEO_VERIFY_DIST_DIR || 'dist');
const retries = Number.parseInt(process.env.SEO_VERIFY_RETRIES || '0', 10);
const retryDelayMs = Number.parseInt(process.env.SEO_VERIFY_RETRY_DELAY_MS || '30000', 10);
const fetchRetries = Number.parseInt(process.env.SEO_VERIFY_FETCH_RETRIES || '2', 10);
const fetchRetryDelayMs = Number.parseInt(process.env.SEO_VERIFY_FETCH_RETRY_DELAY_MS || '1000', 10);
const fetchTimeoutMs = Number.parseInt(process.env.SEO_VERIFY_FETCH_TIMEOUT_MS || '15000', 10);

function getExpectedLastmod() {
	try {
		return new Date(execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim()).toISOString();
	} catch {
		return null;
	}
}

const expectedLastmod = process.env.SEO_VERIFY_EXPECTED_LASTMOD || getExpectedLastmod();

const checks = [
	{
		path: '/',
		expect: [
			{
				label: 'homepage no-upload title promise',
				match: '<title>Free Subtitle Tools - No Upload | Subtitle Toolkit</title>',
			},
			{
				label: 'homepage no-upload meta description',
				match: 'Convert, fix, and clean SRT, VTT, and ASS subtitle files for free. No signup, no upload, and browser-local processing for private caption workflows.',
			},
			{
				label: 'homepage links to priority delay tool',
				match: '/tools/subtitle-delay-fixer/',
			},
			{
				label: 'homepage links to priority extraction tool',
				match: '/tools/extract-subtitles-from-video/',
			},
			{
				label: 'homepage links to encoding fixer tool',
				match: '/tools/subtitle-encoding-fixer/',
			},
			{
				label: 'homepage links to priority guide',
				match: '/guides/why-subtitles-do-not-show-in-html5-video/',
			},
			{
				label: 'homepage links to YouTube upload failure guide',
				match: '/guides/why-youtube-subtitles-upload-failed/',
			},
			{
				label: 'footer labels YouTube upload failure guide',
				match: 'YouTube upload failed',
			},
			{
				label: 'homepage links to YouTube subtitle conversion guide',
				match: '/guides/how-to-convert-subtitles-for-youtube/',
			},
			{
				label: 'footer labels YouTube conversion guide',
				match: 'Convert subtitles for YouTube',
			},
			{
				label: 'homepage links to SRT upload failure guide',
				match: '/guides/why-srt-file-wont-upload/',
			},
			{
				label: 'footer labels SRT upload failure guide',
				match: 'SRT file will not upload',
			},
			{
				label: 'homepage links to Video.js caption failure guide',
				match: '/guides/why-videojs-captions-are-not-showing/',
			},
			{
				label: 'homepage links to JW Player caption failure guide',
				match: '/guides/why-jw-player-captions-are-not-showing/',
			},
			{
				label: 'homepage links to VLC subtitle failure guide',
				match: '/guides/why-vlc-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to VLC subtitle delay guide',
				match: '/guides/how-to-fix-vlc-subtitle-delay/',
			},
			{
				label: 'homepage links to SRT not working guide',
				match: '/guides/why-srt-file-is-not-working/',
			},
			{
				label: 'homepage links to missing subtitles after conversion guide',
				match: '/guides/why-subtitles-are-missing-after-conversion/',
			},
			{
				label: 'homepage links to empty converted subtitle guide',
				match: '/guides/why-converted-subtitle-file-is-empty/',
			},
			{
				label: 'homepage links to subtitle drift guide',
				match: '/guides/why-subtitles-drift-out-of-sync/',
			},
			{
				label: 'homepage links to long subtitles guide',
				match: '/guides/how-to-fix-subtitles-that-are-too-long/',
			},
			{
				label: 'homepage links to Plex subtitle failure guide',
				match: '/guides/why-plex-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to Vimeo caption failure guide',
				match: '/guides/why-vimeo-captions-are-not-showing/',
			},
			{
				label: 'homepage links to garbled subtitles guide',
				match: '/guides/how-to-fix-garbled-subtitles/',
			},
			{
				label: 'homepage links to UTF-8 conversion guide',
				match: '/guides/how-to-convert-subtitles-to-utf-8/',
			},
			{
				label: 'homepage links to video subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-video/',
			},
			{
				label: 'homepage links to MKV subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mkv/',
			},
			{
				label: 'homepage links to HTML5 conversion guide',
				match: '/guides/how-to-convert-subtitles-for-html5-video/',
			},
			{
				label: 'homepage links to Video.js conversion guide',
				match: '/guides/how-to-convert-subtitles-for-videojs/',
			},
			{
				label: 'homepage links to Video.js format guide',
				match: '/guides/best-subtitle-format-for-videojs/',
			},
			{
				label: 'homepage links to SRT vs VTT guide',
				match: '/guides/srt-vs-vtt/',
			},
			{
				label: 'homepage links to SRT to TXT guide',
				match: '/guides/how-to-convert-srt-to-txt/',
			},
			{
				label: 'homepage links to ASS to VTT guide',
				match: '/guides/how-to-convert-ass-to-vtt-for-web-players/',
			},
			{
				label: 'homepage links to ASS to SRT YouTube upload guide',
				match: '/guides/how-to-convert-ass-to-srt-for-youtube-uploads/',
			},
			{
				label: 'homepage links to subtitle cleanup before upload guide',
				match: '/guides/how-to-clean-subtitle-formatting-before-upload/',
			},
			{
				label: 'homepage links to SRT validation guide',
				match: '/guides/how-to-validate-srt-files/',
			},
			{
				label: 'homepage links to WebVTT validation guide',
				match: '/guides/how-to-validate-webvtt-files/',
			},
		],
	},
	{
		path: '/guides/how-to-convert-ass-to-srt-for-youtube-uploads/',
		expect: [
			{
				label: 'ASS to SRT YouTube guide CTR title',
				match: '<title>ASS to SRT for YouTube - Free Caption Upload Guide</title>',
			},
			{
				label: 'ASS to SRT YouTube guide upload meta description',
				match: 'Convert ASS to SRT for YouTube upload. Remove unsupported styling, keep subtitle timing, and prepare clean SRT captions locally with no upload.',
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitle-delay/',
		expect: [
			{
				label: 'updated guide title',
				match: '<title>Subtitles Ahead or Behind Audio? Fix Delay Online</title>',
			},
			{
				label: 'above-content related tool link',
				match: 'href="/tools/subtitle-time-shifter/"',
			},
			{
				label: 'guide tool CTA analytics event',
				match: 'guide_tool_cta_click',
			},
			{
				label: 'top guide tool CTA placement',
				match: 'data-guide-tool-placement="top"',
			},
			{
				label: 'updated guide meta description',
				match: 'Fix subtitles ahead of audio or behind speech by measuring the offset and shifting SRT, VTT, or ASS timing online. No upload or signup.',
			},
			{
				label: 'guide covers ahead or behind audio intent',
				match: 'If subtitles are ahead of or behind audio',
			},
			{
				label: 'guide links subtitle drift follow-up',
				match: 'href="/guides/why-subtitles-drift-out-of-sync/"',
			},
			{
				label: 'single Article JSON-LD block',
				count: /"@type"\s*:\s*"Article"/g,
				expectedCount: 1,
			},
			{
				label: 'FAQ schema for delay questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What does it mean when subtitles are ahead of audio\?/
			},
			{
				label: 'guide Article schema includes query tags',
				match: /"keywords"\s*:\s*"subtitle delay, subtitle sync, subtitles ahead of audio, subtitles behind audio, timing, repair, offset"/
			},
			{
				label: 'breadcrumb schema includes current guide URL',
				match: /"name"\s*:\s*"How to fix subtitle delay"[\s\S]*"item"\s*:\s*"https:\/\/subtitletoolkit\.tools\/guides\/how-to-fix-subtitle-delay\/"/
			},
			{
				label: 'guide links to related workflow tools',
				match: 'Continue with a related subtitle tool',
			},
			{
				label: 'guide related tool click analytics placement',
				match: 'data-guide-tool-placement="related-tools"',
			},
		],
	},
	{
		path: '/guides/fix-subtitle-sync-after-a-scene-cut/',
		expect: [
			{
				label: 'scene-cut sync guide CTR title',
				match: '<title>Fix Subtitle Sync After a Scene Cut - Shift One Section</title>',
			},
			{
				label: 'scene-cut sync guide no-upload meta description',
				match: 'Fix subtitle sync after a scene cut without shifting the whole file. Move only the affected subtitle range online with no upload or signup.',
			},
			{
				label: 'scene-cut sync guide opens partial shifter',
				match: 'href="/tools/partial-subtitle-shifter/"',
			},
			{
				label: 'FAQ schema for scene-cut sync questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can I fix multiple edits at once\?/
			},
			{
				label: 'scene-cut Article schema includes query tags',
				match: /"keywords"\s*:\s*"subtitle scene cut, partial subtitle shifter, subtitle sync fix, video edit subtitles"/
			},
		],
	},
	{
		path: '/guides/how-to-convert-srt-to-vtt-for-html5-video/',
		expect: [
			{
				label: 'updated SRT to VTT guide title',
				match: '<title>SRT to VTT for HTML5 Video - Free Converter Guide</title>',
			},
			{
				label: 'updated SRT to VTT meta description',
				match: 'Convert SRT subtitles to WebVTT for HTML5 video. Add the WEBVTT header, fix timestamp syntax, and create a browser-ready VTT file locally.',
			},
			{
				label: 'footer links to priority guide',
				match: 'SRT to VTT for HTML5',
			},
			{
				label: 'FAQ schema for SRT to VTT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can I convert VTT back to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-fix-invalid-webvtt-timestamps/',
		expect: [
			{
				label: 'FAQ schema for invalid WebVTT timestamps',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What makes a WebVTT timestamp invalid\?/
			},
			{
				label: 'invalid WebVTT guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/how-to-validate-webvtt-files/',
		expect: [
			{
				label: 'WebVTT validation guide CTR title',
				match: '<title>WebVTT Validator Guide - Check VTT Captions Online</title>',
			},
			{
				label: 'WebVTT validation guide no-upload meta description',
				match: 'Validate WebVTT files before HTML5 video playback. Check WEBVTT headers, timestamp dots, cue structure, and browser caption errors with no upload.',
			},
			{
				label: 'WebVTT validation guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'FAQ schema for WebVTT validation questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What if validation passes but captions still do not show\?/
			},
		],
	},
	{
		path: '/guides/how-to-validate-srt-files/',
		expect: [
			{
				label: 'SRT validation guide CTR title',
				match: '<title>SRT Validator Guide - Check Subtitle Files Before Upload</title>',
			},
			{
				label: 'SRT validation guide no-upload meta description',
				match: 'Validate SRT files before YouTube, Vimeo, or editor upload. Check timestamps, cue numbers, blank lines, and subtitle structure with no upload.',
			},
			{
				label: 'SRT validation guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for SRT validation questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What if validation passes but YouTube rejects my file\?/
			},
		],
	},
	{
		path: '/guides/how-to-clean-subtitle-formatting-before-upload/',
		expect: [
			{
				label: 'subtitle cleanup before upload guide CTR title',
				match: '<title>Clean Subtitle Formatting Before Upload - Free Checklist</title>',
			},
			{
				label: 'subtitle cleanup before upload guide meta description',
				match: 'Clean subtitle formatting before upload. Fix cue numbers, spacing, styling tags, and messy SRT structure before YouTube or client delivery.',
			},
			{
				label: 'FAQ schema for subtitle cleanup questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What's the difference between cleaning and validating\?/
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-youtube/',
		expect: [
			{
				label: 'FAQ schema for YouTube subtitle format questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Does YouTube support VTT\?/
			},
			{
				label: 'YouTube format guide opens YouTube converter',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/best-srt-settings-for-youtube-upload/',
		expect: [
			{
				label: 'YouTube SRT settings guide CTR title',
				match: '<title>Best SRT Settings for YouTube Upload - Caption Checklist</title>',
			},
			{
				label: 'YouTube SRT settings guide meta description',
				match: 'Use the best SRT settings for YouTube upload: comma timestamps, sequential cue numbers, UTF-8 encoding, clean text, and readable line breaks.',
			},
			{
				label: 'YouTube SRT settings guide opens converter tool',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'YouTube SRT settings guide links to SRT validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube SRT settings questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What are the best SRT settings for YouTube upload\?/
			},
		],
	},
	{
		path: '/guides/srt-vs-ass-for-youtube-captions/',
		expect: [
			{
				label: 'YouTube SRT vs ASS guide CTR title',
				match: '<title>SRT vs ASS for YouTube Captions - Which Format to Upload?</title>',
			},
			{
				label: 'YouTube SRT vs ASS guide meta description',
				match: 'Compare SRT vs ASS for YouTube captions. Learn why SRT is safer for upload, what ASS styling YouTube ignores, and when to convert ASS to SRT.',
			},
			{
				label: 'YouTube SRT vs ASS guide opens ASS to SRT tool',
				match: 'href="/tools/ass-to-srt/"',
			},
			{
				label: 'YouTube SRT vs ASS guide links to YouTube converter',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'FAQ schema for YouTube SRT vs ASS questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Should I upload SRT or ASS captions to YouTube\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-youtube/',
		expect: [
			{
				label: 'YouTube subtitle conversion guide CTR title',
				match: '<title>Convert Subtitles for YouTube - VTT or ASS to SRT</title>',
			},
			{
				label: 'YouTube subtitle conversion guide meta description',
				match: 'Convert VTT, ASS, or SSA subtitles to YouTube-ready SRT captions. Fix timestamp format, remove unsupported styling, and validate before upload.',
			},
			{
				label: 'YouTube subtitle conversion guide opens converter tool',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'YouTube subtitle conversion guide links to validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube subtitle conversion questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can I convert VTT subtitles to SRT for YouTube\?/
			},
		],
	},
	{
		path: '/guides/how-to-prepare-subtitles-for-youtube-upload/',
		expect: [
			{
				label: 'YouTube upload preparation guide CTR title',
				match: '<title>Prepare Subtitles for YouTube Upload - SRT Checklist</title>',
			},
			{
				label: 'YouTube upload preparation guide meta description',
				match: 'Prepare subtitles for YouTube upload with a clean SRT checklist. Fix timing, formatting, encoding, cue order, and upload errors before publishing.',
			},
			{
				label: 'YouTube upload preparation guide opens cleaner tool',
				match: 'href="/tools/subtitle-cleaner/"',
			},
			{
				label: 'YouTube upload preparation guide links to SRT validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube upload preparation questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*What should I check before uploading subtitles to YouTube\?/
			},
		],
	},
	{
		path: '/guides/why-youtube-subtitles-upload-failed/',
		expect: [
			{
				label: 'YouTube upload failure guide CTR title',
				match: '<title>YouTube Subtitle Upload Failed - Fix SRT Caption Errors</title>',
			},
			{
				label: 'YouTube upload failure guide repair meta description',
				match: 'Fix YouTube subtitle upload failures by checking SRT timestamps, cue numbers, encoding, file type, and unsupported styling before uploading again.',
			},
			{
				label: 'YouTube upload failure guide opens converter tool',
				match: 'href="/tools/youtube-subtitle-converter/"',
			},
			{
				label: 'YouTube upload failure guide links to validator',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for YouTube upload failure questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why did my YouTube subtitle upload fail\?/
			},
		],
	},
	{
		path: '/guides/why-srt-file-wont-upload/',
		expect: [
			{
				label: 'SRT upload failure guide CTR title',
				match: '<title>SRT File Won&#39;t Upload - Fix Subtitle Format Errors</title>',
			},
			{
				label: 'SRT upload failure guide repair meta description',
				match: 'Fix an SRT file that will not upload by checking timestamp commas, cue numbers, blank lines, encoding, file structure, and unsupported markup.',
			},
			{
				label: 'SRT upload failure guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'SRT upload failure guide links to timestamp fixer',
				match: 'href="/tools/fix-srt-timestamps/"',
			},
			{
				label: 'FAQ schema for SRT upload failure questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why will my SRT file not upload\?/
			},
		],
	},
	{
		path: '/guides/how-to-remove-subtitle-line-numbers/',
		expect: [
			{
				label: 'line number guide opens line number tool',
				match: 'href="/tools/remove-srt-line-numbers/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-malformed-srt-timestamps/',
		expect: [
			{
				label: 'malformed SRT timestamp guide opens timestamp fixer',
				match: 'href="/tools/fix-srt-timestamps/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-garbled-subtitles/',
		expect: [
			{
				label: 'garbled subtitles guide CTR title',
				match: '<title>Fix Garbled Subtitles - Convert to UTF-8 Online</title>',
			},
			{
				label: 'garbled subtitles guide meta description',
				match: 'Fix garbled subtitles by choosing the right source encoding and saving clean UTF-8 text locally in your browser with no upload.',
			},
			{
				label: 'garbled subtitles guide opens encoding fixer tool',
				match: 'href="/tools/subtitle-encoding-fixer/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitles-showing-boxes/',
		expect: [
			{
				label: 'subtitle boxes guide CTR title',
				match: '<title>Fix Subtitles Showing Boxes - UTF-8 Encoding Repair</title>',
			},
			{
				label: 'subtitle boxes guide meta description',
				match: 'Fix subtitle boxes, question marks, and broken characters by converting SRT, VTT, or ASS text to clean UTF-8 with no upload.',
			},
			{
				label: 'subtitle boxes guide opens encoding fixer tool',
				match: 'href="/tools/subtitle-encoding-fixer/"',
			},
		],
	},
	{
		path: '/guides/why-vtt-captions-are-not-loading/',
		expect: [
			{
				label: 'VTT captions loading guide CTR title',
				match: '<title>VTT Captions Not Loading - WebVTT Fix Guide</title>',
			},
			{
				label: 'VTT captions loading guide meta description',
				match: 'Fix VTT captions that do not load by checking the WEBVTT header, timestamp dots, track setup, MIME type, and CORS delivery.',
			},
			{
				label: 'VTT captions loading guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-cors-errors-for-vtt-subtitles/',
		expect: [
			{
				label: 'VTT CORS guide CTR title',
				match: '<title>Fix VTT Subtitle CORS Errors - HTML5 Captions</title>',
			},
			{
				label: 'VTT CORS guide meta description',
				match: 'Fix WebVTT subtitle CORS errors by checking track URLs, response headers, CDN behavior, and browser caption requests.',
			},
			{
				label: 'VTT CORS guide opens HTML5 converter tool',
				match: 'href="/tools/html5-video-subtitle-converter/"',
			},
			{
				label: 'VTT CORS guide links to validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-vtt-mime-type-for-html5-video/',
		expect: [
			{
				label: 'VTT MIME guide CTR title',
				match: '<title>Fix VTT MIME Type - Serve WebVTT as text/vtt</title>',
			},
			{
				label: 'VTT MIME guide meta description',
				match: 'Fix VTT MIME type issues by checking the Content-Type header, track element, WEBVTT file, and HTML5 video delivery setup.',
			},
			{
				label: 'VTT MIME guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/why-subtitles-do-not-show-in-html5-video/',
		expect: [
			{
				label: 'HTML5 subtitle troubleshooting CTR title',
				match: '<title>Subtitles Not Showing in HTML5 Video - VTT Fix Guide</title>',
			},
			{
				label: 'HTML5 subtitle troubleshooting meta description',
				match: 'Fix subtitles not showing in HTML5 video by checking WebVTT format, WEBVTT headers, timestamp dots, MIME type, CORS, and track URLs.',
			},
			{
				label: 'FAQ schema for HTML5 subtitle troubleshooting',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing in HTML5 video\?/
			},
			{
				label: 'HTML5 troubleshooting guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/why-videojs-captions-are-not-showing/',
		expect: [
			{
				label: 'Video.js captions failure guide CTR title',
				match: '<title>Video.js Captions Not Showing - Fix VTT Track Issues</title>',
			},
			{
				label: 'Video.js captions failure guide meta description',
				match: 'Fix Video.js captions not showing by checking WebVTT format, track paths, MIME type, CORS headers, and player configuration.',
			},
			{
				label: 'Video.js captions failure guide opens converter tool',
				match: 'href="/tools/videojs-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/why-jw-player-captions-are-not-showing/',
		expect: [
			{
				label: 'JW Player captions failure guide CTR title',
				match: '<title>JW Player Captions Not Showing - Fix VTT Setup</title>',
			},
			{
				label: 'JW Player captions failure guide meta description',
				match: 'Fix JW Player captions not showing by checking WebVTT syntax, track URLs, player config, MIME type, CORS headers, and HTTPS issues.',
			},
			{
				label: 'JW Player captions failure guide opens converter tool',
				match: 'href="/tools/jw-player-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/why-plex-subtitles-are-not-showing/',
		expect: [
			{
				label: 'Plex subtitles failure guide CTR title',
				match: '<title>Plex Subtitles Not Showing - Fix SRT Naming and Format</title>',
			},
			{
				label: 'Plex subtitles failure guide meta description',
				match: 'Fix Plex subtitles not showing by checking SRT file naming, folder placement, library scanning, encoding, format support, and device compatibility.',
			},
			{
				label: 'Plex subtitles failure guide opens converter tool',
				match: 'href="/tools/plex-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/why-vlc-subtitles-are-not-showing/',
		expect: [
			{
				label: 'VLC subtitles failure guide CTR title',
				match: '<title>VLC Subtitles Not Showing - Fix SRT, VTT, ASS Captions</title>',
			},
			{
				label: 'VLC subtitles failure guide meta description',
				match: 'Fix VLC subtitles not showing by checking subtitle loading, file naming, encoding, format support, subtitle track settings, and timing.',
			},
			{
				label: 'VLC subtitles failure guide opens delay fixer tool',
				match: 'href="/tools/subtitle-delay-fixer/"',
			},
			{
				label: 'FAQ schema for VLC subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Can VLC play SRT subtitles\?/
			},
		],
	},
	{
		path: '/guides/why-vimeo-captions-are-not-showing/',
		expect: [
			{
				label: 'Vimeo captions failure guide CTR title',
				match: '<title>Vimeo Captions Not Showing - Fix WebVTT Uploads</title>',
			},
			{
				label: 'Vimeo captions failure guide meta description',
				match: 'Fix Vimeo captions not showing by checking WebVTT format, language track settings, caption upload status, embed controls, and mobile playback.',
			},
			{
				label: 'Vimeo captions failure guide opens converter tool',
				match: 'href="/tools/vimeo-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-html5-video/',
		expect: [
			{
				label: 'HTML5 conversion guide CTR title',
				match: '<title>Convert Subtitles for HTML5 Video - SRT or ASS to VTT</title>',
			},
			{
				label: 'HTML5 conversion guide meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT for HTML5 video. Add the WEBVTT header, fix timestamps, and create browser-ready captions with no upload.',
			},
			{
				label: 'HTML5 conversion guide opens converter tool',
				match: 'href="/tools/html5-video-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitle-files-for-web-players/',
		expect: [
			{
				label: 'web players conversion guide CTR title',
				match: '<title>Convert Subtitles for Web Players - SRT or ASS to VTT</title>',
			},
			{
				label: 'web players conversion guide meta description',
				match: 'Convert subtitle files for web players by choosing WebVTT, fixing timestamps, validating captions, and preparing HTML5-ready files.',
			},
			{
				label: 'web players conversion guide opens ASS to VTT tool',
				match: 'href="/tools/ass-to-vtt/"',
			},
			{
				label: 'web players conversion guide links validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/how-to-add-multiple-subtitle-languages-to-html5-video/',
		expect: [
			{
				label: 'multi-language HTML5 guide CTR title',
				match: '<title>Add Multiple Subtitle Languages to HTML5 Video</title>',
			},
			{
				label: 'multi-language HTML5 guide meta description',
				match: 'Add multiple subtitle languages to HTML5 video by preparing separate WebVTT files with language codes, labels, and track elements.',
			},
			{
				label: 'multi-language HTML5 guide opens converter tool',
				match: 'href="/tools/html5-video-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-html5-video/',
		expect: [
			{
				label: 'HTML5 format guide CTR title',
				match: '<title>Best Subtitle Format for HTML5 Video - Use WebVTT</title>',
			},
			{
				label: 'HTML5 format guide meta description',
				match: 'Learn why WebVTT is the best subtitle format for HTML5 video, when to convert SRT or ASS, and how to avoid MIME and CORS caption issues.',
			},
			{
				label: 'HTML5 format guide opens SRT to VTT tool',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-videojs/',
		expect: [
			{
				label: 'Video.js conversion guide CTR title',
				match: '<title>Convert Subtitles for Video.js - SRT or ASS to VTT</title>',
			},
			{
				label: 'Video.js conversion guide meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT for Video.js. Add the WEBVTT header, fix timestamps, and prepare browser captions with no upload.',
			},
			{
				label: 'Video.js conversion guide opens converter tool',
				match: 'href="/tools/videojs-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-jw-player/',
		expect: [
			{
				label: 'JW Player conversion guide CTR title',
				match: '<title>Convert Subtitles for JW Player - SRT or ASS to VTT</title>',
			},
			{
				label: 'JW Player conversion guide meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT for JW Player. Create browser-ready captions, fix timestamp format, and download locally.',
			},
			{
				label: 'JW Player conversion guide opens converter tool',
				match: 'href="/tools/jw-player-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-plex/',
		expect: [
			{
				label: 'Plex conversion guide CTR title',
				match: '<title>Convert Subtitles for Plex - VTT or ASS to SRT</title>',
			},
			{
				label: 'Plex conversion guide meta description',
				match: 'Convert VTT or ASS subtitles to SRT for Plex. Create simple media-library captions, preserve timing, and avoid unsupported styling.',
			},
			{
				label: 'Plex conversion guide opens converter tool',
				match: 'href="/tools/plex-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/how-to-name-subtitle-files-for-plex/',
		expect: [
			{
				label: 'Plex subtitle filename guide CTR title',
				match: '<title>Name Subtitle Files for Plex - SRT Language Codes</title>',
			},
			{
				label: 'Plex subtitle filename guide meta description',
				match: 'Name Plex subtitle files by matching the video filename, adding language codes, choosing SRT when needed, and refreshing the library.',
			},
			{
				label: 'Plex subtitle filename guide opens converter tool',
				match: 'href="/tools/plex-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-subtitles-for-vimeo/',
		expect: [
			{
				label: 'Vimeo conversion guide CTR title',
				match: '<title>Convert Subtitles for Vimeo - SRT or ASS to VTT</title>',
			},
			{
				label: 'Vimeo conversion guide meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT for Vimeo embeds. Prepare upload-ready or externally hosted captions locally with no upload.',
			},
			{
				label: 'Vimeo conversion guide opens converter tool',
				match: 'href="/tools/vimeo-subtitle-converter/"',
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-videojs/',
		expect: [
			{
				label: 'Video.js format guide CTR title',
				match: '<title>Best Subtitle Format for Video.js - Use WebVTT</title>',
			},
			{
				label: 'Video.js format guide meta description',
				match: 'Choose the best subtitle format for Video.js. Use WebVTT for browser playback, convert SRT or ASS to VTT, and check MIME and CORS issues.',
			},
			{
				label: 'Video.js format guide opens converter tool',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-jw-player/',
		expect: [
			{
				label: 'JW Player format guide CTR title',
				match: '<title>Best Subtitle Format for JW Player - VTT Guide</title>',
			},
			{
				label: 'JW Player format guide meta description',
				match: 'Choose the best subtitle format for JW Player. Use WebVTT for reliable browser captions, convert SRT when needed, and avoid MIME or CORS failures.',
			},
			{
				label: 'JW Player format guide opens converter tool',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-plex/',
		expect: [
			{
				label: 'Plex format guide CTR title',
				match: '<title>Best Subtitle Format for Plex - SRT Compatibility Guide</title>',
			},
			{
				label: 'Plex format guide meta description',
				match: 'Choose the best subtitle format for Plex. Use SRT for broad device compatibility, convert ASS or VTT when needed, and name files correctly.',
			},
			{
				label: 'Plex format guide opens converter tool',
				match: 'href="/tools/ass-to-srt/"',
			},
		],
	},
	{
		path: '/guides/best-subtitle-format-for-vimeo-embeds/',
		expect: [
			{
				label: 'Vimeo format guide CTR title',
				match: '<title>Best Subtitle Format for Vimeo Embeds - VTT Guide</title>',
			},
			{
				label: 'Vimeo format guide meta description',
				match: 'Choose the best subtitle format for Vimeo embeds. Use WebVTT for browser playback, convert SRT when needed, and validate captions before upload.',
			},
			{
				label: 'Vimeo format guide opens converter tool',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/srt-vs-vtt/',
		expect: [
			{
				label: 'SRT vs VTT guide CTR title',
				match: '<title>SRT vs VTT - Which Subtitle Format Should You Use?</title>',
			},
			{
				label: 'SRT vs VTT guide meta description',
				match: 'Compare SRT vs VTT for browser playback, uploads, cue numbers, timestamps, and when to convert subtitles for HTML5 video.',
			},
			{
				label: 'SRT vs VTT guide opens converter tool',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/ass-vs-srt/',
		expect: [
			{
				label: 'ASS vs SRT guide CTR title',
				match: '<title>ASS vs SRT - Styling, Uploads, and Delivery</title>',
			},
			{
				label: 'ASS vs SRT guide meta description',
				match: 'Compare ASS vs SRT for subtitle styling, upload compatibility, editor handoffs, and when to flatten ASS into a simpler SRT file.',
			},
			{
				label: 'ASS vs SRT guide opens converter tool',
				match: 'href="/tools/srt-to-ass/"',
			},
		],
	},
	{
		path: '/guides/ass-vs-vtt/',
		expect: [
			{
				label: 'ASS vs VTT guide CTR title',
				match: '<title>ASS vs VTT - Best Format for Browser Playback</title>',
			},
			{
				label: 'ASS vs VTT guide meta description',
				match: 'Compare ASS vs VTT for browser playback. Learn why WebVTT fits HTML5 video, what ASS styling loses, and when to convert.',
			},
			{
				label: 'ASS vs VTT guide opens converter tool',
				match: 'href="/tools/ass-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/when-webvtt-is-better-than-srt/',
		expect: [
			{
				label: 'WebVTT better than SRT guide CTR title',
				match: '<title>When WebVTT Is Better Than SRT - Browser Captions</title>',
			},
			{
				label: 'WebVTT better than SRT guide meta description',
				match: 'Learn when WebVTT is better than SRT for HTML5 video, browser players, cue settings, and web caption delivery.',
			},
			{
				label: 'WebVTT better than SRT guide opens converter tool',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/when-to-use-ass-instead-of-srt/',
		expect: [
			{
				label: 'ASS instead of SRT guide CTR title',
				match: '<title>When to Use ASS Instead of SRT - Styling Guide</title>',
			},
			{
				label: 'ASS instead of SRT guide meta description',
				match: 'Learn when ASS subtitles are better than SRT for styling, positioning, editing control, and when to export a simpler delivery file.',
			},
			{
				label: 'ASS instead of SRT guide opens converter tool',
				match: 'href="/tools/srt-to-ass/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-srt-to-ass/',
		expect: [
			{
				label: 'SRT to ASS guide CTR title',
				match: '<title>Convert SRT to ASS - Create Style-Ready Subtitles</title>',
			},
			{
				label: 'SRT to ASS guide meta description',
				match: 'Convert SRT subtitles to ASS for editing or styling. Preserve timing, add a basic ASS structure, and keep a simple delivery copy.',
			},
			{
				label: 'SRT to ASS guide opens converter tool',
				match: 'href="/tools/srt-to-ass/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-vtt-to-ass/',
		expect: [
			{
				label: 'VTT to ASS guide CTR title',
				match: '<title>Convert VTT to ASS - WebVTT to Styled Subtitle File</title>',
			},
			{
				label: 'VTT to ASS guide meta description',
				match: 'Convert WebVTT captions to ASS for subtitle editing. Preserve timing, move cue text into dialogue lines, and prepare a style-ready file.',
			},
			{
				label: 'VTT to ASS guide opens converter tool',
				match: 'href="/tools/vtt-to-ass/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-srt-to-txt/',
		expect: [
			{
				label: 'SRT to TXT guide CTR title',
				match: '<title>Convert SRT to TXT - Remove Timestamps for Transcript</title>',
			},
			{
				label: 'SRT to TXT guide meta description',
				match: 'Convert SRT to TXT by removing cue numbers, timestamps, and subtitle formatting. Create a clean transcript locally with no upload.',
			},
			{
				label: 'SRT to TXT guide opens converter tool',
				match: 'href="/tools/srt-to-txt/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-vtt-to-txt/',
		expect: [
			{
				label: 'VTT to TXT guide CTR title',
				match: '<title>Convert VTT to TXT - Extract Plain Text from WebVTT</title>',
			},
			{
				label: 'VTT to TXT guide meta description',
				match: 'Convert VTT to TXT by removing WEBVTT headers, timestamps, cue settings, and metadata. Create a clean transcript in your browser.',
			},
			{
				label: 'VTT to TXT guide opens converter tool',
				match: 'href="/tools/vtt-to-txt/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-ass-to-txt/',
		expect: [
			{
				label: 'ASS to TXT guide CTR title',
				match: '<title>Convert ASS to TXT - Remove Styling and Timing Codes</title>',
			},
			{
				label: 'ASS to TXT guide meta description',
				match: 'Convert ASS or SSA subtitles to TXT by removing styling tags, timing fields, and metadata. Extract clean dialogue locally with no upload.',
			},
			{
				label: 'ASS to TXT guide opens converter tool',
				match: 'href="/tools/ass-to-txt/"',
			},
		],
	},
	{
		path: '/guides/how-to-merge-two-srt-files/',
		expect: [
			{
				label: 'merge SRT guide CTR title',
				match: '<title>Merge Two SRT Files - Combine and Renumber Subtitles</title>',
			},
			{
				label: 'merge SRT guide meta description',
				match: 'Merge two SRT files into one sorted subtitle file. Combine cues, renumber blocks, preserve timing, and download locally with no upload.',
			},
			{
				label: 'merge SRT guide opens merger tool',
				match: 'href="/tools/subtitle-merger/"',
			},
		],
	},
	{
		path: '/guides/why-subtitles-are-out-of-sync-after-export/',
		expect: [
			{
				label: 'export sync guide CTR title',
				match: '<title>Subtitles Out of Sync After Export - Fix Timing Drift</title>',
			},
			{
				label: 'export sync guide meta description',
				match: 'Fix subtitles that go out of sync after export by checking offsets, scene cuts, drift, timeline changes, and subtitle conversion issues.',
			},
			{
				label: 'export sync guide opens sync tool',
				match: 'href="/tools/fix-out-of-sync-subtitles/"',
			},
			{
				label: 'export sync guide links partial shifter tool',
				match: 'href="/tools/partial-subtitle-shifter/"',
			},
		],
	},
	{
		path: '/guides/fix-out-of-sync-subtitles/',
		expect: [
			{
				label: 'out-of-sync guide CTR title',
				match: '<title>Fix Out-of-Sync Subtitles Online - Shift Timing</title>',
			},
			{
				label: 'out-of-sync guide no-upload meta description',
				match: 'Fix out-of-sync SRT, VTT, or ASS subtitles by measuring the offset, shifting timing online, and downloading a corrected file with no upload.',
			},
			{
				label: 'out-of-sync guide opens sync tool',
				match: 'href="/tools/fix-out-of-sync-subtitles/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-vlc-subtitle-delay/',
		expect: [
			{
				label: 'VLC subtitle delay guide CTR title',
				match: '<title>Fix VLC Subtitle Delay - Sync SRT, VTT, ASS Timing</title>',
			},
			{
				label: 'VLC subtitle delay guide meta description',
				match: 'Fix VLC subtitle delay by measuring whether captions are early or late, previewing the offset in VLC, and saving a corrected SRT, VTT, or ASS file.',
			},
			{
				label: 'VLC subtitle delay guide opens delay fixer tool',
				match: 'href="/tools/subtitle-delay-fixer/"',
			},
			{
				label: 'FAQ schema for VLC subtitle delay questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Does VLC save subtitle delay changes\?/
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitle-timing-after-cutting-video/',
		expect: [
			{
				label: 'cutting video timing guide CTR title',
				match: '<title>Fix Subtitle Timing After Cutting Video - Scene Edits</title>',
			},
			{
				label: 'cutting video timing guide no-upload meta description',
				match: 'Fix subtitle timing after trimming or cutting a video. Shift the whole file or only cues after a scene edit locally with no upload.',
			},
			{
				label: 'cutting video timing guide opens partial shifter',
				match: 'href="/tools/partial-subtitle-shifter/"',
			},
		],
	},
	{
		path: '/guides/how-to-shift-only-part-of-a-subtitle-file/',
		expect: [
			{
				label: 'partial subtitle shift guide CTR title',
				match: '<title>Shift Part of a Subtitle File - Partial Timing Fix</title>',
			},
			{
				label: 'partial subtitle shift guide no-upload meta description',
				match: 'Shift only one time range in an SRT, VTT, or ASS subtitle file while keeping the rest of the captions unchanged. No upload required.',
			},
			{
				label: 'partial subtitle shift guide opens partial shifter',
				match: 'href="/tools/partial-subtitle-shifter/"',
			},
		],
	},
	{
		path: '/guides/how-to-clean-an-srt-file/',
		expect: [
			{
				label: 'clean SRT guide CTR title',
				match: '<title>Clean SRT File Online - Fix Cue Numbers and Spacing</title>',
			},
			{
				label: 'clean SRT guide no-upload meta description',
				match: 'Clean an SRT file online by fixing cue numbers, timestamp spacing, blank lines, and leftover tags locally in your browser with no upload.',
			},
			{
				label: 'clean SRT guide opens cleaner tool',
				match: 'href="/tools/clean-srt-file/"',
			},
		],
	},
	{
		path: '/guides/how-to-create-a-transcript-from-subtitles/',
		expect: [
			{
				label: 'transcript guide CTR title',
				match: '<title>Create Transcript from Subtitles - Free No Upload</title>',
			},
			{
				label: 'transcript guide no-upload meta description',
				match: 'Create a readable transcript from SRT, VTT, or ASS subtitles. Remove timestamps and caption metadata locally in your browser with no upload.',
			},
		],
	},
	{
		path: '/guides/how-to-create-dual-language-subtitles/',
		expect: [
			{
				label: 'dual-language guide CTR title',
				match: '<title>Create Dual-Language Subtitles - Bilingual SRT Guide</title>',
			},
			{
				label: 'dual-language guide meta description',
				match: 'Create bilingual subtitles by combining original and translated lines inside one timed file. Check cue timing, overlaps, and readability before export.',
			},
		],
	},
	{
		path: '/guides/how-to-convert-ass-to-vtt-for-web-players/',
		expect: [
			{
				label: 'ASS to VTT guide CTR title',
				match: '<title>Convert ASS to VTT for Web Players - No Upload</title>',
			},
			{
				label: 'ASS to VTT guide meta description',
				match: 'Convert ASS subtitles to VTT for HTML5 video and web players. Remove ASS styling, keep timing and text, and create browser-ready WebVTT locally.',
			},
			{
				label: 'ASS to VTT guide opens converter tool',
				match: 'href="/tools/ass-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-overlapping-subtitles/',
		expect: [
			{
				label: 'overlapping subtitles guide CTR title',
				match: '<title>Fix Overlapping Subtitles - Repair Cue Timing</title>',
			},
			{
				label: 'overlapping subtitles guide meta description',
				match: 'Fix overlapping subtitles by finding cue timing conflicts, sorting caption blocks, and repairing SRT, VTT, or ASS files before playback.',
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitle-line-breaks/',
		expect: [
			{
				label: 'line breaks guide CTR title',
				match: '<title>Fix Subtitle Line Breaks - Clean Caption Text</title>',
			},
			{
				label: 'line breaks guide meta description',
				match: 'Fix messy subtitle line breaks by cleaning SRT or VTT spacing, preserving readable caption text, and checking output before upload.',
			},
		],
	},
	{
		path: '/guides/why-srt-file-is-not-working/',
		expect: [
			{
				label: 'SRT not working guide CTR title',
				match: '<title>SRT File Not Working - Fix Subtitle Playback</title>',
			},
			{
				label: 'SRT not working guide meta description',
				match: 'Fix an SRT file that is not working by checking timestamps, cue order, encoding, file naming, and player format support before upload or playback.',
			},
			{
				label: 'SRT not working guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for SRT not working questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why is my SRT file not working\?/
			},
		],
	},
	{
		path: '/guides/why-subtitles-are-missing-after-conversion/',
		expect: [
			{
				label: 'missing subtitles after conversion guide CTR title',
				match: '<title>Subtitles Missing After Conversion - Fix Cue Loss</title>',
			},
			{
				label: 'missing subtitles after conversion guide meta description',
				match: 'Fix subtitles missing after conversion by checking malformed cues, unsupported styling, empty captions, timestamp order, and format-specific parser limits.',
			},
			{
				label: 'missing subtitles after conversion guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for missing subtitles after conversion questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are some subtitles missing after conversion\?/
			},
		],
	},
	{
		path: '/guides/why-converted-subtitle-file-is-empty/',
		expect: [
			{
				label: 'empty converted subtitle guide CTR title',
				match: '<title>Converted Subtitle File Empty - Fix No Text</title>',
			},
			{
				label: 'empty converted subtitle guide meta description',
				match: 'Fix an empty subtitle file after conversion by checking wrong file format, empty dialogue rows, unsupported styling, timestamps, and parser errors.',
			},
			{
				label: 'empty converted subtitle guide opens validator tool',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'FAQ schema for empty converted subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why is my converted subtitle file empty\?/
			},
		],
	},
	{
		path: '/guides/why-subtitles-drift-out-of-sync/',
		expect: [
			{
				label: 'subtitle drift guide CTR title',
				match: '<title>Subtitle Drift Fix - Frame Rate Sync Guide</title>',
			},
			{
				label: 'subtitle drift guide meta description',
				match: 'Fix subtitle drift when captions get progressively out of sync by checking frame rate mismatch, video cuts, duration differences, and timing stretch.',
			},
			{
				label: 'subtitle drift guide opens sync tool',
				match: 'href="/tools/fix-out-of-sync-subtitles/"',
			},
			{
				label: 'FAQ schema for subtitle drift questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why do subtitles get more out of sync over time\?/
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitles-that-are-too-long/',
		expect: [
			{
				label: 'long subtitles guide CTR title',
				match: '<title>Fix Subtitles That Are Too Long - Line Length Guide</title>',
			},
			{
				label: 'long subtitles guide meta description',
				match: 'Fix subtitles that are too long by checking line length, cue duration, reading speed, and line breaks before upload or playback.',
			},
			{
				label: 'long subtitles guide opens subtitle cleaner tool',
				match: 'href="/tools/subtitle-cleaner/"',
			},
			{
				label: 'FAQ schema for long subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How long should a subtitle line be\?/
			},
		],
	},
	{
		path: '/guides/how-to-fix-subtitles-that-are-too-fast-or-too-slow/',
		expect: [
			{
				label: 'fast or slow guide CTR title',
				match: '<title>Fix Subtitles Too Fast or Slow - Timing Shift Guide</title>',
			},
			{
				label: 'fast or slow guide meta description',
				match: 'Fix subtitles that appear too fast or too slow by measuring the offset, shifting SRT, VTT, or ASS timing, and checking drift before export.',
			},
			{
				label: 'fast or slow guide opens time shifter tool',
				match: 'href="/tools/subtitle-time-shifter/"',
			},
		],
	},
	{
		path: '/guides/common-subtitle-format-errors-and-fixes/',
		expect: [
			{
				label: 'common errors guide CTR title',
				match: '<title>Common Subtitle Format Errors - Fix SRT, VTT, ASS</title>',
			},
			{
				label: 'common errors guide meta description',
				match: 'Diagnose common subtitle format errors, including wrong file type, garbled text, broken timing, messy spacing, and upload failures.',
			},
			{
				label: 'common errors guide opens subtitle cleaner tool',
				match: 'href="/tools/subtitle-cleaner/"',
			},
		],
	},
	{
		path: '/guides/how-to-remove-html-tags-from-subtitles/',
		expect: [
			{
				label: 'HTML tag cleanup guide CTR title',
				match: '<title>Remove HTML Tags from Subtitles - Clean SRT, VTT, ASS</title>',
			},
			{
				label: 'HTML tag cleanup guide meta description',
				match: 'Remove HTML tags from subtitles while keeping timing intact. Clean SRT, VTT, or ASS caption text locally before upload.',
			},
			{
				label: 'HTML tag cleanup guide opens cleaner tool',
				match: 'href="/tools/subtitle-cleaner/"',
			},
		],
	},
	{
		path: '/guides/how-to-fix-out-of-order-subtitle-cues/',
		expect: [
			{
				label: 'out-of-order guide CTR title',
				match: '<title>Fix Out-of-Order Subtitle Cues - Sort Timing Blocks</title>',
			},
			{
				label: 'out-of-order guide meta description',
				match: 'Fix out-of-order subtitle cues by sorting timing blocks, checking overlaps, and cleaning SRT, VTT, or ASS files before playback.',
			},
			{
				label: 'out-of-order guide opens subtitle cleaner tool',
				match: 'href="/tools/subtitle-cleaner/"',
			},
		],
	},
	{
		path: '/guides/how-to-convert-vtt-to-srt-for-legacy-subtitle-editors/',
		expect: [
			{
				label: 'updated VTT to SRT guide title',
				match: '<title>VTT to SRT Converter Guide - Free WebVTT to SubRip</title>',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-video/',
		expect: [
			{
				label: 'video extraction guide CTR title',
				match: '<title>Extract Subtitles from Video - MP4, MKV, MOV Guide</title>',
			},
			{
				label: 'video extraction guide no-upload meta description',
				match: 'Extract embedded subtitle tracks from MP4, MKV, MOV, and WebM files locally. Learn when video captions can be saved as SRT and when OCR is required.',
			},
			{
				label: 'video extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for video extraction questions',
				match: 'Can I extract subtitles from an MP4 file?',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-mkv/',
		expect: [
			{
				label: 'updated MKV extraction guide title',
				match: '<title>Extract Subtitles from MKV - Free No Upload Guide</title>',
			},
			{
				label: 'MKV extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
		],
	},
	{
		path: '/guides/embedded-vs-burned-in-subtitles/',
			expect: [
			{
				label: 'embedded vs burned-in guide title',
				match: '<title>Embedded vs Burned-In Subtitles - What You Can Extract</title>',
			},
			{
				label: 'embedded vs burned-in guide extraction meta description',
				match: 'Compare embedded and burned-in subtitles before extraction. Learn when a video has real text tracks, when OCR is required, and what can be saved.',
			},
			{
				label: 'embedded vs burned-in guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
		],
	},
	{
		path: '/tools/srt-to-vtt/',
		expect: [
			{
				label: 'CTR-oriented SRT to VTT tool title',
				match: '<title>SRT to VTT Converter Online - Free, No Upload</title>',
			},
			{
				label: 'SRT to VTT no-upload meta description',
				match: 'Convert SRT subtitles to VTT online for free. Create a WebVTT file for HTML5 video locally in your browser with no signup or upload.',
			},
			{
				label: 'HowTo schema for tool workflow',
				match: /"@type"\s*:\s*"HowTo"/,
			},
			{
				label: 'visible ordered tool workflow steps',
				match: /<ol\b[\s\S]*Add a supported subtitle file/,
			},
			{
				label: 'tool edit quality analytics event',
				match: 'subtitle_tool_edit_input',
			},
			{
				label: 'download analytics avoids local filenames',
				match: 'output_extension',
			},
			{
				label: 'tool ad placeholder stays below workspace',
				after: ['class="workspace"', 'data-ad-slot="tool-below-workflow"'],
			},
			{
				label: 'tool ad placeholder is hidden from assistive tech',
				match: 'data-ad-slot="tool-below-workflow" aria-hidden="true"',
			},
			{
				label: 'tool page does not enable ads before readiness gate',
				absent: 'data-ads-enabled="true"',
			},
		],
	},
	{
		path: '/privacy-policy/',
		expect: [
			{
				label: 'privacy policy says analytics avoids local file names',
				match: 'Analytics events do not intentionally include subtitle text or local file names.',
			},
		],
	},
	{
		path: '/tools/subtitle-delay-fixer/',
		expect: [
			{
				label: 'CTR-oriented delay fixer tool title',
				match: '<title>Fix Subtitle Delay Online - Free, No Upload</title>',
			},
			{
				label: 'delay fixer no-upload meta description',
				match: 'Fix subtitle delay online for SRT, VTT, and ASS files. Shift captions earlier or later locally in your browser with no signup or upload.',
			},
			{
				label: 'delay fixer links subtitle drift guide',
				match: 'href="/guides/why-subtitles-drift-out-of-sync/"',
			},
		],
	},
	{
		path: '/tools/srt-to-txt/',
		expect: [
			{
				label: 'SRT to TXT tool title',
				match: '<title>SRT to TXT Converter - Extract Subtitle Text Online</title>',
			},
			{
				label: 'SRT to TXT tool meta description',
				match: 'Convert SRT subtitles to plain text online for free. Remove timestamps and cue numbers, then copy or download clean TXT output.',
			},
			{
				label: 'SRT to TXT tool links guide',
				match: 'href="/guides/how-to-convert-srt-to-txt/"',
			},
		],
	},
	{
		path: '/tools/vtt-to-txt/',
		expect: [
			{
				label: 'VTT to TXT tool title',
				match: '<title>VTT to TXT Converter - Extract Caption Text Online</title>',
			},
			{
				label: 'VTT to TXT tool meta description',
				match: 'Convert VTT WebVTT captions to plain text online for free. Remove headers, timestamps, and cue settings from a .vtt file.',
			},
			{
				label: 'VTT to TXT tool links guide',
				match: 'href="/guides/how-to-convert-vtt-to-txt/"',
			},
		],
	},
	{
		path: '/tools/ass-to-txt/',
		expect: [
			{
				label: 'ASS to TXT tool title',
				match: '<title>ASS to TXT Converter - Extract Subtitle Text Online</title>',
			},
			{
				label: 'ASS to TXT tool meta description',
				match: 'Convert ASS subtitles to plain text online for free. Remove style tags, timing, and dialogue metadata from ASS or SSA files.',
			},
			{
				label: 'ASS to TXT tool links guide',
				match: 'href="/guides/how-to-convert-ass-to-txt/"',
			},
		],
	},
	{
		path: '/tools/srt-validator/',
		expect: [
			{
				label: 'CTR-oriented SRT validator tool title',
				match: '<title>SRT Validator Online - Free Subtitle Checker</title>',
			},
			{
				label: 'SRT validator no-upload meta description',
				match: 'Validate SRT subtitles online for free. Check timestamp format, cue order, numbering, and upload errors locally with no signup or upload.',
			},
		],
	},
	{
		path: '/tools/webvtt-validator/',
		expect: [
			{
				label: 'CTR-oriented WebVTT validator tool title',
				match: '<title>WebVTT Validator Online - Free VTT Checker</title>',
			},
			{
				label: 'WebVTT validator local meta description',
				match: 'Validate WebVTT captions online for free. Check the WEBVTT header, timestamp syntax, cue order, and browser caption issues locally.',
			},
		],
	},
	{
		path: '/tools/subtitle-encoding-fixer/',
		expect: [
			{
				label: 'CTR-oriented encoding fixer tool title',
				match: '<title>Subtitle Encoding Fixer - Fix Garbled Subtitles Online</title>',
			},
			{
				label: 'encoding fixer local UTF-8 meta description',
				match: 'Fix garbled subtitles online by converting SRT, VTT, ASS, SSA, and SMI files to clean UTF-8 text locally in your browser.',
			},
			{
				label: 'encoding fixer links to garbled subtitles guide',
				match: 'href="/guides/how-to-fix-garbled-subtitles/"',
			},
			{
				label: 'encoding fixer links to UTF-8 conversion guide',
				match: 'href="/guides/how-to-convert-subtitles-to-utf-8/"',
			},
		],
	},
	{
		path: '/tools/srt-to-ass/',
		expect: [
			{
				label: 'updated SRT to ASS tool title',
				match: '<title>SRT to ASS Converter - Convert Subtitles Online Free</title>',
			},
			{
				label: 'free software schema field',
				match: /"isAccessibleForFree"\s*:\s*true/,
			},
		],
	},
	{
		path: '/tools/vtt-to-ass/',
		expect: [
			{
				label: 'VTT to ASS tool title',
				match: '<title>VTT to ASS Converter - Convert Captions Online Free</title>',
			},
			{
				label: 'VTT to ASS tool meta description',
				match: 'Convert WebVTT captions to ASS format for subtitle editing and style-ready workflows, locally in your browser with no upload.',
			},
			{
				label: 'VTT to ASS tool links guide',
				match: 'href="/guides/how-to-convert-vtt-to-ass/"',
			},
		],
	},
	{
		path: '/tools/ass-to-vtt/',
		expect: [
			{
				label: 'ASS to VTT tool title',
				match: '<title>ASS to VTT Converter - Convert Subtitles Online Free</title>',
			},
			{
				label: 'ASS to VTT tool meta description',
				match: 'Convert ASS subtitles to WebVTT for browser playback and HTML5 video delivery while keeping subtitle timing and readable text.',
			},
			{
				label: 'ASS to VTT tool links guide',
				match: 'href="/guides/how-to-convert-ass-to-vtt-for-web-players/"',
			},
		],
	},
	{
		path: '/tools/ass-to-srt/',
		expect: [
			{
				label: 'ASS to SRT tool links to YouTube upload conversion guide',
				match: 'href="/guides/how-to-convert-ass-to-srt-for-youtube-uploads/"',
			},
			{
				label: 'ASS to SRT tool links to YouTube SRT vs ASS guide',
				match: 'href="/guides/srt-vs-ass-for-youtube-captions/"',
			},
		],
	},
	{
		path: '/tools/html5-video-subtitle-converter/',
		expect: [
			{
				label: 'HTML5 converter tool title',
				match: '<title>HTML5 Video Subtitle Converter - Convert Captions to VTT</title>',
			},
			{
				label: 'HTML5 converter tool meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT for HTML5 video tracks. Create browser-ready VTT captions online for free.',
			},
			{
				label: 'HTML5 converter tool links guide',
				match: 'href="/guides/how-to-convert-subtitles-for-html5-video/"',
			},
		],
	},
	{
		path: '/tools/videojs-subtitle-converter/',
		expect: [
			{
				label: 'Video.js converter tool title',
				match: '<title>Video.js Subtitle Converter - Convert Captions to VTT</title>',
			},
			{
				label: 'Video.js converter tool meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT captions for Video.js players. Free browser-based subtitle conversion.',
			},
			{
				label: 'Video.js converter tool links guide',
				match: 'href="/guides/how-to-convert-subtitles-for-videojs/"',
			},
		],
	},
	{
		path: '/tools/jw-player-subtitle-converter/',
		expect: [
			{
				label: 'JW Player converter tool title',
				match: '<title>JW Player Subtitle Converter - Convert Captions to VTT</title>',
			},
			{
				label: 'JW Player converter tool meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT captions for JW Player and browser video delivery, locally in your browser.',
			},
			{
				label: 'JW Player converter tool links guide',
				match: 'href="/guides/how-to-convert-subtitles-for-jw-player/"',
			},
		],
	},
	{
		path: '/tools/plex-subtitle-converter/',
		expect: [
			{
				label: 'Plex converter tool title',
				match: '<title>Plex Subtitle Converter - Convert Captions to SRT</title>',
			},
			{
				label: 'Plex converter tool meta description',
				match: 'Convert VTT or ASS subtitles to SRT for Plex libraries and broad playback compatibility. Free browser-based converter.',
			},
			{
				label: 'Plex converter tool links naming guide',
				match: 'href="/guides/how-to-name-subtitle-files-for-plex/"',
			},
		],
	},
	{
		path: '/tools/vimeo-subtitle-converter/',
		expect: [
			{
				label: 'Vimeo converter tool title',
				match: '<title>Vimeo Subtitle Converter - Convert Captions to VTT</title>',
			},
			{
				label: 'Vimeo converter tool meta description',
				match: 'Convert SRT or ASS subtitles to WebVTT for Vimeo embeds and web playback. Free browser-local subtitle converter.',
			},
			{
				label: 'Vimeo converter tool links guide',
				match: 'href="/guides/how-to-convert-subtitles-for-vimeo/"',
			},
		],
	},
	{
		path: '/tools/subtitle-time-shifter/',
		expect: [
			{
				label: 'time shifter tool title',
				match: '<title>Subtitle Time Shifter - Fix Subtitle Delay Online</title>',
			},
			{
				label: 'time shifter tool meta description',
				match: 'Shift subtitle timing online for SRT, VTT, and ASS files. Fix subtitles that are too early or too late without signup or upload.',
			},
			{
				label: 'time shifter tool links sync guide',
				match: 'href="/guides/fix-out-of-sync-subtitles/"',
			},
			{
				label: 'time shifter tool links subtitle drift guide',
				match: 'href="/guides/why-subtitles-drift-out-of-sync/"',
			},
		],
	},
	{
		path: '/tools/fix-out-of-sync-subtitles/',
		expect: [
			{
				label: 'fix sync tool title',
				match: '<title>Fix Out-of-Sync Subtitles Online</title>',
			},
			{
				label: 'fix sync tool meta description',
				match: 'Fix out-of-sync subtitles online by shifting SRT, VTT, or ASS cues earlier or later to match the video.',
			},
			{
				label: 'fix sync tool links export guide',
				match: 'href="/guides/why-subtitles-are-out-of-sync-after-export/"',
			},
			{
				label: 'fix sync tool links subtitle drift guide',
				match: 'href="/guides/why-subtitles-drift-out-of-sync/"',
			},
		],
	},
	{
		path: '/tools/subtitle-transcript-generator/',
		expect: [
			{
				label: 'transcript generator tool title',
				match: '<title>Subtitle Transcript Generator - Convert Subtitles to Text</title>',
			},
			{
				label: 'transcript generator tool meta description',
				match: 'Generate a plain text transcript from SRT, VTT, or ASS subtitle files directly in your browser without uploading files.',
			},
			{
				label: 'transcript generator tool links guide',
				match: 'href="/guides/how-to-create-a-transcript-from-subtitles/"',
			},
		],
	},
	{
		path: '/tools/subtitle-merger/',
		expect: [
			{
				label: 'subtitle merger tool title',
				match: '<title>Subtitle Merger - Merge SRT, VTT, and ASS Online</title>',
			},
			{
				label: 'subtitle merger tool meta description',
				match: 'Merge two SRT, VTT, or ASS subtitle files into one sorted output file locally in your browser, with no account or server upload.',
			},
			{
				label: 'subtitle merger tool links guide',
				match: 'href="/guides/how-to-merge-two-srt-files/"',
			},
		],
	},
	{
		path: '/tools/partial-subtitle-shifter/',
		expect: [
			{
				label: 'partial shifter tool title',
				match: '<title>Partial Subtitle Shifter - Shift One Section Online</title>',
			},
			{
				label: 'partial shifter tool meta description',
				match: 'Shift only a selected time range inside an SRT, VTT, or ASS subtitle file without moving the rest of the captions, locally in your browser.',
			},
			{
				label: 'partial shifter tool links guide',
				match: 'href="/guides/how-to-shift-only-part-of-a-subtitle-file/"',
			},
		],
	},
	{
		path: '/tools/',
		expect: [
			{
				label: 'updated tools index title',
				match: '<title>Free Subtitle Tools - Convert, Fix, Clean SRT, VTT, ASS</title>',
			},
		],
	},
	{
		path: '/tools/extract-subtitles-from-video/',
		expect: [
			{
				label: 'extractor tool links video extraction guide',
				match: 'href="/guides/how-to-extract-subtitles-from-video/"',
			},
		],
	},
	{
		path: '/guides/',
		expect: [
			{
				label: 'high-intent guide section',
				match: 'High-intent subtitle problems to fix first.',
			},
			{
				label: 'guides index includes platform caption fixes section',
				match: 'Platform caption fixes',
			},
			{
				label: 'guides index links to YouTube upload failure guide',
				match: '/guides/why-youtube-subtitles-upload-failed/',
			},
			{
				label: 'guides index links to YouTube subtitle conversion guide',
				match: '/guides/how-to-convert-subtitles-for-youtube/',
			},
			{
				label: 'guides index links to SRT upload failure guide',
				match: '/guides/why-srt-file-wont-upload/',
			},
			{
				label: 'guides index includes format decisions section',
				match: 'Format decisions',
			},
			{
				label: 'guides index links to SRT vs VTT guide',
				match: '/guides/srt-vs-vtt/',
			},
			{
				label: 'guides index links to ASS vs SRT guide',
				match: '/guides/ass-vs-srt/',
			},
			{
				label: 'guides index links to ASS vs VTT guide',
				match: '/guides/ass-vs-vtt/',
			},
			{
				label: 'guides index links to WebVTT better than SRT guide',
				match: '/guides/when-webvtt-is-better-than-srt/',
			},
			{
				label: 'guides index links to ASS instead of SRT guide',
				match: '/guides/when-to-use-ass-instead-of-srt/',
			},
			{
				label: 'guides index includes upload prep section',
				match: 'Upload prep',
			},
			{
				label: 'guides index links to ASS to SRT YouTube guide',
				match: '/guides/how-to-convert-ass-to-srt-for-youtube-uploads/',
			},
			{
				label: 'guides index links to subtitle cleanup before upload guide',
				match: '/guides/how-to-clean-subtitle-formatting-before-upload/',
			},
			{
				label: 'guides index links to SRT validation guide',
				match: '/guides/how-to-validate-srt-files/',
			},
			{
				label: 'guides index links to WebVTT validation guide',
				match: '/guides/how-to-validate-webvtt-files/',
			},
			{
				label: 'guides index links to Video.js caption failure guide',
				match: '/guides/why-videojs-captions-are-not-showing/',
			},
			{
				label: 'guides index links to JW Player caption failure guide',
				match: '/guides/why-jw-player-captions-are-not-showing/',
			},
			{
				label: 'guides index links to VLC subtitle failure guide',
				match: '/guides/why-vlc-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to Plex subtitle failure guide',
				match: '/guides/why-plex-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to Vimeo caption failure guide',
				match: '/guides/why-vimeo-captions-are-not-showing/',
			},
			{
				label: 'guides index includes encoding fixes section',
				match: 'Encoding fixes',
			},
			{
				label: 'guides index includes HTML5 captions section',
				match: 'HTML5 captions',
			},
			{
				label: 'guides index links to HTML5 conversion guide',
				match: '/guides/how-to-convert-subtitles-for-html5-video/',
			},
			{
				label: 'guides index links to multiple language HTML5 guide',
				match: '/guides/how-to-add-multiple-subtitle-languages-to-html5-video/',
			},
			{
				label: 'guides index includes player conversions section',
				match: 'Player conversions',
			},
			{
				label: 'guides index links to Video.js conversion guide',
				match: '/guides/how-to-convert-subtitles-for-videojs/',
			},
			{
				label: 'guides index links to JW Player conversion guide',
				match: '/guides/how-to-convert-subtitles-for-jw-player/',
			},
			{
				label: 'guides index links to Plex conversion guide',
				match: '/guides/how-to-convert-subtitles-for-plex/',
			},
			{
				label: 'guides index links to Vimeo conversion guide',
				match: '/guides/how-to-convert-subtitles-for-vimeo/',
			},
			{
				label: 'guides index includes player format choices section',
				match: 'Player format choices',
			},
			{
				label: 'guides index links to Video.js format guide',
				match: '/guides/best-subtitle-format-for-videojs/',
			},
			{
				label: 'guides index links to JW Player format guide',
				match: '/guides/best-subtitle-format-for-jw-player/',
			},
			{
				label: 'guides index links to Plex format guide',
				match: '/guides/best-subtitle-format-for-plex/',
			},
			{
				label: 'guides index links to Vimeo format guide',
				match: '/guides/best-subtitle-format-for-vimeo-embeds/',
			},
			{
				label: 'guides index includes transcript workflows section',
				match: 'Transcript workflows',
			},
			{
				label: 'guides index links to SRT to TXT guide',
				match: '/guides/how-to-convert-srt-to-txt/',
			},
			{
				label: 'guides index links to VTT to TXT guide',
				match: '/guides/how-to-convert-vtt-to-txt/',
			},
			{
				label: 'guides index links to ASS to TXT guide',
				match: '/guides/how-to-convert-ass-to-txt/',
			},
			{
				label: 'guides index links to transcript generator guide',
				match: '/guides/how-to-create-a-transcript-from-subtitles/',
			},
			{
				label: 'guides index links to dual-language subtitle guide',
				match: '/guides/how-to-create-dual-language-subtitles/',
			},
			{
				label: 'guides index links to merge SRT guide',
				match: '/guides/how-to-merge-two-srt-files/',
			},
			{
				label: 'guides index links to ASS to VTT guide',
				match: '/guides/how-to-convert-ass-to-vtt-for-web-players/',
			},
			{
				label: 'guides index includes subtitle repair triage section',
				match: 'Subtitle repair triage',
			},
			{
				label: 'guides index links to fast or slow guide',
				match: '/guides/how-to-fix-subtitles-that-are-too-fast-or-too-slow/',
			},
			{
				label: 'guides index links to long subtitles guide',
				match: '/guides/how-to-fix-subtitles-that-are-too-long/',
			},
			{
				label: 'guides index links to VLC subtitle delay guide',
				match: '/guides/how-to-fix-vlc-subtitle-delay/',
			},
			{
				label: 'guides index links to common errors guide',
				match: '/guides/common-subtitle-format-errors-and-fixes/',
			},
			{
				label: 'guides index links to SRT not working guide',
				match: '/guides/why-srt-file-is-not-working/',
			},
			{
				label: 'guides index links to missing subtitles after conversion guide',
				match: '/guides/why-subtitles-are-missing-after-conversion/',
			},
			{
				label: 'guides index links to empty converted subtitle guide',
				match: '/guides/why-converted-subtitle-file-is-empty/',
			},
			{
				label: 'guides index links to subtitle drift guide',
				match: '/guides/why-subtitles-drift-out-of-sync/',
			},
			{
				label: 'guides index links to out-of-order guide',
				match: '/guides/how-to-fix-out-of-order-subtitle-cues/',
			},
			{
				label: 'guides index links to overlapping subtitles guide',
				match: '/guides/how-to-fix-overlapping-subtitles/',
			},
			{
				label: 'guides index links to subtitle line breaks guide',
				match: '/guides/how-to-fix-subtitle-line-breaks/',
			},
			{
				label: 'guides index links to UTF-8 conversion guide',
				match: '/guides/how-to-convert-subtitles-to-utf-8/',
			},
			{
				label: 'guides index links to garbled subtitles guide',
				match: '/guides/how-to-fix-garbled-subtitles/',
			},
			{
				label: 'guides index links to boxes subtitles guide',
				match: '/guides/how-to-fix-subtitles-showing-boxes/',
			},
			{
				label: 'guides index links to Windows-1252 vs UTF-8 guide',
				match: '/guides/subtitle-encoding-windows-1252-vs-utf-8/',
			},
			{
				label: 'guides index includes subtitle extraction section',
				match: 'Subtitle extraction',
			},
			{
				label: 'guides index links to video extraction guide',
				match: '/guides/how-to-extract-subtitles-from-video/',
			},
			{
				label: 'guides index links to MKV extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mkv/',
			},
			{
				label: 'guides index links to embedded vs burned-in guide',
				match: '/guides/embedded-vs-burned-in-subtitles/',
			},
		],
	},
	{
		path: '/guides/conversion-guides/',
		expect: [
			{
				label: 'updated conversion hub title',
				match: '<title>Subtitle Conversion Guides - SRT, VTT, ASS Workflows</title>',
			},
		],
	},
	{
		path: '/guides/sync-fixes/',
		expect: [
			{
				label: 'updated sync fixes hub title',
				match: '<title>Subtitle Sync Fixes - Timing, Delay, and VTT Errors</title>',
			},
		],
	},
	{
		path: '/sitemap-0.xml',
		expect: [
			{
				label: expectedLastmod
					? 'sitemap lastmod matches current commit time'
					: 'sitemap includes lastmod entries',
				match: expectedLastmod
					? `<lastmod>${expectedLastmod}</lastmod>`
					: /<lastmod>\d{4}-\d{2}-\d{2}T/,
			},
		],
	},
	{
		path: '/llms.txt',
		expect: [
			{
				label: 'llms lists YouTube converter tool',
				match: 'https://subtitletoolkit.tools/tools/youtube-subtitle-converter/',
			},
			{
				label: 'llms lists SRT validator tool',
				match: 'https://subtitletoolkit.tools/tools/srt-validator/',
			},
			{
				label: 'llms lists WebVTT validator tool',
				match: 'https://subtitletoolkit.tools/tools/webvtt-validator/',
			},
			{
				label: 'llms lists SRT timestamp fixer tool',
				match: 'https://subtitletoolkit.tools/tools/fix-srt-timestamps/',
			},
			{
				label: 'llms lists invalid WebVTT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-invalid-webvtt-timestamps/',
			},
			{
				label: 'llms lists HTML5 subtitle troubleshooting guide',
				match: 'https://subtitletoolkit.tools/guides/why-subtitles-do-not-show-in-html5-video/',
			},
			{
				label: 'llms lists VTT captions not loading guide',
				match: 'https://subtitletoolkit.tools/guides/why-vtt-captions-are-not-loading/',
			},
			{
				label: 'llms lists Video.js caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-videojs-captions-are-not-showing/',
			},
			{
				label: 'llms lists Video.js subtitle format guide',
				match: 'https://subtitletoolkit.tools/guides/best-subtitle-format-for-videojs/',
			},
			{
				label: 'llms lists JW Player caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-jw-player-captions-are-not-showing/',
			},
			{
				label: 'llms lists JW Player subtitle format guide',
				match: 'https://subtitletoolkit.tools/guides/best-subtitle-format-for-jw-player/',
			},
			{
				label: 'llms lists VLC subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-vlc-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists Plex subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-plex-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists Plex subtitle format guide',
				match: 'https://subtitletoolkit.tools/guides/best-subtitle-format-for-plex/',
			},
			{
				label: 'llms lists Vimeo caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-vimeo-captions-are-not-showing/',
			},
			{
				label: 'llms lists Vimeo subtitle format guide',
				match: 'https://subtitletoolkit.tools/guides/best-subtitle-format-for-vimeo-embeds/',
			},
			{
				label: 'llms lists UTF-8 conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-to-utf-8/',
			},
			{
				label: 'llms lists garbled subtitles guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-garbled-subtitles/',
			},
			{
				label: 'llms lists boxes subtitles guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-subtitles-showing-boxes/',
			},
			{
				label: 'llms lists Windows-1252 vs UTF-8 guide',
				match: 'https://subtitletoolkit.tools/guides/subtitle-encoding-windows-1252-vs-utf-8/',
			},
			{
				label: 'llms lists malformed SRT timestamp guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-malformed-srt-timestamps/',
			},
			{
				label: 'llms lists VTT CORS troubleshooting guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-cors-errors-for-vtt-subtitles/',
			},
			{
				label: 'llms lists scene-cut sync guide',
				match: 'https://subtitletoolkit.tools/guides/fix-subtitle-sync-after-a-scene-cut/',
			},
			{
				label: 'llms lists VLC subtitle delay guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-vlc-subtitle-delay/',
			},
			{
				label: 'llms lists WebVTT validation guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-validate-webvtt-files/',
			},
			{
				label: 'llms lists HTML5 subtitle conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-html5-video/',
			},
			{
				label: 'llms lists HTML5 multi-language guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-add-multiple-subtitle-languages-to-html5-video/',
			},
			{
				label: 'llms lists Video.js conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-videojs/',
			},
			{
				label: 'llms lists JW Player conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-jw-player/',
			},
			{
				label: 'llms lists Plex conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-plex/',
			},
			{
				label: 'llms lists Vimeo conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-vimeo/',
			},
			{
				label: 'llms lists SRT validation guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-validate-srt-files/',
			},
			{
				label: 'llms lists YouTube upload failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/',
			},
			{
				label: 'llms lists YouTube subtitle conversion guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-youtube/',
			},
			{
				label: 'llms lists YouTube upload preparation guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-prepare-subtitles-for-youtube-upload/',
			},
			{
				label: 'llms lists YouTube SRT settings guide',
				match: 'https://subtitletoolkit.tools/guides/best-srt-settings-for-youtube-upload/',
			},
			{
				label: 'llms lists YouTube SRT vs ASS guide',
				match: 'https://subtitletoolkit.tools/guides/srt-vs-ass-for-youtube-captions/',
			},
			{
				label: 'llms lists SRT upload failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-srt-file-wont-upload/',
			},
			{
				label: 'llms lists video extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-video/',
			},
			{
				label: 'llms lists MKV extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mkv/',
			},
			{
				label: 'llms lists embedded vs burned-in guide',
				match: 'https://subtitletoolkit.tools/guides/embedded-vs-burned-in-subtitles/',
			},
			{
				label: 'llms lists SRT vs VTT guide',
				match: 'https://subtitletoolkit.tools/guides/srt-vs-vtt/',
			},
			{
				label: 'llms lists ASS vs SRT guide',
				match: 'https://subtitletoolkit.tools/guides/ass-vs-srt/',
			},
			{
				label: 'llms lists ASS vs VTT guide',
				match: 'https://subtitletoolkit.tools/guides/ass-vs-vtt/',
			},
			{
				label: 'llms lists WebVTT better than SRT guide',
				match: 'https://subtitletoolkit.tools/guides/when-webvtt-is-better-than-srt/',
			},
			{
				label: 'llms lists ASS instead of SRT guide',
				match: 'https://subtitletoolkit.tools/guides/when-to-use-ass-instead-of-srt/',
			},
			{
				label: 'llms lists SRT to TXT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-srt-to-txt/',
			},
			{
				label: 'llms lists VTT to TXT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-txt/',
			},
			{
				label: 'llms lists ASS to TXT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ass-to-txt/',
			},
			{
				label: 'llms lists merge SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-merge-two-srt-files/',
			},
			{
				label: 'llms lists ASS to VTT web players guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ass-to-vtt-for-web-players/',
			},
			{
				label: 'llms lists fast or slow subtitles guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-subtitles-that-are-too-fast-or-too-slow/',
			},
			{
				label: 'llms lists SRT not working guide',
				match: 'https://subtitletoolkit.tools/guides/why-srt-file-is-not-working/',
			},
			{
				label: 'llms lists missing subtitles after conversion guide',
				match: 'https://subtitletoolkit.tools/guides/why-subtitles-are-missing-after-conversion/',
			},
			{
				label: 'llms lists empty converted subtitle guide',
				match: 'https://subtitletoolkit.tools/guides/why-converted-subtitle-file-is-empty/',
			},
			{
				label: 'llms lists subtitle drift guide',
				match: 'https://subtitletoolkit.tools/guides/why-subtitles-drift-out-of-sync/',
			},
			{
				label: 'llms lists long subtitles guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-subtitles-that-are-too-long/',
			},
			{
				label: 'llms lists common subtitle errors guide',
				match: 'https://subtitletoolkit.tools/guides/common-subtitle-format-errors-and-fixes/',
			},
			{
				label: 'llms lists out-of-order cues guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-fix-out-of-order-subtitle-cues/',
			},
		],
	},
];

async function fetchHtml(path) {
	if (verifyDist) {
		const filePath = path.endsWith('/')
			? join(distDir, path, 'index.html')
			: join(distDir, path.replace(/^\//, ''));

		if (!existsSync(filePath)) {
			throw new Error(`missing dist file: ${filePath}`);
		}

		return readFileSync(filePath, 'utf8');
	}

	const url = `${baseUrl}${path}`;
	let lastError;

	for (let attempt = 0; attempt <= fetchRetries; attempt += 1) {
		try {
			const response = await fetch(url, {
				redirect: 'follow',
				signal: AbortSignal.timeout(fetchTimeoutMs),
			});

			if (!response.ok) {
				throw new Error(`${response.status} ${response.statusText}`);
			}

			return response.text();
		} catch (error) {
			lastError = error;

			if (attempt < fetchRetries) {
				await sleep(fetchRetryDelayMs);
			}
		}
	}

	throw lastError;
}

function checkExpectation(html, expectation) {
	if (expectation.count) {
		const count = html.match(expectation.count)?.length ?? 0;
		return {
			ok: count === expectation.expectedCount,
			actual: String(count),
			expected: String(expectation.expectedCount),
		};
	}

	if (expectation.after) {
		const [first, second] = expectation.after;
		const firstIndex = html.indexOf(first);
		const secondIndex = html.indexOf(second);
		return {
			ok: firstIndex >= 0 && secondIndex > firstIndex,
			actual: `${firstIndex}, ${secondIndex}`,
			expected: `${first} before ${second}`,
		};
	}

	if (expectation.absent) {
		return {
			ok: !html.includes(expectation.absent),
			actual: html.includes(expectation.absent) ? 'present' : 'absent',
			expected: 'absent',
		};
	}

	const ok =
		typeof expectation.match === 'string'
			? html.includes(expectation.match)
			: expectation.match.test(html);

	return { ok };
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runChecks() {
	let failed = false;

	for (const check of checks) {
		let html;

		try {
			html = await fetchHtml(check.path);
		} catch (error) {
			failed = true;
			console.error(`FAIL ${check.path}: ${error.message}`);
			continue;
		}

		for (const expectation of check.expect) {
			const result = checkExpectation(html, expectation);

			if (result.ok) {
				console.log(`PASS ${check.path}: ${expectation.label}`);
				continue;
			}

			failed = true;
			const detail = result.expected
				? ` expected ${result.expected}, got ${result.actual}`
				: '';
			console.error(`FAIL ${check.path}: ${expectation.label}${detail}`);
		}
	}

	return !failed;
}

console.log(
	verifyDist
		? `Verifying SEO output in ${distDir}`
		: `Verifying SEO deployment at ${baseUrl}`,
);

for (let attempt = 0; attempt <= retries; attempt += 1) {
	if (attempt > 0) {
		console.log(`Retrying SEO verification (${attempt}/${retries})...`);
	}

	const passed = await runChecks();

	if (passed) {
		console.log('SEO verification passed.');
		process.exit(0);
	}

	if (attempt < retries) {
		await sleep(retryDelayMs);
	}
}

console.error(
	verifyDist
		? 'SEO dist verification failed. Run pnpm build and inspect the generated HTML.'
		: 'SEO deployment verification failed. Confirm the latest Cloudflare Pages deployment is live.',
);
process.exit(1);
