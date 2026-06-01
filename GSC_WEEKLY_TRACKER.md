# Subtitle Toolkit GSC Weekly Tracker

Use this file once per week after the SEO deployment is live. Keep entries short and evidence-based.

## How To Export

1. Open Google Search Console -> Performance -> Search results.
2. Set the date range to the last 28 days.
3. Export Queries and Pages.
4. In Plausible or your analytics source, record organic pageviews and tool events for the same 28-day window.
5. Save the CSV files under local `gsc-exports/`; this directory is intentionally ignored by git.
6. Check the local review inputs and print the exact analyzer command:

```bash
pnpm gsc:review:ready -- --organic-pageviews 123 --tool-starts 12 --tool-outputs 3 --week-of 2026-06-08
```

7. Build the current site, then run the local analyzer with the two CSV files:

```bash
pnpm build
pnpm gsc:analyze -- --queries gsc-exports/queries.csv --pages gsc-exports/pages.csv --promotion-log PROMOTION_LOG.md --organic-pageviews 123 --tool-starts 12 --tool-outputs 3
```

Replace `123`, `12`, and `3` with same-window Plausible numbers.
Tool starts = `subtitle_tool_edit_input` + `subtitle_tool_adjust_setting` + `subtitle_tool_upload_file` + `subtitle_tool_load_sample`.
Tool outputs = `subtitle_tool_copy_output` + `subtitle_tool_download_output`.
The analyzer normalizes trailing-slash differences between GSC exports and the built Astro URLs.

8. Review the `Promotion Evidence Window` output so GSC/Plausible movement is compared against real external actions.
9. Fill one weekly row below from the `Weekly Summary Helper` output.
10. Fill the ad readiness row from the `Ad Readiness Gate` output.
11. Fill the traffic quality row from the `Traffic Quality Snapshot` output.
12. Pick one small batch for the next change; do not edit the same URL again until 7 to 14 days have passed.

## Weekly Summary

| Week of | Impressions | Clicks | CTR | Avg position | Pages with impressions | Pages with clicks | Main action shipped | Next review date |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| 2026-06-01 | | | | | | | Initial SEO title, description, internal link, schema, and sitemap update deployed and production-verified. Submit Day 0 URLs in GSC. | 2026-06-08 |

## Opportunity Buckets

### Bucket A: Impressions >= 10, Clicks = 0

Use this bucket for CTR work: title, meta description, and search-result promise.

| Query | Page | Impressions | Position | Current title fit | Next change | Review after |
| --- | --- | ---: | ---: | --- | --- | --- |
| | | | | | | |

### Bucket B: Position 8 To 30

Use this bucket for ranking support: internal links, short exact-answer sections, and matching tool links.

| Query | Page | Impressions | Position | Missing support | Next change | Review after |
| --- | --- | ---: | ---: | --- | --- | --- |
| | | | | | | |

### Bucket C: Indexed, No Impressions

Use this bucket for crawl and intent checks: sitemap presence, hub links, tool links, and overly broad titles.

| Page | Indexed status | Sitemap? | Internal links? | Likely issue | Next change | Review after |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Ad Readiness Snapshot

Only consider ad placement after the gate in `SEARCH_GROWTH_PLAYBOOK.md` is met.

| Week of | Organic pageviews last 28 days | Pages with impressions | Pages with clicks | Gate met? | Notes |
| --- | ---: | ---: | ---: | --- | --- |
| 2026-06-01 | | | | No | Waiting for same-window analytics pageviews and GSC clicks after Day 0 submission. |

Before changing `Gate met?` to Yes, `pnpm verify:seo:ready` must pass with ad placeholders below the tool workspace, hidden while inactive, and no `data-ads-enabled="true"` present before the gate.

## Traffic Quality Snapshot

Use this to avoid optimizing only for impressions. Low tool starts means the query/page promise may be wrong; low tool outputs means the tool UX or file workflow may need work before ads.

| Week of | Tool starts | Starts / organic pageviews | Tool outputs | Outputs / tool starts | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| 2026-06-01 | | | | | Waiting for same-window Plausible custom events after production deployment. |

