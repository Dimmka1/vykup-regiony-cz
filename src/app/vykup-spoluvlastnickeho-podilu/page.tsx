import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Users,
  Scale,
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
  const canonicalUrl = buildGeoCanonicalUrl(
    "/vykup-spoluvlastnickeho-podilu",
    params,
  );
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup spoluvlastnického podílu na nemovitosti - férová cena bez soudů",
          region.locative,
        )
      : "Výkup spoluvlastnického podílu na nemovitosti - férová cena bez soudů",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme váš spoluvlastnický podíl na nemovitosti rychle a bez soudních sporů. Férová cena, právní servis zdarma, výplata do 7 dnů. Bez provize.",
          region.locative,
        )
      : "Vykoupíme váš spoluvlastnický podíl na nemovitosti rychle a bez soudních sporů. Férová cena, právní servis zdarma, výplata do 7 dnů. Bez provize.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Mohu prodat pouze svůj podíl na nemovitosti?",
    answer:
      "Ano. Spoluvlastnický podíl je samostatně převoditelný majetek — k prodeji třetí osobě obecně nepotřebujete souhlas ostatních spoluvlastníků ani jim nemusíte podíl přednostně nabídnout. Zákonné předkupní právo dle § 1124 občanského zákoníku platí pouze, pokud spoluvlastnictví vzniklo děděním (nebo jinou událostí, kterou spoluvlastníci nemohli ovlivnit), a to po dobu 6 měsíců od jeho vzniku.",
  },
  {
    question: "Kolik za spoluvlastnický podíl dostanu?",
    answer:
      "Výkupní cena se pohybuje 80–90 % tržní hodnoty vašeho podílu. Tržní hodnota podílu = tržní cena celé nemovitosti × velikost podílu (1/2, 1/4, 1/8 atd.) s případnou srážkou za nutnost spoluvlastnického vypořádání. Ocenění je zdarma a nezávazné.",
  },
  {
    question: "Jak dlouho trvá výkup spoluvlastnického podílu?",
    answer:
      "Standardně 14 dnů. Pokud podíl pochází z dědictví a je v 6měsíčním okně předkupního práva, lhůta se prodlužuje o čas potřebný k oslovení ostatních spoluvlastníků. U běžně koupeného podílu lhůta naopak 14 dnů nepřevyšuje.",
  },
  {
    question: "Co když ostatní spoluvlastníci podíl chtějí koupit sami?",
    answer:
      "Pokud existuje předkupní právo (jen u dědictvím vzniklého spoluvlastnictví, 6 měsíců) a ostatní ho využijí, prodej proběhne jim za stejnou cenu, jakou nabízí externí kupec. Pokud právo nevyužijí (nebo žádné nevzniklo), prodej proběhne podle původní dohody. Komunikaci se spoluvlastníky vedeme za vás.",
  },
  {
    question: "Jak velký podíl mohu prodat?",
    answer:
      "Vykupujeme jakýkoli velikostní podíl — od 1/16 (např. po druhém dělení dědictví) až po 1/2. Velikost podílu samotná nemá vliv na slevu, hraje roli kvalita nemovitosti a počet a postoj ostatních spoluvlastníků.",
  },
  {
    question:
      "Spoluvlastnictví vzniklo dědictvím — můžeme prodat ještě před zápisem?",
    answer:
      "Standardně se prodej uskuteční až po pravomocném usnesení o dědictví a zápisu nového spoluvlastníka v katastru. U urgentních případů lze formálně zahájit přípravu prodeje souběžně s dědickým řízením a uzavřít transakci hned po zápisu.",
  },
  {
    question: "Co když je podíl zatížen exekucí jednoho z spoluvlastníků?",
    answer:
      "Exekuce se vždy týká pouze konkrétního spoluvlastnického podílu, ne celé nemovitosti. Pokud má exekuci ten, kdo prodává, dluh se uhradí z kupní ceny. Pokud ji má někdo z ostatních, vás se to právně netýká.",
  },
  {
    question: "Můžeme prodat manželský podíl ze SJM po rozvodu?",
    answer:
      "Společné jmění manželů (SJM) po rozvodu zaniká a vypořádává se buď dohodou, nebo soudem. Před vypořádáním lze prodat polovinu SJM jako spoluvlastnický podíl — za podmínky, že druhý manžel souhlasí nebo soud rozhodne o samostatném vypořádání.",
  },
  {
    question: "Co když má nemovitost více než 5 spoluvlastníků?",
    answer:
      "Postup je stejný i u více spoluvlastníků. Pokud existuje předkupní právo (jen u dědictvím vzniklého spoluvlastnictví v 6měsíčním okně), musí být nabídnuto všem oprávněným současně. Komunikaci, doručování a vyhodnocení odpovědí vedeme za vás. U běžného spoluvlastnictví bez předkupního práva výkup proběhne ve standardní lhůtě.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: HandCoins,
    title: "1. Nezávazná nabídka",
    description:
      "Zašlete nám informace o nemovitosti a do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Scale,
    title: "2. Právní analýza",
    description:
      "Prověříme vlastnické vztahy, předkupní práva a připravíme optimální postup.",
  },
  {
    icon: Users,
    title: "3. Komunikace se spoluvlastníky",
    description:
      "Zajistíme zákonné oslovení spoluvlastníků ohledně předkupního práva.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Po podpisu smlouvy obdržíte peníze na účet do 7 dnů.",
  },
] as const;

