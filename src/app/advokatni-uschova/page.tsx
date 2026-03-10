import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Scale,
  Building2,
  FileCheck,
  Users,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Lock,
  Banknote,
  Clock,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Advokátní úschova při výkupu nemovitosti | vykoupim-nemovitost.cz",
  description:
    "Co je advokátní úschova a proč je klíčová při prodeji nemovitosti? Bezpečná ochrana peněz i dokumentů pod dohledem advokáta. Vše zdarma v rámci našeho výkupu.",
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/advokatni-uschova",
  },
};

const SITE_URL = "https://vykoupim-nemovitost.cz";

const FAQ_ITEMS = [
  {
    question: "Co je advokátní úschova a jak funguje?",
    answer:
      "Advokátní úschova je služba, při které advokát dočasně přijme finanční prostředky nebo dokumenty na svůj zvláštní úschovní účet. Peníze jsou uvolněny prodávajícímu až po splnění dohodnutých podmínek — typicky po zápisu nového vlastníka do katastru nemovitostí. Tím je zajištěna bezpečnost obou stran transakce.",
  },
  {
    question: "Je advokátní úschova při výkupu nemovitosti povinná?",
    answer:
      "Advokátní úschova není ze zákona povinná, ale je silně doporučená u všech převodů nemovitostí. Při výkupu nemovitostí přes naši společnost ji vždy zajistíme zdarma jako standardní součást procesu, protože je to nejbezpečnější způsob převodu peněz.",
  },
  {
    question: "Kdo hradí náklady na advokátní úschovu?",
    answer:
      "Při výkupu nemovitosti přes vykoupim-nemovitost.cz hradíme veškeré náklady na advokátní úschovu za vás. Prodávající neplatí nic — ani za úschovu, ani za právní servis. Vše je zahrnuto v naší službě bez jakýchkoliv skrytých poplatků.",
  },
  {
    question: "Jak dlouho trvá uvolnění peněz z advokátní úschovy?",
    answer:
      "Peníze z advokátní úschovy jsou uvolněny zpravidla do 2–5 pracovních dnů po splnění podmínek, tedy po zápisu vlastnického práva do katastru nemovitostí. V praxi celý proces od podpisu smlouvy po vyplacení trvá obvykle 30–45 dnů, záleží na rychlosti katastru.",
  },
  {
    question: "Je advokátní úschova bezpečnější než bankovní úschova?",
    answer:
      "Obě formy úschovy jsou bezpečné, ale advokátní úschova nabízí několik výhod. Advokát je ze zákona pojištěn, podléhá dohledu České advokátní komory a úschovní účet je striktně oddělený od jeho osobního majetku. Navíc advokát zároveň dohlíží na celý právní průběh transakce, takže máte komplexní ochranu na jednom místě.",
  },
  {
    question: "Co se stane s penězi, pokud transakce neproběhne?",
    answer:
      "Pokud z jakéhokoliv důvodu nedojde k převodu nemovitosti, advokát vrátí finanční prostředky zpět kupujícímu. Podmínky vrácení peněz jsou přesně definovány ve smlouvě o úschově, kterou všechny strany podepisují předem. Prodávající tak neriskuje žádnou ztrátu.",
  },
] as const;

const JSON_LD_ARTICLE = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Advokátní úschova při výkupu nemovitosti – kompletní průvodce",
  description:
    "Podrobný průvodce advokátní úschovou při prodeji nemovitosti. Co to je, jak funguje, proč je bezpečná a jak probíhá u výkupu nemovitostí.",
  datePublished: "2026-03-10",
  dateModified: "2026-03-10",
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
    "@id": `${SITE_URL}/advokatni-uschova`,
  },
};

