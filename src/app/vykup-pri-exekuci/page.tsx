import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  AlertTriangle,
  TrendingDown,
  Scale,
  Phone,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
  },
  title: "Výkup nemovitosti při exekuci — rychlé řešení, férová cena | 2025",
  description:
    "Prodejte nemovitost zatíženou exekucí rychle a diskrétně. Timeline exekučního řízení, reálné případy, srovnání výkup vs dražba. Vyřešíme dluhy, vyplatíme vás do 7 dnů. Bez provize.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Lze prodat nemovitost v exekuci?",
    answer:
      "Ano, prodej nemovitosti v exekuci je možný se souhlasem exekutora. Exekutor může udělit souhlas s prodejem, pokud je zajištěno, že výtěžek pokryje pohledávky věřitelů. My se postaráme o veškerou komunikaci s exekutorským úřadem a zajistíme hladký průběh celého procesu. Právní základ pro tento postup najdete v § 44a exekučního řádu.",
  },
  {
    question: "Kolik za nemovitost v exekuci dostanu?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty nemovitosti. Z kupní ceny uhradíme exekuční pohledávky a zbytek vyplatíme přímo vám. Neplatíte žádné provize ani skryté poplatky. Pro srovnání — při nucené dražbě nemovitost často odejde za 50–70 % hodnoty, a po odečtení nákladů dražby vám zbude ještě méně.",
  },
  {
    question: "Jak rychle proběhne výkup při exekuci?",
    answer:
      "Od prvního kontaktu po vyplacení peněz to může být i 7 dní. Standardně celý proces trvá 2–4 týdny včetně vyřízení souhlasu exekutora, přípravy smlouvy a zápisu do katastru. Klíčové je začít co nejdříve — čím dále je exekuční řízení, tím méně času na jednání zbývá.",
  },
  {
    question: "Co když mám více exekucí na nemovitosti?",
    answer:
      "I v případě více exekucí dokážeme situaci vyřešit. Naši právníci koordinují úhradu všech pohledávek z kupní ceny tak, aby byl prodej co nejrychlejší a nejvýhodnější pro vás. Komunikujeme se všemi exekutory najednou a hledáme optimální řešení pro kompletní oddlužení.",
  },
  {
    question: "Mohu v nemovitosti po prodeji ještě bydlet?",
    answer:
      "Ano, nabízíme možnost zpětného nájmu. Po prodeji můžete v nemovitosti dále bydlet za dohodnutý nájem. Toto řešení je ideální, pokud potřebujete vyřešit exekuci, ale nechcete se okamžitě stěhovat. Podmínky nájmu dohodneme individuálně.",
  },
  {
    question: "Co se stane, když exekutor neschválí prodej?",
    answer:
      "V praxi exekutoři prodej schvalují ve většině případů, protože dobrovolný prodej přinese vyšší výtěžek než dražba. Pokud by přesto souhlas nebyl udělen, pomůžeme vám najít alternativní řešení — například jednání s věřiteli o restrukturalizaci dluhu.",
  },
  {
    question: "Jaké dokumenty potřebuji k zahájení výkupu?",
    answer:
      "Pro rychlý start stačí výpis z katastru nemovitostí a kopie exekučních příkazů. Vše ostatní (znalecký posudek, komunikaci s exekutorem, přípravu smluv) zajistíme my na vlastní náklady. Pokud nemáte dokumenty po ruce, pomůžeme vám je získat.",
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
    title: "1. Nezávazná nabídka",
    description:
      "Vyplňte formulář a do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Shield,
    title: "2. Právní prověření",
    description:
      "Naši právníci prověří stav exekuce a připraví optimální řešení.",
  },
  {
    icon: BadgeCheck,
    title: "3. Dohoda s exekutorem",
    description: "Zajistíme souhlas exekutora a připravíme kupní smlouvu.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Uhradíme dluhy z kupní ceny a zbytek vyplatíme přímo vám.",
  },
] as const;

