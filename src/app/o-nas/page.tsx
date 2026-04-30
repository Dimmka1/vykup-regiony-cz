import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Search,
  FileSignature,
  Banknote,
  Scale,
  Zap,
  EyeOff,
  Award,
  ArrowRight,
  User,
  Calendar,
  MapPinned,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AboutCounters } from "@/components/about-counters";
import { AboutMap } from "@/components/about-map";

const FOUNDER_NAME = process.env.NEXT_PUBLIC_FOUNDER_NAME || "";

export const metadata: Metadata = {
  title: "O nás | Vykoupím Nemovitost — férový výkup nemovitostí",
  description:
    "Jsme česká firma specializující se na rychlý a férový výkup nemovitostí po celé ČR. Bez provize, s právním servisem zdarma a platbou do 48 hodin.",
  alternates: { canonical: "https://vykoupim-nemovitost.cz/o-nas" },
  openGraph: {
    title: "O nás | Vykoupím Nemovitost",
    description:
      "Rychlý a férový výkup nemovitostí po celé České republice. Bez provize, bez starostí.",
    url: "https://vykoupim-nemovitost.cz/o-nas",
    type: "website",
  },
};

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Kontaktujte nás",
    description:
      "Vyplňte krátký formulář nebo zavolejte. Potřebujeme jen základní informace o vaší nemovitosti.",
    Icon: Phone,
  },
  {
    number: 2,
    title: "Prohlídka a ohodnocení",
    description:
      "Náš odborník provede nezávislé ocenění nemovitosti. Zohledníme lokalitu, stav i tržní podmínky.",
    Icon: Search,
  },
  {
    number: 3,
    title: "Nezávazná nabídka",
    description:
      "Do 24 hodin obdržíte konkrétní cenovou nabídku. Žádné skryté poplatky, žádná provize.",
    Icon: FileSignature,
  },
  {
    number: 4,
    title: "Výkup a platba",
    description:
      "Po podpisu smlouvy obdržíte peníze na účet do 48 hodin. Právní servis zajistíme za vás.",
    Icon: Banknote,
  },
] as const;

const VALUES = [
  {
    title: "Férovost",
    description:
      "Cenu určujeme podle aktuálních dat z realitního trhu a stavu nemovitosti. Co řekneme, to platí — žádné srážky na poslední chvíli.",
    Icon: Scale,
  },
  {
    title: "Rychlost",
    description:
      "Celý proces od první konzultace po vyplacení peněz zvládneme do 7 dnů. Když spěcháte, jsme tu pro vás.",
    Icon: Zap,
  },
  {
    title: "Diskrétnost",
    description:
      "Žádná veřejná inzerce, žádné prohlídky s cizími lidmi. Vše řešíme výhradně mezi námi.",
    Icon: EyeOff,
  },
  {
    title: "Profesionalita",
    description:
      "Za každým prodejem stojí konkrétní člověk, kterému můžete zavolat. Právník, odhadce, makléř — všechno řešíme my, ne vy.",
    Icon: Award,
  },
] as const;

const TIMELINE_MILESTONES = [
  {
    year: process.env.NEXT_PUBLIC_FOUNDING_YEAR || "2025",
    title: "Založení společnosti",
    description:
      "Náš tým zkušených odborníků z oboru nemovitostí založil Vykoupím Nemovitost s jasnou vizí — nabídnout férovou a rychlou alternativu k tradičnímu prodeji.",
    Icon: Calendar,
  },
  {
    year: "2025",
    title: "Pokrytí všech 14 krajů ČR",
    description:
      "Od prvního dne působíme po celé České republice. Díky zkušenostem týmu v oboru dokážeme pomoct s výkupem nemovitostí v každém kraji.",
    Icon: MapPinned,
  },
] as const;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Vykoupím Nemovitost",
  url: "https://vykoupim-nemovitost.cz",
  description:
    "Rychlý a férový výkup nemovitostí po celé České republice. Bez provize, s právním servisem zdarma.",
  areaServed: {
    "@type": "Country",
    name: "CZ",
  },
  sameAs: [],
};