const JSON_LD_FAQ = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const STEPS = [
  {
    number: 1,
    title: "Podpis kupní smlouvy",
    description:
      "Prodávající a kupující podepíší kupní smlouvu, ve které jsou jasně stanoveny podmínky prodeje, včetně kupní ceny a termínů.",
    Icon: FileCheck,
  },
  {
    number: 2,
    title: "Složení peněz do úschovy",
    description:
      "Kupující složí celou kupní cenu na úschovní účet advokáta. Tento účet je striktně oddělený od osobního majetku advokáta a podléhá dohledu České advokátní komory.",
    Icon: Banknote,
  },
  {
    number: 3,
    title: "Podání návrhu na katastr",
    description:
      "Advokát podá návrh na vklad vlastnického práva do katastru nemovitostí. Katastr zpravidla rozhodne do 20–30 dnů.",
    Icon: Building2,
  },
  {
    number: 4,
    title: "Kontrola zápisu v katastru",
    description:
      "Jakmile katastr zapíše nového vlastníka, advokát ověří správnost zápisu a zkontroluje splnění všech podmínek úschovní smlouvy.",
    Icon: CheckCircle2,
  },
  {
    number: 5,
    title: "Vyplacení peněz prodávajícímu",
    description:
      "Po ověření zápisu advokát uvolní finanční prostředky z úschovního účtu na účet prodávajícího. Peníze obdržíte zpravidla do 2–5 pracovních dnů.",
    Icon: Banknote,
  },
] as const;

const BENEFITS = [
  {
    Icon: Shield,
    title: "Maximální bezpečnost",
    description:
      "Peníze jsou chráněny na zvláštním úschovním účtu advokáta, odděleném od jeho osobního majetku. Podléhají dohledu České advokátní komory.",
  },
  {
    Icon: Scale,
    title: "Právní garance",
    description:
      "Advokát je ze zákona pojištěn pro případ způsobené škody. Transakce probíhá pod odborným právním dohledem od začátku do konce.",
  },
  {
    Icon: Lock,
    title: "Ochrana obou stran",
    description:
      "Prodávající má jistotu, že peníze existují a jsou připraveny k výplatě. Kupující ví, že peníze budou uvolněny až po splnění podmínek.",
  },
  {
    Icon: Users,
    title: "Nezávislý dohled",
    description:
      "Advokát vystupuje jako nezávislá třetí strana, která dohlíží na korektní průběh celé transakce. Nemá zájem zvýhodňovat ani jednu stranu.",
  },
  {
    Icon: Clock,
    title: "Rychlé vyplacení",
    description:
      "Po splnění podmínek jsou peníze vyplaceny do několika pracovních dnů. Žádné zbytečné prodlevy, žádné komplikace.",
  },
  {
    Icon: FileCheck,
    title: "Komplexní služba",
    description:
      "Advokát se postará nejen o úschovu peněz, ale i o přípravu smluv, podání na katastr a kontrolu celého právního procesu.",
  },
] as const;

