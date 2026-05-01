import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { listRegions } from "@/lib/config";
import { REGION_PRICES, formatPricePerM2 } from "@/lib/price-data";

const PAGE_PATH = "/index-vykupnich-cen";
const PAGE_URL = `https://vykoupim-nemovitost.cz${PAGE_PATH}`;
const DATASET_VERSION = "2026-Q2";
const DATASET_ISSUED = "2026-05-01";
const DATASET_API = `${PAGE_URL.replace(PAGE_PATH, "")}/api/data/cenovy-index`;

export const metadata: Metadata = {
  title:
    "Index výkupních cen nemovitostí — průměrné ceny ve všech 14 krajích ČR",
  description:
    "Aktuální tržní ceny bytů, rodinných domů a stavebních pozemků v Kč/m² ve všech 14 krajích České republiky. Kvartálně aktualizovaný cenový index použitý při výpočtu výkupních cen.",
  alternates: withHreflang({ canonical: PAGE_URL }),
  openGraph: {
    title: "Index výkupních cen nemovitostí 2026 — všech 14 krajů ČR",
    description:
      "Tržní ceny bytů, domů a pozemků v Kč/m² ve všech 14 krajích ČR. Kvartálně aktualizováno.",
    url: PAGE_URL,
    type: "website",
  },
};

interface RegionRow {
  key: string;
  name: string;
  bytM2: number;
  dumM2: number;
  pozemekM2: number;
}

function buildRows(): RegionRow[] {
  return listRegions()
    .map((r) => ({
      key: r.key,
      name: r.name,
      bytM2: REGION_PRICES[r.key]?.bytM2 ?? 0,
      dumM2: REGION_PRICES[r.key]?.dumM2 ?? 0,
      pozemekM2: REGION_PRICES[r.key]?.pozemekM2 ?? 0,
    }))
    .filter((r) => r.bytM2 > 0)
    .sort((a, b) => b.bytM2 - a.bytM2);
}

function aggregate(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    mean: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
    median:
      sorted.length % 2 === 0
        ? Math.round((sorted[m - 1] + sorted[m]) / 2)
        : sorted[m],
  };
}

