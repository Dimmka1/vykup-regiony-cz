# Image Generation Prompts — Lived-in Czech Real Estate Style

Style and prompts for generating illustrations on a Czech real-estate site
(use-case landing pages + blog posts). All prompts share a common style frame
locked in during the 2026-04-30 SEO recovery work.

---

## How to use

1. Open Gemini (gemini.google.com/app) — Imagen / "Nano Banana" image gen is built in.
   Free tier works; paid Gemini Pro is faster.
2. Paste **one prompt at a time** (each prompt below is self-contained).
3. After the image renders, click the download icon on the image
   (top-right corner: ⬇️ "Скачать в полном размере" / "Download full size").
   Chrome saves to `~/Downloads/Gemini_Generated_Image_*.png` (~5–10 MB PNG).
4. From the project root, run:
   ```bash
   node scripts/convert-gemini-image.mjs public/images/use-cases/<slug>.jpg
   # or for blog:
   node scripts/convert-gemini-image.mjs public/images/blog/<slug>.jpg
   ```
   The script picks the most recent `Gemini_Generated_Image_*.png` from Downloads,
   resizes to 1200×800 q85 JPEG, places at the target path, and archives the source
   into `~/Downloads/_gemini_used/`.
5. After all 22 are done, verify:
   ```bash
   ls public/images/use-cases/ public/images/blog/
   ```

If Gemini gets stuck "generating" for >60 s, **abandon that chat and start a fresh one**
(button at top-left, "+" or "New chat"). The image-generation pipeline sometimes
locks up after a long thinking response; a fresh chat resets the state.

---

## Style frame (locked-in lived-in Czech aesthetic)

User-validated style guidelines (from feedback during initial generation):

- AVOID: `photorealistic`, `editorial`, `professional photography`, `cinematic`, `golden hour`, `clean`, `minimalist`, `pristine`. These trigger over-stylized AI defaults.
- USE: `real estate listing photo on sreality.cz`, `shot on a phone by the owner`, `ordinary`, `lived-in`, `well-maintained`, `slight smartphone-camera quality`.
- Imperfections in MODERATION: chairs slightly out of alignment, small wear marks, an everyday item left behind. The place is well-kept — not derelict, not abandoned, not "убито".
- Density: include MANY ambient details (plants, fridge magnets, cardigan on chair, slippers, calendars, family photos, kitchenware). The image must feel like SOMEONE LIVES THERE.
- Czech specifics: 1990s panelák / chalupa / cihlový dům na vesnici, Czech crystal glasses, Škoda in driveway, Czech crown coins, ČSOB / KB document folders.

Common hard constraints in every prompt:

- Aspect 4:3 (~1200×800)
- NO people, NO faces, NO hands
- NO readable text, NO watermarks, NO logos

---

## Use-case images (10 slots — `public/images/use-cases/<slug>.jpg`)

### exekuce.jpg ✅ DONE

Wide indoor shot of a Czech apartment entryway/hallway. The front door (dark wood
or painted) is clearly visible with an official-looking court notice (one rectangular
paper with a stamp) attached at eye-level — paper unreadable but clearly looks like
an official obsílka. In the entryway: a doormat with worn edges; a wall-mounted coat
rack with a winter jacket and a knitted scarf hanging; a small wooden entrance shelf
with a pile of envelopes/bills, a brass key bowl with a few keys in it, a couple of
opened letters spilling slightly onto the floor; a pair of house slippers and one
pair of outdoor shoes nearby; an umbrella resting against the wall in the corner;
a framed family photo on the side wall; a small wall-mounted mirror; a key rack with
a few hanging keys; a small potted plant on the shelf. Side daylight gently lighting
the door from the right.

### dedictvi.jpg ✅ DONE

Wide indoor shot of a cozy living room in an OLDER Czech family house (chalupa style
or cottage). Foreground emphasis: a small wooden side table holding a single old brass
key on a knitted lace doily, next to a small porcelain cup with saucer, an old wristwatch,
a vintage prayer book, a framed black-and-white wedding portrait, a porcelain figurine.
The wider room visible: an armchair with a knitted blanket draped over it, a tall pendulum
wall clock, a vintage glazed cabinet with Czech crystal glasses inside, a worn but clean
Persian-style rug on wooden parquet floor, a coffee table with a half-read book and a
pair of reading glasses, an open window with light cotton curtains showing an autumn
garden outside, a vase with autumn flowers, a small bookshelf with old hardback books,
framed family photos showing different generations on the walls. Soft afternoon light
from the window. MOOD: warm, inherited family property where grandparents lived for
decades, FULLY LIVED-IN.

