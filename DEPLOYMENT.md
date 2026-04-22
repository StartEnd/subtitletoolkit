# Deployment

## Recommended Host

Use Cloudflare Pages for the first production deployment.

Why this fits the current product:

- static Astro output, no server runtime required
- global CDN and HTTPS handled for you
- simple enough for a first launch
- good match for an ad-first tool and content site

## Local Prerequisites

This repo is already configured for:

- `pnpm`
- Node `22.12.0` via [`.node-version`](/Users/song/Project/subtitletoolkit/.node-version)
- static Astro build output in `dist`

Local sanity check before pushing:

```bash
pnpm install
pnpm build
```

## Push To GitHub

Cloudflare Pages should be connected to a GitHub repo.

If this local repo has not been pushed yet:

```bash
git remote add origin <your-github-repo-url>
git add .
git commit -m "Build Astro foundation for Subtitle Toolkit"
git push -u origin main
```

If the remote already exists, just push the current `main` branch.

## Cloudflare Pages Settings

When creating the Pages project, use:

- Source: GitHub
- Production branch: `main`
- Framework preset: `Astro` if Cloudflare detects it, otherwise `None`
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: `/`

Recommended build env:

- `NODE_VERSION=22.12.0`
- `PUBLIC_PLAUSIBLE_DOMAIN=subtitletoolkit.tools`
- `PUBLIC_PLAUSIBLE_SRC=https://plausible.io/js/script.js`

Notes:

- This release is static-first, so no Astro adapter is required
- `packageManager` is pinned in [package.json](/Users/song/Project/subtitletoolkit/package.json), so Pages should use `pnpm`

## Custom Domain

Recommended production domain:

- primary: `subtitletoolkit.tools`
- optional redirect domain: `www.subtitletoolkit.tools`

Because `subtitletoolkit.tools` is the apex domain, the cleanest setup is:

1. Add `subtitletoolkit.tools` as a site in Cloudflare DNS
2. Change the nameservers at Porkbun to the ones Cloudflare gives you
3. Wait until the Cloudflare zone becomes active
4. Open the Pages project and add `subtitletoolkit.tools` as a custom domain
5. Add `www.subtitletoolkit.tools` too if you want both versions covered
6. Let Cloudflare issue SSL automatically

If you do not want to move DNS yet, use a subdomain first, such as `www.subtitletoolkit.tools`.

## First Production Checks

After the first successful deploy, verify:

- `/`
- `/tools`
- `/tools/srt-to-vtt`
- `/guides/srt-vs-vtt`
- `/privacy-policy`
- `/terms-of-service`
- `/robots.txt`
- `/sitemap-index.xml`

## Later Re-evaluation

Revisit hosting only if you add:

- auth
- paid accounts
- server-side APIs
- SSR or edge rendering
