import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title:
    "Ceny nemovitostí v ČR 2026 — statistiky po krajích | Výkupím Nemovitost",
  description:
    "Aktuální statistiky cen nemovitostí v České republice 2026. Průměrné ceny bytů, domů a pozemků za m² ve všech 14 krajích. Přehledné grafy a tabulky.",
  alternates: {
    canonical: `${SITE_URL}/statistiky-trhu`,
  },
  openGraph: {
    title: "Ceny nemovitostí v ČR 2026 — statistiky po krajích",
    description:
      "Průměrné ceny bytů, domů a pozemků za m² ve všech 14 krajích České republiky. Interaktivní přehled s grafy.",
    url: `${SITE_URL}/statistiky-trhu`,
    type: "article",
  },
};

interface RegionPriceData {
  name: string;
  slug: string;
  byt: number;
  dum: number;
  pozemek: number;
}

const REGION_PRICES: RegionPriceData[] = [
  { name: "Praha", slug: "praha", byt: 105000, dum: 82000, pozemek: 14500 },
  {
    name: "Středočeský kraj",
    slug: "stredocesky-kraj",
    byt: 58000,
    dum: 42000,
    pozemek: 4200,
  },
  {
    name: "Jihomoravský kraj",
    slug: "jihomoravsky-kraj",
    byt: 62000,
    dum: 38000,
    pozemek: 3800,
  },
  {
    name: "Plzeňský kraj",
    slug: "plzensky-kraj",
    byt: 48000,
    dum: 30000,
    pozemek: 2600,
  },
  {
    name: "Jihočeský kraj",
    slug: "jihocesky-kraj",
    byt: 42000,
    dum: 28000,
    pozemek: 2200,
  },
  {
    name: "Liberecký kraj",
    slug: "liberecky-kraj",
    byt: 38000,
    dum: 25000,
    pozemek: 1900,
  },
  {
    name: "Královéhradecký kraj",
    slug: "kralovehradecky-kraj",
    byt: 40000,
    dum: 27000,
    pozemek: 2100,
  },
  {
    name: "Pardubický kraj",
    slug: "pardubicky-kraj",
    byt: 38000,
    dum: 26000,
    pozemek: 2000,
  },
  { name: "Vysočina", slug: "vysocina", byt: 32000, dum: 22000, pozemek: 1600 },
  {
    name: "Olomoucký kraj",
    slug: "olomoucky-kraj",
    byt: 36000,
    dum: 24000,
    pozemek: 1800,
  },
  {
    name: "Zlínský kraj",
    slug: "zlinsky-kraj",
    byt: 35000,
    dum: 24000,
    pozemek: 1700,
  },
  {
    name: "Moravskoslezský kraj",
    slug: "moravskoslezsky-kraj",
    byt: 28000,
    dum: 18000,
    pozemek: 1200,
  },
  {
    name: "Ústecký kraj",
    slug: "ustecky-kraj",
    byt: 22000,
    dum: 15000,
    pozemek: 1000,
  },
  {
    name: "Karlovarský kraj",
    slug: "karlovarsky-kraj",
    byt: 24000,
    dum: 16000,
    pozemek: 1100,
  },
];

const MAX_BYT = Math.max(...REGION_PRICES.map((r) => r.byt));

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ").format(price);
}