### rozvod.jpg ✅ DONE

A kitchen-and-dining area in a regular Czech apartment in GOOD CONDITION, but with LOTS
of everyday details that show real life. Wide shot. Compose so the wooden dining table
is in foreground (slightly off-center) and the kitchen is fully visible behind it.
ON THE TABLE: an old brass house key near the center; one used coffee mug (with a
personal pattern); a folded magazine; a small clear bowl with fruit (a few apples);
a salt and pepper shaker; a folded paper napkin; a single faint coffee ring mark.
CHAIRS: two wooden chairs at slightly different angles, one with a knitted cardigan
draped over its back. WINDOW: behind the table, a window with light cotton curtains
slightly parted; a potted plant on the windowsill, a small succulent next to it. WALL:
a framed photo and a small wall calendar; a small wall clock. KITCHEN BACKGROUND
(visible): white cabinets with magnets and a couple of postcards on the fridge, a
kettle on the counter, a small spice rack, a dish-drying rack with a few cups, a tea
towel hanging from a handle, a wooden cutting board, a couple of jars (flour/sugar).
FLOOR: ordinary laminate, a small woven rug under the table, a pair of house slippers
near one chair. LIGHT: gentle indirect daylight from the window plus one warm overhead
bulb on, slight mixed-temperature cast.

### spoluvlastnicky-podil.jpg ✅ DONE

A wooden desk in a Czech apartment with a printed property floor plan (architectural
drawing) spread out as the main item, one specific room subtly highlighted with a yellow
marker. Around the floor plan: a calculator, a fountain pen, a sticky-note pad, a half-
drunk coffee mug with a personal pattern, a small wooden box with a few brass keys, a
Czech property document folder, a desk lamp turned on, scattered handwritten notes
(illegible Czech words), a small tabletop calendar showing 2026 with dates circled.
A window in background with soft daylight, a potted herb plant on the sill, a printer
in the corner. The rest of the apartment visible in soft focus: a bookshelf with novels,
a comfortable armchair with a knitted throw, a framed family photo on the wall, a worn
rug on the floor. MOOD: someone is figuring out their share of an inherited or shared
property, calm but focused.

### s-hypotekou.jpg ✅ DONE

A Czech apartment kitchen table scene, foreground showing an opened bank loan agreement
folder (Czech-style ČSOB or KB document, no readable text), with a calculator showing
a calculation result (numbers blurred), a fountain pen on top of papers, scattered
receipts and printed bank statements, a small house keychain in the middle, a half-
drunk coffee mug, a small notebook with handwritten Czech words. On the side: a wall
calendar with payment dates marked in red, a houseplant on the windowsill, a fruit bowl,
a folded cotton dish towel. Behind: a regular Czech kitchen with white cabinets, a fridge
with magnets and souvenir postcards, a kettle on the counter, a tea towel hanging, a
spice rack with jars.

### s-vecnym-bremenem.jpg ⏳ TODO

An older sun-lit Czech apartment hallway or living room corner. Foreground: a vintage
wooden cabinet with a knitted lace runner, a ceramic bowl with a few brass keys, framed
family photos showing three generations grouped on top. Wall behind: a tall pendulum
wall clock and a smaller wall calendar. To the side: a glass cabinet with traditional
Czech crystal glasses inside. Soft afternoon light through a window with light curtains.
A pair of older-style house slippers near the cabinet, a coat rack with an elderly's
gray wool coat hanging. Worn but well-cared-for parquet floor with a small Persian-
style rug. A houseplant in a ceramic pot on the windowsill, a small porcelain figurine
on a side table.

### zpetny-najem.jpg ⏳ TODO

A cozy lived-in Czech living room (older style, comfortable furniture) suggesting that
someone has lived here a long time and continues to live here. Foreground: a comfortable
armchair with a folded knitted throw, a half-read book lying open on the coffee table
next to a pair of reading glasses, a half-drunk cup of tea on a saucer, a houseplant in
a ceramic pot on the floor next to the armchair, a pair of well-used house slippers next
to the armchair. Background: a TV showing a static screen (off or news), a bookshelf full
of novels and small personal items (figurines, photos), a worn but clean rug on the floor,
a wall lamp turned on, framed family photos on the wall above the bookshelf, light cotton
curtains on a window showing daylight. Atmosphere: warm and homely, NOT staged.

