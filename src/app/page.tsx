import { safeJsonLd } from "@/lib/jsonld";
import type { ReactElement } from "react";
import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { LeadForm } from "@/components/lead-form";
import { AnimatedCounter } from "@/components/animated-counter";
import { ScrollTracker } from "@/components/scroll-tracker";
import { getRegionByHost } from "@/lib/config";
import { getRequestHost } from "@/lib/request-host";
import type { RegionConfig } from "@/lib/types";

const COMPANY_NAME = "Výkup Regiony CZ";

const HERO_BADGES = [
  "Nabídka do 24 hodin",
  "Bez poplatků a provizí",
  "Diskrétní jednání",
] as const;

const PROCESS_STEPS = [
  {
    title: "Vyplníte formulář",
    eta: "2 min",
    icon: "📝",
    description: "Stačí základní údaje o nemovitosti",
  },
  {
    title: "Nabídka do 24h",
    eta: "24 h",
    icon: "⚡",
    description: "Připravíme nezávaznou cenovou nabídku",
  },
  {
    title: "Podpis smlouvy",
    eta: "dle dohody",
    icon: "📄",
    description: "Vše vyřídíme za vás, včetně právního servisu",
  },
  {
    title: "Peníze na účtu",
    eta: "do 48h",
    icon: "💸",
    description: "Výplata ihned po podpisu smlouvy",
  },
] as const;

const TRUST_METRICS = [
  { label: "Realizovaných výkupů", value: "1 250+" },
  { label: "Průměrná doba první nabídky", value: "24 h" },
  { label: "Spokojenost klientů", value: "4.9/5" },
] as const;

const TRUST_BADGES = [
  { label: "Bezpečná transakce", icon: "🔒" },
  { label: "Osobní přístup", icon: "👤" },
  { label: "Garance výkupní ceny", icon: "✅" },
  { label: "Bez skrytých poplatků", icon: "💎" },
] as const;

const ABOUT_STATS = [
  { value: "10+", label: "let na trhu" },
  { value: "1 250+", label: "úspěšných výkupů" },
  { value: "14", label: "krajů ČR" },
] as const;

const COMPLEX_SITUATIONS = [
  {
    label: "Exekuce",
    icon: "⚖️",
    description: "Vykoupíme nemovitost i s exekucí a pomůžeme s oddlužením",
  },
  {
    label: "Insolvence",
    icon: "📋",
    description: "Řešení pro nemovitosti v insolvenčním řízení",
  },
  {
    label: "Hypotéka",
    icon: "🏦",
    description: "Převezmeme nemovitost se zatížením hypotékou",
  },
  {
    label: "Dědictví",
    icon: "📜",
    description: "Rychlý výkup zděděných nemovitostí bez komplikací",
  },
  {
    label: "Spoluvlastnický podíl",
    icon: "👥",
    description: "Odkoupíme i podíl na nemovitosti bez souhlasu ostatních",
  },
  {
    label: "Věcné břemeno",
    icon: "🔗",
    description: "Nemovitosti s věcným břemenem nejsou problém",
  },
] as const;

const FORM_BENEFITS = [
  "Zavoláme vám do 30 minut",
  "Připravíme nezávaznou nabídku",
  "Nabídku dostanete do 24 hodin",
  "Vše zdarma a bez závazků",
] as const;

function normalizeHost(host: string | null): string {
  if (!host) {
    return "vykup-regiony.cz";
  }

  return host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
}

function buildCanonicalUrl(host: string | null): string {
  return `https://${normalizeHost(host)}`;
}

