# Launch Checklist

## Product

- Confirm the homepage headline and tool descriptions read naturally to overseas users
- Manually test all 8 tool pages with sample input
- Confirm guide pages link back into relevant tools

## SEO

- Verify `https://subtitletoolkit.tools` is the final production domain
- Verify `https://www.subtitletoolkit.tools` redirects correctly if you attach it
- Confirm sitemap is live at `/sitemap-index.xml`
- Confirm robots is live at `/robots.txt`
- Check canonical and Open Graph tags on homepage, one tool page, and one guide page

## Analytics

- Set `PUBLIC_PLAUSIBLE_DOMAIN`
- Verify Plausible pageviews appear after production launch
- Verify tool events appear for upload, sample load, copy, and download

## Legal

- Review `/privacy-policy`
- Review `/terms-of-service`
- Confirm support email is correct

## Deploy

- Push repo to GitHub
- Confirm the Cloudflare Pages project uses branch `main`
- Connect repo to Cloudflare Pages
- Set build command to `pnpm build`
- Set output directory to `dist`
- Set `NODE_VERSION=22.12.0`
- Add the custom domain
- Confirm the Cloudflare DNS zone is active before binding the apex domain
- Check HTTPS

## Smoke Test

- `/`
- `/tools`
- `/tools/srt-to-vtt`
- `/tools/subtitle-time-shifter`
- `/guides/srt-vs-vtt`
- `/privacy-policy`
- `/terms-of-service`
- `/404`