## Change Log

Record only changes that can plausibly affect search behavior.

| Date | URLs changed | Change type | Reason | Verification |
| --- | --- | --- | --- | --- |
| 2026-06-01 | Priority guides, tools, hubs, sitemap | Titles, descriptions, internal links, schema, sitemap lastmod, SERP metadata audit | Improve zero-click impressions, query-title fit, guide-to-tool conversion, and crawl recency signals. | `pnpm verify:gsc:submit-ready` passed on production for commit `17ee9a3` |
| 2026-06-01 | Homepage and guides index | Internal links to YouTube upload failure, YouTube conversion, and SRT upload failure guides | Increase internal discovery and homepage/hub support for the current YouTube/SRT search-growth cluster. | `pnpm verify:gsc:submit-ready` passed on production for commit `e4b82f7` |
| 2026-06-01 | Guides index and platform caption failure guides | Internal links from `/guides/` plus GSC follow-up queue alignment | Increase discovery and inspection coverage for Video.js, JW Player, Plex, and Vimeo caption failure long-tail queries. | `pnpm verify:seo:ready` passed for commit `5c7012f` |
| 2026-06-01 | Homepage, guides index, upload-prep guides | Added upload-prep discovery links and SERP descriptions for ASS-to-SRT YouTube, subtitle cleanup, and HTML5 troubleshooting pages | Increase clicks from upload-prep and HTML5 subtitle troubleshooting searches while keeping the GSC queue tied to production evidence. | `pnpm verify:gsc:submit-ready` passed on production for commit `4653386` |
| 2026-06-01 | GSC Day 0 current queue | Added recently optimized sync repair, transcript, bilingual, overlap, and line-break guides to the current URL Inspection batch | Keep Search Console submission coverage aligned with the latest CTR-focused SERP copy and guide-index discovery work. | `pnpm gsc:day0:list -- --batch current` prints 60 URLs; `pnpm verify:gsc:day0` passed for 81 URLs plus sitemap index |
| 2026-06-01 | Plex naming, HTML tag cleanup, export sync, web-player conversion, SRT-to-ASS, VTT-to-ASS guides | Added CTR-focused SERP titles/descriptions, production SEO assertions, and current GSC queue coverage | Capture additional long-tail searches that were in the sitemap but missing from the current inspection batch and had weaker SERP snippets. | `pnpm verify:seo:ready` passed; `pnpm gsc:day0:list -- --batch current` prints 66 URLs; `pnpm verify:gsc:day0` passed for 87 URLs plus sitemap index |
| 2026-06-01 | GSC current queue plus tool conversion, sync, transcript, merge, and guide hub pages | Added current inspection coverage and production SEO assertions | Cover remaining non-policy sitemap URLs and core tool pages that can support conversion and ad-readiness paths. | `pnpm gsc:day0:list -- --batch current` prints 85 URLs; `pnpm verify:gsc:day0` passed for 106 URLs plus sitemap index; `pnpm verify:seo:ready` passed |
| 2026-06-02 | VLC subtitle failure guide, homepage, guides index, llms, GSC current queue | Added a VLC-specific troubleshooting page, internal discovery links, FAQ/schema assertions, and Asia/Shanghai default dates for growth evidence scripts | Capture VLC subtitle not showing searches and keep GSC/promotion evidence dates aligned with the user's operating timezone. | `pnpm audit:content-meta` passed; `pnpm build` built 111 pages; `pnpm audit:serp` passed for 108 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 108 URLs plus sitemap index |
| 2026-06-02 | VLC subtitle delay guide, homepage, guides index, llms, GSC current queue | Added a VLC-specific sync guide and cross-linked it from the VLC subtitle failure page | Capture VLC subtitle delay and VLC subtitles out-of-sync searches with a direct path to the subtitle delay fixer. | `pnpm audit:content-meta` passed; `pnpm build` built 112 pages; `pnpm audit:serp` passed for 109 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 109 URLs plus sitemap index |
| 2026-06-02 | Long subtitles guide, homepage, guides index, llms, GSC current queue | Added a readability-focused guide for long caption lines, cue duration, and reading speed, with discovery links and SEO assertions | Capture subtitle line length, subtitles too long, and caption readability searches with a direct path to subtitle cleanup tools. | `pnpm audit:content-meta` passed; `pnpm build` built 113 pages; `pnpm audit:serp` passed for 110 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 110 URLs plus sitemap index |
| 2026-06-02 | SRT not working guide, homepage, guides index, llms, GSC current queue | Added a diagnostic SRT playback troubleshooting guide with FAQ/schema coverage and direct paths to validator, timestamp, encoding, and conversion tools | Capture SRT file not working and subtitle playback troubleshooting searches that sit between upload failures, validation, and player-specific caption issues. | `pnpm audit:content-meta` passed; `pnpm build` built 114 pages; `pnpm audit:serp` passed for 111 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 111 URLs plus sitemap index |
| 2026-06-02 | Missing subtitles after conversion guide, homepage, guides index, llms, GSC current queue | Added a cue-loss troubleshooting guide with FAQ/schema coverage and direct paths to validators, timestamp repair, cleanup, and ASS conversion tools | Capture subtitles missing after conversion and cue loss searches that can turn into validation, repair, or reconversion tool actions. | `pnpm audit:content-meta` passed; `pnpm build` built 115 pages; `pnpm audit:serp` passed for 112 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 112 URLs plus sitemap index |
| 2026-06-02 | Empty converted subtitle guide, homepage, guides index, llms, GSC current queue | Added a blank-output troubleshooting guide with FAQ/schema coverage and direct paths to validators, timestamp repair, cleanup, and ASS conversion tools | Capture converted subtitle file empty, blank subtitle output, and no text after conversion searches that can turn into validation, repair, or reconversion tool actions. | `pnpm audit:content-meta` passed; `pnpm build` built 116 pages; `pnpm audit:serp` passed for 113 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 113 URLs plus sitemap index |
| 2026-06-02 | Subtitle drift guide, homepage, guides index, llms, GSC current queue | Added a frame-rate and progressive sync drift troubleshooting guide with FAQ/schema coverage and direct paths to sync, delay, time-shift, and partial-shift tools | Capture subtitle drift, subtitles progressively out of sync, and frame rate mismatch searches that can turn into sync repair tool actions. | `pnpm audit:content-meta` passed; `pnpm build` built 117 pages; `pnpm audit:serp` passed for 114 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 114 URLs plus sitemap index |
| 2026-06-02 | MP4 subtitle extraction guide, guides index, video extraction guide, llms, GSC current queue | Added an MP4-specific extraction guide with FAQ/schema coverage and direct paths to the browser-local video subtitle extractor | Capture extract subtitles from MP4 searches that are more specific than the general video extraction guide and can turn into extraction tool actions. | `pnpm audit:content-meta` passed; `pnpm build` built 118 pages; `pnpm audit:serp` passed for 115 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 115 URLs plus sitemap index; `pnpm test:gsc:day0:list` passed |
| 2026-06-02 | VTT to SRT guide and VTT to SRT tool page | Strengthened the primary-queue guide title, meta description, FAQ/schema coverage, SRT validator follow-up, and tool-to-guide internal link | Improve CTR and ranking support for VTT to SRT searches that can turn directly into converter tool usage. | `pnpm audit:content-meta` passed; `pnpm build` built 118 pages; `pnpm audit:serp` passed for 115 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 115 URLs plus sitemap index; `pnpm test:gsc:day0:list` passed |
| 2026-06-02 | Clean SRT guide | Strengthened the clean SRT guide title, meta description, FAQ/schema coverage, and validator/timestamp repair follow-up links | Improve CTR and ranking support for clean SRT file searches that can turn directly into SRT cleanup, validation, or timestamp repair tool usage. | `node --check scripts/verify-production-seo.mjs` passed; `pnpm audit:content-meta` passed; `git diff --check` passed; `pnpm build` built 118 pages; `pnpm audit:serp` passed for 115 pages; `pnpm verify:seo:dist` passed; `pnpm verify:gsc:day0` passed for 115 URLs plus sitemap index; `pnpm test:gsc:day0:list` passed |
