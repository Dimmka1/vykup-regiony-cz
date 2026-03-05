import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Send,
  Search,
  CheckCircle,
  ShieldCheck,
  Scale,
  FileText,
  Clock,
  Banknote,
  Ban,
  HelpCircle,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Cenová garance výkupu | Dorovnáme konkurenční nabídku",
  description:
    "Máte nabídku od konkurence? Dorovnáme ji nebo vysvětlíme proč ne. Transparentní ceny, žádné skryté poplatky — právní servis, odhad i administrativa zdarma.",
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/cenova-garancia",
  },
};

const STEPS = [
  {
    Icon: Send,
    title: "Pošlete nám nabídku",
    description:
      "Nahrajte konkurenční nabídku nebo ji popište. Stačí cena a základní podmínky.",
  },
  {
    Icon: Search,
    title: "Porovnáme",
    description:
      "Naši odborníci nabídku analyzují a porovnají s naším oceněním nemovitosti.",
  },
  {
    Icon: CheckCircle,
    title: "Dorovnáme nebo vysvětlíme",
    description:
      "Pokud je nabídka férová, dorovnáme ji. Pokud ne, transparentně vysvětlíme proč.",
  },
] as const;

const PRICING_ITEMS = [
  {
    Icon: Scale,
    service: "Právní servis",
    description: "Kompletní právní zajištění transakce",
    price: "Zdarma",
  },
  {
    Icon: FileText,
    service: "Odhad nemovitosti",
    description: "Profesionální ocenění tržní hodnoty",
    price: "Zdarma",
  },
  {
    Icon: FileText,
    service: "Administrativa",
    description: "Katastr, smlouvy, veškeré papírování",
    price: "Zdarma",
  },
  {
    Icon: Ban,
    service: "Provize",
    description: "Žádná provize, žádné skryté poplatky",
    price: "0 Kč",
  },
] as const;

interface ComparisonColumn {
  label: string;
  highlight?: boolean;
}

const COMPARISON_COLS: ComparisonColumn[] = [
  { label: "Výkup přes nás", highlight: true },
  { label: "Realitní kancelář" },
  { label: "Aukce / dražba" },
];

const COMPARISON_ROWS = [
  {
    criterion: "Doba prodeje",
    us: "Do 7 dnů",
    realitka: "3–12 měsíců",
    aukce: "2–6 měsíců",
  },
  {
    criterion: "Provize",
    us: "0 Kč",
    realitka: "3–5 % z ceny",
    aukce: "5–15 % aukční přirážka",
  },
  {
    criterion: "Jistota prodeje",
    us: "Garantovaná",
    realitka: "Nejistá",
    aukce: "Závisí na zájmu",
  },
  {
    criterion: "Právní servis",
    us: "Zdarma",
    realitka: "Na vaše náklady",
    aukce: "Na vaše náklady",
  },
  {
    criterion: "Cenová garance",
    us: "Ano — dorovnáme",
    realitka: "Ne",
    aukce: "Ne",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Jak cenová garance funguje?",
    answer:
      "Pokud máte písemnou nabídku od jiného výkupce, pošlete nám ji. Naši specialisté ji posoudí a pokud je nabídka reálná a ověřitelná, dorovnáme ji nebo vám transparentně vysvětlíme, proč se naše ocenění liší.",
  },
  {
    question: "Jakou nabídku musím doložit?",
    answer:
      "Potřebujeme písemnou nabídku od konkrétní společnosti — ideálně s identifikací firmy, cenou a podmínkami. Ústní přísliby bohužel nemůžeme porovnávat.",
  },
  {
    question: "Platí garance i pro nemovitosti s právní vadou?",
    answer:
      "Ano. Specializujeme se na výkup nemovitostí s exekucí, hypotékou, věcným břemenem i spoluvlastnickým podílem. Garance platí pro všechny typy nemovitostí.",
  },
  {
    question: "Jak rychle dostanu odpověď?",
    answer:
      "Na vaši žádost reagujeme do 24 hodin. Po obdržení konkurenční nabídky vám sdělíme naše stanovisko do 48 hodin.",
  },
  {
    question: "Je cenová garance závazná?",
    answer:
      "Ano. Pokud splníte podmínky (písemná nabídka od reálné firmy), naše dorovnání je závazné a bude součástí smlouvy.",
  },
] as const;

