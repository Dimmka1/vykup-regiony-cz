import {
  getHeroPriceBadge,
  type PricingVariant,
  DEFAULT_PRICING_VARIANT,
} from "@/lib/pricing";
import { safeJsonLd } from "@/lib/jsonld";
import { getThemeStyle } from "@/lib/theme-colors";
import type { ReactElement } from "react";
import { BelowFoldLazy } from "@/components/below-fold-lazy";
import { ScrollTracker } from "@/components/scroll-tracker";
import { HeroContent } from "@/components/hero-content";
import { FloatingDesktopCta } from "@/components/floating-desktop-cta";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import {
  getRegionByKey,
  getRegionUrl,
  getRegionSubdomainUrl,
  listRegions,
} from "@/lib/config";
import { getNeighborKeys } from "@/config/region-neighbors";
import type { RegionConfig } from "@/lib/types";
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

      {/* ===== HERO — ANIMATED ===== */}
      <HeroContent
        h1={region.h1}
        description={region.description}
        locative={region.locative}
        heroCta={region.heroCta}
        phone={region.phone}
        regionName={region.name}
        badges={getHeroBadges()}
        imageSrc={
          region.key === "praha"
            ? "/images/hero-prague.jpg"
            : `/images/hero-${region.key}.jpg`
        }
        imageAlt={`Panorama ${region.primaryCityLocative} – výkup nemovitostí ${region.locative}`}
      />

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
