# Post-audit SEO health check — 2026-05-07

One-week post-audit health check for `vykoupim-nemovitost.cz`. Audit landed 2026-04-30
([docs/audit/2026-04-30-ux-text-visual-audit.md](../docs/audit/2026-04-30-ux-text-visual-audit.md)).
All checks below run against production HTML, sitemaps, robots, the local codebase, and Google
public search. GSC data is gathered separately by the user (instructions at the bottom).

## Regression scan (automated)

Curled the 6 specified URLs and grep'd for every "removed" phrase from the audit. Counts are
exact `grep -o "$phrase" | wc -l` against the rendered HTML response.

| Page                     | `Jana K.` | `Martin S.` | `Eva M.` | `Petr N.` | `Stovky klient` | `Tisíce spokoj` | `100% diskrét` | `bohaté zkušen` | `letité zkušen` | `50+ Klient` |
| ------------------------ | --------- | ----------- | -------- | --------- | --------------- | --------------- | -------------- | --------------- | --------------- | ------------ |
| `/`                      | 0         | 0           | 0        | 0         | 0               | 0               | 0              | 0               | 0               | 0            |
| `/o-nas`                 | 0         | 0           | 0        | 0         | 0               | 0               | 0              | 0               | 0               | 0            |
| `/vykup-pri-exekuci`     | 0         | 0           | 0        | 0         | 0               | 0               | 0              | 0               | 0               | 0            |
| `/vykup-cinzovnich-domu` | 0         | 0           | 0        | 0         | 0               | 0               | **2** 🔴       | 0               | 0               | 0            |
| `/vykup-pri-privatizaci` | 0         | 0           | 0        | 0         | 0               | 0               | 0              | 0               | 0               | 0            |
| `/image-sitemap.xml`     | 0         | 0           | 0        | 0         | 0               | 0               | 0              | 0               | 0               | 0            |

🔴 **REGRESSION on `/vykup-cinzovnich-domu`.** Visible bullet rendered as
`<Shield/> 100% diskrétní` (also present in the Next.js RSC payload — so it's a real DOM node,
not a stray comment). The audit doc explicitly listed this exact phrase for replacement
([docs/audit/2026-04-30-ux-text-visual-audit.md:95-103](../docs/audit/2026-04-30-ux-text-visual-audit.md))
and recommended `Plně diskrétní jednání`. The replacement was applied to `/vykup-pri-exekuci`
(which now correctly shows `Plně diskrét`) but the same `<Shield/> 100% diskrétní` bullet
exists unchanged in **6 other use-case pages**:

- [src/app/vykup-cinzovnich-domu/page.tsx:319](../src/app/vykup-cinzovnich-domu/page.tsx:319)
- [src/app/vykup-pri-rozvodu/page.tsx:292](../src/app/vykup-pri-rozvodu/page.tsx:292)
- [src/app/vykup-pri-dedictvi/page.tsx:298](../src/app/vykup-pri-dedictvi/page.tsx:298)
- [src/app/vykup-spoluvlastnickeho-podilu/page.tsx:321](../src/app/vykup-spoluvlastnickeho-podilu/page.tsx:321)
- [src/app/vykup-nemovitosti-s-hypotekou/page.tsx:310](../src/app/vykup-nemovitosti-s-hypotekou/page.tsx:310)
- [src/app/vykup-nemovitosti-s-vecnym-bremenem/page.tsx:325](../src/app/vykup-nemovitosti-s-vecnym-bremenem/page.tsx:325)

Recommended sweep: replace `100% diskrétní` → `Plně diskrétní` (or just `Diskrétní jednání`)
on those 6 lines.

## Honest claims rendering (automated)

| Page                     | Expected phrase                        | Status       |
| ------------------------ | -------------------------------------- | ------------ |
| `/vykup-pri-exekuci`     | `Plně diskrét`                         | ✅ 2 matches |
| `/`                      | `Panorama města`                       | ✅ 2 matches |
| `/image-sitemap.xml`     | `ve všech 14 krajích`                  | ✅ 1 match   |
| `/vykup-pri-privatizaci` | `Specializujeme se na výkup priv`      | ✅ 2 matches |
| `/vykup-cinzovnich-domu` | `Pomáháme majitelům činžov`            | ✅ 2 matches |
| `/o-nas`                 | `provize a skrytých poplatků`          | ✅ 1 match   |
| `/o-nas`                 | `obvyklá doba splatnosti`              | ✅ 1 match   |
| `/o-nas`                 | `krajů po celé ČR`                     | ✅ 1 match   |
| `/o-nas`                 | `právní servis a kompletní zastoupení` | ✅ 1 match   |

All 9 honest replacement claims rendering correctly.

## /offline + sitemaps + robots (automated)

**`/offline`** ✅

- HTTP 200 OK
- `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`
- `<meta name="robots" content="noindex, nofollow"/>` ✅
- `<h1>Nejste připojeni k internetu</h1>` ✅
- `tel:+420776424145` link present ✅
- `sms:+420776424145?body=Dobr%C3%BD%20den...` present ✅
- `Napsat SMS` label appears 4× ✅

