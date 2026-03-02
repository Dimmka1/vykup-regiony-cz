# VISUAL_SPEC.md — VR-050

> Final visual implementation spec for Developer
> Date: 2026-02-27 | PM: VR-050

---

## 0. Summary

- **Generate:** 6 new images via Gemini API
- **Delete:** 6 images (people/hands violations)
- **Keep:** 4 images (hero-prague.jpg, happy-family-home.jpg, property-exterior.jpg, testimonial-bg.jpg) + 14 regional heroes
- **Total images on page after changes:** 9 (within budget, 0 people violations)

---

## 1. Images to DELETE

```bash
rm public/images/office-team.jpg
rm public/images/consultation.jpg
rm public/images/handshake-deal.jpg
rm public/images/keys-handover.jpg
rm public/images/document-signing.jpg
rm public/images/about-team.jpg
```

## 2. Images to KEEP (no changes)

| File                       | Used In                                          | Notes                                  |
| -------------------------- | ------------------------------------------------ | -------------------------------------- |
| `hero-prague.jpg`          | Hero (Praha region)                              | Keep as-is                             |
| `hero-*.jpg` (14 regional) | Hero (per region)                                | Keep; convert to WebP in separate task |
| `happy-family-home.jpg`    | Visual break before FAQ                          | Keep as-is                             |
| `property-exterior.jpg`    | **Move to O nás section** + keep in visual break | See code changes §4                    |
| `testimonial-bg.jpg`       | Testimonials background                          | Keep as-is                             |

---

## 3. Images to GENERATE

### IMG-1: `process-consultation.webp`

**Section:** Jak to funguje — Row 1 left image (replaces `consultation.jpg`)
**Dimensions:** 800×1067 (3:4 portrait) WebP, target <80KB
**Filename:** `public/images/process-consultation.webp`

**Gemini API Prompt:**

```
A photorealistic wide-angle photograph of a warm, inviting Czech office interior. A tidy wooden desk holds a laptop with its screen facing away, a neat stack of property documents, and a ceramic coffee mug. Behind the desk, a tall window reveals a view of a quiet Czech residential street with functionalist apartment buildings and mature linden trees. Morning golden light streams through the window, casting soft warm shadows across the desk surface. The ceiling has exposed wooden beams painted white, and a small potted plant sits on the windowsill. The room feels professional yet approachable — not corporate. No people visible, no hands visible, no human figures of any kind. Shot on Canon EOS R5 with a 24mm lens at f/5.6, natural color grading with slight warmth, subtle film grain, Fujifilm color science. 3:4 portrait format.
```

**Alt text (Czech):** `Kancelář pro konzultace — teplý interiér s výhledem na českou ulici`

**Acceptance criteria:**

- ✅ No people, hands, or human figures anywhere (including reflections)
- ✅ Recognizably Czech architecture visible through window (not generic)
- ✅ Warm golden morning light, not cold/clinical
- ✅ Desk items are realistic (no impossible geometry)
- ✅ Room feels professional but warm — wooden elements, natural materials
- ❌ FAIL if: people reflections in window/screen, American-style office, fluorescent lighting, over-saturated colors

---

### IMG-2: `process-valuation.webp`

**Section:** Jak to funguje — Row 1 right image (new image for step 2)
**Dimensions:** 800×1067 (3:4 portrait) WebP, target <80KB
**Filename:** `public/images/process-valuation.webp`

**Gemini API Prompt:**

```
A photorealistic overhead photograph of a property valuation workspace on a clean oak desk. Spread across the desk: an unfolded architectural floorplan blueprint of an apartment, a silver calculator showing numbers, a retractable metal measuring tape partially extended, a ballpoint pen resting on a lined notepad with handwritten figures, and a small stack of printed property photos showing a Czech panelák building. The composition is organized and clean, conveying methodical professionalism. Soft diffused natural light from above-left, creating gentle shadows. No people visible, no hands visible, no human figures of any kind. Shot on Sony A7IV with a 35mm lens at f/4, natural color processing with slight warmth, subtle grain. 3:4 portrait format.
```

