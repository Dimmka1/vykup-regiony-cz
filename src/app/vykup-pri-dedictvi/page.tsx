import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  Users,
  FileText,
  HandCoins,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
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
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-pri-dedictvi", params);
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup nemovitosti při dědictví - rychlý prodej zděděné nemovitosti",
          region.locative,
        )
      : "Výkup nemovitosti při dědictví - rychlý prodej zděděné nemovitosti",
    description: region
      ? injectRegionIntoDescription(
          "Zdědili jste nemovitost a chcete ji rychle prodat? Vykoupíme zděděný byt nebo dům za férovou cenu. Vyřešíme i spoluvlastnictví a dědické spory.",
          region.locative,
        )
      : "Zdědili jste nemovitost a chcete ji rychle prodat? Vykoupíme zděděný byt nebo dům za férovou cenu. Vyřešíme i spoluvlastnictví a dědické spory.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Kdy mohu zděděnou nemovitost prodat?",
    answer:
      "Prodej je možný po pravomocném usnesení o dědictví, které vydává soud nebo notář. Před zápisem nového vlastníka v katastru lze připravovat smlouvu, podpis a vklad však proběhnou až po zápisu. Lhůta pro zápis pravomocného usnesení v katastru je obvykle 20–30 dnů.",
  },
  {
    question: "Co když je více dědiců a neshodnou se?",
    answer:
      "Vykupujeme i jednotlivé spoluvlastnické podíly bez nutnosti souhlasu ostatních dědiců. Ostatní spoluvlastníci podle § 1124 občanského zákoníku dostanou zákonné předkupní právo s tříměsíční lhůtou. Pokud ho nevyužijí, prodej proběhne podle původní nabídky.",
  },
  {
    question: "Musím zděděnou nemovitost před prodejem opravovat?",
    answer:
      "Ne. Nemovitost vykupujeme v aktuálním stavu, bez rekonstrukce, malování ani úklidu. U zděděných nemovitostí, které byly dlouho neobývané, se to týká i zanedbaných stavů — jen se to promítne do výkupní ceny podle stáří poslední rekonstrukce.",
  },
  {
    question: "Jak se řeší daň z prodeje zděděné nemovitosti?",
    answer:
      "Prodej zděděné nemovitosti je osvobozen od 15% daně z příjmů po 10 letech vlastnictví zůstavitele (lhůta běží od nabytí původním zůstavitelem, ne od dědického řízení). Pokud zůstavitel nemovitost vlastnil méně než 10 let, daňová povinnost přechází na dědice — podle aktuálního zákona o dani z příjmů.",
  },
  {
    question: "Co když je v nemovitosti hypotéka, která se převedla na dědice?",
    answer:
      "Hypotéka při dědění přechází na dědice. Při výkupu uhradíme zůstatek hypotéky přímo bance a vy obdržíte rozdíl mezi výkupní cenou a zůstatkem dluhu. Komunikaci s bankou ohledně předčasného splacení vede náš právní zástupce.",
  },
  {
    question: "Vykupujete nemovitosti i během dědického řízení?",
    answer:
      "Vlastní výkup proběhne až po pravomocném usnesení a zápisu nového vlastníka v katastru. Můžeme však souběžně připravit kupní smlouvu, právní analýzu a komunikaci s ostatními dědici, takže transakce proběhne hned po skončení dědického řízení.",
  },
  {
    question: "Co když dědictví obsahuje i exekuci nebo další zatížení?",
    answer:
      "Veškerá zatížení (exekuce, zástavní právo, věcné břemeno) přecházejí spolu s nemovitostí na dědice. Při výkupu je uhradíme z kupní ceny — exekuci přímo exekutorovi (ověříme v Centrální evidenci exekucí), hypotéku bance, věcná břemena vyřešíme samostatně s oprávněnými.",
  },
  {
    question:
      "Můžeme prodat dědictví bez nutnosti dělit kupní cenu mezi dědice?",
    answer:
      "Pokud je v dědictví více dědiců a chtějí dělit kupní cenu, lze ji vyplatit jednotlivě každému dědicovi v poměru jeho podílu — vyplacení proběhne přímo na účty dědiců dle dohody. Tím se předejde nutnosti následného dělení peněz mezi dědice.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: FileText,
    title: "1. Posouzení situace",
    description:
      "Zhodnotíme stav dědického řízení a připravíme nezávaznou nabídku.",
  },
  {
    icon: Users,
    title: "2. Řešení spoluvlastnictví",
    description:
      "Pomůžeme vyřešit vztahy mezi dědici a navrhneme optimální postup.",
  },
  {
    icon: HandCoins,
    title: "3. Férová nabídka",
    description: "Nabídneme 80–90 % tržní hodnoty. Veškeré náklady hradíme my.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Peníze obdržíte do několika dnů od podpisu kupní smlouvy.",
  },
] as const;

