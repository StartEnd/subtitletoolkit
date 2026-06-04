# Subtitle Toolkit Project Baseline

Last updated: 2026-06-04
Status: Live, search-growth phase

## Overview

Subtitle Toolkit is an English-first subtitle tool site at `https://subtitletoolkit.tools`.

The product runs on Astro with browser-local subtitle processing. There is no backend processing layer, and user subtitle files never leave the device. This privacy-first architecture is the main product differentiator and keeps the operating model close to zero-maintenance.

Hosting: static deployment on Cloudflare Pages.

## Current Scale

Last verified: 2026-06-04 (`pnpm build`, `pnpm verify:seo:ready`)

| Surface | Count |
| --- | ---: |
| Subtitle tools | 46 |
| SEO guide articles | 126 |
| Guide category hubs | 4 |
| Static pages built | 182 |
| Sitemap URLs checked | 179 + sitemap index |

### Guide categories

| Category | Count | Hub route |
| --- | ---: | --- |
| Conversion guides | 36 | `/guides/conversion-guides/` |
| Workflow guides | 53 | `/guides/workflow-guides/` |
| Sync fixes | 25 | `/guides/sync-fixes/` |
| Format comparisons | 12 | `/guides/format-comparisons/` |

### Tool categories

Tools are defined in `src/lib/subtitles/catalog.ts` and processed in `src/lib/subtitles/processor.ts`.

| Category | Examples |
| --- | --- |
| Core format conversion | SRT ↔ VTT, SRT ↔ ASS/SSA, ASS/SSA ↔ VTT |
| Subtitle to plain text | SRT/VTT/ASS/SSA → TXT |
| Legacy / niche → SRT | SMI, SBV, TTML, DFXP, XML, SCC, MicroDVD, LRC, SubViewer, MPL2, CSV, JSON |
| Platform presets | YouTube, HTML5, Video.js, JW Player, Plex, Vimeo |
| Timing and cleanup | Time shifter, delay fixer, sync fixer, cleaner, partial shifter, merger |
| Validation | SRT validator, WebVTT validator |
| Utility | Encoding fixer, transcript generator, extract subtitles from video (FFmpeg in browser) |

Adding a tool requires updating the catalog and processor only. Routes and tool UI are generated automatically from the catalog.

## Architecture

```
src/
├── pages/                 # Astro routes
│   ├── index.astro
│   ├── tools/[slug].astro
│   └── guides/[...slug].astro
├── components/            # ToolWorkbench, Header, SEO components
├── layouts/               # SiteLayout, GuidePage, PageLayout
├── content/guides/        # 126 MDX guide files
├── lib/
│   ├── subtitles/
│   │   ├── catalog.ts     # Tool metadata, FAQs, related links
│   │   └── processor.ts   # Parse, convert, validate, shift, clean
│   └── guides/catalog.ts  # Guide category metadata
└── content.config.ts      # Guide frontmatter schema
```

Key integrations:

- `@astrojs/mdx` for guide content
- `@astrojs/sitemap` for sitemap generation
- `@astrojs/rss` for `/rss.xml`
- `@ffmpeg/ffmpeg` for in-browser video subtitle extraction
- Plausible analytics via `PUBLIC_PLAUSIBLE_DOMAIN`

## What Is Done

### Core product

- 46 browser-local subtitle tools
- Upload and paste input modes on all tool pages
- Sample input, copy output, and download output on tool workbench
- Video subtitle extraction via client-side FFmpeg

### UX and design

- Public site uses the premium light-mode direction (see `docs/archive/REDESIGN_SPEC.md`)
- Tool pages use a dark workspace style
- English-only public UI

### Content and SEO

- 126 English guide articles with category hubs and internal linking
- Sitemap, robots.txt, canonical URLs, Open Graph, Twitter cards, JSON-LD
- RSS feed, favicon, OG preview image
- SERP metadata audit and content-meta audit scripts

