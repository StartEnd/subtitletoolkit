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

This includes a SERP metadata audit for generated guide and tool pages, checking for missing, duplicate, or overlong titles and descriptions.

After Cloudflare Pages deploys, verify the live site has the updated titles, structured data, and priority guide links:

```bash
pnpm verify:seo
```

To wait for a deployment to finish propagating, add retries:

```bash
pnpm verify:seo:live
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
