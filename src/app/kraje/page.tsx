import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { listRegions, getRegionUrl, getRegionSubdomainUrl } from "@/lib/config";
import { getRequestHost } from "@/lib/request-host";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title: "Výkup nemovitostí ve všech krajích ČR | vykoupim-nemovitost.cz",
  description:
    "Vykupujeme nemovitosti ve všech 14 krajích České republiky. Rychlý výkup bytů, domů a pozemků za hotové. Najděte svůj kraj a získejte nezávaznou nabídku.",
  alternates: {
    canonical: `${SITE_URL}/kraje`,
  },
};

export default async function KrajePage() {
  const host = await getRequestHost();
  const regions = listRegions();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Výkup nemovitostí v krajích ČR",
    numberOfItems: regions.length,
    itemListElement: regions.map((region, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: region.name,
      url: getRegionSubdomainUrl(region.key),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white pb-16 pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumbs items={[{ label: "Kde působíme", href: "/kraje" }]} />

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Kde působíme — výkup nemovitostí v krajích ČR
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Vykupujeme nemovitosti ve všech 14 krajích České republiky. Vyberte
            svůj kraj a zjistěte více o našich službách ve vašem regionu.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regions.map((region) => (
              <a
                key={region.key}
                href={getRegionUrl(region.key, host)}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 group-hover:text-teal-700">
                    {region.name}
                  </h2>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                  {region.description}
                </p>
                <span className="mt-auto pt-4 text-sm font-medium text-teal-700 group-hover:underline">
                  Zjistit více →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
