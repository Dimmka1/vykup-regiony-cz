# SEO Audit Report — Vykup Regiony CZ

**Generated:** 2026-03-06T15:11:34.995Z
**Total regional pages:** 14

## Summary

| Metric                       | Value |
| ---------------------------- | ----- |
| Total regions                | 14    |
| Pages with <300 unique words | 0     |
| Duplicate titles             | 0     |
| Duplicate SEO titles         | 0     |
| Duplicate meta descriptions  | 0     |

## Title Uniqueness

✅ All titles and SEO titles are unique.

## Meta Description Uniqueness

✅ All meta descriptions are unique.

## Canonical URLs

Canonical URLs are set via `buildCanonicalUrl()` in `home-page-content.tsx`.
Each region resolves to its subdomain URL (self-referencing).

| Region               | Expected Canonical                             |
| -------------------- | ---------------------------------------------- |
| Praha                | https://praha.vykoupim-nemovitost.cz           |
| Středočeský kraj     | https://stredocesky.vykoupim-nemovitost.cz     |
| Jihočeský kraj       | https://jihocesky.vykoupim-nemovitost.cz       |
| Plzeňský kraj        | https://plzensky.vykoupim-nemovitost.cz        |
| Karlovarský kraj     | https://karlovarsky.vykoupim-nemovitost.cz     |
| Ústecký kraj         | https://ustecky.vykoupim-nemovitost.cz         |
| Liberecký kraj       | https://liberecky.vykoupim-nemovitost.cz       |
| Královéhradecký kraj | https://kralovehradecky.vykoupim-nemovitost.cz |
| Pardubický kraj      | https://pardubicky.vykoupim-nemovitost.cz      |
| Kraj Vysočina        | https://vysocina.vykoupim-nemovitost.cz        |
| Jihomoravský kraj    | https://jihomoravsky.vykoupim-nemovitost.cz    |
| Olomoucký kraj       | https://olomoucky.vykoupim-nemovitost.cz       |
| Moravskoslezský kraj | https://moravskoslezsky.vykoupim-nemovitost.cz |
| Zlínský kraj         | https://zlinsky.vykoupim-nemovitost.cz         |

✅ Canonical URL logic verified: `buildCanonicalUrl(host, regionKey)` returns the region's subdomain URL on production, which is self-referencing.

## Content Word Count (Unique per Region)

| Region               | Unique Words | Intro | Outro | Market Info | Region FAQ | Status |
| -------------------- | ------------ | ----- | ----- | ----------- | ---------- | ------ |
| Královéhradecký kraj | 433          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Karlovarský kraj     | 436          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Pardubický kraj      | 438          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Plzeňský kraj        | 443          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Ústecký kraj         | 445          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Moravskoslezský kraj | 445          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Liberecký kraj       | 446          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Zlínský kraj         | 455          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Středočeský kraj     | 456          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Jihočeský kraj       | 456          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Olomoucký kraj       | 457          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Kraj Vysočina        | 462          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Jihomoravský kraj    | 462          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |
| Praha                | 520          | ✅    | ✅    | ✅          | ✅ (5)     | ✅     |

## Recommendations

1. **Add `regionIntro` and `regionOutro`** to `regions.yml` — unique paragraphs mentioning regional specifics.
2. **Render intro/outro** in `HomePageContent` to boost unique content per page.
3. **Ensure all regions have `regionFaq`** with 3-5 unique Q&A pairs.
4. **Canonical URLs** are correctly self-referencing — no changes needed.