export default function AdvokatniUschovaPage() {
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
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Advokátní úschova při výkupu nemovitosti
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--theme-100)]">
            Maximální bezpečnost vašich peněz při prodeji nemovitosti. Advokátní
            úschova zajistí, že peníze obdržíte spolehlivě a bez rizika — a u
            nás ji dostanete zdarma.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Breadcrumbs
          items={[{ label: "Advokátní úschova", href: "/advokatni-uschova" }]}
        />
      </div>

      {/* Co je advokátní úschova */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Co je advokátní úschova?
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              Advokátní úschova je jedním z nejbezpečnějších způsobů, jak
              zajistit finanční transakci při prodeji nemovitosti. Jedná se o
              službu, při které advokát převezme do své úschovy finanční
              prostředky (kupní cenu) a uloží je na zvláštní úschovní účet. Tyto
              peníze jsou striktně odděleny od osobního majetku advokáta a
              podléhají přísným pravidlům České advokátní komory.
            </p>
            <p>
              Princip je jednoduchý: kupující složí peníze na úschovní účet
              advokáta ještě před převodem nemovitosti. Advokát peníze uvolní
              prodávajícímu až poté, co jsou splněny předem dohodnuté podmínky —
              nejčastěji jde o zápis nového vlastníka do{" "}
              <strong>katastru nemovitostí</strong>. Tím jsou chráněny obě
              strany: prodávající ví, že peníze existují a jsou připraveny,
              kupující ví, že peníze budou uvolněny až po řádném převodu
              vlastnictví.
            </p>
            <p>
              Advokátní úschova se v České republice používá standardně při
              převodech nemovitostí a je považována za zlatý standard
              bezpečnosti. Na rozdíl od přímého převodu peněz mezi účty
              eliminuje riziko, že jedna strana nesplní svůj závazek.
            </p>
          </div>
        </div>
      </section>

      {/* Jak probíhá - kroky */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Jak probíhá advokátní úschova krok za krokem
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Celý proces advokátní úschovy je transparentní a přehledný. Zde je
            přesný postup, jak to funguje při{" "}
            <Link
              href="/jak-to-funguje"
              className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
            >
              výkupu nemovitosti
            </Link>{" "}
            přes naši společnost:
          </p>

          <ol className="relative mt-10 space-y-10 border-l-2 border-[var(--theme-200)] pl-8">
            {STEPS.map((step) => (
              <li key={step.number} className="relative">
                <span className="absolute -left-12 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-700)] text-sm font-bold text-white">
                  {step.number}
                </span>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <step.Icon className="h-6 w-6 shrink-0 text-[var(--theme-700)]" />
                    <h3 className="text-xl font-bold text-slate-900">
                      {step.title}
                    </h3>
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

      {/* Proč je bezpečná */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Proč je advokátní úschova bezpečná?
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Advokátní úschova je jednou z nejlépe chráněných forem finančního
            zajištění v České republice. Zde jsou hlavní důvody, proč jí můžete
            důvěřovat:
          </p>

          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Dohled České advokátní komory
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                Každý advokát v ČR podléhá přísným pravidlům České advokátní
                komory (ČAK). Úschovní účty jsou pravidelně kontrolovány a
                advokát je povinen vést je odděleně od svého osobního majetku. V
                případě jakéhokoliv porušení pravidel hrozí advokátovi kárné
                řízení až po odebrání licence.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Povinné pojištění odpovědnosti
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                Každý advokát musí být ze zákona pojištěn proti škodám
                způsobeným při výkonu advokacie. To znamená, že i v
                nepravděpodobném případě pochybení jsou vaše peníze chráněny
                pojistkou. Pojištění advokátů v ČR obvykle kryje škody v řádu
                desítek milionů korun.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Oddělený úschovní účet
              </h3>
              <p className="mt-2 leading-relaxed text-slate-600">
                Peníze na úschovním účtu nejsou součástí majetku advokáta. Pokud
                by se advokát dostal do finančních potíží, tyto prostředky
                nemohou být použity k úhradě jeho dluhů ani exekuovány. Jsou
                plně chráněny zákonem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Výhody */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Výhody advokátní úschovy při prodeji nemovitosti
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Advokátní úschova přináší konkrétní výhody pro prodávajícího i
            kupujícího. Při{" "}
            <Link
              href="/garance-vykupu"
              className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
            >
              výkupu nemovitosti s garancí
            </Link>{" "}
            přes naši společnost zajistíme advokátní úschovu vždy zdarma.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-100)]">
                    <benefit.Icon className="h-5 w-5 text-[var(--theme-700)]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {benefit.title}
                  </h3>
                </div>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Náš proces */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Jak zajišťujeme advokátní úschovu při výkupu
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              Při výkupu nemovitosti přes{" "}
              <strong>vykoupim-nemovitost.cz</strong> se o advokátní úschovu
              nemusíte starat. Celý proces zajistíme kompletně za vás a{" "}
              <strong>zcela zdarma</strong>. Zde je, jak to funguje u nás:
            </p>
            <ul className="ml-6 list-disc space-y-3">
              <li>
                <strong>Výběr advokáta:</strong> Spolupracujeme s prověřenými
                advokáty, kteří mají dlouholeté zkušenosti s převody
                nemovitostí. Advokáta můžete samozřejmě schválit nebo navrhnout
                vlastního.
              </li>
              <li>
                <strong>Příprava smluv:</strong> Advokát připraví kupní smlouvu
                i smlouvu o úschově. Obě smlouvy dostanete k prostudování s
                dostatečným předstihem — nic nepodepisujete pod tlakem.
              </li>
              <li>
                <strong>Složení kupní ceny:</strong> Po podpisu smluv složíme
                celou kupní cenu na úschovní účet advokáta. Máte tak jistotu, že
                peníze jsou připraveny a čekají na vás.
              </li>
              <li>
                <strong>Zápis do katastru:</strong> Advokát zajistí podání
                návrhu na vklad do katastru a sleduje celý proces. Jakmile je
                vklad zapsán, ověří jeho správnost.
              </li>
              <li>
                <strong>Vyplacení peněz:</strong> Po úspěšném zápisu advokát
                okamžitě uvolní peníze na váš účet. Celý proces je transparentní
                a pod právním dohledem.
              </li>
            </ul>
            <p>
              Na rozdíl od prodeje přes realitní kancelář u nás neplatíte žádnou
              provizi ani poplatky za právní servis. Vše je zahrnuto v naší
              službě. Více o tom,{" "}
              <Link
                href="/proc-my"
                className="font-medium text-[var(--theme-700)] underline decoration-[var(--theme-300)] underline-offset-2 transition hover:text-[var(--theme-600)]"
              >
                proč si vybrat právě nás
              </Link>
              , se dozvíte na samostatné stránce.
            </p>
          </div>
        </div>
      </section>

      {/* Srovnání */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Advokátní úschova vs. bankovní úschova vs. notářská úschova
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              V České republice existují tři hlavní formy úschovy při převodu
              nemovitostí. Každá má své specifika:
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border-2 border-[var(--theme-300)] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--theme-700)]" />
                <h3 className="text-lg font-bold text-[var(--theme-800)]">
                  Advokátní úschova
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Dohled ČAK + povinné pojištění
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Komplexní právní servis
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Oddělený úschovní účet
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Nižší cena než notář
                </li>
              </ul>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--theme-700)]">
                ★ Naše doporučení
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  Bankovní úschova
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Vysoká bezpečnost banky
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Pojištění vkladů
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Vyšší poplatky (5 000–15 000 Kč)
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Bez právního servisu
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-slate-500" />
                <h3 className="text-lg font-bold text-slate-900">
                  Notářská úschova
                </h3>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Vysoká právní jistota
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  Veřejná listina
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Nejvyšší poplatky
                </li>
                <li className="flex items-start gap-2">
                  <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  Delší administrativní proces
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900">
            Často kladené dotazy o advokátní úschově
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Odpovídáme na nejčastější otázky, které dostáváme od prodávajících
            ohledně advokátní úschovy.
          </p>

          <div className="mt-10 space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {item.question}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {item.answer}
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
            Prodejte nemovitost bezpečně s advokátní úschovou zdarma
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Vyplňte nezávazný formulář a do 24 hodin vám pošleme nabídku na
            výkup vaší nemovitosti. Advokátní úschovu i kompletní právní servis
            zajistíme zdarma.
          </p>
          <p className="mt-2 text-slate-500">
            Nebo zavolejte na{" "}
            <a
              href="tel:+420776424145"
              className="font-medium text-[var(--theme-700)] hover:text-[var(--theme-600)]"
            >
              +420 776 424 145
            </a>
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
              className="inline-flex min-h-11 items-center text-sm font-medium text-[var(--theme-700)] transition hover:text-[var(--theme-600)]"
            >
              ← Jak funguje výkup
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