### byty.jpg ⏳ TODO

Outdoor exterior view of a typical Czech panelák (1980s-90s prefab apartment building)
or a city brick apartment building (městský činžovní dům). View shows the entrance with
a few floors visible. Some balconies have laundry hanging on lines, plants in pots,
satellite dishes, a kid's bicycle leaning on a balcony railing. Below: a parked older
Škoda or Renault, mailboxes (poštovní schránky) by the entrance, a couple of strollers
parked, a cat sitting on a low railing. Cracked asphalt in the foreground, a few autumn
leaves scattered. Overcast Czech daylight.

### domy.jpg ⏳ TODO

Front view of a typical Czech family house (rodinný dům) in a small town or village
suburb. Modest two-story house with a sloped tile roof, plastered walls, white-framed
windows. A small front garden with: a hose coiled on the lawn, a wheelbarrow, a kid's
bicycle leaning on the wall, a few garden gnomes, a vegetable patch with raspberries /
tomato cages, a wooden fence with a gate, a clothesline with laundry hanging, a parked
older Škoda in the driveway, garden tools (rake, shovel) leaning by the wall, autumn
leaves scattered, a doormat at the front door, a Czech house number plate on the wall.
Overcast daylight.

### pozemky.jpg ⏳ TODO

An empty grassy plot of land in Czech countryside, mid-afternoon overcast daylight.
Foreground: a few wooden surveyor stakes with red-and-white tape between them, an old
measuring tape rolled out on the grass, a folded blueprint paper held down by a stone,
a thermos and a worn notebook on a portable folding chair. Mid-ground: scattered farm
equipment in distance — a wheelbarrow, a few wooden boards stacked, a half-built
foundation marker outline. Background: distant Czech village rooftops with a church
steeple, gentle low rolling hills. A few wildflowers and tall grass at the edges, fence
posts of an old wooden fence partially visible.

### drazba.jpg ⏳ TODO

A wooden desk in a Czech notary or court office. Foreground: a wooden judge-style
auction gavel resting on its sound block, a stack of property documents in a folder
(no readable text), a brass key on top of the documents, a fountain pen, a half-drunk
coffee mug, a small tabletop calendar, a vintage lamp turned on. Background visible:
a Czech-style coat hanging on a rack in soft focus, a bookshelf with legal-looking
hardbacks, a wall clock, a small ceramic figurine on a side table. Mood: serious but
ordinary, suggestive of property auction.

---

## Blog images (11 slots — `public/images/blog/<slug>.jpg`)

For each, prepend the standard frame:

> _"Generate ONE photorealistic image only — no text response, no narration. SCENE: …
> Aspect 4:3 (~1200x800). STYLE: real estate listing photo on sreality.cz, shot on a
> phone by the owner, ordinary well-maintained Czech apartment, lots of everyday
> details, slight smartphone-camera quality, no staging. NO people, NO faces, NO
> hands, NO readable text, NO watermarks, NO logos."_

### blog/jak-rychle-prodat-nemovitost.jpg

A Czech apartment dining table with a vintage stopwatch placed on top of opened
property documents, a brass house key, a personal-patterned coffee mug, a folded
newspaper, a few scattered receipts. View to a sun-lit window with light cotton
curtains, a calendar on the wall behind, a small spice rack visible. Conveys
"time is critical".

### blog/vykup-nemovitosti-vs-realitni-kancelar.jpg

A Czech kitchen table with TWO clearly different "paths" represented: on the left
side a stack of business cards from realitni-kancelář brokers (multiple, slightly
fanned out), on the right side a single folded contract with a stamp. Old key in
middle, mug, magazine, calendar visible behind. The kitchen and a few plants in
the background. Two different "options" feel.

### blog/nemovitost-v-exekuci-pruvodce.jpg

A Czech apartment desk scene: a thick legal-style guide booklet open with finger-
marked pages, a notebook with handwritten Czech notes (illegible / blurred text),
highlighter pens, a coffee mug, a property document with a small "Exekuce"-looking
stamp, an old key, a desk lamp, a framed family photo nearby, sunset light through
a window with curtains. A bookshelf in soft focus.

