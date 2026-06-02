# GSC Day 0 Submission URLs

Use this list only after the combined production gate passes:

```bash
pnpm verify:gsc:submit-ready
```

Record manual Search Console actions here so the next review is based on evidence, not memory.

After the production gate passes, run `pnpm gsc:day0:list` to print the primary sitemap and URL Inspection queue plus a paste-ready submission record row. Use `pnpm gsc:day0:list -- --batch current` only after Google starts showing crawl or impression movement for the primary queue.

Latest production gate: `pnpm verify:gsc:submit-ready` passed on 2026-06-02 against the live `b39392d` deployment (`sitemap-0.xml` lastmod `2026-06-02T03:27:08.000Z`) using the same local verifier commit. The primary queue below has 21 URL Inspection requests; the current queue has 130 URLs. Keep them unchecked until the manual Search Console requests are actually submitted.

## Submission Record

| Submitted on | Submitted by | Sitemap submitted? | URL inspection requests | Next review date | Notes |
| --- | --- | --- | ---: | --- | --- |
| | | No | 0 | | |

## Sitemap

- [ ] `https://subtitletoolkit.tools/sitemap-index.xml`

## URL Inspection Requests

### Primary queue

Submit these URLs first. Do not submit every URL in the site on Day 0.

- [ ] `https://subtitletoolkit.tools/`
- [ ] `https://subtitletoolkit.tools/tools/`
- [ ] `https://subtitletoolkit.tools/guides/`
- [ ] `https://subtitletoolkit.tools/tools/srt-to-vtt/`
- [ ] `https://subtitletoolkit.tools/tools/vtt-to-srt/`
- [ ] `https://subtitletoolkit.tools/tools/ass-to-srt/`
- [ ] `https://subtitletoolkit.tools/tools/srt-to-ass/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-delay-fixer/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-cleaner/`
- [ ] `https://subtitletoolkit.tools/tools/youtube-subtitle-converter/`
- [ ] `https://subtitletoolkit.tools/tools/clean-srt-file/`
- [ ] `https://subtitletoolkit.tools/tools/remove-srt-line-numbers/`
- [ ] `https://subtitletoolkit.tools/tools/fix-srt-timestamps/`
- [ ] `https://subtitletoolkit.tools/tools/srt-validator/`
- [ ] `https://subtitletoolkit.tools/tools/webvtt-validator/`
- [ ] `https://subtitletoolkit.tools/tools/extract-subtitles-from-video/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-vtt-for-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-srt-for-legacy-subtitle-editors/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-srt-for-youtube-uploads/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitle-delay/`
- [ ] `https://subtitletoolkit.tools/guides/fix-subtitle-sync-after-a-scene-cut/`

### Current search-growth batch

Submit these URLs after Google starts showing crawl or impression movement for the primary queue. They received FAQ schema, Article topic schema, corrected tool CTA mapping, stronger guide-index discovery, or CTR-focused SERP copy in the latest SEO batches.

- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-youtube/`
- [ ] `https://subtitletoolkit.tools/guides/best-srt-settings-for-youtube-upload/`
- [ ] `https://subtitletoolkit.tools/guides/srt-vs-ass-for-youtube-captions/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-youtube/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-prepare-subtitles-for-youtube-upload/`
- [ ] `https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/`
- [ ] `https://subtitletoolkit.tools/guides/why-srt-file-wont-upload/`
- [ ] `https://subtitletoolkit.tools/guides/conversion-guides/`
- [ ] `https://subtitletoolkit.tools/guides/format-comparisons/`
- [ ] `https://subtitletoolkit.tools/guides/sync-fixes/`
- [ ] `https://subtitletoolkit.tools/guides/workflow-guides/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-clean-subtitle-formatting-before-upload/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-invalid-webvtt-timestamps/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-validate-webvtt-files/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-validate-srt-files/`
- [ ] `https://subtitletoolkit.tools/guides/why-subtitles-do-not-show-in-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/why-vtt-captions-are-not-loading/`
- [ ] `https://subtitletoolkit.tools/guides/why-iphone-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-android-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-chrome-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-edge-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-firefox-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-safari-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-cors-errors-for-vtt-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-subtitle-line-numbers/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-malformed-srt-timestamps/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-vtt-mime-type-for-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/why-videojs-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-plyr-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-jw-player-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-vlc-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-tv-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-plex-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-vimeo-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-videojs/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-jw-player/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-plex/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-vimeo-embeds/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-encoding-fixer/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-video/`
- [ ] `https://subtitletoolkit.tools/guides/why-downloaded-video-has-no-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mp4/`
- [ ] `https://subtitletoolkit.tools/guides/why-mp4-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-m4v/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mkv/`
- [ ] `https://subtitletoolkit.tools/guides/why-mkv-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mov/`
- [ ] `https://subtitletoolkit.tools/guides/why-mov-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-webm/`
- [ ] `https://subtitletoolkit.tools/guides/why-webm-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-avi/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-vob/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-wmv/`
- [ ] `https://subtitletoolkit.tools/guides/embedded-vs-burned-in-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-name-subtitle-files-for-plex/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-to-utf-8/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-garbled-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitles-showing-boxes/`
- [ ] `https://subtitletoolkit.tools/guides/subtitle-encoding-windows-1252-vs-utf-8/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitle-files-for-web-players/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-add-multiple-subtitle-languages-to-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-videojs/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-jw-player/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-plex/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-vimeo/`
- [ ] `https://subtitletoolkit.tools/guides/srt-vs-vtt/`
- [ ] `https://subtitletoolkit.tools/guides/ass-vs-srt/`
- [ ] `https://subtitletoolkit.tools/guides/ass-vs-vtt/`
- [ ] `https://subtitletoolkit.tools/guides/when-webvtt-is-better-than-srt/`
- [ ] `https://subtitletoolkit.tools/guides/when-to-use-ass-instead-of-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-ass/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-ssa/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-ssa/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-ass/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-export-srt-from-aegisub/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ssa-to-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ssa-to-vtt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-smi-to-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-sbv-to-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ttml-to-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-to-plain-text/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-timestamps-from-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-timestamps-from-srt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-timestamps-from-vtt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ssa-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-merge-two-srt-files/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-vtt-for-web-players/`
- [ ] `https://subtitletoolkit.tools/guides/fix-out-of-sync-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-vlc-subtitle-delay/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitle-timing-after-cutting-video/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-shift-only-part-of-a-subtitle-file/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-clean-an-srt-file/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-create-a-transcript-from-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-create-dual-language-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-overlapping-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitle-line-breaks/`
- [ ] `https://subtitletoolkit.tools/guides/why-srt-file-is-not-working/`
- [ ] `https://subtitletoolkit.tools/guides/why-subtitles-are-missing-after-conversion/`
- [ ] `https://subtitletoolkit.tools/guides/why-converted-subtitle-file-is-empty/`
- [ ] `https://subtitletoolkit.tools/guides/why-subtitles-drift-out-of-sync/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitles-that-are-too-long/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitles-that-are-too-fast-or-too-slow/`
- [ ] `https://subtitletoolkit.tools/guides/why-subtitles-are-out-of-sync-after-export/`
- [ ] `https://subtitletoolkit.tools/guides/common-subtitle-format-errors-and-fixes/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-out-of-order-subtitle-cues/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-html-tags-from-subtitles/`
- [ ] `https://subtitletoolkit.tools/tools/srt-to-txt/`
- [ ] `https://subtitletoolkit.tools/tools/vtt-to-txt/`
- [ ] `https://subtitletoolkit.tools/tools/ass-to-txt/`
- [ ] `https://subtitletoolkit.tools/tools/vtt-to-ass/`
- [ ] `https://subtitletoolkit.tools/tools/ass-to-vtt/`
- [ ] `https://subtitletoolkit.tools/tools/smi-to-srt/`
- [ ] `https://subtitletoolkit.tools/tools/sbv-to-srt/`
- [ ] `https://subtitletoolkit.tools/tools/ttml-to-srt/`
- [ ] `https://subtitletoolkit.tools/tools/html5-video-subtitle-converter/`
- [ ] `https://subtitletoolkit.tools/tools/videojs-subtitle-converter/`
- [ ] `https://subtitletoolkit.tools/tools/jw-player-subtitle-converter/`
- [ ] `https://subtitletoolkit.tools/tools/plex-subtitle-converter/`
- [ ] `https://subtitletoolkit.tools/tools/vimeo-subtitle-converter/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-time-shifter/`
- [ ] `https://subtitletoolkit.tools/tools/fix-out-of-sync-subtitles/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-transcript-generator/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-merger/`
- [ ] `https://subtitletoolkit.tools/tools/partial-subtitle-shifter/`

## After Submission

- [ ] Record the date in `GSC_WEEKLY_TRACKER.md`.
- [ ] Add the same date to the submission record above.
- [ ] Set the next review date 5 to 7 days after submission.
- [ ] If submitting the primary queue on 2026-06-02, use `2026-06-09` as the review date from `pnpm gsc:day0:list`.
- [ ] Wait 5 to 7 days before submitting the current search-growth batch from this file.
- [ ] At review time, export GSC Queries and Pages, then run `pnpm gsc:analyze`.