**Alt text (Czech):** `Ocenění nemovitosti — podklady pro stanovení férové ceny`

**Acceptance criteria:**

- ✅ No people, hands, or human figures
- ✅ Overhead/flat-lay perspective, clean composition
- ✅ Czech context: panelák in property photos, metric measurements
- ✅ Items look realistic — calculator digits legible-looking, pen has natural placement
- ✅ Warm natural tones, not sterile
- ❌ FAIL if: hands visible, American-style house in photos, unrealistic text/numbers, cold blue lighting

---

### IMG-3: `process-contract.webp`

**Section:** Jak to funguje — Row 2 left image (replaces `document-signing.jpg`)
**Dimensions:** 800×1067 (3:4 portrait) WebP, target <80KB
**Filename:** `public/images/process-contract.webp`

**Gemini API Prompt:**

```
A photorealistic overhead photograph of a signed purchase contract lying on a dark walnut desk. The contract is a multi-page printed document with a visible blue ink signature at the bottom and a round red Czech notarial stamp (kulaté razítko). A brass-tipped fountain pen rests diagonally beside the document. A small Czech flag enamel pin serves as a paperweight on the corner. In the soft background, a brass desk lamp is slightly out of focus. Late afternoon natural light from a window on the right creates warm side-lighting with gentle shadows. The scene conveys completion, legitimacy, and professionalism. No people visible, no hands visible, no human figures of any kind. Shot on Canon EOS R5 with a 50mm lens at f/4, natural color grading, slight film grain, warm tones. 3:4 portrait format.
```

**Alt text (Czech):** `Podepsaná kupní smlouva s notářským razítkem`

**Acceptance criteria:**

- ✅ No people, hands, or human figures
- ✅ Czech notarial stamp visible (round, red)
- ✅ Portrait orientation (3:4) — fits the 2-column grid
- ✅ Signature looks like natural handwriting (blue ink)
- ✅ Warm lighting, premium feel
- ❌ FAIL if: hands, English text on document, American legal format, cold lighting

---

### IMG-4: `process-keys.webp`

**Section:** Jak to funguje — Row 2 right image (replaces `keys-handover.jpg`)
**Dimensions:** 800×1067 (3:4 portrait) WebP, target <80KB
**Filename:** `public/images/process-keys.webp`

**Gemini API Prompt:**

```
A photorealistic overhead photograph of a set of house keys on a worn brass keyring, resting on a clean light oak tabletop. Next to the keys lies a folded document with a visible Czech stamp and a small "PRODÁNO" (sold) sticker in red and white. A shaft of late afternoon golden sunlight falls diagonally across the table, creating warm highlights on the brass keys and soft shadows. The composition is minimal and clean — just the keys, document, and empty table space. The image conveys finality, relief, and a fresh start. No people visible, no hands visible, no human figures of any kind. Shot on Sony A7IV with a 50mm lens at f/2.8, shallow depth of field softly blurring the document edges, natural warm color tones, slight film grain. 3:4 portrait format.
```

**Alt text (Czech):** `Klíče od prodané nemovitosti na stole — úspěšný výkup`

**Acceptance criteria:**

- ✅ No people, hands, or human figures
- ✅ Keys are the clear focal point — brass, realistic wear
- ✅ "PRODÁNO" text visible (or at minimum a red stamp/sticker suggesting "sold")
- ✅ Shallow DOF — document slightly blurred, keys sharp
- ✅ Golden warm lighting, relief/completion mood
- ❌ FAIL if: hands, American-style "SOLD" sign, cold lighting, keys look plastic/fake

---

### IMG-5: `texture-brick.webp`

**Section:** Lead Form section — image in "Co se stane po odeslání" card with dark overlay (replaces `handshake-deal.jpg`)
**Dimensions:** 1200×1200 (1:1 square) WebP, target <100KB
**Filename:** `public/images/texture-brick.webp`

