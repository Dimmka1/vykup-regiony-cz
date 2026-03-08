import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  Scale,
  Ban,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Garance výkupu nemovitosti | vykoupim-nemovitost.cz",
  description:
    "5 garancí výkupu nemovitosti — garantovaná cena, platba do 48 hodin, právní servis zdarma, bez provize a plná diskrétnost. Vše máte černé na bílém.",
  alternates: { canonical: "https://vykoupim-nemovitost.cz/garance-vykupu" },
};

const GUARANTEES = [
  {
    Icon: BadgeCheck,
    title: "Garance ceny",
    description:
      "Výkupní cena je závazně zafixována ve smlouvě. Žádné dodatečné srážky, žádné změny na poslední chvíli.",
  },
  {
    Icon: Clock,
    title: "Garance splatnosti do 48 hodin",
    description: `Peníze obdržíte na svůj účet do 48 hodin od podpisu smlouvy. Zálohu až ${process.env.NEXT_PUBLIC_ZALOH_VARIANT || "500 000"} Kč vyplácíme ihned.`,
  },
  {
    Icon: Scale,
    title: "Garance právního servisu",
    description:
      "Kompletní právní servis zajistíme zdarma — smlouvy, katastr, vše řešíme za vás. Nemusíte shánět vlastního advokáta.",
  },
  {
    Icon: Ban,
    title: "Garance bez provize",
    description:
      "Žádné skryté poplatky, žádná provize. Částka ve smlouvě je přesně to, co dostanete na účet.",
  },
  {
    Icon: EyeOff,
    title: "Garance diskrétnosti",
    description:
      "Celý proces proběhne diskrétně, bez zbytečné publicity. Žádné cedule, žádné prohlídky s cizími lidmi.",
  },
] as const;

const JSON_LD_WEBPAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Garance výkupu nemovitosti",
  description:
    "5 garancí výkupu nemovitosti — garantovaná cena, platba do 48 hodin, právní servis zdarma, bez provize a plná diskrétnost.",
  url: "https://vykoupim-nemovitost.cz/garance-vykupu",
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: "https://vykoupim-nemovitost.cz",
  },
};

export default function GaranceVykupuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_WEBPAGE) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Naše garance výkupu
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--theme-100)]">
            Prodej nemovitosti je velké rozhodnutí. Proto vám dáváme 5 písemných
            garancí, které vás chrání po celou dobu spolupráce.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Breadcrumbs
          items={[{ label: "Garance výkupu", href: "/garance-vykupu" }]}
        />
      </div>

      {/* Guarantees */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {GUARANTEES.map((guarantee) => (
              <div
                key={guarantee.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-100)]">
                    <guarantee.Icon className="h-5 w-5 text-[var(--theme-700)]" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {guarantee.title}
                  </h2>
                </div>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Přesvědčili jsme vás?
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Vyplňte nezávazný formulář a do 24 hodin vám pošleme nabídku na
            výkup vaší nemovitosti — se všemi garancemi černé na bílém.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
            >
              Chci nabídku zdarma
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
            >
              ← Zpět na hlavní stránku
            </Link>
            <Link
              href="/srovnani-vykupnich-firem"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
            >
              Srovnání výkupních firem →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
