import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, BadgeCheck, HandCoins } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

export const metadata: Metadata = {
  title: "Výkup nemovitosti v dražbě — zachráníme byt nebo dům před aukcí",
  description:
    "Vykupujeme nemovitosti zatížené exekuční nebo nucenou dražbou. Zaplatíme dluhy, zastavíme dražbu, vyplatíme zbývající částku majiteli. Bez provize.",
  alternates: withHreflang({
    canonical: "https://vykoupim-nemovitost.cz/vykup-v-drazbe",
  }),
  openGraph: {
    url: "https://vykoupim-nemovitost.cz/vykup-v-drazbe",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Vykupujete i nemovitosti v dobrovolné dražbě?",
    answer:
      "Ano. Dobrovolnou dražbu lze odvolat kdykoliv před jejím konáním. Pokud chcete dražbu zrušit a prodat napřímo bez čekání na výsledek aukce, postaráme se o celý administrativní proces a nabídneme přímý výkup za férovější cenu, než jakou byste pravděpodobně dostali v dražbě.",
  },
  {
    question: "Co s nájemníky v nemovitosti zatížené dražbou?",
    answer:
      "Nájemní smlouvy přejdou spolu s vlastnictvím na nového majitele — jejich platnost dražba ani výkup automaticky neruší. U problematických nájemních vztahů poskytneme právní podporu při řešení nájemní situace, včetně případných výpovědí podle občanského zákoníku.",
  },
  {
    question: "Kdy je výkup před dražbou výhodnější než dražba sama?",
    answer:
      "V nucené dražbě se nemovitost prodává za 2/3 znaleckého odhadu jako vyvolávací cenu, výsledná cena bývá 60–70 % tržní hodnoty. Výkup před dražbou typicky přinese 70–85 % tržní hodnoty bez stresu z nejistého výsledku aukce a bez čekání na rozvrhové usnesení soudu.",
  },
  {
    question: "Jak rychle dokážete zastavit nařízenou dražbu?",
    answer:
      "Typicky 5–10 dnů od podpisu kupní smlouvy a úhrady pohledávky exekutorovi. Po úhradě celé vymáhané pohledávky vznikne důvod k zastavení exekuce dle § 268 občanského soudního řádu (uplatňovaného v exekuci přes exekuční řád) a dražební řízení je následně zastaveno. Čím dříve nás kontaktujete, tím více času máme na bezpečné vyřízení procesu před termínem dražby.",
  },
  {
    question: "Co když má dražba více oprávněných věřitelů?",
    answer:
      "Při více věřitelích uhradíme všechny přednostní i běžné pohledávky v zákonném pořadí. Komunikaci s každým exekutorem nebo věřitelem koordinuje náš právní zástupce. Některé pohledávky (přednostní pohledávky státu, výživné) musí být uhrazeny dříve než ostatní.",
  },
  {
    question: "Lze zastavit dražbu i den před jejím termínem?",
    answer:
      "Technicky ano, ale je to riziková strategie. Pro zastavení musí být uhrazena celá pohledávka a exekutor musí stihnout podat návrh na zastavení. Doporučujeme začít minimálně 7 dnů před termínem dražby. Při kontaktu po tomto termínu pracujeme paralelně se zájmem o odložení dražby.",
  },
  {
    question: "Jak ověřujete pravost nařízení dražby a výši pohledávek?",
    answer:
      "Stav exekuce ověříme v Centrální evidenci exekucí, výši pohledávek u exekutora dotazem nebo z dražební vyhlášky. Insolvenci ověřujeme v Insolvenčním rejstříku (ISIR), zatížení v listu vlastnictví. Vždy pracujeme s aktuálními oficiálními údaji.",
  },
  {
    question: "Daníme prodej nemovitosti v exekuční dražbě?",
    answer:
      "Daňová povinnost prodávajícího je stejná jako u běžného prodeje — 15 % daň z příjmů z rozdílu mezi prodejní a pořizovací cenou (u zisku nad 36násobek průměrné mzdy 23 %). Osvobození platí po 10 letech vlastnictví (u nabytí od 2021) nebo 5 letech (u nabytí dříve), případně po 2 letech bydlení. Při prodeji za cenu nižší než pořizovací nevzniká zisk, a tudíž ani daň.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: HandCoins,
    title: "Den 1 — Kontakt a prověření",
    description:
      "Zavolejte nám nebo vyplňte formulář. Okamžitě prověříme stav nemovitosti v katastru a ověříme výši pohledávky u exekutora.",
  },
  {
    icon: Shield,
    title: "Dny 2–3 — Cenová nabídka",
    description:
      "Připravíme cenovou nabídku zohledňující výši pohledávek vůči exekutorovi i částku, která zbyde pro vás po uhrazení dluhů.",
  },
  {
    icon: BadgeCheck,
    title: "Dny 4–5 — Zastavení dražby",
    description:
      "Uhradíme exekutorovi celou pohledávku. Exekutor je povinen podát návrh na zastavení dražebního řízení do 24 hodin od přijetí platby.",
  },
  {
    icon: Clock,
    title: "Dny 6–10 — Předání a výplata",
    description:
      "Provedeme vklad do katastru nemovitostí, předáme nemovitost a vyplatíme vám zbývající částku přímo na účet.",
  },
] as const;

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Výkup nemovitosti v dražbě",
  provider: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  areaServed: "CZ",
  description:
    "Výkup nemovitostí zatížených exekuční nebo nucenou dražbou — zastavíme dražbu, uhradíme pohledávky, vyplatíme zbylou částku majiteli.",
} as const;

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://vykoupim-nemovitost.cz/vykup-v-drazbe",
  name: "Výkup nemovitosti v dražbě",
  url: "https://vykoupim-nemovitost.cz/vykup-v-drazbe",
  inLanguage: "cs-CZ",
  isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
  publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  speakable: buildSpeakableSpec(),
  dateModified: "2026-05-01",
};

