# IMAGE_RESEARCH.md — VR-048

> Research report: Landing page imagery for maximum conversion (property seller lead gen)
> Date: 2026-02-27 | Constraint: NO people in images

---

## 1. Executive Summary

High-converting "we buy houses" landing pages use a surprisingly narrow set of image types. After analyzing UK market leaders (WebuyAnyHouse, PropertyRescue, WeBuyAnyHome), Czech portals (Sreality, Bezrealitky, Maxima Reality), and conversion research from Carrot (the dominant US platform for real estate investor sites), the findings are clear:

**Key takeaways:**

- **Hero imagery matters most** — it sets trust and emotional tone in <3 seconds
- **Buildings/exteriors are the #1 image type** across all "we buy" sites — they signal "we deal with real property"
- **Warm, golden-hour lighting** universally outperforms cold/clinical photography
- **Blue + white + green color schemes** dominate trusted property buyer sites (trust + calm + growth)
- **Simplicity wins** — the highest-converting pages use 3-5 images total, not galleries
- **No people needed** — competitor analysis confirms most high-converting property buyer sites avoid human figures entirely, focusing on homes and abstract trust symbols

For AI generation: Gemini produces best photorealism when prompted with narrative descriptions including camera specs, lighting conditions, and real-world imperfections.

---

## 2. Conversion Psychology Findings

### 2.1 What Motivates Property Sellers to Act

Motivated sellers (our target) are driven by:

- **Relief from stress** — they want the problem (the property) handled
- **Speed/urgency** — they need fast resolution (divorce, debt, inheritance, relocation)
- **Trust/safety** — fear of scams is high; they need visual signals of legitimacy
- **Simplicity** — complex-looking pages = "this will be complicated" = bounce

### 2.2 Emotional Triggers in Imagery

| Trigger    | Image Type                                    | Why It Works                         |
| ---------- | --------------------------------------------- | ------------------------------------ |
| **Relief** | Bright, welcoming house exterior              | "Someone will take care of this"     |
| **Trust**  | Clean cityscape, recognizable Czech landmarks | "They're local, they're real"        |
| **Speed**  | Keys on table, sold sign, handshake icon      | "Fast, done, move on"                |
| **Value**  | Well-maintained property exterior             | "They buy real properties, not junk" |
| **Calm**   | Soft-lit interior, tidy living room           | Reduces anxiety about the process    |

### 2.3 Color Psychology for Property Buying Sites

| Color              | Psychology                         | Usage                                             |
| ------------------ | ---------------------------------- | ------------------------------------------------- |
| **Blue** (primary) | Trust, security, professionalism   | Headers, CTAs background, brand                   |
| **Green**          | Growth, money, positive outcome    | Accents, success indicators, "get offer" buttons  |
| **White**          | Clarity, simplicity, cleanliness   | Backgrounds, spacing                              |
| **Orange/Amber**   | Urgency without aggression, warmth | CTA buttons, highlights                           |
| **Red**            | Urgency, action                    | Sparingly — countdown timers, limited offers only |
| **Warm neutrals**  | Comfort, home feeling              | Image tones, backgrounds                          |

**Recommendation for vykup-regiony-cz:** Blue + white primary scheme, green/orange CTAs, warm golden tones in photography.

---

## 3. Competitor Image Audit

### 3.1 UK "We Buy Houses" Sites

#### WebuyAnyHouse.co.uk

- **Hero:** Clean, professional — no hero photo, relies on brand trust (est. 2008) and simple form
- **Section images:** Step-by-step process icons (form → offer → decision → sale)
- **Trust signals:** Trustpilot widget, "since 2008" badge
- **Key insight:** Minimal imagery, maximum form visibility. The page IS the form.

#### PropertyRescue.co.uk

- **Hero:** Tagline "Get that 'just sold' feeling" — emotional framing
- **Section images:** Process step icons, regulatory badges (NAPB, Property Ombudsman, FCA)
- **Image style:** Clean vector icons for process, no property photos on landing page
- **Key insight:** Trust badges and regulatory credentials replace property imagery

