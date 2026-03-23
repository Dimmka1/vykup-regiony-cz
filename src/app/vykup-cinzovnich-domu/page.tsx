import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Building2,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title:
    "Výkup činžovních domů – rychlý prodej bytového domu bez provize | Vykoupím Nemovitost",
  description:
    "Vykoupíme váš činžovní dům rychle a za férovou cenu. Bez provize, bez starostí s nájemníky. Nabídka do 24 hodin, peníze do 7 dnů.",
  alternates: {
    canonical: `${SITE_URL}/vykup-cinzovnich-domu`,
  },
  openGraph: {
    url: `${SITE_URL}/vykup-cinzovnich-domu`,
    title: "Výkup činžovních domů – rychlý prodej bez provize",
    description:
      "Prodejte činžovní dům rychle a za férovou cenu. Řešíme nájemníky, právní záležitosti i technický stav.",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jak rychle dokážete vykoupit činžovní dům?",
    answer:
      "Celý proces od prvního kontaktu po vyplacení peněz trvá obvykle 2–4 týdny. V urgentních případech jsme schopni vše vyřídit i do 7 dnů. Rychlost závisí na složitosti právního stavu a počtu nájemních smluv.",
  },
  {
    question: "Musím nejdříve vystěhovat nájemníky?",
    answer:
      "Ne, nájemníky vystěhovávat nemusíte. Činžovní dům kupujeme i s existujícími nájemními smlouvami. Převzetí nájemníků řešíme v rámci kupní smlouvy a veškerou komunikaci s nimi zajistíme my po převodu vlastnictví.",
  },
  {
    question: "Jakou cenu za činžovní dům nabízíte?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty nemovitosti. Cena se stanovuje na základě lokality, technického stavu budovy, obsazenosti nájemníky, výše nájmů a aktuálních tržních podmínek. Ocenění provádíme zdarma a nezávazně.",
  },
  {
    question:
      "Co když má činžovní dům technické problémy nebo potřebuje rekonstrukci?",
    answer:
      "Vykupujeme i činžovní domy ve špatném technickém stavu, které potřebují rekonstrukci. Stav budovy samozřejmě zohledníme v ceně, ale není důvodem k odmítnutí. Právě komplexní případy jsou naší specializací.",
  },
  {
    question: "Jak probíhá ocenění činžovního domu?",
    answer:
      "Ocenění probíhá ve třech fázích: 1) Předběžná analýza na základě údajů od vás a veřejných registrů, 2) Osobní prohlídka nemovitosti naším odhadcem, 3) Finální nabídka do 48 hodin od prohlídky. Celý proces ocenění je zcela zdarma.",
  },
  {
    question: "Platím nějaké poplatky nebo provizi?",
    answer:
      "Ne, neplatíte žádné poplatky ani provize. Veškeré náklady spojené s transakcí — právní servis, odhad, znalecký posudek, poplatky za katastr — hradíme my. Cena, kterou vám nabídneme, je čistá částka, kterou obdržíte na účet.",
  },
  {
    question: "Lze prodat činžovní dům, který je v podílovém spoluvlastnictví?",
    answer:
      "Ano, řešíme i prodej činžovních domů v podílovém spoluvlastnictví. Můžeme vykoupit jednotlivé spoluvlastnické podíly nebo koordinovat prodej celého domu se všemi spoluvlastníky. Právní stránku celého procesu zajistíme za vás.",
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
    title: "1. Nezávazná poptávka",
    description:
      "Vyplňte krátký formulář nebo nám zavolejte. Předběžnou nabídku obdržíte do 24 hodin.",
  },
  {
    icon: Building2,
    title: "2. Prohlídka a ocenění",
    description:
      "Náš odborník provede prohlídku činžovního domu a připraví detailní ocenění zdarma.",
  },
  {
    icon: HandCoins,
    title: "3. Závazná nabídka",
    description:
      "Na základě prohlídky obdržíte závaznou nabídku s garantovanou cenou.",
  },
  {
    icon: BadgeCheck,
    title: "4. Podpis smlouvy a výplata",
    description:
      "Naši právníci připraví smlouvu, podepíšete a peníze máte na účtu do 48 hodin.",
  },
] as const;

