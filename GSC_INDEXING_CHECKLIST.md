# Google Search Console Indexing Checklist

Last updated: 2026-05-06
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

- guide clusters
- related guides
- stronger internal links
- 20 guide pages total

## Step 2: Resubmit Sitemap

Submit or refresh this sitemap in Search Console:

`https://subtitletoolkit.tools/sitemap-index.xml`

Do this once after deployment.
Do not keep resubmitting it every day.

## Step 3: Priority URLs To Request Manually

Use URL Inspection and request indexing for these pages first.

### Tier 1: Site entry pages

1. `https://subtitletoolkit.tools/`
2. `https://subtitletoolkit.tools/tools`
3. `https://subtitletoolkit.tools/guides`

### Tier 2: Core format comparison pages

4. `https://subtitletoolkit.tools/guides/srt-vs-vtt`
5. `https://subtitletoolkit.tools/guides/ass-vs-srt`
6. `https://subtitletoolkit.tools/guides/best-subtitle-format-for-html5-video`

### Tier 3: Strongest long-tail action pages

7. `https://subtitletoolkit.tools/guides/how-to-convert-srt-to-vtt-for-html5-video`
8. `https://subtitletoolkit.tools/guides/how-to-fix-subtitle-delay`
9. `https://subtitletoolkit.tools/guides/how-to-fix-invalid-webvtt-timestamps`
10. `https://subtitletoolkit.tools/guides/how-to-clean-subtitle-formatting-before-upload`

## Step 4: Secondary URLs To Submit Later

Wait a few days before requesting these unless they are already showing impressions.

1. `https://subtitletoolkit.tools/guides/best-subtitle-format-for-videojs`
2. `https://subtitletoolkit.tools/guides/best-subtitle-format-for-jw-player`
3. `https://subtitletoolkit.tools/guides/best-subtitle-format-for-vimeo-embeds`
4. `https://subtitletoolkit.tools/guides/best-subtitle-format-for-plex`
5. `https://subtitletoolkit.tools/guides/how-to-convert-ass-to-srt-for-youtube-uploads`
6. `https://subtitletoolkit.tools/guides/how-to-fix-subtitles-that-are-too-fast-or-too-slow`
7. `https://subtitletoolkit.tools/guides/how-to-remove-subtitle-line-numbers`
8. `https://subtitletoolkit.tools/guides/how-to-fix-malformed-srt-timestamps`

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

## Step 7: Submission Pace

Use this pace:

- Day 0: submit sitemap + Tier 1 + Tier 2 + Tier 3
- Day 5 to Day 7: check impressions and indexing status
- Day 7+: submit the secondary URLs if needed

Do not request indexing for the same page every day.

## Step 8: What Success Looks Like

In the first stage, good signs are:

- homepage, `/guides`, and `/tools` become indexed
- comparison pages index before smaller niche pages
- impressions start showing before clicks
- long-tail pages move from `Discovered` to `Indexed`

## Step 9: Simple Working Rule

Each time you ship a meaningful content batch:

1. deploy
2. resubmit sitemap once
3. manually submit only the 5 to 10 most important URLs
4. wait and observe
