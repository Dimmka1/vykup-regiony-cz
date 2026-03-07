import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  RefreshCw,
  Home,
  HandCoins,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { MortgageCalculator } from "@/components/mortgage-calculator";

const PAGE_URL = "https://vykoupim-nemovitost.cz/konec-fixace-hypoteky";

export const metadata: Metadata = {
  alternates: { canonical: PAGE_URL },
  title:
    "Konec fixace hypotéky 2026 — co vás čeká a jak se připravit | vykoupim-nemovitost.cz",
  description:
    "V roce 2026 končí fixace hypotéky tisícům domácností. Splátky mohou vzrůst i o tisíce korun měsíčně. Zjistěte, jaké máte možnosti: refinancování, prodej nebo výkup nemovitosti do 48 hodin.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Co se stane, když mi skončí fixace hypotéky?",
    answer:
      "Po konci fixačního období vám banka nabídne novou úrokovou sazbu. Ta se odvíjí od aktuálních tržních podmínek a může být výrazně vyšší než vaše stávající sazba. Pokud novou nabídku nepřijmete a hypotéku nerefinancujete, banka obvykle převede úvěr na variabilní sazbu.",
  },
  {
    question: "O kolik může vzrůst moje splátka v roce 2026?",
    answer:
      "Záleží na rozdílu mezi vaší aktuální fixací a novou sazbou. Pokud jste fixovali v období 2020–2021 kolem 2 % a nová sazba bude 5 %, u hypotéky 3 miliony korun se měsíční splátka může zvýšit přibližně o 4 000–5 000 Kč. Použijte naši kalkulačku výše pro přesný výpočet.",
  },
  {
    question: "Mohu si refinancovat hypotéku u jiné banky?",
    answer:
      "Ano, refinancování u jiné banky je běžná a zcela legální možnost. Po skončení fixace nemáte žádnou sankci za předčasné splacení. Doporučujeme porovnat nabídky alespoň 3 bank nebo využít služby nezávislého hypotečního poradce.",
  },
  {
    question: "Co když nové splátky nezvládnu platit?",
    answer:
      "Nepanikařte, ale jednejte rychle. Máte několik možností: refinancování za nižší sazbu, prodloužení doby splatnosti (snížení splátky), prodej nemovitosti na trhu, nebo rychlý výkup nemovitosti. My dokážeme nemovitost vykoupit do 48 hodin, uhradit zbývající hypotéku a vyplatit vám rozdíl.",
  },
  {
    question: "Lze prodat nemovitost s nesplacenou hypotékou?",
    answer:
      "Ano, prodej nemovitosti s hypotékou je naprosto běžný. Hypotéka se uhradí z kupní ceny ještě před převodem vlastnictví. Pokud zvolíte rychlý výkup, postaráme se o komunikaci s bankou a celý proces vyřídíme za vás — diskrétně a bez komplikací.",
  },
  {
    question: "Kolik dostanu za nemovitost při rychlém výkupu?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty nemovitosti. Z kupní ceny uhradíme zbytek hypotéky přímo bance a rozdíl vyplatíme vám na účet. Neplatíte žádné provize, poplatky za odhad ani právní služby — vše hradíme my.",
  },
] as const;

interface Scenario {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  pros: readonly string[];
  cons: readonly string[];
  cta?: { label: string; href: string };
}

