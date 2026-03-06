# Schema Validation Report — VR-188

**Date:** 2026-03-06
**Validated against:** https://vykup-regiony-cz-dev.vercel.app/
**Reference:** schema.org specs + Google Rich Results requirements

## Summary

| #   | Schema Type               | Pages                                 | Status       | Notes                                                                        |
| --- | ------------------------- | ------------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| 1   | Organization              | Homepage (all regions)                | ✅ PASS      | Valid                                                                        |
| 2   | RealEstateAgent           | Homepage (all regions)                | ✅ PASS      | All required + recommended fields present                                    |
| 3   | Service + OfferCatalog    | Homepage (all regions)                | ✅ PASS      | Valid with nested Offer items                                                |
| 4   | FAQPage                   | Homepage, service pages, caste-dotazy | ✅ PASS      | Correct Question/Answer structure                                            |
| 5   | BreadcrumbList            | All inner pages                       | 🔴 **FIXED** | Was using wrong domain `vykupnemovitosticz.cz`                               |
| 6   | Article                   | /proc-my                              | 🔴 **FIXED** | Missing `datePublished`, `image`, `publisher.logo`                           |
| 7   | Article                   | /zpetny-najem                         | 🔴 **FIXED** | Missing `datePublished`, `image`, `publisher.logo`; duplicate BreadcrumbList |
| 8   | Article                   | /blog/[slug]                          | 🟡 **FIXED** | Missing `image`, `publisher.logo`, `publisher.url`, `mainEntityOfPage`       |
| 9   | HowTo                     | /jak-to-funguje                       | ✅ PASS      | Valid with steps, totalTime, estimatedCost                                   |
| 10  | CollectionPage + ItemList | /blog                                 | 🟡 **FIXED** | Used `JSON.stringify` instead of `safeJsonLd` (XSS risk)                     |
| 11  | ItemList                  | /kraje                                | ✅ PASS      | Valid with 14 region ListItems                                               |
| 12  | WebPage                   | Service pages                         | ✅ PASS      | Valid                                                                        |

## Critical Errors Fixed

### 1. BreadcrumbList — Wrong Domain (ALL inner pages)

- **File:** `src/components/breadcrumbs.tsx`
- **Issue:** `SITE_URL` was `https://www.vykupnemovitosticz.cz` — a non-existent domain
- **Impact:** All BreadcrumbList schemas across ~15 pages pointed to wrong URLs
- **Fix:** Changed to `https://vykoupim-nemovitost.cz`

### 2. Duplicate BreadcrumbList — /zpetny-najem

- **File:** `src/app/zpetny-najem/page.tsx`
- **Issue:** Both manual breadcrumbJsonLd AND `<Breadcrumbs>` component = 2 BreadcrumbList schemas
- **Fix:** Removed manual breadcrumbJsonLd

### 3. Article Schemas — Missing Required Fields

- **Files:** proc-my, zpetny-najem, blog/[slug]
- **Issue:** Missing `datePublished`, `image`, `publisher.logo`
- **Fix:** Added all missing fields, standardized publisher name

## Warnings (Non-blocking, documented)

- **W-1:** Inconsistent publisher names → standardized to "Vykoupím Nemovitost"
- **W-2:** blog/page.tsx used JSON.stringify instead of safeJsonLd → fixed
- **W-3:** Organization.logo as string (acceptable per schema.org)
- **W-4:** Offer items missing `price` (acceptable for service descriptions)

## Schema Types Inventory

Total unique schema types: **10** (Organization, RealEstateAgent, Service, FAQPage, BreadcrumbList, Article, HowTo, CollectionPage, ItemList, WebPage)

Total JSON-LD blocks across site: **~40+**

## Conclusion

- **0 critical errors remaining**
- All JSON-LD valid and schema.org compliant
- Google Rich Results eligible: FAQPage, HowTo, BreadcrumbList, Article
