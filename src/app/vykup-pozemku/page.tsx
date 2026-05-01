import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  TreePine,
  MapPin,
  Tractor,
  Building2,
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
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-pozemku", params);
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup pozemků - rychlý prodej pozemku za hotové",
          region.locative,
        )
      : "Výkup pozemků - rychlý prodej pozemku za hotové",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme váš pozemek rychle a bez provize. Stavební, zemědělské i lesní pozemky. Férová cena, vyplacení do 7 dnů. Celá ČR.",
          region.locative,
        )
      : "Vykoupíme váš pozemek rychle a bez provize. Stavební, zemědělské i lesní pozemky. Férová cena, vyplacení do 7 dnů. Celá ČR.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jaké typy pozemků vykupujete?",
    answer:
      "Vykupujeme všechny typy pozemků dle katastrálního členění: stavební pozemky (parcely), zahrady, ornou půdu, lesní pozemky, trvalé travní porosty, vinice, sady a ostatní plochy. Typ pozemku se promítne do ceny — stavební pozemky mají typicky vyšší výkupní cenu než zemědělská půda.",
  },
  {
    question: "Vykoupíte i zemědělský pozemek?",
    answer:
      "Ano. Zemědělské pozemky (orná půda, louky) oceňujeme podle bonity půdy (BPEJ), výměry a lokality. U pozemků v ochranném pásmu nebo s nájemní smlouvou (např. pacht) se zohlední aktuální výnosy. Cena vychází z transakčních dat ČSÚ pro daný kraj a typ půdy.",
  },
  {
    question: "Co když je pozemek ve spoluvlastnictví?",
    answer:
      "Vykupujeme jak celé pozemky se souhlasem všech spoluvlastníků, tak jednotlivé spoluvlastnické podíly. Od 2020 platí obecně, že spoluvlastník svůj podíl prodává bez souhlasu ostatních. Předkupní právo dle § 1124 občanského zákoníku se uplatní pouze u spoluvlastnictví vzniklého děděním (nebo jinou neovlivnitelnou událostí), a to po dobu 6 měsíců od jeho vzniku.",
  },
  {
    question: "Jak rychle proběhne výkup pozemku?",
    answer:
      "Standardně 7–14 dnů. U pozemků obvykle není nutná osobní prohlídka — stačí ověření v katastru, územním plánu a leteckých snímcích. Smlouva je v advokátní úschově, peníze se uvolní po zápisu nového vlastníka v katastru nemovitostí.",
  },
  {
    question: "Vykupujete pozemky bez přístupu z veřejné komunikace?",
    answer:
      "Ano, ale cena reflektuje absenci přístupu — pozemky bez přístupu z veřejné komunikace jsou tržně méně hodnotné. Pokud existuje právo cesty (služebnost) přes sousední pozemek, hodnota se zvyšuje. Vždy ověřujeme v katastru, jestli je věcné břemeno cesty zapsáno.",
  },
  {
    question:
      "Co když je pozemek v ochranném pásmu nebo s ekologickými omezeními?",
    answer:
      "Vykupujeme i pozemky v ochranných pásmech (PHO vodních zdrojů, CHKO, NATURA 2000), s ekologickými omezeními nebo sníženou stavební využitelností. Omezení snižují cenu, ale nikdy neznamenají, že pozemek nelze prodat.",
  },
  {
    question: "Vykupujete lesní pozemky?",
    answer:
      "Ano. Lesní pozemky oceňujeme podle výměry, druhu dřevin, věku porostu a lokality. U lesních pozemků platí specifická pravidla pro převod (souhlas státní správy lesů, předkupní právo dle zákona o lesích). Postup zajistíme za vás.",
  },
  {
    question: "Co když je na pozemku nepovolená stavba (chatka, kůlna)?",
    answer:
      "Nepovolená stavba (černá stavba) v katastru zapsaná není a samostatně se nepřevádí. Pokud vykupujeme pozemek, na němž je černá stavba, je to faktický stav, který se v ceně projeví. Odstranění stavby řeší obvykle nový vlastník nebo se sjednává jako podmínka prodeje.",
  },
] as const;

