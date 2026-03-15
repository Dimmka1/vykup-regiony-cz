import {
  getHeroPriceBadge,
  MAX_ZALOHA,
  PRICE_PERCENT,
  type PricingVariant,
  DEFAULT_PRICING_VARIANT,
} from "@/lib/pricing";
import { safeJsonLd } from "@/lib/jsonld";
import { SocialProofBar } from "@/components/social-proof-bar";
import { getThemeStyle } from "@/lib/theme-colors";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CtaLink } from "@/components/cta-link";
import { CallbackForm } from "@/components/callback-form";
import { PropertyEstimator } from "@/components/property-estimator";
import { ScrollTracker } from "@/components/scroll-tracker";
import { HeroImage } from "@/components/hero-image";
import { FloatingDesktopCta } from "@/components/floating-desktop-cta";
import { FaqAccordion } from "@/components/faq-accordion";
import { ParallaxImage } from "@/components/parallax-image";
import { ParallaxSection } from "@/components/parallax-section";
import { NearbyRegions } from "@/components/nearby-regions";
import { ComparisonCalculator } from "@/components/comparison-calculator";
import { ScrollReveal } from "@/components/scroll-reveal";
import { StaggerReveal, StaggerItem } from "@/components/stagger-reveal";
import { HeroStagger } from "@/components/hero-stagger";
import { AnimatedNumber } from "@/components/animated-number";
import { CzechMap } from "@/components/czech-map";
import { BuildingTimeline } from "@/components/building-timeline";
import { FloatingStats } from "@/components/floating-stats";
import { DoorCards } from "@/components/door-cards";
import { LeadForm } from "@/components/lead-form";
import { SlotCounter } from "@/components/slot-counter";
import {
  getRegionSubdomainUrl,
  isProductionHost,
  listRegions,
} from "@/lib/config";
import type { RegionConfig } from "@/lib/types";
import {
  Check,
  FileText,
  Zap,
  FileSignature,
  FilePenLine,
  Banknote,
  CheckCircle,
  Quote,
  Phone,
  TrendingUp,
  MapPin,
  Building,
  Star,
  RefreshCw,
} from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { QuoteBubbles } from "@/components/quote-bubbles";
import {
  testimonials as allTestimonials,
  averageRating as globalAvgRating,
} from "@/data/testimonials";

export const COMPANY_NAME = "Vykoupím Nemovitost";

