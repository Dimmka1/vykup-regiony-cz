# CLAUDE.md — vykup-regiony-cz

## Project

Real estate lead-gen site for Czech Republic. One codebase → 14 regional subdomains + root domain.
Business model: fast property buyout (výkup nemovitostí) from sellers in various life situations.

- Production: `https://vykoupim-nemovitost.cz/`
- Subdomains: `{region}.vykoupim-nemovitost.cz` (praha, jihomoravsky, stredocesky, ...)
- Dev preview: `https://vykup-regiony-cz-dev.vercel.app`
- Deploy: Vercel via GitHub Actions (no vercel.json)

## Stack

- Next.js 15 (App Router), React 19, TypeScript 5.7 (strict)
- Tailwind CSS 3.4 + SCSS (sass), Framer Motion 12, Lucide React
- Zod (validation), YAML (region config)
- Node 22

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build
npm run ci           # lint + format:check + tsc --noEmit + build
npm test             # vitest unit tests
npm run test:e2e     # playwright (chromium + firefox)
npm run lint         # eslint
npm run format       # prettier --write
npm run format:check # prettier --check
```

## Code Style & Formatting

- **Prettier**: double quotes, semicolons, 2-space indent, trailing commas, 80 char width, LF
- **Tailwind class sorting** via prettier-plugin-tailwindcss
- **ESLint**: flat config (v9), extends `next/core-web-vitals`
- **Pre-commit hook** (Husky): lint-staged (format + eslint fix) + `tsc --noEmit`
- **Path alias**: `@/*` → `./src/*`

## Engineering Rules (STRICT — always enforce)

### TypeScript

- **No `any`** — use `unknown` + narrowing or Zod validation
- **No `as` type assertions** for unvalidated data — use Zod `.safeParse()` or type guards
- **Allowed `as`**: `as const`, `as const satisfies`, test-only mocks
- **No enums** — use `as const` objects + derived union types
- **Interfaces** for object shapes/contracts; **type aliases** for unions/computed types
- **Zod schema = single source of truth** — derive types via `z.infer<>`, never duplicate
- **`??`** (nullish coalescing) always, never `||` for defaults
- **Early returns** + narrowing over `!` non-null assertion
- **Error handling**: Result pattern (`{ ok, value/error }`) for business errors; throw only for catastrophic failures
- **`catch (error: unknown)`** — narrow with `instanceof Error`
- **Readonly**: `readonly T[]` for params, `as const` for module-level data

### Next.js

- **Server Components by default** — `"use client"` only for state/effects/events/browser APIs
- **Push `"use client"` as deep as possible** — never on layouts or pages
- **`await params`**, `await searchParams`, `await cookies()`, `await headers()` — all async in Next.js 15
- **`import "server-only"`** in files with secrets or DB calls
- **`<Suspense>`** per data-fetching component, not per page
- **`next/image`** always — never `<img>`; always provide width+height or fill+sizes
- **API routes**: Zod validation, consistent `{ ok, code, data }` response shape

### React (SOLID/KISS/DRY)

- **SRP**: one concern per component; max ~70 lines; max cyclomatic complexity 10
- **OCP**: extend via props/composition/config, never edit source for new variants
- **ISP**: pass only needed fields, not entire objects; max 7-8 props
- **DIP**: depend on hooks/context/interfaces, not concrete implementations
- **KISS**: start simple, no abstraction until 3rd real use case; prefer clear over clever
- **DRY Rule of Three**: extract shared code only after 3 concrete duplications
- **Named exports only** — no `export default`
- **No barrel files** (`index.ts`) — import directly from source

### Tailwind CSS

- **No AI colors**: no magenta/fuchsia, no neon purple, no purple-to-cyan gradients, no oversaturation
- **Brand**: teal `#0f766e` / `#115e59`. Backgrounds: white, gray-50, gray-100
- **Never interpolate class names**: no `` `bg-${color}-500` `` — use lookup maps
- **Mobile-first**: base = mobile, add `md:`, `lg:`, `xl:` for larger
- **Accessibility**: `focus-visible:ring-2`, `motion-reduce:transition-none`, min 4.5:1 contrast, 44px touch targets
- **No `@apply`** for component styles — extract React component instead
- **No `!important`**, no arbitrary pixel values for layout, no mixing `style={{}}` with Tailwind

### Files & Naming

- **kebab-case** for all files: `lead-form.tsx`, `geo-seo.ts`
- **camelCase** for variables/functions, **UPPER_SNAKE_CASE** for constants
- **PascalCase** for types/interfaces/components
- **snake_case** for analytics events
- **Predicates**: `is`/`has` prefix

### Testing

- Vitest unit tests: `describe`/`it`, behavior-focused, one concept per test
- Playwright E2E: user flows, `data-testid` selectors
- Test: Zod schemas, business logic, API routes, critical user flows

### Git

- Conventional commits: `feat(scope):`, `fix(scope):`, `refactor(scope):`
- `develop` = working branch, `main` = production-only
- No `--no-verify` — fix the issue, don't skip hooks

## Architecture

### Directory Layout

```
src/
├── app/                        # App Router routes (30+)
│   ├── api/leads/route.ts      # Main lead endpoint (POST)
│   ├── api/lead-magnet/route.ts # PDF guide download (POST)
│   ├── api/og/[region]/        # Dynamic OG images
│   ├── blog/[slug]/            # Blog posts (10)
│   ├── vykup-*/                # 10 use-case pages
│   ├── ppc/                    # PPC landing (noindex, stripped layout)
│   ├── dekujeme/               # Thank you (noindex)
│   ├── sitemap*.xml/           # 4 sitemaps + image sitemap
│   ├── layout.tsx              # Root layout (header, footer, providers)
│   └── page.tsx                # Homepage (region-aware)
├── components/                 # 58 components
├── data/
│   ├── regions.yml             # 14 regions (128KB) — single source of truth
│   ├── geo-use-case-content.ts # 140 unique content blocks (region x use-case)
│   └── czech-map-paths.ts      # SVG map paths
├── lib/
│   ├── config.ts               # getRegionByHost(), getRegionByKey(), listRegions()
│   ├── geo-seo.ts              # Region injection into title/H1/description
│   ├── geo-canonical.ts        # Canonical URL builder (?kraj=, ?mesto=)
│   ├── analytics.ts            # GTM trackEvent() (27+ events)
│   ├── lead-scoring.ts         # hot/warm/cold scoring
│   ├── gosms.ts                # GoSMS.cz SMS API client
│   ├── theme-colors.ts         # 13 color palettes for per-region theming
│   ├── price-data.ts           # Regional property prices
│   ├── request-host.ts         # Host/header resolution helpers
│   ├── jsonld.ts               # Safe JSON-LD serialization
│   ├── sitemap-helpers.ts      # XML builders for sitemaps
│   └── related-articles.ts     # Internal linking graph
├── styles/                     # SCSS partials (imported by globals.scss)
│   ├── _variables.scss         # $ease-premium, $shadow-*, $duration-*
│   ├── _mixins.scss            # transition-premium, hover-lift, glass, reveal-base
│   ├── _animations.scss        # @keyframes (ctaPulseGlow, float-orb, scan-line, etc.)
│   ├── _base.scss              # :root vars, html/body/input/focus resets
│   ├── _components.scss        # .cta-glow, .btn-ripple, .scroll-reveal, .prose-article
│   ├── _utilities.scss         # .section-lg/md, .container-*, .bg-luxury-*, .orb
│   └── _reduced-motion.scss    # Consolidated prefers-reduced-motion
├── hooks/useScrollReveal.ts    # IntersectionObserver hook
├── config/region-neighbors.ts  # Adjacent region mapping
└── middleware.ts               # Region routing, CDN cache, SEO redirects (384 lines)
```

### Region System

14 regions defined in `src/data/regions.yml`:
praha, stredocesky-kraj, jihocesky-kraj, plzensky-kraj, karlovarsky-kraj, ustecky-kraj, liberecky-kraj, kralovehradecky-kraj, pardubicky-kraj, vysocina, jihomoravsky-kraj, olomoucky-kraj, moravskoslezsky-kraj, zlinsky-kraj

**Resolution priority:**

1. Subdomain host match (production)
2. `x-region-key` header (dev/preview, set by middleware)
3. `?kraj=` query param (geo-parameterized pages)
4. Default: Praha

**Per-region config**: name, locative/accusative, title, h1, description, phone, email, primaryCity, supportedCities, uspPoints, faq, seoTitle, seoDescription, keywords, hosts, themeColor

### Middleware (src/middleware.ts)

- Maps subdomains to regions via `x-region-key` header
- City subdomains (brno.) → 301 to regional (jihomoravsky.)
- Content pages on subdomains → 301 to root domain (SEO dedup)
- CDN: `s-maxage=3600, stale-while-revalidate=86400` for content pages
- API: `private, no-cache, no-store`
- PPC: `x-layout-stripped=1` header → root layout hides footer

### Lead Capture

**5 form types:**

- `lead-form.tsx` — 3-step (property type → address → contact)
- `callback-form.tsx` — phone-only quick callback
- `ppc-lead-form.tsx` — simplified with UTM params
- `quick-estimate-form.tsx` — PSC-based estimate → callback
- `lead-magnet-form.tsx` — email for PDF guide

**POST /api/leads:**
Zod validation → honeypot check → rate limit (10/60s/IP) → lead scoring → Telegram + webhook + Resend email + GoSMS SMS → backup to /tmp

**POST /api/lead-magnet:**
Email-only → rate limit (5/60s/IP) → Telegram + webhook → PDF URL

**Env vars (secrets):**
`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `LEAD_WEBHOOK_URL`, `GOSMS_CLIENT_ID`, `GOSMS_CLIENT_SECRET`, `GOSMS_CHANNEL_ID`

