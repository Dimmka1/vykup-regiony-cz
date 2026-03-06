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
import { FloatingDesktopCta } from "@/components/floating-desktop-cta";
import { FaqAccordion } from "@/components/faq-accordion";
import { NearbyRegions } from "@/components/nearby-regions";
import { ComparisonCalculator } from "@/components/comparison-calculator";
import { LeadForm } from "@/components/lead-form";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeroStagger } from "@/components/hero-stagger";
import { getRegionSubdomainUrl, isProductionHost } from "@/lib/config";
import type { RegionConfig } from "@/lib/types";
import {
  Check,
  FileText,
  Zap,
  FileSignature,
  Banknote,
  HandCoins,
  Clock,
  ShieldCheck,
  Gavel,
  FileWarning,
  Landmark,
  ScrollText,
  Users,
  Link2,
  CheckCircle,
  Quote,
  Phone,
} from "lucide-react";

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

const HERO_BADGES = [
  `Záloha až ${process.env.NEXT_PUBLIC_ZALOH_VARIANT || "500 000"} Kč ihned`,
  "Peníze na účtu do 48 hodin",
  "Bez provize a skrytých poplatků",
] as const;

function getProcessSteps(region: RegionConfig) {
  return [
    {
      title: "Vyplníte formulář",
      eta: "2 min",
      Icon: FileText,
      description: `Stačí základní údaje o nemovitosti ${region.locative}`,
    },
    {
      title: "Nabídka do 24h",
      eta: "24 h",
      Icon: Zap,
      description: `Připravíme nezávaznou cenovou nabídku pro ${region.name}`,
    },
    {
      title: "Podpis smlouvy",
      eta: "dle dohody",
      Icon: FileSignature,
      description: `Vše vyřídíme za vás ${region.locative}, včetně právního servisu`,
    },
    {
      title: "Peníze na účtu",
      eta: "do 48h",
      Icon: Banknote,
      description: `Výplata ihned po podpisu smlouvy za nemovitost ${region.locative}`,
    },
  ];
}