**Sitemaps** (newest `<lastmod>` per file)
| Sitemap | Newest `lastmod` | HTTP | Notes |
|---|---|---|---|
| `/sitemap.xml` | `2026-05-09` | 200 | ✅ fresh (index file) |
| `/sitemap-core.xml` | `2026-05-09` | 200 | ✅ fresh |
| `/sitemap-blog.xml` | `2026-05-09` | 200 | ✅ fresh |
| `/sitemap-geo.xml` | `2026-03-16` | 200 | 🟡 stale (no geo content changed in audit, so likely fine — but worth a re-stamp on next deploy) |
| `/image-sitemap.xml` | (no `<lastmod>`) | 200 | ✅ image sitemaps don't require `<lastmod>`; 198 URLs / 417 images |

**`/offline` exclusion from sitemaps** ✅ — 0 occurrences across all 5 sitemaps.

**Use-case pages in sitemap-core.xml** ✅

- `vykup-cinzovnich-domu` — present
- `vykup-pri-privatizaci` — present
- `vykup-pri-exekuci` — present
- `vykup-pri-rozvodu` — present

(Aside: tested `vykup-zadluzenych-nemovitosti` for completeness — page returns HTTP 404,
i.e. doesn't exist as a route, so its absence from the sitemap is correct.)

**`/robots.txt`** ✅ — `User-Agent: *` → `Allow: /`, `Disallow: /api/`. `/offline` is allowed
(noindex meta tag handles search exclusion). 28 user-agent blocks (AI crawlers explicitly
listed with same Allow/Disallow). `Sitemap: https://vykoupim-nemovitost.cz/sitemap.xml`.

## Public Google probes (automated, via WebSearch)

| Query                                              | Hits                                          | Notes                                                                                                                                                                                                         |
| -------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site:vykoupim-nemovitost.cz "Stovky klientů"`     | 0                                             | ✅ removed claim not indexed                                                                                                                                                                                  |
| `site:vykoupim-nemovitost.cz "100% diskrétní"`     | 0                                             | ✅ Google doesn't surface it yet, **but the phrase IS still in HTML on 6 pages** (see regression above). Expect this probe to start returning hits once Google re-crawls those use-case pages.                |
| `site:vykoupim-nemovitost.cz "Tisíce spokojených"` | 0                                             | ✅ removed claim not indexed                                                                                                                                                                                  |
| `site:vykoupim-nemovitost.cz výkup nemovitostí`    | 1 (blog/kolik-stoji-vykup)                    | 🟡 only one indexed page returned; Google index for the domain looks thin. Worth confirming via GSC `inspect_url_enhanced` (see below) — not necessarily a regression, could just be search-result selection. |
| `site:vykoupim-nemovitost.cz vykup-pri-exekuci`    | 1 (blog/kolik-stoji-vykup) + competitor sites | 🟡 the `/vykup-pri-exekuci` page itself didn't surface as the top hit. Verify indexing status in GSC.                                                                                                         |

## Build green check (automated)

Run on a fresh `npm ci` of the current `develop` branch in this worktree:

| Command            | Result                                                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`           | ✅ clean install                                                                                                                                                        |
| `npm run lint`     | ✅ pre-existing 1 warning only: `<img>` in [src/components/tracking-pixels.tsx:96](../src/components/tracking-pixels.tsx:96) (intentional — third-party tracking pixel) |
| `npx tsc --noEmit` | ✅ 0 errors                                                                                                                                                             |
| `npm test`         | ✅ 45/45 tests pass across 8 files (341 ms)                                                                                                                             |

`npm run build` skipped per task instructions.

## GSC commands to run locally

Paste this prompt into your local Claude Code session (in the vykup-regiony-cz repo) to run the GSC checks:

---

Using the gscServer MCP, run these checks against `sc-domain:vykoupim-nemovitost.cz` and produce a short markdown summary:

1. `compare_search_periods` — compare 2026-04-30..2026-05-06 vs 2026-04-23..2026-04-29 (current week vs prior week). Flag any page or query with a clicks/impressions drop > 20%.
2. `get_performance_overview` for the last 7 days (2026-04-30..2026-05-06).
3. `get_search_analytics` — top 25 queries, last 7 days. Flag any query that previously appeared but is now missing.
4. `inspect_url_enhanced` for these URLs and report indexing status + last crawl date:
   - https://vykoupim-nemovitost.cz/
   - https://vykoupim-nemovitost.cz/o-nas
   - https://vykoupim-nemovitost.cz/vykup-pri-exekuci
   - https://vykoupim-nemovitost.cz/vykup-cinzovnich-domu
   - https://vykoupim-nemovitost.cz/vykup-pri-privatizaci
5. `inspect_url_enhanced` for https://vykoupim-nemovitost.cz/offline — it should be marked 'Excluded by noindex tag'.
6. `list_sitemaps_enhanced` — confirm all 4 sitemaps submitted, no errors/warnings since 2026-04-30.

Produce a single markdown report grouped by check, with severity tags 🔴/🟠/🟡/✅. End with one-sentence verdict.

---

## Verdict

🟠 **Mostly clean** — automated removal of fake testimonials & superlatives held across all 6 audited pages, /offline + sitemaps + robots are healthy, build is green; **one incomplete fix from the audit**: `100% diskrétní` was replaced on `/vykup-pri-exekuci` only and remains live on 6 other use-case pages — recommend a follow-up sweep before Google re-crawls them.
