# Runbook — vykup-regiony-cz

## Incident severity

- **SEV-1**: Site down / 5xx for all users
- **SEV-2**: Core flow degraded (lead form broken)
- **SEV-3**: Non-critical bug (UI issue, slow page)

## 1) Что делать при даунтайме

1. Confirm incident (UptimeRobot + curl check)
2. Check latest deployment in Vercel
3. Check logs:
   - Vercel Runtime logs
   - Function logs
4. If impact high → rollback immediately
5. Open incident note in `devlog.md` with timestamp + root cause

Quick checks:

```bash
curl -I https://project.com
curl -I https://staging.project.com
```

## 2) Что делать при ошибках в Sentry

1. Open new error issue
2. Check release tag + commit
3. Group by fingerprint
4. If regression after deploy → rollback
5. Create fix task for developer

## 3) Как проверить логи

- Vercel Dashboard → Project → Logs
- Filter by level: `error`, `warn`
- Track endpoint, status code, latency, user agent

## 4) Как откатить деплой

Primary:

- Promote last healthy deployment in Vercel

Secondary:

- `git revert` last commit in `main` and redeploy

## 5) Эскалация

- Build/tests failed → `developer`
- Infra/architecture uncertainty → `architect`
- Business-critical blocker → `ceo`

## 6) Monitoring and alerting baseline

- UptimeRobot: check every 5 min (prod + staging)
- Sentry: alert on new unhandled exceptions
- Optional: Telegram alert channel for SEV-1/SEV-2

## 7) SEO indexation log

Track manual SEO operator actions here so the post-migration recovery is traceable.

| Date       | Action                        | Detail                                                                                                                                                                          |
| ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-30 | Plan created                  | `docs/superpowers/plans/2026-04-30-seo-indexation-recovery.md` — 14 tasks for post-301-migration recovery                                                                       |
| 2026-04-30 | Production deploy             | All 17 commits merged to `main` and deployed via `workflow_dispatch` (run 25172298166). Production verified: sitemap-core lastmod=2026-04-30, /vykup-v-drazbe 200, hreflang OK. |
| 2026-04-30 | IndexNow auto-submit          | CI step "Submit URLs to IndexNow" ran during production deploy. Manual `npm run indexnow` re-run after — 190 URLs submitted to api.indexnow.org (Bing) ✓.                       |
| 2026-04-30 | +14-day re-inspection routine | Scheduled remote agent `trig_01EF7GB2dDavvAwaehuketHZ` for 2026-05-14T08:00:00Z. View: https://claude.ai/code/routines/trig_01EF7GB2dDavvAwaehuketHZ                            |
| 2026-05-01 | IndexNow follow-up deploy     | PR #302 (recursive sub-sitemap fix + this log) merged to `main`. Re-deployed prod via `workflow_dispatch` (run 25207891791). Auto-IndexNow now sends 190 URLs (was 4) — Bing ✓. |

### GSC manual "Request indexing" — operator-only step

The Google Search Console "Request indexing" button is **UI-only** — there is no API for it (Google deliberately keeps it manual to prevent abuse). Run this in the GSC web UI on day 1 (10 URLs) and day 2 (5 URLs):

**Day 1 (10/day quota):**

1. https://vykoupim-nemovitost.cz/vykup-bytu
2. https://vykoupim-nemovitost.cz/vykup-domu
3. https://vykoupim-nemovitost.cz/vykup-pozemku
4. https://vykoupim-nemovitost.cz/vykup-pri-exekuci
5. https://vykoupim-nemovitost.cz/vykup-pri-dedictvi
6. https://vykoupim-nemovitost.cz/vykup-pri-rozvodu
7. https://vykoupim-nemovitost.cz/vykup-spoluvlastnickeho-podilu
8. https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou
9. https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-vecnym-bremenem
10. https://vykoupim-nemovitost.cz/zpetny-najem

**Day 2 (5 more):**

11. https://vykoupim-nemovitost.cz/blog/jak-rychle-prodat-nemovitost
12. https://vykoupim-nemovitost.cz/blog/vykup-v-exekuci
13. https://vykoupim-nemovitost.cz/blog/vykup-vs-drazba
14. https://vykoupim-nemovitost.cz/blog/kolik-stoji-vykup
15. https://vykoupim-nemovitost.cz/blog/nemovitost-v-exekuci-pruvodce

For each: paste URL into GSC URL inspection box → wait → click **Request indexing**. After all 15, append a row to the table above.

## 8) External www. backlink cleanup

GSC reports `https://www.vykoupim-nemovitost.cz/...` referring to root URLs
(e.g. `/blog/vykup-v-exekuci`, `/vykup-pri-exekuci`). These come from external
sites linking to the www version, which 301-redirects to non-www. To recover
the missing canonical signal:

1. In GSC → "Links" → External links → sort by target URL.
2. For each external URL whose target starts with `https://www.vykoupim-nemovitost.cz/`,
   contact the site owner and ask them to update their link to the non-www
   form: `https://vykoupim-nemovitost.cz/<same-path>`.
3. Common targets to fix first: Seznam Firmy, Foursquare, business
   directories, partner real-estate portals.
4. Track each fix in the table below with date + URL pair.

| Date | External site | Old URL | New URL | Fixed? |
| ---- | ------------- | ------- | ------- | ------ |
|      |               |         |         |        |

## 9) Post-deploy SEO checklist (manual operator actions)

Run after each significant SEO-related deploy:

1. **IndexNow** (auto-runs in CI after `deploy-production` per `.github/workflows/ci.yml`).
   - Verify in CI logs that `Submit URLs to IndexNow` step printed `status=200` (or `202`) for at least Bing + Yandex.
   - If a step failed (`continue-on-error: true`), re-run manually:
     ```bash
     npm run indexnow
     ```
2. **GSC URL inspection — Request indexing** for top changed root URLs (10/day quota).
   Priority list during the post-301-migration recovery (~14 days from 2026-04-30):
   - `/vykup-bytu`, `/vykup-domu`, `/vykup-pozemku`
   - `/vykup-pri-exekuci`, `/vykup-pri-dedictvi`, `/vykup-pri-rozvodu`
   - `/vykup-spoluvlastnickeho-podilu`, `/vykup-nemovitosti-s-hypotekou`
   - `/vykup-nemovitosti-s-vecnym-bremenem`, `/zpetny-najem`, `/vykup-v-drazbe`
   - `/blog/jak-rychle-prodat-nemovitost`, `/blog/vykup-v-exekuci`
   - `/blog/vykup-vs-drazba`, `/blog/kolik-stoji-vykup`,
     `/blog/nemovitost-v-exekuci-pruvodce`
3. **Schedule a +14-day re-inspection agent** (one-time):
   - Use the `/schedule` slash command in local Claude Code.
   - Ask it to call the GSC MCP `inspect_url_enhanced` for each of the URLs above
     and report a diff vs. baseline.
4. **Watch for `referring_urls` containing `https://www.vykoupim-nemovitost.cz/...`**
   in the next inspection — those are external www-backlinks that need cleanup
   (see §8 above).

## 10) Sitemap freshness

- `<lastmod>` is auto-injected by `scripts/build.mjs` (UTC date) at every build —
  do not hardcode dates in `src/lib/sitemap-helpers.ts`.
- After meaningful content updates that warrant Google recrawl, simply trigger
  a production deploy (`workflow_dispatch` with `deploy_production: true`).
  IndexNow + new `lastmod` go out automatically.