export default async function VykupSpoluvlastnickehoPodilu({
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
    "@id": "https://vykoupim-nemovitost.cz/vykup-spoluvlastnickeho-podilu",
    name: "Výkup spoluvlastnického podílu na nemovitosti",
    description:
      "Vykoupíme váš spoluvlastnický podíl na nemovitosti rychle a bez soudních sporů.",
    url: "https://vykoupim-nemovitost.cz/vykup-spoluvlastnickeho-podilu",
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
        useCaseSlug="vykup-spoluvlastnickeho-podilu"
        searchParams={params}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                {
                  label: "Výkup spoluvlastnického podílu",
                  href: "/vykup-spoluvlastnickeho-podilu",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup spoluvlastnického podílu na nemovitosti",
                  region.locative,
                )
              : "Výkup spoluvlastnického podílu na nemovitosti"}
          </h1>
          <LastUpdated path="/vykup-spoluvlastnickeho-podilu" />
          <QuickAnswer>
            <p>
              Spoluvlastnický podíl na nemovitosti je samostatně převoditelný
              majetek — spoluvlastník může svůj podíl prodat bez souhlasu
              ostatních. Od 1. července 2020 obecné zákonné předkupní právo
              spoluvlastníků zaniklo; podle § 1124{" "}
              <a
                href={EXTERNAL_SOURCES.obcanskyzakonik.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                občanského zákoníku
              </a>{" "}
              dnes zůstává jen ve zvláštních případech (např. spoluvlastnictví z
              dědictví), a to po dobu 6 měsíců od vzniku.
            </p>
            <p>
              Výkupní cena se pohybuje 80–90 % tržní hodnoty podílu. Hodnota
              podílu se počítá jako tržní cena celé nemovitosti vynásobená
              velikostí podílu (1/2, 1/4, 1/8 atd.) s případnou srážkou za
              nutnost spoluvlastnického vypořádání. Vykupujeme podíly libovolné
              velikosti, bez ohledu na počet ostatních spoluvlastníků.
            </p>
            <p>
              Celý proces trvá 14 dnů u běžně získaných podílů. U podílů z
              čerstvého dědictví, kde 6měsíční předkupní právo trvá, lhůtu o
              tuto dobu prodlouží — komunikaci se spoluvlastníky, právní servis
              i podání návrhu na vklad do{" "}
              <a
                href={EXTERNAL_SOURCES.cuzk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                katastru nemovitostí
              </a>{" "}
              zajišťujeme za vás.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
            Spoluvlastnictví nemovitosti se může snadno proměnit v noční můru -
            neshody ohledně správy, oprav nebo budoucnosti nemovitosti jsou na
            denním pořádku. Pokud chcete ze spoluvlastnictví vystoupit rychle a
            bez soudních sporů, jsme tu pro vás.
          </p>
          <p className="mt-4 text-slate-600">
            Spoluvlastnický podíl na nemovitosti je specifický typ majetku,
            který se na běžném trhu prodává velmi obtížně. Většina kupujících
            hledá celé nemovitosti, nikoliv podíly s rizikem konfliktů s dalšími
            spoluvlastníky. Proto mnoho majitelů podílů zůstává v patové situaci
            roky.
          </p>
          <p className="mt-4 text-slate-600">
            My se specializujeme právě na tyto případy. Vykoupíme váš
            spoluvlastnický podíl za férovou tržní cenu a celý proces zvládneme
            bez zbytečné byrokracie. Naši právníci se postarají o veškerou
            dokumentaci včetně zákonného oslovení ostatních spoluvlastníků
            ohledně předkupního práva.
          </p>
          <p className="mt-4 text-slate-600">
            Spoluvlastnictví často vzniká při dědění, kdy nemovitost zdědí více
            dědiců, nebo po rozvodu, kdy se manželé nedokáží dohodnout na
            vypořádání. V obou případech nabízíme elegantní řešení - vykoupíme
            váš podíl a vy získáte finanční prostředky bez dlouhých soudních
            řízení.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces je zcela diskrétní. Respektujeme soukromí všech
            zúčastněných stran a jednáme profesionálně. Vaše data i podmínky
            obchodu považujeme za přísně důvěrné.
          </p>
          <p className="mt-4 text-slate-600">
            Neváhejte nás kontaktovat pro nezávaznou konzultaci. Posoudíme vaši
            situaci a navrhneme optimální řešení šité na míru. Vše bez poplatků
            a závazků.
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
            Časté dotazy k výkupu spoluvlastnického podílu
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
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Další situace, které řešíme
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/vykup-pri-exekuci"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup při exekuci
            </Link>
            <Link
              href="/vykup-pri-dedictvi"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup při dědictví
            </Link>
            <Link
              href="/vykup-pri-rozvodu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup při rozvodu
            </Link>
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup s hypotékou
            </Link>
            <Link
              href="/vykup-nemovitosti-s-vecnym-bremenem"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup s věcným břemenem
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Zbavte se spoluvlastnického podílu bez starostí
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Pomůžeme vám najít nejlepší řešení.
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
            articles={getRelatedArticles("vykup-spoluvlastnickeho-podilu")}
          />
        </div>
      </section>
      <GeoRegionContent
        useCaseSlug="vykup-spoluvlastnickeho-podilu"
        regionKey={krajParam}
      />

      <GeoRelatedPages
        currentSlug="vykup-spoluvlastnickeho-podilu"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
