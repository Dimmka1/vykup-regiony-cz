# AI Overview Optimization — Design

**Status:** Approved by owner 2026-05-01
**Approach:** "Informational Authority + Schema Foundation" (modified Approach B)
**Goal:** Maximize odds of being cited by Google AI Overview / AI Mode for top intent queries (`výkup bytu v exekuci`, `odkup bytů`, `vykup nemovitosti v drazbe`, `výkup domu v exekuci`, `postup výkupu nemovitosti`, etc.) **without exposing personal owner data, IČO, or fabricating reviews.**

## Constraints (hard)

- **No Person schema with real founder name/photo/bio** — owner is a private individual.
- **No IČO, no Czech business-register references** — owner is a fyzická osoba, not a registered entity.
- **No fabricated testimonials, reviews, or AggregateRating** — see `feedback_no_fake_testimonials.md` user memory.
- **No fake images of "satisfied customers"** — see `feedback_image_realism.md`.
- **Czech only (cs)** — Russian not introduced.

## Strategic angle

The competitors (ČMRF, navykup.cz, vykup-nemovitosti.cz, mmreality, remaxdelux) **have no comprehensive schema markup, no Speakable, no llms.txt, no Tier-1 citation density**. Our existing baseline (Service / HowTo / FAQ / Article / Organization / CollectionPage) already exceeds them. The gap is **content extractability** for AI engines and **brand-as-entity authority** without personal data.

Three pillars:

1. **Brand-as-entity authority.** Organization schema gets richer (address as country-only, contactPoint, areaServed all 14 regions, knowsAbout, brand, slogan, sameAs). Methodology page replaces "founder credentials". Editorial-standards page replaces "author bios". Tier-1 citation density makes the *content* the authority, not the author.
2. **AI-extractable answer architecture.** Quick Answer block (134–167 words, self-contained, semantic-triple structure) at the top of every priority page. Speakable schema points AI engines directly at the extractable section. FAQ expansion to 8+ items per use-case page.
3. **Technical AI-discoverability.** `llms.txt` + explicit AI-crawler allowlist in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, etc.). BreadcrumbList universally. ImageObject for hero/inline illustrations. WebSite with potentialAction (sitelinks searchbox). All content surfaces a visible "Last updated" date.

## What changes (concrete)

### A. Schema layer

| Change | Where | Why |
|---|---|---|
| **Speakable schema** added to top-30 pages | inline JSON-LD via reusable helper | Tells Google AI / Assistant which paragraph to extract |
| **WebSite schema** with SearchAction | new `<SiteJsonLd />` rendered from root layout | Sitelinks searchbox + brand entity baseline |
| **Organization schema** enriched (knowsAbout, slogan, brand, areaServed[], contactPoint, makesOffer) | new `lib/jsonld-org.ts` helper | YMYL trust without personal data |
| **BreadcrumbList** on every content page (including blog) | audit + fill gaps | Currently inconsistent |
| **ImageObject** schema on hero/inline images via `next/image` wrapper | new `<JsonLdImage />` | Multimodal +156% citation rate |
| **HowTo schema** enriched (estimatedCost, supply, totalTime, tool) | `jak-to-funguje` already partial — extend | Richer extraction signal |
| **Service schema** enriched (areaServed=all 14, hoursAvailable, offers, audience) | extend `geo-service-jsonld.tsx` and root use-case pages | Full Service-type completeness |
| **FAQPage** expansion to 8+ items per use-case page | each `vykup-*` page | More answer surface for AI to cite |
| **Article schema** enriched (image, mainEntityOfPage, articleSection, wordCount, dateModified) | `blog/[slug]/page.tsx` | NewsArticle-grade signal for blog |
| **DefinedTerm / DefinedTermSet** for glossary | new `/slovnik-pojmu` page | Entity density boost |
| **No** Person schema, **no** Review schema, **no** AggregateRating | per constraints | — |

### B. Content layer (priority page rewrites)