const faqJsonLd = {
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

export default function CenovaGaranciaPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[{ label: "Cenová garance", href: "/cenova-garancia" }]}
        />

        {/* Hero */}
        <section className="mt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Máte nabídku od konkurence?{" "}
            <span className="text-emerald-600">Dorovnáme ji</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Garantujeme férovou cenu za vaši nemovitost. Pokud máte lepší
            nabídku, dorovnáme ji — nebo transparentně vysvětlíme proč.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#formular"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
            >
              Poslat konkurenční nabídku
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              href="/garance-vykupu"
              className="inline-flex items-center gap-2 text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Všechny garance výkupu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Jak to funguje */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Jak to funguje
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <step.Icon className="h-7 w-7" />
                </div>
                <p className="mt-2 text-sm font-semibold text-emerald-600">
                  Krok {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Transparent pricing */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Co je zahrnuto v ceně
          </h2>
          <p className="mt-2 text-center text-slate-600">
            Vše je zdarma — žádné skryté poplatky
          </p>
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-slate-700 sm:px-6">
                    Služba
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 sm:px-6">
                    Cena
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PRICING_ITEMS.map((item) => (
                  <tr key={item.service}>
                    <td className="px-4 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <item.Icon className="h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {item.service}
                          </p>
                          <p className="text-sm text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-emerald-600 sm:px-6">
                      {item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comparison */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Srovnání: výkup vs realitka vs aukce
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 text-sm font-semibold text-slate-700 sm:px-4" />
                  {COMPARISON_COLS.map((col) => (
                    <th
                      key={col.label}
                      className={`px-3 py-3 text-center text-sm font-semibold sm:px-4 ${
                        col.highlight
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.criterion}>
                    <td className="px-3 py-3 font-medium text-slate-900 sm:px-4">
                      {row.criterion}
                    </td>
                    <td className="bg-emerald-50/50 px-3 py-3 text-center font-semibold text-emerald-700 sm:px-4">
                      {row.us}
                    </td>
                    <td className="px-3 py-3 text-center text-slate-600 sm:px-4">
                      {row.realitka}
                    </td>
                    <td className="px-3 py-3 text-center text-slate-600 sm:px-4">
                      {row.aukce}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Často kladené dotazy
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-slate-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 text-left font-semibold text-slate-900 transition-colors hover:text-emerald-600 [&::-webkit-details-marker]:hidden">
                  <HelpCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="flex-1">{item.question}</span>
                  <span
                    className="ml-2 text-slate-400 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </summary>
                <div className="px-5 pb-4 text-slate-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Form */}
        <section id="formular" className="mt-16 scroll-mt-24">
          <div className="rounded-2xl bg-emerald-50 p-6 sm:p-10">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Pošlete nám konkurenční nabídku
            </h2>
            <p className="mt-2 text-center text-slate-600">
              Odpovíme do 24 hodin s naším stanoviskem
            </p>
            <form
              action="/api/lead"
              method="POST"
              encType="multipart/form-data"
              className="mx-auto mt-8 max-w-lg space-y-5"
            >
              <input type="hidden" name="source" value="cenova-garancia" />
              <div>
                <label
                  htmlFor="cg-name"
                  className="block text-sm font-medium text-slate-700"
                >
                  Jméno a příjmení
                </label>
                <input
                  id="cg-name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="cg-phone"
                  className="block text-sm font-medium text-slate-700"
                >
                  Telefon
                </label>
                <input
                  id="cg-phone"
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="cg-email"
                  className="block text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>
                <input
                  id="cg-email"
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="cg-offer"
                  className="block text-sm font-medium text-slate-700"
                >
                  Popište konkurenční nabídku
                </label>
                <textarea
                  id="cg-offer"
                  name="offer"
                  rows={4}
                  placeholder="Např. firma XY mi nabídla 2 500 000 Kč za byt 2+1 v Praze..."
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 shadow-sm transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div>
                <label
                  htmlFor="cg-file"
                  className="block text-sm font-medium text-slate-700"
                >
                  Nahrát nabídku (PDF, JPG)
                </label>
                <input
                  id="cg-file"
                  name="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-200"
                />
              </div>
              <div className="flex items-start gap-2">
                <input
                  id="cg-consent"
                  name="consent"
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="cg-consent" className="text-sm text-slate-600">
                  Souhlasím se{" "}
                  <Link
                    href="/ochrana-osobnich-udaju"
                    className="text-emerald-600 underline hover:text-emerald-700"
                  >
                    zpracováním osobních údajů
                  </Link>
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-colors hover:bg-emerald-700"
              >
                Odeslat nabídku k porovnání
              </button>
            </form>
          </div>
        </section>

        {/* Internal links */}
        <section className="mt-16 rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Další informace o výkupu
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              href="/garance-vykupu"
              className="flex items-center gap-2 rounded-lg border border-slate-100 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-slate-900">Garance výkupu</p>
                <p className="text-sm text-slate-500">
                  5 garancí pro váš klidný prodej
                </p>
              </div>
            </Link>
            <Link
              href="/proc-my"
              className="flex items-center gap-2 rounded-lg border border-slate-100 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Banknote className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-slate-900">Proč prodat nám</p>
                <p className="text-sm text-slate-500">
                  Srovnání s realitkou a dražbou
                </p>
              </div>
            </Link>
            <Link
              href="/jak-to-funguje"
              className="flex items-center gap-2 rounded-lg border border-slate-100 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Clock className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-slate-900">Jak to funguje</p>
                <p className="text-sm text-slate-500">
                  Celý proces krok za krokem
                </p>
              </div>
            </Link>
            <Link
              href="/caste-dotazy"
              className="flex items-center gap-2 rounded-lg border border-slate-100 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
            >
              <HelpCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-slate-900">Časté dotazy</p>
                <p className="text-sm text-slate-500">
                  Odpovědi na nejčastější otázky
                </p>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
