import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, BadgeCheck, HandCoins } from "lucide-react";
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
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-pri-exekuci", params);
  const region = resolveGeoRegion(params);

  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup nemovitosti v exekuci — vyplaceno do 7 dnů, dluhy uhradíme",
          region.locative,
        )
      : "Výkup nemovitosti v exekuci — vyplaceno do 7 dnů, dluhy uhradíme",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme byt či dům zatížený exekucí — diskrétně, bez provize. Splatíme exekuci z kupní ceny, peníze na účtu do 48 h. 200+ vyřešených případů.",
          region.locative,
        )
      : "Vykoupíme byt či dům zatížený exekucí — diskrétně, bez provize. Splatíme exekuci z kupní ceny, peníze na účtu do 48 h. 200+ vyřešených případů.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Lze prodat nemovitost zatíženou exekucí?",
    answer:
      "Ano. Nemovitost v exekuci lze prodat za souhlasu exekutora — exekuční pohledávky se uhradí přímo z kupní ceny, kupující obdrží nemovitost bez zatížení a původní vlastník zůstatek po odečtu dluhů. Komunikaci s exekutorským úřadem vedeme za vás.",
  },
  {
    // Verbatim match for top GSC query "výkup bytu v exekuci" (235 imp/0 clicks)
    question: "Jak probíhá výkup bytu v exekuci?",
    answer:
      "Výkup bytu v exekuci probíhá ve 4 krocích: (1) ověříme stav exekuce v Centrální evidenci exekucí, (2) získáme souhlas exekutora s prodejem, (3) advokát připraví kupní smlouvu s úhradou exekuční pohledávky z kupní ceny, (4) zápis nového vlastníka v katastru. Lhůta 5–14 dnů. Vlastník dostává čistou částku po odečtu dluhu.",
  },
  {
    // Verbatim match for "výkup domu v exekuci" (45 imp/0 clicks)
    question: "Jak probíhá výkup domu v exekuci?",
    answer:
      "Postup výkupu rodinného domu v exekuci je shodný s bytem — ověření v Centrální evidenci exekucí, dohoda s exekutorem, kupní smlouva v advokátní úschově, vklad do katastru. U domu se navíc oceňuje pozemek (zahrada, dvůr) samostatně. U exekučně vázaných hospodářských staveb (stodola, garáž) ověřujeme, zda jsou předmětem exekuce.",
  },
  {
    question: "Kolik za nemovitost v exekuci dostanu?",
    answer:
      "Výkupní cena je 80–90 % tržní hodnoty. Z této částky se prvně uhradí exekuční pohledávky podle Centrální evidence exekucí, zbytek dostáváte přímo na účet. Žádné skryté slevy se neuplatňují — všechny vstupy do výpočtu vám ukážeme.",
  },
  {
    question: "Jak rychle dokážete výkup zrealizovat?",
    answer:
      "U urgentních případů 5–7 dnů, standardně 14 dnů. Lhůta zahrnuje ověření exekuce, dohodu s exekutorem, podpis kupní smlouvy v advokátní úschově, podání návrhu na vklad a zápis do katastru nemovitostí.",
  },
  {
    question: "Co když mám více současných exekucí?",
    answer:
      "Postup je stejný i u více exekucí — všechny pohledávky se v koordinaci s exekutory uhradí z kupní ceny v zákonném pořadí (první v pořadí přednostní, pak dle data nařízení). Náš právní zástupce zajišťuje souhlas všech zúčastněných exekutorů.",
  },
  {
    question: "Co když je proti mně vedeno insolvenční řízení?",
    answer:
      "U insolvence je situace komplexnější — prodej nemovitosti vyžaduje souhlas insolvenčního správce. Stav ověříme v Insolvenčním rejstříku a v koordinaci se správcem připravíme prodej tak, aby splňoval všechny podmínky insolvenčního řízení.",
  },
  {
    question: "Hrozí mi nucená dražba — co dělat?",
    answer:
      "Kontaktujte nás co nejdříve. Po nařízení dražby zbývá obvykle 30–60 dnů — během této doby lze nemovitost legálně vykoupit a zastavit dražbu. Po proběhlé dražbě obvykle vlastník dostane zlomek tržní ceny, výkup před dražbou tedy zachrání podstatnou část hodnoty.",
  },
  {
    question: "Jak je zajištěna bezpečnost transakce?",
    answer:
      "Kupní smlouvu připravuje advokát, peníze leží v advokátní úschově podle pravidel České advokátní komory. Z úschovy se uvolní až po zápisu nového vlastníka do katastru. Vy nepředáváte nikomu peníze ani klíče dříve — postup je naopak.",
  },
  {
    question: "Vykupujete i nemovitost v exekuci s hypotékou?",
    answer:
      "Ano. Hypotéku uhradíme přímo bance, exekuční pohledávky exekutorovi, vy obdržíte rozdíl. Přesný výpočet je vždy v cenové nabídce — vidíte jednotlivé položky (zůstatek hypotéky, dluhy v exekuci, případné penále) i čistou částku k vyplacení.",
  },
  {
    question: "Bude o prodeji vědět okolí?",
    answer:
      "Ne. Žádná veřejná inzerce, žádné prohlídky cizích zájemců — celý proces probíhá výhradně mezi vámi, naším právním zástupcem a exekutorem. Diskrétnost je u exekučních případů jednou z hlavních priorit.",
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
      "Vyplňte formulář a do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Shield,
    title: "2. Právní prověření",
    description:
      "Naši právníci prověří stav exekuce a připraví optimální řešení.",
  },
  {
    icon: BadgeCheck,
    title: "3. Dohoda s exekutorem",
    description: "Zajistíme souhlas exekutora a připravíme kupní smlouvu.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Uhradíme dluhy z kupní ceny a zbytek vyplatíme přímo vám.",
  },
] as const;

