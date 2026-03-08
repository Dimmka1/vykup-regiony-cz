import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Banknote,
  ShieldCheck,
  Star,
  ArrowRight,
  HelpCircle,
  Users,
  TrendingUp,
  FileText,
  Eye,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqAccordion } from "@/components/faq-accordion";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";

export const metadata: Metadata = {
  title: "Výkup nemovitostí – zkušenosti, recenze a na co si dát pozor | 2026",
  description:
    "Přečtěte si reálné zkušenosti s výkupem nemovitostí v Česku. Recenze klientů, porovnání výkupu vs realitka vs dražba, red flags a tipy na co si dát pozor.",
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/zkusenosti-s-vykupem",
  },
  openGraph: {
    title:
      "Výkup nemovitostí – zkušenosti, recenze a na co si dát pozor | 2026",
    description:
      "Reálné zkušenosti s výkupem nemovitostí v Česku. Recenze klientů, porovnání variant prodeje a tipy jak vybrat spolehlivou výkupní firmu.",
    url: "https://vykoupim-nemovitost.cz/zkusenosti-s-vykupem",
    type: "article",
    locale: "cs_CZ",
  },
};

const TESTIMONIALS = [
  {
    name: "Jana M.",
    location: "Praha 4",
    situation: "Byt v exekuci",
    text: "Měla jsem byt zatížený exekucí a banka mi odmítla pomoci. Firma Vykoupím Nemovitost mi do 24 hodin poslala nabídku, která byla férová. Za 5 dní jsem měla peníze na účtu a mohla jsem splatit dluh. Celý proces proběhl naprosto hladce a bez stresu.",
    rating: 5,
  },
  {
    name: "Petr K.",
    location: "Brno-město",
    situation: "Dědictví — spoluvlastnický podíl",
    text: "Po smrti otce jsme se se sourozenci nemohli dohodnout na prodeji domu. Výkupní firma odkoupila můj spoluvlastnický podíl za férovou cenu. Právní servis zajistili kompletně, nemusel jsem řešit vůbec nic. Doporučuji každému, kdo řeší podobnou situaci.",
    rating: 5,
  },
  {
    name: "Marie S.",
    location: "Ostrava",
    situation: "Rozvod — rychlý prodej",
    text: "Při rozvodu jsme potřebovali rychle prodat společný byt. Realitka odhadla 6 měsíců čekání, výkupní firma nabídla vyřízení do 2 týdnů. Cena byla o něco nižší než tržní, ale rychlost a jistota to plně kompenzovaly. Ušetřili jsme nervy i čas.",
    rating: 5,
  },
  {
    name: "Tomáš V.",
    location: "Plzeň",
    situation: "Prodej domu s hypotékou",
    text: "Potřeboval jsem prodat dům zatížený hypotékou kvůli stěhování do zahraničí. Firma vyřídila komunikaci s bankou, předčasné splacení hypotéky i veškeré papírování. Zálohu jsem dostal ihned při podpisu, zbytek do 48 hodin. Profesionální přístup od A do Z.",
    rating: 5,
  },
  {
    name: "Lenka D.",
    location: "Liberec",
    situation: "Zpětný nájem",
    text: "Potřebovala jsem rychle peníze, ale nechtěla jsem se stěhovat. Firma mi nabídla výkup se zpětným nájmem — prodala jsem byt, dostala peníze a dál v něm bydlím jako nájemnice. Ideální řešení pro moji situaci.",
    rating: 5,
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "Je výkup nemovitosti bezpečný?",
    answer:
      "Ano, pokud si vyberete seriózní firmu. Klíčové je ověřit, zda firma používá advokátní úschovu kupní ceny, má transparentní smluvní podmínky a nezatajuje žádné poplatky. Seriózní výkupní firma vám vždy dá dostatek času na prostudování smlouvy a doporučí vám konzultaci s vlastním právníkem.",
  },
  {
    question: "Kolik procent z tržní ceny dostanu při výkupu?",
    answer:
      "Výkupní cena se obvykle pohybuje mezi 70–90 % tržní hodnoty nemovitosti. Přesná částka závisí na typu nemovitosti, jejím stavu, lokalitě a rychlosti transakce. Na rozdíl od prodeje přes realitku však neplatíte žádnou provizi (typicky 3–5 %) ani poplatky za právní servis, takže reálný rozdíl je menší, než se zdá.",
  },
  {
    question: "Jak dlouho trvá celý proces výkupu?",
    answer:
      "Standardní výkup trvá 7–14 dní od prvního kontaktu po vyplacení peněz. V urgentních případech (exekuce, rozvod) dokážeme celý proces zvládnout i do 48 hodin. Pro srovnání: prodej přes realitní kancelář trvá průměrně 3–6 měsíců a dražba 6–18 měsíců.",
  },
  {
    question: "Mohu prodat nemovitost s exekucí nebo hypotékou?",
    answer:
      "Ano, výkupní firmy běžně řeší nemovitosti zatížené exekucí, hypotékou, věcným břemenem nebo zástavním právem. Seriózní firma zajistí komunikaci s exekutorem či bankou a vypořádání závazků z kupní ceny. Vše proběhne v rámci jedné transakce, nemusíte nic řešit předem.",
  },
  {
    question: "Jaké dokumenty potřebuji k výkupu nemovitosti?",
    answer:
      "Pro zahájení procesu stačí občanský průkaz a základní informace o nemovitosti. Následně je potřeba list vlastnictví (zajistíme za vás), případně dokumenty k zástavám nebo exekucím. Veškeré právní dokumenty a kupní smlouvu připravíme na naše náklady.",
  },
  {
    question: "Co je zpětný nájem a kdy se vyplatí?",
    answer:
      "Zpětný nájem znamená, že nemovitost prodáte, získáte peníze, ale dál v ní bydlíte jako nájemník. Vyplatí se lidem, kteří potřebují rychle hotovost (například na splacení dluhů), ale nechtějí se stěhovat. Nájemné je stanoveno dohodou a obvykle je nižší než tržní.",
  },
  {
    question: "Jak poznám seriózní výkupní firmu od podvodníků?",
    answer:
      "Seriózní firma má transparentní webové stránky s IČO a kontaktními údaji, používá advokátní úschovu, nepožaduje žádné poplatky předem, dává vám čas na rozmyšlenou a doporučí konzultaci s nezávislým právníkem. Naopak varujte se firem, které tlačí na okamžitý podpis, nabízejí nereálně vysokou cenu nebo odmítají advokátní úschovu.",
  },
];