For each page in the priority list:
1. **Quick Answer block** (134–167 words) directly under H1, before any other section. Self-contained — no pronouns referencing earlier content, no forward references. Uses semantic triples (subject–predicate–object): "Výkup nemovitosti je rychlý prodej... Cena se pohybuje 80–90 % tržní hodnoty... Proces trvá 7–14 dnů..."
2. **Tier-1 inline citations** — every factual claim links to `cuzk.cz` (Cadastral Office), `financnisprava.cz` (Tax Administration), `mfcr.cz` (Ministry of Finance), `czso.cz` (Statistical Office), `justice.cz` (court registry), `cnb.cz` (Czech National Bank), `exekutorskakomora.cz` (Chamber of Executors), `cak.cz` (Bar Association). Implemented as a typed citation registry (`lib/external-sources.ts`) so links stay consistent.
3. **Visible "Aktualizováno" date** at top of every content page, derived from a per-page `lastModified` constant (no faking — uses real edit timestamps).
4. **FAQ expansion** to 8+ items per use-case page (currently 3–7), with **semantic-triple phrasing** answers.
5. **Glossary cross-links** — every legal/technical term (`exekuce`, `dražba`, `věcné břemeno`, `advokátní úschova`, `katastr nemovitostí`, `kupní smlouva`, `vklad do katastru`, `LV`, `PENB`) links once on first mention to the new glossary page.

**Priority pages (highest-impact, sorted by GSC impressions):**

1. `/blog/vykup-v-exekuci` (296 imp, 0 clicks)
2. `/vykup-pri-exekuci` (274 imp)
3. `/vykup-bytu` (263 imp)
4. `/blog/vykup-vs-drazba` (151 imp)
5. `/jak-to-funguje` (43 imp + already targeted in past commit)
6. `/blog/jak-rychle-prodat-nemovitost` (29 imp)
7. `/blog/vykup-krok-za-krokem` (28 imp)
8. `/vykup-spoluvlastnickeho-podilu` (26 imp)
9. `/vykup-nemovitosti-s-vecnym-bremenem` (23 imp)
10. `/zpetny-najem` (13 imp)
11. `/vykup-domu` (72 imp)
12. `/vykup-pozemku` (12 imp)
13. `/vykup-pri-dedictvi` (1 imp — but high topical value)
14. `/vykup-pri-rozvodu` (low GSC but high topical value)
15. `/vykup-nemovitosti-s-hypotekou` (6 imp)
16. `/vykup-cinzovnich-domu` (1 imp)
17. `/vykup-v-drazbe` (already has, just finished image-sitemap)
18. `/caste-dotazy` (6 imp)
19. `/o-nas` (1 imp)
20. `/` homepage (national + 14 regional variants)

### C. New pages

1. **`/jak-stanovujeme-cenu`** ("Methodology") — How we calculate the offer (80–90% of market value). Replaces the "founder credentials" trust signal with a transparent process. Includes:
   - Inputs we use (cadastral data, regional price index, condition, legal status)
   - Step-by-step calculation example
   - When the offer goes lower (80%) vs higher (90%)
   - Citations to `cuzk.cz`, `czso.cz`
   - **HowTo schema** + Speakable for the example calculation

2. **`/redakcni-zasady`** ("Editorial standards") — How we write, source, fact-check and update content. Includes:
   - Sources we cite (Tier-1 list)
   - Update cadence (we record dateModified on every page)
   - Correction policy
   - **Schema:** `WebPage` + Speakable

3. **`/slovnik-pojmu`** ("Glossary") — 30+ terms used in real estate buyout, each with definition + Tier-1 source link. Schema: `DefinedTermSet` containing `DefinedTerm` items. This is the **entity density / Knowledge Graph** play — explicit entity disambiguation signals to Gemini/AI Overview.

4. **`/zdroje-a-citace`** ("Sources") — Curated catalog of Czech government and legal sources, with one paragraph each explaining how they apply to property buyout. Pure Tier-1 outbound link concentration. Schema: `WebPage` + `ItemList` of cited sources.

### D. AI crawler discoverability