export default function StatistikyTrhuPage() {
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Ceny nemovitostí v České republice 2026",
    description:
      "Průměrné ceny bytů, domů a pozemků za m² ve 14 krajích ČR. Data za Q1 2026 vycházející z veřejných zdrojů ČÚZK, ČSÚ a realitních portálů.",
    url: `${SITE_URL}/statistiky-trhu`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "Výkupím Nemovitost",
      url: SITE_URL,
    },
    temporalCoverage: "2026-01/2026-03",
    spatialCoverage: {
      "@type": "Place",
      name: "Česká republika",
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/html",
      contentUrl: `${SITE_URL}/statistiky-trhu`,
    },
    dateModified: "2026-03-01",
    keywords: [
      "ceny nemovitostí",
      "statistiky",
      "Česká republika",
      "kraje",
      "byty",
      "domy",
      "pozemky",
      "cena za m²",
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ceny nemovitostí v ČR 2026 — statistiky po krajích",
    description:
      "Kompletní přehled průměrných cen nemovitostí ve všech 14 krajích České republiky za rok 2026.",
    url: `${SITE_URL}/statistiky-trhu`,
    datePublished: "2026-03-01",
    dateModified: "2026-03-01",
    author: {
      "@type": "Organization",
      name: "Výkupím Nemovitost",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Výkupím Nemovitost",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/statistiky-trhu`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(datasetJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white pb-12 pt-28">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumbs
            items={[{ label: "Statistiky trhu", href: "/statistiky-trhu" }]}
          />

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Ceny nemovitostí v České republice 2026
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-600">
            Kompletní přehled průměrných cen bytů, domů a pozemků za m² ve všech
            14 krajích ČR. Data vycházejí z veřejných zdrojů Českého úřadu
            zeměměřického a katastrálního (ČÚZK), Českého statistického úřadu
            (ČSÚ) a předních realitních portálů.
          </p>
        </div>
      </section>

      {/* Bar Charts */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Průměrné ceny bytů za m² podle krajů
          </h2>
          <p className="mt-2 text-slate-600">
            Ceny bytů se v České republice výrazně liší podle lokality. Praha s
            průměrnou cenou přes 100 000 Kč/m² dominuje trhu, zatímco v Ústeckém
            či Karlovarském kraji pořídíte byt za méně než čtvrtinu pražské
            ceny. Středočeský a Jihomoravský kraj, zejména okolí Brna, se drží
            na druhém a třetím místě díky blízkosti velkých ekonomických center.
          </p>

          <div className="mt-8 space-y-3">
            {REGION_PRICES.map((region) => {
              const pct = Math.round((region.byt / MAX_BYT) * 100);
              return (
                <div key={region.slug} className="group">
                  <div className="flex items-center justify-between text-sm">
                    <Link
                      href="/kraje"
                      className="font-medium text-slate-700 transition-colors group-hover:text-emerald-700"
                    >
                      {region.name}
                    </Link>
                    <span className="font-semibold text-slate-900">
                      {formatPrice(region.byt)} Kč/m²
                    </span>
                  </div>
                  <div className="mt-1 h-6 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${pct}%` }}
                      role="img"
                      aria-label={`${region.name}: ${formatPrice(region.byt)} Kč/m²`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full Table */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Přehled cen: byty, domy a pozemky
          </h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Následující tabulka uvádí průměrné ceny za m² pro tři hlavní
            kategorie nemovitostí — byty, rodinné domy a stavební pozemky — ve
            všech 14 krajích České republiky. Údaje platí pro první čtvrtletí
            roku 2026 a slouží jako orientační vodítko pro prodávající i
            kupující.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Kraj
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Byt (Kč/m²)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Dům (Kč/m²)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">
                    Pozemek (Kč/m²)
                  </th>
                </tr>
              </thead>
              <tbody>
                {REGION_PRICES.map((region, i) => (
                  <tr
                    key={region.slug}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {region.name}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatPrice(region.byt)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatPrice(region.dum)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatPrice(region.pozemek)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Analysis */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="prose prose-slate lg:prose-lg max-w-none">
            <h2>Analýza trhu nemovitostí v ČR — klíčové trendy 2026</h2>
            <p>
              Český realitní trh vstoupil do roku 2026 s mírnými cenovými
              korekcemi v některých regionech, zatímco hlavní město Praha a
              krajská města jako Brno či Plzeň si udržují stabilní růst. Celkový
              objem transakcí v posledních měsících naznačuje oživení poptávky
              po dočasném útlumu způsobeném vyššími úrokovými sazbami v letech
              2023–2024.
            </p>

            <h3>Praha — nejdražší trh v ČR</h3>
            <p>
              Průměrná cena bytu v Praze překračuje{" "}
              <strong>105 000 Kč za m²</strong>, což ji řadí mezi nejdražší
              středoevropská města. Nejvyšší ceny najdeme v Praze 1, 2 a 6, kde
              m² bytu stojí i přes 150 000 Kč. Naopak na okrajích metropole
              (Praha 9 – východ, Praha 12) se ceny pohybují kolem 85 000–95 000
              Kč/m². Rodinné domy v Praze dosahují průměrně 82 000 Kč/m²,
              stavební pozemky pak okolo 14 500 Kč/m².
            </p>

            <h3>Jihomoravský kraj a Brno</h3>
            <p>
              Brno jako druhé největší město ČR táhne ceny v celém Jihomoravském
              kraji nahoru. Průměrná cena bytu zde dosahuje{" "}
              <strong>62 000 Kč/m²</strong>, přičemž centrum Brna se pohybuje
              kolem 75 000–85 000 Kč/m². Zajímavé příležitosti nabízejí menší
              města jako Blansko, Vyškov či Znojmo, kde byty stojí o 30–40 %
              méně než v krajském městě.
            </p>

            <h3>Středočeský kraj — vliv Prahy</h3>
            <p>
              Středočeský kraj s průměrnou cenou bytů{" "}
              <strong>58 000 Kč/m²</strong> výrazně profituje z blízkosti
              hlavního města. Města jako Mladá Boleslav, Kolín a Kladno zažívají
              stabilní zájem kupujících, kteří hledají dostupnější alternativu k
              pražským cenám. Dobré vlakové a dálniční spojení s Prahou udržuje
              poptávku na vysoké úrovni.
            </p>

            <h3>Severní Čechy — nejdostupnější region</h3>
            <p>
              Ústecký a Karlovarský kraj zůstávají cenově nejdostupnějšími
              regiony v České republice. S průměrnými cenami bytů kolem{" "}
              <strong>22 000–24 000 Kč/m²</strong> nabízejí příležitosti pro
              investory hledající vysoké výnosové míry z pronájmu. Města jako
              Ústí nad Labem, Most, Chomutov, Karlovy Vary a Teplice procházejí
              postupnou revitalizací.
            </p>

            <h3>Moravskoslezský kraj — oživení</h3>
            <p>
              Ostravsko s průměrnou cenou bytů kolem{" "}
              <strong>28 000 Kč/m²</strong> zaznamenává v posledních letech
              postupný růst. Transformace regionu z těžkého průmyslu na
              technologické centrum přitahuje mladé profesionály. Nové
              developerské projekty v Ostravě-Porubě a v centru města posouvají
              ceny směrem nahoru.
            </p>

            <h3>Rodinné domy vs. byty</h3>
            <p>
              Zajímavým trendem roku 2026 je rostoucí zájem o rodinné domy v
              menších městech a na venkově. Po pandemii covidu-19 se mnoho rodin
              přesunulo mimo velká města, což tlačí ceny domů v krajích jako
              Vysočina, Pardubický či Olomoucký kraj směrem nahoru. Průměrné
              ceny domů se pohybují od <strong>15 000 Kč/m²</strong> v Ústeckém
              kraji po <strong>82 000 Kč/m²</strong> v Praze.
            </p>

            <h3>Stavební pozemky</h3>
            <p>
              Ceny stavebních pozemků odrážejí podobné regionální rozdíly jako
              ceny bytů a domů. V Praze se m² stavebního pozemku prodává
              průměrně za <strong>14 500 Kč</strong>, zatímco v Ústeckém kraji
              za pouhých <strong>1 000 Kč/m²</strong>. Středočeský kraj s cenou
              kolem <strong>4 200 Kč/m²</strong> představuje kompromis mezi
              dostupností a blízkostí metropole.
            </p>

            <h3>Co ovlivňuje ceny nemovitostí?</h3>
            <p>
              Na ceny nemovitostí v jednotlivých krajích má vliv řada faktorů:
              ekonomická aktivita regionu, míra nezaměstnanosti, dopravní
              dostupnost, kvalita občanské vybavenosti a demografický vývoj.
              Kraje s rostoucí populací a nízkou nezaměstnaností (Praha,
              Jihomoravský, Středočeský) vykazují stabilně vyšší ceny i větší
              objemy obchodů.
            </p>

            <h3>Prognóza na rok 2026</h3>
            <p>
              Analytici očekávají pro rok 2026 mírný růst cen nemovitostí v
              rozmezí 3–7 % v hlavních krajských městech. Menší města a
              venkovské oblasti by mohly zaznamenat stagnaci nebo růst
              nepřesahující inflaci. Klíčovým faktorem bude vývoj hypotečních
              sazeb — pokud ČNB pokračuje v uvolňování měnové politiky, lze
              očekávat oživení poptávky a s ním spojený tlak na ceny směrem
              nahoru.
            </p>
          </div>
        </div>
      </section>

      {/* Zdroj dat */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Zdroj dat</h2>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-slate-600">
              Uvedené ceny jsou orientační průměry vypočítané z dat Českého
              úřadu zeměměřického a katastrálního (ČÚZK), Českého statistického
              úřadu (ČSÚ) a nabídkových cen z předních českých realitních
              portálů (Sreality.cz, Bezrealitky.cz, Reality.idnes.cz). Skutečné
              ceny se mohou lišit v závislosti na konkrétní lokalitě, stavu
              nemovitosti a tržních podmínkách.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Naposledy aktualizováno: březen 2026
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Internal links */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Potřebujete prodat nemovitost rychle?
          </h2>
          <p className="mt-2 max-w-3xl text-slate-600">
            Bez ohledu na to, v jakém kraji se vaše nemovitost nachází, nabízíme
            rychlý výkup za hotové do 7 dnů. Podívejte se na naše služby v
            jednotlivých regionech:
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {REGION_PRICES.map((region) => (
              <Link
                key={region.slug}
                href="/kraje"
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {region.name}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Získat nezávaznou nabídku
            </Link>
            <Link
              href="/jak-to-funguje"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Jak funguje výkup?
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Přečtěte si náš blog →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
