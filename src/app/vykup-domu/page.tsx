import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Home,
  Wrench,
  Landmark,
  Users,
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
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-domu", params);
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup rodinných domů — férová cena, vyplaceno do 7 dnů",
          region.locative,
        )
      : "Výkup rodinných domů — férová cena, vyplaceno do 7 dnů",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme rodinný dům v jakémkoli stavu. Staré domy, k rekonstrukci, se zástavou — bez provize. Nabídka do 24 h, peníze do 7 dnů.",
          region.locative,
        )
      : "Vykoupíme rodinný dům v jakémkoli stavu. Staré domy, k rekonstrukci, se zástavou — bez provize. Nabídka do 24 h, peníze do 7 dnů.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Vykupujete i staré domy v špatném stavu?",
    answer:
      "Ano, vykupujeme rodinné domy v jakémkoli stavu — i zchátralé, k demolici, po požáru nebo s vyplaveným sklepem. Stav domu se promítá do výkupní ceny (sleva podle stáří poslední rekonstrukce a energetické náročnosti), ale nikdy domu neodmítneme jen kvůli stavu.",
  },
  {
    question: "Jak stanovíte cenu za rodinný dům?",
    answer:
      "Tržní cena se počítá z m² podlahové plochy podle katastru, ceny pozemku v lokalitě a koeficientu na typ stavby (zděný / dřevostavba / panelový systém). Výkupní cena je 80–90 % korigované tržní hodnoty po odečtu stavu a právního zatížení. Detail metodiky popisuje samostatná stránka.",
  },
  {
    question: "Co když je na domě zástavní právo nebo hypotéka?",
    answer:
      "Hypotéku uhradíme přímo bance z kupní ceny a po splacení banka uvolní zástavní právo. Vy obdržíte rozdíl mezi sjednanou výkupní cenou a zůstatkem hypotéky. Předčasné splacení sjednává náš právní zástupce.",
  },
  {
    question: "Jak dlouho trvá výkup domu?",
    answer:
      "Standardně 7–14 dnů od prvního kontaktu po vyplacení peněz. Lhůta zahrnuje prohlídku, dohodu o ceně, podpis kupní smlouvy v advokátní úschově, podání návrhu na vklad a zápis nového vlastníka v katastru nemovitostí.",
  },
  {
    question: "Vykupujete i nemovitosti s hospodářským objektem nebo stodolou?",
    answer:
      "Ano. Vykupujeme rodinné domy včetně přilehlých staveb (stodoly, hospodářské budovy, garáže) a pozemku, který tvoří funkční celek. Cena se počítá z plochy obytné části + samostatně z hospodářských ploch.",
  },
  {
    question: "Co když je dům spoluvlastnický a my se nemůžeme dohodnout?",
    answer:
      "Vykupujeme i spoluvlastnické podíly samostatně. Souhlas ostatních spoluvlastníků k prodeji obecně nepotřebujete. Zákonné předkupní právo dle § 1124 občanského zákoníku je dnes omezené — uplatní se jen u spoluvlastnictví vzniklého děděním po dobu 6 měsíců od jeho vzniku. Ve většině případů tedy předkupní právo prodej nezdrží.",
  },
  {
    question: "Vykupujete chaty, chalupy, rekreační objekty?",
    answer:
      "Ano. Chaty, chalupy a rekreační domky vykupujeme stejným postupem jako rodinné domy. Cena reflektuje sezónní charakter a dostupnost — u rekreačních objektů hraje větší roli vzdálenost od krajského města a infrastruktura.",
  },
  {
    question: "Vykupujete domy v exekuci nebo dražbě?",
    answer:
      "Ano. Stav exekuce ověřujeme v Centrální evidenci exekucí, dluh uhradíme přímo exekutorovi z kupní ceny. U hrozící dražby zvládneme proces 5–7 dnů, pokud je nařízena dražební vyhláška, kontaktujte nás co nejdříve.",
  },
] as const;

interface Situation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SITUATIONS: readonly Situation[] = [
  {
    icon: Home,
    title: "Zděděný dům, který nevyužíváte",
    description:
      "Zdědili jste dům, o který se nechcete starat? Vykoupíme ho rychle a bez starostí s údržbou.",
  },
  {
    icon: Wrench,
    title: "Dům vyžadující nákladnou rekonstrukci",
    description:
      "Starý dům potřebuje opravu střechy, elektřiny nebo zateplení? Vykoupíme ho bez nutnosti investic.",
  },
  {
    icon: Landmark,
    title: "Dům zatížený hypotékou nebo zástavou",
    description:
      "Nemůžete splácet hypotéku? Vykoupíme dům, splatíme dluh a zbytek vyplatíme vám.",
  },
  {
    icon: Users,
    title: "Spoluvlastnictví nebo rozvod",
    description:
      "Potřebujete rozdělit majetek po rozvodu nebo mezi spoluvlastníky? Rychlý výkup situaci vyřeší.",
  },
] as const;

