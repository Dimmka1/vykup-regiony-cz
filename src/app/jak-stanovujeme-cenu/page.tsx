import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";

const PAGE_PATH = "/jak-stanovujeme-cenu";
const PAGE_URL = `https://vykoupim-nemovitost.cz${PAGE_PATH}`;
const PAGE_NAME = "Jak stanovujeme výkupní cenu — transparentní metodika";

export const metadata: Metadata = {
  title:
    "Jak stanovujeme výkupní cenu — metodika výpočtu | Vykoupím Nemovitost",
  description:
    "Transparentní metodika výpočtu výkupní ceny nemovitosti. 80–90 % tržní hodnoty, vstupy, kalkulace a co cenu posouvá nahoru či dolů.",
  alternates: withHreflang({ canonical: PAGE_URL }),
  openGraph: {
    title: "Jak stanovujeme výkupní cenu — metodika",
    description:
      "Transparentní výpočet výkupní ceny nemovitosti — vstupy, kalkulace, příklad.",
    url: PAGE_URL,
    type: "website",
  },
};

const HOW_TO_STEPS = [
  {
    name: "Sběr základních údajů",
    text: "Zjišťujeme adresu, typ nemovitosti, výměru z katastru, stav, právní zatížení (exekuce, věcná břemena, hypotéka) a přibližnou urgenci prodeje. Stačí 2 minuty po telefonu nebo z formuláře.",
  },
  {
    name: "Tržní cena z dat",
    text: "Stanovíme střední tržní cenu z aktuálních inzerátů ve stejné lokalitě, transakčních dat ČSÚ a krajských cenových indexů. Cena se opírá o m² výměry podle katastru, ne podle starých plánů.",
  },
  {
    name: "Korekce na stav",
    text: "Aplikujeme srážku za technický stav, věk, energetickou náročnost (PENB) a potřebu rekonstrukce. Konkrétní procenta odpovídají stáří poslední rekonstrukce a stavebnímu stavu — vždy je v nabídce vidět.",
  },
  {
    name: "Korekce na právní zatížení",
    text: "Exekuce, hypotéka, věcné břemeno nebo nájemník zvyšují právní složitost a snižují výkupní cenu o stanovenou částku. U čisté nemovitosti je sleva minimální, u nemovitosti se třemi exekucemi a věcným břemenem maximální.",
  },
  {
    name: "Finální výkupní cena",
    text: "Výsledná výkupní cena vychází jako 80–90 % korigované tržní hodnoty. Horní pásmo (90 %) odpovídá čisté nemovitosti v atraktivní lokalitě. Dolní pásmo (80 %) odpovídá komplexnímu právnímu stavu nebo nutnosti urgentního výkupu.",
  },
] as const;

const FACTORS_UP = [
  "Atraktivní lokalita s vysokou poptávkou (Praha, krajská města)",
  "Bez právního zatížení (žádná exekuce, hypotéka, věcné břemeno)",
  "Aktuální technický stav (po rekonstrukci, energetický štítek A–C)",
  "Standardní typ a výměra (byt 2+kk, 3+1, rodinný dům 4+1)",
  "Žádný spěch — můžeme pracovat v běžné lhůtě 14 dnů",
] as const;

const FACTORS_DOWN = [
  "Lokalita s nízkou poptávkou (vesnice s úbytkem obyvatel)",
  "Více současných exekucí nebo insolvence",
  "Věcné břemeno doživotního užívání pro třetí osobu",
  "Nutnost rozsáhlé rekonstrukce nebo demolice",
  "Hrozící dražba — výkup do 7 dnů místo standardních 14",
];

const EXAMPLE = {
  type: "Byt 3+1, 78 m²",
  location: "Praha 4 (Krč)",
  marketPrice: "9 750 000 Kč",
  conditionAdjustment: "-3 % (před rekonstrukcí, PENB E)",
  legalAdjustment: "-1 % (čistý LV)",
  finalRange: "8 100 000 – 8 500 000 Kč (83–87 % tržní hodnoty)",
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${PAGE_URL}#howto`,
  name: PAGE_NAME,
  description:
    "Pětistupňová metodika výpočtu výkupní ceny nemovitosti používaná při výkupu Vykoupím Nemovitost.",
  totalTime: "PT2H",
  estimatedCost: { "@type": "MonetaryAmount", currency: "CZK", value: "0" },
  tool: ["Katastrální výpis", "Cenová mapa ČSÚ", "Inzeráty v lokalitě"],
  step: HOW_TO_STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
  inLanguage: "cs-CZ",
  publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": PAGE_URL,
  url: PAGE_URL,
  name: PAGE_NAME,
  inLanguage: "cs-CZ",
  isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
  speakable: buildSpeakableSpec(),
  about: { "@id": `${PAGE_URL}#howto` },
};

