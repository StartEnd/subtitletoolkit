# Subtitle Toolkit v1 Baseline

Last updated: 2026-04-23
Status: Launch-ready

## Overview

Subtitle Toolkit (v1) has completed its core rebuild and is now mature enough for formal launch to overseas users.

The product runs on Astro with browser-local subtitle processing. There is no backend processing layer, and user subtitle files never leave the device. This privacy-first architecture is the main product differentiator and also keeps the operating model close to zero-maintenance.

## What Is Done

### Core Product

- 8 browser-local subtitle tools are implemented and live.
- Format conversion coverage:
  - SRT to VTT
  - VTT to SRT
  - SRT to ASS
  - ASS to SRT
  - VTT to ASS
  - ASS to VTT
- Editing utilities:
  - Subtitle Time Shifter
  - Subtitle Cleaner

### UX and Design

- The public site uses the premium light-mode direction defined in `REDESIGN_SPEC.md`.
- Tool pages use a dark workspace style to position the product as a professional productivity tool.
- The interface is English-only, including removal of browser-native Chinese UI leakage where possible.

### Content and SEO

- 8 English guide articles are published and interlinked with relevant tools.
- The site outputs `sitemap-index.xml` and `robots.txt`.
- Canonical URLs, Open Graph metadata, and Twitter card metadata are wired across the site.
- Brand assets for social preview and favicon are in place.

### Business and Compliance

- `Privacy Policy` and `Terms of Service` pages are complete.
- Plausible Analytics hooks are prewired behind `PUBLIC_PLAUSIBLE_DOMAIN`.
- Ad slots are reserved in homepage and tool layouts for future monetization without structural redesign.

## Explicitly Deferred in V1

These were intentionally excluded to keep V1 lean and launchable:

1. User accounts, credits, and Stripe payments
2. Real ad network scripts such as AdSense
3. Full i18n and a Chinese-facing content management workflow

## Operating Manual

### Add or update guides

Create a new `.mdx` file in `src/content/guides/`. Astro will generate the route and include it in sitemap output on the next build and deploy.

### Add a new subtitle tool

Add the tool definition in `src/lib/subtitles/catalog.ts` and implement the processing logic in `src/lib/subtitles/processor.ts`. The frontend routes and tool UI are driven from the catalog and do not require separate manual page wiring.

### Local development

Node 22 is the expected runtime.

```bash
pnpm install
pnpm run dev
pnpm build
```

## Launch Notes

- Target domain: `subtitletoolkit.tools`
- Hosting model: static deployment via Cloudflare Pages
- Operational profile: modern architecture, low maintenance, no application backend

## Positioning Summary

Subtitle Toolkit v1 is now a clean, modern, privacy-first subtitle tool matrix focused on English-speaking users. The product is intentionally narrow, SEO-ready, monetization-ready, and suitable for launch without additional architectural work.
