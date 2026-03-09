# Bundle Report — VR-244

Generated: 2026-03-09  
Next.js: 15.5.12 | Build: production

## First Load JS Shared by All: 339 kB (gzipped)

| #   | Chunk              |    Raw | Gzipped | Contents                                  |
| --- | ------------------ | -----: | ------: | ----------------------------------------- |
| 1   | `ed9f2dc4-*.js`    | 820 kB |  217 kB | Next.js internal dev-overlay / devtools ¹ |
| 2   | `1255-*.js`        | 242 kB |   65 kB | Next.js app runtime                       |
| 3   | `4bd1b696-*.js`    | 173 kB |   54 kB | React DOM                                 |
| 4   | `framework-*.js`   | 182 kB |   58 kB | React framework                           |
| 5   | `main-*.js`        | 152 kB |   44 kB | Next.js main client entry                 |
| 6   | `9541-*.js`        | 136 kB |   45 kB | framer-motion (per-page, not shared)      |
| 7   | `page-*.js` (home) | 152 kB |   38 kB | Homepage page chunk                       |
| 8   | `polyfills-*.js`   | 113 kB |   40 kB | Polyfills                                 |
| 9   | `153-*.js`         |  30 kB |   11 kB | Shared utility chunk                      |
| 10  | `layout-*.js`      |  21 kB |    6 kB | Layout chunk                              |

¹ This chunk contains the Next.js 15.5 dev-overlay/devtools CSS+JS. It is included in the production `app-build-manifest.json` and counted in "First Load JS shared by all". This is internal Next.js 15.5 behavior — the chunk is loaded but conditionally activated only in development. **Excluding this chunk, the actual shared JS is ~122 kB.**

## Key Findings

### Shared bundle breakdown (339 kB gzipped total)

- **Next.js dev-overlay**: ~217 kB (upstream, not user code)
- **Next.js runtime**: ~65 kB
- **React + ReactDOM**: ~54 kB
- **Other**: ~2 kB

### Effective shared JS (without dev-overlay): ~122 kB ✅

### Per-page heavy chunks

- **framer-motion** (~45 kB gzipped): used across many components for animations
- **Homepage**: largest page at 440 kB total (including 92.7 kB page-specific)

## Optimizations Applied (VR-244)

1. **`@next/bundle-analyzer`** installed with `npm run analyze` script
2. **Dynamic imports with `ssr: false`** via `ClientShell` wrapper component:
   - `ExitIntentPopup` — exit-intent modal
   - `CookieConsent` — GDPR cookie banner
   - `ScrollProgress` — scroll progress bar
   - `TrackingPixels` — GTM/analytics pixels
   - `SwRegister` — service worker registration
   - `WebVitalsReporter` — Core Web Vitals reporting
3. **`experimental.optimizePackageImports`**: framer-motion, lucide-react
4. **`devIndicators: false`** to reduce dev overlay impact

## Recommendations for Further Reduction

- **Upgrade to Next.js 16**: eliminates the 217 kB dev-overlay chunk from production builds, bringing shared JS to ~122 kB
- **Replace framer-motion with CSS animations** where possible (~45 kB/page savings)
- **Consider `motion` standalone package** as lighter framer-motion alternative
