import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  Scale,
  HandCoins,
  Home,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { buildQuestionId } from "@/lib/faq-slug";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { GeoRelatedPages } from "@/components/geo-related-pages";
import { GeoRegionContent } from "@/components/geo-region-content";
import { getRequestHost } from "@/lib/request-host";
import {
  buildGeoCanonicalUrl,
  buildGeoMetadataRobots,
} from "@/lib/geo-canonical";
import {
  resolveGeoRegion,
  injectRegionIntoTitle,
  injectRegionIntoDescription,
  injectRegionIntoH1,
} from "@/lib/geo-seo";
import { GeoServiceJsonLd } from "@/components/geo-service-jsonld";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-pri-rozvodu", params);
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup nemovitosti při rozvodu - rychlé vypořádání majetku",
          region.locative,
        )
      : "Výkup nemovitosti při rozvodu - rychlé vypořádání majetku",
    description: region
      ? injectRegionIntoDescription(
          "Řešíte rozvod a potřebujete rychle prodat společnou nemovitost? Vykoupíme váš byt nebo dům za férovou cenu. Diskrétně a bez provize.",
          region.locative,
        )
      : "Řešíte rozvod a potřebujete rychle prodat společnou nemovitost? Vykoupíme váš byt nebo dům za férovou cenu. Diskrétně a bez provize.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Mohu prodat nemovitost při rozvodu bez souhlasu partnera?",
    answer:
      "U nemovitosti ve společném jmění manželů (SJM) je k prodeji potřeba souhlas obou manželů. Pokud nemovitost vlastníte sami (zděděná, koupená před manželstvím), můžete ji prodat samostatně. Po zániku SJM rozvodem se SJM přemění v podílové spoluvlastnictví — váš poloviční podíl pak lze prodat samostatně bez souhlasu druhého manžela.",
  },
  {
    question: "Jak se rozdělí peníze z prodeje?",
    answer:
      "Rozdělení vychází z dohody manželů nebo z rozhodnutí soudu o vypořádání SJM. Peníze z advokátní úschovy převedeme dle dohody přímo na účty obou stran v dohodnutém poměru. Při sporném vypořádání čekáme na soudní rozhodnutí o poměru dělení.",
  },
  {
    question: "Jak rychle proběhne výkup?",
    answer:
      "Standardně 7–14 dnů od souhlasu obou manželů. U nevypořádaného SJM jen po dohodě o poměru dělení peněz, jinak proces čeká na soudní rozhodnutí. Zálohu až 500 000 Kč lze vyplatit hned při podpisu kupní smlouvy.",
  },
  {
    question: "Co když na nemovitosti vázne hypotéka?",
    answer:
      "Hypotéku uhradíme přímo bance z kupní ceny. Rozdíl mezi výkupní cenou a zůstatkem hypotéky se rozdělí mezi manžele v dohodnutém poměru. Předčasné splacení hypotéky sjedná náš právní zástupce — banka většinou účtuje malý poplatek za předčasné splacení.",
  },
  {
    question: "Co když se s partnerem nedokážeme dohodnout?",
    answer:
      "Pokud se manželé nedohodnou, vypořádání SJM probíhá soudně. Soud rozhoduje o poměru dělení a o tom, komu připadne konkrétní majetek. Po pravomocném rozhodnutí lze zahájit výkup. Ve specifických případech lze prodat polovinu SJM jako spoluvlastnický podíl i bez vypořádání.",
  },
  {
    question: "Daníme prodej nemovitosti při rozvodu?",
    answer:
      "Daňová povinnost se posuzuje stejně jako u běžného prodeje — 15 % daň z příjmů z rozdílu mezi prodejní a pořizovací cenou, u zisku nad 36násobek průměrné mzdy 23 %. Osvobození platí, pokud nemovitost byla vlastněna alespoň 10 let (u nabytí od 2021) nebo 5 let (u nabytí dříve), případně pokud v ní manželé bydleli alespoň 2 roky bezprostředně před prodejem.",
  },
  {
    question: "Jak proběhne vypořádání, pokud má jeden z manželů exekuci?",
    answer:
      "Exekuce na jednoho z manželů ovlivňuje jeho podíl na SJM. Při výkupu se z jeho části kupní ceny uhradí dluh exekutorovi (ověřujeme v Centrální evidenci exekucí), druhý manžel obdrží svůj podíl bez krácení. Postup koordinujeme s exekutorem.",
  },
  {
    question: "Můžeme nemovitost prodat ještě před pravomocným rozvodem?",
    answer:
      "Před rozvodem lze nemovitost ve SJM prodat se souhlasem obou manželů — nemusí se čekat na pravomocné rozhodnutí o rozvodu. Po prodeji se peníze rozdělí dle dohody manželů. Pokud manželé nesouhlasí, čeká se na rozhodnutí o vypořádání SJM po rozvodu.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: Home,
    title: "1. Ocenění nemovitosti",
    description:
      "Zdarma oceníme vaši nemovitost a do 24 hodin vám sdělíme nabídku.",
  },
  {
    icon: Scale,
    title: "2. Dohoda obou stran",
    description:
      "Pomůžeme nastavit podmínky prodeje, které vyhovují oběma manželům.",
  },
  {
    icon: HandCoins,
    title: "3. Férový prodej",
    description:
      "Nabídneme 80–90 % tržní hodnoty. Náklady na převod hradíme my.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Peníze rozdělíme dle dohody a vyplatíme do několika dnů.",
  },
] as const;