#### WeBuyAnyHome.com

- **Pattern:** Similar to above — process-focused, icon-driven, form-centric
- **Images:** Minimal — primarily brand identity and trust logos

### 3.2 Czech Real Estate Portals

#### Sreality.cz / Bezrealitky.cz

- **Style:** Property listing focus — grid of property thumbnails
- **Image types:** Exterior shots, interior rooms, floor plans
- **Not directly comparable** — these are marketplaces, not buyer landing pages

#### Maxima Reality / M&M Reality / RE/MAX.cz

- **Hero:** Large property exterior or cityscape photography
- **Style:** Professional, slightly corporate, blue-dominant color schemes
- **Images:** Mix of property exteriors, office/brand imagery
- **Key insight:** Czech market expects to see real buildings — abstract imagery feels untrustworthy

### 3.3 Image Pattern Summary

| Pattern                          | Frequency                  | Conversion Impact             |
| -------------------------------- | -------------------------- | ----------------------------- |
| Simple lead form above fold      | Universal                  | Critical                      |
| Process step icons/illustrations | Very high                  | High (reduces uncertainty)    |
| Property exterior photos         | High (Czech) / Medium (UK) | High for Czech market         |
| Trust badges/regulatory logos    | Very high                  | High                          |
| Cityscape/neighborhood shots     | Medium                     | Medium (localizes trust)      |
| Keys/sold signs                  | Medium                     | Medium (completion symbolism) |
| Interior shots                   | Low on landing pages       | Low (better for listings)     |
| People/agents                    | Low                        | N/A (excluded by constraint)  |

---

## 4. Gemini Prompt Engineering Guide

### 4.1 Core Principles (from Google's official guide)

> "Describe the scene, don't just list keywords. A narrative, descriptive paragraph will almost always produce a better, more coherent image than a simple list of disconnected words."

### 4.2 Photorealism Template

```
A photorealistic [shot type] of [subject], [state/condition], set in [environment].
The scene is illuminated by [lighting description], creating a [mood] atmosphere.
Captured with a [camera/lens details], emphasizing [key textures and details].
The image should be in a [aspect ratio] format.
```

### 4.3 Key Parameters for Photorealism

| Parameter           | Best Values                                                              | Why                                              |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------ |
| **Camera**          | Canon EOS R5, Sony A7IV, Nikon Z8                                        | Real camera names trigger photo-trained patterns |
| **Lens**            | 24mm (wide/architecture), 35mm (street), 50mm (natural), 85mm (portrait) | Defines perspective and DOF                      |
| **Aperture**        | f/2.8 (shallow DOF), f/8 (sharp landscape), f/11 (architecture)          | Controls bokeh vs sharpness                      |
| **Lighting**        | "golden hour sunlight", "soft overcast", "natural window light"          | Golden hour = most flattering                    |
| **Film/processing** | "slight film grain", "Fujifilm color science", "natural color grading"   | Avoids AI's too-clean look                       |
| **Imperfections**   | "subtle lens distortion", "natural grain", "realistic shadows"           | Critical for avoiding AI look                    |

### 4.4 Anti-AI-Artifact Techniques

Things that make AI images look fake and how to counter them:

| AI Artifact                 | Fix in Prompt                                                                     |
| --------------------------- | --------------------------------------------------------------------------------- |
| Too smooth/plastic surfaces | Add "natural texture", "visible grain", "authentic material wear"                 |
| Unrealistic lighting        | Specify single light source direction: "late afternoon sun from the left"         |
| Over-saturated colors       | Add "natural color palette", "muted tones", "Fujifilm color science"              |
| Impossible geometry         | Be specific about architecture: "Czech baroque facade", "panel house (panelák)"   |
| Generic/nowhere look        | Add Czech-specific details: "Prague cobblestones", "Czech village", "tram tracks" |
| Too perfect symmetry        | Add "slight natural asymmetry", "organic composition"                             |

### 4.5 Prompt Examples for Our Use Case

