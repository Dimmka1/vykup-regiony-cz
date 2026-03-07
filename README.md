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

---

## Call Tracking Setup

### Dynamic Number Insertion (DNI)

The site uses a `DynamicPhone` component that shows different phone numbers based on traffic source (UTM parameters). This enables call attribution for PPC campaigns.

### Environment Variables

| Variable                                 | Required | Description                                                                                                   |
| ---------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_DEFAULT_PHONE`              | No       | Default phone number displayed on the site. Defaults to `+420 776 424 145`                                    |
| `NEXT_PUBLIC_CALL_TRACKING_PHONE_GOOGLE` | No       | Phone number shown to visitors from Google Ads (`utm_source=google`). If not set, falls back to default phone |

### How It Works

1. Visitor arrives with `?utm_source=google` → sees the Google tracking number
2. Visitor arrives organically (no UTM) → sees the default number
3. Call tracking provider receives the call on the tracking number → sends webhook to `/api/webhooks/calls`

### Call Webhook Endpoint

**POST** `/api/webhooks/calls`

Receives call events from external call tracking providers.

**Request body:**

```json
{
  "call_id": "abc-123",
  "phone_from": "+420777123456",
  "phone_to": "+420776424145",
  "duration": 125,
  "timestamp": "2026-03-07T15:30:00Z",
  "utm_source": "google",
  "status": "answered"
}
```

**Required fields:** `call_id`, `phone_from`, `phone_to`, `duration`, `timestamp`

**Optional fields:** `utm_source`, `recording_url`, `status` (answered/missed/voicemail)

**Response:** `{ "ok": true, "call_id": "abc-123" }`

**Features:**

- Logs call data to Google Sheets (requires `GOOGLE_SHEETS_CALLS_WEBHOOK_URL`)
- Sends Telegram notification (uses existing `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID`)

### Google Sheets Integration

1. Create a new Google Sheet with a "Calls" tab
2. Go to Extensions → Apps Script
3. Create a `doPost(e)` function that parses the JSON body and appends a row
4. Deploy as Web App (execute as you, accessible to anyone)
5. Set `GOOGLE_SHEETS_CALLS_WEBHOOK_URL` to the Web App URL

### Recommended Call Tracking Providers

| Provider                                                   | Region    | Notes                                                         |
| ---------------------------------------------------------- | --------- | ------------------------------------------------------------- |
| [Zavolat.cz](https://zavolat.cz)                           | 🇨🇿 Czech  | Czech local provider, CZ numbers, competitive pricing         |
| [CallTrackingMetrics](https://www.calltrackingmetrics.com) | 🌍 Global | Enterprise-grade, supports CZ numbers, Google Ads integration |
| [Ringostat](https://ringostat.com)                         | 🇪🇺 EU     | EU-based, GDPR-friendly, good CZ support                      |

**Integration steps:**

1. Get a tracking number from the provider
2. Set `NEXT_PUBLIC_CALL_TRACKING_PHONE_GOOGLE` to the tracking number
3. Configure the provider to send call webhooks to `https://your-domain.cz/api/webhooks/calls`
4. Set `GOOGLE_SHEETS_CALLS_WEBHOOK_URL` for Sheets logging