const SCENARIOS: readonly Scenario[] = [
  {
    icon: RefreshCw,
    title: "Scénář 1: Refinancování hypotéky",
    description:
      "Přechod k jiné bance nebo vyjednání lepší sazby u stávající banky. Vhodné, pokud máte stabilní příjem a dostatečnou bonitu.",
    pros: [
      "Zachováte si nemovitost",
      "Možnost snížit sazbu oproti nabídce stávající banky",
      "Bez sankce po konci fixace",
    ],
    cons: [
      "Nová sazba bude stále vyšší než ta stará",
      "Vyžaduje dostatečnou bonitu a příjmy",
      "Proces trvá 4–8 týdnů",
    ],
  },
  {
    icon: Home,
    title: "Scénář 2: Prodej nemovitosti na trhu",
    description:
      "Klasický prodej přes realitní kancelář. Vhodné, pokud máte dostatek času (3–6 měsíců) a nemovitost je v dobrém stavu.",
    pros: [
      "Nejvyšší možná prodejní cena",
      "Hypotéka se uhradí z kupní ceny",
      "Můžete si najít levnější bydlení",
    ],
    cons: [
      "Trvá 3–6 měsíců",
      "Provize realitky 3–5 %",
      "Nejistota — kupující může couvnout",
    ],
  },
  {
    icon: HandCoins,
    title: "Scénář 3: Rychlý výkup nemovitosti",
    description:
      "Přímý prodej výkupní firmě. Ideální, pokud potřebujete rychlé řešení a nemůžete čekat měsíce na klasický prodej.",
    pros: [
      "Peníze do 48 hodin",
      "Hypotéku uhradíme za vás",
      "Bez provize, bez prohlídek",
      "Možnost zpětného nájmu — bydlíte dál",
    ],
    cons: ["Výkupní cena 80–90 % tržní hodnoty"],
    cta: { label: "Získat nabídku na výkup", href: "/#kontakt" },
  },
] as const;

