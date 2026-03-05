import { MapPin, Home, TrendingUp, Building2 } from "lucide-react";
import type { DistrictData } from "@/data/praha-districts";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://vykoupim-nemovitost.cz";

interface DistrictPageProps {
  district: DistrictData;
  cityName: string;
  citySlug: string;
  allDistricts: DistrictData[];
  themeColor?: string;
}

export function DistrictPage({
  district,
  cityName,
  citySlug,
  allDistricts,
  themeColor = "teal",
}: DistrictPageProps) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domů",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cityName,
        item: `${SITE_URL}/kraje`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: district.name,
        item: `${SITE_URL}/${citySlug}/${district.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section
        className={`bg-gradient-to-b from-${themeColor}-50 to-white pb-12 pt-28`}
      >
        <div className="mx-auto max-w-4xl px-6">
          <Breadcrumbs
            items={[
              { label: "Kde působíme", href: "/kraje" },
              { label: cityName, href: `/kraje` },
              { label: district.name, href: `/${citySlug}/${district.slug}` },
            ]}
          />

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {district.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {district.heroText}
          </p>

          <a
            href="#formular"
            className={`mt-8 inline-flex items-center rounded-lg bg-${themeColor}-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-${themeColor}-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${themeColor}-500 focus-visible:ring-offset-2`}
          >
            Získat nezávaznou nabídku
          </a>
        </div>
      </section>

      {/* About district */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            O lokalitě {district.name}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {district.description}
          </p>
        </div>
      </section>

      {/* Prices */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Průměrné ceny nemovitostí – {district.name}
          </h2>
          <p className="mt-2 text-slate-500">
            Orientační cenové rozmezí pro {district.name} (2024/2025)
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${themeColor}-50 text-${themeColor}-700`}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Byt</h3>
              </div>
              <p className={`mt-3 text-2xl font-bold text-${themeColor}-700`}>
                {district.avgPriceFlat}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${themeColor}-50 text-${themeColor}-700`}
                >
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Dům</h3>
              </div>
              <p className={`mt-3 text-2xl font-bold text-${themeColor}-700`}>
                {district.avgPriceHouse}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${themeColor}-50 text-${themeColor}-700`}
                >
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900">Cena za m²</h3>
              </div>
              <p className={`mt-3 text-2xl font-bold text-${themeColor}-700`}>
                {district.avgPricePerM2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Typical properties */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Typické nemovitosti – {district.name}
          </h2>
          <p className="mt-4 leading-relaxed text-slate-600">
            {district.typicalProperties}
          </p>
        </div>
      </section>

      {/* Local features */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3">
            <MapPin className={`h-6 w-6 text-${themeColor}-600`} />
            <h2 className="text-2xl font-bold text-slate-900">
              Co nabízí {district.name}
            </h2>
          </div>
          <p className="mt-4 leading-relaxed text-slate-600">
            {district.localFeatures}
          </p>
        </div>
      </section>

      {/* CTA + Form */}
      <section id="formular" className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Chcete prodat nemovitost – {district.name}?
          </h2>
          <p className="mt-2 text-slate-600">
            Vyplňte krátký formulář a do 24 hodin vám pošleme nezávaznou nabídku
            na výkup vaší nemovitosti.
          </p>
          <div className="mt-8">
            <LeadForm regionName={district.ctaRegionValue} />
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-xl font-bold text-slate-900">
            Další lokality – {cityName}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {allDistricts
              .filter((d) => d.slug !== district.slug)
              .map((d) => (
                <a
                  key={d.slug}
                  href={`/${citySlug}/${d.slug}`}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-teal-300 hover:text-teal-700"
                >
                  {d.name}
                </a>
              ))}
          </div>
          <div className="mt-6">
            <a
              href="/kraje"
              className="text-sm font-medium text-teal-700 hover:underline"
            >
              ← Zpět na přehled krajů
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
