import type { ReactElement } from "react";
import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { getRegionByHost } from "@/lib/config";
import { getRequestHost } from "@/lib/request-host";
import type { RegionConfig } from "@/lib/types";

const COMPANY_NAME = "Výkup Regiony CZ";

function normalizeHost(host: string | null): string {
  if (!host) {
    return "vykup-regiony.cz";
  }

  return host.toLowerCase().replace(/^www\./, "").split(":")[0];
}

function buildCanonicalUrl(host: string | null): string {
  return `https://${normalizeHost(host)}`;
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

  return {
    title: region.title,
    description: region.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: region.title,
      description: region.description,
      url: canonicalUrl,
      siteName: COMPANY_NAME,
      locale: "cs_CZ",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: region.title,
      description: region.description,
    },
  };
}

export default async function HomePage(): Promise<ReactElement> {
  const host = await getRequestHost();
  const region = getRegionByHost(host);
  const canonicalUrl = buildCanonicalUrl(host);
  const schema = buildSchema(region, canonicalUrl);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">{region.locative}</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{region.h1}</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">{region.description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            {region.heroCta}
          </a>
          <a href={`tel:${region.phone}`} className="text-sm font-semibold text-slate-800 underline-offset-2 hover:underline">
            {region.phone}
          </a>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Proč klienti volí nás</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {region.uspPoints.map((point) => (
            <li key={point} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" id="kontakt">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Nezávazná konzultace zdarma</h2>
          <p className="mt-3 text-slate-700">Primárně {region.primaryCity} a okolí, dále: {region.supportedCities.join(", ")}.</p>
          <h3 className="mt-6 text-lg font-semibold">Časté dotazy</h3>
          <div className="mt-3 space-y-4">
            {region.faq.map((faqItem) => (
              <article key={faqItem.question}>
                <h4 className="text-base font-semibold text-slate-800">{faqItem.question}</h4>
                <p className="mt-1 text-slate-700">{faqItem.answer}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs text-slate-500">{region.legalDisclaimer}</p>
        </div>

        <LeadForm regionName={region.name} />
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </main>
  );
}
