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
				match: '<title>Free SRT/VTT Subtitle Tools - No Upload | Subtitle Toolkit</title>',
			},
			{
				label: 'homepage no-upload meta description',
				match: 'Convert SRT to VTT, fix subtitle timing, validate, clean, and extract captions for free. No signup or upload; files stay in your browser.',
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
				label: 'homepage links to Plyr caption failure guide',
				match: '/guides/why-plyr-captions-are-not-showing/',
			},
			{
				label: 'homepage links to iPhone subtitle failure guide',
				match: '/guides/why-iphone-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to Android caption failure guide',
				match: '/guides/why-android-captions-are-not-showing/',
			},
			{
				label: 'homepage links to Chrome caption failure guide',
				match: '/guides/why-chrome-captions-are-not-showing/',
			},
			{
				label: 'homepage links to Edge caption failure guide',
				match: '/guides/why-edge-captions-are-not-showing/',
			},
			{
				label: 'homepage links to Firefox caption failure guide',
				match: '/guides/why-firefox-captions-are-not-showing/',
			},
			{
				label: 'homepage links to Safari caption failure guide',
				match: '/guides/why-safari-captions-are-not-showing/',
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
				label: 'homepage links to TV subtitle failure guide',
				match: '/guides/why-tv-subtitles-are-not-showing/',
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
				label: 'homepage links to downloaded video missing subtitles guide',
				match: '/guides/why-downloaded-video-has-no-subtitles/',
			},
			{
				label: 'homepage links to MP4 subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mp4/',
			},
			{
				label: 'homepage links to MP4 subtitle failure guide',
				match: '/guides/why-mp4-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to MKV subtitle failure guide',
				match: '/guides/why-mkv-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to MOV subtitle failure guide',
				match: '/guides/why-mov-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to WebM subtitle failure guide',
				match: '/guides/why-webm-subtitles-are-not-showing/',
			},
			{
				label: 'homepage links to M4V subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-m4v/',
			},
			{
				label: 'homepage links to MKV subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mkv/',
			},
			{
				label: 'homepage links to AVI subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-avi/',
			},
			{
				label: 'homepage links to VOB subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-vob/',
			},
			{
				label: 'homepage links to WMV subtitle extraction guide',
				match: '/guides/how-to-extract-subtitles-from-wmv/',
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
				label: 'homepage links to subtitles to plain text guide',
				match: '/guides/how-to-convert-subtitles-to-plain-text/',
			},
			{
				label: 'homepage links to remove subtitle timestamps guide',
				match: '/guides/how-to-remove-timestamps-from-subtitles/',
			},
			{
				label: 'homepage links to remove SRT timestamps guide',
				match: '/guides/how-to-remove-timestamps-from-srt/',
			},
			{
				label: 'homepage links to remove VTT timestamps guide',
				match: '/guides/how-to-remove-timestamps-from-vtt/',
			},
			{
				label: 'homepage links to SRT to TXT guide',
				match: '/guides/how-to-convert-srt-to-txt/',
			},
			{
				label: 'homepage links to SRT to ASS guide',
				match: '/guides/how-to-convert-srt-to-ass/',
			},
			{
				label: 'homepage links to SRT to SSA guide',
				match: '/guides/how-to-convert-srt-to-ssa/',
			},
			{
				label: 'homepage links to VTT to ASS guide',
				match: '/guides/how-to-convert-vtt-to-ass/',
			},
			{
				label: 'homepage links to VTT to SSA guide',
				match: '/guides/how-to-convert-vtt-to-ssa/',
			},
			{
				label: 'homepage links to ASS to SRT guide',
				match: '/guides/how-to-convert-ass-to-srt/',
			},
			{
				label: 'homepage links to Aegisub SRT export guide',
				match: '/guides/how-to-export-srt-from-aegisub/',
			},
			{
				label: 'homepage links to SSA to SRT guide',
				match: '/guides/how-to-convert-ssa-to-srt/',
			},
			{
				label: 'homepage links to SSA to SRT tool',
				match: '/tools/ssa-to-srt/',
			},
			{
				label: 'homepage links to SSA to VTT guide',
				match: '/guides/how-to-convert-ssa-to-vtt/',
			},
			{
				label: 'homepage links to SSA to VTT tool',
				match: '/tools/ssa-to-vtt/',
			},
			{
				label: 'homepage links to SSA to TXT guide',
				match: '/guides/how-to-convert-ssa-to-txt/',
			},
			{
				label: 'homepage links to SSA to TXT tool',
				match: '/tools/ssa-to-txt/',
			},
			{
				label: 'homepage links to SMI to SRT guide',
				match: '/guides/how-to-convert-smi-to-srt/',
			},
			{
				label: 'homepage links to SBV to SRT guide',
				match: '/guides/how-to-convert-sbv-to-srt/',
			},
			{
				label: 'homepage links to TTML to SRT guide',
				match: '/guides/how-to-convert-ttml-to-srt/',
			},
			{
				label: 'homepage links to DFXP to SRT guide',
				match: '/guides/how-to-convert-dfxp-to-srt/',
			},
			{
				label: 'homepage links to XML subtitles to SRT guide',
				match: '/guides/how-to-convert-xml-subtitles-to-srt/',
			},
			{
				label: 'homepage links to SCC to SRT guide',
				match: '/guides/how-to-convert-scc-to-srt/',
			},
			{
				label: 'homepage links to MicroDVD to SRT guide',
				match: '/guides/how-to-convert-microdvd-to-srt/',
			},
			{
				label: 'homepage links to LRC to SRT guide',
				match: '/guides/how-to-convert-lrc-to-srt/',
			},
			{
				label: 'homepage links to SubViewer to SRT guide',
				match: '/guides/how-to-convert-subviewer-to-srt/',
			},
			{
				label: 'homepage links to MPL2 to SRT guide',
				match: '/guides/how-to-convert-mpl2-to-srt/',
			},
			{
				label: 'homepage links to CSV to SRT guide',
				match: '/guides/how-to-convert-csv-to-srt/',
			},
			{
				label: 'homepage links to JSON to SRT guide',
				match: '/guides/how-to-convert-json-to-srt/',
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
		path: '/guides/how-to-convert-srt-to-ssa/',
		expect: [
			{
				label: 'SRT to SSA guide CTR title',
				match: '<title>Convert SRT to SSA - Free Subtitle Converter</title>',
			},
			{
				label: 'SRT to SSA guide no-upload meta description',
				match: 'Convert SRT subtitles to SSA-style editing subtitles for free. Preserve timing, create a style-ready structure, and keep processing local.',
			},
			{
				label: 'SRT to SSA guide opens SRT to ASS converter tool',
				match: 'href="/tools/srt-to-ass/"',
			},
			{
				label: 'FAQ schema for SRT to SSA questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert SRT to SSA\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-vtt-to-ssa/',
		expect: [
			{
				label: 'VTT to SSA guide CTR title',
				match: '<title>Convert VTT to SSA - Free Subtitle Converter</title>',
			},
			{
				label: 'VTT to SSA guide no-upload meta description',
				match: 'Convert WebVTT captions to SSA-style editing subtitles for free. Preserve timing, create dialogue events, and keep processing local.',
			},
			{
				label: 'VTT to SSA guide opens VTT to ASS converter tool',
				match: 'href="/tools/vtt-to-ass/"',
			},
			{
				label: 'FAQ schema for VTT to SSA questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert VTT to SSA\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-ass-to-srt/',
		expect: [
			{
				label: 'ASS to SRT guide CTR title',
				match: '<title>Convert ASS to SRT - Free Subtitle Converter</title>',
			},
			{
				label: 'ASS to SRT guide no-upload meta description',
				match: 'Convert ASS subtitles to SRT online for free. Remove styling, keep dialogue timing, and create a simple SubRip file locally with no upload.',
			},
			{
				label: 'ASS to SRT guide opens ASS converter tool',
				match: 'href="/tools/ass-to-srt/"',
			},
			{
				label: 'FAQ schema for ASS to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an ASS subtitle file to SRT\?/
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
		path: '/guides/how-to-convert-ssa-to-srt/',
		expect: [
			{
				label: 'SSA to SRT guide CTR title',
				match: '<title>Convert SSA to SRT - Free Subtitle Converter</title>',
			},
			{
				label: 'SSA to SRT guide no-upload meta description',
				match: 'Convert SSA subtitles to SRT online for free. Flatten styling, keep dialogue timing, and create a simple SubRip file locally with no upload.',
			},
			{
				label: 'SSA to SRT guide opens SSA converter tool',
				match: 'href="/tools/ssa-to-srt/"',
			},
			{
				label: 'FAQ schema for SSA to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an SSA subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-ssa-to-vtt/',
		expect: [
			{
				label: 'SSA to VTT guide CTR title',
				match: '<title>Convert SSA to VTT - Free WebVTT Converter</title>',
			},
			{
				label: 'SSA to VTT guide no-upload meta description',
				match: 'Convert SSA subtitles to VTT for HTML5 video and web players. Flatten styling, keep timing and text, and process locally with no upload.',
			},
			{
				label: 'SSA to VTT guide opens SSA converter tool',
				match: 'href="/tools/ssa-to-vtt/"',
			},
			{
				label: 'FAQ schema for SSA to VTT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert SSA to VTT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-ssa-to-txt/',
		expect: [
			{
				label: 'SSA to TXT guide CTR title',
				match: '<title>Convert SSA to TXT - Extract Plain Text</title>',
			},
			{
				label: 'SSA to TXT guide no-upload meta description',
				match: 'Convert SSA subtitles to TXT by removing timing fields, style sections, and metadata. Extract clean dialogue locally with no upload.',
			},
			{
				label: 'SSA to TXT guide opens SSA to TXT converter tool',
				match: 'href="/tools/ssa-to-txt/"',
			},
			{
				label: 'FAQ schema for SSA to TXT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert SSA subtitles to TXT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-smi-to-srt/',
		expect: [
			{
				label: 'SMI to SRT guide CTR title',
				match: '<title>Convert SMI to SRT - Free SAMI Subtitle Converter</title>',
			},
			{
				label: 'SMI to SRT guide no-upload meta description',
				match: 'Convert SMI or SAMI subtitles to SRT online for free. Parse Windows Media SYNC captions, remove HTML tags, and create SubRip locally.',
			},
			{
				label: 'SMI to SRT guide opens SMI converter tool',
				match: 'href="/tools/smi-to-srt/"',
			},
			{
				label: 'FAQ schema for SMI to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an SMI subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-sbv-to-srt/',
		expect: [
			{
				label: 'SBV to SRT guide CTR title',
				match: '<title>Convert SBV to SRT - Free YouTube Caption Converter</title>',
			},
			{
				label: 'SBV to SRT guide no-upload meta description',
				match: 'Convert SBV subtitles to SRT online for free. Parse YouTube-style SBV timing blocks and create numbered SubRip captions locally.',
			},
			{
				label: 'SBV to SRT guide opens SBV converter tool',
				match: 'href="/tools/sbv-to-srt/"',
			},
			{
				label: 'FAQ schema for SBV to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an SBV subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-ttml-to-srt/',
		expect: [
			{
				label: 'TTML to SRT guide CTR title',
				match: '<title>Convert TTML to SRT - Free DFXP Subtitle Converter</title>',
			},
			{
				label: 'TTML to SRT guide no-upload meta description',
				match: 'Convert TTML or DFXP subtitles to SRT online for free. Parse timed-text XML captions, remove styling metadata, and create SubRip locally.',
			},
			{
				label: 'TTML to SRT guide opens TTML converter tool',
				match: 'href="/tools/ttml-to-srt/"',
			},
			{
				label: 'FAQ schema for TTML to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert a TTML subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-dfxp-to-srt/',
		expect: [
			{
				label: 'DFXP to SRT guide CTR title',
				match: '<title>Convert DFXP to SRT - Free Timed Text Converter</title>',
			},
			{
				label: 'DFXP to SRT guide no-upload meta description',
				match: 'Convert DFXP subtitles to SRT online for free. Parse timed-text XML captions, remove styling metadata, and create SubRip locally.',
			},
			{
				label: 'DFXP to SRT guide opens DFXP converter tool',
				match: 'href="/tools/dfxp-to-srt/"',
			},
			{
				label: 'FAQ schema for DFXP to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert a DFXP subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-xml-subtitles-to-srt/',
		expect: [
			{
				label: 'XML subtitles to SRT guide CTR title',
				match: '<title>Convert XML Subtitles to SRT - Free Timed Text Converter</title>',
			},
			{
				label: 'XML subtitles to SRT guide no-upload meta description',
				match: 'Convert timed-text XML subtitles to SRT online for free. Parse TTML or DFXP cues, remove XML styling metadata, and create SubRip locally.',
			},
			{
				label: 'XML subtitles to SRT guide opens XML converter tool',
				match: 'href="/tools/xml-to-srt/"',
			},
			{
				label: 'FAQ schema for XML subtitles to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert XML subtitles to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-scc-to-srt/',
		expect: [
			{
				label: 'SCC to SRT guide CTR title',
				match: '<title>Convert SCC to SRT - Free Closed Caption Converter</title>',
			},
			{
				label: 'SCC to SRT guide no-upload meta description',
				match: 'Convert SCC closed captions to SRT online for free. Extract readable Scenarist caption rows, flatten control codes, and create SubRip locally.',
			},
			{
				label: 'SCC to SRT guide opens SCC converter tool',
				match: 'href="/tools/scc-to-srt/"',
			},
			{
				label: 'FAQ schema for SCC to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an SCC caption file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-microdvd-to-srt/',
		expect: [
			{
				label: 'MicroDVD to SRT guide CTR title',
				match: '<title>Convert MicroDVD to SRT - Free SUB Subtitle Converter</title>',
			},
			{
				label: 'MicroDVD to SRT guide no-upload meta description',
				match: 'Convert MicroDVD SUB subtitles to SRT online for free. Turn frame-based .sub subtitle rows into numbered SubRip cues locally.',
			},
			{
				label: 'MicroDVD to SRT guide opens MicroDVD converter tool',
				match: 'href="/tools/microdvd-to-srt/"',
			},
			{
				label: 'FAQ schema for MicroDVD to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert a MicroDVD SUB file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-lrc-to-srt/',
		expect: [
			{
				label: 'LRC to SRT guide CTR title',
				match: '<title>Convert LRC to SRT - Free Lyric Subtitle Converter</title>',
			},
			{
				label: 'LRC to SRT guide no-upload meta description',
				match: 'Convert LRC lyric files to SRT online for free. Turn timestamped lyric lines into numbered SubRip cues locally with no upload.',
			},
			{
				label: 'LRC to SRT guide opens LRC converter tool',
				match: 'href="/tools/lrc-to-srt/"',
			},
			{
				label: 'FAQ schema for LRC to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an LRC lyric file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-subviewer-to-srt/',
		expect: [
			{
				label: 'SubViewer to SRT guide CTR title',
				match: '<title>Convert SubViewer to SRT - Free SUB Subtitle Converter</title>',
			},
			{
				label: 'SubViewer to SRT guide no-upload meta description',
				match: 'Convert SubViewer SUB subtitles to SRT online for free. Turn time-based .sub blocks into numbered SubRip cues locally with no upload.',
			},
			{
				label: 'SubViewer to SRT guide opens SubViewer converter tool',
				match: 'href="/tools/subviewer-to-srt/"',
			},
			{
				label: 'FAQ schema for SubViewer to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert a SubViewer SUB file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-mpl2-to-srt/',
		expect: [
			{
				label: 'MPL2 to SRT guide CTR title',
				match: '<title>Convert MPL2 to SRT - Free Bracket Subtitle Converter</title>',
			},
			{
				label: 'MPL2 to SRT guide no-upload meta description',
				match: 'Convert MPL2 subtitles to SRT online for free. Turn bracket-timed subtitle rows into numbered SubRip cues locally with no upload.',
			},
			{
				label: 'MPL2 to SRT guide opens MPL2 converter tool',
				match: 'href="/tools/mpl2-to-srt/"',
			},
			{
				label: 'FAQ schema for MPL2 to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert an MPL2 subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-csv-to-srt/',
		expect: [
			{
				label: 'CSV to SRT guide CTR title',
				match: '<title>Convert CSV to SRT - Free Caption Row Converter</title>',
			},
			{
				label: 'CSV to SRT guide no-upload meta description',
				match: 'Convert CSV subtitle rows to SRT online for free. Turn start, end, and text columns into numbered SubRip cues locally with no upload.',
			},
			{
				label: 'CSV to SRT guide opens CSV converter tool',
				match: 'href="/tools/csv-to-srt/"',
			},
			{
				label: 'FAQ schema for CSV to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert a CSV subtitle file to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-convert-json-to-srt/',
		expect: [
			{
				label: 'JSON to SRT guide CTR title',
				match: '<title>Convert JSON to SRT - Free Subtitle Segment Converter</title>',
			},
			{
				label: 'JSON to SRT guide no-upload meta description',
				match: 'Convert JSON subtitle segments to SRT online for free. Turn timed segment arrays into numbered SubRip cues locally with no upload.',
			},
			{
				label: 'JSON to SRT guide opens JSON converter tool',
				match: 'href="/tools/json-to-srt/"',
			},
			{
				label: 'FAQ schema for JSON to SRT questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I convert JSON subtitle segments to SRT\?/
			},
		],
	},
	{
		path: '/guides/how-to-export-srt-from-aegisub/',
		expect: [
			{
				label: 'Aegisub SRT export guide CTR title',
				match: '<title>Export SRT from Aegisub - Convert ASS to SRT</title>',
			},
			{
				label: 'Aegisub SRT export guide meta description',
				match: 'Export SRT from Aegisub by converting an ASS or SSA subtitle file to SubRip. Keep timing, flatten styling, and create SRT locally with no upload.',
			},
			{
				label: 'Aegisub SRT export guide opens ASS converter tool',
				match: 'href="/tools/ass-to-srt/"',
			},
			{
				label: 'FAQ schema for Aegisub SRT export questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I export SRT from Aegisub\?/
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
		path: '/guides/why-plyr-captions-are-not-showing/',
		expect: [
			{
				label: 'Plyr captions failure guide CTR title',
				match: '<title>Plyr Captions Not Showing - Fix VTT Track Setup</title>',
			},
			{
				label: 'Plyr captions failure guide meta description',
				match: 'Fix Plyr captions not showing by checking WebVTT syntax, track URLs, MIME type, CORS headers, default tracks, and Plyr player setup.',
			},
			{
				label: 'FAQ schema for Plyr caption questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are captions not showing in Plyr\?/
			},
			{
				label: 'Plyr captions guide opens HTML5 converter tool',
				match: 'href="/tools/html5-video-subtitle-converter/"',
			},
			{
				label: 'Plyr captions guide links WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
		],
	},
	{
		path: '/guides/why-iphone-subtitles-are-not-showing/',
		expect: [
			{
				label: 'iPhone subtitles failure guide CTR title',
				match: '<title>iPhone Subtitles Not Showing - Fix VTT on iOS Safari</title>',
			},
			{
				label: 'iPhone subtitles failure guide meta description',
				match: 'Fix iPhone subtitles not showing by checking WebVTT syntax, HTTPS, MIME type, CORS headers, track defaults, and iOS video controls.',
			},
			{
				label: 'FAQ schema for iPhone subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing on iPhone\?/
			},
			{
				label: 'iPhone subtitles guide opens WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'iPhone subtitles guide links SRT to VTT converter',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/why-android-captions-are-not-showing/',
		expect: [
			{
				label: 'Android captions failure guide CTR title',
				match: '<title>Android Captions Not Showing - Fix VTT on Chrome Mobile</title>',
			},
			{
				label: 'Android captions failure guide meta description',
				match: 'Fix Android captions not showing by checking WebVTT syntax, MIME type, CORS headers, HTTPS, track defaults, and Chrome mobile controls.',
			},
			{
				label: 'FAQ schema for Android caption questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are captions not showing on Android\?/
			},
			{
				label: 'Android captions guide opens WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'Android captions guide links SRT to VTT converter',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/why-chrome-captions-are-not-showing/',
		expect: [
			{
				label: 'Chrome captions failure guide CTR title',
				match: '<title>Chrome Captions Not Showing - Fix VTT Track Issues</title>',
			},
			{
				label: 'Chrome captions failure guide meta description',
				match: 'Fix Chrome captions not showing by checking WebVTT syntax, MIME type, CORS headers, track paths, HTTPS, and browser caption settings.',
			},
			{
				label: 'FAQ schema for Chrome caption questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are captions not showing in Chrome\?/
			},
			{
				label: 'Chrome captions guide opens WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'Chrome captions guide links SRT to VTT converter',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/why-edge-captions-are-not-showing/',
		expect: [
			{
				label: 'Edge captions failure guide CTR title',
				match: '<title>Edge Captions Not Showing - Fix VTT Track Issues</title>',
			},
			{
				label: 'Edge captions failure guide meta description',
				match: 'Fix Microsoft Edge captions not showing by checking WebVTT syntax, MIME type, CORS headers, track URLs, HTTPS, and caption settings.',
			},
			{
				label: 'FAQ schema for Edge caption questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are captions not showing in Microsoft Edge\?/
			},
			{
				label: 'Edge captions guide opens WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'Edge captions guide links SRT to VTT converter',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/why-firefox-captions-are-not-showing/',
		expect: [
			{
				label: 'Firefox captions failure guide CTR title',
				match: '<title>Firefox Captions Not Showing - Fix VTT Track Issues</title>',
			},
			{
				label: 'Firefox captions failure guide meta description',
				match: 'Fix Firefox captions not showing by checking WebVTT syntax, MIME type, CORS headers, track URLs, HTTPS, and browser caption controls.',
			},
			{
				label: 'FAQ schema for Firefox caption questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are captions not showing in Firefox\?/
			},
			{
				label: 'Firefox captions guide opens WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'Firefox captions guide links SRT to VTT converter',
				match: 'href="/tools/srt-to-vtt/"',
			},
		],
	},
	{
		path: '/guides/why-safari-captions-are-not-showing/',
		expect: [
			{
				label: 'Safari captions failure guide CTR title',
				match: '<title>Safari Captions Not Showing - Fix VTT on iPhone and Mac</title>',
			},
			{
				label: 'Safari captions failure guide meta description',
				match: 'Fix Safari captions not showing by checking WebVTT syntax, HTTPS, MIME type, CORS, track defaults, and iPhone or iPad video behavior.',
			},
			{
				label: 'FAQ schema for Safari caption questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why do captions work in Chrome but not Safari\?/
			},
			{
				label: 'Safari captions guide opens WebVTT validator',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'Safari captions guide links SRT to VTT converter',
				match: 'href="/tools/srt-to-vtt/"',
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
		path: '/guides/why-tv-subtitles-are-not-showing/',
		expect: [
			{
				label: 'TV subtitles failure guide CTR title',
				match: '<title>TV Subtitles Not Showing - Fix SRT on Smart TVs</title>',
			},
			{
				label: 'TV subtitles failure guide meta description',
				match: 'Fix TV subtitles not showing by checking SRT format, matching filenames, USB folder placement, encoding, embedded tracks, and Smart TV support.',
			},
			{
				label: 'TV subtitles failure guide opens converter tool',
				match: 'href="/tools/plex-subtitle-converter/"',
			},
			{
				label: 'FAQ schema for TV subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why do subtitles show on my computer but not on my TV\?/,
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
		path: '/guides/how-to-remove-timestamps-from-srt/',
		expect: [
			{
				label: 'remove SRT timestamps guide CTR title',
				match: '<title>Remove Timestamps from SRT - Clean Subtitle Text</title>',
			},
			{
				label: 'remove SRT timestamps guide meta description',
				match: 'Remove timestamps from SRT subtitles, including cue numbers and timing lines. Create a clean plain text transcript locally with no upload.',
			},
			{
				label: 'remove SRT timestamps guide opens converter tool',
				match: 'href="/tools/srt-to-txt/"',
			},
			{
				label: 'FAQ schema for remove SRT timestamps questions',
				match: new RegExp('"@type"\\s*:\\s*"FAQPage"[\\s\\S]*How do I remove timestamps from an SRT file\\?'),
			},
		],
	},
	{
		path: '/guides/how-to-remove-timestamps-from-vtt/',
		expect: [
			{
				label: 'remove VTT timestamps guide CTR title',
				match: '<title>Remove Timestamps from VTT - WebVTT to Plain Text</title>',
			},
			{
				label: 'remove VTT timestamps guide meta description',
				match: 'Remove timestamps from VTT captions, including WEBVTT headers, cue settings, notes, and metadata. Create plain text locally with no upload.',
			},
			{
				label: 'remove VTT timestamps guide opens converter tool',
				match: 'href="/tools/vtt-to-txt/"',
			},
			{
				label: 'FAQ schema for remove VTT timestamps questions',
				match: new RegExp('"@type"\\s*:\\s*"FAQPage"[\\s\\S]*How do I remove timestamps from a VTT file\\?'),
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
				match: '<title>Clean SRT File Online - Free No Upload Repair</title>',
			},
			{
				label: 'clean SRT guide no-upload meta description',
				match: 'Clean an SRT file online for free. Rebuild cue numbers, spacing, timestamp formatting, and inline tags locally with no upload or signup.',
			},
			{
				label: 'clean SRT guide opens cleaner tool',
				match: 'href="/tools/clean-srt-file/"',
			},
			{
				label: 'FAQ schema for clean SRT questions',
				match: 'Can I clean an SRT file online for free?',
			},
			{
				label: 'clean SRT guide links SRT validator follow-up',
				match: 'href="/tools/srt-validator/"',
			},
			{
				label: 'clean SRT guide links timestamp repair follow-up',
				match: 'href="/tools/fix-srt-timestamps/"',
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
		path: '/guides/how-to-convert-subtitles-to-plain-text/',
		expect: [
			{
				label: 'subtitles to plain text guide CTR title',
				match: '<title>Convert Subtitles to Plain Text - SRT VTT ASS</title>',
			},
			{
				label: 'subtitles to plain text guide meta description',
				match: 'Convert subtitles to plain text from SRT, VTT, ASS, or SSA. Remove timestamps, cue numbers, styling, and metadata locally with no upload.',
			},
			{
				label: 'subtitles to plain text guide opens transcript tool',
				match: 'href="/tools/subtitle-transcript-generator/"',
			},
			{
				label: 'FAQ schema for subtitles to plain text questions',
				match: new RegExp('"@type"\\s*:\\s*"FAQPage"[\\s\\S]*How do I convert subtitles to plain text\\?'),
			},
		],
	},
	{
		path: '/guides/how-to-remove-timestamps-from-subtitles/',
		expect: [
			{
				label: 'remove subtitle timestamps guide CTR title',
				match: '<title>Remove Timestamps from Subtitles - SRT VTT to Text</title>',
			},
			{
				label: 'remove subtitle timestamps guide meta description',
				match: 'Remove timestamps from SRT, VTT, or ASS subtitles and turn caption files into readable plain text locally with no upload.',
			},
			{
				label: 'remove subtitle timestamps guide opens transcript tool',
				match: 'href="/tools/subtitle-transcript-generator/"',
			},
			{
				label: 'FAQ schema for remove subtitle timestamps questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*How do I remove timestamps from subtitles\?/,
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
				match: '<title>VTT to SRT Converter Guide - Free No Upload Workflow</title>',
			},
			{
				label: 'VTT to SRT guide no-upload meta description',
				match: 'Convert VTT to SRT online for free. Turn WebVTT captions into numbered SubRip subtitle blocks for editors, uploads, and archives with no upload.',
			},
			{
				label: 'VTT to SRT guide opens converter tool',
				match: 'href="/tools/vtt-to-srt/"',
			},
			{
				label: 'FAQ schema for VTT to SRT questions',
				match: 'Can I convert VTT to SRT online for free?',
			},
			{
				label: 'VTT to SRT guide links SRT validator follow-up',
				match: 'href="/tools/srt-validator/"',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-video/',
		expect: [
			{
				label: 'updated video extraction guide title',
				match: '<title>Extract Subtitles from Video Online - Free No Upload</title>',
			},
			{
				label: 'video extraction guide no-upload meta description',
				match: 'Extract subtitles from MP4, MKV, MOV, WebM, AVI, VOB, WMV, and M4V videos online. Save text tracks locally with no upload.',
			},
			{
				label: 'video extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for video extraction questions',
				match: 'Can I extract subtitles from a video online for free?',
			},
			{
				label: 'video extraction guide explains no-subtitle result',
				match: 'When the extractor finds no subtitle stream',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-mp4/',
		expect: [
			{
				label: 'MP4 extraction guide CTR title',
				match: '<title>Extract Subtitles from MP4 Online - No Upload</title>',
			},
			{
				label: 'MP4 extraction guide no-upload meta description',
				match: 'Extract subtitles from MP4 files locally. Learn when MP4 captions can be saved as SRT or VTT, why extraction finds no subtitles, and when OCR is required.',
			},
			{
				label: 'MP4 extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for MP4 extraction questions',
				match: 'Why does my MP4 have no subtitles to extract?',
			},
		],
	},
	{
		path: '/guides/why-mp4-subtitles-are-not-showing/',
		expect: [
			{
				label: 'MP4 subtitles failure guide CTR title',
				match: '<title>MP4 Subtitles Not Showing - Fix SRT and Embedded Captions</title>',
			},
			{
				label: 'MP4 subtitles failure guide meta description',
				match: 'Fix MP4 subtitles not showing by checking embedded caption tracks, external SRT filenames, player support, subtitle menus, encoding, and timing.',
			},
			{
				label: 'MP4 subtitles failure guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for MP4 subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing in my MP4 file\?/,
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-mkv/',
		expect: [
			{
				label: 'updated MKV extraction guide title',
				match: '<title>Extract Subtitles from MKV Online - Free No Upload</title>',
			},
			{
				label: 'MKV extraction guide no-upload meta description',
				match: 'Extract subtitles from MKV files online for free. Save embedded text subtitle streams as SRT locally in your browser with no upload.',
			},
			{
				label: 'MKV extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for MKV extraction questions',
				match: 'Can I extract subtitles from an MKV file online for free?',
			},
			{
				label: 'MKV extraction guide explains no-subtitle result',
				match: 'Why did MKV subtitle extraction find no subtitles?',
			},
		],
	},
	{
		path: '/guides/why-mkv-subtitles-are-not-showing/',
		expect: [
			{
				label: 'MKV subtitles failure guide CTR title',
				match: '<title>MKV Subtitles Not Showing - Fix SRT and Embedded Tracks</title>',
			},
			{
				label: 'MKV subtitles failure guide meta description',
				match: 'Fix MKV subtitles not showing by checking embedded text tracks, external SRT filenames, player support, subtitle menus, encoding, and timing.',
			},
			{
				label: 'MKV subtitles failure guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for MKV subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing in my MKV file\?/,
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-mov/',
		expect: [
			{
				label: 'MOV extraction guide CTR title',
				match: '<title>Extract Subtitles from MOV Online - No Upload</title>',
			},
			{
				label: 'MOV extraction guide no-upload meta description',
				match: 'Extract subtitles from MOV files locally. Learn when MOV text tracks can be saved, why extraction finds no captions, and when OCR is required.',
			},
			{
				label: 'MOV extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for MOV extraction questions',
				match: 'Can I extract subtitles from a MOV file?',
			},
		],
	},
	{
		path: '/guides/why-mov-subtitles-are-not-showing/',
		expect: [
			{
				label: 'MOV subtitles failure guide CTR title',
				match: '<title>MOV Subtitles Not Showing - Fix QuickTime and SRT Captions</title>',
			},
			{
				label: 'MOV subtitles failure guide meta description',
				match: 'Fix MOV subtitles not showing by checking embedded text tracks, external SRT filenames, QuickTime support, subtitle menus, encoding, and timing.',
			},
			{
				label: 'MOV subtitles failure guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for MOV subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing in my MOV file\?/,
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-m4v/',
		expect: [
			{
				label: 'M4V extraction guide CTR title',
				match: '<title>Extract Subtitles from M4V Online - No Upload</title>',
			},
			{
				label: 'M4V extraction guide no-upload meta description',
				match: 'Extract subtitles from M4V files locally. Learn when Apple or iTunes caption tracks can be saved, why extraction finds no captions, and when OCR is required.',
			},
			{
				label: 'M4V extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for M4V extraction questions',
				match: 'Can I extract subtitles from an M4V file?',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-webm/',
		expect: [
			{
				label: 'WebM extraction guide CTR title',
				match: '<title>Extract Subtitles from WebM Online - No Upload</title>',
			},
			{
				label: 'WebM extraction guide no-upload meta description',
				match: 'Extract subtitles from WebM files locally. Learn when WebM caption tracks can be saved, why extraction finds no captions, and when OCR is required.',
			},
			{
				label: 'WebM extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for WebM extraction questions',
				match: 'Can I extract subtitles from a WebM file?',
			},
		],
	},
	{
		path: '/guides/why-downloaded-video-has-no-subtitles/',
		expect: [
			{
				label: 'downloaded video missing subtitles guide CTR title',
				match: '<title>Downloaded Video Has No Subtitles - Fix Missing Captions</title>',
			},
			{
				label: 'downloaded video missing subtitles guide meta description',
				match: 'Fix a downloaded video with no subtitles by checking sidecar VTT or SRT files, embedded caption tracks, burned-in captions, and extraction limits.',
			},
			{
				label: 'downloaded video missing subtitles guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for downloaded video subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why does my downloaded video have no subtitles\?/,
			},
		],
	},
	{
		path: '/guides/why-webm-subtitles-are-not-showing/',
		expect: [
			{
				label: 'WebM subtitles failure guide CTR title',
				match: '<title>WebM Subtitles Not Showing - Fix VTT and HTML5 Captions</title>',
			},
			{
				label: 'WebM subtitles failure guide meta description',
				match: 'Fix WebM subtitles not showing by checking embedded WebVTT tracks, HTML track files, VTT format, MIME type, CORS, and timing.',
			},
			{
				label: 'WebM subtitles failure guide opens validator tool',
				match: 'href="/tools/webvtt-validator/"',
			},
			{
				label: 'FAQ schema for WebM subtitle questions',
				match: /"@type"\s*:\s*"FAQPage"[\s\S]*Why are subtitles not showing in my WebM file\?/,
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-avi/',
		expect: [
			{
				label: 'AVI extraction guide CTR title',
				match: '<title>Extract Subtitles from AVI Online - No Upload</title>',
			},
			{
				label: 'AVI extraction guide no-upload meta description',
				match: 'Extract subtitles from AVI files locally. Learn when AVI captions can be saved, why extraction finds none, and when to use OCR or a sidecar subtitle file.',
			},
			{
				label: 'AVI extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for AVI extraction questions',
				match: 'Why does my AVI have no subtitles to extract?',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-vob/',
		expect: [
			{
				label: 'VOB extraction guide CTR title',
				match: '<title>Extract Subtitles from VOB Online - No Upload</title>',
			},
			{
				label: 'VOB extraction guide no-upload meta description',
				match: 'Extract subtitles from VOB files locally. Learn when DVD captions are image-based, why extraction finds no text, and when OCR or IDX/SUB files are needed.',
			},
			{
				label: 'VOB extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for VOB extraction questions',
				match: 'Why does VOB subtitle extraction find no text?',
			},
		],
	},
	{
		path: '/guides/how-to-extract-subtitles-from-wmv/',
		expect: [
			{
				label: 'WMV extraction guide CTR title',
				match: '<title>Extract Subtitles from WMV Online - No Upload</title>',
			},
			{
				label: 'WMV extraction guide no-upload meta description',
				match: 'Extract subtitles from WMV files locally. Learn when Windows Media captions can be saved, why extraction finds none, and when OCR is required.',
			},
			{
				label: 'WMV extraction guide opens extractor tool',
				match: 'href="/tools/extract-subtitles-from-video/"',
			},
			{
				label: 'FAQ schema for WMV extraction questions',
				match: 'Why does my WMV have no subtitles to extract?',
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
				match: '<title>SRT to VTT Converter for HTML5 Video - Free</title>',
			},
			{
				label: 'SRT to VTT no-upload meta description',
				match: 'Convert SRT to VTT for HTML5 video online for free. Add the WEBVTT header, change commas to dots, and create browser-ready captions locally.',
			},
			{
				label: 'SRT to VTT workflow covers browser-ready captions',
				match: 'creates browser-ready captions locally',
			},
			{
				label: 'SRT to VTT FAQ covers WEBVTT header',
				match: 'Does the output include the WEBVTT header?',
			},
			{
				label: 'SRT to VTT FAQ covers timestamp dots',
				match: 'Are SRT timestamp commas changed to dots?',
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
		path: '/tools/vtt-to-srt/',
		expect: [
			{
				label: 'CTR-oriented VTT to SRT tool title',
				match: '<title>VTT to SRT Converter for Subtitle Editors - Free</title>',
			},
			{
				label: 'VTT to SRT no-upload meta description',
				match: 'Convert VTT to SRT online for free. Remove WEBVTT headers, change timestamp dots to commas, and create editor-ready SubRip captions locally.',
			},
			{
				label: 'VTT to SRT workflow covers editor-ready SubRip conversion',
				match: 'changes dot-based timestamps to comma-based SRT timing',
			},
			{
				label: 'VTT to SRT FAQ covers timestamp commas',
				match: 'Are VTT timestamp dots changed to SRT commas?',
			},
			{
				label: 'VTT to SRT FAQ covers legacy subtitle editors',
				match: 'Can I use the output in legacy subtitle editors?',
			},
			{
				label: 'VTT to SRT tool links guide',
				match: 'href="/guides/how-to-convert-vtt-to-srt-for-legacy-subtitle-editors/"',
			},
		],
	},
	{
		path: '/tools/youtube-subtitle-converter/',
		expect: [
			{
				label: 'YouTube converter tool CTR title',
				match: '<title>YouTube Subtitle Converter Online - Free No Upload</title>',
			},
			{
				label: 'YouTube converter tool no-upload meta description',
				match: 'Convert subtitles to YouTube-ready SRT online for free. Turn VTT, ASS, or SSA captions into upload-safe SRT locally with no signup or upload.',
			},
			{
				label: 'YouTube converter workflow covers upload-safe SRT',
				match: 'YouTube needs a clean SRT upload',
			},
			{
				label: 'YouTube converter FAQ covers VTT and ASS conversion',
				match: 'Can this convert VTT or ASS captions for YouTube?',
			},
			{
				label: 'YouTube converter links conversion guide',
				match: 'href="/guides/how-to-convert-subtitles-for-youtube/"',
			},
		],
	},
	{
		path: '/tools/subtitle-cleaner/',
		expect: [
			{
				label: 'Subtitle cleaner tool CTR title',
				match: '<title>Subtitle Cleaner Online - Remove Tags, Fix Spacing</title>',
			},
			{
				label: 'Subtitle cleaner no-upload meta description',
				match: 'Clean subtitle files online for free. Remove HTML tags, fix spacing, and prepare SRT, VTT, or ASS captions locally with no signup or upload.',
			},
			{
				label: 'Subtitle cleaner workflow covers remove tags and spacing',
				match: 'removing leftover HTML tags, fixing spacing, and exporting cleaned SRT, VTT, or ASS text locally with no upload',
			},
			{
				label: 'Subtitle cleaner FAQ covers free no upload cleanup',
				match: 'Is this subtitle cleaner free?',
			},
			{
				label: 'Subtitle cleaner links clean SRT follow-up',
				match: 'href="/tools/clean-srt-file/"',
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
				match: '<title>Subtitle Delay Fixer - Shift Subtitles Online Free</title>',
			},
			{
				label: 'delay fixer no-upload meta description',
				match: 'Fix out-of-sync subtitles online by shifting SRT, VTT, or ASS captions earlier or later in milliseconds. Runs locally with no upload.',
			},
			{
				label: 'delay fixer page covers out-of-sync milliseconds intent',
				match: 'Enter positive milliseconds to delay captions, enter negative milliseconds to move captions earlier',
			},
			{
				label: 'delay fixer FAQ covers millisecond shift values',
				match: 'How many milliseconds should I shift subtitles?',
			},
			{
				label: 'delay fixer FAQ covers out-of-sync subtitles',
				match: 'Can this fix out-of-sync subtitles?',
			},
			{
				label: 'delay fixer FAQ covers subtitles ahead of audio',
				match: 'Can this fix subtitles ahead of audio?',
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
		path: '/tools/ssa-to-txt/',
		expect: [
			{
				label: 'SSA to TXT tool title',
				match: '<title>SSA to TXT Converter - Extract Plain Text Online</title>',
			},
			{
				label: 'SSA to TXT tool meta description',
				match: 'Convert SSA subtitles to TXT online for free. Remove timing fields, style sections, and metadata from SubStation Alpha files locally.',
			},
			{
				label: 'SSA to TXT tool links guide',
				match: 'href="/guides/how-to-convert-ssa-to-txt/"',
			},
			{
				label: 'SSA to TXT tool FAQ covers timing and styling',
				match: 'Will TXT keep SSA timing or styling?',
			},
		],
	},
	{
		path: '/tools/srt-validator/',
		expect: [
			{
				label: 'CTR-oriented SRT validator tool title',
				match: '<title>SRT Validator Online - Check Upload Errors Free</title>',
			},
			{
				label: 'SRT validator no-upload meta description',
				match: 'Validate SRT subtitles online for free. Check upload errors, timestamp format, cue order, and numbering locally with no signup or upload.',
			},
			{
				label: 'SRT validator workflow covers upload rejection report',
				match: 'The validator creates a local report for timestamp format, cue order, numbering, and parse errors',
			},
			{
				label: 'SRT validator FAQ covers upload failure diagnosis',
				match: 'Can this help when an SRT file will not upload?',
			},
			{
				label: 'SRT validator links timestamp repair follow-up',
				match: 'href="/tools/fix-srt-timestamps/"',
			},
		],
	},
	{
		path: '/tools/fix-srt-timestamps/',
		expect: [
			{
				label: 'CTR-oriented SRT timestamp fixer tool title',
				match: '<title>Fix SRT Timestamps Online - Repair SRT Timing</title>',
			},
			{
				label: 'SRT timestamp fixer malformed timestamp meta description',
				match: 'Fix malformed SRT timestamps online for free. Convert dot timestamps to comma timing, repair arrow spacing, and rebuild cue numbers locally.',
			},
			{
				label: 'SRT timestamp fixer workflow covers upload errors',
				match: 'upload errors caused by malformed timing lines',
			},
			{
				label: 'SRT timestamp fixer FAQ covers dot timestamps',
				match: 'Can it fix dot timestamps in an SRT file?',
			},
			{
				label: 'SRT timestamp fixer links malformed timestamp guide',
				match: 'href="/guides/how-to-fix-malformed-srt-timestamps/"',
			},
		],
	},
	{
		path: '/tools/webvtt-validator/',
		expect: [
			{
				label: 'CTR-oriented WebVTT validator tool title',
				match: '<title>WebVTT Validator Online - Fix VTT Caption Issues</title>',
			},
			{
				label: 'WebVTT validator local meta description',
				match: 'Validate WebVTT captions online for free. Check missing WEBVTT headers, timestamp syntax, cue order, and HTML5 caption issues locally.',
			},
			{
				label: 'WebVTT validator workflow covers captions not loading',
				match: 'when VTT captions do not load or a player rejects the file',
			},
			{
				label: 'WebVTT validator FAQ covers captions not showing diagnosis',
				match: 'Can this help when VTT captions are not showing?',
			},
			{
				label: 'WebVTT validator links VTT loading guide',
				match: 'href="/guides/why-vtt-captions-are-not-loading/"',
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
				label: 'CTR-oriented SRT to ASS tool title',
				match: '<title>SRT to ASS Converter for Aegisub Styling - Free</title>',
			},
			{
				label: 'SRT to ASS no-upload meta description',
				match: 'Convert SRT to ASS online for free. Create a style-ready ASS file for Aegisub, karaoke timing, and subtitle editors locally with no upload.',
			},
			{
				label: 'SRT to ASS workflow covers Aegisub styling',
				match: 'creates a style-ready ASS file locally with no upload',
			},
			{
				label: 'SRT to ASS FAQ covers Aegisub',
				match: 'Can I convert SRT to ASS for Aegisub?',
			},
			{
				label: 'SRT to ASS FAQ covers local conversion',
				match: 'Does the converter upload my subtitle file?',
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
		path: '/tools/smi-to-srt/',
		expect: [
			{
				label: 'SMI to SRT tool title',
				match: '<title>SMI to SRT Converter - Convert SAMI Captions Free</title>',
			},
			{
				label: 'SMI to SRT tool meta description',
				match: 'Convert SMI or SAMI subtitles to SRT online for free. Parse Windows Media SYNC captions and create numbered SubRip output locally.',
			},
			{
				label: 'SMI to SRT tool links guide',
				match: 'href="/guides/how-to-convert-smi-to-srt/"',
			},
			{
				label: 'SMI to SRT tool FAQ covers SAMI files',
				match: 'Is SMI the same as SAMI?',
			},
		],
	},
	{
		path: '/tools/sbv-to-srt/',
		expect: [
			{
				label: 'SBV to SRT tool title',
				match: '<title>SBV to SRT Converter - Convert YouTube Captions Free</title>',
			},
			{
				label: 'SBV to SRT tool meta description',
				match: 'Convert SBV subtitles to SRT online for free. Turn YouTube-style SBV timing blocks into numbered SubRip captions locally.',
			},
			{
				label: 'SBV to SRT tool links guide',
				match: 'href="/guides/how-to-convert-sbv-to-srt/"',
			},
			{
				label: 'SBV to SRT tool FAQ covers SBV files',
				match: 'What is an SBV subtitle file?',
			},
		],
	},
	{
		path: '/tools/ttml-to-srt/',
		expect: [
			{
				label: 'TTML to SRT tool title',
				match: '<title>TTML to SRT Converter - Convert DFXP Captions Free</title>',
			},
			{
				label: 'TTML to SRT tool meta description',
				match: 'Convert TTML or DFXP subtitles to SRT online for free. Parse timed-text XML paragraphs and create numbered SubRip captions locally.',
			},
			{
				label: 'TTML to SRT tool links guide',
				match: 'href="/guides/how-to-convert-ttml-to-srt/"',
			},
			{
				label: 'TTML to SRT tool FAQ covers DFXP files',
				match: 'Is DFXP the same as TTML?',
			},
		],
	},
	{
		path: '/tools/dfxp-to-srt/',
		expect: [
			{
				label: 'DFXP to SRT tool title',
				match: '<title>DFXP to SRT Converter - Convert Timed Text Free</title>',
			},
			{
				label: 'DFXP to SRT tool meta description',
				match: 'Convert DFXP subtitles to SRT online for free. Parse timed-text XML captions and create numbered SubRip cues locally.',
			},
			{
				label: 'DFXP to SRT tool links guide',
				match: 'href="/guides/how-to-convert-dfxp-to-srt/"',
			},
			{
				label: 'DFXP to SRT tool FAQ covers TTML files',
				match: 'Is DFXP different from TTML?',
			},
		],
	},
	{
		path: '/tools/xml-to-srt/',
		expect: [
			{
				label: 'XML to SRT tool title',
				match: '<title>XML to SRT Converter - Convert Timed Text Free</title>',
			},
			{
				label: 'XML to SRT tool meta description',
				match: 'Convert timed-text XML subtitles to SRT online for free. Parse TTML or DFXP XML cues and create numbered SubRip captions locally.',
			},
			{
				label: 'XML to SRT tool links guide',
				match: 'href="/guides/how-to-convert-xml-subtitles-to-srt/"',
			},
			{
				label: 'XML to SRT tool FAQ covers timed XML scope',
				match: 'What kind of XML subtitle file is supported?',
			},
		],
	},
	{
		path: '/tools/scc-to-srt/',
		expect: [
			{
				label: 'SCC to SRT tool title',
				match: '<title>SCC to SRT Converter - Convert Closed Captions Free</title>',
			},
			{
				label: 'SCC to SRT tool meta description',
				match: 'Convert SCC closed captions to SRT online for free. Extract readable Scenarist caption rows into numbered SubRip cues locally.',
			},
			{
				label: 'SCC to SRT tool links guide',
				match: 'href="/guides/how-to-convert-scc-to-srt/"',
			},
			{
				label: 'SCC to SRT tool FAQ covers SCC files',
				match: 'What is an SCC subtitle file?',
			},
		],
	},
	{
		path: '/tools/microdvd-to-srt/',
		expect: [
			{
				label: 'MicroDVD to SRT tool title',
				match: '<title>MicroDVD to SRT Converter - Convert SUB Captions Free</title>',
			},
			{
				label: 'MicroDVD to SRT tool meta description',
				match: 'Convert MicroDVD SUB subtitles to SRT online for free. Turn frame-based .sub rows into numbered SubRip cues locally.',
			},
			{
				label: 'MicroDVD to SRT tool links guide',
				match: 'href="/guides/how-to-convert-microdvd-to-srt/"',
			},
			{
				label: 'MicroDVD to SRT tool FAQ covers frame rate',
				match: 'Does MicroDVD to SRT conversion need a frame rate?',
			},
		],
	},
	{
		path: '/tools/lrc-to-srt/',
		expect: [
			{
				label: 'LRC to SRT tool title',
				match: '<title>LRC to SRT Converter - Convert Lyrics to Captions Free</title>',
			},
			{
				label: 'LRC to SRT tool meta description',
				match: 'Convert LRC lyrics to SRT subtitles online for free. Turn timestamped lyric lines into numbered SubRip cues locally.',
			},
			{
				label: 'LRC to SRT tool links guide',
				match: 'href="/guides/how-to-convert-lrc-to-srt/"',
			},
			{
				label: 'LRC to SRT tool FAQ covers cue end times',
				match: 'How are LRC cue end times created?',
			},
		],
	},
	{
		path: '/tools/subviewer-to-srt/',
		expect: [
			{
				label: 'SubViewer to SRT tool title',
				match: '<title>SubViewer to SRT Converter - Convert SUB Captions Free</title>',
			},
			{
				label: 'SubViewer to SRT tool meta description',
				match: 'Convert SubViewer SUB subtitles to SRT online for free. Turn time-based .sub blocks into numbered SubRip cues locally.',
			},
			{
				label: 'SubViewer to SRT tool links guide',
				match: 'href="/guides/how-to-convert-subviewer-to-srt/"',
			},
			{
				label: 'SubViewer to SRT tool FAQ covers line breaks',
				match: 'Does SubViewer to SRT preserve line breaks?',
			},
		],
	},
	{
		path: '/tools/mpl2-to-srt/',
		expect: [
			{
				label: 'MPL2 to SRT tool title',
				match: '<title>MPL2 to SRT Converter - Convert Bracket Captions Free</title>',
			},
			{
				label: 'MPL2 to SRT tool meta description',
				match: 'Convert MPL2 subtitles to SRT online for free. Turn bracket-timed rows into numbered SubRip cues locally.',
			},
			{
				label: 'MPL2 to SRT tool links guide',
				match: 'href="/guides/how-to-convert-mpl2-to-srt/"',
			},
			{
				label: 'MPL2 to SRT tool FAQ covers timing units',
				match: 'How is MPL2 timing converted to SRT?',
			},
		],
	},
	{
		path: '/tools/csv-to-srt/',
		expect: [
			{
				label: 'CSV to SRT tool title',
				match: '<title>CSV to SRT Converter - Convert Caption Rows Free</title>',
			},
			{
				label: 'CSV to SRT tool meta description',
				match: 'Convert CSV subtitle rows to SRT online for free. Turn start, end, and text columns into numbered SubRip cues locally.',
			},
			{
				label: 'CSV to SRT tool links guide',
				match: 'href="/guides/how-to-convert-csv-to-srt/"',
			},
			{
				label: 'CSV to SRT tool FAQ covers columns',
				match: 'What CSV columns are supported?',
			},
		],
	},
	{
		path: '/tools/json-to-srt/',
		expect: [
			{
				label: 'JSON to SRT tool title',
				match: '<title>JSON to SRT Converter - Convert Segments Free</title>',
			},
			{
				label: 'JSON to SRT tool meta description',
				match: 'Convert JSON subtitle segments to SRT online for free. Turn timed segment arrays into numbered SubRip cues locally.',
			},
			{
				label: 'JSON to SRT tool links guide',
				match: 'href="/guides/how-to-convert-json-to-srt/"',
			},
			{
				label: 'JSON to SRT tool FAQ covers timing units',
				match: 'Are JSON timing numbers seconds or milliseconds?',
			},
		],
	},
	{
		path: '/tools/ass-to-srt/',
		expect: [
			{
				label: 'CTR-oriented ASS to SRT tool title',
				match: '<title>ASS to SRT Converter for YouTube Uploads - Free</title>',
			},
			{
				label: 'ASS to SRT no-upload meta description',
				match: 'Convert ASS or SSA to SRT online for free. Remove unsupported styling, keep timing, and create YouTube-ready SubRip captions locally.',
			},
			{
				label: 'ASS to SRT workflow covers YouTube upload copy',
				match: 'creates a simple SubRip upload copy locally',
			},
			{
				label: 'ASS to SRT FAQ covers YouTube uploads',
				match: 'Can I convert ASS to SRT for YouTube uploads?',
			},
			{
				label: 'ASS to SRT FAQ covers SSA files',
				match: 'Does this work with SSA subtitle files?',
			},
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
		path: '/tools/ssa-to-srt/',
		expect: [
			{
				label: 'SSA to SRT tool title',
				match: '<title>SSA to SRT Converter - Convert SubStation Alpha Free</title>',
			},
			{
				label: 'SSA to SRT tool meta description',
				match: 'Convert SSA subtitles to SRT online for free. Flatten SubStation Alpha styling, keep dialogue timing, and create SubRip captions locally.',
			},
			{
				label: 'SSA to SRT tool links guide',
				match: 'href="/guides/how-to-convert-ssa-to-srt/"',
			},
			{
				label: 'SSA to SRT tool FAQ covers ASS difference',
				match: 'Is SSA different from ASS?',
			},
		],
	},
	{
		path: '/tools/ssa-to-vtt/',
		expect: [
			{
				label: 'SSA to VTT tool title',
				match: '<title>SSA to VTT Converter - Convert SubStation Alpha Free</title>',
			},
			{
				label: 'SSA to VTT tool meta description',
				match: 'Convert SSA subtitles to WebVTT online for free. Flatten SubStation Alpha styling, keep timing, and create browser-ready VTT captions locally.',
			},
			{
				label: 'SSA to VTT tool links guide',
				match: 'href="/guides/how-to-convert-ssa-to-vtt/"',
			},
			{
				label: 'SSA to VTT tool FAQ covers HTML5 video',
				match: 'Can HTML5 video use SSA subtitle files directly?',
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
				label: 'CTR-oriented video subtitle extractor title',
				match: '<title>Extract Subtitles from Video Online - MKV, MP4, No Upload</title>',
			},
			{
				label: 'video extractor no-upload meta description',
				match: 'Extract embedded subtitles from MKV, MP4, MOV, and WebM files online for free. Save text caption tracks locally with no video upload.',
			},
			{
				label: 'video extractor workflow distinguishes embedded text from burned-in subtitles',
				match: 'not burned-in subtitles that need OCR',
			},
			{
				label: 'video extractor FAQ covers MKV and MP4 files',
				match: 'Can I extract subtitles from MKV or MP4 files?',
			},
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
				label: 'guides index links to SRT to SSA guide',
				match: '/guides/how-to-convert-srt-to-ssa/',
			},
			{
				label: 'guides index links to SRT to ASS guide',
				match: '/guides/how-to-convert-srt-to-ass/',
			},
			{
				label: 'guides index links to VTT to SSA guide',
				match: '/guides/how-to-convert-vtt-to-ssa/',
			},
			{
				label: 'guides index links to VTT to ASS guide',
				match: '/guides/how-to-convert-vtt-to-ass/',
			},
			{
				label: 'guides index links to ASS to SRT guide',
				match: '/guides/how-to-convert-ass-to-srt/',
			},
			{
				label: 'guides index links to ASS to SRT YouTube guide',
				match: '/guides/how-to-convert-ass-to-srt-for-youtube-uploads/',
			},
			{
				label: 'guides index links to Aegisub SRT export guide',
				match: '/guides/how-to-export-srt-from-aegisub/',
			},
			{
				label: 'guides index links to SSA to SRT guide',
				match: '/guides/how-to-convert-ssa-to-srt/',
			},
			{
				label: 'guides index links to SSA to VTT guide',
				match: '/guides/how-to-convert-ssa-to-vtt/',
			},
			{
				label: 'guides index links to SMI to SRT guide',
				match: '/guides/how-to-convert-smi-to-srt/',
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
				label: 'guides index links to Plyr caption failure guide',
				match: '/guides/why-plyr-captions-are-not-showing/',
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
				label: 'guides index links to TV subtitle failure guide',
				match: '/guides/why-tv-subtitles-are-not-showing/',
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
				label: 'guides index links to iPhone subtitle guide from HTML5 section',
				match: '/guides/why-iphone-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to Android caption guide from HTML5 section',
				match: '/guides/why-android-captions-are-not-showing/',
			},
			{
				label: 'guides index links to Chrome caption guide from HTML5 section',
				match: '/guides/why-chrome-captions-are-not-showing/',
			},
			{
				label: 'guides index links to Edge caption guide from HTML5 section',
				match: '/guides/why-edge-captions-are-not-showing/',
			},
			{
				label: 'guides index links to Firefox caption guide from HTML5 section',
				match: '/guides/why-firefox-captions-are-not-showing/',
			},
			{
				label: 'guides index links to Safari caption guide from HTML5 section',
				match: '/guides/why-safari-captions-are-not-showing/',
			},
			{
				label: 'guides index links to Plyr caption guide from HTML5 section',
				match: '/guides/why-plyr-captions-are-not-showing/',
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
				label: 'guides index links to subtitles to plain text guide',
				match: '/guides/how-to-convert-subtitles-to-plain-text/',
			},
			{
				label: 'guides index links to remove subtitle timestamps guide',
				match: '/guides/how-to-remove-timestamps-from-subtitles/',
			},
			{
				label: 'guides index links to remove SRT timestamps guide',
				match: '/guides/how-to-remove-timestamps-from-srt/',
			},
			{
				label: 'guides index links to remove VTT timestamps guide',
				match: '/guides/how-to-remove-timestamps-from-vtt/',
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
				label: 'guides index links to SSA to TXT guide',
				match: '/guides/how-to-convert-ssa-to-txt/',
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
				label: 'guides index links to downloaded video missing subtitles guide',
				match: '/guides/why-downloaded-video-has-no-subtitles/',
			},
			{
				label: 'guides index links to MP4 extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mp4/',
			},
			{
				label: 'guides index links to MP4 subtitle failure guide',
				match: '/guides/why-mp4-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to M4V extraction guide',
				match: '/guides/how-to-extract-subtitles-from-m4v/',
			},
			{
				label: 'guides index links to MKV extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mkv/',
			},
			{
				label: 'guides index links to MKV subtitle failure guide',
				match: '/guides/why-mkv-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to MOV extraction guide',
				match: '/guides/how-to-extract-subtitles-from-mov/',
			},
			{
				label: 'guides index links to MOV subtitle failure guide',
				match: '/guides/why-mov-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to WebM extraction guide',
				match: '/guides/how-to-extract-subtitles-from-webm/',
			},
			{
				label: 'guides index links to WebM subtitle failure guide',
				match: '/guides/why-webm-subtitles-are-not-showing/',
			},
			{
				label: 'guides index links to AVI extraction guide',
				match: '/guides/how-to-extract-subtitles-from-avi/',
			},
			{
				label: 'guides index links to VOB extraction guide',
				match: '/guides/how-to-extract-subtitles-from-vob/',
			},
			{
				label: 'guides index links to WMV extraction guide',
				match: '/guides/how-to-extract-subtitles-from-wmv/',
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
				label: 'llms lists SSA to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/ssa-to-srt/',
			},
			{
				label: 'llms lists SSA to VTT tool',
				match: 'https://subtitletoolkit.tools/tools/ssa-to-vtt/',
			},
			{
				label: 'llms lists SSA to TXT tool',
				match: 'https://subtitletoolkit.tools/tools/ssa-to-txt/',
			},
			{
				label: 'llms lists SMI to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/smi-to-srt/',
			},
			{
				label: 'llms lists SBV to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/sbv-to-srt/',
			},
			{
				label: 'llms lists TTML to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/ttml-to-srt/',
			},
			{
				label: 'llms lists DFXP to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/dfxp-to-srt/',
			},
			{
				label: 'llms lists XML to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/xml-to-srt/',
			},
			{
				label: 'llms lists SCC to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/scc-to-srt/',
			},
			{
				label: 'llms lists MicroDVD to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/microdvd-to-srt/',
			},
			{
				label: 'llms lists LRC to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/lrc-to-srt/',
			},
			{
				label: 'llms lists SubViewer to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/subviewer-to-srt/',
			},
			{
				label: 'llms lists MPL2 to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/mpl2-to-srt/',
			},
			{
				label: 'llms lists CSV to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/csv-to-srt/',
			},
			{
				label: 'llms lists JSON to SRT tool',
				match: 'https://subtitletoolkit.tools/tools/json-to-srt/',
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
				label: 'llms lists iPhone subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-iphone-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists Android caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-android-captions-are-not-showing/',
			},
			{
				label: 'llms lists Chrome caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-chrome-captions-are-not-showing/',
			},
			{
				label: 'llms lists Edge caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-edge-captions-are-not-showing/',
			},
			{
				label: 'llms lists Firefox caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-firefox-captions-are-not-showing/',
			},
			{
				label: 'llms lists Safari caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-safari-captions-are-not-showing/',
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
				label: 'llms lists Plyr caption failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-plyr-captions-are-not-showing/',
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
				label: 'llms lists TV subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-tv-subtitles-are-not-showing/',
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
				label: 'llms lists downloaded video missing subtitles guide',
				match: 'https://subtitletoolkit.tools/guides/why-downloaded-video-has-no-subtitles/',
			},
			{
				label: 'llms lists MP4 extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mp4/',
			},
			{
				label: 'llms lists MP4 subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-mp4-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists MKV extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mkv/',
			},
			{
				label: 'llms lists MKV subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-mkv-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists MOV extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mov/',
			},
			{
				label: 'llms lists MOV subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-mov-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists M4V extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-m4v/',
			},
			{
				label: 'llms lists WebM extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-webm/',
			},
			{
				label: 'llms lists WebM subtitle failure guide',
				match: 'https://subtitletoolkit.tools/guides/why-webm-subtitles-are-not-showing/',
			},
			{
				label: 'llms lists AVI extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-avi/',
			},
			{
				label: 'llms lists VOB extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-vob/',
			},
			{
				label: 'llms lists WMV extraction guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-wmv/',
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
				label: 'llms lists subtitles to plain text guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subtitles-to-plain-text/',
			},
			{
				label: 'llms lists remove subtitle timestamps guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-remove-timestamps-from-subtitles/',
			},
			{
				label: 'llms lists remove SRT timestamps guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-remove-timestamps-from-srt/',
			},
			{
				label: 'llms lists remove VTT timestamps guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-remove-timestamps-from-vtt/',
			},
			{
				label: 'llms lists SRT to TXT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-srt-to-txt/',
			},
			{
				label: 'llms lists SRT to ASS guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-srt-to-ass/',
			},
			{
				label: 'llms lists SRT to SSA guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-srt-to-ssa/',
			},
			{
				label: 'llms lists VTT to ASS guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-ass/',
			},
			{
				label: 'llms lists VTT to SSA guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-ssa/',
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
				label: 'llms lists SSA to TXT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ssa-to-txt/',
			},
			{
				label: 'llms lists SMI to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-smi-to-srt/',
			},
			{
				label: 'llms lists SBV to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-sbv-to-srt/',
			},
			{
				label: 'llms lists TTML to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ttml-to-srt/',
			},
			{
				label: 'llms lists DFXP to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-dfxp-to-srt/',
			},
			{
				label: 'llms lists XML subtitles to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-xml-subtitles-to-srt/',
			},
			{
				label: 'llms lists SCC to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-scc-to-srt/',
			},
			{
				label: 'llms lists MicroDVD to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-microdvd-to-srt/',
			},
			{
				label: 'llms lists LRC to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-lrc-to-srt/',
			},
			{
				label: 'llms lists SubViewer to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-subviewer-to-srt/',
			},
			{
				label: 'llms lists MPL2 to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-mpl2-to-srt/',
			},
			{
				label: 'llms lists CSV to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-csv-to-srt/',
			},
			{
				label: 'llms lists JSON to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-json-to-srt/',
			},
			{
				label: 'llms lists ASS to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ass-to-srt/',
			},
			{
				label: 'llms lists Aegisub SRT export guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-export-srt-from-aegisub/',
			},
			{
				label: 'llms lists SSA to SRT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ssa-to-srt/',
			},
			{
				label: 'llms lists SSA to VTT guide',
				match: 'https://subtitletoolkit.tools/guides/how-to-convert-ssa-to-vtt/',
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
