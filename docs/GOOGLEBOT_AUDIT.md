# Googlebot Audit Report

**Date:** 2026-03-09T03:44:08.802Z
**Domain:** https://vykoupim-nemovitost.cz
**User-Agent:** `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`

## Summary

| Metric       | Value |
| ------------ | ----- |
| URLs audited | 10    |
| Passed       | 5     |
| Failed       | 5     |

## ⚠️ Issues Found

- **https://vykoupim-nemovitost.cz/**: Canonical mismatch: "https://praha.vykoupim-nemovitost.cz" (expected: "https://vykoupim-nemovitost.cz")
- **https://vykoupim-nemovitost.cz/brno**: HTTP 404 (expected 200)
- **https://vykoupim-nemovitost.cz/brno**: <meta robots> contains noindex: "noindex"
- **https://vykoupim-nemovitost.cz/ostrava**: HTTP 404 (expected 200)
- **https://vykoupim-nemovitost.cz/ostrava**: <meta robots> contains noindex: "noindex"
- **https://vykoupim-nemovitost.cz/o-nas**: HTTP 404 (expected 200)
- **https://vykoupim-nemovitost.cz/o-nas**: <meta robots> contains noindex: "noindex"
- **https://vykoupim-nemovitost.cz/vzor-smlouvy**: HTTP 404 (expected 200)
- **https://vykoupim-nemovitost.cz/vzor-smlouvy**: <meta robots> contains noindex: "noindex"

## Detailed Results

### ❌ https://vykoupim-nemovitost.cz/

| Check                | Value                                |
| -------------------- | ------------------------------------ | ---------------------------------------- |
| Status               | 200                                  |
| Final URL            | https://vykoupim-nemovitost.cz/      |
| Redirects            | 0                                    |
| X-Robots-Tag noindex | No                                   |
| Meta robots noindex  | No                                   |
| Canonical            | https://praha.vykoupim-nemovitost.cz |
| Canonical correct    | ❌                                   |
| Content size         | 329,282 bytes                        |
| Has content          | ✅                                   |
| Title                | Výkup nemovitostí Praha              | Rychlá nabídka pro byt i dům do 24 hodin |
| H1                   | Rychlý výkup nemovitostí v Praze     |

**Issues:**

- 🔴 Canonical mismatch: "https://praha.vykoupim-nemovitost.cz" (expected: "https://vykoupim-nemovitost.cz")

### ✅ https://vykoupim-nemovitost.cz/praha