interface TimelinePhase {
  phase: string;
  title: string;
  timeframe: string;
  description: string;
  urgency: "low" | "medium" | "high" | "critical";
}

const EXEKUCE_TIMELINE: readonly TimelinePhase[] = [
  {
    phase: "1",
    title: "Výzva k dobrovolnému plnění",
    timeframe: "30 dnů na splnění",
    description:
      "Exekutor vám doručí výzvu k úhradě dluhu. Máte 30 dnů na dobrovolné zaplacení. V této fázi je ještě prostor pro jednání a výkup nemovitosti proběhne nejsnáze.",
    urgency: "low",
  },
  {
    phase: "2",
    title: "Exekuční příkaz (usnesení)",
    timeframe: "Po uplynutí 30 dnů",
    description:
      "Pokud dluh neuhradíte, exekutor vydá exekuční příkaz. Na nemovitost je uvaleno exekutorské zástavní právo a zákaz nakládání. Prodej je stále možný se souhlasem exekutora.",
    urgency: "medium",
  },
  {
    phase: "3",
    title: "Mobiliární exekuce",
    timeframe: "Týdny až měsíce",
    description:
      "Exekutor může zabavit movitý majetek, srážet ze mzdy nebo zablokovat účty. Situace se komplikuje, ale nemovitost zatím nebyla prodána. Stále je čas jednat.",
    urgency: "high",
  },
  {
    phase: "4",
    title: "Nařízení prodeje nemovitosti",
    timeframe: "Poslední šance",
    description:
      "Exekutor nařídí prodej nemovitosti. Začíná příprava dražby — znalecký posudek, určení nejnižšího podání. Dobrovolný výkup je stále možný, ale čas se krátí.",
    urgency: "high",
  },
  {
    phase: "5",
    title: "Nucená dražba",
    timeframe: "Konečná",
    description:
      "Nemovitost jde do dražby. Prodejní cena bývá 50–70 % tržní hodnoty. Po odečtení nákladů dražby a pohledávek vám většinou nezbude téměř nic. Tomuto je třeba předejít.",
    urgency: "critical",
  },
] as const;

const URGENCY_COLORS: Record<string, string> = {
  low: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  high: "bg-orange-100 text-orange-800 border-orange-300",
  critical: "bg-red-100 text-red-800 border-red-300",
};

