# SEO Monitoring

Automated weekly SEO health check for vykoupim-nemovitost.cz.

## What It Checks

1. **Sitemap health** — fetches `/sitemap.xml` and checks all `<loc>` URLs for HTTP status
2. **Indexing estimate** — queries Google `site:vykoupim-nemovitost.cz` to estimate indexed page count
3. **Alerts** — sends Telegram notification when issues are detected (non-200 pages, low indexing)

## Vercel Cron

Configured in `vercel.json`:

- **Schedule:** `0 6 * * 1` (every Monday at 6:00 UTC)
- **Endpoint:** `GET /api/cron/seo-check`
- **Auth:** Vercel automatically sends `Authorization: Bearer <CRON_SECRET>`

## Environment Variables

| Variable             | Description                                   |
| -------------------- | --------------------------------------------- |
| `CRON_SECRET`        | Secret for cron endpoint auth (set in Vercel) |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for alerts                 |
| `TELEGRAM_CHAT_ID`   | Telegram chat ID for alerts                   |

## Local Testing

```bash
# Start dev server
npm run dev

# Trigger check (no auth required if CRON_SECRET not set)
curl http://localhost:3000/api/cron/seo-check

# With auth
CRON_SECRET=test curl -H "Authorization: Bearer test" http://localhost:3000/api/cron/seo-check

# Via CLI script
npx tsx scripts/seo-check.ts
```

## Sitemap Ping URLs (Post-Deploy)

After deploying new content, ping search engines to re-crawl the sitemap:

- **Google:** https://www.google.com/ping?sitemap=https://vykoupim-nemovitost.cz/sitemap.xml
- **Bing:** https://www.bing.com/ping?sitemap=https://vykoupim-nemovitost.cz/sitemap.xml

These can be added to a post-deploy hook or called manually.