export default function JakStanovujemeCenuPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />

      <div className="bg-white">
        <section className="mx-auto max-w-4xl px-6 pt-8">
          <Breadcrumbs
            items={[{ label: "Jak stanovujeme cenu", href: PAGE_PATH }]}
          />
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-4 pt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Jak stanovujeme výkupní cenu
          </h1>
          <LastUpdated path={PAGE_PATH} />
          <QuickAnswer>
            <p>
              Výkupní cena nemovitosti odpovídá 80–90 % aktuální tržní hodnoty.
              Tržní hodnotu počítáme z transakčních dat Českého statistického
              úřadu, krajských cenových map a aktuálních inzerátů ve stejné
              lokalitě, výměry bereme z{" "}
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
              Konečnou cenu posouvá nahoru atraktivní lokalita, čistý list
              vlastnictví a aktuální technický stav. Dolů ji posouvají exekuce,
              věcná břemena, nutnost rekonstrukce nebo požadavek na výkup do 7
              dnů. Žádné skryté slevy se neaplikují — všechny vstupy do výpočtu
              jsou v cenové nabídce viditelné.
            </p>
          </QuickAnswer>
        </section>

        {/* HowTo steps */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Pětistupňová metodika
            </h2>
            <ol className="mt-8 space-y-6 border-l-2 border-emerald-200 pl-6">
              {HOW_TO_STEPS.map((step, i) => (
                <li key={step.name} className="relative">
                  <span className="absolute -left-[33px] flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {step.name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-700">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Up / Down factors */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Co cenu posouvá nahoru a dolů
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
                <h3 className="text-lg font-semibold text-emerald-900">
                  Nahoru (až k 90 %)
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
                  {FACTORS_UP.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6">
                <h3 className="text-lg font-semibold text-amber-900">
                  Dolů (k 80 %)
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-700">
                  {FACTORS_DOWN.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="mt-1 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-600" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Concrete example */}
        <section className="bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Konkrétní příklad výpočtu
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <dl className="divide-y divide-slate-100">
                <div className="flex justify-between px-6 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    Typ nemovitosti
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900">
                    {EXAMPLE.type}
                  </dd>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    Lokalita
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900">
                    {EXAMPLE.location}
                  </dd>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    Tržní hodnota (medián)
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900">
                    {EXAMPLE.marketPrice}
                  </dd>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    Korekce — stav
                  </dt>
                  <dd className="text-sm font-semibold text-amber-700">
                    {EXAMPLE.conditionAdjustment}
                  </dd>
                </div>
                <div className="flex justify-between px-6 py-4">
                  <dt className="text-sm font-medium text-slate-500">
                    Korekce — právní stav
                  </dt>
                  <dd className="text-sm font-semibold text-amber-700">
                    {EXAMPLE.legalAdjustment}
                  </dd>
                </div>
                <div className="flex justify-between bg-emerald-50 px-6 py-4">
                  <dt className="text-sm font-medium text-emerald-900">
                    Výkupní cena
                  </dt>
                  <dd className="text-sm font-bold text-emerald-900">
                    {EXAMPLE.finalRange}
                  </dd>
                </div>
              </dl>
            </div>
            <p className="mt-4 text-xs italic text-slate-500">
              Příklad ilustrativní, založený na cenových údajích pro Prahu 4 v
              Q1 2026 podle Českého statistického úřadu. Reálná nabídka pro
              konkrétní byt se může lišit.
            </p>
          </div>
        </section>

        {/* Sources block */}
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Zdroje, ze kterých čerpáme
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                EXTERNAL_SOURCES.cuzk,
                EXTERNAL_SOURCES.czso,
                EXTERNAL_SOURCES.cnb,
                EXTERNAL_SOURCES.exekutorskakomora,
                EXTERNAL_SOURCES.insolvencnirejstrik,
                EXTERNAL_SOURCES.cak,
              ].map((source) => (
                <li
                  key={source.key}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    {source.name} ↗
                  </a>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {source.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Chcete vlastní cenovou nabídku?
            </h2>
            <p className="mt-3 text-slate-300">
              Vyplňte krátký formulář — do 24 hodin pošleme cenovou nabídku s
              viditelným výpočtem podle této metodiky.
            </p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-400"
              >
                Nezávazná nabídka zdarma
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
