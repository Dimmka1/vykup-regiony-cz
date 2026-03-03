# A/B Testing Infrastructure

## Overview

Cookie-based A/B testing for the hero section with GTM dataLayer integration.

## How It Works

1. **Middleware** (`src/middleware.ts`) sets `ab_variant` cookie on first visit
2. Cookie is **sticky** for 30 days
3. **Hero section** reads cookie server-side, renders variant-specific copy
4. **GTM dataLayer** receives `ab_variant` on every page load

## Traffic Split

| Variant | Weight | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| A       | 50%    | Control - original region-based copy                         |
| B       | 25%    | "Prodáme vaši nemovitost do 7 dnů - záloha až 500 000 Kč"    |
| C       | 25%    | "Potřebujete rychle prodat? Peníze do 48 hodin, bez provize" |

## Key Files

- `src/lib/ab-variants.ts` - variant definitions, picker, cookie constants
- `src/middleware.ts` - cookie assignment on first visit
- `src/components/home-page-content.tsx` - hero rendering by variant
- `src/components/ab-variant-tracker.tsx` - GTM dataLayer push

## Adding a New Variant

1. Add variant key to `ABVariant` type in `src/lib/ab-variants.ts`
2. Add content to `VARIANT_OVERRIDES`
3. Update `AB_VARIANTS` array
4. Adjust `pickVariant()` weights (must sum to 1.0)

## Changing Copy

Edit `VARIANT_OVERRIDES` in `src/lib/ab-variants.ts`.

## Changing Weights

Edit `pickVariant()` in `src/lib/ab-variants.ts`. Only affects new visitors.

## GTM / Google Analytics

`ab_variant` is pushed to `dataLayer` via `<ABVariantTracker />`. In GTM:

1. Create a **Data Layer Variable** named `ab_variant`
2. Use it as a **Custom Dimension** in GA4
3. Analyze conversion rates per variant
