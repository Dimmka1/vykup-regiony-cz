import {
  getHeroPriceBadge,
  type PricingVariant,
  DEFAULT_PRICING_VARIANT,
} from "@/lib/pricing";
import { safeJsonLd } from "@/lib/jsonld";
import { SocialProofBar } from "@/components/social-proof-bar";
import { getThemeStyle } from "@/lib/theme-colors";
import type { ReactElement } from "react";
import { BelowFoldLazy } from "@/components/below-fold-lazy";
import { CtaLink } from "@/components/cta-link";
import { CallbackForm } from "@/components/callback-form";
import { ScrollTracker } from "@/components/scroll-tracker";
import { HeroImage } from "@/components/hero-image";
import { FloatingDesktopCta } from "@/components/floating-desktop-cta";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { HeroStagger } from "@/components/hero-stagger";
import {
  getRegionByKey,
  getRegionUrl,
  getRegionSubdomainUrl,
  listRegions,
} from "@/lib/config";
import { getNeighborKeys } from "@/config/region-neighbors";
import type { RegionConfig } from "@/lib/types";
import { Check, Phone } from "lucide-react";
import {
  COMPANY_NAME,
  getRegionalFaq,
  getProcessSteps,
  getComplexSituations,
  buildSchema,
} from "@/lib/home-page-data";

export {
  COMPANY_NAME,
  buildCanonicalUrl,
  buildMetaDescription,
} from "@/lib/home-page-data";

function getHeroBadges(
  variant: PricingVariant = DEFAULT_PRICING_VARIANT,
): string[] {
  return [
    getHeroPriceBadge(variant),
    "Peníze na účtu do 48 hodin",
    "Bez provize a skrytých poplatků",
  ];
}

interface HomePageContentProps {
  region: RegionConfig;
  canonicalUrl: string;
  currentHost: string | null;
}

export function HomePageContent({
  region,
  canonicalUrl,
  currentHost,
}: HomePageContentProps): ReactElement {
  const schema = buildSchema(region, canonicalUrl);
  const themeStyle = getThemeStyle(region.themeColor);

  // Pre-compute data for lazy below-fold component (avoids server-only imports in client code)
  const neighborKeys = getNeighborKeys(region.key, 5);
  const neighborRegions = neighborKeys
    .map((key) => {
      const r = getRegionByKey(key);
      if (r.key !== key) return null;
      return {
        key: r.key,
        name: r.name,
        locative: r.locative,
        url: getRegionUrl(r.key, currentHost),
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const allRegions = listRegions().map((r) => ({
    key: r.key,
    name: r.name,
    url: getRegionSubdomainUrl(r.key),
  }));

  return (
    <div style={themeStyle}>
      <ScrollTracker regionName={region.name} />
      <FloatingDesktopCta />

      {/* ===== HERO — CINEMATIC PARALLAX ===== */}
      <section className="scan-line relative min-h-[100svh] overflow-hidden">
        {/* Layer 1: Background image */}
        <HeroImage
          src={
            region.key === "praha"
              ? "/images/hero-prague.jpg"
              : `/images/hero-${region.key}.jpg`
          }
          alt={`Panorama ${region.primaryCityLocative} – výkup nemovitostí ${region.locative}`}
          priority
          className="object-cover"
        />
        {/* Layer 2: Animated gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-900/70 to-slate-900/90"
          aria-hidden="true"
        />

        {/* Bottom fade into content */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-slate-900"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-6 py-24">
          <HeroStagger delay={1}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="glass inline-flex rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                {region.locative}
              </p>
              <p className="glass inline-flex rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-200)] backdrop-blur-md">
                Nejsme realitka - jsme přímý kupec
              </p>
            </div>
          </HeroStagger>
          <HeroStagger
            delay={2}
            as="h1"
            className="text-display max-w-4xl text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {region.h1}
          </HeroStagger>
          <HeroStagger delay={3}>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200 md:text-lg">
              {region.description}
            </p>
          </HeroStagger>

          <HeroStagger
            delay={3}
            as="ul"
            className="mt-6 flex flex-wrap gap-2 text-sm text-white"
          >
            {getHeroBadges().map((badge) => (
              <li
                key={badge}
                className="glass inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm backdrop-blur-md"
              >
                <Check
                  className="h-4 w-4 text-[var(--theme-400)]"
                  aria-hidden="true"
                />
                {badge}
              </li>
            ))}
          </HeroStagger>

          <HeroStagger delay={4}>
            <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
              <CtaLink
                href="#kontakt"
                label={region.heroCta}
                regionName={region.name}
              />
              <a
                href={`tel:${region.phone}`}
                aria-label={`Zavolat na číslo ${region.phone}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 md:px-8 md:py-4 md:text-lg"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                {region.phone}
              </a>
            </div>
            <div className="mt-4">
              <CallbackForm regionName={region.name} />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Zálohu vyplácíme při podpisu smlouvy. Celý proces trvá 3–7 dní.
            </p>
          </HeroStagger>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent" />
      </section>

      <SocialProofBar />

      {/* ===== BELOW-FOLD: Lazy loaded, no SSR ===== */}
      <BelowFoldLazy
        region={region}
        processSteps={getProcessSteps(region)}
        complexSituations={getComplexSituations(region)}
        regionalFaq={getRegionalFaq(region)}
        neighborRegions={neighborRegions}
        allRegions={allRegions}
      />

      {/* ===== STICKY MOBILE CTA (VR-347) ===== */}
      <StickyMobileCTA regionName={region.name} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
    </div>
  );
}
