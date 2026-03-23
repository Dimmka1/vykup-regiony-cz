import { safeJsonLd } from "@/lib/jsonld";
import { resolveGeoRegion } from "@/lib/geo-seo";
import { REGION_PRICES, formatPricePerM2 } from "@/lib/price-data";

/** Human-readable service names for each use-case slug */
const SERVICE_NAMES: Record<string, string> = {
  "vykup-bytu": "Výkup bytů",
  "vykup-domu": "Výkup domů",
  "vykup-pozemku": "Výkup pozemků",
  "vykup-pri-exekuci": "Výkup nemovitostí při exekuci",
  "vykup-pri-dedictvi": "Výkup nemovitostí při dědictví",
  "vykup-pri-rozvodu": "Výkup nemovitostí při rozvodu",
  "vykup-spoluvlastnickeho-podilu": "Výkup spoluvlastnického podílu",
  "vykup-nemovitosti-s-hypotekou": "Výkup nemovitostí s hypotékou",
  "vykup-nemovitosti-s-vecnym-bremenem": "Výkup nemovitostí s věcným břemenem",
  "zpetny-najem": "Zpětný nájem nemovitosti",
  "vykup-cinzovnich-domu": "Výkup činžovních domů",
  "vykup-pri-privatizaci": "Výkup nemovitostí při privatizaci",
};

function buildPriceRange(regionKey: string): string | null {
  const prices = REGION_PRICES[regionKey];
  if (!prices) return null;
  const min = Math.min(prices.bytM2, prices.dumM2, prices.pozemekM2);
  const max = Math.max(prices.bytM2, prices.dumM2, prices.pozemekM2);
  return `${formatPricePerM2(min)} – ${formatPricePerM2(max)}`;
}

interface GeoServiceJsonLdProps {
  useCaseSlug: string;
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * VR-344: Render Service JSON-LD for geo pages (?kraj=).
 * Returns null when no valid ?kraj= param is present.
 */
export function GeoServiceJsonLd({
  useCaseSlug,
  searchParams,
}: GeoServiceJsonLdProps): React.ReactElement | null {
  const region = resolveGeoRegion(searchParams);
  if (!region) return null;

  const serviceName = SERVICE_NAMES[useCaseSlug] ?? "Výkup nemovitostí";
  const priceRange = buildPriceRange(region.key);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceName} ${region.locative}`,
    description: `${serviceName} ${region.locative}. Rychlý výkup za férovou cenu 80–90 % tržní hodnoty, vyplacení do 7 dnů.`,
    provider: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: region.name,
    },
    serviceType: "Výkup nemovitostí",
    url: `https://vykoupim-nemovitost.cz/${useCaseSlug}?kraj=${region.key}`,
  };

  if (priceRange) {
    jsonLd.priceRange = priceRange;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
