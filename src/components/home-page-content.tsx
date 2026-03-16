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
  isProductionHost,
  listRegions,
} from "@/lib/config";
import { getNeighborKeys } from "@/config/region-neighbors";
import type { RegionConfig } from "@/lib/types";
import { Check, Phone } from "lucide-react";

export const COMPANY_NAME = "Vykoupím Nemovitost";

export function getRegionalFaq(
  region: RegionConfig,
): { question: string; answer: string }[] {
  return [
    {
      question: `Jak dlouho trvá celý proces výkupu nemovitosti ${region.locative}?`,
      answer: `Celý proces výkupu nemovitosti ${region.locative} trvá obvykle 7–14 dní od prvního kontaktu. V urgentních případech ${region.primaryCityLocative} a okolí dokážeme vše vyřídit i do 48 hodin.`,
    },
    {
      question: `Kolik peněz za nemovitost ${region.locative} dostanu?`,
      answer: `Nabízíme férovou tržní cenu stanovenou na základě aktuálních dat z realitního trhu ${region.locative} a individuálního posouzení stavu nemovitosti. Cenovou nabídku pro ${region.accusative} dostanete zdarma a nezávazně do 24 hodin.`,
    },
    {
      question: `Je výkup nemovitosti ${region.locative} bezpečný?`,
      answer: `Ano. Celý proces výkupu ${region.locative} zajišťují naši právníci, kupní smlouvu připravujeme s advokátní úschovou kupní ceny. Peníze jsou chráněny na úschovním účtu a uvolněny až po zápisu do katastru.`,
    },
    {
      question: "Musím platit provizi nebo nějaké poplatky?",
      answer: `Ne. Výkup nemovitosti ${region.locative} je pro vás zcela bez poplatků a bez provize. Veškeré náklady spojené s převodem, včetně právního servisu a poplatků za katastr, hradíme my.`,
    },
    {
      question: `Vykupujete ${region.locative} i nemovitosti s hypotékou nebo exekucí?`,
      answer: `Ano, ${region.locative} běžně řešíme nemovitosti zatížené hypotékou, exekucí, věcným břemenem nebo zástavním právem. Pomůžeme vám s vypořádáním všech závazků v rámci výkupu ${region.primaryCityLocative} a okolí.`,
    },
    {
      question: `Jak probíhá ocenění nemovitosti ${region.locative}?`,
      answer: `Po vyplnění formuláře náš odborník provede analýzu na základě lokality ${region.locative}, stavu a aktuálních tržních cen ${region.primaryCityLocative}. U složitějších případů nabídneme osobní prohlídku. Ocenění je vždy zdarma a nezávazné.`,
    },
  ];
}

function getHeroBadges(
  variant: PricingVariant = DEFAULT_PRICING_VARIANT,
): string[] {
  return [
    getHeroPriceBadge(variant),
    "Peníze na účtu do 48 hodin",
    "Bez provize a skrytých poplatků",
  ];
}

function getProcessSteps(region: RegionConfig) {
  return [
    {
      title: "Vyplníte formulář",
      eta: "2 min",
      icon: "FileText",
      description: `Stačí základní údaje o nemovitosti ${region.locative}`,
    },
    {
      title: "Nabídka do 24h",
      eta: "24 h",
      icon: "Zap",
      description: `Připravíme nezávaznou cenovou nabídku pro ${region.accusative}`,
    },
    {
      title: "Podpis smlouvy",
      eta: "dle dohody",
      icon: "FilePenLine",
      description: `Vše vyřídíme za vás ${region.locative}, včetně právního servisu`,
    },
    {
      title: "Peníze na účtu",
      eta: "do 48h",
      icon: "Banknote",
      description: `Výplata ihned po podpisu smlouvy za nemovitost ${region.locative}`,
    },
  ];
}

function getComplexSituations(region: RegionConfig) {
  return [
    {
      label: "Exekuce",
      icon: "Gavel",
      description: `Vykoupíme nemovitost ${region.locative} i s exekucí a pomůžeme s oddlužením`,
    },
    {
      label: "Insolvence",
      icon: "FileWarning",
      description: `Řešení pro nemovitosti v insolvenčním řízení ${region.locative}`,
    },
    {
      label: "Hypotéka",
      icon: "Landmark",
      description: `Převezmeme nemovitost ${region.locative} se zatížením hypotékou`,
    },
    {
      label: "Dědictví",
      icon: "ScrollText",
      description: `Rychlý výkup zděděných nemovitostí ${region.locative} bez komplikací`,
    },
    {
      label: "Spoluvlastnický podíl",
      icon: "Users",
      description: `Odkoupíme i podíl na nemovitosti ${region.locative} bez souhlasu ostatních`,
    },
    {
      label: "Věcné břemeno",
      icon: "Link2",
      description: `Nemovitosti s věcným břemenem ${region.locative} nejsou problém`,
    },
  ];
}

