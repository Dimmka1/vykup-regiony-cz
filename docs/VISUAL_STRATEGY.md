# VISUAL_STRATEGY.md — VR-049

> Visual strategy for vykup-regiony-cz landing page
> Date: 2026-02-27 | Analyst: VR-049

---

## 1. Current State Assessment

### What's Working (KEEP)

- **hero-prague.jpg** — Real photo of Prague skyline, unmistakably Czech, good quality. Works for Prague region.
- **property-exterior.jpg** — Czech residential street with tram tracks, functionalist buildings + villas. Authentic, no people.
- **happy-family-home.jpg** — Modern Czech house exterior, autumn golden light, no people. Strong hero candidate.
- **testimonial-bg.jpg** — Prague sunset panorama, atmospheric. Works as background.
- **14 regional hero images** (hero-\*.jpg) — Region-specific heroes for each kraj. Concept correct, need WebP conversion.

### What's Broken (REPLACE/REMOVE)

- **office-team.jpg** → ❌ 4 people with faces. Violates NO PEOPLE constraint. Used in "O nás" section.
- **consultation.jpg** → ❌ 2 people with faces. Violates constraint. Used in "Jak to funguje" step images.
- **handshake-deal.jpg** → ❌ Hands visible. Violates constraint. Used in Lead Form section.
- **keys-handover.jpg** → ❌ Two hands exchanging keys. Violates constraint. Used in "Jak to funguje".
- **document-signing.jpg** → ❌ Hands visible. Violates constraint. Used in "Jak to funguje".
- **about-team.jpg** → ❌ Contains people (high-five). Violates constraint.

### Summary

**6 of 10 non-hero images violate the NO PEOPLE rule.** These are in high-visibility sections (process steps, about, lead form). Must be replaced immediately.

---

## 2. Visual Strategy Matrix

| Rank | Image                                                | Section                                  | Emotional Trigger                      | Conversion Goal                              | Priority    | Status                                                        |
| ---- | ---------------------------------------------------- | ---------------------------------------- | -------------------------------------- | -------------------------------------------- | ----------- | ------------------------------------------------------------- |
| 1    | Czech family house, golden hour                      | **Hero** (main/regional)                 | Relief + "they understand my property" | First impression → scroll to form            | 🔴 Critical | KEEP `happy-family-home.jpg` as default; regional heroes stay |
| 2    | Keys on wooden table (no hands)                      | **Jak to funguje** — Step 4 "Předání"    | Completion, resolution                 | Visualize the end-state → motivate form fill | 🔴 Critical | GENERATE — replace `keys-handover.jpg`                        |
| 3    | Signed contract overhead (no hands)                  | **Jak to funguje** — Step 3 "Smlouva"    | Professionalism, legitimacy            | Trust the process → reduce fear              | 🔴 Critical | GENERATE — replace `document-signing.jpg`                     |
| 4    | Czech office interior (empty, warm)                  | **Jak to funguje** — Step 1 "Konzultace" | Trust, professionalism                 | "Real company, real office"                  | 🔴 Critical | GENERATE — replace `consultation.jpg`                         |
| 5    | Czech residential neighborhood                       | **O nás** section                        | Locality, trust                        | "We're local, we know Czech properties"      | 🟡 High     | KEEP `property-exterior.jpg` — move here                      |
| 6    | Property valuation concept (house model + documents) | **Jak to funguje** — Step 2 "Ocenění"    | Transparency, fairness                 | "Fair valuation process"                     | 🟡 High     | GENERATE — new image for step 2                               |
| 7    | Prague sunset panorama                               | **Testimonials** background              | Warmth, Czech identity                 | Emotional anchor for social proof            | 🟢 Medium   | KEEP `testimonial-bg.jpg`                                     |
| 8    | Subtle brick/plaster texture                         | **Lead Form** section background         | Premium feel, solidity                 | Elevate form area → encourage completion     | 🟢 Medium   | GENERATE — replace `handshake-deal.jpg`                       |
| 9    | Czech building facade (warm)                         | **O nás** — replace team photo           | Trust, authenticity, Czech identity    | "We are a real local company"                | 🟡 High     | GENERATE — replace `office-team.jpg`                          |

**Total: 9 images** (within 8-10 target)

---

## 3. Images to Generate

### IMG-1: Keys on Table (no hands)

- **Section:** Jak to funguje — Step 4
- **Prompt direction:** Overhead shot of house keys on brass keyring, resting on clean oak table next to a signed document with a Czech stamp visible. Soft window light from left. No people/hands. 50mm f/2.8 shallow DOF. Warm tones.
- **Specs:** 800×533px (3:2), WebP, <80KB
- **Replaces:** `keys-handover.jpg`

