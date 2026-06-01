# GSC Day 0 Submission URLs

Use this list only after the combined production gate passes:

```bash
pnpm verify:gsc:submit-ready
```

Record manual Search Console actions here so the next review is based on evidence, not memory.

After the production gate passes, run `pnpm gsc:day0:list` to print the primary sitemap and URL Inspection queue plus a paste-ready submission record row. Use `pnpm gsc:day0:list -- --batch current` only after Google starts showing crawl or impression movement for the primary queue.

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
- [ ] `https://subtitletoolkit.tools/guides/how-to-remove-subtitle-line-numbers/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-malformed-srt-timestamps/`
- [ ] `https://subtitletoolkit.tools/guides/how-to-fix-vtt-mime-type-for-html5-video/`
- [ ] `https://subtitletoolkit.tools/guides/why-videojs-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-jw-player-captions-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-plex-subtitles-are-not-showing/`
- [ ] `https://subtitletoolkit.tools/guides/why-vimeo-captions-are-not-showing/`

## After Submission

- [ ] Record the date in `GSC_WEEKLY_TRACKER.md`.
- [ ] Add the same date to the submission record above.
- [ ] Set the next review date 5 to 7 days after submission.
- [ ] Wait 5 to 7 days before submitting the remaining Tier 3 and Tier 4 URLs from `GSC_INDEXING_CHECKLIST.md`.
- [ ] At review time, export GSC Queries and Pages, then run `pnpm gsc:analyze`.