export default async function VykupVDrazbe(): Promise<React.ReactElement> {
  const host = await getRequestHost();

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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: "Výkup v dražbě", href: "/vykup-v-drazbe" }]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti v dražbě — zachráníme váš byt nebo dům před aukcí
          </h1>
          <LastUpdated path="/vykup-v-drazbe" />
          <QuickAnswer>
            <p>
              Nucenou nebo dobrovolnou dražbu nemovitosti lze zastavit výkupem
              až do termínu konání. Výkupní firma uhradí celou vymáhanou
              pohledávku exekutorovi, čímž vznikne důvod pro zastavení exekuce
              dle § 268 občanského soudního řádu, a dražební řízení se následně
              zastaví. Vyvolávací cena v nucené dražbě činí 2/3 znaleckého
              odhadu, výsledná cena obvykle 60–70 % tržní hodnoty.
            </p>
            <p>
              Výkup před dražbou zachrání 70–85 % tržní hodnoty oproti zlomku v
              dražbě. Stav nařízení dražby ověřujeme v{" "}
              <a
                href={EXTERNAL_SOURCES.centralniEvidenceExekuci.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Centrální evidenci exekucí
              </a>{" "}
              a v dražební vyhlášce. Insolvenční řízení v{" "}
              <a
                href={EXTERNAL_SOURCES.insolvencnirejstrik.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Insolvenčním rejstříku ISIR
              </a>
              . Vždy pracujeme s aktuálními oficiálními údaji.
            </p>
            <p>
              Celý proces zastavení dražby trvá 5–10 dnů od podpisu kupní
              smlouvy. Doporučujeme začít minimálně 7 dnů před termínem dražby.
              Při více věřitelích se pohledávky uhradí v zákonném pořadí
              (přednostní pohledávky státu a výživné první). Smlouvu připravuje
              advokát, peníze procházejí advokátní úschovou.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
            Pokud má vaše nemovitost nařízenu exekuční nebo nucenou dražbu,
            stále existuje cesta ven. Dokud dražba nezačne, můžete ji zastavit
            prodejem — my uhradíme věřitelům celou pohledávku přímo z kupní ceny
            a zbývající částku vyplatíme vám.
          </p>
          <p className="mt-4 text-slate-600">
            Mnoho majitelů neví, že dražbu lze zastavit i v pokročilé fázi
            přípravy. Stačí, aby kupující uhradil celou pohledávku exekutorovi
            před zahájením dražebního jednání — exekutor je pak ze zákona
            povinen podat návrh na zastavení dražby. Celý proces zvládneme
            zpravidla do deseti dnů od prvního kontaktu.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od dražby, kde se nemovitost prodává za 60–70 % tržní ceny
            a z výtěžku se hradí náklady aukce, vám výkup přinese vyšší čistý
            výnos a jistotu — bez stresu z nejistého výsledku aukce a bez čekání
            na rozvrhové usnesení soudu.
          </p>
          <p className="mt-4 text-slate-600">
            Veškeré náklady na právní servis, ověření katastru i komunikaci s
            exekutorským úřadem hradíme my. Vy neplatíte žádnou provizi ani
            skryté poplatky.
          </p>
          <div className="mt-8">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Zastavíme dražbu do
            5–10 dnů
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> Diskrétní jednání
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak zastavit dražbu nemovitosti
          </h2>
          <p className="mt-4 text-slate-600">
            Proces výkupu před dražbou je rychlý a přímočarý. Postupujeme podle
            jasně daného harmonogramu, aby bylo vše vyřízeno ještě před termínem
            dražebního jednání.
          </p>
          <ol className="mt-8 space-y-6">
            {STEPS.map((step, index) => (
              <li
                key={index}
                className="flex gap-5 rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <div className="flex-shrink-0">
                  <step.icon className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Před dražbou vs. v průběhu dražby
          </h2>
          <p className="mt-4 text-slate-600">
            Výkup je nejjednodušší a nejrychlejší tehdy, když oslovíte nás ještě
            před termínem dražebního jednání. Jakmile exekutor obdrží plnou
            úhradu pohledávky, podá návrh na zastavení dražby okamžitě — v tu
            chvíli je celá věc vyřešena a vy dostanete zbylou částku na účet.
          </p>
          <p className="mt-4 text-slate-600">
            V průběhu samotného dražebního jednání již standardně zastavit
            dražbu nelze — zákon umožňuje zastavení exekuce pouze před zahájením
            dražby, pokud nebyla pohledávka dosud uhrazena. Proto platí jedno
            pravidlo: čím dříve nás kontaktujete, tím více možností máme.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Co když dražba již proběhla?
          </h2>
          <p className="mt-4 text-slate-600">
            Pokud bylo dražební jednání zahájeno, ale dosud neproběhl příklep
            (soudní nebo exekutorský), existují procesní prostředky obrany —
            například podání námitky nebo žaloby na zastavení řízení. Situace je
            složitější a vyžaduje konzultaci s advokátem. Tuto konzultaci vám
            zprostředkujeme zdarma, abyste věděli, jaké možnosti máte a jaký je
            realistický výhled.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu v dražbě
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Zachraňte nemovitost před dražbou ještě dnes
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Čím dříve nás oslovíte, tím více
              možností máme.
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

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles articles={getRelatedArticles("vykup-v-drazbe", 4)} />
        </div>
      </section>

      <LeadMagnetCta />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
