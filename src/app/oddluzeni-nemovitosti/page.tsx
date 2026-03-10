import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Scale,
  FileText,
  Home,
  AlertTriangle,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { OddluzeniCalculator } from "@/components/oddluzeni-calculator";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/oddluzeni-nemovitosti",
  },
  title:
    "Oddlužení nemovitosti – Jak zachránit svůj majetek před dražbou | Výkup",
  description:
    "Oddlužení nemovitosti rychle a bez stresu. Vykoupíme nemovitost zatíženou dluhy, uhradíme závazky a vyplatíme vás do 48 hodin. Férová cena 80–90 % hodnoty.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Co je oddlužení nemovitosti a jak funguje?",
    answer:
      "Oddlužení nemovitosti je proces, při kterém se nemovitost zatížená dluhy, exekucemi nebo zástavními právy převede na nového vlastníka, který uhradí veškeré závazky. Tím se nemovitost vyčistí a původní majitel se zbaví dluhového břemene. Při výkupu se postaráme o komunikaci s věřiteli, exekutory i katastrálním úřadem.",
  },
  {
    question: "Mohu prodat nemovitost v insolvenci?",
    answer:
      "Ano, nemovitost v insolvenci je možné prodat, ale vyžaduje to souhlas insolvenčního správce. Naši právníci zajistí veškerou komunikaci s insolvenčním správcem a soudem, aby prodej proběhl v souladu se zákonem a za co nejlepších podmínek pro vás.",
  },
  {
    question: "Kolik dostanu za nemovitost při oddlužení?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty nemovitosti. Z kupní ceny uhradíme vaše dluhy (exekuce, hypotéku, zástavní práva) a zbývající částku vyplatíme přímo vám na účet do 48 hodin. Neplatíte žádné provize, poplatky za právní služby ani skryté náklady.",
  },
  {
    question: "Jak dlouho trvá oddlužení nemovitosti výkupem?",
    answer:
      "Celý proces výkupu při oddlužení trvá standardně 2–4 týdny. Od prvního kontaktu do 24 hodin obdržíte cenovou nabídku. Poté naši právníci zajistí komunikaci s věřiteli a přípravu smlouvy. Peníze máte na účtu nejpozději do 48 hodin od podpisu kupní smlouvy.",
  },
  {
    question: "Co se stane, když nemovitost půjde do nucené dražby?",
    answer:
      "Při nucené dražbě nemovitost často odejde výrazně pod tržní cenou — obvykle za 60–70 % hodnoty. K tomu se připočtou náklady dražby (15–20 %), odměna dražebníka a právní poplatky. Ve výsledku vám může zbýt výrazně méně než při přímém výkupu. Navíc celý proces trvá 6–12 měsíců a nemáte nad ním kontrolu.",
  },
  {
    question: "Jaké typy dluhů lze řešit výkupem nemovitosti?",
    answer:
      "Výkupem nemovitosti lze vyřešit prakticky jakýkoli typ dluhu váznoucího na nemovitosti — exekuce, zástavní práva bank, hypotéky, dluhy na daních z nemovitosti, pohledávky SVJ i soukromé půjčky zajištěné nemovitostí. Všechny závazky uhradíme přímo z kupní ceny.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const TIMELINE_STEPS: readonly Step[] = [
  {
    icon: FileText,
    title: "1. Bezplatná konzultace",
    description:
      "Vyplňte formulář nebo zavolejte. Do 24 hodin vám předložíme nezávaznou nabídku s konkrétní cenou.",
  },
  {
    icon: Scale,
    title: "2. Právní analýza",
    description:
      "Naši právníci prověří stav nemovitosti v katastru, zjistí všechna zatížení a navrhnou optimální řešení oddlužení.",
  },
  {
    icon: HandCoins,
    title: "3. Dohoda s věřiteli",
    description:
      "Komunikujeme s exekutory, bankami a dalšími věřiteli. Vyjednáme podmínky úhrady dluhů z kupní ceny.",
  },
  {
    icon: Shield,
    title: "4. Podpis kupní smlouvy",
    description:
      "Připravíme kupní smlouvu. Úschovu peněz zajistí advokátní kancelář nebo notář pro maximální bezpečnost.",
  },
  {
    icon: Clock,
    title: "5. Výplata do 48 hodin",
    description:
      "Po podpisu smlouvy uhradíme dluhy přímo věřitelům a zbytek vyplatíme na váš účet. Celý proces od nabídky po výplatu: 2–4 týdny.",
  },
] as const;

