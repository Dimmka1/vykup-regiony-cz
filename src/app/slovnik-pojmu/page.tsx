import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";

const PAGE_PATH = "/slovnik-pojmu";
const PAGE_URL = `https://vykoupim-nemovitost.cz${PAGE_PATH}`;

export const metadata: Metadata = {
  title: "Slovník pojmů — výkup nemovitostí | Vykoupím Nemovitost",
  description:
    "Definice odborných pojmů z oblasti výkupu nemovitostí: exekuce, dražba, věcné břemeno, advokátní úschova, katastr nemovitostí, spoluvlastnický podíl a další.",
  alternates: withHreflang({ canonical: PAGE_URL }),
  openGraph: {
    title: "Slovník pojmů — výkup nemovitostí",
    description:
      "Definice odborných pojmů s odkazy na autoritativní zdroje (ČÚZK, Finanční správa, Exekutorská komora).",
    url: PAGE_URL,
    type: "website",
  },
};

interface GlossaryTerm {
  readonly term: string;
  /** Stable id slug used for in-page anchors and DefinedTerm @id. */
  readonly slug: string;
  /** 2–3 sentence Czech definition, structured as a semantic triple. */
  readonly definition: string;
  /** Optional cross-link to related use-case page on this site. */
  readonly seeAlso?: { readonly label: string; readonly href: string };
  /** Optional Tier-1 source from EXTERNAL_SOURCES — the authoritative reference. */
  readonly sourceKey?: keyof typeof EXTERNAL_SOURCES;
}

