import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText, Lock } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { VzorLeadGateForm } from "@/components/vzor-lead-gate-form";

export const metadata: Metadata = {
  title: "Vzor smlouvy o výkupu nemovitosti — co obsahuje a na co si dát pozor",
  description:
    "Podívejte se na vzor kupní smlouvy při výkupu nemovitosti. Vysvětlujeme každý bod srozumitelně — od kupní ceny přes advokátní úschovu až po záruky prodávajícího.",
  keywords: [
    "vzor smlouvy výkup nemovitosti",
    "kupní smlouva výkup",
    "smlouva o výkupu nemovitosti",
    "vzor kupní smlouvy",
  ],
  alternates: { canonical: "https://vykoupim-nemovitost.cz/vzor-smlouvy" },
};

const SITE_URL = "https://vykoupim-nemovitost.cz";

const JSON_LD_ARTICLE = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Vzor smlouvy o výkupu nemovitosti — co obsahuje a na co si dát pozor",
  description:
    "Podívejte se na vzor kupní smlouvy při výkupu nemovitosti. Vysvětlujeme každý bod srozumitelně.",
  url: `${SITE_URL}/vzor-smlouvy`,
  datePublished: "2026-03-08",
  dateModified: "2026-03-09",
  author: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: SITE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/vzor-smlouvy`,
  },
};

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Je smlouva o výkupu nemovitosti bezpečná?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ano. Smlouvu připravuje nezávislý advokát, který dohlíží na celý proces. Peníze jsou uloženy v advokátní úschově a vyplaceny až po zápisu do katastru nemovitostí. Obě strany jsou tak maximálně chráněny.",
      },
    },
    {
      "@type": "Question",
      name: "Kdo platí poplatky spojené s převodem nemovitosti?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Veškeré poplatky spojené s převodem — včetně správního poplatku za vklad do katastru a odměny advokáta za přípravu smlouvy a úschovu — hradí výkupní společnost. Prodávající neplatí nic.",
      },
    },
    {
      "@type": "Question",
      name: "Jak probíhá advokátní úschova při výkupu nemovitosti?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kupující složí celou kupní cenu na úschovní účet advokáta ještě před podáním návrhu na vklad do katastru. Advokát peníze uvolní prodávajícímu až po úspěšném zápisu převodu vlastnického práva. Tím je zajištěno, že prodávající dostane zaplaceno a kupující získá nemovitost bez rizika.",
      },
    },
    {
      "@type": "Question",
      name: "Mohu si smlouvu nechat zkontrolovat vlastním právníkem?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Samozřejmě. Doporučujeme každému prodávajícímu, aby si smlouvu nechal nezávisle posoudit. Transparentnost je pro nás priorita — smlouvu posíláme s dostatečným předstihem, abyste měli čas na její prostudování.",
      },
    },
  ],
};

interface ContractSection {
  id: string;
  title: string;
  sample: string;
  explanation: string;
}

const CONTRACT_SECTIONS: ContractSection[] = [
  {
    id: "strany",
    title: "Článek I — Smluvní strany",
    sample:
      "Prodávající: Jan Novák, r.č. xxxxxx/xxxx, bytem ulice xxxxxxx xx, xxx xx Praha x\nKupující: VÝKUP NEMOVITOSTÍ s.r.o., IČO: xxxxxxxx, se sídlem ulice xxxxxxx xx, xxx xx Praha x, zapsaná v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka xxxxx",
    explanation:
      "V úvodu smlouvy se přesně identifikují obě strany — prodávající i kupující. Uvádí se jméno, rodné číslo (u fyzických osob), IČO (u firem), bydliště nebo sídlo. To zajišťuje, že je zcela jasné, kdo nemovitost prodává a kdo ji kupuje. Pokud prodává více vlastníků (např. manželé nebo spoluvlastníci), musí být uvedeni všichni.",
  },
  {
    id: "predmet",
    title: "Článek II — Předmět převodu",
    sample:
      "Prodávající je výlučným vlastníkem pozemku parc. č. xxxx/x o výměře xxx m², jehož součástí je stavba č.p. xxxx (rodinný dům), vše v k.ú. xxxxxxx, obec Praha, zapsané na LV č. xxxx u Katastrálního úřadu pro hlavní město Prahu, Katastrální pracoviště Praha.\n\nProdávající touto smlouvou převádí na kupujícího vlastnické právo k výše uvedeným nemovitým věcem a kupující tyto nemovité věci do svého vlastnictví přijímá.",
    explanation:
      "Tento článek jednoznačně vymezuje, o jakou nemovitost se jedná. Uvádí se parcelní číslo, číslo popisné, katastrální území a číslo listu vlastnictví (LV). Díky těmto údajům je nemovitost nezaměnitelně identifikována v katastru nemovitostí. Popis musí přesně odpovídat údajům na listu vlastnictví — jakákoliv odchylka může vést k zamítnutí návrhu na vklad.",
  },
  {
    id: "cena",
    title: "Článek III — Kupní cena a způsob úhrady",
    sample:
      "Smluvní strany se dohodly na kupní ceně ve výši x.xxx.xxx Kč (slovy: x milionů xxxxxxx xxxxx korun českých).\n\nKupní cena bude uhrazena následovně:\na) Záloha ve výši xxx.xxx Kč bude vyplacena prodávajícímu na jeho bankovní účet do 48 hodin od podpisu této smlouvy.\nb) Zbývající část kupní ceny ve výši x.xxx.xxx Kč bude složena do advokátní úschovy dle článku IV této smlouvy.",
    explanation:
      "Kupní cena je závazná a neměnná — to, co je ve smlouvě, přesně dostanete. Jasně se stanoví celková částka i způsob její úhrady. Typicky se část vyplácí jako záloha přímo prodávajícímu a zbytek je uložen v advokátní úschově. Důležité je, že při výkupu nemovitosti neplatíte žádnou provizi ani skryté poplatky — výkupní cena je čistá částka, kterou obdržíte.",
  },
  {
    id: "uschova",
    title: "Článek IV — Advokátní úschova",
    sample:
      "Smluvní strany se dohodly, že zbytková část kupní ceny bude uložena v advokátní úschově u JUDr. xxxxxxxxx xxxxxxxx, advokáta, ev. č. ČAK xxxxx, se sídlem ulice xxxxxxx xx, xxx xx Praha x.\n\nAdvokát složenou částku vyplatí prodávajícímu na jeho bankovní účet č. xxxxxxxxxxxx/xxxx do 5 pracovních dnů poté, co bude kupujícímu doručeno vyrozumění katastrálního úřadu o povolení vkladu vlastnického práva ve prospěch kupujícího.\n\nV případě, že katastrální úřad návrh na vklad zamítne nebo řízení zastaví, advokát vrátí složenou částku zpět kupujícímu.",
    explanation:
      "Advokátní úschova je klíčový bezpečnostní prvek celé transakce. Funguje jako nezávislý prostředník — kupující složí peníze k advokátovi, který je drží na svém úschovním účtu. Peníze se uvolní prodávajícímu až po zápisu nového vlastníka v katastru. Pokud by převod z jakéhokoliv důvodu nevyšel, peníze se vrací kupujícímu. Prodávající tak má jistotu, že peníze existují a jsou připraveny k vyplacení, a kupující ví, že nezaplatí, dokud nezíská nemovitost.",
  },
  {
    id: "zaruky",
    title: "Článek V — Záruky prodávajícího",
    sample:
      "Prodávající prohlašuje a zaručuje, že:\na) je výlučným vlastníkem převáděných nemovitých věcí a je oprávněn s nimi volně nakládat;\nb) na nemovitých věcech neváznou žádné dluhy, zástavní práva, věcná břemena ani jiné právní vady, s výjimkou těch, které jsou uvedeny v této smlouvě;\nc) nemovité věci nejsou předmětem žádného soudního, rozhodčího ani správního řízení;\nd) prodávající nezatajil žádné podstatné vady nemovitých věcí, které by mohly ovlivnit rozhodnutí kupujícího.",
    explanation:
      "Prodávající v tomto článku potvrzuje, že nemovitost je čistá — bez skrytých dluhů, zástavních práv nebo právních sporů. Tyto záruky chrání kupujícího, ale i prodávajícího, protože jasně definují výchozí stav. Pokud na nemovitosti vázne například hypotéka, musí to být výslovně uvedeno a smlouva popíše, jak se tato situace vyřeší (typicky splacením z kupní ceny).",
  },
  {
    id: "predani",
    title: "Článek VI — Termín předání nemovitosti",
    sample:
      "Prodávající se zavazuje předat kupujícímu nemovité věci ve lhůtě do xx dnů od vyplacení celé kupní ceny, nejpozději však do xx. xx. 2026.\n\nO předání nemovitých věcí bude sepsán předávací protokol, ve kterém smluvní strany zaznamenají stav měřidel energií (elektřina, plyn, voda), stav nemovitosti a seznam předávaných klíčů a dokumentů.",
    explanation:
      "Článek stanoví přesné datum, do kdy musí prodávající nemovitost vyklidit a fyzicky předat. Předání se dokumentuje předávacím protokolem, který zachycuje stavy měřidel (elektřina, plyn, voda) a stav nemovitosti. Protokol slouží jako důkaz pro případné reklamace a pro přepis energií na nového vlastníka. Obvykle se nemovitost předává do 14–30 dnů po vyplacení kupní ceny.",
  },
  {
    id: "zaverecna",
    title: "Článek VII — Závěrečná ustanovení",
    sample:
      "Tato smlouva nabývá platnosti a účinnosti dnem jejího podpisu oběma smluvními stranami. Vlastnické právo k nemovitým věcem přechází na kupujícího vkladem do katastru nemovitostí.\n\nNávrh na vklad vlastnického práva do katastru nemovitostí podá kupující, a to bez zbytečného odkladu po podpisu této smlouvy. Správní poplatek za podání návrhu na vklad hradí kupující.\n\nSmlouva je vyhotovena ve 4 stejnopisech, z nichž každá smluvní strana obdrží po jednom a dva jsou určeny pro katastrální úřad.\n\nV Praze dne xx. xx. 2026\n\n_________________________          _________________________\nProdávající: Jan Novák             Kupující: VÝKUP NEMOVITOSTÍ s.r.o.",
    explanation:
      "Závěrečná ustanovení upravují formální náležitosti — kdy smlouva nabývá účinnosti, kdo podává návrh na vklad do katastru a kdo hradí související poplatky. Při výkupu nemovitosti veškeré poplatky hradí výkupní společnost, takže prodávající neplatí za vklad do katastru ani za právní služby. Smlouva se podepisuje ve více vyhotoveních, protože katastrální úřad vyžaduje originály.",
  },
];

const PREVIEW_COUNT = 2;

export default function VzorSmlouvyPage(): React.ReactElement {
  const previewSections = CONTRACT_SECTIONS.slice(0, PREVIEW_COUNT);
  const gatedSections = CONTRACT_SECTIONS.slice(PREVIEW_COUNT);

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
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <FileText className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Vzor smlouvy o&nbsp;výkupu nemovitosti
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--theme-100)]">
            Podívejte se, co přesně obsahuje kupní smlouva při výkupu
            nemovitosti. Každý článek vysvětlujeme srozumitelnou češtinou,
            abyste věděli, na co si dát pozor.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Breadcrumbs
          items={[{ label: "Vzor smlouvy", href: "/vzor-smlouvy" }]}
        />
      </div>

      {/* Intro */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold text-amber-900">
                  Důležité upozornění
                </p>
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  Níže uvedený vzor slouží pouze pro informační účely a
                  představuje zjednodušenou ukázku typické kupní smlouvy při
                  výkupu nemovitosti. Každá smlouva je připravována individuálně
                  nezávislým advokátem podle konkrétní situace. Doporučujeme
                  vždy konzultovat finální znění s vlastním právním zástupcem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview sections (visible) */}
      <section className="pb-8">
        <div className="mx-auto max-w-4xl px-6">
          <div className="space-y-10">
            {previewSections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
              >
                <h2 className="mb-4 text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Vzorový text smlouvy
                  </p>
                  <div className="whitespace-pre-line font-serif text-[15px] leading-relaxed text-slate-700">
                    {section.sample}
                  </div>
                </div>
                <div className="mt-4 rounded-xl border-l-4 border-[var(--theme-500)] bg-white p-6 shadow-sm">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--theme-600)]">
                    Co to znamená v praxi
                  </p>
                  <p className="font-sans leading-relaxed text-slate-600">
                    {section.explanation}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Gate */}
      <section className="relative py-16">
        {/* Blurred preview of gated content */}
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative">
            {/* Blurred teaser */}
            <div
              className="pointer-events-none select-none space-y-10 blur-sm"
              aria-hidden="true"
            >
              {gatedSections.slice(0, 2).map((section) => (
                <div key={section.id}>
                  <div className="mb-4 h-8 w-2/3 rounded bg-slate-200" />
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded bg-slate-200" />
                      <div className="h-4 w-5/6 rounded bg-slate-200" />
                      <div className="h-4 w-4/6 rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overlay with form */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/60 via-white/90 to-white">
              <div className="w-full max-w-lg px-4">
                <div className="mb-6 flex items-center justify-center gap-2 text-slate-500">
                  <Lock className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Dalších {gatedSections.length} článků smlouvy + kompletní
                    PDF ke stažení
                  </span>
                </div>
                <VzorLeadGateForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="border-t border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
            Časté dotazy ke smlouvě
          </h2>
          <div className="space-y-4">
            {JSON_LD_FAQ.mainEntity.map((faq) => (
              <details
                key={faq.name}
                className="group rounded-2xl border border-slate-200 bg-white p-6"
              >
                <summary className="flex cursor-pointer items-center justify-between font-semibold text-slate-900">
                  {faq.name}
                  <span className="ml-4 shrink-0 text-slate-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Další užitečné informace
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/jak-to-funguje"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Jak funguje výkup nemovitosti?
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Celý proces od prvního kontaktu po vyplacení peněz v 5 krocích.
              </p>
            </Link>
            <Link
              href="/garance-vykupu"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Naše garance výkupu
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                5 písemných garancí, které vás chrání po celou dobu spolupráce.
              </p>
            </Link>
            <Link
              href="/blog/jake-dokumenty-potrebuji"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Jaké dokumenty potřebuji k výkupu?
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Kompletní přehled všech potřebných dokumentů pro prodej
                nemovitosti.
              </p>
            </Link>
            <Link
              href="/caste-dotazy"
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 group-hover:text-[var(--theme-700)]">
                Časté dotazy
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Odpovědi na nejčastější otázky o výkupu nemovitostí.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] py-16 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold">
            Chcete vidět konkrétní nabídku pro vaši nemovitost?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-[var(--theme-100)]">
            Vyplňte nezávazný formulář a do 24 hodin vám připravíme individuální
            nabídku s konkrétní cenou a návrhem smlouvy.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600"
            >
              Chci nezávaznou nabídku
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--theme-200)] transition hover:text-white"
            >
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