export default function ONasPage(): React.ReactElement {
  const founderDisplayName = FOUNDER_NAME || "Náš zakladatel";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
      />

      <div className="bg-white">
        {/* Breadcrumbs */}
        <section className="mx-auto max-w-5xl px-6 pt-8">
          <Breadcrumbs items={[{ label: "O nás", href: "/o-nas" }]} />
        </section>

        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            O&nbsp;nás
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
            Jsme česká firma specializující se na rychlý a&nbsp;férový výkup
            nemovitostí po celé ČR. Pomáháme lidem, kteří potřebují prodat
            nemovitost rychle, diskrétně a&nbsp;za férovou cenu&nbsp;— bez
            provize a&nbsp;bez zbytečných komplikací.
          </p>
        </section>

        {/* AC-1: Náš tým — founder section */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Náš tým
            </h2>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* Founder photo placeholder */}
              <div className="flex-shrink-0">
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-200 shadow-inner">
                  <User className="h-16 w-16 text-slate-400" />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-slate-900">
                  {founderDisplayName}
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--theme-600)]">
                  Zakladatel &amp; jednatel
                </p>
                <p className="mt-4 leading-relaxed text-slate-600">
                  Za naší službou stojí tým odborníků na nemovitosti, právo
                  a&nbsp;finance se zkušenostmi z&nbsp;bankovního
                  a&nbsp;realitního sektoru. Ke každému klientovi přistupujeme
                  individuálně a&nbsp;s&nbsp;maximální péčí.
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  Spojuje nás společný cíl&nbsp;— pomáhat lidem vyřešit složité
                  životní situace rychle, férově a&nbsp;s&nbsp;maximální péčí.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AC-2: Historie firmy — timeline */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-12 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Historie firmy
            </h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-slate-200 sm:block" />
              <div className="space-y-10">
                {TIMELINE_MILESTONES.map((milestone, idx) => (
                  <div key={idx} className="relative flex gap-6">
                    {/* Dot on timeline */}
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--theme-500)] text-white shadow-md">
                      <milestone.Icon className="h-5 w-5" />
                    </div>
                    <div className="pt-1">
                      <span className="inline-block rounded-full bg-[var(--theme-50)] px-3 py-0.5 text-xs font-bold text-[var(--theme-700)]">
                        {milestone.year}
                      </span>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {milestone.title}
                      </h3>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* AC-3: Čísla, která mluví za nás — animated counters */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Čísla, která mluví za nás
            </h2>
            <AboutCounters />
          </div>
        </section>

        {/* Jak pracujeme */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Jak pracujeme
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--theme-500)] text-white">
                    <step.Icon className="h-6 w-6" />
                  </div>
                  <div className="mb-2 text-sm font-semibold text-[var(--theme-600)]">
                    Krok {step.number}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Naše hodnoty */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Naše hodnoty
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {VALUES.map((value) => (
                <div
                  key={value.title}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--theme-50)] text-[var(--theme-600)]">
                      <value.Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AC-4: Kde nás najdete — SVG map */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-4 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Kde nás najdete
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-slate-600">
              Působíme ve všech 14 krajích České republiky. Ať jste
              kdekoli&nbsp;— jsme připraveni vám pomoci.
            </p>
            <AboutMap />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-xl px-6 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
              Chcete prodat nemovitost?
            </h2>
            <p className="mb-8 text-slate-300">
              Kontaktujte nás a&nbsp;do 24&nbsp;hodin vám zašleme nezávaznou
              nabídku na výkup vaší nemovitosti. Bez provize, bez starostí.
            </p>
            <Link
              href="/#kontakt"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--theme-500)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-600)]"
            >
              Nezávazná konzultace zdarma
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