### blog/jak-probiha-rychly-vykup.jpg

A Czech apartment desk with a printed wall calendar showing dates 1-7 highlighted
with a marker, a digital clock, a stack of papers in an inbox tray, a folded
newspaper, a fountain pen, a coffee mug, a small house keychain, sticky notes with
handwritten dates. A houseplant on the desk, a framed photo, a window with curtains
in background. View of cozy apartment.

### blog/5-duvodu-proc-prodat.jpg

A Czech kitchen table with five distinct items laid out (left-to-right): a small
alarm clock (time), a small piggy bank (money), an old key on a ring (simplicity),
a folded "FOR SALE" sign-style card (no readable text), and a small house figurine.
All on a wooden table with the rest of the kitchen visible behind: cabinets, plants,
kettle, fridge with magnets. Editorial flat-lay style but in a real lived-in kitchen.

### blog/vykup-v-exekuci.jpg

A Czech apartment kitchen-table scene: a printed exekuční dokument (with what looks
like a stamp) folded next to a closed kupní smlouva, a brass key in the middle, a
mug, an open Czech-bank statement (numbers blurred), a fountain pen, a houseplant
on the windowsill, kitchen visible in background with cabinets and kettle. Mood:
a tough situation being resolved with paperwork.

### blog/jake-dokumenty-potrebuji.jpg

A Czech apartment desk-or-table with a STACK of property-related documents fanned
out: a list-vlastnictví (LV) folder, a snímek z katastrální mapy, a Czech občanka
(citizen card, blurred details), a property contract folder, an energy audit (PENB)
booklet, a fountain pen, a notepad with handwritten Czech words, a mug, a small
house keychain, a magnifying glass, daylight from window, kitchen visible behind
with cabinets and a houseplant.

### blog/vykup-krok-za-krokem.jpg

A Czech apartment kitchen-or-living-room scene with a printed step-by-step diagram
on a sheet of paper on the table (1, 2, 3, 4, 5 visible but unreadable details),
arrows drawn in a marker, a few small wooden blocks arranged in a line near it, an
old key, a mug, a tape measure, a wall calendar in background, a houseplant, ordinary
apartment context with cabinets and warm lighting.

### blog/vykup-vs-drazba.jpg

A Czech apartment dining table SPLIT: on one side, a small wooden auction gavel
with a folded paper "Dražba" stamp and a few coins; on the other side, a folded
contract with a brass key and a satisfied-looking cup of coffee. Two distinct
"sides" of the table. Plant on windowsill, kitchen behind with cabinets and kettle.

### blog/dan-z-prodeje-nemovitosti-2026.jpg

A Czech apartment kitchen-or-desk scene: a calculator with calculation visible
(blurred numbers), a Czech tax form (formulář) folded, a wall calendar showing 2026
with dates circled in red marker, a mug, a fountain pen, scattered receipts, a small
house keychain, a notebook with handwritten Czech notes, a houseplant, kitchen visible
behind. Ordinary apartment lived-in context.

### blog/kolik-stoji-vykup.jpg

A Czech apartment kitchen table with a small wooden house model in the center, around
it: a stack of Czech crown coins (CZK), a few banknotes (Czech, blurred), a fountain
pen, a calculator with a number visible (blurred), a notebook with handwritten Czech
words, a mug, a small bowl with fruit, a houseplant on windowsill, kitchen background
with cabinets and a kettle.

---

## After generating all 22

The image-sitemap (`src/app/image-sitemap.xml/route.ts`) emits an entry for each
image only if the file exists. Once all 22 are in place:

```bash
npm run build       # verify no missing files
npm test            # runs the snippet + theme-color guardrails
npm run audit:subdomain-hrefs
git add public/images
git commit -m "feat(seo): add 22 unique illustrations for use-case + blog pages

Replaces shared-stock images per Task 3.1 of the SEO indexation
recovery plan. Generated via Gemini Imagen with the locked-in
'lived-in Czech apartment / sreality.cz listing photo' style.
Each image is unique to its page so Google's image-search dedup
doesn't drop them (was 419 images submitted / 0 indexed)."
```

Then trigger a production deploy and IndexNow auto-submits the new lastmod.