### IMG-2: Signed Contract (no hands)

- **Section:** Jak to funguje — Step 3
- **Prompt direction:** Overhead shot of signed contract on wooden desk with fountain pen resting beside it, small Czech flag pin as paperweight, brass desk lamp out of focus. No people/hands. Natural light. 50mm f/4.
- **Specs:** 800×533px (3:2), WebP, <80KB
- **Replaces:** `document-signing.jpg`

### IMG-3: Czech Office Interior (empty)

- **Section:** Jak to funguje — Step 1
- **Prompt direction:** Warm Czech office interior — wooden beamed ceiling, tidy desk with laptop and documents, window showing Prague/Czech architecture outside. Morning light. No people. 24mm f/5.6 wide.
- **Specs:** 800×533px (3:2), WebP, <80KB
- **Replaces:** `consultation.jpg`

### IMG-4: Property Valuation Concept

- **Section:** Jak to funguje — Step 2
- **Prompt direction:** Overhead shot of property documents spread on table — floorplan blueprint, calculator, measuring tape, pen on notepad with numbers. Clean, organized desk. No people. Soft light. 35mm f/4.
- **Specs:** 800×533px (3:2), WebP, <80KB
- **Replaces:** N/A (new; current step 2 uses only icons)

### IMG-5: Brick/Plaster Texture Background

- **Section:** Lead Form section background (with dark overlay)
- **Prompt direction:** Close-up of aged Czech brick wall with weathered mortar, partial ivy. Overcast diffused light. Natural tones, slight desaturation. Macro 100mm f/4. Tileable.
- **Specs:** 1200×1200px (1:1), WebP, <100KB
- **Replaces:** `handshake-deal.jpg`

### IMG-6: Czech Building Facade

- **Section:** O nás — replace team photo
- **Prompt direction:** Czech townhouse facade with ornate plasterwork, warm stone color, window boxes with flowers, golden hour light from side. Street-level, 35mm f/5.6. No people.
- **Specs:** 800×600px (4:3), WebP, <80KB
- **Replaces:** `office-team.jpg`

---

## 4. Images to Remove

| File                   | Size  | Reason               | Used In               |
| ---------------------- | ----- | -------------------- | --------------------- |
| `office-team.jpg`      | 883KB | 4 people with faces  | O nás section         |
| `consultation.jpg`     | 749KB | 2 people with faces  | Jak to funguje step 1 |
| `handshake-deal.jpg`   | 697KB | Hands visible        | Lead Form section     |
| `keys-handover.jpg`    | 648KB | Hands visible        | Jak to funguje step 4 |
| `document-signing.jpg` | 696KB | Hands visible        | Jak to funguje step 3 |
| `about-team.jpg`       | 81KB  | 2 people high-fiving | Unclear usage         |

**Total removed:** 6 images (~3.7MB freed)

---

## 5. Implementation Notes

### Sizing & Format

- All new images: **WebP** primary, JPEG fallback via Next.js `Image` component
- Hero images: 1920×1080 → serve via `srcset` at 640/1024/1920px breakpoints
- Section images (process steps): 800×533 base, serve at 400/800px
- Background textures: 1200×1200, CSS `background-size: cover` with dark overlay `rgba(0,0,0,0.6)`
- Target: hero <150KB, section images <80KB, textures <100KB

### Lazy Loading

- Hero image: **eager** load (`priority` prop in Next.js Image — LCP candidate)
- All other images: `loading="lazy"` (Next.js default for non-priority)
- Use `placeholder="blur"` with `blurDataURL` for LQIP effect

### Responsive Strategy

- Hero: 16:9 desktop → 4:3 mobile crop (use `object-position: center`)
- Process step images: stack vertically on mobile, reduce to 400px width
- Background texture: CSS handles scaling, no separate variant needed

### Performance Budget

- Current total non-hero image weight: ~5.5MB → Target: <800KB after WebP conversion + replacements
- Convert all existing JPEG keepers to WebP (save ~30-40%)
- Consider AVIF for modern browsers (even smaller)

### Regional Hero Images

- Keep all 14 `hero-*.jpg` files — correct concept
- Need separate quality audit — check for people violations, Czech authenticity, golden hour consistency
- Convert to WebP, target <120KB each

---

_Strategy ready for image generation sprint. 6 images to generate, 6 to remove, 3 to keep as-is._
