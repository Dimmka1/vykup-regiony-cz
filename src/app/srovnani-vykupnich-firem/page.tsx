import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Banknote,
  Ban,
  Scale,
  ShieldCheck,
  Eye,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title:
    "Srovnání výkupních firem 2025 | Jak vybrat nejlepší výkupce nemovitosti",
  description:
    "Nezávislé srovnání výkupních firem v Česku. Porovnejte rychlost, zálohy, provize, právní servis a garance. Checklist jak poznat seriózní firmu.",
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/srovnani-vykupnich-firem",
  },
};

/* ── Data ──────────────────────────────────────────────────────── */

interface ComparisonRow {
  criterion: string;
  icon: React.ElementType;
  typA: string;
  typB: string;
  typC: string;
}

const COMPARISON: ComparisonRow[] = [
  {
    criterion: "Rychlost prodeje",
    icon: Clock,
    typA: "3–12 měsíců",
    typB: "5–14 dnů",
    typC: "1–6 měsíců",
  },
  {
    criterion: "Záloha při podpisu",
    icon: Banknote,
    typA: "Obvykle žádná",
    typB: "Až 500 000 Kč ihned",
    typC: "Žádná záloha",
  },
  {
    criterion: "Provize / poplatky",
    icon: Ban,
    typA: "3–5 % z kupní ceny",
    typB: "0 % — bez provize",
    typC: "5–15 % provize platformy",
  },
  {
    criterion: "Právní servis",
    icon: Scale,
    typA: "Částečně, doplatíte sami",
    typB: "Kompletní, zdarma",
    typC: "Na vaše náklady",
  },
  {
    criterion: "Transparentnost podmínek",
    icon: Eye,
    typA: "Středně — závisí na kanceláři",
    typB: "Vysoká — smlouva předem",
    typC: "Nízká — skryté poplatky",
  },
  {
    criterion: "Garance odkupu",
    icon: ShieldCheck,
    typA: "Žádná — závisí na kupci",
    typB: "Smluvní garance odkupu",
    typC: "Žádná — jen zprostředkování",
  },
];

const CHECKLIST = [
  "Firma nabízí bezplatnou a nezávaznou nabídku bez skrytých podmínek.",
  "Smlouvu si můžete prostudovat předem a konzultovat s vlastním právníkem.",
  "Výkupní cena je zafixovaná ve smlouvě — žádné dodatečné srážky.",
  "Firma poskytuje kompletní právní servis včetně převodu na katastru.",
  "Platba proběhne převodem na váš účet do jasně stanoveného termínu.",
  "Na webu najdete skutečné reference a kontaktní údaje včetně IČO.",
  "Firma nemá negativní záznamy v insolvenčním rejstříku ani u ČOI.",
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    question: "Jaký je rozdíl mezi výkupem a klasickým prodejem přes realitku?",
    answer:
      "Při klasickém prodeji přes realitní kancelář platíte provizi (3–5 %) a čekáte na kupce i několik měsíců. Specializovaný výkupce nemovitost odkoupí přímo — bez provize, s garancí odkupu a platbou do několika dnů. Právní servis bývá u výkupce součástí služby zdarma.",
  },
  {
    question: "Na co si dát pozor při výběru výkupní firmy?",
    answer:
      "Zkontrolujte, zda firma nabízí bezplatnou nezávaznou nabídku, zda smlouvu můžete konzultovat s vlastním právníkem, a zda výkupní cena je jasně zafixovaná. Ověřte reference, historii firmy v obchodním rejstříku a zda nemá záznamy u ČOI. Seriózní firma nikdy nepožaduje platbu předem od prodávajícího.",
  },
  {
    question: "Kolik procent tržní ceny dostanu při výkupu nemovitosti?",
    answer:
      "Specializovaní výkupci obvykle nabízejí 70–90 % tržní ceny v závislosti na stavu, lokalitě a právní situaci nemovitosti. Na rozdíl od klasického prodeje ale ušetříte provizi, právní náklady a měsíce čekání — po odečtení všech nákladů může být čistý výnos srovnatelný.",
  },
  {
    question:
      "Lze prodat nemovitost s exekucí nebo hypotékou přes výkupní firmu?",
    answer:
      "Ano, specializovaní výkupci se zaměřují právě na složité případy — exekuce, hypotéky, dědictví, spoluvlastnické podíly. Celý proces včetně vyřešení právní situace zajistí za vás. U velké realitní kanceláře nebo marketplace platformy takové případy obvykle řešit nebudou.",
  },
];

