# Subtitle Toolkit

Astro-based subtitle tool site for overseas users.

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

Optional env:

```bash
cp .env.example .env
```

## Current Project Status

Already set up:

- site domain: `https://subtitletoolkit.tools`
- header / footer branding
- migrated subtitle processor and tool catalog
- 8 subtitle tool detail pages
- 8 validated English guide pages
- Plausible-ready pageview and tool event hooks
- privacy policy and terms pages
- deployment and launch docs
- placeholder favicon, OG preview, and robots.txt
- RSS and sitemap

Still worth improving before production:

- replace placeholder OG image with final brand asset
- regenerate favicon set if you finalize a brand mark
- connect the repo to your actual hosting provider

## Migration Source

The previous working prototype remains in:

- `/Users/song/Project/shipany-template`

Treat that repo as a source of validated product logic and content, not as the long-term base.
