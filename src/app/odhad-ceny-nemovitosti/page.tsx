import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  Building,
  BadgeCheck,
  Banknote,
  FileSearch,
  Users,
  BarChart3,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqAccordion } from "@/components/faq-accordion";
import { OdhadCalculator } from "@/components/odhad-calculator";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title: "Odhad ceny nemovitosti zdarma – online kalkulačka 2026",
  description:
    "Zjistěte odhad ceny nemovitosti zdarma pomocí online kalkulačky. Zadejte typ, plochu, kraj a stav – okamžitě získáte orientační tržní i výkupní cenu. Celá ČR.",
  alternates: {
    canonical: `${SITE_URL}/odhad-ceny-nemovitosti`,
  },
  openGraph: {
    title: "Odhad ceny nemovitosti zdarma – online kalkulačka",
    description:
      "Online kalkulačka odhadu ceny nemovitosti. Byt, dům i pozemek – celá ČR. Zdarma a bez registrace.",
    url: `${SITE_URL}/odhad-ceny-nemovitosti`,
    type: "website",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jak přesný je online odhad ceny nemovitosti?",
    answer:
      "Online kalkulačka poskytuje orientační odhad na základě průměrných tržních cen v daném kraji a typu nemovitosti. Přesnost se pohybuje v rozmezí ±15 %. Pro přesnější ocenění doporučujeme osobní prohlídku odborníkem, který zohlední konkrétní lokalitu, dispozici, technický stav a další faktory ovlivňující cenu.",
  },
  {
    question: "Kolik stojí odhad ceny nemovitosti?",
    answer:
      "Náš online odhad je zcela zdarma a bez závazků. Orientační cenu zjistíte okamžitě po vyplnění kalkulačky. Profesionální znalecký posudek od soudního znalce stojí obvykle 3 000 – 8 000 Kč v závislosti na typu nemovitosti. Bankovní odhad pro účely hypotéky se pohybuje kolem 4 000 – 6 000 Kč.",
  },
  {
    question: "Jaký je rozdíl mezi tržním odhadem a výkupní cenou?",
    answer:
      "Tržní odhad (tržní hodnota) vyjadřuje cenu, za kterou by se nemovitost prodala na otevřeném trhu za standardních podmínek. Výkupní cena je částka, kterou nabízíme za okamžitý výkup – obvykle 80–90 % tržní hodnoty. Výhodou výkupu je rychlost (do 7 dnů), jistota prodeje a nulové náklady na provizi či inzerci.",
  },
  {
    question: "Co ovlivňuje cenu nemovitosti nejvíce?",
    answer:
      "Hlavní faktory jsou: lokalita (kraj, město, městská část), typ nemovitosti (byt, dům, pozemek), plocha v m², technický stav a stáří, dispozice a orientace, energetická náročnost, občanská vybavenost v okolí, dopravní dostupnost a aktuální stav trhu. Lokalita a stav mají zpravidla největší vliv – rozdíl v ceně za m² mezi Prahou a Ústeckým krajem může být i trojnásobný.",
  },
  {
    question: "Kdy potřebuji oficiální znalecký posudek?",
    answer:
      "Znalecký posudek od soudního znalce potřebujete při: dědickém řízení, rozvodovém vypořádání, darování nemovitosti (pro daňové účely), soudním sporu, exekučním řízení a někdy při žádosti o hypotéku. Pro běžný prodej nebo výkup nemovitosti stačí tržní ocenění realitním odborníkem.",
  },
  {
    question: "Jak rychle mohu nemovitost prodat přes výkup?",
    answer:
      "Celý proces výkupu trvá obvykle 7–14 dnů od prvního kontaktu po vyplacení peněz. Zahrnuje prohlídku nemovitosti, právní prověření, podpis smlouvy a zápis do katastru. Na rozdíl od klasického prodeje přes realitní kancelář, kde se počítá s 3–6 měsíci, získáte peníze téměř okamžitě.",
  },
  {
    question: "Vykupujete nemovitosti v celé České republice?",
    answer:
      "Ano, působíme ve všech 14 krajích České republiky. Ať už máte nemovitost v Praze, Brně, Ostravě nebo na venkově – ozvěte se nám a do 24 hodin obdržíte nezávaznou nabídku. Prohlídku nemovitosti zajistíme v rámci celé ČR.",
  },
];

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