function buildMetaDescription(region: RegionConfig): string {
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

function buildSchema(region: RegionConfig, canonicalUrl: string): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: COMPANY_NAME,
      url: canonicalUrl,
      telephone: region.phone,
      email: region.email,
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: `${COMPANY_NAME} — ${region.name}`,
      areaServed: region.name,
      telephone: region.phone,
      email: region.email,
      url: canonicalUrl,
      address: {
        "@type": "PostalAddress",
        addressCountry: "CZ",
        addressLocality: region.primaryCity,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: region.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const host = await getRequestHost();
  const region = getRegionByHost(host);
  const canonicalUrl = buildCanonicalUrl(host);
  const metaDescription = region.seoDescription || buildMetaDescription(region);
  const ogImageUrl = `${canonicalUrl}/opengraph-image`;

  return {
    title: region.seoTitle || region.title,
    description: metaDescription,
    keywords: region.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: region.seoTitle || region.title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: COMPANY_NAME,
      locale: "cs_CZ",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${region.h1} — ${COMPANY_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: region.seoTitle || region.title,
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage(): Promise<ReactElement> {
  const host = await getRequestHost();
  const region = getRegionByHost(host);
  const canonicalUrl = buildCanonicalUrl(host);
  const schema = buildSchema(region, canonicalUrl);

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 pb-28 sm:px-6 lg:py-10 lg:pb-10">
      <ScrollTracker regionName={region.name} />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <p className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              {region.locative}
            </p>
            <p className="inline-flex rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
              Nejsme realitka — jsme přímý kupec
            </p>
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            {region.h1}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
            {region.description}
          </p>

          <ul className="mt-6 grid gap-2 text-sm text-slate-100 sm:grid-cols-3">
            {HERO_BADGES.map((badge) => (
              <li
                key={badge}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2"
              >
                ✓ {badge}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink
              href="#kontakt"
              label={region.heroCta}
              regionName={region.name}
            />
            <a
              href={`tel:${region.phone}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Zavolat: {region.phone}
            </a>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Nezávazně a zdarma. Ozveme se do 30 minut.
          </p>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {TRUST_METRICS.map((metric) => (
            <article
              key={metric.label}
              className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-center"
            >
              <p className="text-2xl font-bold text-emerald-700">
                <AnimatedCounter value={metric.value} />
              </p>
              <p className="mt-1 text-sm text-slate-700">{metric.label}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TRUST_BADGES.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <span className="text-xl" aria-hidden="true">
                {badge.icon}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== JAK TO FUNGUJE (PROCESS STEPS) ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Jak to funguje
        </h2>
        <p className="mt-2 text-slate-600">
          Od prvního kontaktu k penězům na účtu — jednoduše a rychle.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <div
              key={step.title}
              className="relative rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg"
                  aria-hidden="true"
                >
                  {step.icon}
                </span>
                <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                ⏱ {step.eta}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ŘEŠÍME I SLOŽITÉ SITUACE ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Řešíme i složité situace
        </h2>
        <p className="mt-2 text-slate-600">
          Nemovitost s problémem? Žádný strach — máme řešení pro každou situaci.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMPLEX_SITUATIONS.map((situation) => (
            <div
              key={situation.label}
              className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xl"
                aria-hidden="true"
              >
                {situation.icon}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {situation.label}
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  {situation.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROČ KLIENTI VOLÍ NÁS (USP) ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm [contain-intrinsic-size:600px] [content-visibility:auto] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Proč klienti volí nás
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {region.uspPoints.map((point) => (
            <li
              key={point}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
            >
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* ===== O NÁS ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">O nás</h2>
        <div className="mt-5 grid gap-6 lg:grid-cols-[200px_1fr]">
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-slate-100 text-6xl">
            👨‍💼
          </div>
          <div>
            <p className="text-slate-700">
              Jsme tým profesionálů s více než 10 lety zkušeností na českém
              realitním trhu. Specializujeme se na rychlý a férový výkup
              nemovitostí v celé České republice.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {ABOUT_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4 text-center"
                >
                  <p className="text-2xl font-bold text-emerald-700">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-700">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEAD FORM + CO SE STANE PO ODESLÁNÍ ===== */}
      <section
        className="grid gap-5 [contain-intrinsic-size:1000px] [content-visibility:auto] lg:grid-cols-2"
        id="kontakt"
      >
        <LeadForm regionName={region.name} />

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Co se stane po odeslání
          </h2>
          <ul className="mt-5 space-y-4">
            {FORM_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-600">
                  ✓
                </span>
                <span className="text-slate-700">{benefit}</span>
              </li>
            ))}
          </ul>

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
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Co říkají naši klienti
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {region.testimonials.map((testimonial) => (
            <figure
              key={`${testimonial.author}-${testimonial.city}`}
              className="rounded-xl bg-slate-50 p-4"
            >
              <div className="mb-2 text-amber-400" aria-label="5 z 5 hvězd">
                ★★★★★
              </div>
              <blockquote className="text-sm text-slate-700">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-slate-900">
                {testimonial.author}{" "}
                <span className="font-normal text-slate-600">
                  — {testimonial.city}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Časté dotazy</h2>
        <div className="mt-5 space-y-4">
          {region.faq.map((faqItem) => (
            <article key={faqItem.question}>
              <h3 className="text-base font-semibold text-slate-800">
                {faqItem.question}
              </h3>
              <p className="mt-1 text-slate-700">{faqItem.answer}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== STICKY MOBILE BAR ===== */}
      <nav
        aria-label="Rychlé akce"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <div className="mx-auto flex max-w-6xl gap-2">
          <a
            href="#kontakt"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Odeslat poptávku
          </a>
          <a
            href={`tel:${region.phone}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
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