| Check                | Value                                           |
| -------------------- | ----------------------------------------------- | ---------------------------------------- |
| Status               | 200                                             |
| Final URL            | https://praha.vykoupim-nemovitost.cz/           |
| Redirects            | 1 (301 → https://praha.vykoupim-nemovitost.cz/) |
| X-Robots-Tag noindex | No                                              |
| Meta robots noindex  | No                                              |
| Canonical            | https://praha.vykoupim-nemovitost.cz            |
| Canonical correct    | ✅                                              |
| Content size         | 329,282 bytes                                   |
| Has content          | ✅                                              |
| Title                | Výkup nemovitostí Praha                         | Rychlá nabídka pro byt i dům do 24 hodin |
| H1                   | Rychlý výkup nemovitostí v Praze                |

### ❌ https://vykoupim-nemovitost.cz/brno

| Check                | Value                               |
| -------------------- | ----------------------------------- |
| Status               | 404                                 |
| Final URL            | https://vykoupim-nemovitost.cz/brno |
| Redirects            | 0                                   |
| X-Robots-Tag noindex | No                                  |
| Meta robots noindex  | ⚠️ YES                              |
| Canonical            | ❌ Missing                          |
| Canonical correct    | N/A                                 |
| Content size         | 46,273 bytes                        |
| Has content          | ✅                                  |
| Title                | Výkup nemovitostí                   |
| H1                   | Stránka nenalezena                  |

**Issues:**

- 🔴 HTTP 404 (expected 200)
- 🔴 <meta robots> contains noindex: "noindex"

### ❌ https://vykoupim-nemovitost.cz/ostrava

| Check                | Value                                  |
| -------------------- | -------------------------------------- |
| Status               | 404                                    |
| Final URL            | https://vykoupim-nemovitost.cz/ostrava |
| Redirects            | 0                                      |
| X-Robots-Tag noindex | No                                     |
| Meta robots noindex  | ⚠️ YES                                 |
| Canonical            | ❌ Missing                             |
| Canonical correct    | N/A                                    |
| Content size         | 46,276 bytes                           |
| Has content          | ✅                                     |
| Title                | Výkup nemovitostí                      |
| H1                   | Stránka nenalezena                     |

**Issues:**

- 🔴 HTTP 404 (expected 200)
- 🔴 <meta robots> contains noindex: "noindex"

### ✅ https://vykoupim-nemovitost.cz/blog

| Check                | Value                               |
| -------------------- | ----------------------------------- | ------------------------------- | ----------------- |
| Status               | 200                                 |
| Final URL            | https://vykoupim-nemovitost.cz/blog |
| Redirects            | 0                                   |
| X-Robots-Tag noindex | No                                  |
| Meta robots noindex  | No                                  |
| Canonical            | https://vykoupim-nemovitost.cz/blog |
| Canonical correct    | ✅                                  |
| Content size         | 75,905 bytes                        |
| Has content          | ✅                                  |
| Title                | Blog                                | Výkup nemovitostí — rady a tipy | Výkup nemovitostí |
| H1                   | Blog o výkupu nemovitostí           |

### ✅ https://vykoupim-nemovitost.cz/jak-to-funguje

| Check                | Value                                         |
| -------------------- | --------------------------------------------- | -------------------- | ----------------- |
| Status               | 200                                           |
| Final URL            | https://vykoupim-nemovitost.cz/jak-to-funguje |
| Redirects            | 0                                             |
| X-Robots-Tag noindex | No                                            |
| Meta robots noindex  | No                                            |
| Canonical            | https://vykoupim-nemovitost.cz/jak-to-funguje |
| Canonical correct    | ✅                                            |
| Content size         | 63,004 bytes                                  |
| Has content          | ✅                                            |
| Title                | Jak funguje výkup nemovitosti                 | Vykoupíme Nemovitost | Výkup nemovitostí |
| H1                   | Jak funguje výkup nemovitosti                 |

### ✅ https://vykoupim-nemovitost.cz/reference

| Check                | Value                                    |
| -------------------- | ---------------------------------------- | ------------------- | ----------------- |
| Status               | 200                                      |
| Final URL            | https://vykoupim-nemovitost.cz/reference |
| Redirects            | 0                                        |
| X-Robots-Tag noindex | No                                       |
| Meta robots noindex  | No                                       |
| Canonical            | https://vykoupim-nemovitost.cz/reference |
| Canonical correct    | ✅                                       |
| Content size         | 55,936 bytes                             |
| Has content          | ✅                                       |
| Title                | Reference                                | Vykoupím nemovitost | Výkup nemovitostí |
| H1                   | Reference                                |

### ✅ https://vykoupim-nemovitost.cz/kraje

| Check                | Value                                         |
| -------------------- | --------------------------------------------- | ---------------------- | ----------------- |
| Status               | 200                                           |
| Final URL            | https://vykoupim-nemovitost.cz/kraje          |
| Redirects            | 0                                             |
| X-Robots-Tag noindex | No                                            |
| Meta robots noindex  | No                                            |
| Canonical            | https://vykoupim-nemovitost.cz/kraje          |
| Canonical correct    | ✅                                            |
| Content size         | 101,311 bytes                                 |
| Has content          | ✅                                            |
| Title                | Výkup nemovitostí ve všech krajích ČR         | vykoupim-nemovitost.cz | Výkup nemovitostí |
| H1                   | Kde působíme - výkup nemovitostí v krajích ČR |

### ❌ https://vykoupim-nemovitost.cz/o-nas

| Check                | Value                                |
| -------------------- | ------------------------------------ |
| Status               | 404                                  |
| Final URL            | https://vykoupim-nemovitost.cz/o-nas |
| Redirects            | 0                                    |
| X-Robots-Tag noindex | No                                   |
| Meta robots noindex  | ⚠️ YES                               |
| Canonical            | ❌ Missing                           |
| Canonical correct    | N/A                                  |
| Content size         | 46,274 bytes                         |
| Has content          | ✅                                   |
| Title                | Výkup nemovitostí                    |
| H1                   | Stránka nenalezena                   |

**Issues:**

- 🔴 HTTP 404 (expected 200)
- 🔴 <meta robots> contains noindex: "noindex"

### ❌ https://vykoupim-nemovitost.cz/vzor-smlouvy

| Check                | Value                                       |
| -------------------- | ------------------------------------------- |
| Status               | 404                                         |
| Final URL            | https://vykoupim-nemovitost.cz/vzor-smlouvy |
| Redirects            | 0                                           |
| X-Robots-Tag noindex | No                                          |
| Meta robots noindex  | ⚠️ YES                                      |
| Canonical            | ❌ Missing                                  |
| Canonical correct    | N/A                                         |
| Content size         | 46,281 bytes                                |
| Has content          | ✅                                          |
| Title                | Výkup nemovitostí                           |
| H1                   | Stránka nenalezena                          |

**Issues:**

- 🔴 HTTP 404 (expected 200)
- 🔴 <meta robots> contains noindex: "noindex"

## robots.txt

```
User-Agent: *
Allow: /
Disallow: /api/

Sitemap: https://vykoupim-nemovitost.cz/sitemap.xml
Sitemap: https://vykoupim-nemovitost.cz/image-sitemap.xml

```

✅ No blanket Disallow found.

## Middleware Analysis

The middleware in `src/middleware.ts` was reviewed:

- ✅ No user-agent blocking — Googlebot is not filtered
- ✅ Regional paths (e.g., /praha) redirect to subdomains via single-hop 301 (by design)
- ✅ No redirect loops detected
- ✅ No `X-Robots-Tag: noindex` injected by middleware
- ℹ️ PPC path (/ppc) gets `x-layout-stripped: 1` header (no SEO impact)

✅ No multi-hop redirect chains detected.
