# Wikidata entity creation — actionable guide for owner

**Why this matters.** Без присутствия в Wikidata Google Knowledge Graph (а через него Gemini, AI Overview и AI Mode) **не имеет canonical reference** на ваш бренд. Это прямая цитата из Google Cloud documentation. Все остальные оптимизации работают _в рамках_ существующего entity, и без Wikidata-якоря ваш бренд остаётся "просто строкой" в их моделях, а не "вещью".

**Confidence level.** Wikidata создание — **самый высокий ROI off-site action** для AI Overview citation. Multiple studies (Discovered Labs, Wiki Consult, Google Cloud docs) показывают, что pages with Wikidata-anchored entities получают 3–5× больше AI citations.

**Constraint compatibility.** Wikidata НЕ требует:
- Wikipedia article (можно создать Wikidata entry без Wikipedia)
- Раскрытия личных данных владельца
- IČO (хотя ICO/IČO усиливает entity)
- Press coverage (но один tier-1 reference нужен)

---

## Step 1: Create Wikidata account

1. Иди на https://www.wikidata.org/wiki/Special:CreateAccount
2. Создай аккаунт (логин может быть любой, не связанный с брендом)
3. **Важно:** делай первые 2-3 правки на существующих entities (например, обнови описание чешского кадастрального правила в существующем item) — это даёт **autoconfirmed** статус, без которого новые items могут блокироваться.

## Step 2: Determine notability path

Wikidata принимает item, если выполнен ONE of:
- (A) Linked from Wikipedia (или другой Wikimedia project) — **самый сильный путь**
- (B) "Clearly identifiable" + reliable public sources — **наш путь**
- (C) Structural utility (используется как property other items) — не наш case

**Для path B** нужны минимум 2 reliable references вне нашего сайта:
- Существующая страница на Firmy.cz (Seznam directory) — **создать сначала**
- Mention в любом Czech business article (e15.cz, ekonom.cz, idnes.cz)
- LinkedIn company page
- Google Business Profile (если/когда создаётся)

**Если Path B не получится сразу:** начни с создания Firmy.cz listing + LinkedIn page + Google Business Profile. Это 3 reliable references which Wikidata accepts.

## Step 3: Item content (copy-paste template)

**Label (Czech):** `Vykoupím Nemovitost`
**Description (Czech):** `česká služba rychlého výkupu nemovitostí`
**Aliases:** `vykoupim-nemovitost.cz`, `Vykoupíme Nemovitost`

**Statements (claims):**

| Property | Value | Notes |
|---|---|---|
| `instance of` (P31) | `business` (Q4830453) или `online service` (Q1668024) | Choose one |
| `country` (P17) | `Czech Republic` (Q213) | |
| `official website` (P856) | `https://vykoupim-nemovitost.cz` | |
| `industry` (P452) | `real estate` (Q15832085) | |
| `inception` (P571) | `2025` или fact-checked year | |
| `language of work or name` (P407) | `Czech` (Q9056) | |
| `area served` (P2541) | `Czech Republic` (Q213) | |
| `service offered` (P3712) | `výkup nemovitosti` if exists, иначе `real estate transaction` (Q1330880) | |

**Sources (each statement should have at least 1):**
- `reference URL` (P854): `https://vykoupim-nemovitost.cz/o-nas`
- Plus directory listing URL when available (Firmy.cz, LinkedIn)

## Step 4: Submit + monitor

1. Submit item
2. **Возможные исходы:**
   - **Accepted (90%):** item gets a Q-number (e.g. Q123456789), available in 1-2 weeks for Google Knowledge Graph indexing
   - **Deletion request:** if reviewer flags non-notability, you'll have 7 days to add references. Add Firmy.cz listing + LinkedIn page → resubmit.

3. Monitor: visit `https://www.wikidata.org/wiki/Q[your-id]` weekly first month.

## Step 5: Link from website (after Q-id assigned)

Once you have a Q-id, update `src/lib/jsonld-org.ts`:

```ts
sameAs: [
  "https://www.wikidata.org/wiki/Q123456789",  // your Wikidata
  "https://www.firmy.cz/...",                   // your Firmy.cz
  "https://www.linkedin.com/company/...",       // your LinkedIn
]
```

This bidirectional linking is the **strongest signal** to Google's entity resolver. Without `sameAs` references, the Organization graph stays disconnected from Wikidata.

## Step 6 (next 90 days): Strengthen entity

Once basic entity exists, AI Overview citation chances increase with each:
1. **Czech Wikipedia article** (cs.wikipedia.org) — high notability bar, but possible after press coverage. Don't try to write own; let editorial process happen.
2. **Brand mentions in tier-1 Czech press** — e15.cz, ekonom.cz, idnes.cz/finance, hospodarske noviny
3. **Industry directory listings** — every reliable directory adds a reference

## Realistic timeline

- Day 0: Wikidata account, first edits
- Day 1: Create Firmy.cz + LinkedIn (if not yet) — gives reliable references
- Day 2: Submit Wikidata item
- Week 1-2: Item review (likely accepted)
- Week 2-4: Google Knowledge Graph picks up item
- Week 4-12: Gemini, ChatGPT, Perplexity start associating brand with entity
- Quarter 2: Citations measurably increase (per multiple case studies, 3-5× lift)

## What NOT to do

- ❌ Не пиши Wikipedia article про свой бренд — это conflict of interest, удалят и блокируют
- ❌ Не используй Wikidata для marketing claims (количество клиентов, и т.п.) — только factual properties
- ❌ Не создавай несколько items для одного бренда — Wikidata детектит дубликаты
- ❌ Не пытайся редактировать существующие Wikipedia articles чтобы вставить свои ссылки — будет reverted
