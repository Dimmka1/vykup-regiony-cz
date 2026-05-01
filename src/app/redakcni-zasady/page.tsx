import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";

const PAGE_PATH = "/redakcni-zasady";
const PAGE_URL = `https://vykoupim-nemovitost.cz${PAGE_PATH}`;
const PAGE_NAME = "Redakční zásady — jak píšeme a aktualizujeme obsah";

export const metadata: Metadata = {
  title:
    "Redakční zásady — jak píšeme a aktualizujeme obsah | Vykoupím Nemovitost",
  description:
    "Naše redakční zásady: jak vybíráme zdroje, jak ověřujeme fakta, jak aktualizujeme obsah a jak řešíme případné chyby.",
  alternates: withHreflang({ canonical: PAGE_URL }),
  openGraph: {
    title: "Redakční zásady",
    description:
      "Transparentní redakční pravidla — zdroje, ověřování, aktualizace, opravy.",
    url: PAGE_URL,
    type: "website",
  },
};

const PRINCIPLES = [
  {
    title: "Citujeme primární zdroje",
    body: "Každý faktický údaj — lhůty, sazby, právní postupy — opíráme o oficiální český zdroj: ČÚZK, Finanční správa, Český statistický úřad, Exekutorská komora, Česká advokátní komora, občanský zákoník v aktuálním znění. Odkazy vedou přímo na zdroj, ne na sekundární publikace.",
  },
  {
    title: "Píšeme srozumitelně, ne marketingově",
    body: "Obsah je psán pro člověka v reálné životní situaci (exekuce, dědictví, rozvod), ne pro vyhledávač. Žádný keyword stuffing, žádné nadhodnocené sliby, žádné údaje bez zdroje. Pokud něco nevíme s jistotou, řekneme to.",
  },
  {
    title: "Pravidelně aktualizujeme",
    body: "Každá stránka má viditelně uvedené datum poslední aktualizace. U článků s ročními údaji (daň z prodeje nemovitosti, sazby, lhůty) procházíme obsah minimálně jednou ročně a po každé legislativní změně.",
  },
  {
    title: "Opravujeme chyby otevřeně",
    body: "Pokud se ukáže, že údaj na stránce je nepřesný, opravíme ho a aktualizujeme datum poslední revize. Při větších změnách (například změna zákona) změnu krátce poznamenáme přímo v obsahu, aby čtenář věděl, co se změnilo.",
  },
  {
    title: "Žádné fiktivní recenze ani případy",
    body: "Na webu neuvádíme vymyšlené reference, fiktivní zákaznické příběhy ani recenze, které by ve skutečnosti neexistovaly. Důvěryhodnost stavíme na transparentní metodice a kvalitě obsahu, ne na falešných příbězích.",
  },
  {
    title: "Žádný AI-generovaný obsah bez kontroly",
    body: "Pokud při tvorbě obsahu používáme AI nástroje pro koncept nebo redakční podporu, výstup vždy prochází lidskou kontrolou — fakta se ověřují, formulace upravují, citace se doplňují. Surový AI text na webu nepublikujeme.",
  },
] as const;

const SOURCE_CATEGORIES = [
  {
    title: "Katastr a vlastnictví",
    sources: [
      "Český úřad zeměměřický a katastrální (ČÚZK)",
      "Občanský zákoník (89/2012 Sb.)",
    ],
  },
  {
    title: "Daně a finance",
    sources: [
      "Finanční správa ČR",
      "Ministerstvo financí ČR",
      "Česká národní banka (ČNB)",
    ],
  },
  {
    title: "Exekuce, insolvence, dražby",
    sources: [
      "Exekutorská komora ČR (CEE)",
      "Insolvenční rejstřík (ISIR)",
      "Justice.cz — portál Ministerstva spravedlnosti",
    ],
  },
  {
    title: "Právní úprava a advokátní úschova",
    sources: ["Česká advokátní komora", "Zákony pro lidi (plná znění)"],
  },
  {
    title: "Tržní data",
    sources: [
      "Český statistický úřad (ČSÚ) — cenové statistiky",
      "Veřejné inzerce v lokalitě (transakční data)",
    ],
  },
] as const;

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  url: PAGE_URL,
  name: PAGE_NAME,
  description:
    "Redakční zásady webu vykoupim-nemovitost.cz — zdroje, ověřování, aktualizace, opravy.",
  inLanguage: "cs-CZ",
  isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
  publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  speakable: buildSpeakableSpec(),
};

