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
- `/tools`
- `/tools/[slug]`
- `/guides`
- `/guides/[slug]`
- `/rss.xml`

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

Then print the primary manual Search Console queue and a ready-to-paste submission record row:

```bash
pnpm gsc:day0:list
```

After Google starts showing crawl or impression movement for the primary queue, print the current search-growth batch:

```bash
pnpm gsc:day0:list -- --batch current
```

For copy-ready directory submission text, Reddit/HN drafts, and tracking rows from `PROMOTION_PLAN.md`, print the promotion kit:

```bash
pnpm promotion:kit
pnpm promotion:kit -- --section directory --submitted-on 2026-06-01
```

After an external action actually happens, append a local evidence row for the weekly attribution review:

```bash
pnpm promotion:record -- --channel directory --source AlternativeTo --url https://example.com/subtitle-toolkit --status submitted
pnpm promotion:record -- --channel gsc --source "Search Console" --status submitted --notes "Sitemap plus 21 primary URL Inspection requests"
```

`PROMOTION_LOG.md` is intentionally local-only and ignored by git. If it does not exist yet, the weekly analyzer treats that as no recorded promotion evidence.

## Weekly Search Review

After Search Console has a few days of data, export same-window GSC Queries and Pages CSVs, then pair them with Plausible organic pageviews and tool events:

```bash
pnpm build
pnpm gsc:analyze -- --queries gsc-exports/queries.csv --pages gsc-exports/pages.csv --promotion-log PROMOTION_LOG.md --organic-pageviews 123 --tool-starts 12 --tool-outputs 3
```

`tool-starts` should combine first-use events such as `subtitle_tool_edit_input`, `subtitle_tool_adjust_setting`, `subtitle_tool_upload_file`, and `subtitle_tool_load_sample`. `tool-outputs` should combine `subtitle_tool_copy_output` and `subtitle_tool_download_output`.

Use the `Promotion Evidence Window`, `Ad Readiness Gate`, and `Traffic Quality Snapshot` sections before changing titles, internal links, content, or ad placement.

For a Pages preview URL, set the base URL explicitly:

```bash
SEO_VERIFY_BASE_URL=https://<preview-host> pnpm verify:seo
```

Optional env:

```bash
cp .env.example .env
```

## Current Project Status

Launch-ready as of `2026-04-23`.

Confirmed in the current baseline:

- site domain: `https://subtitletoolkit.tools`
- header / footer branding
- migrated subtitle processor and tool catalog
- 8 subtitle tool detail pages
- 8 validated English guide pages
- Plausible-ready pageview and tool event hooks
- privacy policy and terms pages
- deployment and launch docs
- favicon, OG preview, and robots.txt
- RSS and sitemap
- Cloudflare Pages friendly static deployment model
- browser-local processing with no backend subtitle handling

For the full launch baseline and maintenance notes, see `PROJECT_BASELINE.md`.

## Migration Source

The previous working prototype remains in:

- `/Users/song/Project/shipany-template`

Treat that repo as a source of validated product logic and content, not as the long-term base.
