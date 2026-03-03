import { safeJsonLd } from "@/lib/jsonld";
import { SocialProofBar } from "@/components/social-proof-bar";
import { getThemeStyle } from "@/lib/theme-colors";
import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LeadForm } from "@/components/lead-form";
import { CallbackForm } from "@/components/callback-form";
import { AnimatedCounter } from "@/components/animated-counter";
import { ScrollTracker } from "@/components/scroll-tracker";
import { PropertyEstimator } from "@/components/property-estimator";
import { ComparisonCalculator } from "@/components/comparison-calculator";
import { FloatingDesktopCta } from "@/components/floating-desktop-cta";
import { FaqAccordion } from "@/components/faq-accordion";
import { NearbyRegions } from "@/components/nearby-regions";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
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
  Banknote,
  Award,
  Clock,
  Star,
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

export const COMPANY_NAME = "Výkup Regiony CZ";

export const GENERAL_FAQ: { question: string; answer: string }[] = [
  {
    question: "Jak dlouho trvá celý proces výkupu nemovitosti?",
    answer:
      "Celý proces od prvního kontaktu po vyplacení peněz trvá obvykle 7–14 dní. V urgentních případech dokážeme vše vyřídit i do 48 hodin. Záleží na složitosti případu a stavu katastru nemovitostí.",
  },
  {
    question: "Kolik peněz za svou nemovitost dostanu?",
    answer:
      "Nabízíme férovou tržní cenu stanovenou na základě aktuálních dat z realitního trhu a individuálního posouzení stavu nemovitosti. Cenovou nabídku dostanete zdarma a nezávazně do 24 hodin.",
  },
  {
    question: "Je výkup nemovitosti bezpečný?",
    answer:
      "Ano. Celý proces zajišťují naši právníci, kupní smlouvu připravujeme s advokátní úschovou kupní ceny. Peníze jsou chráněny na úschovním účtu a uvolněny až po zápisu do katastru.",
  },
  {
    question: "Musím platit provizi nebo nějaké poplatky?",
    answer:
      "Ne. Výkup je pro vás zcela bez poplatků a bez provize. Veškeré náklady spojené s převodem, včetně právního servisu a poplatků za katastr, hradíme my.",
  },
  {
    question: "Vykupujete i nemovitosti s hypotékou nebo exekucí?",
    answer:
      "Ano, běžně řešíme nemovitosti zatížené hypotékou, exekucí, věcným břemenem nebo zástavním právem. Pomůžeme vám s vypořádáním všech závazků v rámci výkupu.",
  },
  {
    question: "Jak probíhá ocenění nemovitosti?",
    answer:
      "Po vyplnění formuláře náš odborník provede analýzu na základě lokality, stavu a aktuálních tržních cen. U složitějších případů nabídneme osobní prohlídku. Ocenění je vždy zdarma a nezávazné.",
  },
];

const HERO_BADGES = [
  "Záloha až 500 000 Kč ihned",
  "Peníze na účtu do 48 hodin",
  "Bez provize a skrytých poplatků",
] as const;

const PROCESS_STEPS = [
  {
    title: "Vyplníte formulář",
    eta: "2 min",
    Icon: FileText,
    description: "Stačí základní údaje o nemovitosti",
  },
  {
    title: "Nabídka do 24h",
    eta: "24 h",
    Icon: Zap,
    description: "Připravíme nezávaznou cenovou nabídku",
  },
  {
    title: "Podpis smlouvy",
    eta: "dle dohody",
    Icon: FileSignature,
    description: "Vše vyřídíme za vás, včetně právního servisu",
  },
  {
    title: "Peníze na účtu",
    eta: "do 48h",
    Icon: Banknote,
    description: "Výplata ihned po podpisu smlouvy",
  },
] as const;

const TRUST_METRICS = [
  { label: "Realizovaných výkupů", value: "1 250+", Icon: Award },
  { label: "Průměrná doba první nabídky", value: "24 h", Icon: Clock },
  { label: "Spokojenost klientů", value: "4.9/5", Icon: Star },
] as const;

const ABOUT_STATS = [
  { value: "10+", label: "let na trhu" },
  { value: "1 250+", label: "úspěšných výkupů" },
  { value: "14", label: "krajů ČR" },
] as const;