export default function RedakcniZasadyPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />

      <div className="bg-white">
        <section className="mx-auto max-w-4xl px-6 pt-8">
          <Breadcrumbs
            items={[{ label: "Redakční zásady", href: PAGE_PATH }]}
          />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-4 pt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Redakční zásady
          </h1>
          <LastUpdated path={PAGE_PATH} />
          <QuickAnswer>
            <p>
              Obsah na vykoupim-nemovitost.cz píšeme podle šesti pravidel:
              citujeme primární české zdroje, píšeme srozumitelně místo
              marketingově, pravidelně aktualizujeme každou stránku, opravujeme
              chyby otevřeně, neuvádíme fiktivní reference a AI nástroje
              používáme jen pro koncept — finální text vždy prochází lidskou
              redakcí. Cílem je obsah užitečný pro člověka v reálné životní
              situaci, ne pro vyhledávač.
            </p>
            <p>
              Každý článek má viditelné datum poslední aktualizace. Faktické
              údaje (lhůty, sazby, právní postupy) opíráme o ČÚZK, Finanční
              správu, Český statistický úřad, Exekutorskou komoru, Českou
              advokátní komoru a občanský zákoník v aktuálním znění. Stránky s
              ročními údaji procházíme minimálně jednou ročně, stránky s
              daňovými údaji vždy před začátkem nového kalendářního roku,
              regionální cenová data kvartálně. Nahlášené chyby opravujeme do 7
              pracovních dnů a změnu označujeme datem revize.
            </p>
          </QuickAnswer>
        </section>

        {/* Principles */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">Šest pravidel</h2>
            <div className="mt-8 space-y-6">
              {PRINCIPLES.map((p, i) => (
                <article
                  key={p.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {i + 1}. {p.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-slate-700">
                    {p.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Source categories */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Kategorie zdrojů, které citujeme
            </h2>
            <p className="mt-3 leading-relaxed text-slate-600">
              Kompletní seznam s odkazy najdete na samostatné stránce{" "}
              <Link
                href="/zdroje-a-citace"
                className="font-medium text-emerald-700 hover:text-emerald-800"
              >
                Zdroje a citace
              </Link>
              .
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {SOURCE_CATEGORIES.map((cat) => (
                <div
                  key={cat.title}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="text-base font-semibold text-slate-900">
                    {cat.title}
                  </h3>
                  <ul className="mt-3 space-y-1 text-sm text-slate-700">
                    {cat.sources.map((s) => (
                      <li key={s} className="flex gap-2">
                        <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-slate-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Update cadence */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Jak často obsah aktualizujeme
            </h2>
            <ul className="mt-6 space-y-3 leading-relaxed text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Stránky o procesu, ceně, právním zajištění</strong> —
                  revize alespoň jednou za 12 měsíců nebo bezprostředně po
                  legislativní změně.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Daňové články (daň z prodeje, lhůty)</strong> —
                  každoročně před zahájením nového kalendářního roku.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Regionální cenová data</strong> — kvartálně po
                  zveřejnění nových údajů Českého statistického úřadu.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                <span>
                  <strong>Seznam exekutorů, advokátů, notářských komor</strong>{" "}
                  — kontrola dvakrát ročně.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Corrections */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Hlášení chyb a oprav
            </h2>
            <p className="mt-4 leading-relaxed text-slate-700">
              Pokud na stránce najdete nepřesný nebo zastaralý údaj, dejte nám
              prosím vědět. Chyby opravíme do 7 pracovních dnů a aktualizujeme
              datum poslední revize. U významných změn (změna zákona, nový
              postup) přidáváme krátkou poznámku přímo do obsahu.
            </p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
              >
                Nahlásit chybu →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
