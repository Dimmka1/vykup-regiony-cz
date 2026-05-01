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
import { withHreflang } from "@/lib/seo-hreflang";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { MAX_ZALOHA, PRICE_PERCENT } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Jak funguje výkup nemovitosti | Vykoupíme Nemovitost",
  description:
    "Celý proces výkupu nemovitosti v 5 jednoduchých krocích - od prvního kontaktu po platbu na účet do 48 hodin. Bez provize, bez starostí.",
  alternates: withHreflang({
    canonical: "https://vykoupim-nemovitost.cz/jak-to-funguje",
  }),
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
    description: `Po podpisu smlouvy obdržíte peníze na váš účet do 48 hodin. Nabízíme až ${PRICE_PERCENT} % tržní ceny — zálohu až ${MAX_ZALOHA} Kč můžete dostat ihned při podpisu.`,
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
  "@id": "https://vykoupim-nemovitost.cz/jak-to-funguje#howto",
  name: "Jak prodat nemovitost rychle – výkup v 5 krocích",
  description:
    "Prodejte nemovitost rychle a bez provize. Celý proces od vyplnění formuláře po vyplacení celé částky zvládneme do 14 dnů.",
  totalTime: "P14D",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "CZK",
    value: "0",
  },
  tool: ["Telefon", "Počítač", "List vlastnictví"],
  supply: ["Doklad totožnosti", "List vlastnictví", "PENB"],
  step: HOWTO_STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.text,
    url: s.url,
  })),
  inLanguage: "cs-CZ",
  publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
};

const JSON_LD_WEBPAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://vykoupim-nemovitost.cz/jak-to-funguje",
  name: "Jak funguje výkup nemovitosti",
  url: "https://vykoupim-nemovitost.cz/jak-to-funguje",
  inLanguage: "cs-CZ",
  isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
  publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  speakable: buildSpeakableSpec(),
  about: { "@id": "https://vykoupim-nemovitost.cz/jak-to-funguje#howto" },
  dateModified: "2026-05-01",
};

export default function JakToFungujePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_HOWTO) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_WEBPAGE) }}
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

      {/* Quick Answer + LastUpdated */}
      <section className="bg-white pb-2 pt-12">
        <div className="mx-auto max-w-4xl px-6">
          <LastUpdated path="/jak-to-funguje" />
          <QuickAnswer>
            <p>
              Výkup nemovitosti probíhá v pěti krocích a celkem trvá 7–14 dnů.
              Vlastník nejprve vyplní krátký formulář s adresou, typem a stavem
              nemovitosti. Specializovaná firma do 24 hodin sestaví nezávaznou
              cenovou nabídku ve výši 80–90 % tržní hodnoty z dat{" "}
              <a
                href={EXTERNAL_SOURCES.czso.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Českého statistického úřadu
              </a>{" "}
              a aktuálních inzerátů v lokalitě.
            </p>
            <p>
              Po prohlídce nemovitosti se cena finalizuje, advokát připraví
              kupní smlouvu, podpis proběhne v advokátní úschově podle pravidel{" "}
              <a
                href={EXTERNAL_SOURCES.cak.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                České advokátní komory
              </a>
              . Zálohu až {MAX_ZALOHA} Kč lze vyplatit hned, zbývající částku po
              zápisu nového vlastníka v{" "}
              <a
                href={EXTERNAL_SOURCES.cuzk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                katastru nemovitostí
              </a>{" "}
              (lhůta 20–30 dnů) — celkem do 14 dnů od podpisu.
            </p>
            <p>
              Vlastník neplatí provizi, právní servis ani odhad — všechny
              náklady přebírá výkupce. Proces se používá při exekuci, dědictví,
              rozvodu, prodeji spoluvlastnického podílu, hypotéce, věcném
              břemenu i při potřebě rychlé likvidity.
            </p>
          </QuickAnswer>
        </div>
      </section>

      {/* Postup výkupu krok za krokem — den po dni
          (targets GSC queries: "postup výkupu", "postup výkupu nemovitosti",
           "postup výkupu nemovitostí" — ~145 imp / 0 clicks today).  */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2
            id="postup-vykupu"
            className="scroll-mt-24 text-3xl font-bold text-slate-900"
          >
            Postup výkupu nemovitosti krok za krokem
          </h2>
          <p className="mt-4 text-lg text-slate-700">
            Celý <strong>postup výkupu nemovitostí</strong> trvá obvykle 7–14
            dnů. Níže najdete každý krok přesně tak, jak probíhá u nás:
          </p>
          <ol className="mt-6 list-decimal space-y-3 pl-6 text-slate-700">
            <li>
              <strong>Den 1:</strong> Zavolejte nebo vyplňte krátký formulář —
              zjistíme adresu, typ nemovitosti a stav.
            </li>
            <li>
              <strong>Den 1–2:</strong> Vypracujeme nezávaznou cenovou nabídku z
              dostupných dat (kataster, ceny v okolí, právní stav).
            </li>
            <li>
              <strong>Den 3–4:</strong> Osobní prohlídka nemovitosti — zástupce
              přijede zdarma kamkoli v ČR.
            </li>
            <li>
              <strong>Den 5:</strong> Finální cenová nabídka + návrh kupní
              smlouvy připravený advokátem.
            </li>
            <li>
              <strong>Den 6–7:</strong> Podpis smlouvy v advokátní úschově —
              peníze deponovány u advokáta.
            </li>
            <li>
              <strong>Den 8–10:</strong> Návrh na vklad do katastru nemovitostí,
              vypořádání případných exekucí či hypoték.
            </li>
            <li>
              <strong>Den 11–14:</strong> Vyplacení kupní ceny, předání klíčů a
              protokolární předání.
            </li>
          </ol>
          <p className="mt-6 text-sm text-slate-500">
            <em>
              U komplikovaných případů (spoluvlastnické podíly, rozdělené
              dědictví, několik exekucí současně) se doba prodlužuje na 21–30
              dnů — vždy s pevně daným harmonogramem.
            </em>
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
