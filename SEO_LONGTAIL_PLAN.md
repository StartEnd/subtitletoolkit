# Subtitle Toolkit Long-Tail SEO Plan

Last updated: 2026-05-06
Owner: Song
Status: Execution plan

## 1. Goal

Subtitle Toolkit should grow as a narrow, search-first subtitle workflow site.

Primary goal for the next 8 weeks:

- grow search impressions
- grow indexed long-tail pages
- grow visits to tool pages from guides
- reach enough traffic to justify ad-led monetization later

This plan does not depend on payments, accounts, or SaaS features.

## 2. Current Reality

The current site already has:

- 8 tool pages
- 8 guide pages
- a clean static Astro structure
- strong trust positioning: free, local, no upload

The current gap is not product quality. The gap is search surface area.

Right now the site mainly covers:

- format comparison
- basic conversion
- basic sync repair

It does not yet cover enough search intent around:

- platforms
- players
- editing workflows
- export/import problems
- format-specific errors

## 3. Core Strategy

Do not compete as a generic "subtitle tools" site.

Compete as:

`the practical help center for subtitle format conversion and subtitle workflow fixes`

That means each new page should target a concrete job:

- convert one format for one destination
- fix one subtitle problem
- choose the right format for one platform
- understand one common subtitle error

## 4. Content Rules

Every new guide must map to at least one existing tool page.

Preferred title patterns:

- `How to convert [format] to [format] for [platform]`
- `Best subtitle format for [platform]`
- `How to fix [specific subtitle problem]`
- `[format] vs [format] for [workflow]`

Avoid broad topics:

- what are subtitles
- full video editing tutorials
- AI industry content
- creator growth advice

The site should stay tightly focused on subtitle workflows.

## 5. Content Clusters

### Cluster A: Destination-specific conversion

Intent:

- user already has a subtitle file
- user needs the right format for one target platform

Priority topics:

1. `How to convert SRT to VTT for HTML5 video`
2. `How to convert ASS to SRT for YouTube uploads`
3. `How to convert ASS to VTT for web players`
4. `How to convert VTT to SRT for legacy subtitle editors`
5. `Best subtitle format for Video.js`
6. `Best subtitle format for JW Player`
7. `Best subtitle format for Vimeo embeds`
8. `Best subtitle format for Plex`

Why this cluster matters:

- clean commercial intent
- close to existing tools
- easy internal linking to tool pages

### Cluster B: Subtitle problem / fix intent

Intent:

- user has a broken file
- user searches a repair phrase

Priority topics:

1. `How to fix subtitle delay`
2. `How to fix subtitles that are too fast or too slow`
3. `How to remove subtitle line numbers`
4. `How to fix invalid WebVTT timestamps`
5. `How to fix malformed SRT timestamps`
6. `How to clean subtitle formatting before upload`
7. `How to fix out-of-order subtitle cues`
8. `Why subtitles do not show in HTML5 video`

Why this cluster matters:

- strong long-tail search behavior
- useful even when search volume per page is low
- naturally supports `subtitle-time-shifter` and `subtitle-cleaner`

### Cluster C: Format decision pages

Intent:

- user is comparing subtitle formats before delivery

Priority topics:

1. `SRT vs VTT for HTML5 video`
2. `SRT vs ASS for YouTube captions`
3. `ASS vs VTT for browser playback`
4. `When to use SRT instead of ASS`
5. `When WebVTT is better than SRT`
6. `Best subtitle format for browser video players`

Why this cluster matters:

- supports top-of-funnel discovery
- reinforces format authority
- links well into conversion tools

### Cluster D: Workflow-specific pages

Intent:

- user is stuck inside one editing or publishing workflow

Priority topics:

1. `How to prepare subtitles for YouTube upload`
2. `How to prepare subtitles for HTML5 video`
3. `How to prepare subtitles for a client delivery`
4. `How to convert subtitle files for web players`
5. `How to clean subtitle files before archiving`
6. `How to deliver subtitle files with broad compatibility`

Why this cluster matters:

- these pages can rank for mixed-intent queries
- they convert well into tools because the next action is obvious

