# Subtitle Toolkit Search Growth Playbook

Last updated: 2026-06-04
Goal: turn low daily impressions into clicks, higher long-tail rankings, and later ad-ready traffic.

## Current Stage

The site is still early. Tens of daily impressions with no clicks usually means Google has started testing pages, but the pages are not yet winning enough query fit, title fit, or trust in the search result.

Do not start with ads. First improve CTR and indexed search surface.

## Weekly Loop

Run this loop once per week from Google Search Console.

1. Open Performance -> Search results.
2. Set date range to the last 28 days.
3. Export queries and pages.
4. Record organic pageviews and tool custom events from Plausible or another analytics source for the same 28-day window.
5. Run `pnpm gsc:analyze` with the GSC exports, `--organic-pageviews`, `--tool-starts`, and `--tool-outputs`.
6. Record the week in `GSC_WEEKLY_TRACKER.md`.
7. Split opportunities into three buckets:
   - impressions >= 10 and clicks = 0
   - average position 8 to 30
   - pages indexed but receiving no impressions
8. Ship one small batch of title, description, internal link, or content changes.
9. Wait 7 to 14 days before judging the same page again.

## Bucket A: Impressions But No Clicks

This is the first priority because Google is already showing the page.

For each page, compare the real query with the page title and meta description.

Use this rewrite pattern when the query is tool/action intent:

`[Exact job] Online - Free, No Upload`

Examples:

- `SRT to VTT Converter - Convert Subtitles Online Free`
- `Fix Subtitle Delay Online - Free SRT, VTT, ASS Tool`
- `Clean SRT File Online - Fix Timestamps and Cue Numbers`

Success check:

- CTR increases from 0% to any non-zero value.
- The same query keeps impressions after the change.

## Bucket B: Position 8 To 30

These pages need more topical support, not just prettier titles.

For each page:

- add 2 to 4 internal links from closely related guides
- make sure the matching tool page links back to the guide
- add one short section that answers the exact query language from GSC
- refresh `updatedDate` only when content materially changed

Success check:

- average position moves up by at least 2 places after 14 to 28 days
- impressions grow without the page losing query relevance

## Bucket C: Indexed But No Impressions

These pages may be too broad, too similar, or too weakly linked.

For each page:

- confirm it is in the sitemap
- confirm it is linked from a hub, a tool page, or the homepage
- add one more specific long-tail angle if the title is broad
- merge or de-prioritize pages that repeat the same intent

Success check:

- page receives first impressions
- page appears for at least one query that matches its topic

## Priority Query Families

Prioritize query families close to tool usage and ad-friendly informational intent:

- `srt to vtt`
- `vtt to srt`
- `ass to srt`
- `subtitle delay fixer`
- `fix out of sync subtitles`
- `clean srt file`
- `srt validator`
- `webvtt validator`
- `best subtitle format for youtube`
- `why subtitles not showing html5 video`
- `vtt captions not loading`
- `extract subtitles from mkv`

Avoid broad generic topics until the core pages have stable impressions.

## Ad Readiness Gate

Only add real ad monetization after the site has enough stable traffic to avoid hurting early UX and rankings.

Minimum gate:

- 1,000 organic pageviews in the last 28 days
- at least 20 pages receiving organic impressions
- at least 10 pages receiving organic clicks
- core tools remain usable on mobile with ad placeholders enabled
- `pnpm verify:seo:ready` passes with ad slots below the tool workspace and no ads enabled before the gate

Use the `Ad Readiness Gate` section from `pnpm gsc:analyze` for the first three checks. Verify the mobile tool UX separately before placing ads.

Also review the `Traffic Quality Snapshot` from `pnpm gsc:analyze`. Do not add ads if organic traffic is not starting tools or producing copied/downloaded outputs; fix query-page fit or tool UX first.

Before enabling ads, confirm the static safety checks still pass: ad placeholders must remain below the tool workspace, hidden from assistive tech while inactive, and gated behind an explicit ads-enabled flag.

When the gate is met, start with one non-intrusive slot below the first tool/workflow block and one slot near the bottom of long guide pages. Do not put ads above the tool workspace.

## What To Track

Keep the weekly row in `GSC_WEEKLY_TRACKER.md`:

- date
- total impressions
- total clicks
- average CTR
- average position
- top 5 zero-click queries
- pages changed this week
- tool starts and outputs from same-window Plausible events
- next pages to update
