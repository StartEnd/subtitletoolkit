# Subtitle Toolkit

Astro-based subtitle tool site for overseas users.

Primary project record: `PROJECT_BASELINE.md`

Current scope:

- subtitle format conversion pages
- subtitle timing and cleanup tool pages
- SEO guide pages
- ad-first, no-payment-first product structure

## Why This Repo Exists

This project replaces the heavier SaaS-style template used in the earlier prototype.
The goal here is a cleaner foundation for:

- `Home / Tools / Guides`
- static-first SEO pages
- simpler long-term maintenance
- fewer template leftovers

## Current Routes

- `/`
- `/tools` and `/tools/[slug]` (46 tools)
- `/guides` and `/guides/[slug]` (126 guides)
- `/guides/conversion-guides/`, `/guides/sync-fixes/`, `/guides/format-comparisons/`, `/guides/workflow-guides/`
- `/privacy-policy`, `/terms-of-service`
- `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`

## Architecture

Tools and guides are catalog-driven:

- Tool definitions: `src/lib/subtitles/catalog.ts`
- Processing logic: `src/lib/subtitles/processor.ts`
- Guide content: `src/content/guides/*.mdx`
- Guide categories: `src/lib/guides/catalog.ts`

Adding a tool updates the catalog and processor; Astro generates the route automatically.

## Documentation

| File | Purpose |
| --- | --- |
| `PROJECT_BASELINE.md` | Product scale, architecture, operating manual |
| `DEPLOYMENT.md` | Cloudflare Pages deployment |
| `SEARCH_GROWTH_PLAYBOOK.md` | Weekly GSC optimization loop |
| `SEO_LONGTAIL_PLAN.md` | Long-tail content strategy |
| `GSC_DAY0_URLS.md` | URL Inspection queue |
| `GSC_WEEKLY_TRACKER.md` | Weekly change log |
| `PROMOTION_PLAN.md` | External promotion copy source |

## Local Development

```bash
pnpm install
pnpm dev
pnpm build
```

## SEO Verification

Run the build and generated-output SEO checks before publishing search-facing changes:

```bash
pnpm verify:seo:ready
```

This includes a SERP metadata audit for generated guide and tool pages, the GSC analyzer regression checks, the generated-output SEO checks, and the local GSC Day 0 URL readiness check for robots, canonical, noindex, and sitemap coverage.

After Cloudflare Pages deploys, verify the live site has the updated titles, structured data, and priority guide links:

```bash
pnpm verify:seo
```

To wait for a deployment to finish propagating, add retries:

```bash
pnpm verify:seo:live
```

Before submitting the Day 0 URL list in Search Console, run the combined production gate. It verifies live SEO output, production `robots.txt`, pages, sitemap, canonical tags, and `www`/`http` redirects:

```bash
pnpm verify:gsc:submit-ready
```

To see the current growth execution state and the next evidence-based action, run:

```bash
pnpm growth:status
```

Then print the primary manual Search Console queue and a ready-to-paste submission record row:

```bash
pnpm gsc:day0:list
```

After the manual Search Console submission is complete, run the `promotion:record` command printed by the helper so the submission date appears in the weekly evidence window.
The helper also prints a `gsc:day0:record` command that updates `GSC_DAY0_URLS.md` after the manual Search Console work is actually complete.

After Google starts showing crawl or impression movement for the primary queue, print the current search-growth batch:

```bash
pnpm gsc:day0:list -- --batch current
```

To prepare an IndexNow notification for Bing/Yandex-style discovery, print the payload first:

```bash
pnpm indexnow:submit
```

This command is a dry run unless `--live` is passed. The public verification key is served from `https://subtitletoolkit.tools/indexnow-key.txt` after deployment.

For copy-ready directory submission text, Reddit/HN drafts, and tracking rows from `PROMOTION_PLAN.md`, print the promotion kit:

```bash
pnpm promotion:kit
pnpm promotion:kit -- --section directory --submitted-on 2026-06-01
```

The directory section also prints `promotion:record` commands. Run one only after that external directory submission actually happens.

After an external action actually happens, append a local evidence row for the weekly attribution review:

```bash
pnpm promotion:record -- --channel directory --source AlternativeTo --url https://example.com/subtitle-toolkit --status submitted
pnpm promotion:record -- --channel gsc --source "Search Console" --status submitted --notes "Sitemap plus 21 primary URL Inspection requests"
pnpm promotion:record -- --channel indexnow --source IndexNow --status submitted --notes "Submitted primary queue with 21 URLs"
```

`PROMOTION_LOG.md` is intentionally local-only and ignored by git. If it does not exist yet, the weekly analyzer treats that as no recorded promotion evidence.

## Weekly Search Review

After Search Console has a few days of data, export same-window GSC Queries and Pages CSVs, then pair them with Plausible organic pageviews and tool events:

```bash
pnpm gsc:review:ready -- --organic-pageviews 123 --tool-starts 12 --tool-outputs 3 --week-of 2026-06-08
```

When the review inputs are ready, run the analyzer command printed by the helper:

```bash
pnpm build
pnpm gsc:analyze -- --queries gsc-exports/queries.csv --pages gsc-exports/pages.csv --promotion-log PROMOTION_LOG.md --organic-pageviews 123 --tool-starts 12 --tool-outputs 3
```

`tool-starts` should combine first-use events such as `subtitle_tool_edit_input`, `subtitle_tool_adjust_setting`, `subtitle_tool_upload_file`, and `subtitle_tool_load_sample`. `tool-outputs` should combine `subtitle_tool_copy_output` and `subtitle_tool_download_output`.

Use the `Promotion Evidence Window`, `Ad Readiness Gate`, and `Traffic Quality Snapshot` sections before changing titles, internal links, content, or ad placement.

When the analyzer says the ad gate is met, run the final static and engagement guard before adding real ad network scripts:

```bash
pnpm ads:ready -- --organic-pageviews 1000 --pages-with-impressions 20 --pages-with-clicks 10 --tool-starts 100 --tool-outputs 20
```

For a Pages preview URL, set the base URL explicitly:

```bash
SEO_VERIFY_BASE_URL=https://<preview-host> pnpm verify:seo
```

Optional env:

```bash
cp .env.example .env
```

## Current Project Status

Live and in search-growth phase as of `2026-06-04`.

Confirmed in the current baseline:

- site domain: `https://subtitletoolkit.tools`
- 46 browser-local subtitle tools
- 126 English SEO guide pages across 4 category hubs
- 182 static pages in production build
- Plausible-ready pageview and tool event hooks
- privacy policy and terms pages
- favicon, OG preview, robots.txt, RSS, and sitemap
- Cloudflare Pages static deployment
- GSC Day 0 primary queue submitted; next review 2026-06-09
- SEO verification suite passing locally (`pnpm verify:seo:ready`)

For the full baseline, architecture, and operating manual, see `PROJECT_BASELINE.md`.

## Migration Source

The previous working prototype remains in:

- `/Users/song/Project/shipany-template`

Treat that repo as a source of validated product logic and content, not as the long-term base.