**Gemini API Prompt:**

```
A photorealistic close-up photograph of an aged Czech brick wall. The bricks are a warm terracotta-orange color with weathered, slightly crumbling mortar joints in pale grey. A thin ivy vine with small green leaves creeps across the lower-right corner. The wall surface shows authentic wear — minor chips, slight color variation between bricks, natural patina from decades of Czech weather. Soft diffused overcast light illuminates the wall evenly with no harsh shadows, creating a texture that works as a seamless background. The image conveys solidity, history, and permanence. No people visible, no hands visible, no human figures of any kind. Shot on Canon EOS R5 with a 100mm macro lens at f/4, natural muted tones, slight desaturation, minimal contrast. Square 1:1 format.
```

**Alt text (Czech):** `Textura české cihlové zdi — detail historického zdiva`

**Acceptance criteria:**

- ✅ No people, hands, or human figures
- ✅ Works as a background — not too busy, not too plain
- ✅ Warm terracotta tones, not grey/industrial
- ✅ Authentic weathering — not too perfect, not too damaged
- ✅ Muted/desaturated enough to work under dark overlay `rgba(0,0,0,0.6)` with white text
- ❌ FAIL if: too detailed/distracting as background, cold tones, graffiti, modern bricks

---

### IMG-6: `czech-facade.webp` (SPARE — not deployed on page)

**Section:** Asset library for future use (O nás uses `property-exterior.jpg` per requirements)
**Dimensions:** 800×600 (4:3) WebP, target <80KB
**Filename:** `public/images/czech-facade.webp`

**Gemini API Prompt:**

```
A photorealistic street-level photograph of a Czech townhouse facade in a small Moravian town. The building has ornate Art Nouveau plasterwork in warm cream and ochre tones, tall windows with dark green wooden shutters, and window boxes overflowing with red geraniums. The facade shows gentle wear — slight plaster cracks, faded paint — that conveys authenticity rather than neglect. Late afternoon golden hour sunlight illuminates the facade from the left side, creating warm highlights and soft shadows in the decorative elements. A cobblestone sidewalk is visible at the bottom of the frame. No people visible, no hands visible, no human figures of any kind. Shot on Nikon Z8 with a 35mm lens at f/5.6, natural color processing with warmth, slight film grain, organic composition with slight natural asymmetry. 4:3 format.
```

**Alt text (Czech):** `Fasáda českého městského domu — secesní architektura s typickými detaily`

**Acceptance criteria:**

- ✅ No people, hands, or human figures (including no silhouettes in windows)
- ✅ Recognizably Czech/Moravian architecture — not German, not French
- ✅ Warm golden hour lighting from the side
- ✅ Authentic wear — not freshly renovated, not abandoned
- ✅ Window boxes with flowers add life without people
- ❌ FAIL if: people, modern glass facade, American architecture, too perfect/symmetrical

---

## 4. Exact Code Changes in `src/app/page.tsx`

### Change 1: Restructure "Jak to funguje" Row 1 — single image → 2-image grid

**Find this block (Row 1 image):**

```tsx
<div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
  <Image
    src="/images/consultation.jpg"
    alt="Konzultace s klientem — probereme vaši situaci"
    fill
    className="object-cover"
  />
</div>
```

**Replace with:**

```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
    <Image
      src="/images/process-consultation.webp"
      alt="Kancelář pro konzultace — teplý interiér s výhledem na českou ulici"
      fill
      className="object-cover"
    />
  </div>
  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
    <Image
      src="/images/process-valuation.webp"
      alt="Ocenění nemovitosti — podklady pro stanovení férové ceny"
      fill
      className="object-cover"
    />
  </div>
</div>
```

### Change 2: "Jak to funguje" Row 2 — left image

**Find:**

```tsx
src = "/images/document-signing.jpg";
alt = "Podpis kupní smlouvy u notáře";
```

**Replace with:**

```tsx
src = "/images/process-contract.webp";
alt = "Podepsaná kupní smlouva s notářským razítkem";
```