#### Hero — Czech House Exterior (Golden Hour)

```
A photorealistic wide-angle photograph of a well-maintained Czech family house
with a red-tile roof and light plaster walls, set on a quiet residential street
in a Czech town. Late afternoon golden hour sunlight casts long warm shadows
across the facade. A small garden with a wooden fence is visible. The scene
feels calm and inviting. Shot on Canon EOS R5 with a 24mm lens at f/8,
natural color grading with slight warmth. No people visible. 16:9 format.
```

#### Section Break — Keys on Table

```
A photorealistic overhead photograph of a set of house keys on a brass keyring,
resting on a clean wooden table next to a signed document. Soft natural window
light from the left creates gentle shadows. The composition is clean and
minimal. Shot on Sony A7IV with a 50mm lens at f/2.8, shallow depth of field
blurring the document slightly. Warm, natural color tones. No people visible.
3:2 format.
```

#### Trust Section — Prague Cityscape

```
A photorealistic photograph of Prague's residential neighborhood with typical
Czech panel houses (paneláky) and mature trees, taken from street level on a
clear autumn day. Golden light illuminates the buildings. A tram line is
visible in the distance. The scene conveys familiarity and everyday Czech
life. Shot on Nikon Z8 with a 35mm lens at f/5.6, natural color processing
with slight film grain. No people visible. 16:9 format.
```

#### Background — Abstract Property Texture

```
A photorealistic close-up of aged Czech brick wall texture with weathered
mortar joints, partially covered by a thin ivy vine. Soft diffused overcast
light. The image conveys history and solidity. Shot on Canon EOS R5 with a
100mm macro lens at f/4. Natural tones, slight desaturation. Can be used as
a subtle background texture. Square format.
```

### 4.6 Gemini-Specific Tips

1. **Use narrative descriptions** — Gemini 2.5 Flash responds better to paragraphs than keyword lists
2. **Specify "photorealistic" explicitly** — triggers the right generation mode
3. **Include aspect ratio** — "16:9 format", "vertical portrait orientation", "square format"
4. **Iterate conversationally** — Gemini supports multi-turn refinement ("make the lighting warmer", "shift to wider angle")
5. **Add Czech-specific details** — panelák, red tile roof, cobblestones, tram — grounds images in reality
6. **End with "No people visible"** — explicit exclusion is more reliable than hoping

---

## 5. Visual Placement Strategy

### 5.1 Landing Page Image Map

```
┌─────────────────────────────────────────┐
│  HERO SECTION (above fold)              │
│  ┌─────────────────────┬───────────────┐│
│  │ Hero Image          │ Lead Form     ││
│  │ (Czech house,       │ (3-4 fields)  ││
│  │  golden hour,       │               ││
│  │  warm & inviting)   │ [CTA Button]  ││
│  │  16:9, full-width   │               ││
│  └─────────────────────┴───────────────┘│
├─────────────────────────────────────────┤
│  TRUST BAR                              │
│  [★★★★★ reviews] [Badge] [Badge] [#]   │
│  (no images — logos/icons only)         │
├─────────────────────────────────────────┤
│  HOW IT WORKS (3 steps)                │
│  [Icon 1]──→[Icon 2]──→[Icon 3]       │
│  Form → Offer → Sale                   │
│  (vector icons, not photos)            │
├─────────────────────────────────────────┤
│  SECTION IMAGE BREAK                    │
│  (Keys on table OR Prague cityscape)   │
│  Full-width, 21:9 cinematic ratio      │
│  Creates breathing room + emotion      │
├─────────────────────────────────────────┤
│  BENEFITS / WHY US                      │
│  Text-heavy section with small         │
│  accent images (house detail shots)    │
├─────────────────────────────────────────┤
│  SECOND FORM / CTA                      │
│  Background: subtle texture image      │
│  (brick wall / plaster texture)        │
│  with dark overlay + white text        │
├─────────────────────────────────────────┤
│  FOOTER                                │
│  (no significant images)               │
└─────────────────────────────────────────┘
```