export default async function OddluzeniNemovitostiPage(): Promise<React.ReactElement> {
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
    headline: "Oddlužení nemovitosti – Jak zachránit svůj majetek před dražbou",
    description:
      "Kompletní průvodce oddlužením nemovitosti. Jak funguje výkup zadlužené nemovitosti, porovnání s nucenou dražbou a praktické kroky k řešení.",
    author: {
      "@type": "Organization",
      name: "Vykoupím nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "Vykoupím nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vykoupim-nemovitost.cz/oddluzeni-nemovitosti",
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
                {
                  label: "Oddlužení nemovitosti",
                  href: "/oddluzeni-nemovitosti",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Oddlužení nemovitosti — zachraňte svůj majetek před dražbou
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Máte nemovitost zatíženou dluhy, exekucemi nebo zástavními právy?
            Hrozí vám nucená dražba a ztráta domova? Nemusíte čekat, až situaci
            převezme exekutor. Existuje legální a rychlá cesta, jak nemovitost
            oddlužit, zbavit se závazků a získat férové peníze.
          </p>
          <p className="mt-4 text-slate-600">
            Oddlužení nemovitosti formou přímého výkupu je nejrychlejší způsob,
            jak vyřešit dluhovou situaci. Na rozdíl od nucené dražby, kde
            nemovitost často odejde hluboko pod cenou, vám nabídneme 80–90 %
            tržní hodnoty. Dluhy uhradíme přímo z kupní ceny — vy se zbavíte
            závazků jedním krokem a peníze máte na účtu do 48 hodin.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces probíhá diskrétně a profesionálně. O komunikaci s
            věřiteli, exekutory a katastrálním úřadem se postaráme my. Vy
            nemusíte řešit žádnou byrokracii ani právní složitosti — vše za vás
            vyřídí náš tým zkušených právníků a specialistů na výkup
            nemovitostí.
          </p>
          <div className="mt-8">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nezávaznou nabídku zdarma
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Peníze do 48 hodin
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> 100% diskrétní
            jednání
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            skrytých poplatků
          </span>
        </div>
      </section>

      {/* Co je oddluzeni */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Co je oddlužení nemovitosti a proč je důležité jednat rychle?
          </h2>
          <p className="mt-4 text-slate-600">
            Oddlužení nemovitosti je proces, při kterém se nemovitost zatížená
            dluhy, zástavními právy nebo exekucemi převádí na nového vlastníka,
            který uhradí veškeré závazky. Původní majitel se tak zbaví dluhového
            břemene a získá finanční prostředky na nový začátek.
          </p>
          <p className="mt-4 text-slate-600">
            V České republice se do problémů s dluhy na nemovitosti dostávají
            tisíce lidí ročně. Příčiny bývají různé — ztráta zaměstnání, rozvod,
            neočekávané zdravotní problémy nebo nezvládnuté splátky hypotéky.
            Jakmile se dluhy začnou hromadit a na nemovitost je nařízena
            exekuce, situace se rychle zhoršuje.
          </p>
          <p className="mt-4 text-slate-600">
            Klíčové je jednat co nejdříve. Čím déle čekáte, tím více narůstají
            úroky, penále a náklady na exekuční řízení. Pokud situaci vyřešíte
            včas přímým výkupem, můžete získat výrazně lepší podmínky, než jaké
            nabízí nucená dražba.
          </p>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-800">
                  Kdy je situace kritická?
                </h3>
                <ul className="mt-2 space-y-1 text-sm text-amber-700">
                  <li>• Exekutor nařídil dražbu nemovitosti</li>
                  <li>• Banka vypověděla hypoteční smlouvu</li>
                  <li>• Na nemovitosti je více exekucí najednou</li>
                  <li>• Dluh převyšuje vaše možnosti splácení</li>
                  <li>• Hrozí zahájení insolvenčního řízení</li>
                </ul>
                <p className="mt-2 text-sm font-medium text-amber-800">
                  V těchto případech kontaktujte naše specialisty co nejdříve —
                  každý den se počítá.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vyhody vykupu vs drazba */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Výkup vs. nucená dražba — proč je výkup vždy výhodnější?
          </h2>
          <p className="mt-4 text-slate-600">
            Když se majitel nemovitosti dostane do dluhové pasti, má v zásadě
            dvě možnosti: vyčkat na nucenou dražbu, nebo situaci aktivně vyřešit
            přímým výkupem. Rozdíly mezi oběma cestami jsou zásadní.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-200 bg-white p-6">
              <h3 className="font-semibold text-red-700">❌ Nucená dražba</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Nemovitost se prodá za 60–70 % hodnoty</li>
                <li>• Náklady dražby 15–20 % z výtěžku</li>
                <li>• Proces trvá 6–12 měsíců</li>
                <li>• Nemáte kontrolu nad výslednou cenou</li>
                <li>• Veřejná informace — sousedé se dozví</li>
                <li>• Stres a nejistota po celou dobu</li>
                <li>• Riziko, že dluh nebude plně uhrazen</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-6">
              <h3 className="font-semibold text-emerald-700">✅ Přímý výkup</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Férová cena 80–90 % tržní hodnoty</li>
                <li>• Žádné náklady na vaší straně</li>
                <li>• Peníze do 48 hodin od podpisu</li>
                <li>• Vy rozhodujete o podmínkách</li>
                <li>• 100% diskrétní — nikdo se nedozví</li>
                <li>• Jistota a klid od prvního dne</li>
                <li>• Dluhy uhradíme kompletně za vás</li>
              </ul>
            </div>
          </div>

          <p className="mt-6 text-slate-600">
            Přímý výkup nemovitosti při oddlužení je jednoznačně výhodnější
            varianta. Získáte vyšší cenu, peníze rychleji a celý proces máte pod
            kontrolou. Navíc odpadá stres z nejistoty, která doprovází dražební
            řízení.
          </p>
        </div>
      </section>

      {/* Kalkulacka */}
      <OddluzeniCalculator />

      {/* Timeline */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak probíhá oddlužení nemovitosti výkupem — krok za krokem
          </h2>
          <p className="mt-4 text-slate-600">
            Celý proces oddlužení nemovitosti přímým výkupem jsme navrhli tak,
            aby byl co nejjednodušší a nejrychlejší. O veškerou administrativu,
            právní záležitosti a komunikaci s věřiteli se postaráme za vás.
          </p>
          <div className="mt-8 grid gap-6">
            {TIMELINE_STEPS.map((step) => (
              <div
                key={step.title}
                className="flex gap-4 rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <step.icon className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Komu pomahame */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Komu pomáháme s oddlužením nemovitosti?
          </h2>
          <p className="mt-4 text-slate-600">
            Naše služby oddlužení nemovitosti výkupem využívají lidé v různých
            životních situacích. Každý případ řešíme individuálně a citlivě s
            respektem k vaší situaci.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Home className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Majitelé v exekuci
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Nemovitost zatížená jednou nebo více exekucemi. Pomůžeme uhradit
                pohledávky a zastavit exekuční řízení.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <Scale className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Osoby v insolvenci
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Prodej nemovitosti v rámci insolvenčního řízení se souhlasem
                insolvenčního správce za nejlepší možnou cenu.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <HandCoins className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Nesplacená hypotéka
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Banka vypověděla smlouvu nebo hrozí zesplatnění hypotéky.
                Vyřešíme situaci dříve, než dojde k dražbě.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <FileText className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Více věřitelů najednou
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Koordinujeme úhradu závazků vůči všem věřitelům z jedné kupní
                ceny. Jeden prodej vyřeší všechny dluhy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proc si vybrat nas */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Proč si vybrat nás pro oddlužení nemovitosti?
          </h2>
          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Zkušenosti s oddlužením
                </h3>
                <p className="text-sm text-slate-600">
                  Máme desítky úspěšně vyřešených případů oddlužení nemovitostí
                  po celé České republice. Každý případ řešíme individuálně.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-slate-900">Právní zázemí</h3>
                <p className="text-sm text-slate-600">
                  Spolupracujeme s advokátními kancelářemi specializovanými na
                  exekuční a insolvenční právo. Vše řešíme v souladu se zákonem.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Rychlost a diskrétnost
                </h3>
                <p className="text-sm text-slate-600">
                  Od prvního kontaktu po vyplacení peněz 2–4 týdny. Celý proces
                  probíhá diskrétně — vaši sousedé ani okolí se o prodeji
                  nedozví.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <HandCoins className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
              <div>
                <h3 className="font-semibold text-slate-900">
                  Férová cena bez skrytých poplatků
                </h3>
                <p className="text-sm text-slate-600">
                  Nabízíme 80–90 % tržní hodnoty. Neúčtujeme provize, poplatky
                  za odhad ani právní služby. Veškeré náklady hradíme my.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-slate-600">
            Pokud potřebujete poradit nebo se chcete dozvědět více o možnostech
            oddlužení vaší nemovitosti, neváhejte nás kontaktovat. Konzultace je
            zcela zdarma a nezávazná. Podívejte se také na naše další služby:{" "}
            <Link
              href="/vykup-pri-exekuci"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              výkup nemovitosti při exekuci
            </Link>
            ,{" "}
            <Link
              href="/garance-vykupu"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              garance výkupu
            </Link>
            ,{" "}
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              výkup nemovitosti s hypotékou
            </Link>{" "}
            a{" "}
            <Link
              href="/zpetny-najem"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              zpětný nájem
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Pravni aspekty oddluzeni */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Právní aspekty oddlužení nemovitosti v České republice
          </h2>
          <p className="mt-4 text-slate-600">
            Oddlužení nemovitosti je právně složitý proces, který vyžaduje
            znalost občanského zákoníku, exekučního řádu a insolvenčního zákona.
            Každý případ oddlužení nemovitosti je jedinečný a vyžaduje
            individuální přístup. Právě proto spolupracujeme s advokáty, kteří
            se specializují na exekuční a insolvenční právo.
          </p>
          <p className="mt-4 text-slate-600">
            Při výkupu nemovitosti v oddlužení je nezbytné důkladně prověřit
            všechna zástavní práva, exekuce a další zatížení evidovaná v
            katastru nemovitostí. Naši právníci kontrolují stav na katastrálním
            úřadě, komunikují s exekutory a věřiteli a připravují kupní smlouvu
            tak, aby vám garantovala maximální právní ochranu.
          </p>
          <p className="mt-4 text-slate-600">
            Podle českého práva je možné prodat nemovitost zatíženou exekucí se
            souhlasem exekutora. V případě insolvence je nutný souhlas
            insolvenčního správce a schválení soudem. V obou případech zajistíme
            veškerou dokumentaci a komunikaci, abyste se nemuseli o nic starat.
            Finanční prostředky z prodeje jsou vždy uloženy v advokátní úschově,
            což zaručuje bezpečnost transakce pro všechny strany.
          </p>
          <p className="mt-4 text-slate-600">
            Důležité je také vědět, že při přímém výkupu nemovitosti v oddlužení
            máte jako prodejce právo na férovou cenu odpovídající tržní hodnotě.
            Naše nabídky vycházejí z profesionálního odhadu ceny nemovitosti a
            zohledňují aktuální tržní podmínky v dané lokalitě.
          </p>
        </div>
      </section>

      {/* Nejcastejsi situace */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Nejčastější situace, kdy lidé řeší oddlužení nemovitosti
          </h2>
          <p className="mt-4 text-slate-600">
            Za naši praxi jsme se setkali s řadou situací, kdy majitelé
            nemovitostí potřebovali rychlou pomoc s oddlužením. Zde jsou
            nejběžnější scénáře, se kterými nám klienti přicházejí.
          </p>
          <p className="mt-4 text-slate-600">
            <strong>Nesplácená hypotéka:</strong> Když přijdete o práci nebo se
            vám výrazně sníží příjem, splátky hypotéky se mohou stát neunosným
            břemenem. Banka začne účtovat úroky z prodlení a v krajním případě
            může smlouvu vypovědět. Výkupem nemovitosti uhradíte zbývající
            hypotéku a vyřešíte situaci dříve, než dojde k dražbě.
          </p>
          <p className="mt-4 text-slate-600">
            <strong>Kumulované exekuce:</strong> Někteří majitelé čelí situaci,
            kdy na nemovitosti vázne více exekucí od různých věřitelů. Každá
            další exekuce zvyšuje náklady a komplikuje situaci. Přímý výkup
            umožňuje uhradit všechny pohledávky najednou z jedné kupní ceny.
          </p>
          <p className="mt-4 text-slate-600">
            <strong>Rozvod a společný majetek:</strong> Při rozvodu často
            dochází k situaci, kdy jeden z manželů nemůže vyplatit druhého a
            nemovitost je zároveň zatížena dluhy. Výkup nemovitosti umožní
            rychlé vypořádání majetku a uhrazení závazků.
          </p>
          <p className="mt-4 text-slate-600">
            <strong>Dědicté dluhy:</strong> Zdědit nemovitost zatíženou dluhy je
            častější než si myslíte. Dědicové se neznačké někdy o dluzích
            dozvědí až po převzetí nemovitosti. Výkupem můžete situaci rychle
            vyřešit a zbavit se zděděných závazků.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k oddlužení nemovitosti
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-slate-900 marker:[content:\'\'] [&::-webkit-details-marker]:hidden">
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

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Oddlužte svou nemovitost ještě dnes
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Posoudíme vaši situaci a navrhneme
              nejlepší řešení. Volejte nebo vyplňte formulář.
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

      {/* Related articles */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles
            articles={getRelatedArticles("oddluzeni-nemovitosti")}
          />
        </div>
      </section>

      <LeadMagnetCta />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