const STEPS: readonly {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    icon: HandCoins,
    title: "1. Nezávazná nabídka",
    description:
      "Vyplňte formulář a do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Shield,
    title: "2. Prohlídka a posouzení",
    description: "Provedeme prohlídku domu a prověříme právní stav v katastru.",
  },
  {
    icon: BadgeCheck,
    title: "3. Podpis smlouvy",
    description:
      "Připravíme kupní smlouvu a zajistíme bezpečný převod vlastnictví.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Peníze obdržíte na účet do 7 dnů od podpisu smlouvy.",
  },
] as const;

export default async function VykupDomuPage({
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
      "@id": buildQuestionId("/vykup-domu", item.question),
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://vykoupim-nemovitost.cz/vykup-domu",
    name: "Výkup domů - rychlý prodej rodinného domu za hotové",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme váš rodinný dům rychle a bez provize. Staré domy, domy k rekonstrukci i se zástavou. Férová cena, vyplacení do 7 dnů. Celá ČR.",
          region.locative,
        )
      : "Vykoupíme váš rodinný dům rychle a bez provize. Staré domy, domy k rekonstrukci i se zástavou. Férová cena, vyplacení do 7 dnů. Celá ČR.",
    url: "https://vykoupim-nemovitost.cz/vykup-domu",
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

      <GeoServiceJsonLd useCaseSlug="vykup-domu" searchParams={params} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: "Výkup domů", href: "/vykup-domu" }]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup rodinných domů - rychle, férově a bez provize",
                  region.locative,
                )
              : "Výkup rodinných domů - rychle, férově a bez provize"}
          </h1>
          <LastUpdated path="/vykup-domu" />
          <QuickAnswer>
            <p>
              Výkup rodinného domu je rychlý prodej, při kterém specializovaná
              firma odkoupí dům včetně pozemku a hospodářských staveb za hotové.
              Výkupní cena se pohybuje 80–90 % tržní hodnoty domu; tržní hodnota
              se počítá z m² podlahové plochy podle{" "}
              <a
                href={EXTERNAL_SOURCES.cuzk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                katastru nemovitostí
              </a>
              , ceny pozemku v lokalitě podle{" "}
              <a
                href={EXTERNAL_SOURCES.czso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Českého statistického úřadu
              </a>{" "}
              a koeficientu na typ stavby. Pro kontext: průměrná cena rodinného
              domu se v ČR pohybuje od 28 000 Kč/m² (Ústecký kraj) po 105 000
              Kč/m² (Praha) — kompletní rozpis uvádí{" "}
              <Link
                href="/index-vykupnich-cen"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Index výkupních cen
              </Link>
              .
            </p>
            <p>
              Vykupujeme rodinné domy v jakémkoli stavu — od novostaveb po
              chalupy k demolici. Stav domu se promítá do ceny (sleva podle
              stáří poslední rekonstrukce a energetické náročnosti PENB), ale
              dům neodmítneme jen kvůli stavu. Vykupujeme i domy s hypotékou,
              exekucí, věcným břemenem doživotního užívání, ve spoluvlastnictví
              nebo s nájemníkem.
            </p>
            <p>
              Celý proces od první konzultace po vyplacení peněz trvá 7–14 dnů.
              Smlouvu připravuje advokát, peníze leží v advokátní úschově až do
              zápisu nového vlastníka v katastru. Vlastník neplatí provizi,
              právní servis, odhad ani náklady na převod — všechny náklady
              přebírá výkupce.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-slate-600">
            Specializujeme se na výkup rodinných domů po celé České republice.
            Klasický prodej domu přes realitní kancelář trvá 6–12 měsíců — u nás
            je to otázka dnů. Konkrétní výpočet ceny popisuje{" "}
            <Link
              href="/jak-stanovujeme-cenu"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >
              naše transparentní metodika
            </Link>
            .
          </p>
          <p className="mt-4 text-slate-600">
            Náš tým zkušených odhadců a právníků zajistí rychlé a bezpečné
            převedení vlastnických práv. Komunikujeme transparentně a na každém
            kroku víte, co se děje. Žádné skryté podmínky, žádné nepříjemné
            překvapení.
          </p>
          <p className="mt-4 text-slate-600">
            Ať už prodáváte dům ve velkém městě nebo na vesnici, kontaktujte
            nás. Nabídku obdržíte do 24 hodin a zálohu až 500 000 Kč při podpisu
            smlouvy.
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
            <Shield className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Domy v jakémkoli
            stavu
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup domu vhodný
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {SITUATIONS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <s.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak výkup domu probíhá
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
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

      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-xl font-bold text-slate-900">
            Vykupujeme i další typy nemovitostí
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/vykup-bytu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup bytů →
            </Link>
            <Link
              href="/vykup-pozemku"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup pozemků →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu domů
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
              Prodejte dům rychle a výhodně
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Cenovou nabídku obdržíte do 24 hodin.
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
          <RelatedArticles articles={getRelatedArticles("vykup-domu")} />
        </div>
      </section>
      <GeoRegionContent useCaseSlug="vykup-domu" regionKey={krajParam} />

      <GeoRelatedPages currentSlug="vykup-domu" currentKraj={krajParam} />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
