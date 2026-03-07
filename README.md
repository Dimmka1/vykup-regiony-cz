# Výkup regiony CZ — MVP app

MVP landing na Next.js + Tailwind s podporou multi-domain region renderingu.

## Co je hotové

- Single-page landing
- Domain-aware rendering podle `Host` headeru
- YAML konfigurace pro 14 regionů (`src/data/regions.yml`)
- Dynamické SEO metadata (title, description, canonical, OG) + regionální H1
- Lead form section + mock API endpoint (`POST /api/leads`)
- Základní validace (client + server), honeypot, jednoduchý rate-limit
- Responzivní layout (mobile-first)

## Stack

- Next.js (App Router)
- TypeScript (strict)
- Tailwind CSS
- YAML + Zod

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

### Simulace regionů lokálně

Resolver používá `Host` header. Pro rychlý test lze editovat `/etc/hosts`, např.:

```text
127.0.0.1 praha.localhost
127.0.0.1 jihomoravsky.localhost
```

Potom otevřít `http://praha.localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Deploy (Vercel / multi-domain)

1. Deploy jednu aplikaci.
2. Připoj všechny regionální domény do stejného projektu.
3. Každá doména bude renderovat svůj region podle `hosts` v `src/data/regions.yml`.
4. Při neznámém hostu se použije `defaultRegion`.

## API

### `POST /api/leads`

Body:

```json
{
  "name": "Jan Novak",
  "phone": "+420 777 123 456",
  "property_type": "byt",
  "region": "Praha",
  "situation_type": "standard",
  "consent_gdpr": true,
  "website": ""
}
```

Response:

- `200` `{ ok: true, lead_id, message }`
- `400` `{ ok: false, code: "VALIDATION_ERROR" }`
- `429` `{ ok: false, code: "RATE_LIMITED" }`
- `500` `{ ok: false, code: "DELIVERY_ERROR" }`

## Price Data & Freshness (VR-209)

### PRICE_RESEARCH.json

Regional property prices (CZK/m²) used by ~500 programmatic pages. Located in the project root.

Key fields:

- `regions` — per-region prices for `byt_m2`, `dum_m2`, `pozemek_m2`
- `lastUpdated` — ISO 8601 timestamp of the last price update
- `date` — original data collection date
- `sources` — list of data sources

### Updating Prices

```bash
# 1. Edit PRICE_RESEARCH.json — update prices in the `regions` object
# 2. Run the update script to stamp the current date:
npm run update-prices

# 3. Commit and deploy
git add PRICE_RESEARCH.json
git commit -m "fix: update price data [month year]"
git push
```

The script (`scripts/update-prices.js`):

- Reads PRICE_RESEARCH.json
- Sets `lastUpdated` to current ISO timestamp
- Prints a reminder about data sources

### What Uses `lastUpdated`

1. **Price freshness badge** — "Ceny aktualizovány: [datum]" shown on every programmatic page below the price estimator
2. **JSON-LD `dateModified`** — `WebPage` schema on programmatic pages uses `lastUpdated`
3. **Sitemap `lastmod`** — all content pages reflect the price update date

### Recommended Update Cadence

- Quarterly (at minimum) — align with ČSÚ quarterly reports
- After significant market changes

### Data Sources

- [RealityMIX](https://realitymix.cz/statistika-nemovitosti/) — apartment prices by region
- [ČSÚ](https://csu.gov.cz) — official quarterly statistics
- [Sreality](https://sreality.cz) — market listing prices

### Future Automation Plans

The `update-prices` script is designed as an MVP entry point. Future improvements:

- Automated scraping of RealityMIX/Sreality price indices
- ČSÚ API integration for quarterly data
- GitHub Actions cron job for scheduled updates
- Price change alerts via Slack/email
