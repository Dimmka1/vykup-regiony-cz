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
  Building2,
  Users,
  MapPin,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";

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
      "Nabízíme reálné ceny odpovídající aktuálnímu trhu. Žádné skryté poplatky, žádné dodatečné srážky.",
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
      "Každý případ řešíme individuálně s týmem odborníků na nemovitosti, právo a finance.",
    Icon: Award,
  },
] as const;

const TRUST_STATS = [
  {
    value: "5+",
    label: "let na trhu",
    Icon: Building2,
  },
  {
    value: "200+",
    label: "spokojených klientů",
    Icon: Users,
  },
  {
    value: "14",
    label: "krajů ČR pokrýváme",
    Icon: MapPin,
  },
  {
    value: "100 %",
    label: "právní garance",
    Icon: ShieldCheck,
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

        {/* Jak pracujeme */}
        <section className="bg-slate-50 py-16">
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
        <section className="py-16">
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

        {/* Proč nám důvěřovat */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              Proč nám důvěřovat
            </h2>
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {TRUST_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-white p-6 text-center shadow-sm"
                >
                  <stat.Icon className="mx-auto mb-3 h-8 w-8 text-[var(--theme-500)]" />
                  <div className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Náš tým */}
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="mb-4 text-2xl font-bold text-slate-900 sm:text-3xl">
              Náš tým
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
              Za naší službou stojí tým zkušených odborníků na nemovitosti,
              právo a&nbsp;finance. Každý člen týmu přináší letité zkušenosti
              z&nbsp;oboru a&nbsp;osobní přístup ke každému klientovi.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-500">
              Spojuje nás společný cíl&nbsp;— pomáhat lidem vyřešit složité
              životní situace rychle, férově a&nbsp;s&nbsp;maximální péčí.
            </p>
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