export default function IndexVykupnichCenPage(): React.ReactElement {
  const rows = buildRows();
  const bytStat = aggregate(rows.map((r) => r.bytM2));
  const dumStat = aggregate(rows.map((r) => r.dumM2));
  const pozemekStat = aggregate(rows.map((r) => r.pozemekM2));

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${PAGE_URL}#dataset`,
    name: "Index výkupních cen nemovitostí — Česká republika",
    alternateName: "Czech property price index for buyout calculations",
    description:
      "Strukturovaný index průměrných tržních cen bytů, rodinných domů a stavebních pozemků v Kč za m² ve všech 14 krajích České republiky. Sestaveno z dat Českého statistického úřadu, RealityMIX a katastrálních výměr ČÚZK. Použito jako referenční datová základna pro výpočet výkupních cen v rozsahu 80–90 % tržní hodnoty.",
    url: PAGE_URL,
    inLanguage: "cs-CZ",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    isAccessibleForFree: true,
    keywords: [
      "ceny nemovitostí",
      "tržní ceny bytů",
      "ceny rodinných domů",
      "ceny stavebních pozemků",
      "Česká republika",
      "kraje ČR",
      "výkup nemovitostí",
      "Kč za m²",
    ],
    spatialCoverage: {
      "@type": "Place",
      name: "Česká republika",
      geo: {
        "@type": "GeoShape",
        addressCountry: "CZ",
      },
    },
    temporalCoverage: DATASET_VERSION,
    datePublished: DATASET_ISSUED,
    dateModified: DATASET_ISSUED,
    version: DATASET_VERSION,
    variableMeasured: [
      {
        "@type": "PropertyValue",
        name: "Cena bytu",
        unitText: "CZK per m²",
        minValue: bytStat.min,
        maxValue: bytStat.max,
        median: bytStat.median,
      },
      {
        "@type": "PropertyValue",
        name: "Cena rodinného domu",
        unitText: "CZK per m²",
        minValue: dumStat.min,
        maxValue: dumStat.max,
        median: dumStat.median,
      },
      {
        "@type": "PropertyValue",
        name: "Cena stavebního pozemku",
        unitText: "CZK per m²",
        minValue: pozemekStat.min,
        maxValue: pozemekStat.max,
        median: pozemekStat.median,
      },
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: DATASET_API,
        name: "Cenový index — JSON",
      },
    ],
    citation: [
      "Český statistický úřad. Ceny nemovitostí podle krajů Q1 2025. https://www.czso.cz",
      "RealityMIX. Cenová mapa nemovitostí 02/2026. https://www.realitymix.cz",
      "ČÚZK. Katastr nemovitostí — výměry parcel. https://www.cuzk.cz",
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": PAGE_URL,
    url: PAGE_URL,
    name: "Index výkupních cen nemovitostí",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    speakable: buildSpeakableSpec(),
    mainEntity: { "@id": `${PAGE_URL}#dataset` },
    dateModified: DATASET_ISSUED,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />

      <div className="bg-white">
        <section className="mx-auto max-w-5xl px-6 pt-8">
          <Breadcrumbs
            items={[{ label: "Index výkupních cen", href: PAGE_PATH }]}
          />
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-4 pt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Index výkupních cen nemovitostí — Q2 2026
          </h1>
          <LastUpdated path={PAGE_PATH} />
          <QuickAnswer>
            <p>
              Průměrná cena bytu v České republice činí v Q2 2026{" "}
              {formatPricePerM2(bytStat.mean)} (medián{" "}
              {formatPricePerM2(bytStat.median)}). Nejdražší kraj je{" "}
              {rows[0].name} ({formatPricePerM2(rows[0].bytM2)} za m²),
              nejlevnější {rows[rows.length - 1].name} (
              {formatPricePerM2(rows[rows.length - 1].bytM2)} za m²) — rozdíl
              mezi extrémy činí{" "}
              {Math.round(
                (rows[0].bytM2 / rows[rows.length - 1].bytM2 - 1) * 100,
              )}{" "}
              %. Rodinné domy vycházejí v průměru na{" "}
              {formatPricePerM2(dumStat.mean)} a stavební pozemky na{" "}
              {formatPricePerM2(pozemekStat.mean)}.
            </p>
            <p>
              Data jsou agregována z transakčních statistik Českého
              statistického úřadu (Q1 2025), tržních dat RealityMIX (02/2026) a
              katastrálních výměr ČÚZK. Index zahrnuje 14 administrativních
              krajů ČR a 3 typy nemovitostí (byt, rodinný dům, stavební
              pozemek), tedy 42 datových bodů. Kompletní datová sada je dostupná
              jako{" "}
              <a
                href="/api/data/cenovy-index"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                JSON ke stažení
              </a>{" "}
              pod licencí CC BY 4.0.
            </p>
            <p>
              Tento index slouží jako referenční hodnota pro výpočet výkupních
              cen v rozsahu 80–90 % tržní hodnoty. Konkrétní metodiku výpočtu
              výkupní ceny popisuje samostatná stránka{" "}
              <Link
                href="/jak-stanovujeme-cenu"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Jak stanovujeme cenu
              </Link>
              . Kvartální aktualizace probíhá vždy po zveřejnění nových cenových
              statistik ČSÚ.
            </p>
          </QuickAnswer>
        </section>

        {/* Headline aggregate stats */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Agregátní statistiky — celá ČR
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Min, medián, průměr a max ze 14 krajských hodnot.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "Byty",
                  stat: bytStat,
                  desc: "Průměrná cena bytu v Kč/m²",
                },
                {
                  label: "Rodinné domy",
                  stat: dumStat,
                  desc: "Průměrná cena domu v Kč/m²",
                },
                {
                  label: "Stavební pozemky",
                  stat: pozemekStat,
                  desc: "Průměrná cena pozemku v Kč/m²",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {b.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{b.desc}</p>
                  <dl className="mt-4 space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Min</dt>
                      <dd className="font-medium text-slate-900">
                        {formatPricePerM2(b.stat.min)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Medián</dt>
                      <dd className="font-medium text-slate-900">
                        {formatPricePerM2(b.stat.median)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Průměr</dt>
                      <dd className="font-bold text-emerald-700">
                        {formatPricePerM2(b.stat.mean)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Max</dt>
                      <dd className="font-medium text-slate-900">
                        {formatPricePerM2(b.stat.max)}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Full table — main extractable artifact */}
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Tržní ceny ve všech 14 krajích ČR
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Seřazeno sestupně podle ceny bytu. Všechny hodnoty v Kč za m².
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-semibold text-slate-700"
                    >
                      Kraj
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-slate-700"
                    >
                      Byt (Kč/m²)
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-slate-700"
                    >
                      Rodinný dům (Kč/m²)
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-semibold text-slate-700"
                    >
                      Stavební pozemek (Kč/m²)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((r, idx) => (
                    <tr
                      key={r.key}
                      className={idx % 2 === 0 ? "" : "bg-slate-50/40"}
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 text-left font-medium text-slate-900"
                      >
                        {r.name}
                      </th>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {formatPricePerM2(r.bytM2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {formatPricePerM2(r.dumM2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {formatPricePerM2(r.pozemekM2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs italic text-slate-500">
              Zdroj: Český statistický úřad (Q1 2025), RealityMIX (02/2026).
              Hodnoty jsou orientační průměry pro krajskou úroveň; v rámci kraje
              se ceny mezi okresy a městy liší až o 30–40 %.
            </p>
          </div>
        </section>

        {/* Methodology */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Metodika sestavení indexu
            </h2>
            <ol className="mt-6 space-y-3 leading-relaxed text-slate-700">
              <li>
                <strong>Vstupní data.</strong> Krajské průměrné ceny bytů a domů
                v Kč/m² agregujeme z transakčních statistik{" "}
                <a
                  href={EXTERNAL_SOURCES.czso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline-offset-2 hover:underline"
                >
                  Českého statistického úřadu
                </a>{" "}
                (Q1 2025) a tržních cenových map RealityMIX (02/2026).
              </li>
              <li>
                <strong>Stavební pozemky.</strong> Ceny pozemků doplňujeme z
                veřejných inzerátů a katastrálních výměr (
                <a
                  href={EXTERNAL_SOURCES.cuzk.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 underline-offset-2 hover:underline"
                >
                  ČÚZK
                </a>
                ). U zemědělských pozemků doplňujeme bonitu půdy (BPEJ).
              </li>
              <li>
                <strong>Konsolidace.</strong> Pro každý kraj použijeme medián. Z
                14 krajských hodnot pak počítáme celorepublikové agregáty (min,
                max, medián, aritmetický průměr).
              </li>
              <li>
                <strong>Aplikace na výkupní cenu.</strong> Tržní hodnota
                konkrétní nemovitosti se odvozuje od výměry × krajské ceny/m², s
                lokální korekcí (okres, městská část) ±15 %. Výkupní cena je pak
                80–90 % korigované tržní hodnoty. Detail v{" "}
                <Link
                  href="/jak-stanovujeme-cenu"
                  className="text-emerald-700 underline-offset-2 hover:underline"
                >
                  metodice výpočtu
                </Link>
                .
              </li>
              <li>
                <strong>Aktualizace.</strong> Kvartálně po zveřejnění cenových
                statistik ČSÚ. Aktuální verze:{" "}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs ring-1 ring-slate-200">
                  {DATASET_VERSION}
                </code>{" "}
                vydáno {DATASET_ISSUED}.
              </li>
            </ol>
          </div>
        </section>

        {/* Machine-readable hint */}
        <section className="py-12">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Stahování dat / API
            </h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Strojově čitelná verze indexu je dostupná pod licencí CC BY 4.0.
              Schema.org Dataset metadata jsou součástí této stránky a
              indexovatelná v Google Dataset Search.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href="/api/data/cenovy-index"
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:bg-emerald-50/30"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-emerald-700">
                    JSON
                  </span>
                  <span className="font-mono text-xs text-slate-500">
                    application/json
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Strukturovaný JSON s agregáty, řádky a metadaty zdrojů.
                </p>
              </a>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-semibold text-slate-700">
                    Citace
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Při použití uvádějte:{" "}
                  <em>
                    Vykoupím Nemovitost — Index výkupních cen {DATASET_VERSION}
                  </em>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Chcete cenovou nabídku pro vaši nemovitost?
            </h2>
            <p className="mt-3 text-slate-300">
              Z indexu vypočítáme orientační hodnotu okamžitě, finální nabídku
              pošleme do 24 hodin.
            </p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400"
              >
                Nezávazná nabídka zdarma
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