export function getRegionalFaq(
  region: RegionConfig,
): { question: string; answer: string }[] {
  return [
    {
      question: `Jak dlouho trvá celý proces výkupu nemovitosti ${region.locative}?`,
      answer: `Celý proces výkupu nemovitosti ${region.locative} trvá obvykle 7–14 dní od prvního kontaktu. V urgentních případech v ${region.primaryCity} a okolí dokážeme vše vyřídit i do 48 hodin.`,
    },
    {
      question: `Kolik peněz za nemovitost ${region.locative} dostanu?`,
      answer: `Nabízíme férovou tržní cenu stanovenou na základě aktuálních dat z realitního trhu ${region.locative} a individuálního posouzení stavu nemovitosti. Cenovou nabídku pro ${region.name} dostanete zdarma a nezávazně do 24 hodin.`,
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
      answer: `Ano, ${region.locative} běžně řešíme nemovitosti zatížené hypotékou, exekucí, věcným břemenem nebo zástavním právem. Pomůžeme vám s vypořádáním všech závazků v rámci výkupu v ${region.primaryCity} a okolí.`,
    },
    {
      question: `Jak probíhá ocenění nemovitosti ${region.locative}?`,
      answer: `Po vyplnění formuláře náš odborník provede analýzu na základě lokality ${region.locative}, stavu a aktuálních tržních cen v ${region.primaryCity}. U složitějších případů nabídneme osobní prohlídku. Ocenění je vždy zdarma a nezávazné.`,
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
      description: `Připravíme nezávaznou cenovou nabídku pro ${region.name}`,
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

const TRUST_METRICS = [
  { label: "Bez provize", value: "0 Kč", icon: "HandCoins" },
  { label: "Průměrná doba první nabídky", value: "24 h", icon: "Clock" },
  { label: "Právní servis zdarma", value: "V ceně", icon: "FileSignature" },
  { label: "Garance ceny ve smlouvě", value: "100 %", icon: "ShieldCheck" },
] as const;

const ABOUT_STATS = [
  { value: "100%", label: "transparentnost" },
  { value: "0 Kč", label: "provize" },
  { value: "14", label: "krajů ČR" },
] as const;

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

const FORM_BENEFITS = [
  "Zavoláme vám do 30 minut",
  "Připravíme nezávaznou nabídku",
  "Nabídku dostanete do 24 hodin",
  "Vše zdarma a bez závazků",
] as const;

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

export function buildSchema(
  region: RegionConfig,
  canonicalUrl: string,
): object[] {
  const ogImageUrl = `${canonicalUrl}/opengraph-image`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: COMPANY_NAME,
      url: "https://vykoupim-nemovitost.cz",
      logo: "https://vykoupim-nemovitost.cz/icon.svg",
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
      "@type": "RealEstateAgent",
      name: `Výkup Nemovitostí - ${region.name}`,
      description:
        "Rychlý výkup nemovitostí v celé České republice. Nabídka do 24 hodin, peníze na účtu do 3 dnů.",
      telephone: region.phone,
      email: region.email,
      url: canonicalUrl,
      priceRange: "$$",
      image: ogImageUrl,
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
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Služby výkupu nemovitostí",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Rychlý výkup nemovitosti",
            description:
              "Nabídka do 24 hodin, vyplacení do 3 dnů. Vykupujeme byty, domy, pozemky i spoluvlastnické podíly.",
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Záloha při podpisu smlouvy",
            description:
              "Záloha vyplacena ihned při podpisu kupní smlouvy. Jistota a transparentnost.",
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            name: "Výkup bez provize",
            description:
              "Žádná provize, žádné skryté poplatky. Právní servis a odhad nemovitosti zdarma.",
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
          },
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        ...getRegionalFaq(region).map((item) => ({
          "@type": "Question" as const,
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer" as const,
            text: item.answer,
          },
        })),
        ...region.faq.map((item) => ({
          "@type": "Question" as const,
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer" as const,
            text: item.answer,
          },
        })),
        ...(region.regionFaq ?? []).map((item) => ({
          "@type": "Question" as const,
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer" as const,
            text: item.answer,
          },
        })),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": canonicalUrl + "#business",
      name: `Výkup nemovitostí ${region.name}`,
      description: region.seoDescription,
      url: canonicalUrl,
      telephone: region.phone,
      email: region.email,
      areaServed: {
        "@type": "AdministrativeArea",
        name: region.name,
      },
      address: {
        "@type": "PostalAddress",
        addressRegion: region.name,
        addressCountry: "CZ",
      },
      priceRange: "$$",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
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
          alt={`Panorama města ${region.primaryCity} – výkup nemovitostí ${region.locative}`}
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
              <span>Důvěřuje nám 500+ klientů v celé ČR</span>
            </div>
          </HeroStagger>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent" />
      </section>

      <SocialProofBar />

      {/* ===== ZPĚTNÝ ODKUP BADGE ===== */}
      <ScrollReveal>
        <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-5">
          <div className="mx-auto max-w-[1400px] px-6">
            <Link
              href="/zpetny-najem"
              className="mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-white/80 px-6 py-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                <RefreshCw
                  className="h-5 w-5 text-emerald-600"
                  aria-hidden="true"
                />
              </span>
              <span className="text-sm font-semibold text-slate-800 sm:text-base">
                Možnost zpětného odkupu nemovitosti
              </span>
              <span className="ml-auto text-xs font-medium text-emerald-600">
                Zjistit více →
              </span>
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* ===== MARKET INFO ===== */}
      {region.marketInfo && (
        <ScrollReveal>
          <section className="bg-gradient-to-b from-slate-50 to-white py-10">
            <div className="mx-auto max-w-[1400px] px-6">
              <p className="text-center text-sm leading-relaxed text-slate-600 md:text-base">
                {region.marketInfo}
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ===== TRH V REGIONU ===== */}
      {region.marketAnalysis && (
        <section className="section-md bg-luxury-mesh relative overflow-hidden">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <ScrollReveal>
                <div className="lg:sticky lg:top-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <TrendingUp className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Trh v regionu {region.name}
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                  {region.marketAnalysis}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== JAK PROBÍHÁ VÝKUP ===== */}
      {region.localProcess && (
        <section className="section-md bg-luxury-warm">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <ScrollReveal>
                <div className="lg:sticky lg:top-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <Building className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Jak probíhá výkup {region.locative}
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                  {region.localProcess}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== KDE VYKUPUJEME ===== */}
      {region.neighborhoodGuide && (
        <section className="section-md bg-luxury-mesh relative overflow-hidden">
          <div className="container-wide">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
              <ScrollReveal>
                <div className="lg:sticky lg:top-28">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                    Kde vykupujeme {region.locative}
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                  {region.neighborhoodGuide}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      {/* ===== TRUST METRICS — 3D FLOATING CARDS ===== */}
      <section className="bg-luxury-mesh noise-overlay section-lg relative overflow-hidden">
        <div className="orb orb-theme-1 -right-40 -top-40" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 left-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-600)]">
                Výsledky mluví za nás
              </p>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                Proč nám důvěřují stovky klientů
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Transparentní a férový výkup bez skrytých poplatků — od prvního
                kontaktu po peníze na účtu
              </p>
            </div>
          </ScrollReveal>
          <FloatingStats metrics={TRUST_METRICS} />
          <ScrollReveal delay={300}>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--theme-100)] bg-white/60 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)]">
                  <Star
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Férová cena stanovená na základě aktuálního trhu
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--theme-100)] bg-white/60 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)]">
                  <FileSignature
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Advokátní úschova kupní ceny pro vaši bezpečnost
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--theme-100)] bg-white/60 p-6 text-center backdrop-blur-sm">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)]">
                  <Banknote
                    className="h-6 w-6 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Záloha vyplacena ihned při podpisu smlouvy
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE — BUILDING TIMELINE ===== */}
      <section className="section-md bg-luxury-warm noise-overlay">
        <div className="container-wide">
          <ScrollReveal>
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Jak to funguje
                </h2>
                <p className="mt-2 text-slate-600">
                  Od prvního kontaktu k penězům na účtu — sledujte, jak vaše
                  budoucnost roste.
                </p>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src="/images/section-process.jpg"
                  alt="Proces výkupu nemovitosti – profesionální jednání"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-10">
            <BuildingTimeline steps={getProcessSteps(region)} />
          </div>

          <ScrollReveal>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/jak-to-funguje"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Zjistěte více o celém procesu výkupu nemovitostí"
              >
                Více o celém procesu →
              </Link>
              <Link
                href="/garance-vykupu"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Prohlédněte si naše garance výkupu"
              >
                Naše garance →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== ŘEŠÍME I SLOŽITÉ SITUACE ===== */}
      <section className="bg-luxury-dark relative overflow-hidden py-20 md:py-28">
        <div className="orb orb-theme-1 -left-40 -top-40" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 right-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Řešíme i složité situace
            </h2>
            <p className="mt-2 text-slate-300">
              Nemovitost s problémem? Žádný strach - máme řešení pro každou
              situaci.
            </p>
          </ScrollReveal>
          <div className="mt-8">
            <DoorCards situations={getComplexSituations(region)} />
          </div>
          <ScrollReveal>
            <div className="mt-6 text-center">
              <Link
                href="/vykup-pri-exekuci"
                className="mr-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                aria-label="Více informací o výkupu nemovitostí při exekuci"
              >
                Výkup při exekuci →
              </Link>
              <Link
                href="/vykup-pri-dedictvi"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
                aria-label="Více informací o výkupu nemovitostí při dědictví"
              >
                Výkup při dědictví →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== VISUAL BREAK: PROPERTY EXTERIOR ===== */}
      <section className="relative flex h-[350px] items-center justify-center overflow-hidden sm:h-[400px] lg:h-[450px]">
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80"
          alt={`Rezidenční nemovitost ${region.locative} – profesionální výkup`}
          fill
          loading="lazy"
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-900/50"
          aria-hidden="true"
        />
        <div className="relative px-6">
          <p className="text-center text-xl font-bold text-white drop-shadow-lg sm:text-2xl lg:text-3xl">
            Pomáháme majitelům nemovitostí {region.locative} i po celé České
            republice
          </p>
        </div>
      </section>

      {/* ===== PROČ KLIENTI VOLÍ NÁS (USP) ===== */}
      <ParallaxSection offset={20}>
        <section className="section-md bg-gradient-to-br from-[var(--theme-700)] via-[var(--theme-800)] to-[var(--theme-900)] text-white">
          <div className="mx-auto max-w-[1400px] px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Proč klienti volí nás
              </h2>
            </ScrollReveal>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {region.uspPoints.map((point, idx) => (
                <ScrollReveal key={point} delay={idx * 100} as="li">
                  <div className="glass flex h-full items-start gap-3 rounded-2xl p-6">
                    <CheckCircle
                      className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-400)]"
                      aria-hidden="true"
                    />
                    <span className="text-white/90">{point}</span>
                  </div>
                </ScrollReveal>
              ))}
            </ul>
            <ScrollReveal delay={400}>
              <div className="mt-8 text-center">
                <Link
                  href="/zpetny-najem"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/90 transition hover:text-white"
                  aria-label="Zjistěte více o zpětném nájmu a možnosti odkupu nemovitosti"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Zpětný nájem — prodejte a zůstaňte bydlet →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </ParallaxSection>

      {/* ===== O NÁS ===== */}
      <section className="section-lg bg-luxury-mesh relative overflow-hidden">
        <div className="orb orb-theme-2 -left-40 top-20" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <ScrollReveal className="shadow-layered relative aspect-[4/3] rounded-3xl">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80"
                alt={`Moderní bydlení – transparentní výkup nemovitostí`}
                className="aspect-[4/3] rounded-3xl"
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  O nás
                </h2>
                <p className="mt-4 leading-relaxed text-slate-700">
                  Specializujeme se na rychlý a férový výkup nemovitostí{" "}
                  {region.locative}. Nabízíme transparentní proces, férovou cenu
                  a kompletní právní servis zdarma. V {region.primaryCity} a
                  okolí jsme pro vás k dispozici osobně, po celém {region.name}{" "}
                  zajistíme kompletní servis na dálku.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {ABOUT_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="border-l-2 border-[var(--theme-500)] pl-4"
                    >
                      <p className="text-2xl font-bold text-[var(--theme-700)]">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    href="/proc-my"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                    aria-label="Zjistěte proč si vybrat nás pro výkup nemovitostí"
                  >
                    Zjistěte více o nás →
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== REFERENCE — TESTIMONIALS ===== */}
      <section className="bg-luxury-dark relative overflow-hidden py-20 md:py-28">
        <div className="orb orb-theme-1 -right-40 top-10" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 left-10"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1400px] px-6">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[var(--theme-400)]">
                Reference
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Co říkají naši klienti
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
                Přečtěte si skutečné příběhy klientů z celé České republiky
              </p>
            </div>
          </ScrollReveal>
          <QuoteBubbles
            testimonials={allTestimonials.slice(0, 6).map((t) => ({
              name: t.name,
              text: t.quote,
              location: t.city,
              date: t.date,
            }))}
          />
          <ScrollReveal>
            <div className="mt-10 text-center">
              <a
                href="/reference"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-300)] transition hover:text-[var(--theme-200)]"
              >
                Všechny reference →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PROPERTY ESTIMATOR ===== */}

      {/* ===== COMPARISON CALCULATOR ===== */}
      <ComparisonCalculator />

      {/* ===== LEAD FORM + CO SE STANE PO ODESLÁNÍ ===== */}
      <section
        className="section-md relative overflow-hidden bg-slate-900"
        id="kontakt"
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
        <div className="container-wide relative">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                Získejte nezávaznou nabídku
              </h2>
              <p className="mt-3 text-lg text-slate-400">
                Vyplňte formulář a my vás kontaktujeme do 30 minut
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: benefits */}
            <ScrollReveal delay={200}>
              <div className="flex flex-col justify-center">
                <div className="mb-8 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[var(--theme-400)] md:text-4xl">
                      <SlotCounter value="500+" />
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      spokojených klientů
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[var(--theme-400)] md:text-4xl">
                      <SlotCounter value="14" />
                    </p>
                    <p className="mt-1 text-xs text-slate-400">krajů ČR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-extrabold text-[var(--theme-400)] md:text-4xl">
                      <SlotCounter value="48h" />
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      peníze na účtu
                    </p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Co se stane po odeslání
                </h3>
                <ul className="mt-6 space-y-5">
                  {FORM_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--theme-600)] text-white">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-lg text-slate-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white">
                    Nezávazná konzultace zdarma
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Primárně {region.primaryCity} a okolí, dále:{" "}
                    {region.supportedCities.join(", ")}.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {region.legalDisclaimer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
            {/* Right: form */}
            <ScrollReveal delay={400}>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <LeadForm regionName={region.name} />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <PropertyEstimator regionKey={region.key} />

      {/* ===== NEARBY REGIONS ===== */}
      <NearbyRegions regionKey={region.key} currentHost={currentHost} />

      {/* ===== REGION FAQ ===== */}
      {((region.regionFaq && region.regionFaq.length > 0) ||
        (region.additionalFaq && region.additionalFaq.length > 0)) && (
        <section className="section-md bg-gradient-to-b from-slate-50 to-white">
          <div className="container-narrow">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Otázky k výkupu {region.locative}
                </h2>
                <p className="mt-3 text-lg text-slate-600">
                  Odpovědi na nejčastější dotazy specifické pro váš region
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="mt-10">
                <FaqAccordion
                  items={[
                    ...(region.regionFaq ?? []),
                    ...(region.additionalFaq ?? []),
                  ]}
                />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section className="section-md">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Časté dotazy
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Vše, co potřebujete vědět o výkupu nemovitostí
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-10">
              <FaqAccordion
                items={[...getRegionalFaq(region), ...region.faq]}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== PŮSOBÍME V CELÉ ČR — INTERACTIVE MAP ===== */}
      <section className="section-md relative overflow-hidden bg-slate-900">
        <div className="orb orb-theme-1 -left-40 top-10" aria-hidden="true" />
        <div
          className="orb orb-theme-2 -bottom-20 -right-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-6">
          <ScrollReveal>
            <h2 className="mb-4 text-center text-2xl font-bold text-white sm:text-3xl">
              Působíme v celé České republice
            </h2>
            <p className="mb-10 text-center text-slate-400">
              Klikněte na kraj pro více informací
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <CzechMap currentRegion={region.key} />
          </ScrollReveal>
          {/* Fallback region links for SEO */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {listRegions().map((r) => (
              <a
                key={r.key}
                href={getRegionSubdomainUrl(r.key)}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-center text-sm text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
              >
                Výkup {r.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STICKY MOBILE BAR ===== */}
      <nav
        aria-label="Rychlé akce – kontakt a telefon"
        className="mobile-bar-glass fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 px-4 py-3 supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <p className="mb-2 text-center text-xs text-slate-500">
          ✓ Bez provize &nbsp;·&nbsp; ✓ Nabídka do 24h &nbsp;·&nbsp; ✓ Právní
          servis zdarma
        </p>
        <div className="mx-auto flex max-w-7xl gap-2">
          <a
            href="#kontakt"
            className="cta-glow btn-ripple inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-4 py-3 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
            aria-label="Odeslat nezávaznou poptávku výkupu nemovitosti zdarma"
          >
            Odeslat poptávku - zdarma
          </a>
          <a
            href={`tel:${region.phone}`}
            className="btn-ripple inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
            aria-label={`Zavolat na číslo ${region.phone}`}
          >
            Zavolat
          </a>
        </div>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
      />
    </div>
  );
}