/* ── JSON-LD ───────────────────────────────────────────────────── */

const JSON_LD_ARTICLE = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Srovnání výkupních firem 2025 — Jak vybrat nejlepšího výkupce nemovitosti",
  description:
    "Nezávislé srovnání tří typů firem pro výkup nemovitostí v Česku. Porovnání rychlosti, záloh, provizí, právního servisu a garancí.",
  url: "https://vykoupim-nemovitost.cz/srovnani-vykupnich-firem",
  datePublished: "2025-03-08",
  dateModified: "2025-03-08",
  author: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: "https://vykoupim-nemovitost.cz",
  },
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: "https://vykoupim-nemovitost.cz",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vykoupim-nemovitost.cz/srovnani-vykupnich-firem",
  },
};

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

/* ── Page Component ────────────────────────────────────────────── */

export default function SrovnaniVykupnichFiremPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_ARTICLE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_FAQ) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Breadcrumbs
            items={[
              {
                label: "Srovnání výkupních firem",
                href: "/srovnani-vykupnich-firem",
              },
            ]}
          />
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Srovnání výkupních firem v&nbsp;Česku
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-emerald-100">
            Prodej nemovitosti je jedno z nejdůležitějších finančních rozhodnutí
            v životě. Vyberte si firmu, která nabídne férové podmínky, rychlost
            a&nbsp;transparentnost. Porovnali jsme tři hlavní typy firem na
            českém trhu.
          </p>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Jak si vybrat správnou výkupní firmu
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-700">
            <p>
              Na českém trhu působí desítky firem, které nabízejí výkup
              nemovitostí. Liší se však zásadně v přístupu, rychlosti,
              podmínkách i kvalitě poskytovaných služeb. Než se rozhodnete, komu
              svou nemovitost svěříte, je důležité pochopit rozdíly mezi
              jednotlivými typy firem a vědět, na co si dát pozor.
            </p>
            <p>
              Obecně lze firmy zabývající se výkupem nemovitostí rozdělit do tří
              hlavních kategorií. Každá má své výhody i nevýhody — a právě
              jejich srovnání vám pomůže udělat informované rozhodnutí. Nezáleží
              jen na ceně, ale i na rychlosti, jistotě prodeje, právním servisu
              a celkové transparentnosti procesu.
            </p>
            <p>
              Pokud potřebujete prodat nemovitost rychle — například kvůli{" "}
              <Link
                href="/vykup-pri-exekuci"
                className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
              >
                exekuci
              </Link>
              ,{" "}
              <Link
                href="/vykup-pri-rozvodu"
                className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
              >
                rozvodu
              </Link>{" "}
              nebo{" "}
              <Link
                href="/vykup-pri-dedictvi"
                className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
              >
                dědictví
              </Link>{" "}
              — správný výběr firmy může znamenat rozdíl v řádu stovek tisíc
              korun a týdnů čekání.
            </p>
          </div>
        </div>
      </section>

      {/* Typy firem */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Tři typy firem na trhu
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-slate-600">
            Pochopte rozdíly mezi hlavními kategoriemi firem, abyste věděli, co
            od koho očekávat.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {/* Typ A */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <span className="text-xl font-bold">A</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Velká realitní kancelář
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Tradiční realitní kanceláře zprostředkovávají prodej mezi
                prodávajícím a kupujícím. Nabízejí širokou síť kontaktů a
                marketingové nástroje, ale celý proces trvá obvykle 3 až 12
                měsíců. Platíte provizi 3–5 % z kupní ceny a právní servis si
                většinou hradíte sami. Nemáte žádnou garanci, že se kupec najde
                — a pokud ano, může z obchodu kdykoliv odstoupit. Pro
                nemovitosti se složitou právní situací (exekuce, věcné břemeno)
                často realitky odmítají zakázku převzít.
              </p>
            </div>

            {/* Typ B */}
            <div className="rounded-2xl border-2 border-emerald-500 bg-white p-8 shadow-md ring-1 ring-emerald-500/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <span className="text-xl font-bold">B</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Specializovaný výkupce
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Specializovaný výkupce nemovitost odkupuje přímo — na vlastní
                účet, bez zprostředkovatele. Celý proces trvá obvykle 5 až 14
                dnů. Neplatíte žádnou provizi, právní servis je součástí služby
                a výkupní cena je zafixovaná ve smlouvě. Zálohu až 500 000 Kč
                můžete obdržet ihned při podpisu. Tento typ firmy se
                specializuje i na složité případy — nemovitosti s exekucí,
                hypotékou, spoluvlastnickým podílem nebo věcným břemenem.
                Garance odkupu je smluvně ošetřena.
              </p>
              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Nejrychlejší a nejjistější varianta
              </span>
            </div>

            {/* Typ C */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <span className="text-xl font-bold">C</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Marketplace / aukční platforma
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                Online platformy fungují jako tržiště, kde vaši nemovitost uvidí
                více potenciálních kupců najednou. Na první pohled to vypadá
                výhodně, ale realita bývá jiná. Provize platformy se pohybuje od
                5 do 15 %, právní servis si hradíte sami a nemáte žádnou garanci
                prodeje. Proces může trvat týdny i měsíce a skryté poplatky
                nejsou výjimkou. Pro nemovitosti se složitou situací tyto
                platformy nejsou vhodné.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Srovnávací tabulka */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Srovnávací tabulka
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-slate-600">
            Přehledné porovnání klíčových kritérií u všech tří typů firem.
          </p>

          {/* Desktop table */}
          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-slate-200 shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Kritérium
                  </th>
                  <th className="px-6 py-4 font-semibold text-blue-700">
                    Typ A: Velká RK
                  </th>
                  <th className="px-6 py-4 font-semibold text-emerald-700">
                    Typ B: Výkupce ✓
                  </th>
                  <th className="px-6 py-4 font-semibold text-orange-700">
                    Typ C: Marketplace
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <tr
                      key={row.criterion}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                    >
                      <td className="flex items-center gap-2 px-6 py-4 font-medium text-slate-800">
                        <Icon className="h-4 w-4 text-slate-400" />
                        {row.criterion}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{row.typA}</td>
                      <td className="px-6 py-4 font-medium text-emerald-700">
                        {row.typB}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{row.typC}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-10 space-y-6 md:hidden">
            {COMPARISON.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.criterion}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <Icon className="h-5 w-5 text-slate-400" />
                    {row.criterion}
                  </div>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-blue-600">Velká RK</dt>
                      <dd className="text-right text-slate-600">{row.typA}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="font-medium text-emerald-600">
                        Výkupce ✓
                      </dt>
                      <dd className="text-right font-medium text-emerald-700">
                        {row.typB}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-orange-600">Marketplace</dt>
                      <dd className="text-right text-slate-600">{row.typC}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Checklist */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Jak poznat seriózní výkupní firmu — checklist
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Než podepíšete cokoliv, projděte si těchto 7 bodů. Seriózní firma by
            měla splňovat všechny.
          </p>

          <div className="mt-8 space-y-4">
            {CHECKLIST.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-500" />
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-slate-800">
                Pozor na varovné signály
              </p>
              <p className="mt-1 text-slate-600">
                Firma požaduje platbu předem od prodávajícího, odmítá poskytnout
                smlouvu k nahlédnutí, tlačí na okamžitý podpis bez možnosti
                konzultace, nebo nemá ověřitelné reference. V takovém případě se
                obraťte jinam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Podrobný rozbor */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Podrobný rozbor jednotlivých kritérií
          </h2>

          <div className="mt-8 space-y-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Rychlost — klíčový faktor při naléhavém prodeji
              </h3>
              <p className="mt-3 leading-relaxed text-slate-700">
                Pokud potřebujete peníze rychle — kvůli splácení dluhů, exekuci,
                nebo financování nového bydlení — je rychlost prodeje zásadní.
                Velké realitní kanceláře pracují s klasickým modelem inzerce a
                prohlídek, což trvá měsíce. Marketplace platformy jsou o něco
                rychlejší, ale stále závisíte na tom, zda se najde kupec.
                Specializovaný výkupce má kapitál připravený a dokáže celý
                obchod uzavřít do dvou týdnů. Podrobněji o celém procesu si
                přečtěte na stránce{" "}
                <Link
                  href="/jak-to-funguje"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  jak to funguje
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Záloha — peníze ihned při podpisu
              </h3>
              <p className="mt-3 leading-relaxed text-slate-700">
                Jedním z největších benefitů specializovaného výkupce je možnost
                získat zálohu ihned při podpisu smlouvy. To je neocenitelné
                zejména v situacích, kdy potřebujete okamžitě řešit finanční
                závazky. Velká realitní kancelář zálohu neposkytuje — platba
                přijde až po dokončení celého prodeje. U marketplace platforem
                je situace podobná. Více o našich garancích najdete na stránce{" "}
                <Link
                  href="/garance-vykupu"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  garance výkupu
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Provize a skryté poplatky
              </h3>
              <p className="mt-3 leading-relaxed text-slate-700">
                Provize je často přehlížený, ale velmi podstatný faktor. U bytu
                za 3 miliony korun činí provize realitní kanceláře 90 000 až 150
                000 Kč. U marketplace platforem může být provize ještě vyšší — 5
                až 15 % v závislosti na podmínkách. Specializovaný výkupce
                pracuje bez provize — nabídnutá cena je přesně to, co dostanete
                na účet. Žádné skryté srážky, žádné dodatečné poplatky.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Právní servis — kdo ho zajistí a kdo zaplatí
              </h3>
              <p className="mt-3 leading-relaxed text-slate-700">
                Právní stránka prodeje nemovitosti je komplikovaná — kupní
                smlouva, návrh na vklad do katastru, úschova kupní ceny,
                případné řešení zástavních práv nebo exekucí. U velké realitní
                kanceláře si právníka většinou platíte sami. Marketplace
                platformy právní servis nenabízejí vůbec. Specializovaný výkupce
                má právní tým jako součást služby — vše je v ceně a nemusíte
                řešit nic navíc. To je obzvláště důležité u nemovitostí s{" "}
                <Link
                  href="/vykup-nemovitosti-s-vecnym-bremenem"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  věcným břemenem
                </Link>{" "}
                nebo{" "}
                <Link
                  href="/vykup-nemovitosti-s-hypotekou"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  hypotékou
                </Link>
                .
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-800">
                Transparentnost a garance
              </h3>
              <p className="mt-3 leading-relaxed text-slate-700">
                Transparentnost podmínek je základním předpokladem důvěry.
                Seriózní výkupní firma vám předloží smlouvu k prostudování s
                dostatečným předstihem, jasně vysvětlí všechny podmínky a nebude
                vás tlačit k podpisu. Garance odkupu znamená, že jakmile se
                dohodnete na ceně a podepíšete smlouvu, firma je smluvně
                zavázána nemovitost odkoupit. Tuto jistotu vám ani velká
                realitka, ani marketplace platforma nabídnout nemohou — vždy
                závisíte na třetí straně (kupci). Naše kompletní garance jsou
                popsány na stránce{" "}
                <Link
                  href="/garance-vykupu"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  garance výkupu
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[var(--theme-700)] to-[var(--theme-900)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">Porovnejte naši nabídku</h2>
          <p className="mt-3 text-lg text-emerald-100">
            Vyplňte nezávazný formulář a do 24 hodin vám zašleme konkrétní
            cenovou nabídku na výkup vaší nemovitosti. Bez provize, s garancí
            ceny a kompletním právním servisem zdarma.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
            >
              Chci nezávaznou nabídku
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-sm text-emerald-200">
            Nezávazně · Zdarma · Odpověď do 24 hodin
          </p>
        </div>
      </section>

      {/* Pro koho je výkup nejvhodnější */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Pro koho je přímý výkup nejvhodnější
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-700">
            <p>
              Přímý výkup nemovitosti není pro každého — ale pro řadu situací je
              jednoznačně nejlepší volbou. Pokud se nacházíte v jedné z
              následujících situací, specializovaný výkupce vám může ušetřit
              čas, peníze i nervy:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>
                <strong>Exekuce nebo insolvence</strong> — potřebujete rychle
                vyřešit dluhy a zabránit nucenému prodeji za zlomek ceny. Více
                na stránce{" "}
                <Link
                  href="/vykup-pri-exekuci"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  výkup při exekuci
                </Link>
                .
              </li>
              <li>
                <strong>Rozvod</strong> — potřebujete rychle rozdělit společný
                majetek a jít dál. Více na stránce{" "}
                <Link
                  href="/vykup-pri-rozvodu"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  výkup při rozvodu
                </Link>
                .
              </li>
              <li>
                <strong>Dědictví</strong> — zdědili jste nemovitost, kterou
                nechcete nebo nemůžete udržovat.
              </li>
              <li>
                <strong>Spoluvlastnický podíl</strong> — vlastníte jen část
                nemovitosti a potřebujete svůj podíl zpeněžit. Více na stránce{" "}
                <Link
                  href="/vykup-spoluvlastnickeho-podilu"
                  className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
                >
                  výkup spoluvlastnického podílu
                </Link>
                .
              </li>
              <li>
                <strong>Nemovitost s hypotékou</strong> — nemůžete dále splácet
                a potřebujete prodat i s nesplacenou hypotékou.
              </li>
              <li>
                <strong>Časová tíseň</strong> — stěhujete se, emigrujete nebo
                prostě potřebujete peníze co nejdříve.
              </li>
            </ul>
            <p>
              Ve všech těchto případech je klíčová rychlost, jistota a právní
              podpora — přesně to, co specializovaný výkupce nabízí. Podívejte
              se,{" "}
              <Link
                href="/proc-my"
                className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
              >
                proč si vybrat právě nás
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Časté dotazy ke srovnání výkupních firem
          </h2>

          <div className="mt-8 space-y-6">
            {FAQ.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-slate-200 bg-white shadow-sm"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="cursor-pointer px-6 py-5 text-lg font-semibold text-slate-800 transition hover:text-[var(--theme-700)]">
                  {item.question}
                </summary>
                <div className="border-t border-slate-100 px-6 py-5 leading-relaxed text-slate-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-8 text-center text-slate-600">
            Máte další otázky? Podívejte se na naši kompletní stránku{" "}
            <Link
              href="/caste-dotazy"
              className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
            >
              častých dotazů
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Závěr + CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Závěr — vyberte si s rozumem
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-700">
            <p>
              Výběr správné firmy pro prodej nemovitosti je rozhodnutí, které
              ovlivní vaše finance na roky dopředu. Nenechte se zlákat
              reklamními sliby — vždy si ověřte reference, prostudujte smlouvu a
              porovnejte podmínky. Seriózní firma vám dá čas na rozmyšlenou a
              nebude vás tlačit k ukvapeným rozhodnutím.
            </p>
            <p>
              Pokud hledáte rychlý, transparentní a bezpečný výkup nemovitosti
              bez provize a se zálohou ihned, ozvěte se nám. Rádi vám připravíme
              nezávaznou nabídku a zodpovíme všechny vaše otázky.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/#kontakt"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
            >
              Získejte nabídku zdarma
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