export default async function VykupPriRozvoduPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const host = await getRequestHost();
  const params = await searchParams;
  const krajParam = typeof params.kraj === "string" ? params.kraj : null;
  const region = resolveGeoRegion(params);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "@id": buildQuestionId("/vykup-pri-rozvodu", item.question),
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://vykoupim-nemovitost.cz/vykup-pri-rozvodu",
    name: "Výkup nemovitosti při rozvodu",
    url: "https://vykoupim-nemovitost.cz/vykup-pri-rozvodu",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    speakable: buildSpeakableSpec(),
    dateModified: "2026-05-01",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />

      <GeoServiceJsonLd useCaseSlug="vykup-pri-rozvodu" searchParams={params} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Výkup při rozvodu", href: "/vykup-pri-rozvodu" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup nemovitosti při rozvodu",
                  region.locative,
                )
              : "Výkup nemovitosti při rozvodu"}
          </h1>
          <LastUpdated path="/vykup-pri-rozvodu" />
          <QuickAnswer>
            <p>
              Při rozvodu lze nemovitost ve společném jmění manželů (SJM) prodat
              se souhlasem obou manželů — výkupní firma odkoupí byt nebo dům za
              80–90 % tržní hodnoty a peníze rozdělí mezi manžele v dohodnutém
              poměru. Vypořádání SJM se řídí{" "}
              <a
                href={EXTERNAL_SOURCES.obcanskyzakonik.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                občanským zákoníkem
              </a>{" "}
              a může proběhnout dohodou nebo rozhodnutím soudu.
            </p>
            <p>
              Po rozvodu SJM zaniká a přemění se na podílové spoluvlastnictví.
              Polovinu lze poté prodat jako spoluvlastnický podíl samostatně —
              souhlas druhého manžela již nepotřebujete. Hypotéku, exekuci nebo
              věcné břemeno váznoucí na nemovitosti uhradíme z kupní ceny:
              hypotéku přímo bance, exekuci přímo exekutorovi (ověřujeme v{" "}
              <a
                href={EXTERNAL_SOURCES.centralniEvidenceExekuci.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Centrální evidenci exekucí
              </a>
              ).
            </p>
            <p>
              Celý proces výkupu trvá 7–14 dnů od souhlasu obou manželů. Smlouva
              je v advokátní úschově, peníze se uvolňují po zápisu nového
              vlastníka v katastru. Vyplacení proběhne na účty obou manželů
              přímo v poměru dle dohody — bez nutnosti následného dělení peněz
              mezi sebou.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
            Rozvod je náročné životní období a vypořádání společné nemovitosti
            bývá jedním z nejtěžších kroků. Pomůžeme vám prodat nemovitost
            rychle, férově a bez zbytečných sporů.
          </p>
          <p className="mt-4 text-slate-600">
            Při rozvodu se manželé často neshodnou na dalším využití společné
            nemovitosti. Jeden chce bydlet dál, druhý chce svůj podíl vyplatit.
            Rychlý výkup je řešení, které vyhovuje oběma stranám.
          </p>
          <p className="mt-4 text-slate-600">
            Nabídneme férovou cenu odpovídající 80–90 % tržní hodnoty. Peníze z
            prodeje rozdělíme podle vaší dohody nebo rozhodnutí soudu - každému
            jeho podíl na úschovní účet.
          </p>
          <p className="mt-4 text-slate-600">
            Pokud na nemovitosti vázne hypotéka, není to překážka. Zbývající
            dluh uhradíme přímo bance z kupní ceny. Vy se zbavíte závazku a
            můžete začít novou etapu života.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces probíhá diskrétně a profesionálně. Veškerou
            administrativu, právní služby i komunikaci s katastrem zajistíme za
            vás. Neplatíte žádné provize ani poplatky.
          </p>
          <div className="mt-8">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Výplata do 7 dnů
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> Plně diskrétní
            jednání
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak vám pomůžeme
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <step.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu při rozvodu
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-900 marker:[content:''] [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="ml-4 flex-shrink-0 text-emerald-500 transition-transform group-open:rotate-45">
                    ✚
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Vyřešte prodej nemovitosti při rozvodu rychle a férově
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Diskrétní přístup garantován.
            </p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Chci nezávaznou nabídku
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles articles={getRelatedArticles("vykup-pri-rozvodu")} />
        </div>
      </section>
      <GeoRegionContent useCaseSlug="vykup-pri-rozvodu" regionKey={krajParam} />

      <GeoRelatedPages
        currentSlug="vykup-pri-rozvodu"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
