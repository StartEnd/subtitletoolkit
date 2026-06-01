# GSC Day 0 Submission URLs

Use this list only after the combined production gate passes:

```bash
pnpm verify:gsc:submit-ready
```

Record manual Search Console actions here so the next review is based on evidence, not memory.

After the production gate passes, run `pnpm gsc:day0:list` to print the primary sitemap and URL Inspection queue plus a paste-ready submission record row. Use `pnpm gsc:day0:list -- --batch current` only after Google starts showing crawl or impression movement for the primary queue.

Latest production gate: `pnpm verify:seo:live` and `pnpm verify:gsc:day0:live` passed on 2026-06-01 for commit `d0cd286`. The primary queue below has 21 URL Inspection requests; keep it unchecked until the manual Search Console requests are actually submitted.

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

Submit these URLs after Google starts showing crawl or impression movement for the primary queue. They received FAQ schema, Article topic schema, or corrected tool CTA mapping in the latest SEO batch.

- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-youtube/`
- [ ] `https://subtitletoolkit.tools/guides/best-srt-settings-for-youtube-upload/`
- [ ] `https://subtitletoolkit.tools/guides/srt-vs-ass-for-youtube-captions/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-youtube/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-prepare-subtitles-for-youtube-upload/`
- [ ] `https://subtitletoolkit.tools/guides/why-youtube-subtitles-upload-failed/`
- [ ] `https://subtitletoolkit.tools/guides/why-srt-file-wont-upload/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-clean-subtitle-formatting-before-upload/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-invalid-webvtt-timestamps/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-validate-webvtt-files/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-validate-srt-files/`
- [ ] `https://subtitletoolkit.tools/guides/why-subtitles-do-not-show-in-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/why-vtt-captions-are-not-loading/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-cors-errors-for-vtt-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-subtitle-line-numbers/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-malformed-srt-timestamps/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-vtt-mime-type-for-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/why-videojs-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-jw-player-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-plex-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-vimeo-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-videojs/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-jw-player/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-plex/`
- [ ] `https://subtitletoolkit.tools/guides/best-subtitle-format-for-vimeo-embeds/`
- [ ] `https://subtitletoolkit.tools/tools/subtitle-encoding-fixer/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mkv/`
- [ ] `https://subtitletoolkit.tools/guides/embedded-vs-burned-in-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-to-utf-8/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-garbled-subtitles/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitles-showing-boxes/`
- [ ] `https://subtitletoolkit.tools/guides/subtitle-encoding-windows-1252-vs-utf-8/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-subtitles-for-html5-video/`
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
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-txt/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-merge-two-srt-files/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-vtt-for-web-players/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-subtitles-that-are-too-fast-or-too-slow/`
- [ ] `https://subtitletoolkit.tools/guides/common-subtitle-format-errors-and-fixes/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-out-of-order-subtitle-cues/`

## After Submission

- [ ] Record the date in `GSC_WEEKLY_TRACKER.md`.
- [ ] Add the same date to the submission record above.
- [ ] Set the next review date 5 to 7 days after submission.
- [ ] If submitting the primary queue on 2026-06-01, use `2026-06-08` as the review date from `pnpm gsc:day0:list`.
- [ ] Wait 5 to 7 days before submitting the remaining Tier 3 and Tier 4 URLs from `GSC_INDEXING_CHECKLIST.md`.
- [ ] At review time, export GSC Queries and Pages, then run `pnpm gsc:analyze`.