const COMPLEX_SITUATIONS = [
  {
    label: "Exekuce",
    Icon: Gavel,
    description: "Vykoupíme nemovitost i s exekucí a pomůžeme s oddlužením",
  },
  {
    label: "Insolvence",
    Icon: FileWarning,
    description: "Řešení pro nemovitosti v insolvenčním řízení",
  },
  {
    label: "Hypotéka",
    Icon: Landmark,
    description: "Převezmeme nemovitost se zatížením hypotékou",
  },
  {
    label: "Dědictví",
    Icon: ScrollText,
    description: "Rychlý výkup zděděných nemovitostí bez komplikací",
  },
  {
    label: "Spoluvlastnický podíl",
    Icon: Users,
    description: "Odkoupíme i podíl na nemovitosti bez souhlasu ostatních",
  },
  {
    label: "Věcné břemeno",
    Icon: Link2,
    description: "Nemovitosti s věcným břemenem nejsou problém",
  },
] as const;

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
      "@type": "FAQPage",
      mainEntity: [
        ...GENERAL_FAQ.map((item) => ({
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
      <FloatingWhatsApp regionName={region.name} />
      <FloatingDesktopCta />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[520px] overflow-hidden sm:min-h-[480px]">
        <Image
          src={
            region.key === "praha"
              ? "/images/hero-prague.jpg"
              : `/images/hero-${region.key}.jpg`
          }
          alt={`Panorama města ${region.primaryCity}`}
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/50 to-slate-900/30"
          aria-hidden="true"
        />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-center px-6 py-20 sm:min-h-[480px]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              {region.locative}
            </p>
            <p className="border-[var(--theme-200)]/40 bg-[var(--theme-500)]/10 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--theme-200)] backdrop-blur-sm">
              Nejsme realitka - jsme přímý kupec
            </p>
          </div>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {region.h1}
          </h1>
          <p className="mt-4 hidden max-w-2xl text-base leading-relaxed text-slate-200 md:block md:text-lg">
            {region.description}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2 text-sm text-white">
            {HERO_BADGES.map((badge) => (
              <li
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm"
              >
                <Check className="h-4 w-4 text-[var(--theme-400)]" />
                {badge}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink
              href="#kontakt"
              label={region.heroCta}
              regionName={region.name}
            />
            <a
              href={`tel:${region.phone}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Phone className="h-5 w-5" />
              Zavolat: {region.phone}
            </a>
          </div>
          <div className="mt-4">
            <CallbackForm regionName={region.name} />
          </div>
          <p className="mt-3 text-sm text-slate-300">
            Zálohu vyplácíme při podpisu smlouvy. Celý proces trvá 3–7 dní.
          </p>
        </div>
      </section>

      <SocialProofBar regionNames={listRegions().map((r) => r.name)} />

      {/* ===== MARKET INFO ===== */}
      {region.marketInfo && (
        <section className="bg-slate-50 py-8">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-center text-sm leading-relaxed text-slate-600 md:text-base">
              {region.marketInfo}
            </p>
          </div>
        </section>
      )}

      {/* ===== TRUST METRICS ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TRUST_METRICS.map((metric) => (
              <article
                key={metric.label}
                className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center"
              >
                <metric.Icon className="mb-3 h-7 w-7 text-[var(--theme-500)]" />
                <p className="text-3xl font-bold text-[var(--theme-700)]">
                  <AnimatedCounter value={metric.value} />
                </p>
                <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE (PROCESS STEPS) ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Jak to funguje
          </h2>
          <p className="mt-2 text-slate-600">
            Od prvního kontaktu k penězům na účtu - jednoduše a rychle.
          </p>

          <div className="mt-10 space-y-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/process-consultation.webp"
                    alt="Kancelář pro konzultace - teplý interiér s výhledem na českou ulici"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/process-valuation.webp"
                    alt="Ocenění nemovitosti - podklady pro stanovení férové ceny"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6">
                {PROCESS_STEPS.slice(0, 2).map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-6"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)] text-[var(--theme-600)]">
                        <step.Icon className="h-6 w-6" />
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
                ))}
              </div>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="order-2 space-y-6 lg:order-1">
                {PROCESS_STEPS.slice(2, 4).map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-6"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-50)] text-[var(--theme-600)]">
                        <step.Icon className="h-6 w-6" />
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
                ))}
              </div>
              <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/process-contract.webp"
                    alt="Podepsaná kupní smlouva s notářským razítkem"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src="/images/process-keys.webp"
                    alt="Klíče od prodané nemovitosti na stole - úspěšný výkup"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/jak-to-funguje"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
            >
              Více o celém procesu →
            </Link>
            <Link
              href="/garance-vykupu"
              className="inline-flex items-center gap-1 text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
            >
              Naše garance →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ŘEŠÍME I SLOŽITÉ SITUACE ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Řešíme i složité situace
          </h2>
          <p className="mt-2 text-slate-600">
            Nemovitost s problémem? Žádný strach - máme řešení pro každou
            situaci.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLEX_SITUATIONS.map((situation) => (
              <div
                key={situation.label}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--theme-50)] text-[var(--theme-600)]">
                  <situation.Icon className="h-5 w-5" />
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
            ))}
          </div>
        </div>
      </section>

      {/* ===== VISUAL BREAK: PROPERTY EXTERIOR ===== */}
      <section className="relative h-[150px] sm:h-[200px] lg:h-[250px]">
        <Image
          src="/images/property-exterior.jpg"
          alt="Rezidenční čtvrť v České republice - autentická architektura"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
        <div className="relative flex h-full items-center justify-center px-6">
          <p className="text-center text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Pomáháme majitelům nemovitostí po celé České republice
          </p>
        </div>
      </section>

      {/* ===== PROČ KLIENTI VOLÍ NÁS (USP) ===== */}
      <section className="bg-gradient-to-br from-[var(--theme-700)] to-[var(--theme-900)] py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Proč klienti volí nás
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {region.uspPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--theme-400)]" />
                <span className="text-white/90">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== O NÁS ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/property-exterior.jpg"
                alt="Rezidenční čtvrť v České republice - působíme po celé zemi"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                O nás
              </h2>
              <p className="mt-4 leading-relaxed text-slate-700">
                Jsme tým profesionálů s více než 10 lety zkušeností na českém
                realitním trhu. Specializujeme se na rychlý a férový výkup
                nemovitostí v celé České republice.
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
                    <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROPERTY ESTIMATOR ===== */}
      <PropertyEstimator regionKey={region.key} />

      {/* ===== COMPARISON CALCULATOR ===== */}
      <ComparisonCalculator />

      {/* ===== LEAD FORM + CO SE STANE PO ODESLÁNÍ ===== */}
      <section
        className="border-t border-[var(--theme-200)] bg-[var(--theme-50)] py-16"
        id="kontakt"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <LeadForm regionName={region.name} />

            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Co se stane po odeslání
              </h2>
              <ul className="mt-6 space-y-4">
                {FORM_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-[var(--theme-600)]">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src="/images/texture-brick.webp"
                  alt="Textura české cihlové zdi - detail historického zdiva"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0 bg-slate-900/60"
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
          </div>
        </div>
      </section>
      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-16">
        <Image
          src="/images/testimonial-bg.jpg"
          alt="Střechy českého města při západu slunce"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/90" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Co říkají naši klienti
          </h2>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ===== VISUAL BREAK: HAPPY FAMILY HOME ===== */}
      <section className="relative h-[150px] sm:h-[200px] lg:h-[250px]">
        <Image
          src="/images/happy-family-home.jpg"
          alt="Moderní český rodinný dům se zahradou"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
        <div className="relative flex h-full items-center justify-center px-6">
          <p className="text-center text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            Vaše nemovitost si zaslouží férové jednání
          </p>
        </div>
      </section>

      {/* ===== NEARBY REGIONS ===== */}
      <NearbyRegions regionKey={region.key} currentHost={currentHost} />

      {/* ===== REGION FAQ ===== */}
      {region.regionFaq && region.regionFaq.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Otázky k výkupu {region.locative}
            </h2>
            <div className="mt-8">
              <FaqAccordion items={region.regionFaq} />
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Časté dotazy
          </h2>
          <div className="mt-8">
            <FaqAccordion items={[...GENERAL_FAQ, ...region.faq]} />
          </div>
        </div>
      </section>

      {/* ===== STICKY MOBILE BAR ===== */}
      <nav
        aria-label="Rychlé akce"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <p className="mb-2 text-center text-xs text-slate-500">
          ✓ Bez poplatků &nbsp;·&nbsp; ✓ Nabídka do 24h &nbsp;·&nbsp; ✓ 1 250+
          výkupů
        </p>
        <div className="mx-auto flex max-w-7xl gap-2">
          <a
            href="#kontakt"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[var(--theme-600)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            Odeslat poptávku - zdarma
          </a>
          <a
            href={`tel:${region.phone}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
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