export default async function KonecFixaceHypotekyPage(): Promise<React.ReactElement> {
  const host = await getRequestHost();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Konec fixace hypotéky 2026 — co vás čeká a jak se připravit",
    description:
      "V roce 2026 končí fixace hypotéky tisícům domácností. Zjistěte, jaké máte možnosti: refinancování, prodej nebo výkup nemovitosti.",
    datePublished: "2026-03-07",
    dateModified: "2026-03-07",
    author: {
      "@type": "Organization",
      name: "vykoupim-nemovitost.cz",
      url: "https://vykoupim-nemovitost.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "vykoupim-nemovitost.cz",
      url: "https://vykoupim-nemovitost.cz",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": PAGE_URL,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domů",
        item: "https://vykoupim-nemovitost.cz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Služby",
        item: "https://vykoupim-nemovitost.cz/#sluzby",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Konec fixace hypotéky 2026",
        item: PAGE_URL,
      },
    ],
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      {/* ===== HERO ===== */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                {
                  label: "Konec fixace hypotéky 2026",
                  href: "/konec-fixace-hypoteky",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Konec fixace hypotéky 2026 — co vás čeká a jak se připravit
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            V roce 2026 končí fixační období hypotéky přibližně{" "}
            <strong>200 000 domácnostem</strong> v České republice. Mnoho z nich
            fixovalo v&nbsp;období rekordně nízkých sazeb kolem 2–3 % a nyní je
            čeká přechod na sazby okolo 5 %. To znamená nárůst měsíčních splátek
            o tisíce korun.
          </p>
          <p className="mt-4 text-slate-600">
            Pokud patříte mezi ty, kterým letos nebo příští rok končí fixace,
            nepanikařte — ale připravte se. V&nbsp;tomto článku vám vysvětlíme,
            co přesně se děje, jaké máte možnosti a jak předejít finančním
            problémům.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Nezávazná konzultace zdarma
            </Link>
            <Link
              href="#kalkulacka"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Spočítat novou splátku ↓
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Výkup do 48 hodin
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> Uhradíme
            hypotéku za vás
          </span>
          <span className="flex items-center gap-2">
            <HandCoins className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      {/* ===== PROBLEM EXPLANATION ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Co je konec fixace hypotéky a proč je rok 2026 kritický?
          </h2>
          <p className="mt-4 text-slate-600">
            Fixace hypotéky znamená období, po které máte garantovanou neměnnou
            úrokovou sazbu. Nejčastější délky fixace v&nbsp;Česku jsou 3, 5 nebo
            10 let. Po uplynutí tohoto období banka nabídne novou sazbu — a ta
            se odvíjí od aktuálních tržních podmínek.
          </p>
          <p className="mt-4 text-slate-600">
            Rok 2026 je z&nbsp;hlediska hypoték výjimečný. V&nbsp;období{" "}
            <strong>2020–2021</strong> byly úrokové sazby na historickém minimu
            — mnoho lidí fixovalo na 5 let za <strong>sazby 1,8–2,5 %</strong>.
            Těmto domácnostem nyní hromadně končí fixace a čeká je realita
            aktuálních sazeb kolem <strong>4,5–5,5 %</strong>.
          </p>
          <p className="mt-4 text-slate-600">
            Podle dat České národní banky se to v&nbsp;roce 2026 týká přibližně{" "}
            <strong>200 000 hypoték</strong>. Pro průměrnou hypotéku 3 milionů
            korun to znamená nárůst měsíční splátky o{" "}
            <strong>3 000 až 6 000 Kč</strong>. Pro rodiny s&nbsp;napjatým
            rozpočtem to může být zásadní problém.
          </p>

          <h3 className="mt-8 text-xl font-semibold text-slate-900">
            Proč sazby tak vzrostly?
          </h3>
          <p className="mt-4 text-slate-600">
            Úrokové sazby hypoték sledují vývoj základních sazeb centrální
            banky. Česká národní banka v&nbsp;letech 2022–2023 dramaticky
            zvýšila repo sazbu na 7 % v&nbsp;reakci na inflaci. Přestože sazby
            od té doby klesly, stále se drží výrazně nad úrovní z&nbsp;let
            2020–2021.
          </p>
          <p className="mt-4 text-slate-600">
            Dalším faktorem je mezibankovní sazba PRIBOR, ze které banky
            odvozují své hypoteční sazby. Ta se stabilizovala na úrovni kolem 4
            %, což se promítá do nabídek nových fixací.
          </p>
          <p className="mt-4 text-slate-600">
            Výsledek? Kdo fixoval pod 3 %, teď dostane nabídku nad 5 %. U
            hypotéky na 25 let se zbytkem jistiny 2,5 milionu to znamená nárůst
            splátky z&nbsp;přibližně 11 200 Kč na 14 600 Kč —{" "}
            <strong>rozdíl 3 400 Kč měsíčně</strong>, tedy přes{" "}
            <strong>40 000 Kč ročně</strong> navíc.
          </p>

          <h3 className="mt-8 text-xl font-semibold text-slate-900">
            Koho se to týká nejvíce?
          </h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-slate-600">
                <strong>Rodiny s&nbsp;jedním příjmem</strong> — nárůst splátky o
                4–5 tisíc měsíčně může být neúnosný.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-slate-600">
                <strong>Senioři a předdůchodci</strong> — klesající příjmy
                v&nbsp;kombinaci s&nbsp;rostoucími splátkami.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-slate-600">
                <strong>Majitelé investičních nemovitostí</strong> — pokud nájem
                nepokryje novou splátku, investice přestává dávat smysl.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <p className="text-slate-600">
                <strong>Lidé s&nbsp;dalšími úvěry</strong> — spotřebitelské
                půjčky + vyšší hypotéka = riziko předlužení.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CALCULATOR ===== */}
      <section className="bg-slate-50 py-16" id="kalkulacka">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Spočítejte si, o kolik vzroste vaše splátka
          </h2>
          <MortgageCalculator />
        </div>
      </section>

      {/* ===== 3 SCENARIOS ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            3 scénáře: co dělat po konci fixace
          </h2>
          <p className="mt-4 text-slate-600">
            Každá situace je jiná. Níže najdete tři nejčastější cesty, jak se
            s&nbsp;koncem fixace vypořádat — od refinancování přes klasický
            prodej až po rychlý výkup nemovitosti.
          </p>

          <div className="mt-8 space-y-6">
            {SCENARIOS.map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <scenario.icon className="h-5 w-5 text-emerald-600" />
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    {scenario.title}
                  </h3>
                </div>
                <p className="mt-3 text-slate-600">{scenario.description}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      ✓ Výhody
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {scenario.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2">
                          <span className="mt-1 text-emerald-500">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-600">
                      ✗ Nevýhody
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600">
                      {scenario.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2">
                          <span className="mt-1 text-red-400">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {scenario.cta && (
                  <div className="mt-4">
                    <Link
                      href={scenario.cta.href}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
                    >
                      {scenario.cta.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DETAILED GUIDE ===== */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak se připravit na konec fixace — krok za krokem
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                1. Zjistěte datum konce fixace
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Podívejte se do smlouvy o hypotéce nebo do internetového
                bankovnictví. Většina bank vás upozorní 3 měsíce předem, ale
                začněte se připravovat alespoň 6 měsíců dopředu.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                2. Porovnejte nabídky bank
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Nemusíte přijmout nabídku stávající banky. Oslovte alespoň 3
                jiné banky nebo využijte nezávislého hypotečního poradce.
                Refinancování po konci fixace je bez sankce.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                3. Spočítejte si nový rozpočet
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Použijte kalkulačku výše a zjistěte, kolik budete platit po
                refixaci. Pokud nová splátka přesáhne 40 % vašeho čistého
                příjmu, je čas zvážit alternativy.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                4. Zvažte všechny možnosti
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Prodloužení doby splatnosti může snížit splátku. Částečné
                mimořádné splacení sníží jistinu. A pokud si uvědomíte, že
                nemovitost finančně nezvládáte, je lepší jednat proaktivně než
                čekat na problémy.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">5. Jednejte včas</h3>
              <p className="mt-2 text-sm text-slate-600">
                Nejhorší, co můžete udělat, je nic. Pokud nové splátky nebudete
                schopni platit a začnou se hromadit dluhy, situace se rychle
                zhorší — až k{" "}
                <Link
                  href="/vykup-pri-exekuci"
                  className="font-medium text-emerald-600 underline hover:text-emerald-500"
                >
                  exekuci na nemovitost
                </Link>
                . Jednejte dříve, než k&nbsp;tomu dojde.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INTERNAL LINKS ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Nemovitost nezvládáte? Máme řešení
          </h2>
          <p className="mt-4 text-slate-600">
            Pokud vám konec fixace zkomplikoval finanční situaci, nejste sami.
            Pomáháme lidem v&nbsp;podobné situaci každý den. Podívejte se na
            naše další služby:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/vykup-pri-exekuci"
              className="group rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                Výkup při exekuci
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Už máte exekuci? Vykoupíme nemovitost, uhradíme dluhy a
                vyplatíme vás.
              </p>
            </Link>
            <Link
              href="/zpetny-najem"
              className="group rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                Zpětný nájem
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Prodejte nemovitost a zůstaňte bydlet. Ideální řešení, když
                potřebujete peníze, ale nechcete se stěhovat.
              </p>
            </Link>
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="group rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                Výkup s hypotékou
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Máte nesplacenou hypotéku? Uhradíme ji z kupní ceny a zbytek
                vyplatíme vám.
              </p>
            </Link>
            <Link
              href="/pruvodce-vykupem"
              className="group rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
                Průvodce výkupem
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Kompletní průvodce procesem výkupu nemovitosti od A do Z.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy ke konci fixace hypotéky
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

      {/* ===== CTA ===== */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Končí vám fixace? Poradíme zdarma
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace o vašich možnostech. Zjistěte, zda je výkup
              nemovitosti to pravé řešení pro vaši situaci.
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

      {/* ===== RELATED ARTICLES ===== */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles
            articles={getRelatedArticles("konec-fixace-hypoteky")}
          />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