export function normalizeHost(host: string | null): string {
  if (!host) {
    return "vykoupim-nemovitost.cz";
  }
  return host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
}

/**
 * Build canonical URL for a page.
 * Production: always use the subdomain URL (e.g., https://praha.vykoupim-nemovitost.cz/)
 * Root domain vykoupim-nemovitost.cz → self-referencing canonical
 * Dev/preview: use current host with optional path.
 */
export function buildCanonicalUrl(
  host: string | null,
  regionKey?: string,
): string {
  const normalized = normalizeHost(host);
  const isProd = isProductionHost(host);

  // National (geo-neutral) config → root domain canonical
  if (regionKey === "national") {
    return "https://vykoupim-nemovitost.cz";
  }

  if (isProd && regionKey) {
    return getRegionSubdomainUrl(regionKey);
  }

  if (isProd) {
    // Root domain without region key → national homepage
    return "https://vykoupim-nemovitost.cz";
  }

  // Dev/preview: use current host
  const base = `https://${normalized}`;
  if (regionKey) {
    return `${base}/${regionKey}`;
  }
  return base;
}

export function buildMetaDescription(region: RegionConfig): string {
  const uspSnippet = region.uspPoints.slice(0, 2).join(" • ");
  const base = `${region.description} ${uspSnippet}. Nezávazná nabídka do 24 hodin.`;
  if (base.length <= 160) {
    return base;
  }
  const sentenceBoundary = base.lastIndexOf(".", 160);
  if (sentenceBoundary >= 120) {
    return base.slice(0, sentenceBoundary + 1).trim();
  }
  return `${base.slice(0, 157).trimEnd()}...`;
}

/**
 * Build JSON-LD schema for homepage.
 * Consolidated: RealEstateAgent (merges Organization + LocalBusiness),
 * FAQPage (limited to 6 items), Service (without verbose OfferCatalog).
 */
export function buildSchema(
  region: RegionConfig,
  canonicalUrl: string,
): object[] {
  const ogImageUrl = `${canonicalUrl}/opengraph-image`;

  // Limit FAQ items to reduce payload: 2 from each source
  const faqItems = [
    ...getRegionalFaq(region).slice(0, 2),
    ...region.faq.slice(0, 2),
    ...(region.regionFaq ?? []).slice(0, 2),
  ];

  return [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": `${canonicalUrl}#business`,
      name: `${COMPANY_NAME} – ${region.name}`,
      description:
        region.seoDescription ||
        `Rychlý výkup nemovitostí ${region.locative}. Nabídka do 24 hodin, peníze do 3 dnů.`,
      telephone: region.phone,
      email: region.email,
      url: canonicalUrl,
      priceRange: "$$",
      image: ogImageUrl,
      logo: "https://vykoupim-nemovitost.cz/icon.svg",
      areaServed: {
        "@type": "AdministrativeArea",
        name: region.name,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: region.primaryCity,
        addressRegion: region.name,
        addressCountry: "CZ",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: region.phone,
        contactType: "customer service",
        areaServed: "CZ",
        availableLanguage: "Czech",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question" as const,
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: item.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Výkup nemovitostí – ${region.name}`,
      description: `Rychlý výkup nemovitostí ${region.locative}. Nabídka do 24 hodin, peníze do 3 dnů. Bez provize, právní servis zdarma.`,
      serviceType: "Výkup nemovitostí",
      areaServed: {
        "@type": "AdministrativeArea",
        name: region.name,
      },
      provider: {
        "@type": "Organization",
        name: COMPANY_NAME,
        url: "https://vykoupim-nemovitost.cz",
        telephone: region.phone,
      },
    },
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

        <div className="hero-blob" aria-hidden="true" />
        <div className="hero-blob-2" aria-hidden="true" />
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
            <p className="mt-4 hidden max-w-2xl text-base leading-relaxed text-slate-200 md:block md:text-lg">
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="liquid-border rounded-xl">
                <CtaLink
                  href="#kontakt"
                  label={region.heroCta}
                  regionName={region.name}
                />
              </span>
              <a
                href={`tel:${region.phone}`}
                aria-label={`Zavolat na číslo ${region.phone}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Zavolat: {region.phone}
              </a>
            </div>
            <div className="mt-4">
              <CallbackForm regionName={region.name} />
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Zálohu vyplácíme při podpisu smlouvy. Celý proces trvá 3–7 dní.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-white/80">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>Férový výkup nemovitostí v celé ČR</span>
            </div>
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