### 5.2 Image Specifications

| Placement          | Aspect Ratio | Size (px) | Format       | Purpose                            |
| ------------------ | ------------ | --------- | ------------ | ---------------------------------- |
| Hero               | 16:9         | 1920×1080 | WebP/JPEG    | Emotional anchor, first impression |
| Section break      | 21:9         | 1920×823  | WebP/JPEG    | Visual breathing room              |
| Accent (inline)    | 3:2          | 800×533   | WebP         | Support text points                |
| Background texture | 1:1          | 1200×1200 | WebP (tiled) | Subtle depth, premium feel         |
| Process icons      | 1:1          | 200×200   | SVG/PNG      | Clarity, speed                     |
| Mobile hero        | 4:3          | 1200×900  | WebP/JPEG    | Mobile-first crop                  |

### 5.3 Performance Rules

- All images **WebP** with JPEG fallback
- Hero image **< 150KB** (compressed)
- Lazy-load everything below fold
- Use `srcset` for responsive serving
- Blur placeholder (LQIP) for perceived speed

---

## 6. Recommended Image Types (Ranked by Conversion Impact)

### Tier 1 — Critical (must have)

| #   | Image Type                                           | Placement    | Why                                                                                                                                       |
| --- | ---------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Czech family house exterior, golden hour**         | Hero         | Sets trust, locality, and warmth instantly. This is what the seller owns — seeing a similar house triggers "they understand my situation" |
| 2   | **Process step icons** (3-step: form → offer → sale) | How It Works | Reduces uncertainty, shows simplicity. Vector/SVG, not AI photos                                                                          |
| 3   | **Trust badges / regulatory logos**                  | Trust bar    | Social proof. Use real logos (Google reviews, any Czech property associations)                                                            |

### Tier 2 — High Impact (strongly recommended)

| #   | Image Type                                    | Placement        | Why                                                       |
| --- | --------------------------------------------- | ---------------- | --------------------------------------------------------- |
| 4   | **Keys on table / "sold" concept**            | Section break    | Symbolizes completion, triggers desired end-state         |
| 5   | **Czech residential neighborhood**            | Benefits section | Grounds the service in reality, shows "we buy everywhere" |
| 6   | **Subtle texture background** (brick/plaster) | CTA section      | Adds premium feel without distraction                     |

### Tier 3 — Nice to Have (for A/B testing)

| #   | Image Type                                    | Placement           | Why                                |
| --- | --------------------------------------------- | ------------------- | ---------------------------------- |
| 7   | **Prague/regional city skyline**              | Section break alt   | For region-specific landing pages  |
| 8   | **Document/contract close-up**                | Trust section       | "Professional, legitimate process" |
| 9   | **Seasonal variants** of hero (spring/autumn) | Hero A/B            | Match current season for realism   |
| 10  | **Interior — bright, clean room**             | Testimonial section | Optional warm accent               |

### What NOT to Use

- ❌ Stock-looking generic houses (American suburbia)
- ❌ People, hands, faces (constraint + trust risk with AI)
- ❌ Overly perfect/luxurious interiors (seller thinks "not my house")
- ❌ Dark/moody photography (triggers anxiety, not relief)
- ❌ Abstract graphics or illustrations (Czech market expects "real")
- ❌ Before/after renovation photos (implies we only buy damaged property)
- ❌ Money/cash imagery (looks scammy)

---

## Appendix: Quick Reference for Image Generation Sprint

When generating images, create these in order:

1. **3 hero variants** — Czech house, different styles (rodinný dům, panelák, starší vila), all golden hour
2. **1 keys-on-table** — overhead, clean, warm
3. **1 Prague neighborhood** — street-level, autumn/spring
4. **2 texture backgrounds** — brick, plaster
5. **1 regional variant** — Brno/Ostrava/Olomouc for regional pages

Total: **8 AI-generated images** for MVP, expandable to 15+ for regional variants.

---

_Report prepared for VR-048. Ready for Analyst and PM to create exact generation specs._