### Business and compliance

- Privacy Policy and Terms of Service pages
- Plausible event hooks for pageviews and tool engagement
- Ad slot placeholders in homepage and tool layouts (no live ad network scripts yet)

### Search growth operations

- GSC Day 0 URL queue and submission tracking (`GSC_DAY0_URLS.md`)
- IndexNow dry-run and live submission helper
- Weekly GSC export analyzer (`pnpm gsc:analyze`)
- Promotion kit and local evidence log (`PROMOTION_PLAN.md`, `PROMOTION_LOG.md`)
- Ad readiness gate before enabling real ads (`pnpm ads:ready`)

## Explicitly Deferred

These remain out of scope to keep the product lean:

1. User accounts, credits, and Stripe payments
2. Real ad network scripts such as AdSense (waiting on traffic gate)
3. Full i18n and a Chinese-facing content workflow
4. Server-side subtitle processing or file storage

## Operating Manual

### Local development

Node 22 is the expected runtime (see `.node-version`).

```bash
pnpm install
pnpm dev
pnpm build
```

### Add or update a guide

Create or edit an `.mdx` file in `src/content/guides/`. Required frontmatter fields are enforced by `src/content.config.ts`:

- `title`, `description`, `pubDate`, `category`
- optional: `seoTitle`, `seoDescription`, `updatedDate`, `tags`, `primaryTool`, `faqs`

Astro generates the route and includes the page in the sitemap on the next build.

### Add a new subtitle tool

1. Add the tool definition in `src/lib/subtitles/catalog.ts`
2. Implement processing logic in `src/lib/subtitles/processor.ts`
3. Run `pnpm build` and `pnpm verify:seo:ready` before deploy

No manual route or page wiring is required.

### Pre-deploy checks

Before publishing search-facing changes:

```bash
pnpm verify:seo:ready
```

After Cloudflare Pages deploys:

```bash
pnpm verify:seo
pnpm verify:gsc:submit-ready   # before GSC URL submissions
```

To see current growth state and the next recommended action:

```bash
pnpm growth:status
```

### Weekly search review

See `SEARCH_GROWTH_PLAYBOOK.md` and `README.md` for the full GSC review loop.

## Growth Status Snapshot

As of 2026-06-04:

- Production gate passed on 2026-06-02
- GSC Day 0 primary queue (21 URLs) submitted
- IndexNow primary batch submitted
- Next GSC review date: 2026-06-09
- Next external action: directory submissions (AlternativeTo, tinytools.directory, SaaSHub, GitHub awesome list)

Run `pnpm growth:status` for the live snapshot.

## Documentation Index

| File | Purpose |
| --- | --- |
| `README.md` | Quick start, scripts, SEO verification commands |
| `PROJECT_BASELINE.md` | This file — product and engineering baseline |
| `DEPLOYMENT.md` | Cloudflare Pages deployment |
| `SEARCH_GROWTH_PLAYBOOK.md` | Weekly GSC optimization loop |
| `SEO_LONGTAIL_PLAN.md` | Long-tail content expansion strategy |
| `GSC_DAY0_URLS.md` | URL Inspection queue and submission record |
| `GSC_INDEXING_CHECKLIST.md` | Indexing verification checklist |
| `GSC_WEEKLY_TRACKER.md` | Weekly change and evidence log |
| `PROMOTION_PLAN.md` | Directory, community, and outreach copy source |
| `PROMOTION_LOG.md` | Local-only promotion evidence (gitignored) |

Archived launch and migration notes live in `docs/archive/`.

## V1 Launch Baseline (Historical)

On 2026-04-23 the site launched with 8 tools and 8 guides. The product has since expanded to the current scale above while keeping the same static, privacy-first architecture.

## Positioning Summary

Subtitle Toolkit is a privacy-first subtitle tool matrix for English-speaking users: narrow product scope, SEO-ready content surface, monetization-ready layout, and low-maintenance static deployment.