## 6. First 12 Pages To Publish

These should be the first batch because they are closest to the current tools and easiest to execute well.

1. `How to convert SRT to VTT for HTML5 video`
2. `How to convert ASS to SRT for YouTube uploads`
3. `How to convert ASS to VTT for web players`
4. `Best subtitle format for Video.js`
5. `Best subtitle format for Plex`
6. `How to fix subtitle delay`
7. `How to fix subtitles that are too fast or too slow`
8. `How to remove subtitle line numbers`
9. `How to fix invalid WebVTT timestamps`
10. `How to clean subtitle formatting before upload`
11. `SRT vs VTT for HTML5 video`
12. `ASS vs VTT for browser playback`

## 7. Publishing Cadence

Target pace:

- 3 guides per week
- 12 guides per month

Do not write 12 different kinds of pages.
Write repeatable pages using a consistent structure.

Recommended guide structure:

1. problem statement
2. quick answer
3. when this format or fix is needed
4. common mistakes
5. step-by-step workflow
6. tool CTA
7. related guide links

## 8. Internal Linking Rules

Every guide should link to:

- 1 primary tool page
- 2 related guides
- 1 parent hub or archive page

Every tool page should link back into:

- 2 to 4 closely related guides

Current linking is good enough for v1, but it should become more deliberate:

- conversion guide -> exact conversion tool
- fix guide -> time shifter or cleaner
- comparison guide -> both compared formats and one tool

## 9. Site Architecture Changes To Support SEO

These are the next structural changes after the plan is approved.

### High priority

1. Add guide tags or categories in `src/content.config.ts`
2. Group the guides archive by cluster instead of one flat list
3. Add a related guides section to each guide page
4. Add a more specific CTA per guide instead of one generic `/tools` button

### Medium priority

1. Add hub pages for:
   - `subtitle conversion guides`
   - `subtitle sync fixes`
   - `subtitle format comparisons`
2. Add breadcrumbs to guide and tool pages
3. Expand homepage with links to the major guide clusters

### Low priority

1. Add author and editorial notes
2. Add "updated" workflow to refresh older pages
3. Add comparison tables where useful

## 10. Technical SEO Checklist

Before scaling content, verify these basics:

- Google Search Console is connected
- Bing Webmaster Tools is connected
- Plausible is tracking pageviews
- sitemap is submitted
- canonical URLs are correct
- each guide has a unique title and description
- no thin pages are published just to increase count

## 11. Metrics That Matter

Ignore revenue for now.

Track:

- number of published guides
- indexed guide pages
- search impressions
- search clicks
- tool page visits from guide pages
- top landing pages
- queries that start showing impressions

Good early signs:

- impressions start rising before clicks do
- guides begin outranking the archive page
- a few tool pages start receiving search traffic directly

## 12. What Not To Do

Do not:

- add payments now
- add user accounts now
- pivot to a different niche now
- write broad blog posts outside subtitle workflows
- chase social content instead of shipping guides
- wait for perfect keyword research

This site needs more pages, better clustering, and tighter internal linking.
That is the work.

## 13. 4-Week Execution Plan

### Week 1

- finalize this plan
- add categories/tags to the guide content model
- improve guide template for related links and specific tool CTA
- write 3 new guides from Cluster A and Cluster B

### Week 2

- write 3 more guides
- update old guides with stronger internal links
- group `/guides` by cluster

### Week 3

- write 3 more guides
- add one or two hub pages
- review search impressions and early landing pages

### Week 4

- write 3 more guides
- refresh titles and descriptions where impressions exist but clicks are weak
- decide the next 12-page batch from real query data

## 14. Immediate Next Build Tasks

These are the concrete implementation tasks for the repo:

1. extend guide frontmatter with `category`, `tags`, and `primaryTool`
2. update the guide layout to render related guides and a tool-specific CTA
3. reorganize `/guides` into visible clusters
4. publish the first 4 long-tail guides

## 15. Working Principle

For the next month, treat Subtitle Toolkit as one thing only:

`a long-tail SEO machine for subtitle workflow queries`

Do not ask whether the site is big enough yet.
Ask whether you published the next useful page.