const RED_FLAGS = [
  {
    title: "Tlak na okamžitý podpis",
    description:
      "Seriózní firma vám vždy dá čas na rozmyšlenou. Pokud vás někdo tlačí k podpisu hned teď, jinak nabídka propadne, je to varovný signál.",
    Icon: Clock,
  },
  {
    title: "Žádné IČO nebo sídlo firmy",
    description:
      "Ověřte si firmu v obchodním rejstříku. Pokud nemá IČO, sídlo nebo kontaktní údaje, raději se obraťte jinam.",
    Icon: Eye,
  },
  {
    title: "Poplatky předem",
    description:
      "Seriózní výkupní firma nikdy nepožaduje žádné poplatky předem — ani za ohodnocení, ani za právní servis. Vše je zahrnuto v ceně výkupu.",
    Icon: Banknote,
  },
  {
    title: "Odmítnutí advokátní úschovy",
    description:
      "Advokátní úschova kupní ceny chrání obě strany. Pokud firma trvá na přímé platbě bez úschovy, jde o zásadní red flag.",
    Icon: ShieldCheck,
  },
  {
    title: "Nereálně vysoká nabídka",
    description:
      "Pokud vám někdo nabízí 100 % tržní ceny s vyplacením do 24 hodin, buďte opatrní. Reálná výkupní cena je 70–90 % a na tom není nic špatného.",
    Icon: TrendingUp,
  },
  {
    title: "Nejasná smlouva",
    description:
      "Smlouva musí být jasná, srozumitelná a bez skrytých ujednání. Pokud nerozumíte nějakému bodu, trvejte na vysvětlení nebo si nechte smlouvu zkontrolovat právníkem.",
    Icon: FileText,
  },
];