interface Advantage {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ADVANTAGES: readonly Advantage[] = [
  {
    icon: Clock,
    title: "Rychlost transakce",
    description:
      "Zatímco klasický prodej činžovního domu přes realitní kancelář trvá 6–18 měsíců, my celý proces zvládneme do 4 týdnů. U urgentních případů i rychleji.",
  },
  {
    icon: Users,
    title: "Řešíme nájemníky za vás",
    description:
      "Nemusíte řešit výpovědi, stěhování ani komunikaci s nájemníky. Dům kupujeme včetně existujících nájemních smluv a vše zajistíme po převodu.",
  },
  {
    icon: Shield,
    title: "Kompletní právní servis",
    description:
      "Veškerý právní servis hradíme my — prověření vlastnictví, příprava smluv, komunikace s katastrem. Vy neřešíte žádnou administrativu.",
  },
  {
    icon: TrendingUp,
    title: "Férová tržní cena",
    description:
      "Nabízíme 80–90 % tržní hodnoty. Na rozdíl od dražby, kde se cena může propadnout výrazně pod tržní hodnotu, u nás máte cenu garantovanou ve smlouvě.",
  },
] as const;

export default function VykupCinzovnichDomuPage(): React.ReactElement {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Výkup činžovních domů – kompletní průvodce rychlým prodejem",
    description:
      "Vše o rychlém výkupu činžovních domů. Jak prodat bytový dům bez provize, jak probíhá ocenění a co řešit s nájemníky.",
    author: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/vykup-cinzovnich-domu`,
    datePublished: "2025-03-14",
    dateModified: "2025-03-14",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domů",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Služby",
        item: `${SITE_URL}/#sluzby`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Výkup činžovních domů",
        item: `${SITE_URL}/vykup-cinzovnich-domu`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      {/* Hero section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                {
                  label: "Výkup činžovních domů",
                  href: "/vykup-cinzovnich-domu",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup činžovních domů — rychlý prodej bytového domu bez starostí
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Vlastníte činžovní dům a zvažujete prodej? Ať už jde o zděděný
            bytový dům, nemovitost vyžadující nákladnou rekonstrukci nebo
            jednoduše chcete zpeněžit svůj majetek, jsme tu pro vás. Vykoupíme
            váš činžovní dům rychle, diskrétně a za férovou cenu — bez provize a
            bez zbytečné administrativy.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <Link
              href="/jak-to-funguje"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Jak to funguje
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
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

      {/* Co je činžovní dům */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Co je činžovní dům a proč zvážit jeho prodej?
          </h2>
          <p className="mt-4 text-slate-600">
            Činžovní dům (také nazývaný činžák nebo bytový dům) je budova s více
            bytovými jednotkami, které jsou zpravidla pronajímány nájemníkům.
            Tyto nemovitosti se nacházejí nejčastěji v centrech měst a
            historických čtvrtích. Vlastnictví činžovního domu s sebou přináší
            jak výhody v podobě pravidelného příjmu z nájmů, tak celou řadu
            povinností a nákladů.
          </p>
          <p className="mt-4 text-slate-600">
            Správa činžovního domu je náročná — od komunikace s nájemníky přes
            údržbu společných prostor až po plnění zákonných povinností
            (energetický průkaz, revize, požární bezpečnost). Mnoho vlastníků
            zjistí, že náklady na údržbu a rekonstrukci postupně převyšují
            příjmy z nájmů, zejména u starších budov s regulovaným nájemným.
          </p>
          <p className="mt-4 text-slate-600">
            Prodej činžovního domu klasickou cestou přes realitní kancelář může
            trvat měsíce až roky. Kupců na bytové domy je méně než na jednotlivé
            byty a vyjednávání bývá komplikované. Právě proto nabízíme
            alternativu — rychlý výkup za hotové, kdy celý proces zvládneme za
            2–4 týdny.
          </p>

          <h3 className="mt-8 text-xl font-semibold text-slate-900">
            Nejčastější důvody pro prodej činžovního domu
          </h3>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-500">•</span>
              <span>
                <strong>Zděděný činžovní dům</strong> — Po dědictví často
                nastává situace, kdy více dědiců vlastní podíly na budově a
                nedokáží se dohodnout na jejím využití. Rychlý výkup vyřeší
                situaci ke spokojenosti všech stran.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-500">•</span>
              <span>
                <strong>Nákladná rekonstrukce</strong> — Starší činžovní domy
                vyžadují pravidelné investice do oprav. Zateplení fasády, výměna
                rozvodů, oprava střechy — to vše může stát miliony korun.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-500">•</span>
              <span>
                <strong>Problémoví nájemníci</strong> — Neplatící nájemníci,
                spory o výši nájmu, poškozování bytů — tyto situace dokáží
                vlastníkům znepříjemnit život na roky.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-500">•</span>
              <span>
                <strong>Potřeba rychlé hotovosti</strong> — Ať už jde o
                investici do nového projektu, splácení úvěru nebo řešení životní
                situace, rychlý výkup vám zajistí peníze na účtu v řádu dnů.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 text-emerald-500">•</span>
              <span>
                <strong>Spoluvlastnictví</strong> — Činžovní dům ve
                spoluvlastnictví více osob přináší komplikace při rozhodování o
                správě i prodeji. Výkup podílu může být nejjednodušším řešením.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Výhody rychlého výkupu */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Výhody rychlého výkupu činžovního domu
          </h2>
          <p className="mt-4 text-slate-600">
            Proč se čím dál více vlastníků rozhoduje pro přímý výkup namísto
            klasického prodeje přes realitku? Hlavní výhody jsou zřejmé:
            rychlost, jednoduchost a jistota.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {ADVANTAGES.map((advantage) => (
              <div
                key={advantage.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <advantage.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {advantage.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-slate-600">
            Na rozdíl od prodeje přes realitní kancelář nemusíte řešit inzerci,
            prohlídky s desítkami zájemců, vyjednávání o ceně ani nejistotu, zda
            kupující nakonec získá hypotéku. U nás je celý proces jasný, rychlý
            a předvídatelný. Více o našich garancích najdete na stránce{" "}
            <Link
              href="/garance-vykupu"
              className="font-medium text-emerald-600 underline hover:text-emerald-500"
            >
              Garance výkupu
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Jak to funguje — kroky */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak probíhá výkup činžovního domu krok za krokem
          </h2>
          <p className="mt-4 text-slate-600">
            Celý proces je navržen tak, aby byl pro vás co nejjednodušší.
            Veškerou administrativu, právní záležitosti i komunikaci s nájemníky
            řešíme za vás. Podrobný popis jednotlivých kroků najdete na stránce{" "}
            <Link
              href="/jak-to-funguje"
              className="font-medium text-emerald-600 underline hover:text-emerald-500"
            >
              Jak to funguje
            </Link>
            .
          </p>
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

      {/* Pro koho je výkup vhodný */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup činžovního domu vhodný?
          </h2>
          <p className="mt-4 text-slate-600">
            Rychlý výkup činžovního domu je ideální řešení pro vlastníky, kteří
            se ocitli v jedné z následujících situací. Ať už jde o životní
            změnu, finanční potřebu nebo jednoduše chuť zbavit se starostí se
            správou nemovitosti — vždy najdeme řešení šité na míru.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Vlastníci s více nemovitostmi
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Pokud vlastníte více nemovitostí a chcete portfolio konsolidovat
                nebo uvolnit kapitál pro výnosnější investice, rychlý výkup je
                nejefektivnější cestou.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Dědicové činžovního domu
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Zděděný činžovní dům často znamená nečekané starosti — zvláště
                pokud dědí více osob. Výkup zajistí spravedlivé rozdělení
                finančních prostředků mezi dědice.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Vlastníci v zahraničí
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Správa činžovního domu na dálku je prakticky nemožná bez
                důvěryhodného správce. Prodej za hotové vás zbaví starostí a
                umožní investovat tam, kde aktuálně žijete.
              </p>
            </div>
          </div>
          <p className="mt-6 text-slate-600">
            Stovky klientů úspěšně prodali svou nemovitost prostřednictvím
            našeho výkupu.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu činžovních domů
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md"
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

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Prodejte činžovní dům rychle a bez starostí
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace a ocenění zdarma. Do 24 hodin vám sdělíme
              předběžnou nabídku.
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

      {/* Related articles */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles
            articles={getRelatedArticles("vykup-cinzovnich-domu")}
          />
        </div>
      </section>

      <LeadMagnetCta />
    </>
  );
}
