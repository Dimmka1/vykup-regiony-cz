import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Building2,
  Users,
  AlertTriangle,
  Key,
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
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-bytu", params);
  const region = resolveGeoRegion(params);

  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup bytů za hotové — nabídka do 24 h, vyplaceno do 14 dnů",
          region.locative,
        )
      : "Výkup bytů za hotové — nabídka do 24 h, vyplaceno do 14 dnů",
    description: region
      ? injectRegionIntoDescription(
          "Rychlý odkup bytu po celé ČR — Praha, Brno, Ostrava i menší města. Bez provize, peníze na účtu do 14 dnů. Vykupujeme i byty s hypotékou nebo nájemníky.",
          region.locative,
        )
      : "Rychlý odkup bytu po celé ČR — Praha, Brno, Ostrava i menší města. Bez provize, peníze na účtu do 14 dnů. Vykupujeme i byty s hypotékou nebo nájemníky.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jak rychle dokážete byt vykoupit?",
    answer:
      "Standardní výkup bytu trvá 7–14 dnů od prvního kontaktu po vyplacení peněz. U urgentních případů (hrozící dražba, exekuce) zvládneme proces i za 5–7 dnů včetně advokátní úschovy a podání návrhu na vklad do katastru nemovitostí.",
  },
  {
    question: "Vykupujete i družstevní byty?",
    answer:
      "Ano. U družstevního bytu vykupujeme členský podíl v bytovém družstvu — převod neprobíhá zápisem do katastru, ale dohodou s družstvem. Komunikaci s družstvem, schválení převodu i vyrovnání případného členského dluhu zajistíme za vás.",
  },
  {
    question: "Co když je v bytě nájemník?",
    answer:
      "Byty s nájemníkem vykupujeme. Nájemní smlouvu přebíráme, takže nájemník zůstává — vy z bytu nemusíte nikoho stěhovat ani vypovídat smlouvu. Cenu nabídky upravíme podle podmínek nájemní smlouvy a výnosu z nájmu.",
  },
  {
    question: "Kolik za byt nabídnete?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty bytu. Konečná částka závisí na lokalitě, technickém stavu, výměře z katastru a právním zatížení. Neplatíte žádnou provizi, odhad ani právní servis — všechny náklady přebíráme my.",
  },
  {
    question: "Vykupujete i byty v exekuci?",
    answer:
      "Ano. U bytu v exekuci nejprve ověříme přesnou výši dluhu v Centrální evidenci exekucí (vedené Exekutorskou komorou ČR). Z kupní ceny pak uhradíme dluh přímo exekutorovi a vy obdržíte čistou částku po odečtu.",
  },
  {
    question: "Co když mám na bytě hypotéku?",
    answer:
      "Zbývající hypotéku uhradíme přímo bance z kupní ceny při převodu vlastnictví. Vy obdržíte rozdíl mezi sjednanou výkupní cenou a zůstatkem hypotéky. Předčasné splacení pomáhá vyjednat s bankou náš právní zástupce.",
  },
  {
    question: "Co když je byt ve špatném technickém stavu?",
    answer:
      "Byt vykupujeme v aktuálním stavu, bez rekonstrukce, malování nebo úklidu. Stav nemovitosti se promítá do výkupní ceny (sleva podle stáří poslední rekonstrukce a energetické náročnosti), ale nikdy neodmítáme byt jen kvůli stavu.",
  },
  {
    question: "Jak je zajištěna bezpečnost transakce?",
    answer:
      "Kupní smlouvu připravuje advokát a peníze leží v advokátní úschově podle pravidel České advokátní komory. Z úschovy se uvolní až po zápisu nového vlastníka do katastru nemovitostí — do té doby zůstanou v bezpečí.",
  },
  {
    question: "Mohu prodat jen spoluvlastnický podíl na bytě?",
    answer:
      "Ano. Spoluvlastnický podíl (např. 1/2, 1/4) lze samostatně převádět bez souhlasu ostatních spoluvlastníků. Ostatním spoluvlastníkům podle občanského zákoníku náleží zákonné předkupní právo, které vyřešíme za vás.",
  },
  {
    question: "Kdy přesně dostanu peníze?",
    answer:
      "Zálohu až 500 000 Kč obdržíte hned při podpisu kupní smlouvy. Zbývající kupní cena se vyplatí z advokátní úschovy do 3–5 pracovních dnů od zápisu do katastru — celkem tedy obvykle 14 dnů od první konzultace.",
  },
] as const;