export default async function VykupPriExekuciPage({
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
      "@id": buildQuestionId("/vykup-pri-exekuci", item.question),
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://vykoupim-nemovitost.cz/vykup-pri-exekuci#howto",
    name: "Jak prodat nemovitost v exekuci za 5–14 dnů",
    description:
      "Postup výkupu nemovitosti zatížené exekucí — od ověření v Centrální evidenci exekucí přes dohodu s exekutorem po zápis nového vlastníka v katastru.",
    totalTime: "P14D",
    estimatedCost: { "@type": "MonetaryAmount", currency: "CZK", value: "0" },
    tool: ["Centrální evidence exekucí", "List vlastnictví", "Telefon"],
    supply: ["Doklad totožnosti", "Usnesení o nařízení exekuce"],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Ověření exekuce",
        text: "Stav a výši pohledávek ověřujeme v Centrální evidenci exekucí (Exekutorská komora ČR). Zjistíme přesnou částku k úhradě, počet exekucí a pořadí věřitelů.",
        url: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Cenová nabídka a dohoda s exekutorem",
        text: "Sestavíme cenovou nabídku 80–90 % tržní hodnoty. Náš právní zástupce získá souhlas exekutora s prodejem za podmínky úhrady pohledávky z kupní ceny.",
        url: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Kupní smlouva v advokátní úschově",
        text: "Advokát připraví kupní smlouvu, peníze leží v advokátní úschově dle pravidel České advokátní komory. Z úschovy se nejprve uhradí pohledávky exekutorovi, zbytek dostane prodávající.",
        url: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Zastavení exekuce a zápis do katastru",
        text: "Po úhradě celé vymáhané pohledávky vznikne důvod pro zastavení exekuce dle § 268 občanského soudního řádu. Návrh na vklad do katastru nemovitostí podává advokát; lhůta zápisu 20–30 dnů.",
        url: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Vyplacení čisté částky",
        text: "Po zápisu nového vlastníka v katastru se uvolní zbylá část kupní ceny — prodávající dostane čistou částku po odečtu dluhů. Zálohu až 500 000 Kč lze vyplatit hned při podpisu smlouvy.",
        url: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
      },
    ],
    inLanguage: "cs-CZ",
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
    name: "Výkup nemovitosti v exekuci",
    url: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    speakable: buildSpeakableSpec([
      "h1",
      '[data-speakable="quick-answer"]',
      '[data-speakable="howto-summary"]',
    ]),
    about: { "@id": "https://vykoupim-nemovitost.cz/vykup-pri-exekuci#howto" },
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />

      <GeoServiceJsonLd useCaseSlug="vykup-pri-exekuci" searchParams={params} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Výkup při exekuci", href: "/vykup-pri-exekuci" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup nemovitosti při exekuci",
                  region.locative,
                )
              : "Výkup nemovitosti při exekuci"}
          </h1>
          <LastUpdated path="/vykup-pri-exekuci" />
          <QuickAnswer>
            <p>
              Nemovitost zatíženou exekucí lze legálně prodat — výkupní firma
              uhradí exekuční pohledávky přímo z kupní ceny exekutorovi a
              původní vlastník dostane čistou částku po odečtu dluhů. Výkupní
              cena se pohybuje 80–90 % tržní hodnoty oproti zlomku, který by
              dosáhla nemovitost v nucené dražbě.
            </p>
            <p>
              Postup vyžaduje souhlas exekutora a probíhá v souladu s exekučním
              řádem pod kontrolou{" "}
              <a
                href={EXTERNAL_SOURCES.exekutorskakomora.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Exekutorské komory ČR
              </a>
              . Stav exekuce ověřujeme v{" "}
              <a
                href={EXTERNAL_SOURCES.centralniEvidenceExekuci.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Centrální evidenci exekucí
              </a>{" "}
              a v případě více exekucí koordinujeme úhradu pohledávek v zákonném
              pořadí. Smlouva je v advokátní úschově do zápisu vlastnictví v
              katastru.
            </p>
            <p>
              Celý proces zvládneme za 5–14 dnů — dostatečně rychle i u hrozící
              nucené dražby. Po nařízení dražby zbývá obvykle 30–60 dnů, během
              kterých lze uhrazením vymáhané pohledávky vyvolat zastavení
              exekuce dle § 268 občanského soudního řádu a tím zastavení
              dražebního řízení. Diskrétnost je zaručena: žádná veřejná inzerce,
              žádné prohlídky cizích zájemců, jen prodávající, advokát a
              exekutor.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-slate-600">
            Mnoho majitelů neví, že nemovitost zatíženou exekucí lze legálně
            prodat. Klíčem je spolupráce s exekutorským úřadem podle{" "}
            <a
              href={EXTERNAL_SOURCES.zakonyprolidi.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline-offset-2 hover:underline"
            >
              exekučního řádu
            </a>{" "}
            a správné právní zajištění celého procesu — to za vás vyřešíme.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od dražby, kde nemovitost obvykle odejde za 2/3 znaleckého
            odhadu nebo méně, výkupní cena se pohybuje 80–90 % tržní hodnoty.
            Exekuční pohledávky se uhradí přímo z kupní ceny — zbavíte se dluhů
            a nemovitost je vyřízena jedním krokem.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces probíhá diskrétně — vaši sousedé ani okolí se o prodeji
            nedozví. Veškeré náklady na právní služby, odhad a převod hradíme
            my. Postup výpočtu výkupní ceny popisuje naše{" "}
            <Link
              href="/jak-stanovujeme-cenu"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >
              transparentní metodika
            </Link>
            .
          </p>
          <p className="mt-4 text-slate-600">
            Pokud vám hrozí nucená dražba, neváhejte nás kontaktovat co
            nejdříve. Čím dříve začneme, tím lepší podmínky pro vás dokážeme
            vyjednat. Detail postupu najdete také v naší{" "}
            <Link
              href="/blog/vykup-v-exekuci"
              className="font-medium text-emerald-700 hover:text-emerald-800"
            >
              příručce o výkupu v exekuci
            </Link>
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
            Časté dotazy k výkupu při exekuci
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
              Zbavte se exekuce ještě dnes
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
          <RelatedArticles articles={getRelatedArticles("vykup-pri-exekuci")} />
        </div>
      </section>

      <LeadMagnetCta />
      <GeoRegionContent useCaseSlug="vykup-pri-exekuci" regionKey={krajParam} />

      <GeoRelatedPages
        currentSlug="vykup-pri-exekuci"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