1. **`/llms.txt`** — minimal, well-curated index of the site (key pages, what each is for) per the [llmstxt.org](https://llmstxt.org) spec. Implemented as a Next.js route handler (`src/app/llms.txt/route.ts`) so it's dynamic.
2. **`/llms-full.txt`** — full markdown content of priority pages concatenated, route-handler-generated from a manifest.
3. **`robots.ts`** updated with explicit `User-Agent` blocks for each major AI crawler (allow), keeping `*` rules unchanged. Blocks include: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `GoogleOther`, `Bingbot`, `Applebot-Extended`, `cohere-ai`, `Bytespider`, `Meta-ExternalAgent`, `Amazonbot`, `mistralai-User`. Sitemap unchanged (still `sitemap.xml`).

### E. Performance / Core Web Vitals

Out of scope for this design doc. Will spawn a follow-up task if FCP audits show issues post-implementation.

## Out of scope (deferred / declined)

- **Person schema** — declined by owner.
- **Review / AggregateRating schema** — declined (no fake reviews; no Google Business profile to pull from yet).
- **Video content** — deferred (would require production capacity).
- **Press / PR outreach** — out of code scope.
- **Original research reports (price index)** — deferred phase 2.
- **Russian language version** — out of scope.

## Build sequence (10 phases)

1. **Foundation libs** — `lib/external-sources.ts`, `lib/jsonld-org.ts`, `lib/jsonld-speakable.ts`, `lib/jsonld-website.ts`, `lib/last-updated.ts`, plus tests.
2. **`<SiteJsonLd />` + enriched Organization** in root layout (renders WebSite + Organization site-wide).
3. **Quick Answer block component** (`components/quick-answer.tsx`) with Speakable schema integration. Reusable across all priority pages.
4. **`<LastUpdated />` component** + per-page `LAST_UPDATED` constants.
5. **`/llms.txt` + `/llms-full.txt` route handlers** + manifest.
6. **`robots.ts`** — AI crawler allowlist.
7. **New page: `/slovnik-pojmu`** (Glossary with `DefinedTermSet`).
8. **New page: `/jak-stanovujeme-cenu`** (Methodology with HowTo + Speakable).
9. **New page: `/redakcni-zasady`** (Editorial standards).
10. **New page: `/zdroje-a-citace`** (Sources).
11. **Page rewrites — top 5 priority pages** (Quick Answer + citations + FAQ expansion + LastUpdated + Speakable):
    - `/blog/vykup-v-exekuci`
    - `/vykup-pri-exekuci`
    - `/vykup-bytu`
    - `/blog/vykup-vs-drazba`
    - `/jak-to-funguje`
12. **Page rewrites — next 10 pages** (same pattern).
13. **Sitemap update** (add new pages to `sitemap-core.xml`).
14. **Schema validation** (run `npm run validate:jsonld` over key URLs in dev mode).
15. **CI / build verification.**

## Success criteria (post-deploy, 90 days)

- All new schema types validate clean in Google Rich Results Test.
- `npm run ci` passes; no test regressions.
- GSC: at least one priority page reaches **top-10** for a head intent query (e.g. `výkup bytu v exekuci`).
- AI Overview citation observed for at least one priority query (manual checks weekly).
- `/llms.txt` returns 200 from production with valid format.

## Risks & mitigations

- **Risk:** Adding new pages dilutes link equity. **Mitigation:** Each new page is genuinely useful (not thin), heavily linked from priority pages, included in sitemap, allowed in robots.
- **Risk:** Visible "Aktualizováno" dates become stale. **Mitigation:** `LAST_UPDATED` constants live next to the page, update with each touch; CI gate could flag dates >12 months old in a future iteration.
- **Risk:** Schema bloat hurts performance. **Mitigation:** All JSON-LD blocks are inline `<script>` in HTML head; total payload measured. If problematic, move to single combined JSON-LD per page.
- **Risk:** AI bot allowlist invites scrapers. **Mitigation:** This is intentional — we *want* to be in their training/retrieval data. No private content exists on this site.