interface Situation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SITUATIONS: readonly Situation[] = [
  {
    icon: AlertTriangle,
    title: "Potřebujete rychle peníze",
    description:
      "Finanční tíseň, splátky, neočekávané výdaje - vykoupíme byt rychle a vyplatíme vás do 7 dnů.",
  },
  {
    icon: Users,
    title: "Spoluvlastníci se nemohou dohodnout",
    description:
      "Zděděný nebo společný byt, kde se spoluvlastníci neshodnou na prodeji? Vyřešíme to za vás.",
  },
  {
    icon: Building2,
    title: "Byt potřebuje rekonstrukci",
    description:
      "Starší byt v horším stavu, do kterého nechcete investovat? Vykoupíme ho v jakémkoli stavu.",
  },
  {
    icon: Key,
    title: "Byt s nájemníkem",
    description:
      "Nechcete řešit pronájem a správu bytu? Odkoupíme byt i s existujícím nájemním vztahem.",
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
    title: "2. Právní prověření",
    description:
      "Prověříme stav bytu v katastru, právní zatížení a připravíme smlouvu.",
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

export default async function VykupBytuPage({
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
    "@id": "https://vykoupim-nemovitost.cz/vykup-bytu",
    name: "Výkup bytů - rychlý prodej bytu za hotové",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme váš byt rychle a bez provize. Osobní, družstevní i problémové byty. Férová cena 80–90 % tržní hodnoty, vyplacení do 7 dnů. Celá ČR.",
          region.locative,
        )
      : "Vykoupíme váš byt rychle a bez provize. Osobní, družstevní i problémové byty. Férová cena 80–90 % tržní hodnoty, vyplacení do 7 dnů. Celá ČR.",
    url: "https://vykoupim-nemovitost.cz/vykup-bytu",
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

      <GeoServiceJsonLd useCaseSlug="vykup-bytu" searchParams={params} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: "Výkup bytů", href: "/vykup-bytu" }]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup bytů - rychle, férově a bez provize",
                  region.locative,
                )
              : "Výkup bytů - rychle, férově a bez provize"}
          </h1>
          <LastUpdated path="/vykup-bytu" />
          <QuickAnswer>
            <p>
              Výkup bytu je rychlý prodej, při kterém specializovaná firma
              odkoupí osobní nebo družstevní byt za hotové z vlastních
              prostředků. Výkupní cena se obvykle pohybuje 80–90 % tržní hodnoty
              bytu a celý proces od první konzultace po vyplacení peněz trvá
              7–14 dnů, oproti 3–6 měsícům u klasického prodeje přes realitní
              kancelář.
            </p>
            <p>
              Vlastník bytu neplatí provizi, právní servis ani poplatky za odhad
              — všechny náklady přebírá výkupce. Vykupují se byty v jakémkoli
              technickém stavu, včetně bytů s hypotékou, exekucí, věcným
              břemenem nebo nájemníkem. Smlouvu připravuje advokát a peníze leží
              v advokátní úschově podle pravidel{" "}
              <a
                href={EXTERNAL_SOURCES.cak.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                České advokátní komory
              </a>{" "}
              až do zápisu nového vlastníka v{" "}
              <a
                href={EXTERNAL_SOURCES.cuzk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                katastru nemovitostí
              </a>
              .
            </p>
            <p>
              Výkup bytu se nejčastěji využívá při exekuci, dědictví, rozvodu,
              prodeji spoluvlastnického podílu nebo při potřebě rychlé
              likvidity. Pokrývá celou Českou republiku včetně Prahy, Brna,
              Ostravy a krajských měst. Cena nezávazné nabídky platí 14 dnů a
              zálohu až 500 000 Kč lze vyplatit hned při podpisu smlouvy,
              zbývající částku po zápisu do katastru během 3–5 pracovních dnů.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-slate-600">
            Specializujeme se na výkup všech typů bytů v celé České republice.
            Ať už vlastníte osobní byt, družstevní byt nebo byt zatížený
            hypotékou či exekucí — najdeme řešení přesně pro vaši situaci.
            Neplatíte žádnou provizi, poplatky za odhad ani právní služby.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od klasického prodeje přes realitní kancelář u nás
            nemusíte čekat měsíce na kupce, řešit prohlídky ani investovat do
            oprav. Byt vykoupíme v jakémkoli stavu — i bez rekonstrukce, s
            nájemníkem nebo s právním zatížením. Konkrétní výpočet výkupní ceny
            popisuje naše{" "}
            <Link
              href="/jak-stanovujeme-cenu"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >
              transparentní metodika
            </Link>
            .
          </p>
          <p className="mt-4 text-slate-600">
            Vykupujeme byty v Praze, Brně, Ostravě i v menších městech po celé
            ČR. Konkrétní cena se počítá z aktuálních dat{" "}
            <a
              href={EXTERNAL_SOURCES.czso.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline-offset-2 hover:underline"
            >
              Českého statistického úřadu
            </a>{" "}
            a transakčních dat z lokality. Při exekuci dluh ověřujeme v{" "}
            <a
              href={EXTERNAL_SOURCES.centralniEvidenceExekuci.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline-offset-2 hover:underline"
            >
              Centrální evidenci exekucí
            </a>
            .
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
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> 80–90 % tržní
            hodnoty
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup bytu vhodný
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
            Jak výkup bytu probíhá
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
              href="/vykup-domu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup domů →
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
            Časté dotazy k výkupu bytů
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
              Prodejte byt rychle a bez starostí
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
          <RelatedArticles articles={getRelatedArticles("vykup-bytu")} />
        </div>
      </section>
      <GeoRegionContent useCaseSlug="vykup-bytu" regionKey={krajParam} />

      <GeoRelatedPages currentSlug="vykup-bytu" currentKraj={krajParam} />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