export default async function VykupPriDedictviPage({
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
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://vykoupim-nemovitost.cz/vykup-pri-dedictvi",
    name: "Výkup nemovitosti při dědictví",
    url: "https://vykoupim-nemovitost.cz/vykup-pri-dedictvi",
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

      <GeoServiceJsonLd
        useCaseSlug="vykup-pri-dedictvi"
        searchParams={params}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Výkup při dědictví", href: "/vykup-pri-dedictvi" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup nemovitosti při dědictví",
                  region.locative,
                )
              : "Výkup nemovitosti při dědictví"}
          </h1>
          <LastUpdated path="/vykup-pri-dedictvi" />
          <QuickAnswer>
            <p>
              Zděděnou nemovitost lze prodat ihned po pravomocném usnesení o
              dědictví — výkupní firma odkoupí byt, dům nebo pozemek za 80–90 %
              tržní hodnoty. U dědictví více dědiců lze prodat jak celou
              nemovitost (souhlas všech dědiců), tak jednotlivé spoluvlastnické
              podíly bez souhlasu ostatních (s respektováním zákonného
              předkupního práva podle{" "}
              <a
                href={EXTERNAL_SOURCES.obcanskyzakonik.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                občanského zákoníku
              </a>
              ).
            </p>
            <p>
              Daňová povinnost při prodeji zděděné nemovitosti se posuzuje podle
              doby vlastnictví zůstavitele (ne podle dědického řízení). Po 10
              letech vlastnictví zůstavitele je prodej osvobozen od 15% daně z
              příjmů podle{" "}
              <a
                href={EXTERNAL_SOURCES.financnisprava.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Finanční správy ČR
              </a>
              . Hypotéku, exekuci nebo věcné břemeno přecházející na dědice
              uhradíme přímo z kupní ceny.
            </p>
            <p>
              Celý proces výkupu trvá 14–21 dnů od pravomocného usnesení o
              dědictví. Smlouva je v advokátní úschově do zápisu nového
              vlastníka v katastru. Vyplacení může proběhnout jednotlivým
              dědicům dle podílu — bez nutnosti následného dělení mezi dědici.
              Komunikaci, právní servis a daňové poradenství přebíráme.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
            Zdědili jste byt nebo dům a nevíte, co dál? Možná v něm nikdo
            nebydlí, možná se dědici neshodnou. Pomůžeme vám nemovitost rychle
            prodat — bez rekonstrukcí a bez měsíců čekání.
          </p>
          <p className="mt-4 text-slate-600">
            Dědické řízení bývá náročné nejen emočně, ale i právně. Často se
            stává, že nemovitost zdědí více osob, které se neshodnou na dalším
            využití. Dlouhé spory a neobývaná nemovitost přitom znamenají
            zbytečné náklady.
          </p>
          <p className="mt-4 text-slate-600">
            Nabízíme rychlé řešení - vykoupíme celou nemovitost nebo i váš
            spoluvlastnický podíl. Nemusíte čekat měsíce na klasický prodej přes
            realitní kancelář.
          </p>
          <p className="mt-4 text-slate-600">
            Postaráme se o veškerou administrativu včetně komunikace s katastrem
            nemovitostí a notářem. Vy se nemusíte o nic starat.
          </p>
          <p className="mt-4 text-slate-600">
            Nemovitost kupujeme v aktuálním stavu - bez nutnosti rekonstrukce,
            vyklízení nebo oprav. I pokud byla nemovitost dlouho neobývaná, není
            to pro nás překážka.
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
            <Shield className="h-4 w-4 text-emerald-500" /> 100% diskrétní
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
            Časté dotazy k výkupu při dědictví
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
              Prodejte zděděnou nemovitost bez starostí
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Vyřešíme vše za vás.
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
          <RelatedArticles
            articles={getRelatedArticles("vykup-pri-dedictvi")}
          />
        </div>
      </section>
      <GeoRegionContent
        useCaseSlug="vykup-pri-dedictvi"
        regionKey={krajParam}
      />

      <GeoRelatedPages
        currentSlug="vykup-pri-dedictvi"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
