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
