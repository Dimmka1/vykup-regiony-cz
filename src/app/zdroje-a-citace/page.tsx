import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { listExternalSources } from "@/lib/external-sources";

const PAGE_PATH = "/zdroje-a-citace";
const PAGE_URL = `https://vykoupim-nemovitost.cz${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Zdroje a citace — autoritativní české zdroje | Vykoupím Nemovitost",
  description:
    "Seznam autoritativních českých zdrojů, ze kterých čerpáme: ČÚZK, Finanční správa, ČSÚ, Exekutorská komora, ČAK, ČNB, občanský zákoník.",
  alternates: withHreflang({ canonical: PAGE_URL }),
  openGraph: {
    title: "Zdroje a citace — autoritativní české zdroje",
    description:
      "Seznam autoritativních českých zdrojů použitých při tvorbě obsahu o výkupu nemovitostí.",
    url: PAGE_URL,
    type: "website",
  },
};

const TOPIC_LABELS: Record<string, string> = {
  cadastre: "Katastr nemovitostí",
  ownership: "Vlastnictví",
  easement: "Věcná břemena",
  "mortgage-lien": "Zástavní právo",
  tax: "Daně",
  finance: "Finance",
  "market-data": "Tržní data",
  statistics: "Statistika",
  insolvency: "Insolvence",
  "court-registry": "Soudní rejstřík",
  execution: "Exekuce",
  legal: "Právo",
  escrow: "Advokátní úschova",
  mortgage: "Hypotéka",
  law: "Zákony",
  contract: "Smluvní právo",
};

export default function ZdrojeACitacePage(): React.ReactElement {
  const sources = listExternalSources();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": PAGE_URL,
    url: PAGE_URL,
    name: "Zdroje a citace",
    description:
      "Seznam autoritativních českých zdrojů, ze kterých čerpáme při tvorbě obsahu o výkupu nemovitostí.",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "Unordered",
      numberOfItems: sources.length,
      itemListElement: sources.map((source, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "WebSite",
          name: source.name,
          url: source.url,
          description: source.description,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(itemListJsonLd) }}
      />

      <div className="bg-white">
        <section className="mx-auto max-w-4xl px-6 pt-8">
          <Breadcrumbs
            items={[{ label: "Zdroje a citace", href: PAGE_PATH }]}
          />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-4 pt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Zdroje a citace
          </h1>
          <LastUpdated path={PAGE_PATH} />
          <QuickAnswer>
            <p>
              Veškerý obsah na vykoupim-nemovitost.cz se opírá o autoritativní
              české zdroje. Hlavní instituce, na které odkazujeme: Český úřad
              zeměměřický a katastrální (ČÚZK), Finanční správa, Český
              statistický úřad, Exekutorská komora, Česká advokátní komora,
              Česká národní banka a občanský zákoník v aktuálním znění.
            </p>
            <p>
              Všechny zdroje jsou veřejně dostupné a zdarma. Pokud na webu
              uvádíme konkrétní lhůtu, sazbu, právní postup nebo cenovou
              statistiku, najdete u ní odkaz přímo na primární zdroj — ne na
              sekundární publikaci.
            </p>
          </QuickAnswer>
        </section>

        {/* All sources */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Kompletní seznam zdrojů
            </h2>
            <ul className="mt-8 space-y-6">
              {sources.map((source) => (
                <li
                  key={source.key}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        {source.name} ↗
                      </a>
                      <p className="mt-2 leading-relaxed text-slate-700">
                        {source.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {source.topics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                          >
                            {TOPIC_LABELS[topic] ?? topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How we use them */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Jak tyto zdroje používáme
            </h2>
            <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
              <p>
                Každý faktický údaj na webu — lhůta, sazba, právní postup,
                cenová statistika — je opřen o oficiální zdroj. Odkaz vede přímo
                na primární zdroj, ne na sekundární publikaci nebo blogový
                shrnutí.
              </p>
              <p>
                Pokud se v některé oblasti zdroje rozcházejí (například výklad
                nového zákona soudní praxí), uvedeme to a přidáme odkazy na
                všechny relevantní výklady. Nikdy nezamlčujeme, že údaj je
                sporný.
              </p>
              <p>
                Naše{" "}
                <Link
                  href="/redakcni-zasady"
                  className="font-medium text-emerald-700 hover:text-emerald-800"
                >
                  redakční zásady
                </Link>{" "}
                popisují, jak ověřujeme fakta, jak často aktualizujeme obsah a
                jak řešíme případné chyby.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Hledáte konkrétní informaci?
            </h2>
            <p className="mt-3 text-slate-300">
              Začněte od slovníku pojmů nebo si přečtěte naši metodiku výpočtu
              výkupní ceny.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/slovnik-pojmu"
                className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Slovník pojmů
              </Link>
              <Link
                href="/jak-stanovujeme-cenu"
                className="inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Jak stanovujeme cenu
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