### SEO

- 5 sitemaps: core (~40 URLs), geo (~1064 URLs), blog, image (~850+), per-subdomain
- JSON-LD: Service, HowTo, Organization, CollectionPage, ItemList
- Dynamic robots.ts per host; allows all except /api/
- Canonical: geo pages self-referencing with ?kraj=/?mesto=; content → root domain
- OG images: dynamic per region via /api/og/[region]
- Content differentiation: 140 unique blocks (>=40% unique per geo page)
- Internal linking: related-articles.ts graph

## CI/CD (GitHub Actions)

**ci.yml** — lint → test (vitest + coverage) → build → deploy

- `develop` push: auto-deploy to Vercel preview
- `main` + manual dispatch: deploy to production

**e2e.yml** — Playwright on push/PR to develop/main

**lighthouse.yml** — on PRs: perf>=80%, a11y>=90%, seo>=90%

**Secrets:** `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Key Patterns

- All pages are server components unless explicitly marked `"use client"`
- Region data flows: middleware → headers → layout/page server components → client components via props
- Czech language: grammatical forms (locative, accusative) stored per region for natural copy
- Theme: CSS custom properties set in root layout via `getThemeStyle(region.themeColor)`
- Analytics: all form interactions tracked via `trackEvent()` → GTM dataLayer
- Animations: Framer Motion variants defined in `lib/animations.ts`
- Phone validation: Czech format `^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$`
- PSC (postal code): `^\d{3}\s?\d{2}$`

## Important Conventions

- Content site language is Czech (cs)
- Branch `develop` is the main working branch; `main` is production-only
- No vercel.json — all routing/caching handled in middleware + next.config.ts
- YAML is parsed with `yaml` package + validated with Zod at runtime
- Brand colors: teal — `brand-500: #0f766e`, `brand-700: #115e59`
