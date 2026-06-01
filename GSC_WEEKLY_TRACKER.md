# Subtitle Toolkit GSC Weekly Tracker

Use this file once per week after the SEO deployment is live. Keep entries short and evidence-based.

## How To Export

1. Open Google Search Console -> Performance -> Search results.
2. Set the date range to the last 28 days.
3. Export Queries and Pages.
4. In Plausible or your analytics source, record organic pageviews for the same 28-day window.
5. Save the CSV files under local `gsc-exports/`; this directory is intentionally ignored by git.
6. Build the current site, then run the local analyzer with the two CSV files:

```bash
pnpm build
pnpm gsc:analyze -- --queries gsc-exports/queries.csv --pages gsc-exports/pages.csv --organic-pageviews 123
```

Replace `123` with the same-window organic pageviews number.
The analyzer normalizes trailing-slash differences between GSC exports and the built Astro URLs.

7. Fill one weekly row below from the `Weekly Summary Helper` output.
8. Fill the ad readiness row from the `Ad Readiness Gate` output.
9. Pick one small batch for the next change; do not edit the same URL again until 7 to 14 days have passed.

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

## Change Log

Record only changes that can plausibly affect search behavior.

| Date | URLs changed | Change type | Reason | Verification |
| --- | --- | --- | --- | --- |
| 2026-06-01 | Priority guides, tools, hubs, sitemap | Titles, descriptions, internal links, schema, sitemap lastmod, SERP metadata audit | Improve zero-click impressions, query-title fit, guide-to-tool conversion, and crawl recency signals. | `pnpm verify:seo:live` passed on production for commit `d9e9be8` |
