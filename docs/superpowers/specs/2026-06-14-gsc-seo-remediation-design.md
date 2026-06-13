# GSC SEO Remediation — Design & Program of Record

**Date:** 2026-06-14
**Property:** `sc-domain:vykoupim-nemovitost.cz` (siteOwner)
**Owner:** Dmitrij B
**Status:** Approved — full phased program; agent drives develop → production.

---

## 1. Validated baseline (GSC, last 90 days: 2026-03-16 → 2026-06-14)

| Metric | Value | Note |
|---|---|---|
| Clicks | **55** | ~0.6/day |
| Impressions | **6,926** | ~77/day, stable/slightly rising |
| **CTR** | **0.79%** | catastrophically low (healthy = 2–5%+) |
| **Avg position** | **14.7** | stuck on page 2 |
| Sitemap | 1 (`/sitemap.xml`), **Valid**, 393 URLs, 0 errors | healthy |

Source: `get_performance_overview`, `get_advanced_search_analytics`, `get_sitemaps` (all via gscServer MCP). Raw query/page exports retained in session transcript.

**Core problem:** demand and indexation are fine; almost everything ranks on **page 2 (pos 11–25)**, where CTR is physically near-zero. Two compounding failures sit on top: signal dilution from duplicate hosts, and a duplicate meta-description tag suppressing per-page snippets.

## 2. Root causes (each validated with tools)

### RC1 — Duplicate content across hosts (signal dilution)
Same content indexed on non-canonical hosts competing with the root domain:
- `praha.…/blog/vykup-v-exekuci` — 559 impr, last Google crawl **2026-03-11** → GSC verdict *"Duplicate without user-selected canonical"*.
- `praha.…/vykup-bytu` (369), `praha.…/vykup-pri-exekuci` (362), `praha.…/blog/jak-rychle-prodat-nemovitost` (261), `www.…/vykup-domu` (112).
- For `kolik zaplatí výkup`, subdomain praha (pos 3.1) outranks root (pos 5.2) → authority literally split.

**State:** 301 redirects (www→root, subdomain-content→root) are **live and correct** (`src/proxy.ts`, verified by curl). This is **legacy**: Google indexed copies before redirects existed and is slowly reprocessing (newer crawls already show "Page with redirect"). Self-healing but slow; we accelerate it.

### RC2 — Duplicate `<meta name="description">` on every page (CTR killer)
`src/app/layout.tsx:91-94` hardcodes a generic description literal directly in `<head>`. It renders **first**, before each page's correct unique description from `generateMetadata`. Both are present in raw SSR HTML (curl-verified) — the author's "SSR fallback" comment is based on a misconception (Metadata API descriptions are already in SSR HTML). Google tends to use the first → generic boilerplate shadows every tailored snippet.

Per-page descriptions are **already unique and good** (e.g. vykup-bytu, blog). **Fix = delete the hardcoded tag.**

### RC3 — Insufficient depth/targeting on high-demand clusters (page-2 ceiling)
High-impression queries where we under-rank:
| Query | Impr | Pos | Target page |
|---|---|---|---|
| výkup bytu v exekuci | 466 | 15.9 | vykup-pri-exekuci / vykup-bytu |
| výkup nemovitostí 2026 | 287 | 7.1 | homepage |
| odkup bytů | 188 | 13.9 | vykup-bytu |
| výkup nem. s hypotékou a exekucí | 170 | 14.4 | s-hypotekou |
| vykup nemovitosti v drazbe | 130 | 11.7 | vykup-v-drazbe |
| výkup nemovitostí plzeň | 129 | 10.6 | plzensky subdomain |
| výkup stavebních pozemků praha | 122 | 17.6 | vykup-pozemku?kraj=praha |
| jak zastavit dražbu (cluster) | ~120 | 12–20 | **missing dedicated guide** |
| s věcným břemenem (cluster) | ~155 | 23–25 | s-vecnym-bremenem (**weak**) |
| vykup domu v nucené dražbě | 75 | **3.3** | vykup-v-drazbe (0 clicks → snippet/intent) |

## 3. Plan (tiers; each change states its validation)

### Tier 1 — Indexing & sitemap hygiene
- **T1.1** `sitemap-blog.xml`: replace hardcoded `lastmod:"2026-03-16"` with real `post.date`. _Validate: curl sitemap, dates vary per post._
- **T1.2** Confirm no redirecting URLs in any sitemap (done — clean). _Validate: fetch each sitemap, assert only root URLs + subdomain homepages._
- **T1.3** Post-deploy: resubmit `/sitemap.xml` via GSC; re-inspect the legacy duplicate URLs to confirm reprocessing. _Validate: URL Inspection verdict moves off "Duplicate without canonical."_

### Tier 2 — On-page CTR
- **T2.1** Delete hardcoded `<meta name="description">` in `layout.tsx`. _Validate: each page renders exactly ONE description = its own._
- **T2.2** Audit every route renders a unique, intent-matched description (≤160 chars). _Validate: curl matrix of descriptions, no dupes._
- **T2.3** Title/H1 tuning for near-miss queries: surface `nucená dražba` + `před dražbou` on vykup-v-drazbe; `odkup` synonym on vykup-bytu; ensure a page strongly owns `výkup nemovitostí 2026`. _Validate: curl titles; track per-query position/CTR in GSC over 2–4 wks._

### Tier 3 — Content depth (page-2 → page-1)
- **T3.1** Dedicated **"Jak zastavit dražbu"** guide (informational intent currently served by a commercial page). _Validate: new URL indexed; cluster position._
- **T3.2** Strengthen **věcné břemeno** page (weakest, pos 23–25): depth, FAQ, internal links. _Validate: position delta._
- **T3.3** Reinforce exekuce/zadlužené + "jak rychle prodat" clusters (depth, freshness, internal links). _Validate: position delta._
- Constraint: **no fabricated testimonials, reviews, case studies, or statistics** (standing user rule).

### Tier 4 — Structured data, internal linking, freshness
- **T4.1** BreadcrumbList + FAQ JSON-LD coverage across use-case/blog pages. _Validate: Rich Results Test + GSC `rich_results`._
- **T4.2** Internal links: connect authority/static pages; exact-match anchors from blog → weak commercial pages. _Validate: crawl link presence._
- **T4.3** Real per-post `dateModified` where content genuinely changes. _Validate: rendered JSON-LD._

## 4. Delivery & measurement
- Branch `develop` (auto-deploys to dev preview). Verify on preview (curl + build), commit per tier (conventional commits, no `--no-verify`), then promote `develop`→`main` for production after verification.
- After each tier: `npm run ci` (lint + format:check + tsc + build) and `npm test` must pass.
- **Re-measure** in GSC ~2–4 weeks post-prod (SEO lags): compare CTR, avg position, and the per-query table above against this baseline. SEO changes do not show instantly — track the trend, not the next-day number.

## 5. Explicitly out of scope / non-issues (verified, do not "fix")
- `proxy.ts` redirects — working correctly (not "unwired"; it's Next 15.5's renamed middleware).
- `?mesto=` use-case pages — correctly `noindex,follow`.
- `?mesto=` subdomain homepages — correctly canonical → bare subdomain home.
- hreflang/lang — correct for a monolingual cs site.
