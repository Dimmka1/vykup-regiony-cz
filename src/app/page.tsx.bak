import type { ReactElement } from "react";
import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { LeadForm } from "@/components/lead-form";
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
  { title: "Vyplníte krátký formulář", icon: "📝" },
  { title: "Do 24 hodin dostanete nabídku", icon: "⚡" },
  { title: "Peníze vyplácíme po podpisu", icon: "💸" },
] as const;

const TRUST_METRICS = [
  { label: "Realizovaných výkupů", value: "1 250+" },
  { label: "Průměrná doba první nabídky", value: "24 h" },
  { label: "Spokojenost klientů", value: "4.9/5" },
] as const;

const PARTNER_LOGOS = [
  "ČSOB",
  "Moneta",
  "Air Bank",
  "Česká spořitelna",
  "Komerční banka",
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
  const metaDescription = buildMetaDescription(region);
  const ogImageUrl = `${canonicalUrl}/api/og/${region.key}`;

  return {
    title: region.title,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: region.title,
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
      title: region.title,
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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 pb-28 sm:px-6 lg:py-10 lg:pb-10">
      <ScrollTracker regionName={region.name} />
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.35),transparent_55%)]"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              {region.locative}
            </p>
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
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Zavolat: {region.phone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
              Jak to probíhá
            </p>
            <ol className="mt-4 space-y-3">
              {PROCESS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex items-start gap-3 rounded-lg bg-black/20 p-3"
                >
                  <span className="text-lg" aria-hidden="true">
                    {step.icon}
                  </span>
                  <p className="text-sm text-slate-100">
                    <span className="mr-1 font-semibold text-emerald-200">
                      {index + 1}.
                    </span>
                    {step.title}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

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

      <section className="rounded-2xl bg-white p-5 shadow-sm [contain-intrinsic-size:800px] [content-visibility:auto] sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Důvěřují nám klienti i partneři
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {TRUST_METRICS.map((metric) => (
            <article
              key={metric.label}
              className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"
            >
              <p className="text-2xl font-bold text-emerald-700">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-slate-700">{metric.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {region.testimonials.map((testimonial) => (
            <figure
              key={`${testimonial.author}-${testimonial.city}`}
              className="rounded-xl bg-slate-50 p-4"
            >
              <blockquote className="text-sm text-slate-700">
                “{testimonial.quote}”
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

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Spolupracujeme s institucemi
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {PARTNER_LOGOS.map((partner) => (
              <li
                key={partner}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {partner}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="grid gap-5 [contain-intrinsic-size:1000px] [content-visibility:auto] lg:grid-cols-2"
        id="kontakt"
      >
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Nezávazná konzultace zdarma
          </h2>
          <p className="mt-3 text-slate-700">
            Primárně {region.primaryCity} a okolí, dále:{" "}
            {region.supportedCities.join(", ")}.
          </p>
          <h3 className="mt-6 text-lg font-semibold">Časté dotazy</h3>
          <div className="mt-3 space-y-4">
            {region.faq.map((faqItem) => (
              <article key={faqItem.question}>
                <h4 className="text-base font-semibold text-slate-800">
                  {faqItem.question}
                </h4>
                <p className="mt-1 text-slate-700">{faqItem.answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">
            {region.legalDisclaimer}
          </p>
        </div>

        <LeadForm regionName={region.name} />
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="mx-auto flex max-w-6xl gap-2">
          <a
            href="#kontakt"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white"
          >
            Odeslat poptávku
          </a>
          <a
            href={`tel:${region.phone}`}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-800"
          >
            Zavolat
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </main>
  );
}
