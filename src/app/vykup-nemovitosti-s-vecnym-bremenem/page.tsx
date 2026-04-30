import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  FileSearch,
  ScrollText,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
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
    "/vykup-nemovitosti-s-vecnym-bremenem",
    params,
  );
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup nemovitosti s věcným břemenem - rychle a bez komplikací",
          region.locative,
        )
      : "Výkup nemovitosti s věcným břemenem - rychle a bez komplikací",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme nemovitost zatíženou věcným břemenem - služebností, právem užívání i zástavou. Férová cena, právní servis zdarma, výplata do 7 dnů.",
          region.locative,
        )
      : "Vykoupíme nemovitost zatíženou věcným břemenem - služebností, právem užívání i zástavou. Férová cena, právní servis zdarma, výplata do 7 dnů.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Lze prodat nemovitost s věcným břemenem?",
    answer:
      "Ano, nemovitost s věcným břemenem lze prodat. Věcné břemeno přechází na nového vlastníka, proto většina běžných kupujících o takové nemovitosti nemá zájem. My se na tyto případy specializujeme a nemovitost vykoupíme za férovou cenu.",
  },
  {
    question: "Jak věcné břemeno ovlivní kupní cenu?",
    answer:
      "Věcné břemeno snižuje tržní hodnotu nemovitosti v závislosti na jeho typu a rozsahu. Právo doživotního užívání má větší dopad než např. služebnost stezky. Vždy nabídneme férovou cenu odpovídající reálné hodnotě nemovitosti s přihlédnutím k břemeni.",
  },
  {
    question: "Jaké typy věcných břemen řešíte?",
    answer:
      "Řešíme všechny typy věcných břemen - služebnosti (právo cesty, právo vedení, právo užívání), reálná břemena i právo doživotního bydlení. U každého typu víme, jak situaci optimálně vyřešit.",
  },
  {
    question: "Lze věcné břemeno zrušit?",
    answer:
      "V některých případech ano - dohodou stran, rozhodnutím soudu nebo zánikem důvodu břemene. Naši právníci posoudí váš případ a navrhnou, zda je výhodnější břemeno zrušit před prodejem, nebo nemovitost prodat i s břemenem.",
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
      "Vyplňte formulář s informacemi o nemovitosti a břemeni. Do 24 hodin obdržíte nabídku.",
  },
  {
    icon: FileSearch,
    title: "2. Právní analýza břemene",
    description:
      "Prověříme druh a rozsah věcného břemene a posoudíme možnosti řešení.",
  },
  {
    icon: ScrollText,
    title: "3. Příprava smlouvy",
    description:
      "Naši právníci připraví kupní smlouvu zohledňující věcné břemeno.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description:
      "Po podpisu smlouvy obdržíte peníze na účet. Celý proces trvá 2–4 týdny.",
  },
] as const;

export default async function VykupNemovitostiSVecnymBremenem({
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
    name: "Výkup nemovitosti s věcným břemenem",
    description:
      "Vykoupíme nemovitost zatíženou věcným břemenem rychle a bez komplikací.",
    url: "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-vecnym-bremenem",
    publisher: {
      "@type": "Organization",
      name: "Výkup Nemovitostí",
      url: "https://vykoupim-nemovitost.cz",
    },
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
        useCaseSlug="vykup-nemovitosti-s-vecnym-bremenem"
        searchParams={params}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                {
                  label: "Výkup s věcným břemenem",
                  href: "/vykup-nemovitosti-s-vecnym-bremenem",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup nemovitosti s věcným břemenem",
                  region.locative,
                )
              : "Výkup nemovitosti s věcným břemenem"}
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Vlastníte nemovitost zatíženou věcným břemenem a nevíte, jak ji
            prodat? Věcné břemeno - ať už jde o právo doživotního bydlení,
            služebnost cesty nebo právo vedení - výrazně komplikuje prodej na
            otevřeném trhu. My vám nabídneme rychlé a férové řešení.
          </p>
          <p className="mt-4 text-slate-600">
            Věcné břemeno je právní omezení zapsané v katastru nemovitostí,
            které přechází na každého nového vlastníka. Proto většina běžných
            kupujících nemá zájem kupovat nemovitost s tímto zatížením.
            Výsledkem je, že majitelé takových nemovitostí často marně hledají
            kupce měsíce i roky.
          </p>
          <p className="mt-4 text-slate-600">
            My se na výkup nemovitostí s věcným břemenem specializujeme. Řešíme
            všechny typy břemen - od služebností (právo cesty, stezky, vedení
            inženýrských sítí) přes reálná břemena až po právo doživotního
            užívání. Každý případ posoudíme individuálně a navrhneme optimální
            řešení.
          </p>
          <p className="mt-4 text-slate-600">
            Nejčastěji se setkáváme s právem doživotního bydlení, které bylo
            zřízeno ve prospěch starších rodinných příslušníků při darování
            nemovitosti. Toto břemeno značně snižuje tržní hodnotu, ale
            neznamená, že nemovitost nelze prodat. Nabídneme vám férovou cenu
            zohledňující reálný dopad břemene.
          </p>
          <p className="mt-4 text-slate-600">
            V některých případech je možné věcné břemeno zrušit - dohodou stran,
            rozhodnutím soudu nebo zánikem důvodu. Naši právníci posoudí, zda je
            tato cesta reálná a výhodná. Pokud ano, pomůžeme vám břemeno
            vymazat, čímž se hodnota nemovitosti výrazně zvýší.
          </p>
          <p className="mt-4 text-slate-600">
            Veškeré právní služby a odhad nemovitosti hradíme my. Neplatíte
            žádnou provizi ani skryté poplatky. Kontaktujte nás pro nezávaznou
            konzultaci - posoudíme vaši situaci a navrhneme nejlepší řešení.
          </p>
          <p className="mt-4 text-slate-600">
            Nečekejte, až se situace zkomplikuje. Čím dříve se na nás obrátíte,
            tím rychleji a výhodněji celou záležitost vyřešíme. Jsme tu pro vás
            - diskrétně, profesionálně a s plným právním servisem.
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
            Časté dotazy k výkupu nemovitosti s věcným břemenem
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
              href="/vykup-spoluvlastnickeho-podilu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup spoluvlastnického podílu
            </Link>
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup s hypotékou
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Prodejte nemovitost s věcným břemenem bez starostí
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
            articles={getRelatedArticles("vykup-nemovitosti-s-vecnym-bremenem")}
          />
        </div>
      </section>
      <GeoRegionContent
        useCaseSlug="vykup-nemovitosti-s-vecnym-bremenem"
        regionKey={krajParam}
      />

      <GeoRelatedPages
        currentSlug="vykup-nemovitosti-s-vecnym-bremenem"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
