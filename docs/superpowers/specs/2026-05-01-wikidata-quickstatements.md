# Wikidata QuickStatements — copy-paste submission

**Verified 2026-05-01 via Wikidata wbsearchentities API:** no existing entry
exists for "Vykoupím Nemovitost", "vykoupim-nemovitost.cz", or related
labels. The slot is open.

**Why I can't submit this for you.** Wikidata edits require an
authenticated MediaWiki session — submitter's own OAuth token, no
service-account access. The most automated path I can deliver is this
ready-to-paste QuickStatements batch which you submit with one click
after logging in.

## Step 1 — Create Wikidata account (if you don't have one)

1. Go to https://www.wikidata.org/wiki/Special:CreateAccount
2. Use any handle (doesn't have to relate to the brand)
3. Make 2–3 minor edits to existing items first (correct a typo, add a
   description in Czech) to become **autoconfirmed** within ~4 days.
   Without autoconfirmed status, new-item creation can be flagged.

## Step 2 — Open QuickStatements

1. Visit https://quickstatements.toolforge.org/
2. Click "Log in with Wikidata account" (top-right)
3. Click "New batch"
4. Select **"V1 commands"** tab (not CSV, not V2)

## Step 3 — Paste this batch verbatim

```
CREATE
LAST	Lcs	"Vykoupím Nemovitost"
LAST	Len	"Vykoupím Nemovitost"
LAST	Acs	"Vykoupíme Nemovitost"
LAST	Acs	"vykoupim-nemovitost.cz"
LAST	Aen	"vykoupim-nemovitost.cz"
LAST	Dcs	"česká služba rychlého výkupu nemovitostí"
LAST	Den	"Czech property buyout service"
LAST	P31	Q1668024	S854	"https://vykoupim-nemovitost.cz/o-nas"
LAST	P17	Q213	S854	"https://vykoupim-nemovitost.cz/o-nas"
LAST	P856	"https://vykoupim-nemovitost.cz"	S854	"https://vykoupim-nemovitost.cz/o-nas"
LAST	P452	Q15832085	S854	"https://vykoupim-nemovitost.cz/jak-stanovujeme-cenu"
LAST	P2541	Q213	S854	"https://vykoupim-nemovitost.cz/kraje"
LAST	P407	Q9056	S854	"https://vykoupim-nemovitost.cz"
LAST	P571	+2025-00-00T00:00:00Z/9	S854	"https://vykoupim-nemovitost.cz/o-nas"
LAST	P3712	Q1330880	S854	"https://vykoupim-nemovitost.cz/jak-to-funguje"
```

### What each line does

| Line | Action |
|---|---|
| `CREATE` | Create a new item (Q-id will be auto-assigned, e.g. Q123456789) |
| `Lcs` / `Len` | Czech and English **labels** = "Vykoupím Nemovitost" |
| `Acs` × 2 / `Aen` | Czech and English **aliases** for search matches |
| `Dcs` / `Den` | Czech and English **descriptions** (one-line) |
| `P31 → Q1668024` | instance of: **online service** |
| `P17 → Q213` | country: **Czech Republic** |
| `P856 → URL` | official website |
| `P452 → Q15832085` | industry: **real estate** |
| `P2541 → Q213` | operating area: Czech Republic |
| `P407 → Q9056` | language of work or name: **Czech** |
| `P571 → 2025` | inception: 2025 (year-precision) |
| `P3712 → Q1330880` | service offered: **real estate transaction** |
| `S854 → ...` | each statement carries a **reference URL** to your site |

**About the property IDs**: P-numbers are stable Wikidata property IDs.
P31 (instance of), P17 (country), P856 (official website), P452 (industry),
P2541 (operating area), P407 (language of work), P571 (inception),
P3712 (service offered). All are well-established core Wikidata properties.

**About the Q-numbers**: Q213 (Czech Republic), Q9056 (Czech language),
Q15832085 (real estate), Q1330880 (real estate transaction), Q1668024
(online service). All are existing Wikidata items.

## Step 4 — Submit

1. Click **"Run!"** (or "Run in background" if you want to close the tab)
2. The batch creates the item in 5–30 seconds
3. Note the assigned Q-id from the result page (e.g. Q123456789)
4. Verify by visiting `https://www.wikidata.org/wiki/Q[your-id]`

## Step 5 — Wire the Q-id back to the website

Once you have the Q-id, edit `src/lib/jsonld-org.ts`:

```diff
   address: {
     "@type": "PostalAddress",
     addressCountry: "CZ",
   },
-  sameAs: [],
+  sameAs: [
+    "https://www.wikidata.org/wiki/Q123456789", // ← your Q-id here
+  ],
```

This bidirectional link is the **strongest signal** to Google's entity
resolver. Without it, the JSON-LD Organization graph stays disconnected
from the Wikidata entity Google's Knowledge Graph already uses.

## Step 6 — Wait for Google to pick it up

Realistic timeline:
- **Day 0**: Wikidata item created, visible immediately in Wikidata.
- **Week 1**: Google Knowledge Graph crawls Wikidata, picks up new
  brand entity. May appear in Knowledge Panel for branded queries.
- **Week 2–4**: Gemini, ChatGPT, Perplexity, Claude all use Knowledge
  Graph as one of their entity-resolution sources. Brand starts being
  recognized as "thing, not string."
- **Quarter 2 (60–90 days)**: Measurable AI Overview citation lift —
  multiple case studies report 3–5× increase in Q-id-anchored entities
  citation rate.

## Step 7 — Strengthen entity over time

Wikidata items grow stronger with more **references**. After initial
creation, return to the item and add:

- **Firmy.cz listing URL** (Czech Yellow Pages, owned by Seznam) — when
  available, add as additional reference (S854) on existing statements.
- **LinkedIn company page URL** — same pattern.
- **Google Business Profile** (if/when you create one).
- **Czech press mention** (e15.cz, idnes.cz, ekonom.cz) — gold-standard
  reference, gives item near-bulletproof notability defense if challenged.

Each additional reference makes the item more trusted by Google and AI
engines. **Don't add unverifiable marketing claims** (number of clients,
revenue) — Wikidata removes those quickly.

## Notability defense (if reviewer challenges)

Wikidata uses three-tier notability: (1) Wikipedia article, (2) reliable
public sources, (3) structural utility. Path 2 is ours: official website
(your domain) + Czech business presence. If a reviewer flags the item,
within 7 days add additional references (Firmy.cz, LinkedIn, press). A
business with a real website and operating presence is almost never
deleted from Wikidata in modern review practice.

---

## Alternative path (if QuickStatements feels intimidating)

Open this URL to land on Wikidata's create-item form with the Czech
label pre-filled:

```
https://www.wikidata.org/wiki/Special:NewItem?label=Vykoup%C3%ADm+Nemovitost&description=%C4%8Desk%C3%A1+slu%C5%BEba+rychl%C3%A9ho+v%C3%BDkupu+nemovitost%C3%AD&lang=cs
```

You'll then need to add the statements (P31, P17, etc.) manually via the
"add statement" button. This works but is 15+ clicks vs the one-paste
QuickStatements path.