interface MethodCard {
  Icon: typeof Calculator;
  title: string;
  description: string;
}

const VALUATION_METHODS: readonly MethodCard[] = [
  {
    Icon: BarChart3,
    title: "Tržní odhad (porovnávací)",
    description:
      "Nejběžnější metoda. Porovnává vaši nemovitost s podobnými, které se nedávno prodaly v okolí. Zohledňuje lokalitu, stav, plochu a dispozici.",
  },
  {
    Icon: Building,
    title: "Bankovní odhad",
    description:
      "Odhad od certifikovaného odhadce banky. Povinný při žádosti o hypotéku. Cena 4 000 – 6 000 Kč, doba zpracování 3–5 pracovních dnů.",
  },
  {
    Icon: FileSearch,
    title: "Znalecký posudek",
    description:
      "Oficiální dokument od soudního znalce. Potřebný pro dědictví, rozvod, daňové účely. Cena 3 000 – 8 000 Kč dle složitosti.",
  },
  {
    Icon: Banknote,
    title: "Výkupní cena",
    description:
      "Cena, za kterou firma okamžitě vykoupí nemovitost. Obvykle 80–90 % tržní hodnoty. Výhodou je rychlost a jistota prodeje bez provize.",
  },
  {
    Icon: Calculator,
    title: "Online kalkulačka",
    description:
      "Rychlý orientační odhad na základě statistických dat. Zdarma a okamžitě. Přesnost ±10–15 %, ideální jako první krok před odborným oceněním.",
  },
  {
    Icon: Users,
    title: "Realitní ocenění",
    description:
      "Odhad od zkušeného realitního makléře. Zohledňuje aktuální poptávku na trhu. Většinou zdarma, pokud nemovitost prodáváte přes danou kancelář.",
  },
];

export default function OdhadCenyNemovitostiPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSONLD) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[var(--theme-50)] to-white pb-12 pt-8">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumbs
            items={[
              {
                label: "Odhad ceny nemovitosti",
                href: "/odhad-ceny-nemovitosti",
              },
            ]}
          />

          <div className="mt-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Odhad ceny nemovitosti{" "}
              <span className="text-[var(--theme-600)]">zdarma</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Zjistěte orientační tržní i výkupní cenu vaší nemovitosti během 30
              sekund. Zadejte typ, plochu, kraj a stav — výsledek ihned a bez
              registrace.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-white pb-16 pt-4" id="kalkulacka">
        <div className="mx-auto max-w-7xl px-6">
          <OdhadCalculator />
        </div>
      </section>

      {/* SEO Content — Metody ocenění */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Jak se odhaduje cena nemovitosti?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-slate-600">
            Existuje několik způsobů, jak zjistit hodnotu nemovitosti. Každá
            metoda má své výhody, přesnost i vhodné použití. Níže najdete
            přehled nejběžnějších metod oceňování nemovitostí v České republice.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUATION_METHODS.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
              >
                <Icon className="h-8 w-8 text-[var(--theme-500)]" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Long-form SEO text */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-6">
          <article className="prose prose-slate prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--theme-600)] prose-a:no-underline hover:prose-a:underline max-w-none">
            <h2>Odhad ceny nemovitosti – kompletní průvodce 2026</h2>

            <p>
              Znalost skutečné hodnoty nemovitosti je klíčová při každém
              prodeji, koupi, dědictví nebo refinancování. Ať už prodáváte byt v
              Praze, rodinný dům na Moravě nebo pozemek ve Středočeském kraji,
              správný odhad ceny vám pomůže vyjednat férovou cenu a vyhnout se
              finančním ztrátám.
            </p>

            <h3>Co je tržní odhad nemovitosti?</h3>

            <p>
              Tržní odhad (neboli tržní ocenění) vyjadřuje cenu, za kterou by se
              nemovitost s největší pravděpodobností prodala na otevřeném trhu.
              Vychází z porovnávací metody — odhadce analyzuje prodeje podobných
              nemovitostí v dané lokalitě za posledních 6–12 měsíců a přizpůsobí
              cenu podle specifik vaší nemovitosti.
            </p>

            <p>
              Mezi hlavní faktory ovlivňující tržní cenu patří:{" "}
              <strong>lokalita</strong> (cenová mapa, občanská vybavenost,
              dopravní dostupnost), <strong>technický stav</strong> (stáří
              budovy, provedené rekonstrukce, energetická náročnost),{" "}
              <strong>dispozice a plocha</strong> (počet místností, užitná
              plocha, balkón, sklep, garáž), a <strong>právní stav</strong>{" "}
              (vlastnické vztahy, věcná břemena, exekuce).
            </p>

            <h3>Bankovní odhad pro hypotéku</h3>

            <p>
              Pokud žádáte o hypoteční úvěr, banka vyžaduje odhad od svého
              certifikovaného odhadce. Tento posudek slouží jako základ pro
              stanovení maximální výše úvěru (obvykle 80–90 % odhadní ceny).
              Bankovní odhad stojí 4 000 – 6 000 Kč a jeho zpracování trvá 3–5
              pracovních dnů. Důležité je vědět, že bankovní odhad bývá
              zpravidla konzervativnější než skutečná tržní cena — banka se chce
              chránit před poklesem trhu.
            </p>

            <h3>Znalecký posudek soudního znalce</h3>

            <p>
              Znalecký posudek je oficiální právně závazný dokument, který může
              vypracovat pouze soudní znalec zapsaný v seznamu znalců
              Ministerstva spravedlnosti ČR. Je vyžadován při dědickém řízení,
              rozvodovém vypořádání společného jmění manželů, darování (pro
              stanovení daňového základu), soudních sporech a exekučním řízení.
              Cena znaleckého posudku se pohybuje od 3 000 do 8 000 Kč podle
              typu a složitosti nemovitosti.
            </p>

            <h3>Výkupní cena vs. tržní cena</h3>

            <p>
              Výkupní cena je specifická forma ocenění, kdy specializovaná firma
              nabízí okamžitý odkup nemovitosti. Tato cena je nižší než tržní
              (obvykle 80–90 %), ale přináší zásadní výhody:{" "}
              <strong>rychlost</strong> (prodej do 7–14 dnů místo 3–6 měsíců),{" "}
              <strong>jistotu</strong> (není třeba čekat na kupce),{" "}
              <strong>nulové náklady</strong> (žádná provize, žádná inzerce) a{" "}
              <strong>řešení problémových nemovitostí</strong> (exekuce,
              dědictví, spoluvlastnický podíl).
            </p>

            <p>
              Výkup je ideální pro situace, kdy potřebujete peníze rychle nebo
              nemovitost nelze snadno prodat standardní cestou. Více o výhodách
              výkupu se dozvíte na stránce{" "}
              <Link href="/proc-my">proč vybrat náš výkup</Link>.
            </p>

            <h3>Online kalkulačka odhadu ceny</h3>

            <p>
              Online kalkulačky (jako ta výše na této stránce) poskytují rychlý
              orientační odhad na základě statistických dat o cenách nemovitostí
              v jednotlivých krajích. Jejich výhodou je okamžitost a dostupnost
              zdarma. Přesnost se pohybuje kolem ±10–15 % — kalkulačka
              nezohledňuje specifika jako přesnou adresu, stav interiéru, výhled
              nebo parkování.
            </p>

            <p>
              Pro co nejpřesnější výsledek doporučujeme online odhad jako první
              krok a následně kontaktovat odborníka pro osobní prohlídku. Naše
              kalkulačka pracuje s aktuálními daty z RealityMIX a Českého
              statistického úřadu (ČSÚ) za rok 2026.
            </p>

            <h3>Ceny nemovitostí v jednotlivých krajích ČR</h3>

            <p>
              Ceny nemovitostí se v České republice výrazně liší podle regionu.
              Nejdražší je tradičně Praha s průměrnou cenou bytů kolem 150 000
              Kč/m², následuje Jihomoravský kraj (Brno) s přibližně 91 000 Kč/m²
              a Středočeský kraj s 86 500 Kč/m². Naopak nejdostupnější bydlení
              nabízí Ústecký kraj (40 000 Kč/m²) a Karlovarský kraj (42 000
              Kč/m²).
            </p>

            <p>
              Kompletní přehled cen ve všech krajích najdete na naší stránce{" "}
              <Link href="/kraje">výkup nemovitostí podle krajů</Link>.
            </p>

            <h3>5 tipů pro co nejpřesnější odhad</h3>

            <ol>
              <li>
                <strong>Porovnejte více zdrojů</strong> — použijte naši
                kalkulačku, cenovou mapu ČÚZK a nabídky na realitních portálech
                (Sreality, Bezrealitky).
              </li>
              <li>
                <strong>Zohledněte stav</strong> — nemovitost po rekonstrukci má
                výrazně vyšší hodnotu než ta v původním stavu.
              </li>
              <li>
                <strong>Sledujte trend</strong> — ceny nemovitostí v ČR v roce
                2025/2026 rostou meziročně o 5–8 %, ale tempo růstu se liší
                podle regionu.
              </li>
              <li>
                <strong>Myslete na mikrolokalitu</strong> — cena za m² se může
                lišit i v rámci jednoho města o desítky procent.
              </li>
              <li>
                <strong>Nechte si udělat osobní prohlídku</strong> — žádná
                kalkulačka nenahradí oko odborníka přímo na místě.
              </li>
            </ol>

            <h3>Kdy je výkup nemovitosti lepší volba než klasický prodej?</h3>

            <p>
              Výkup nemovitosti je optimální řešení v situacích, kdy čas hraje
              klíčovou roli. Typicky se jedná o{" "}
              <Link href="/vykup-pri-exekuci">exekuční řízení</Link>, kde hrozí
              nucený prodej pod cenou,{" "}
              <Link href="/vykup-pri-dedictvi">dědictví</Link> s více dědici,
              kteří se chtějí rychle vypořádat, nebo{" "}
              <Link href="/vykup-spoluvlastnickeho-podilu">
                spoluvlastnický podíl
              </Link>
              , kde jeden z vlastníků chce svůj díl zpeněžit.
            </p>

            <p>
              Nabízíme výkup bytů, domů i pozemků ve všech 14 krajích ČR. Celý
              proces — od prvního kontaktu po vyplacení peněz — zvládneme do 7
              dnů. Podrobnosti o tom, jak výkup funguje krok za krokem, najdete
              v našem{" "}
              <Link href="/pruvodce-vykupem">průvodci výkupem nemovitostí</Link>
              .
            </p>
          </article>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-16" id="faq">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Časté dotazy k odhadu ceny nemovitosti
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Odpovědi na nejčastější otázky ohledně oceňování nemovitostí v ČR.
          </p>
          <div className="mt-10">
            <FaqAccordion items={[...FAQ_ITEMS]} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--theme-600)] py-16" id="kontakt">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-white/80" />
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            Chcete přesný odhad vaší nemovitosti?
          </h2>
          <p className="mt-3 text-lg text-white/80">
            Nezávazně nás kontaktujte. Zpracujeme vám bezplatný odhad a do 24
            hodin obdržíte konkrétní nabídku na výkup.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-[var(--theme-700)] transition hover:bg-slate-50"
            >
              <BadgeCheck className="h-5 w-5" />
              Získat nezávaznou nabídku
            </Link>
            <Link
              href="/jak-to-funguje"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Jak to funguje?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
