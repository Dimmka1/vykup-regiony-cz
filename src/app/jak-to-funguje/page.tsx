import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Search,
  HandCoins,
  FileSignature,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Jak funguje výkup nemovitosti | Vykoupíme Nemovitost",
  description:
    "Celý proces výkupu nemovitosti v 5 jednoduchých krocích - od prvního kontaktu po platbu na účet do 48 hodin. Bez provize, bez starostí.",
  alternates: { canonical: "https://vykoupim-nemovitost.cz/jak-to-funguje" },
};

const STEPS = [
  {
    number: 1,
    title: "Kontaktujte nás",
    description:
      "Vyplňte krátký formulář nebo zavolejte. Potřebujeme jen základní údaje o nemovitosti - adresu, typ a váš kontakt. Trvá to maximálně 2 minuty.",
    Icon: FileText,
  },
  {
    number: 2,
    title: "Ohodnocení nemovitosti",
    description:
      "Náš odborník provede nezávislé ocenění vaší nemovitosti. Zohledníme lokalitu, stav i aktuální tržní podmínky. Vše zdarma a nezávazně.",
    Icon: Search,
  },
  {
    number: 3,
    title: "Nezávazná nabídka do 24 hodin",
    description:
      "Na základě ohodnocení vám připravíme konkrétní cenovou nabídku. Žádné skryté poplatky, žádná provize. Nabídka je zcela nezávazná.",
    Icon: HandCoins,
  },
  {
    number: 4,
    title: "Podpis smlouvy",
    description:
      "Pokud nabídku přijmete, připravíme kupní smlouvu. Veškerý právní servis zajistíme za vás - nemusíte řešit nic navíc.",
    Icon: FileSignature,
  },
  {
    number: 5,
    title: "Platba na účet do 48 hodin",
    description: `Po podpisu smlouvy obdržíte peníze na váš účet do 48 hodin. Zálohu až ${process.env.NEXT_PUBLIC_MAX_ZALOHA || "500 000"} Kč můžete dostat ihned při podpisu.`,
    Icon: Banknote,
  },
] as const;

/** HowTo JSON-LD for Google rich snippets (VR-150) */
const HOWTO_STEPS = [
  {
    name: "Vyplňte formulář",
    text: "Vyplňte krátký online formulář s údaji o vaší nemovitosti — adresu, typ a kontakt. Trvá to maximálně 2 minuty.",
    url: "https://vykoupim-nemovitost.cz/#kontakt",
  },
  {
    name: "Získejte nabídku do 24 hodin",
    text: "Na základě nezávislého ohodnocení vám do 24 hodin připravíme konkrétní cenovou nabídku bez skrytých poplatků a bez provize.",
    url: "https://vykoupim-nemovitost.cz/jak-to-funguje",
  },
  {
    name: "Podpis smlouvy + záloha",
    text: "Pokud nabídku přijmete, připravíme kupní smlouvu. Při podpisu obdržíte zálohu. Veškerý právní servis zajistíme za vás.",
    url: "https://vykoupim-nemovitost.cz/jak-to-funguje",
  },
  {
    name: "Vyplacení celé částky",
    text: "Po podpisu smlouvy obdržíte zbývající částku na váš účet. Celý proces je rychlý, transparentní a bez starostí.",
    url: "https://vykoupim-nemovitost.cz/jak-to-funguje",
  },
] as const;

const JSON_LD_HOWTO = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Jak prodat nemovitost rychle – výkup v 4 krocích",
  description:
    "Prodejte nemovitost rychle a bez provize. Celý proces od vyplnění formuláře po vyplacení celé částky zvládneme do 7 dnů.",
  totalTime: "P7D",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "CZK",
    value: "0",
  },
  tool: ["Telefon", "Počítač"],
  step: HOWTO_STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
    url: s.url,
  })),
};

export default function JakToFungujePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_HOWTO) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Jak funguje výkup nemovitosti
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--theme-100)]">
            Od prvního kontaktu k penězům na účtu - transparentně, rychle a bez
            starostí. Celý proces zvládneme za vás.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <ol className="relative space-y-12 border-l-2 border-[var(--theme-200)] pl-8">
            {STEPS.map((step) => (
              <li key={step.number} className="relative">
                <span className="absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-700)] text-sm font-bold text-white">
                  {step.number}
                </span>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <step.Icon className="h-6 w-6 shrink-0 text-[var(--theme-700)]" />
                    <h2 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h2>
                  </div>
                  <p className="mt-3 leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Chcete začít?</h2>
          <p className="mt-3 text-lg text-slate-600">
            Vyplňte nezávazný formulář a do 24 hodin vám pošleme nabídku na
            výkup vaší nemovitosti.
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
          </div>
        </div>
      </section>
    </>
  );
}