const TRUST_METRICS = [
  { label: "Bez provize", value: "0 Kč", Icon: HandCoins },
  { label: "Průměrná doba první nabídky", value: "24 h", Icon: Clock },
  { label: "Právní servis zdarma", value: "V ceně", Icon: FileSignature },
  { label: "Garance ceny ve smlouvě", value: "100 %", Icon: ShieldCheck },
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
      Icon: Gavel,
      description: `Vykoupíme nemovitost ${region.locative} i s exekucí a pomůžeme s oddlužením`,
    },
    {
      label: "Insolvence",
      Icon: FileWarning,
      description: `Řešení pro nemovitosti v insolvenčním řízení ${region.locative}`,
    },
    {
      label: "Hypotéka",
      Icon: Landmark,
      description: `Převezmeme nemovitost ${region.locative} se zatížením hypotékou`,
    },
    {
      label: "Dědictví",
      Icon: ScrollText,
      description: `Rychlý výkup zděděných nemovitostí ${region.locative} bez komplikací`,
    },
    {
      label: "Spoluvlastnický podíl",
      Icon: Users,
      description: `Odkoupíme i podíl na nemovitosti ${region.locative} bez souhlasu ostatních`,
    },
    {
      label: "Věcné břemeno",
      Icon: Link2,
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
 * Root domain vykoupim-nemovitost.cz → canonical to https://praha.vykoupim-nemovitost.cz/
 * Dev/preview: use current host with optional path.
 */
export function buildCanonicalUrl(
  host: string | null,
  regionKey?: string,
): string {
  const normalized = normalizeHost(host);
  const isProd = isProductionHost(host);

  if (isProd && regionKey) {
    return getRegionSubdomainUrl(regionKey);
  }

  if (isProd) {
    // Root domain without region key → Praha
    return "https://praha.vykoupim-nemovitost.cz";
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

      {/* ===== HERO ===== */}
      <section className="relative min-h-[520px] overflow-hidden sm:min-h-[480px]">
        <Image
          src={
            region.key === "praha"
              ? "/images/hero-prague.jpg"
              : `/images/hero-${region.key}.jpg`
          }
          alt={`Panorama města ${region.primaryCity} – výkup nemovitostí ${region.locative}`}
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-800/40"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-6 py-24 sm:min-h-[480px]">
          <HeroStagger delay={1}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="glass inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {region.locative}
              </p>
              <p className="glass inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--theme-200)]">
                Nejsme realitka - jsme přímý kupec
              </p>
            </div>
          </HeroStagger>
          <HeroStagger
            delay={2}
            as="h1"
            className="max-w-3xl text-5xl font-extrabold leading-[1.1] tracking-tight text-white md:text-7xl"
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
            {HERO_BADGES.map((badge) => (
              <li
                key={badge}
                className="glass inline-flex items-center gap-1.5 rounded-lg px-3 py-2"
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
              <CtaLink
                href="#kontakt"
                label={region.heroCta}
                regionName={region.name}
              />
              <a
                href={`tel:${region.phone}`}
                aria-label={`Zavolat na číslo ${region.phone}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
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
          </HeroStagger>
        </div>
      </section>

      <SocialProofBar />

      {/* ===== MARKET INFO ===== */}
      {region.marketInfo && (
        <ScrollReveal>
          <section className="bg-gradient-to-b from-slate-50 to-white py-10">
            <div className="mx-auto max-w-7xl px-6">
              <p className="text-center text-sm leading-relaxed text-slate-600 md:text-base">
                {region.marketInfo}
              </p>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ===== TRUST METRICS ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {TRUST_METRICS.map((metric, idx) => (
              <ScrollReveal key={metric.label} delay={idx * 100}>
                <article className="card-hover-lift shadow-layered flex flex-col items-center rounded-2xl bg-white p-6 text-center">
                  <metric.Icon
                    className="mb-3 h-7 w-7 text-[var(--theme-500)]"
                    aria-hidden="true"
                  />
                  <p className="text-3xl font-bold text-[var(--theme-700)]">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE (PROCESS STEPS) ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Jak to funguje
            </h2>
            <p className="mt-2 text-slate-600">
              Od prvního kontaktu k penězům na účtu - jednoduše a rychle.
            </p>
          </ScrollReveal>

          <div className="mt-10 space-y-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                <ScrollReveal
                  delay={0}
                  className="img-zoom-hover shadow-layered relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <Image
                    src="/images/process-consultation.webp"
                    alt={`Činžovní dům v secesním stylu ${region.locative} – expresní výkup nemovitostí`}
                    fill
                    className="object-cover"
                  />
                </ScrollReveal>
                <ScrollReveal
                  delay={100}
                  className="img-zoom-hover shadow-layered relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <Image
                    src="/images/process-valuation.webp"
                    alt={`Rodinný dům k ocenění – profesionální posouzení nemovitosti ${region.locative}`}
                    fill
                    className="object-cover"
                  />
                </ScrollReveal>
              </div>
              <div className="space-y-6">
                {getProcessSteps(region)
                  .slice(0, 2)
                  .map((step, index) => (
                    <ScrollReveal key={step.title} delay={index * 200}>
                      <div className="card-hover-lift shadow-layered flex gap-4 rounded-2xl border border-slate-100 bg-white p-6">
                        <div className="flex flex-col items-center gap-2">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)] text-[var(--theme-600)]">
                            <step.Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-600)] text-xs font-bold text-white">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {step.description}
                          </p>
                          <p className="mt-2 text-xs font-medium text-[var(--theme-600)]">
                            {step.eta}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
              </div>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="order-2 space-y-6 lg:order-1">
                {getProcessSteps(region)
                  .slice(2, 4)
                  .map((step, index) => (
                    <ScrollReveal key={step.title} delay={index * 200}>
                      <div className="card-hover-lift shadow-layered flex gap-4 rounded-2xl border border-slate-100 bg-white p-6">
                        <div className="flex flex-col items-center gap-2">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)] text-[var(--theme-600)]">
                            <step.Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--theme-600)] text-xs font-bold text-white">
                            {index + 3}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-900">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-600">
                            {step.description}
                          </p>
                          <p className="mt-2 text-xs font-medium text-[var(--theme-600)]">
                            {step.eta}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
              </div>
              <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
                <ScrollReveal
                  delay={0}
                  className="img-zoom-hover shadow-layered relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <Image
                    src="/images/process-contract.webp"
                    alt={`Kupní smlouva na nemovitost – bezpečný právní postup ${region.locative}`}
                    fill
                    className="object-cover"
                  />
                </ScrollReveal>
                <ScrollReveal
                  delay={100}
                  className="img-zoom-hover shadow-layered relative aspect-[3/4] overflow-hidden rounded-2xl"
                >
                  <Image
                    src="/images/process-keys.webp"
                    alt={`Předání klíčů novým majitelům – dokončení výkupu ${region.locative}`}
                    fill
                    className="object-cover"
                  />
                </ScrollReveal>
              </div>
            </div>
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
      <section className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Řešíme i složité situace
            </h2>
            <p className="mt-2 text-slate-600">
              Nemovitost s problémem? Žádný strach - máme řešení pro každou
              situaci.
            </p>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getComplexSituations(region).map((situation, idx) => (
              <ScrollReveal key={situation.label} delay={idx * 80}>
                <div className="card-hover-lift shadow-layered flex gap-4 rounded-2xl border border-slate-100 bg-white p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-50)] text-[var(--theme-600)]">
                    <situation.Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {situation.label}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                      {situation.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="mt-6 text-center">
              <Link
                href="/vykup-pri-exekuci"
                className="mr-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Více informací o výkupu nemovitostí při exekuci"
              >
                Výkup při exekuci →
              </Link>
              <Link
                href="/vykup-pri-dedictvi"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
                aria-label="Více informací o výkupu nemovitostí při dědictví"
              >
                Výkup při dědictví →
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== VISUAL BREAK: PROPERTY EXTERIOR ===== */}
      <section className="relative h-[150px] sm:h-[200px] lg:h-[250px]">
        <Image
          src="/images/property-exterior.jpg"
          alt={`Rezidenční čtvrť v České republice – nemovitosti k výkupu ${region.locative}`}
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/50"
          aria-hidden="true"
        />
        <div className="relative flex h-full items-center justify-center px-6">
          <p className="text-center text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Pomáháme majitelům nemovitostí {region.locative} i po celé České
            republice
          </p>
        </div>
      </section>

      {/* ===== PROČ KLIENTI VOLÍ NÁS (USP) ===== */}
      <section className="bg-gradient-to-br from-[var(--theme-700)] via-[var(--theme-800)] to-[var(--theme-900)] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
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
        </div>
      </section>

      {/* ===== O NÁS ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <ScrollReveal className="img-zoom-hover shadow-layered relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/images/property-exterior.jpg"
                alt={`Rezidenční nemovitosti v ${region.name} – profesionální výkup v celém kraji`}
                fill
                className="object-cover"
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

      {/* ===== PROPERTY ESTIMATOR ===== */}

      {/* ===== COMPARISON CALCULATOR ===== */}
      <ComparisonCalculator />

      {/* ===== LEAD FORM + CO SE STANE PO ODESLÁNÍ ===== */}
      <section
        className="border-t border-[var(--theme-200)] bg-gradient-to-b from-[var(--theme-50)] to-white py-20"
        id="kontakt"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <ScrollReveal>
              <LeadForm regionName={region.name} />
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="shadow-layered rounded-2xl border border-slate-100 bg-white p-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Co se stane po odeslání
                </h2>
                <ul className="mt-6 space-y-4">
                  {FORM_BENEFITS.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-600)]">
                        <Check className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="img-zoom-hover relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src="/images/texture-brick.webp"
                    alt={`Historická cihlová zeď – tradice a spolehlivost výkupu nemovitostí ${region.locative}`}
                    fill
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-slate-900/40"
                    aria-hidden="true"
                  />
                  <div className="relative flex h-full items-center justify-center px-6">
                    <p className="text-center text-lg font-bold text-white">
                      Férové jednání je náš standard
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Nezávazná konzultace zdarma
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Primárně {region.primaryCity} a okolí, dále:{" "}
                    {region.supportedCities.join(", ")}.
                  </p>
                  <p className="mt-4 text-xs text-slate-500">
                    {region.legalDisclaimer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <PropertyEstimator regionKey={region.key} />

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-20">
        <Image
          src="/images/testimonial-bg.jpg"
          alt={`Střechy českého města při západu slunce – výkup nemovitostí ${region.locative}`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/90" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Co říkají naši klienti {region.locative}
            </h2>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(region.testimonials ?? []).map((testimonial, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <Quote
                    className="mb-3 h-6 w-6 text-[var(--theme-300)]"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-slate-600">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-100)] text-xs font-bold text-[var(--theme-700)]">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISUAL BREAK: HAPPY FAMILY HOME ===== */}
      <section className="relative h-[150px] sm:h-[200px] lg:h-[250px]">
        <Image
          src="/images/happy-family-home.jpg"
          alt={`Moderní rodinný dům se zahradou – nemovitosti k výkupu ${region.locative}`}
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-slate-900/40"
          aria-hidden="true"
        />
        <div className="relative flex h-full items-center justify-center px-6">
          <p className="text-center text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Vaše nemovitost {region.locative} si zaslouží férové jednání
          </p>
        </div>
      </section>

      {/* ===== NEARBY REGIONS ===== */}
      <NearbyRegions regionKey={region.key} currentHost={currentHost} />

      {/* ===== REGION FAQ ===== */}
      {region.regionFaq && region.regionFaq.length > 0 && (
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal>
              <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
                Otázky k výkupu {region.locative}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="mt-8">
                <FaqAccordion items={region.regionFaq} />
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Časté dotazy
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-8">
              <FaqAccordion
                items={[...getRegionalFaq(region), ...region.faq]}
              />
            </div>
          </ScrollReveal>
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