const TERMS: readonly GlossaryTerm[] = [
  {
    term: "Advokátní úschova",
    slug: "advokatni-uschova",
    definition:
      "Advokátní úschova je depozitum peněz vedené advokátem podle pravidel České advokátní komory. Při výkupu nemovitosti zajišťuje, že kupní cena leží na úschovním účtu, dokud katastr nemovitostí nezapíše nového vlastníka. Prodávající dostává peníze až po právním převodu vlastnictví.",
    sourceKey: "cak",
  },
  {
    term: "Bytové družstvo",
    slug: "bytove-druzstvo",
    definition:
      "Bytové družstvo je právnická osoba vlastnící bytový dům, jejíž členové mají právo na užívání konkrétního bytu (členský podíl). Prodej družstevního bytu je převodem členských práv, ne převodem nemovitosti — neprobíhá zápisem do katastru, ale dohodou s družstvem.",
    seeAlso: { label: "Výkup bytů", href: "/vykup-bytu" },
  },
  {
    term: "Centrální evidence exekucí (CEE)",
    slug: "cee",
    definition:
      "Centrální evidence exekucí je veřejná online databáze vedená Exekutorskou komorou ČR, která shromažďuje všechny zahájené exekuce v České republice. Slouží k ověření, zda je proti vlastníkovi nemovitosti vedena exekuce, a je zdarma dostupná online.",
    sourceKey: "centralniEvidenceExekuci",
  },
  {
    term: "Dražba",
    slug: "drazba",
    definition:
      "Dražba je veřejný prodej nemovitosti zájemcům, který může být dobrovolný (vlastník iniciuje sám) nebo nedobrovolný (nucená dražba v exekuci). Vyvolávací cena bývá 2/3 znaleckého odhadu a vlastník u nucené dražby často získá výrazně méně než tržní cenu.",
    seeAlso: { label: "Výkup v dražbě", href: "/vykup-v-drazbe" },
  },
  {
    term: "Exekuce",
    slug: "exekuce",
    definition:
      "Exekuce je nucený výkon rozhodnutí soudu nebo správního orgánu, který provádí soudní exekutor. Při exekuci na nemovitost lze nemovitost prodat v dražbě, zajistit její zastavení nebo zajistit zápis exekučního příkazu v katastru. Exekuce ukončí vyplacení dluhu věřitelům.",
    seeAlso: { label: "Výkup v exekuci", href: "/vykup-pri-exekuci" },
    sourceKey: "exekutorskakomora",
  },
  {
    term: "Insolvenční rejstřík (ISIR)",
    slug: "isir",
    definition:
      "Insolvenční rejstřík je veřejný informační systém Ministerstva spravedlnosti ČR, který obsahuje všechna insolvenční řízení. Při výkupu nemovitosti slouží k ověření, zda není proti vlastníkovi vedeno insolvenční řízení (úpadek, oddlužení, konkurz).",
    sourceKey: "insolvencnirejstrik",
  },
  {
    term: "Katastr nemovitostí (KN)",
    slug: "katastr-nemovitosti",
    definition:
      "Katastr nemovitostí je veřejný registr vedený Českým úřadem zeměměřickým a katastrálním (ČÚZK), který obsahuje údaje o nemovitostech a jejich vlastnících. Vlastnictví se mění výhradně zápisem do katastru nemovitostí (vkladem) — kupní smlouva sama o sobě nestačí.",
    sourceKey: "cuzk",
  },
  {
    term: "Kupní smlouva",
    slug: "kupni-smlouva",
    definition:
      "Kupní smlouva je dvoustranný právní úkon mezi prodávajícím a kupujícím, kterým se převádí vlastnictví nemovitosti za sjednanou cenu. Pro nemovitost musí být v písemné formě s úředně ověřenými podpisy a podléhá zápisu vkladu do katastru.",
    sourceKey: "obcanskyzakonik",
  },
  {
    term: "List vlastnictví (LV)",
    slug: "list-vlastnictvi",
    definition:
      "List vlastnictví je oficiální výpis z katastru nemovitostí, který dokládá vlastnictví konkrétní nemovitosti. Obsahuje identifikaci vlastníka, popis nemovitosti, omezení vlastnického práva (zástavy, věcná břemena, exekuce) a poznámky o probíhajících řízeních.",
    sourceKey: "cuzk",
  },
  {
    term: "Návrh na vklad",
    slug: "navrh-na-vklad",
    definition:
      "Návrh na vklad je formální podání na příslušný katastrální úřad, kterým se zahajuje řízení o zápisu změny vlastnictví do katastru nemovitostí. Obvykle ho podává advokát nebo prodávající, lhůta katastrálního úřadu k rozhodnutí činí 20–30 dnů.",
    sourceKey: "cuzk",
  },
  {
    term: "Občanský zákoník",
    slug: "obcansky-zakonik",
    definition:
      "Občanský zákoník (zákon č. 89/2012 Sb.) je základní soukromoprávní předpis ČR upravující vlastnictví, spoluvlastnictví, věcná břemena, kupní smlouvu, zástavní právo a další instituty důležité pro výkup nemovitostí.",
    sourceKey: "obcanskyzakonik",
  },
  {
    term: "Odhad ceny nemovitosti",
    slug: "odhad-ceny",
    definition:
      "Odhad ceny nemovitosti je odborné určení obvyklé ceny (tržní hodnoty) zpracované znalcem v oboru oceňování nebo realitním odborníkem. Při výkupu se používá k výpočtu výkupní ceny, která se obvykle pohybuje 80–90 % tržní hodnoty.",
    seeAlso: { label: "Jak stanovujeme cenu", href: "/jak-stanovujeme-cenu" },
  },
  {
    term: "PENB — průkaz energetické náročnosti budovy",
    slug: "penb",
    definition:
      "Průkaz energetické náročnosti budovy (PENB) je dokument hodnotící energetickou náročnost stavby na škále A–G. Při prodeji nemovitosti je povinný a musí být předán kupujícímu nejpozději při podpisu kupní smlouvy.",
  },
  {
    term: "Předkupní právo",
    slug: "predkupni-pravo",
    definition:
      "Předkupní právo je právo určité osoby (spoluvlastníka, obce, družstva) přednostně koupit nemovitost za stejných podmínek, jaké nabídl jiný kupec. Vlastník musí předkupníkovi nabídnout převod a počkat na zákonnou lhůtu (obvykle 3 měsíce) před prodejem třetí osobě.",
    sourceKey: "obcanskyzakonik",
  },
  {
    term: "Spoluvlastnický podíl",
    slug: "spoluvlastnicky-podil",
    definition:
      "Spoluvlastnický podíl je ideální zlomek vlastnictví nemovitosti (např. 1/2, 1/4), který lze samostatně převádět. Spoluvlastník svůj podíl prodat může i bez souhlasu ostatních spoluvlastníků; ti mají zákonné předkupní právo.",
    seeAlso: {
      label: "Výkup spoluvlastnického podílu",
      href: "/vykup-spoluvlastnickeho-podilu",
    },
    sourceKey: "obcanskyzakonik",
  },
  {
    term: "Tržní hodnota (obvyklá cena)",
    slug: "trzni-hodnota",
    definition:
      "Tržní hodnota neboli obvyklá cena je cena, za kterou by nemovitost byla prodána za standardních tržních podmínek mezi nezávislými subjekty. Slouží jako referenční hodnota pro odhady, banky (LTV hypotéky) a daně.",
    sourceKey: "czso",
  },
  {
    term: "Věcné břemeno",
    slug: "vecne-bremeno",
    definition:
      "Věcné břemeno je právní zatížení nemovitosti, které opravňuje třetí osobu k jejímu užívání nebo požitkům (například doživotní právo bydlení, právo cesty). Věcné břemeno je zapsáno v katastru nemovitostí a přechází na nového vlastníka.",
    seeAlso: {
      label: "Výkup s věcným břemenem",
      href: "/vykup-nemovitosti-s-vecnym-bremenem",
    },
    sourceKey: "obcanskyzakonik",
  },
  {
    term: "Vklad do katastru",
    slug: "vklad-do-katastru",
    definition:
      "Vklad do katastru je právní úkon, kterým se mění vlastnické právo k nemovitosti. Nový vlastník je vlastníkem až okamžikem zápisu vkladu, ne podpisem kupní smlouvy. Lhůta katastrálního úřadu je obvykle 20–30 dnů od podání návrhu.",
    sourceKey: "cuzk",
  },
  {
    term: "Zástavní právo (hypotéka)",
    slug: "zastavni-pravo",
    definition:
      "Zástavní právo zajišťuje pohledávku věřitele (typicky banky) zástavou nemovitosti. Při výkupu zatížené nemovitosti se zbývající hypotéka uhradí přímo bance z kupní ceny a prodávající obdrží rozdíl.",
    seeAlso: {
      label: "Výkup s hypotékou",
      href: "/vykup-nemovitosti-s-hypotekou",
    },
    sourceKey: "cnb",
  },
  {
    term: "Zpětný leasing (sale & leaseback)",
    slug: "zpetny-leasing",
    definition:
      "Zpětný leasing je transakce, při které vlastník prodá nemovitost a zároveň ji od nového vlastníka odkoupí formou pronájmu. Slouží k získání likvidity bez nutnosti opustit nemovitost; po skončení nájemní lhůty může být nemovitost odkoupena zpět.",
    seeAlso: { label: "Zpětný nájem", href: "/zpetny-najem" },
  },
  {
    term: "Daň z příjmů z prodeje nemovitosti",
    slug: "dan-z-prijmu",
    definition:
      "Daň z příjmů z prodeje nemovitosti je 15% daň z rozdílu mezi prodejní cenou a daňovou základnou. Osvobozena je nemovitost vlastněná déle než 10 let nebo nemovitost, kde prodávající bydlel déle než 2 roky před prodejem (podle aktuálního zákona o dani z příjmů).",
    seeAlso: {
      label: "Daň z prodeje nemovitosti 2026",
      href: "/blog/dan-z-prodeje-nemovitosti-2026",
    },
    sourceKey: "financnisprava",
  },
] as const;

function buildJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${PAGE_URL}#glossary`,
    name: "Slovník pojmů — výkup nemovitostí",
    description:
      "Definice odborných pojmů používaných při výkupu nemovitostí v České republice.",
    inLanguage: "cs-CZ",
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    hasDefinedTerm: TERMS.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${PAGE_URL}#${t.slug}`,
      name: t.term,
      description: t.definition,
      inDefinedTermSet: `${PAGE_URL}#glossary`,
      url: `${PAGE_URL}#${t.slug}`,
    })),
  };
}

export default function SlovnikPojmuPage(): React.ReactElement {
  const jsonLd = buildJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="bg-white">
        <section className="mx-auto max-w-4xl px-6 pt-8">
          <Breadcrumbs items={[{ label: "Slovník pojmů", href: PAGE_PATH }]} />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-8 pt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Slovník pojmů
          </h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-600">
            Krátké, srozumitelné definice odborných pojmů, se kterými se setkáte
            při výkupu nemovitostí. U každého pojmu uvádíme odkaz na
            autoritativní český zdroj — ČÚZK, Finanční správu, Exekutorskou
            komoru, ČAK nebo občanský zákoník.
          </p>
          <LastUpdated path={PAGE_PATH} />
        </section>

        {/* Anchor index */}
        <section className="bg-slate-50 py-8">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Rychlý přehled
            </h2>
            <ul className="flex flex-wrap gap-2">
              {TERMS.map((t) => (
                <li key={t.slug}>
                  <a
                    href={`#${t.slug}`}
                    className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {t.term}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Term definitions */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <dl className="space-y-10">
              {TERMS.map((t) => {
                const source = t.sourceKey
                  ? EXTERNAL_SOURCES[t.sourceKey]
                  : null;
                return (
                  <div
                    key={t.slug}
                    id={t.slug}
                    className="scroll-mt-24 border-b border-slate-100 pb-10 last:border-0"
                  >
                    <dt>
                      <h3 className="text-xl font-bold text-slate-900">
                        {t.term}
                      </h3>
                    </dt>
                    <dd className="mt-3 leading-relaxed text-slate-700">
                      {t.definition}
                    </dd>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {source && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800"
                        >
                          Zdroj: {source.name} ↗
                        </a>
                      )}
                      {t.seeAlso && (
                        <Link
                          href={t.seeAlso.href}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700"
                        >
                          Viz také: {t.seeAlso.label} →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Pojem, který hledáte, nenajdete?
            </h2>
            <p className="mt-3 text-slate-300">
              Zavolejte nebo napište — vysvětlíme cokoli, co potřebujete
              pochopit před prodejem nemovitosti.
            </p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400"
              >
                Nezávazná konzultace zdarma
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
