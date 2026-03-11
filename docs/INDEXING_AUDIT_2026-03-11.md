# Indexing Health Audit — 2026-03-11

**Context:** `site:vykoupim-nemovitost.cz` returns 0 results in Google after 7+ days since GSC connection (2026-03-04). IndexNow was sent (VR-226). This audit diagnoses the full crawl chain.

## 1. Googlebot URL Checks

| URL                                 | HTTP Status | X-Robots-Tag | meta robots        | Canonical                             |
| ----------------------------------- | ----------- | ------------ | ------------------ | ------------------------------------- |
| vykoupim-nemovitost.cz/             | 200 ✅      | none ✅      | `index, follow` ✅ | **🔴 `praha.vykoupim-nemovitost.cz`** |
| vykoupim-nemovitost.cz/kraje        | 200 ✅      | none ✅      | —                  | `vykoupim-nemovitost.cz/kraje` ✅     |
| vykoupim-nemovitost.cz/blog         | 200 ✅      | none ✅      | —                  | `vykoupim-nemovitost.cz/blog` ✅      |
| praha.vykoupim-nemovitost.cz/       | 200 ✅      | none ✅      | `index, follow` ✅ | `praha.vykoupim-nemovitost.cz` ✅     |
| stredocesky.vykoupim-nemovitost.cz/ | 200 ✅      | none ✅      | —                  | ✅                                    |
| All 14 region subdomains            | 200 ✅      | none ✅      | —                  | ✅                                    |

**Note:** `brno.vykoupim-nemovitost.cz` → DEPLOYMENT_NOT_FOUND. Expected: Brno uses `jihomoravsky.vykoupim-nemovitost.cz`.

## 2. robots.txt

| Domain                       | Status | Issues                                  |
| ---------------------------- | ------ | --------------------------------------- |
| vykoupim-nemovitost.cz       | 200 ✅ | None — `Allow: /`, only `/api/` blocked |
| praha.vykoupim-nemovitost.cz | 200 ✅ | Same clean config                       |
| All 14 region subdomains     | 200 ✅ | All clean                               |

**Verdict:** ✅ No Googlebot blocks.

## 3. Sitemap

| URL                                      | Status | URL Count | Issues        |
| ---------------------------------------- | ------ | --------- | ------------- |
| vykoupim-nemovitost.cz/sitemap.xml       | 200 ✅ | 29        | Valid XML ✅  |
| praha.vykoupim-nemovitost.cz/sitemap.xml | 200 ⚠️ | 1         | Only homepage |
| Other region subdomains                  | 200 ⚠️ | 1 each    | Only homepage |

## 4. Middleware (src/middleware.ts)

- ✅ No crawler blocking logic
- ✅ No X-Robots-Tag injection
- ✅ Regional path redirects (301) are correct
- ✅ Invalid subdomains redirect to root (301)

## 5. next.config.ts

- ✅ No custom headers(), no X-Robots-Tag, no noindex
- ✅ Clean minimal config

## 6. CSP Headers

- ✅ No Content-Security-Policy headers blocking Googlebot

## 7. 🔴 CRITICAL ISSUE: Cross-Domain Canonical on Root Homepage

### Problem

`buildCanonicalUrl()` set the canonical for `vykoupim-nemovitost.cz/` to `https://praha.vykoupim-nemovitost.cz`.

This created contradictory signals:

- **Sitemap** lists 29 URLs on `vykoupim-nemovitost.cz`
- **Homepage canonical** tells Google "the real page is on `praha.vykoupim-nemovitost.cz`"
- Google sees this as "the root domain doesn't want to be indexed" and stops crawling

### Fix Applied

Changed `buildCanonicalUrl()` so:

- **Root domain** (`vykoupim-nemovitost.cz`): self-referencing canonical
- **Subdomains**: self-referencing canonical per subdomain

## 8. check:indexability Script

Created `scripts/check-indexability.ts` + `npm run check:indexability` — automated check of all the above.

## Recommended Next Steps

1. Deploy canonical fix (this PR)
2. Re-submit sitemap in Google Search Console
3. Request indexing for homepage via GSC URL Inspection
4. Re-send IndexNow ping
5. Monitor GSC for coverage changes over 3-7 days