interface Situation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SITUATIONS: readonly Situation[] = [
  {
    icon: Building2,
    title: "Stavební pozemek, který nevyužijete",
    description:
      "Koupili jste pozemek na stavbu, ale plány se změnily? Vykoupíme ho rychle za férovou cenu.",
  },
  {
    icon: Tractor,
    title: "Zděděná zemědělská půda",
    description:
      "Zdědili jste pole nebo louku a nemáte využití? Odkoupíme zemědělský pozemek bez zbytečných průtahů.",
  },
  {
    icon: TreePine,
    title: "Lesní pozemek",
    description:
      "Vlastníte les, o který se nemůžete starat? Vykoupíme lesní pozemky i parcely v odlehlých lokalitách.",
  },
  {
    icon: MapPin,
    title: "Spoluvlastnický podíl na pozemku",
    description:
      "Spoluvlastníci se nemohou dohodnout? Odkoupíme váš podíl nebo celý pozemek a situaci vyřešíme.",
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
    title: "2. Posouzení pozemku",
    description: "Prověříme pozemek v katastru, územní plán a právní stav.",
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

export default async function VykupPozemkuPage({
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
    "@id": "https://vykoupim-nemovitost.cz/vykup-pozemku",
    name: "Výkup pozemků - rychlý prodej pozemku za hotové",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme váš pozemek rychle a bez provize. Stavební, zemědělské i lesní pozemky. Férová cena, vyplacení do 7 dnů. Celá ČR.",
          region.locative,
        )
      : "Vykoupíme váš pozemek rychle a bez provize. Stavební, zemědělské i lesní pozemky. Férová cena, vyplacení do 7 dnů. Celá ČR.",
    url: "https://vykoupim-nemovitost.cz/vykup-pozemku",
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

      <GeoServiceJsonLd useCaseSlug="vykup-pozemku" searchParams={params} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: "Výkup pozemků", href: "/vykup-pozemku" }]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup pozemků a parcel - rychle, férově a bez provize",
                  region.locative,
                )
              : "Výkup pozemků a parcel - rychle, férově a bez provize"}
          </h1>
          <LastUpdated path="/vykup-pozemku" />
          <QuickAnswer>
            <p>
              Výkup pozemku je rychlý prodej, při kterém specializovaná firma
              odkoupí stavební parcelu, zemědělskou půdu, lesní pozemek nebo
              zahradu za 80–90 % tržní hodnoty. Cena se počítá z výměry podle{" "}
              <a
                href={EXTERNAL_SOURCES.cuzk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                katastru nemovitostí
              </a>
              , typu pozemku (stavební vs. zemědělský), bonity půdy (BPEJ) u
              zemědělské půdy a aktuálních transakčních dat{" "}
              <a
                href={EXTERNAL_SOURCES.czso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Českého statistického úřadu
              </a>
              . Stavební pozemky se v ČR Q2 2026 obchodují v rozsahu 1 600 Kč/m²
              (Vysočina) — 14 000 Kč/m² (Praha); kompletní krajský přehled v{" "}
              <Link
                href="/index-vykupnich-cen"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                indexu výkupních cen
              </Link>
              .
            </p>
            <p>
              Vykupují se pozemky všech typů, včetně pozemků v ochranných
              pásmech, bez přístupu z veřejné komunikace, ve spoluvlastnictví, s
              nájemní smlouvou (pacht) nebo s ekologickými omezeními. U lesních
              pozemků platí specifické pravidla převodu (souhlas státní správy
              lesů, zákonné předkupní právo dle zákona o lesích) — tato
              administrativa přechází na výkupce.
            </p>
            <p>
              Celý proces výkupu trvá 7–14 dnů. Osobní prohlídka u pozemků
              obvykle není nutná — stačí ověření v katastru, územním plánu a
              leteckých snímcích. Smlouva je v advokátní úschově do zápisu
              nového vlastníka v katastru, vyplacení do 3–5 pracovních dnů po
              zápisu.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
            Chcete prodat pozemek rychle a bez zbytečných komplikací? Vykoupíme
            váš pozemek za férovou cenu a peníze vyplatíme do 7 dnů. Žádné
            čekání na kupce, žádné provize, žádné skryté poplatky.
          </p>
          <p className="mt-4 text-slate-600">
            Specializujeme se na výkup všech typů pozemků v celé České
            republice. Vykupujeme stavební parcely, zemědělskou půdu, lesní
            pozemky, zahrady i parcely se složitými vlastnickými vztahy.
            Nezáleží na velikosti ani lokalitě - každý pozemek posoudíme
            individuálně.
          </p>
          <p className="mt-4 text-slate-600">
            Prodej pozemku přes realitní kancelář nebo inzerci může trvat měsíce
            i roky, zejména u zemědělských a lesních pozemků. U nás získáte
            nabídku do 24 hodin a celý proces od kontaktu po vyplacení zvládneme
            v řádu dnů.
          </p>
          <p className="mt-4 text-slate-600">
            Náš tým prověří právní stav pozemku v katastru nemovitostí, ověří
            územní plán a zajistí veškeré dokumenty potřebné pro bezpečný převod
            vlastnictví. Veškeré náklady na právní služby a převod hradíme my.
          </p>
          <p className="mt-4 text-slate-600">
            Ať už vlastníte stavební parcelu v centru města, zemědělské pole na
            venkově nebo lesní pozemek v horách - ozvěte se nám. Nabídneme vám
            férovou cenu a vyřešíme vše za vás. Konzultace je zdarma a zcela
            nezávazná.
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
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Všechny typy
            pozemků
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup pozemku vhodný
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
            Jak výkup pozemku probíhá
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
              href="/vykup-domu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup domů →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu pozemků
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
              Prodejte pozemek rychle a výhodně
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
          <RelatedArticles articles={getRelatedArticles("vykup-pozemku")} />
        </div>
      </section>
      <GeoRegionContent useCaseSlug="vykup-pozemku" regionKey={krajParam} />

      <GeoRelatedPages currentSlug="vykup-pozemku" currentKraj={krajParam} />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
