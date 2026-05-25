# Subtitle Toolkit Migration Plan

## Goal

Move only the useful product pieces from the older Next.js prototype into this Astro codebase.

## Keep From The Old Project

- subtitle processing logic
- tool copy and naming
- guide content
- SEO assumptions
- analytics event naming

## Do Not Bring Over

- payment
- subscription
- credits
- admin RBAC
- chat
- API keys
- activity pages
- template branding

## Migration Status

Done:

1. Subtitle processor migrated into `src/lib/subtitles/*`
2. Browser-side tool workbench added for all 8 tools
3. Validated English guide set migrated into `src/content/guides/*`

Next:

1. Add Plausible or a similar lightweight analytics integration
2. Add privacy policy and terms pages
3. Add launch assets such as favicon, preview image, and final homepage copy
4. Decide whether a Chinese internal/admin content workflow is still needed

## Suggested Mapping

- old `src/features/subtitles/*`
  to new `src/components/tools/*` or `src/lib/subtitles/*`
- old guide MDX
  to new `src/content/guides/*`
- old landing copy
  to new `src/pages/index.astro`

## Release Standard

Before launch, this repo should satisfy:

- no ShipAny or SaaS-template residue in public routes
- all core routes build statically
- tool pages have working client-side processors
- guides interlink with tools
- sitemap and metadata reflect `subtitletoolkit.tools`