### Change 3: "Jak to funguje" Row 2 — right image

**Find:**

```tsx
src = "/images/keys-handover.jpg";
alt = "Předání klíčů od nemovitosti novému majiteli";
```

**Replace with:**

```tsx
src = "/images/process-keys.webp";
alt = "Klíče od prodané nemovitosti na stole — úspěšný výkup";
```

### Change 4: "O nás" section — replace team photo with property-exterior.jpg

**Find:**

```tsx
<Image
  src="/images/office-team.jpg"
  alt="Profesionální tým Výkup Regiony CZ v moderní kanceláři"
  fill
  className="object-cover"
/>
```

**Replace with:**

```tsx
<Image
  src="/images/property-exterior.jpg"
  alt="Rezidenční čtvrť v České republice — působíme po celé zemi"
  fill
  className="object-cover"
/>
```

### Change 5: Lead Form section — replace handshake image with texture + overlay

**Find this entire block:**

```tsx
<div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
  <Image
    src="/images/handshake-deal.jpg"
    alt="Podání ruky nad podepsanou smlouvou s klíči od domu"
    fill
    className="object-cover"
  />
</div>
```

**Replace with:**

```tsx
<div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
  <Image
    src="/images/texture-brick.webp"
    alt="Textura české cihlové zdi — detail historického zdiva"
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
  <div className="relative flex h-full items-center justify-center px-6">
    <p className="text-center text-lg font-bold text-white">
      Férové jednání je náš standard
    </p>
  </div>
</div>
```

---

## 5. Final Image Inventory (after all changes)

| #   | File                        | Section                      | Format   | Size Target | Load               |
| --- | --------------------------- | ---------------------------- | -------- | ----------- | ------------------ |
| 1   | `hero-{region}.jpg`         | Hero                         | JPEG     | <150KB      | `priority` (eager) |
| 2   | `process-consultation.webp` | Jak to funguje — Row 1 left  | WebP 3:4 | <80KB       | lazy               |
| 3   | `process-valuation.webp`    | Jak to funguje — Row 1 right | WebP 3:4 | <80KB       | lazy               |
| 4   | `process-contract.webp`     | Jak to funguje — Row 2 left  | WebP 3:4 | <80KB       | lazy               |
| 5   | `process-keys.webp`         | Jak to funguje — Row 2 right | WebP 3:4 | <80KB       | lazy               |
| 6   | `property-exterior.jpg`     | Visual break + O nás         | JPEG     | existing    | lazy               |
| 7   | `texture-brick.webp`        | Lead Form card               | WebP 1:1 | <100KB      | lazy               |
| 8   | `testimonial-bg.jpg`        | Testimonials background      | JPEG     | existing    | lazy               |
| 9   | `happy-family-home.jpg`     | Visual break before FAQ      | JPEG     | existing    | lazy               |

**Total: 9 images on page. 0 people violations. All WebP-optimized new images. All lazy-loaded except hero.**

---

## 6. Generation Order (priority)

1. **IMG-4** `process-keys.webp` — highest conversion impact (completion symbol)
2. **IMG-3** `process-contract.webp` — trust/legitimacy
3. **IMG-1** `process-consultation.webp` — trust/professionalism
4. **IMG-2** `process-valuation.webp` — transparency
5. **IMG-5** `texture-brick.webp` — background (less critical)
6. **IMG-6** `czech-facade.webp` — spare asset (not deployed immediately)

---

## 7. Gemini API Call Template

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{"parts": [{"text": "PROMPT_HERE"}]}],
    "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
  }' | jq -r '.candidates[0].content.parts[] | select(.inlineData) | .inlineData.data' | base64 -d > OUTPUT_FILE.jpg
```

After generation, convert to WebP and resize:

```bash
cwebp -q 80 -resize 800 1067 input.jpg -o output.webp
ls -la output.webp  # verify under target KB
```

---

_Spec complete. Developer can implement all changes without asking a single question._