const URGENCY_BAR_COLORS: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export default async function VykupPriExekuciPage(): Promise<React.ReactElement> {
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Výkup nemovitosti při exekuci — kompletní průvodce",
    description:
      "Vše co potřebujete vědět o prodeji nemovitosti v exekuci. Timeline exekučního řízení, porovnání výkup vs dražba, reálné případy.",
    datePublished: "2025-01-15",
    dateModified: "2025-03-01",
    author: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vykoupim-nemovitost.cz/vykup-pri-exekuci",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      {/* Hero section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                { label: "Výkup při exekuci", href: "/vykup-pri-exekuci" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti při exekuci
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Exekuce na nemovitost je jedna z nejtěžších životních situací. Hrozí
            vám nucená dražba, ztráta domova a minimální výtěžek z prodeje.
            Existuje ale lepší cesta — dobrovolný výkup nemovitosti, který vám
            zajistí férovou cenu, rychlé vyřešení dluhů a důstojný nový začátek.
          </p>
          <p className="mt-4 text-slate-600">
            Mnoho majitelů neví, že nemovitost zatíženou exekucí lze legálně
            prodat i bez dražby. Klíčem je včasné jednání a spolupráce s
            exekutorským úřadem. Přesně to za vás vyřešíme — od prvního kontaktu
            až po vyplacení peněz.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od nucené dražby, kde nemovitost často odejde za 50–70 %
            tržní hodnoty, vám nabídneme férovou cenu odpovídající 80–90 % tržní
            hodnoty. Exekuční pohledávky uhradíme přímo z kupní ceny, takže se
            zbavíte všech dluhů jedním krokem. Celý proces probíhá diskrétně —
            vaši sousedé ani okolí se o prodeji nedozví.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <Link
              href="tel:+420777123456"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Phone className="h-4 w-4" />
              Zavolat ihned
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Výplata do 7 dnů
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> 100% diskrétní
            jednání
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      {/* Urgency block: Kolik času vám zbývá */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-slate-900">
              Kolik času vám zbývá?
            </h2>
          </div>
          <p className="mb-8 text-slate-600">
            Exekuční řízení má jasné fáze. Čím dříve začnete jednat, tím více
            peněz a možností vám zbývá. Podívejte se, kde se nacházíte.
          </p>

          <div className="space-y-4">
            {EXEKUCE_TIMELINE.map((phase) => (
              <div
                key={phase.phase}
                className={`rounded-xl border-l-4 bg-white p-5 shadow-sm ${URGENCY_COLORS[
                  phase.urgency
                ]
                  .split(" ")
                  .map((c) => (c.startsWith("border") ? c : ""))
                  .join(" ")} border border-slate-100`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${URGENCY_COLORS[phase.urgency]}`}
                  >
                    Fáze {phase.phase}
                  </span>
                  <h3 className="font-semibold text-slate-900">
                    {phase.title}
                  </h3>
                  <span className="text-sm text-slate-500">
                    ({phase.timeframe})
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {phase.description}
                </p>
                <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
                  <div
                    className={`h-1.5 rounded-full ${URGENCY_BAR_COLORS[phase.urgency]}`}
                    style={{
                      width: `${Number(phase.phase) * 20}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-orange-50 p-6 text-center">
            <p className="text-lg font-semibold text-orange-800">
              ⏰ Neotálejte — každý den čekání snižuje vaše možnosti
            </p>
            <p className="mt-2 text-sm text-orange-700">
              V jakékoliv fázi exekuce vám můžeme pomoci. Čím dříve nás
              kontaktujete, tím lepší podmínky pro vás dokážeme vyjednat.
            </p>
            <div className="mt-4">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500"
              >
                Chci řešit svou situaci
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jak vám pomůžeme */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak vám pomůžeme
          </h2>
          <p className="mt-2 text-slate-600">
            Celý proces zvládneme za vás — od prvního kontaktu po vyplacení
            peněz. Vy se nemusíte o nic starat.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <step.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Reálné příběhy našich klientů
          </h2>
          <p className="mt-2 text-slate-600">
            Podívejte se, jak jsme pomohli lidem v podobné situaci zachránit
            maximum z hodnoty jejich nemovitosti.
          </p>

          <div className="mt-8 space-y-6">
            {/* Case study 1 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Pan Novák z Prahy
                  </h3>
                  <p className="text-sm text-slate-500">
                    Byt 3+kk, exekuce za 1,2 mil. Kč
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-800">Situace:</strong> Pan Novák
                  se dostal do finančních problémů po ztrátě zaměstnání. Na jeho
                  byt 3+kk v Praze 9 bylo uvaleno několik exekucí v celkové výši
                  1,2 mil. Kč. Exekutor již nařídil prodej nemovitosti a dražba
                  byla naplánována za 6 týdnů.
                </p>
                <p>
                  <strong className="text-slate-800">Řešení:</strong> Do 48
                  hodin od prvního kontaktu jsme provedli ocenění bytu a předali
                  nabídku. Tržní hodnota bytu činila 4,8 mil. Kč. Nabídli jsme
                  výkupní cenu 4,1 mil. Kč (85 % tržní hodnoty). Dohodli jsme se
                  s exekutorem na úhradě všech pohledávek z kupní ceny.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-white p-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Výkup</p>
                    <p className="text-xl font-bold text-emerald-600">
                      + 2,9 mil. Kč
                    </p>
                    <p className="text-xs text-slate-500">
                      vyplaceno klientovi
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Dražba (odhad)</p>
                    <p className="text-xl font-bold text-red-600">
                      + 1,1 mil. Kč
                    </p>
                    <p className="text-xs text-slate-500">
                      odhadovaný zbytek po dražbě
                    </p>
                  </div>
                </div>
                <p className="mt-2 font-semibold text-emerald-700">
                  ✅ Pan Novák díky výkupu získal o 1,8 mil. Kč více než by
                  dostal z dražby. Dluhy byly kompletně splaceny.
                </p>
              </div>
            </div>

            {/* Case study 2 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Paní Svobodová z Brna
                  </h3>
                  <p className="text-sm text-slate-500">
                    Rodinný dům, 3 exekuce, celkem 2,5 mil. Kč
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <strong className="text-slate-800">Situace:</strong> Paní
                  Svobodová zdědila rodinný dům po rodičích, ale spolu s ním i
                  neočekávané dluhy. Na nemovitosti vázly 3 exekuce od různých
                  exekutorů v celkové výši 2,5 mil. Kč. Mobiliární exekuce již
                  proběhla a hrozilo nařízení prodeje nemovitosti.
                </p>
                <p>
                  <strong className="text-slate-800">Řešení:</strong> Naši
                  právníci koordinovali jednání se všemi třemi exekutory
                  současně. Tržní hodnota domu byla odhadnuta na 5,5 mil. Kč.
                  Nabídli jsme výkupní cenu 4,7 mil. Kč (85 % tržní hodnoty). Z
                  kupní ceny byly uhrazeny všechny tři exekuce najednou.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-white p-4">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Výkup</p>
                    <p className="text-xl font-bold text-emerald-600">
                      + 2,2 mil. Kč
                    </p>
                    <p className="text-xs text-slate-500">vyplaceno klientce</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Dražba (odhad)</p>
                    <p className="text-xl font-bold text-red-600">
                      + 400 tis. Kč
                    </p>
                    <p className="text-xs text-slate-500">
                      odhadovaný zbytek po dražbě
                    </p>
                  </div>
                </div>
                <p className="mt-2 font-semibold text-emerald-700">
                  ✅ Paní Svobodová získala o 1,8 mil. Kč více a navíc využila
                  zpětný nájem — v domě bydlí dodnes.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Chci podobný výsledek
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison: Výkup vs Dražba */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-2 flex items-center gap-2">
            <Scale className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">
              Co získáte výkupem vs co ztratíte dražbou
            </h2>
          </div>
          <p className="mb-8 text-slate-600">
            Srovnání dobrovolného výkupu a nucené dražby na příkladu nemovitosti
            v hodnotě 4 000 000 Kč.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full rounded-xl bg-white shadow-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
                    Kritérium
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-emerald-700">
                    ✅ Dobrovolný výkup
                  </th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-red-700">
                    ❌ Nucená dražba
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Prodejní cena
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700">
                    3 200 000 – 3 600 000 Kč
                    <br />
                    <span className="text-xs text-slate-500">
                      (80–90 % hodnoty)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-red-700">
                    2 000 000 – 2 800 000 Kč
                    <br />
                    <span className="text-xs text-slate-500">
                      (50–70 % hodnoty)
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Náklady prodeje
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700">
                    0 Kč
                    <br />
                    <span className="text-xs text-slate-500">
                      (vše hradíme my)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-red-700">
                    100 000 – 300 000 Kč
                    <br />
                    <span className="text-xs text-slate-500">
                      (náklady dražby, znalec)
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Doba trvání
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700">
                    7–30 dnů
                  </td>
                  <td className="px-4 py-3 text-center text-red-700">
                    3–12 měsíců
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Diskrétnost
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700">
                    100% diskrétní
                  </td>
                  <td className="px-4 py-3 text-center text-red-700">
                    Veřejná dražba
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Vliv na výsledek
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700">
                    Vy rozhodujete
                  </td>
                  <td className="px-4 py-3 text-center text-red-700">
                    Rozhoduje trh
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Zpětný nájem
                  </td>
                  <td className="px-4 py-3 text-center text-emerald-700">
                    Možný
                  </td>
                  <td className="px-4 py-3 text-center text-red-700">
                    Vyloučen
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    Zbytková výplata
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">
                    Až 2 400 000 Kč
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-red-700">
                    Často 0 – 500 000 Kč
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
            <TrendingDown className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
            <p className="text-sm text-emerald-800">
              <strong>Výpočet je orientační</strong> a závisí na konkrétní
              situaci. V průměru naši klienti získají o 40–60 % více než by
              dostali z nucené dražby. Kontaktujte nás pro přesnou kalkulaci
              vaší nemovitosti.
            </p>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="bg-emerald-600 py-12">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white">
            Nečekejte na dražbu — jednejte teď
          </h2>
          <p className="mt-2 text-emerald-100">
            Každý den, který přejdete nečinností, snižuje hodnotu vašeho
            majetku. Nezávazná konzultace je zdarma a trvá 15 minut.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50"
            >
              Získat nabídku zdarma
            </Link>
            <Link
              href="tel:+420777123456"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <Phone className="h-4 w-4" />
              Zavolat ihned
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed content */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak funguje prodej nemovitosti v exekuci
          </h2>
          <div className="mt-6 space-y-4 text-slate-600">
            <p>
              Prodej nemovitosti zatížené exekucí je specifický proces, který
              vyžaduje znalost exekučního práva a zkušenosti s jednáním s
              exekutorskými úřady. Na rozdíl od běžného prodeje je nutný souhlas
              exekutora, který musí schválit, že výtěžek z prodeje bude použit
              na úhradu pohledávek věřitelů.
            </p>
            <p>
              Celý proces začíná oceněním vaší nemovitosti. Náš znalec provede
              nezávislý odhad tržní hodnoty, na jehož základě vám předložíme
              cenovou nabídku. Nabídka je vždy nezávazná — máte plné právo ji
              odmítnout bez jakýchkoliv nákladů.
            </p>
            <p>
              Pokud nabídku přijmete, naši právníci převezmou komunikaci s
              exekutorem. Požádáme o souhlas s dobrovolným prodejem a předložíme
              plán úhrady pohledávek z kupní ceny. Exekutoři tento postup ve
              většině případů vítají, protože dobrovolný prodej přináší vyšší
              výtěžek než dražba.
            </p>
            <p>
              Po získání souhlasu exekutora připravíme kupní smlouvu a zajistíme
              úschovu kupní ceny u notáře nebo advokáta. Z úschovy jsou nejprve
              uhrazeny exekuční pohledávky a zbývající část je vyplacena přímo
              vám. Celý právní servis, znalecký posudek i poplatky za katastr
              hradíme na své náklady.
            </p>
            <p>
              Důležité je vědět, že dobrovolný prodej můžete uskutečnit v
              jakékoliv fázi exekučního řízení — od obdržení výzvy k plnění až
              po nařízení dražby. Čím dříve však začnete, tím více času na
              jednání máte a tím lepší podmínky je možné vyjednat.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu nemovitosti při exekuci
          </h2>
          <p className="mt-2 text-slate-600">
            Odpovědi na nejčastější otázky, které dostáváme od klientů v
            exekuci.
          </p>
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

      {/* Bottom CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Zbavte se exekuce ještě dnes
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Pomůžeme vám najít nejlepší řešení
              vaší situace. Jednáme diskrétně a rychle — první nabídku dostanete
              do 24 hodin.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
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
          <RelatedArticles articles={getRelatedArticles("vykup-pri-exekuci")} />
        </div>
      </section>

      <LeadMagnetCta />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
