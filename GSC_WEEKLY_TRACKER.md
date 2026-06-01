# Subtitle Toolkit GSC Weekly Tracker

Use this file once per week after the SEO deployment is live. Keep entries short and evidence-based.

## How To Export

1. Open Google Search Console -> Performance -> Search results.
2. Set the date range to the last 28 days.
3. Export Queries and Pages.
4. Build the current site, then run the local analyzer with the two CSV files:

```bash
pnpm build
pnpm gsc:analyze -- --queries path/to/queries.csv --pages path/to/pages.csv
```

5. Fill one weekly row below.
6. Pick one small batch for the next change; do not edit the same URL again until 7 to 14 days have passed.

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
| | | | | No | |

## Change Log

Record only changes that can plausibly affect search behavior.

| Date | URLs changed | Change type | Reason | Verification |
| --- | --- | --- | --- | --- |
| 2026-06-01 | Priority guides, tools, hubs, sitemap | Titles, descriptions, internal links, schema, sitemap lastmod | Improve zero-click impressions and crawl recency signals. | `pnpm verify:seo:live` passed on production for commit `209b053` |
