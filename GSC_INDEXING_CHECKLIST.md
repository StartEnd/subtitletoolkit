# Google Search Console Indexing Checklist

Last updated: 2026-06-01
Site: `https://subtitletoolkit.tools`

## Goal

Do not manually request indexing for every page.

For a site at this stage, the right approach is:

1. deploy the latest build
2. resubmit the sitemap
3. manually request indexing only for the highest-signal pages
4. wait for Google to process before repeating

## Step 1: Deploy First

Only submit URLs after the latest version is live.

This matters because the current build now includes:

- click-through oriented titles and meta descriptions for priority guide pages
- updated tool and guide hub titles for stronger query fit
- a single Article JSON-LD block on guide pages
- SoftwareApplication schema with `isAccessibleForFree: true` on tool pages
- homepage, footer, and hub links toward high-intent subtitle jobs
- sitemap `lastmod` entries tied to the deployed git commit time

Before submitting URLs, confirm the deployment layer has a host redirect rule:

`https://www.subtitletoolkit.tools/*` -> `https://subtitletoolkit.tools/$1`

This rule belongs in Cloudflare Redirect Rules or Bulk Redirects, not in page content. The goal is to make `www` a redirect-only host and keep Search Console focused on the non-`www` property.

## Step 2: Resubmit Sitemap

Submit or refresh this sitemap in Search Console:

`https://subtitletoolkit.tools/sitemap-index.xml`

Do this once after deployment.
Do not keep resubmitting it every day.

## Step 2.5: Verify The SEO Update Is Live

Before requesting indexing, confirm Google can fetch the updated page content instead of the previous build.

Check these URLs after deployment:

1. `https://subtitletoolkit.tools/`
   - expected links: `/tools/subtitle-delay-fixer/`, `/tools/extract-subtitles-from-video/`, `/guides/why-subtitles-do-not-show-in-html5-video/`, `/guides/why-youtube-subtitles-upload-failed/`, `/guides/how-to-convert-subtitles-for-youtube/`, and `/guides/why-srt-file-wont-upload/`
2. `https://subtitletoolkit.tools/guides/how-to-fix-subtitle-delay/`
   - expected title: `Fix Subtitle Delay Online - SRT, VTT, ASS Timing Guide`
   - expected description: `Fix subtitles that appear too early or too late.`
   - expected structured data: one `Article` JSON-LD block
3. `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-vtt-for-html5-video/`
   - expected title: `SRT to VTT for HTML5 Video - Free Converter Guide`
   - expected description: `Convert SRT subtitles to WebVTT for HTML5 video.`
   - expected footer link text: `SRT to VTT for HTML5`
4. `https://subtitletoolkit.tools/guides/how-to-convert-vtt-to-srt-for-legacy-subtitle-editors/`
   - expected title: `VTT to SRT Converter Guide - Free WebVTT to SubRip`
5. `https://subtitletoolkit.tools/guides/how-to-extract-subtitles-from-mkv/`
   - expected title: `Extract Subtitles from MKV - Free No Upload Guide`
6. `https://subtitletoolkit.tools/tools/srt-to-ass/`
   - expected title: `SRT to ASS Converter - Convert Subtitles Online Free`
   - expected structured data: `isAccessibleForFree: true`
7. `https://subtitletoolkit.tools/tools/`
   - expected title: `Free Subtitle Tools - Convert, Fix, Clean SRT, VTT, ASS`
8. `https://subtitletoolkit.tools/guides/`
   - expected section: `High-intent subtitle problems to fix first.`
9. `https://subtitletoolkit.tools/guides/conversion-guides/`
   - expected title: `Subtitle Conversion Guides - SRT, VTT, ASS Workflows`
10. `https://subtitletoolkit.tools/guides/sync-fixes/`
   - expected title: `Subtitle Sync Fixes - Timing, Delay, and VTT Errors`
11. `https://subtitletoolkit.tools/sitemap-0.xml`
   - expected: sitemap `lastmod` entries match the deployed commit time

If any of these checks still show the old title or missing footer links, wait for the Pages deployment to finish before using Search Console URL Inspection.

You can run the same checks from the repo:

```bash
pnpm verify:seo:ready
pnpm verify:seo
```

Before using the Day 0 URL list, verify that every listed page is built, self-canonical, indexable, and present in the generated sitemap:

```bash
pnpm build
pnpm verify:gsc:day0
```

After deployment, run the same Day 0 readiness check against production before opening URL Inspection. The live check also verifies `robots.txt`, sitemap coverage, and that `www` and `http` variants redirect to the canonical HTTPS URLs:

```bash
pnpm verify:gsc:submit-ready
```

To wait for a just-triggered Cloudflare Pages deployment, retry production verification for up to five minutes:

```bash
pnpm verify:seo:live
```

For a Cloudflare Pages preview deployment, point the check at the preview URL:

```bash
SEO_VERIFY_BASE_URL=https://<preview-host> pnpm verify:seo
```

## Step 3: Priority URLs To Request Manually

Use URL Inspection and request indexing for the primary queue in `GSC_DAY0_URLS.md` first.

Do not submit all URLs in one sitting. On deploy day, submit the sitemap plus the 21 primary URLs printed by:

```bash
pnpm gsc:day0:list -- --batch primary
```

Use the current search-growth batch in `GSC_DAY0_URLS.md` only after Google starts showing crawl or impression movement for the primary queue.

## Step 4: Secondary URLs To Submit Later

Wait a few days before requesting secondary URLs unless they are already showing impressions.

Use the current search-growth batch in `GSC_DAY0_URLS.md` as the source of truth. Print it with:

```bash
pnpm gsc:day0:list -- --batch current
```

## Step 5: What To Ignore For Now

Do not panic if Search Console still shows these statuses after submission:

- `Discovered - currently not indexed`
- `Alternate page with proper canonical tag`
- `Page with redirect`

For a new site, those are normal unless the exact URL is business-critical.

## Step 6: What To Investigate

If these appear, inspect the exact URLs:

- `Redirect error`
- `404`
- `Crawled - currently not indexed` on core pages

When checking a URL, ask:

1. Is it still linked internally?
2. Is it still in the sitemap?
3. Does it redirect more than once?
4. Is it an old page from a previous structure?

For the current Search Console state, inspect these buckets first:

1. `Redirect error`: fix the exact URL before submitting more pages.
2. `Not found (404)`: remove from sitemap/internal links or 301 to the closest relevant page.
3. `Page with redirect`: acceptable for `www`, `http`, or no-trailing-slash variants if the final URL is indexed.

## Step 7: Submission Pace

Use this pace:

- Day 0: submit sitemap + the primary queue from `GSC_DAY0_URLS.md`
- Day 5 to Day 7: check impressions and indexing status
- Day 7+: submit the current search-growth batch if needed

Do not request indexing for the same page every day.

## Step 8: What Success Looks Like

In the first stage, good signs are:

- homepage, `/guides/`, and `/tools/` become indexed
- `/tools/srt-to-vtt/` starts receiving impressions for SRT to VTT queries
- comparison pages index before smaller niche pages
- impressions start showing before clicks
- long-tail pages move from `Discovered` to `Indexed`

## Step 9: Simple Working Rule

Each time you ship a meaningful content batch:

1. deploy
2. resubmit sitemap once
3. manually submit only the 5 to 10 most important URLs
4. wait and observe
5. record weekly GSC results in `GSC_WEEKLY_TRACKER.md`