const COMPARISON_DATA = [
  {
    criterion: "Rychlost prodeje",
    vykup: "7–14 dní",
    realitka: "3–6 měsíců",
    drazba: "6–18 měsíců",
  },
  {
    criterion: "Výsledná cena",
    vykup: "70–90 % tržní hodnoty",
    realitka: "90–100 % (minus provize)",
    drazba: "Nepředvídatelná",
  },
  {
    criterion: "Provize / poplatky",
    vykup: "0 Kč",
    realitka: "3–5 % z ceny",
    drazba: "Poplatky dražebníkovi",
  },
  {
    criterion: "Právní servis",
    vykup: "Zdarma — zajistí firma",
    realitka: "Na vaše náklady",
    drazba: "Na vaše náklady",
  },
  {
    criterion: "Jistota prodeje",
    vykup: "Garantovaná smlouvou",
    realitka: "Závisí na trhu a kupci",
    drazba: "Závisí na zájemcích",
  },
  {
    criterion: "Diskrétnost",
    vykup: "Plná diskrétnost",
    realitka: "Veřejná inzerce",
    drazba: "Veřejná dražba",
  },
  {
    criterion: "Řešení dluhů / exekucí",
    vykup: "Ano — z kupní ceny",
    realitka: "Ne — musíte řešit sami",
    drazba: "Částečně",
  },
];

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Kontaktujte nás",
    description:
      "Vyplňte krátký formulář nebo zavolejte. Potřebujeme jen základní údaje o nemovitosti — adresu, typ a váš kontakt. Trvá to maximálně 2 minuty a je to zcela nezávazné.",
  },
  {
    number: 2,
    title: "Ohodnocení nemovitosti zdarma",
    description:
      "Náš odborník provede nezávislé ocenění vaší nemovitosti na základě aktuálních tržních dat, lokality a stavu. Ohodnocení je zdarma a nezávazné — nedlužíte nám nic, i když se rozhodnete neprodávat.",
  },
  {
    number: 3,
    title: "Nabídka do 24 hodin",
    description:
      "Na základě ohodnocení vám připravíme konkrétní cenovou nabídku. Žádné skryté poplatky, žádná provize. Nabídka je zcela nezávazná a máte dostatek času na rozmyšlenou.",
  },
  {
    number: 4,
    title: "Podpis smlouvy a záloha",
    description:
      "Pokud nabídku přijmete, připravíme kupní smlouvu s advokátní úschovou. Při podpisu obdržíte zálohu. Veškerý právní servis zajistíme na naše náklady.",
  },
  {
    number: 5,
    title: "Vyplacení do 48 hodin",
    description:
      "Po podpisu smlouvy obdržíte zbývající částku na váš účet. Celý proces je rychlý, transparentní a bez stresu. O vklad do katastru se postaráme za vás.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Výkup nemovitostí – zkušenosti, recenze a na co si dát pozor",
  description:
    "Kompletní průvodce výkupem nemovitostí v Česku. Reálné zkušenosti klientů, porovnání s realitkou a dražbou, red flags a tipy.",
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
  datePublished: "2026-03-08",
  dateModified: "2026-03-08",
  mainEntityOfPage: "https://vykoupim-nemovitost.cz/zkusenosti-s-vykupem",
  inLanguage: "cs",
  url: "https://vykoupim-nemovitost.cz/zkusenosti-s-vykupem",
};

export default function ZkusenstiSVykupemPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(ARTICLE_JSON_LD) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Breadcrumbs
            items={[
              { label: "Zkušenosti s výkupem", href: "/zkusenosti-s-vykupem" },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Výkup nemovitostí — zkušenosti, recenze a&nbsp;na&nbsp;co si dát
            pozor
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
            Plánujete prodat nemovitost přes výkupní firmu? Přečtěte si reálné
            zkušenosti klientů, zjistěte jak poznat seriózní firmu od neseriózní
            a porovnejte výkup s dalšími variantami prodeje. Tento průvodce vám
            pomůže udělat informované rozhodnutí.
          </p>
        </div>
      </section>

      {/* Jak vybrat výkupní firmu */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Jak vybrat výkupní firmu — na co si dát pozor
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              Výkup nemovitosti je závažné finanční rozhodnutí, které může
              zásadně ovlivnit váš život. Proto je klíčové vybrat si spolehlivou
              a transparentní firmu. Na českém trhu působí desítky výkupních
              firem, ale ne všechny pracují férově. Zde je návod, jak se
              zorientovat a vybrat tu správnou.
            </p>
            <p>
              <strong>Ověřte si firmu v obchodním rejstříku.</strong> Každá
              seriózní výkupní firma musí mít platné IČO, sídlo a kontaktní
              údaje. Podívejte se na výpis z obchodního rejstříku — zjistíte,
              jak dlouho firma existuje, kdo jsou jednatelé a jaký je její
              základní kapitál. Firmy s historií delší než 5 let a čistým
              rejstříkem jsou obecně spolehlivější.
            </p>
            <p>
              <strong>Hledejte recenze a reference.</strong> Skutečné recenze od
              klientů jsou nejcennějším zdrojem informací. Prohlédněte si Google
              recenze, Firmy.cz a další portály. Pozor na firmy, které mají
              pouze 5hvězdičkové recenze bez konkrétního obsahu — to může být
              podezřelé. Naopak firmy s detailními recenzemi popisujícími
              konkrétní situace jsou věrohodnější.
            </p>
            <p>
              <strong>Porovnejte nabídky od více firem.</strong> Nikdy se
              nerozhodujte na základě jedné nabídky. Oslovte minimálně 2–3
              výkupní firmy a porovnejte nejen nabízenou cenu, ale i podmínky —
              rychlost vyplacení, zajištění právního servisu, způsob úschovy
              kupní ceny a celkový přístup. Seriózní firma vám ochotně zodpoví
              všechny otázky a nebude vás tlačit k rychlému rozhodnutí.
            </p>
            <p>
              <strong>Ptejte se na advokátní úschovu.</strong> Advokátní úschova
              kupní ceny je standardem, který chrání obě strany transakce.
              Peníze jsou uloženy na účtu advokáta a uvolněny až po zápisu změny
              vlastníka do katastru nemovitostí. Pokud firma odmítá advokátní
              úschovu nebo nabízí pouze svůj vlastní účet, buďte maximálně
              opatrní.
            </p>
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              <AlertTriangle className="mr-2 inline-block h-7 w-7 text-amber-500" />
              Red flags — varovné signály při výkupu nemovitostí
            </h2>
            <p className="mt-3 text-slate-600">
              Těmto signálům věnujte zvýšenou pozornost. Pokud narazíte na
              některý z nich, raději firmu obejděte.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RED_FLAGS.map((flag) => (
              <div
                key={flag.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                    <flag.Icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{flag.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {flag.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Náš proces krok za krokem */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Náš proces krok za krokem
          </h2>
          <p className="mt-3 text-center text-slate-600">
            Transparentní postup od prvního kontaktu po vyplacení peněz. Žádná
            překvapení, žádné skryté poplatky.
          </p>
          <ol className="relative mt-10 space-y-8 border-l-2 border-[var(--theme-200)] pl-8">
            {PROCESS_STEPS.map((step) => (
              <li key={step.number} className="relative">
                <span className="absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-700)] text-sm font-bold text-white">
                  {step.number}
                </span>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Porovnání: výkup vs realitka vs dražba */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Porovnání: výkup vs realitka vs dražba
          </h2>
          <p className="mb-10 text-center text-slate-600">
            Každá varianta prodeje nemovitosti má své výhody i nevýhody.
            Porovnejte je a vyberte tu nejlepší pro vaši situaci.
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Kritérium
                  </th>
                  <th className="px-6 py-4 font-semibold text-[var(--theme-700)]">
                    Výkup nemovitosti
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Realitní kancelář
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Dražba
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, idx) => (
                  <tr
                    key={row.criterion}
                    className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {row.criterion}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--theme-700)]">
                      {row.vykup}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.realitka}</td>
                    <td className="px-6 py-4 text-slate-600">{row.drazba}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {COMPARISON_DATA.map((row) => (
              <div
                key={row.criterion}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="mb-3 font-semibold text-slate-900">
                  {row.criterion}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--theme-600)]" />
                    <span>
                      <strong className="text-[var(--theme-700)]">
                        Výkup:
                      </strong>{" "}
                      {row.vykup}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-slate-400">
                      •
                    </span>
                    <span>
                      <strong>Realitka:</strong> {row.realitka}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 h-4 w-4 shrink-0 text-slate-400">
                      •
                    </span>
                    <span>
                      <strong>Dražba:</strong> {row.drazba}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              <strong>Kdy je výkup nejlepší volba?</strong> Výkup nemovitosti je
              ideální pro lidi, kteří potřebují rychlé řešení — ať už kvůli
              exekuci, rozvodu, dědickému sporu nebo stěhování. Hlavní výhodou
              je rychlost (dny místo měsíců), jistota prodeje (garantovaná
              smlouva) a nulové náklady na vaší straně.
            </p>
            <p>
              <strong>Kdy zvážit realitní kancelář?</strong> Pokud nespěcháte a
              chcete maximální cenu, realitní kancelář může být správná volba.
              Počítejte ale s provizí 3–5 % a nejistotou — kupec se může kdykoli
              rozhodnout jinak a proces začíná znovu.
            </p>
            <p>
              <strong>A co dražba?</strong> Dražba je nejpomalejší a nejméně
              předvídatelná varianta. Výsledná cena může být jak vyšší, tak
              nižší než tržní hodnota. Pro většinu lidí je dražba poslední
              volba, typicky v případě nucených prodejů.
            </p>
          </div>
        </div>
      </section>

      {/* Reálné zkušenosti klientů */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              <Users className="mr-2 inline-block h-7 w-7 text-[var(--theme-600)]" />
              Reálné zkušenosti našich klientů
            </h2>
            <p className="mt-3 text-slate-600">
              Přečtěte si, co říkají lidé, kteří s námi prošli procesem výkupu
              nemovitosti.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 flex gap-0.5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--theme-500)] to-[var(--theme-700)] text-xs font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {testimonial.location} · {testimonial.situation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Na co si dát pozor — shrnutí */}
      <section className="bg-[var(--theme-50)] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Na co si dát pozor — shrnutí pro rok 2026
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
            <p>
              Trh s výkupem nemovitostí v Česku v roce 2026 stále roste. S
              rostoucím počtem firem roste i konkurence, což je pro prodávající
              dobrá zpráva — firmy se předhánějí v nabídkách a kvalitě služeb.
              Zároveň se ale objevují i neseriózní hráči, kteří těží z
              neznalosti prodávajících.
            </p>
            <p>
              <strong>
                Vždy si ověřte firmu v obchodním rejstříku a na Google
                recenzích.
              </strong>{" "}
              Podívejte se, jak dlouho firma působí na trhu, kolik má
              zaměstnanců a jaký je celkový tón recenzí. Firmy s historií delší
              než 3 roky a desítkami pozitivních recenzí jsou obecně bezpečnější
              volbou.
            </p>
            <p>
              <strong>Nepodepisujte nic, čemu nerozumíte.</strong> Seriózní
              firma vám ochotně vysvětlí každý bod smlouvy a doporučí vám,
              abyste si smlouvu nechali zkontrolovat nezávislým právníkem. Pokud
              vás firma od konzultace s právníkem odrazuje, berte to jako
              varovný signál.
            </p>
            <p>
              <strong>Porovnávejte nabídky.</strong> Každá nemovitost je
              unikátní a různé firmy ji mohou ocenit různě. Oslovte minimálně
              2–3 firmy a porovnejte nejen cenu, ale i podmínky — rychlost,
              právní zajištění, způsob úschovy a celkový přístup. Cena není vše.
            </p>
            <p>
              <strong>Máte právo na advokátní úschovu.</strong> To je
              nepřekročitelné minimum. Peníze na účtu advokáta jsou chráněny
              zákonem a uvolněny až po zápisu nového vlastníka do katastru. Bez
              advokátní úschovy neprodávejte.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              <HelpCircle className="mr-2 inline-block h-7 w-7 text-[var(--theme-600)]" />
              Často kladené dotazy
            </h2>
            <p className="mt-3 text-slate-600">
              Odpovědi na nejčastější otázky o výkupu nemovitostí.
            </p>
          </div>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Chcete nezávaznou nabídku na výkup?
          </h2>
          <p className="mt-3 text-lg text-[var(--theme-100)]">
            Vyplňte formulář a do 24 hodin vám pošleme konkrétní cenovou
            nabídku. Bez poplatků, bez provize, bez závazků.
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
              href="/jak-to-funguje"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--theme-200)] transition hover:text-white"
            >
              Jak celý proces funguje →
            </Link>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            Mohlo by vás také zajímat
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/jak-to-funguje"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">
                Jak funguje výkup nemovitosti
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Celý proces v 5 krocích
              </p>
            </Link>
            <Link
              href="/proc-my"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">
                Proč prodat nemovitost nám
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Výkup vs realitka vs dražba
              </p>
            </Link>
            <Link
              href="/caste-dotazy"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">Časté dotazy</h3>
              <p className="mt-1 text-sm text-slate-500">
                Vše, co potřebujete vědět
              </p>
            </Link>
          </div>
        </div>
      </section>

      <LeadMagnetCta />
    </>
  );
}
