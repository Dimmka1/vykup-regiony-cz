import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Shield,
  BadgeCheck,
  HandCoins,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import { getRequestHost } from "@/lib/request-host";

const PAGE_URL = "https://vykoupim-nemovitost.cz/vykup-pred-drazbou";
const PHONE = "+420 776 424 145";

export const metadata: Metadata = {
  alternates: { canonical: PAGE_URL },
  title: "Výkup nemovitosti před dražbou — zachraňte svůj majetek včas",
  description:
    "Hrozí vám nucená dražba nemovitosti? Vykoupíme ji rychle za férovou cenu. Vyřešíme dluhy, vyplatíme vás do 7 dnů a zastavíme dražbu. Bez provize.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Je možné zastavit dražbu prodejem nemovitosti?",
    answer:
      "Ano, dokud nebyla dražba zahájena, je možné nemovitost prodat a z kupní ceny uhradit veškeré dluhy. Tím se dražba zastaví a vy si uchováte kontrolu nad výnosem z prodeje. Je však nutné jednat rychle — čím dříve nás kontaktujete, tím větší šanci na úspěšné řešení máte.",
  },
  {
    question: "Kolik peněz dostanu při prodeji před dražbou?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty nemovitosti, což je výrazně více než typický výtěžek z nucené dražby, kde ceny často klesají na 50–70 % tržní hodnoty. Z kupní ceny uhradíme vaše dluhy a zbytek vyplatíme přímo vám na účet.",
  },
  {
    question: "Jak dlouho trvá celý proces výkupu před dražbou?",
    answer:
      "Od prvního kontaktu po vyplacení peněz to může být i 7 dní. Standardně celý proces trvá 2–4 týdny v závislosti na složitosti případu a spolupráci s věřiteli. Náš tým pracuje s maximální efektivitou, aby stihl vše před datem dražby.",
  },
  {
    question: "Co se stane, když dražbu nestihnu zastavit?",
    answer:
      "Při nucené dražbě přijdete o kontrolu nad prodejem. Nemovitost se prodá tomu, kdo nabídne nejvíce — často pod tržní cenou. Navíc nesete náklady dražby (poplatky exekutorovi, znalecký posudek). Proto je klíčové jednat co nejdříve a dražbě předejít.",
  },
  {
    question: "Potřebuji souhlas exekutora nebo věřitele?",
    answer:
      "V určitých případech ano. Náš právní tým se postará o veškerou komunikaci s exekutorským úřadem i věřiteli. Zajistíme všechna potřebná povolení tak, aby prodej proběhl hladce a v souladu se zákonem.",
  },
  {
    question: "Mohu v nemovitosti dál bydlet po prodeji?",
    answer:
      "Ano, nabízíme možnost zpětného nájmu. To znamená, že nemovitost prodáte, vyřešíte dluhy, a přitom můžete v nemovitosti dál bydlet jako nájemník. Podmínky dohodneme individuálně podle vaší situace.",
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
    title: "1. Nezávazná nabídka zdarma",
    description:
      "Vyplňte formulář nebo zavolejte. Do 24 hodin obdržíte cenovou nabídku na výkup vaší nemovitosti.",
  },
  {
    icon: Scale,
    title: "2. Právní analýza situace",
    description:
      "Naši právníci prověří stav dluhů, exekucí a naplánují optimální postup pro zastavení dražby.",
  },
  {
    icon: Shield,
    title: "3. Dohoda s věřiteli",
    description:
      "Komunikujeme s exekutory a věřiteli za vás. Zajistíme souhlas s prodejem a připravíme smlouvy.",
  },
  {
    icon: Clock,
    title: "4. Rychlé vyplacení",
    description:
      "Z kupní ceny uhradíme dluhy, zbytek vyplatíme na váš účet. Dražba je zastavena.",
  },
] as const;

interface Advantage {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ADVANTAGES: readonly Advantage[] = [
  {
    icon: HandCoins,
    title: "Vyšší výnos",
    description:
      "Při dobrovolném prodeji získáte 80–90 % tržní hodnoty. V nucené dražbě často jen 50–70 %.",
  },
  {
    icon: Clock,
    title: "Rychlost řešení",
    description:
      "Celý proces zvládneme za 7–14 dní. V dražbě se proces táhne měsíce bez záruky výsledku.",
  },
  {
    icon: Shield,
    title: "Kontrola nad procesem",
    description:
      "Vy rozhodujete o podmínkách prodeje. V dražbě nemáte žádný vliv na cenu ani kupujícího.",
  },
  {
    icon: BadgeCheck,
    title: "Diskrétnost",
    description:
      "Prodej proběhne bez publicity. Dražba je veřejná — dozví se sousedé, kolegové i známí.",
  },
] as const;

const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Výkup nemovitosti před dražbou — zachraňte svůj majetek včas",
  description:
    "Kompletní průvodce prodejem nemovitosti před nucenou dražbou. Zjistěte, jak zastavit dražbu, kolik peněz získáte a jak celý proces probíhá.",
  url: PAGE_URL,
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
  datePublished: "2026-03-09",
  dateModified: "2026-03-09",
  mainEntityOfPage: PAGE_URL,
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default async function VykupPredDrazbouPage(): Promise<React.ReactElement> {
  const host = await getRequestHost();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(FAQ_JSON_LD) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                { label: "Výkup před dražbou", href: "/vykup-pred-drazbou" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti před dražbou
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Hrozí vám nucená dražba nemovitosti? Nemusíte čekat, až o svůj
            majetek přijdete za zlomek jeho hodnoty. Existuje zákonná cesta, jak
            nemovitost prodat dříve, než dražba proběhne — a získat za ni
            výrazně více peněz.
          </p>
          <p className="mt-4 text-slate-600">
            Nucená dražba je pro většinu lidí noční můra. Nemovitost, do které
            jste investovali roky práce a úspor, se prodá pod cenou a vy nemáte
            žádnou kontrolu nad tím, kdo ji koupí ani za kolik. Navíc nesete
            náklady celého dražebního procesu — poplatky exekutorovi, znalecký
            posudek, inzerci.
          </p>
          <p className="mt-4 text-slate-600">
            Přitom existuje jednoduché řešení:{" "}
            <strong>prodat nemovitost ještě před dražbou</strong>. Pokud jednáte
            včas, můžete dražbu zcela zastavit, uhradit dluhy z kupní ceny a
            zbytek peněz si nechat. Přesně s tím vám pomůžeme.
          </p>
          <p className="mt-4 text-slate-600">
            Naše společnost se specializuje na{" "}
            <Link
              href="/vykup-pri-exekuci"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              výkup nemovitostí v obtížných situacích
            </Link>
            . Za roky praxe jsme pomohli stovkám klientů zachránit jejich
            majetek před nucenou dražbou. Víme přesně, jak postupovat, na koho
            se obrátit a jak celý proces urychlit.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <a
              href={`tel:${PHONE.replace(/\s/g, "")}`}
              className="inline-flex items-center rounded-xl border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              Zavolat {PHONE}
            </a>
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
            <Shield className="h-4 w-4 text-emerald-500" /> Zastavíme dražbu za
            vás
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      {/* Why sell before auction */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Proč prodat nemovitost před dražbou?
          </h2>
          <p className="mt-4 text-slate-600">
            Rozhodnutí prodat nemovitost před nucenou dražbou je jedním z
            nejdůležitějších kroků, které můžete v této situaci udělat.
            Porovnejme obě varianty:
          </p>

          {/* Comparison table */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-3 bg-slate-50 p-4 text-sm font-semibold text-slate-900">
              <div>Kritérium</div>
              <div className="text-center text-emerald-600">
                Prodej před dražbou
              </div>
              <div className="text-center text-red-600">Nucená dražba</div>
            </div>
            {[
              [
                "Výnos z prodeje",
                "80–90 % tržní hodnoty",
                "50–70 % tržní hodnoty",
              ],
              ["Délka procesu", "7–14 dní", "3–6 měsíců"],
              [
                "Kontrola nad cenou",
                "Ano, vy rozhodujete",
                "Ne, rozhoduje trh",
              ],
              ["Diskrétnost", "Plná diskrétnost", "Veřejná dražba"],
              ["Náklady procesu", "Žádné — hradíme my", "Tisíce Kč navíc"],
            ].map(([criterion, sell, auction]) => (
              <div
                key={criterion}
                className="grid grid-cols-3 border-t border-slate-100 p-4 text-sm"
              >
                <div className="font-medium text-slate-900">{criterion}</div>
                <div className="text-center text-slate-600">{sell}</div>
                <div className="text-center text-slate-600">{auction}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-slate-600">
            Jak vidíte, prodej před dražbou je téměř ve všech ohledech
            výhodnější. Získáte více peněz, proces je rychlejší a máte nad ním
            plnou kontrolu. Navíc se vyhnete stigmatu veřejné dražby, které může
            negativně ovlivnit vaše osobní i profesní vztahy.
          </p>
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Výhody prodeje před dražbou
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {ADVANTAGES.map((advantage) => (
              <div
                key={advantage.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <advantage.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {advantage.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak probíhá výkup před dražbou
          </h2>
          <p className="mt-4 text-slate-600">
            Celý proces jsme maximálně zjednodušili. Postaráme se o vše — od
            právní analýzy přes komunikaci s věřiteli až po vyplacení peněz.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm"
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

      {/* When to act */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Kdy je třeba jednat?
                </h2>
                <p className="mt-3 text-slate-600">
                  Čas je při hrozící dražbě váš největší nepřítel. Jakmile
                  obdržíte dražební vyhlášku nebo upozornění od exekutora, máte
                  omezenou lhůtu na to celou situaci vyřešit. Čím dříve se
                  ozvete, tím více možností máme.
                </p>
                <p className="mt-3 text-slate-600">
                  <strong>Ideální čas jednat</strong> je v momentě, kdy víte, že
                  nebudete schopni dluhy splácet. Nemusíte čekat na exekuci —
                  preventivní prodej vám ušetří stres, peníze i čas.
                </p>
                <p className="mt-3 text-slate-600">
                  Kontaktujte nás i v případě, že si nejste jistí, zda je prodej
                  před dražbou ve vaší situaci možný. Konzultace je zcela zdarma
                  a nezávazná.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed content section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Co je nucená dražba a jak jí předejít
          </h2>
          <p className="mt-4 text-slate-600">
            Nucená dražba je krajní prostředek, kterým exekutor vymáhá
            pohledávky věřitelů. Nemovitost je oceněna znaleckým posudkem a
            následně nabídnuta ve veřejné dražbě. Vyvolávací cena bývá stanovena
            na dvě třetiny odhadní ceny, což znamená, že vaše nemovitost může
            být prodána za výrazně méně, než je její skutečná hodnota.
          </p>
          <p className="mt-4 text-slate-600">
            Navíc z výtěžku dražby se nejprve uhradí náklady exekuce — poplatky
            exekutorovi, znalecký posudek, inzerce dražby. Teprve poté se
            uspokojují pohledávky věřitelů. Vám jako dlužníkovi zbude zpravidla
            minimum nebo nic.
          </p>
          <p className="mt-4 text-slate-600">
            Při dobrovolném prodeji před dražbou je situace zásadně jiná. Vy
            jako vlastník prodáváte nemovitost za tržní cenu (resp. 80–90 %
            tržní hodnoty při rychlém výkupu). Z kupní ceny se uhradí dluhy a
            zbytek — často statisíce korun — obdržíte vy.
          </p>

          <h3 className="mt-8 text-xl font-bold text-slate-900">
            Pro koho je výkup před dražbou vhodný?
          </h3>
          <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600">
            <li>Majitelé nemovitostí, kterým hrozí exekuční dražba</li>
            <li>
              Lidé s více exekucemi, kteří potřebují komplexní řešení dluhů
            </li>
            <li>
              Vlastníci, kteří obdrželi dražební vyhlášku a potřebují jednat
              rychle
            </li>
            <li>
              Rodiny v obtížné finanční situaci hledající důstojné východisko
            </li>
            <li>
              Kdokoli, kdo chce předejít veřejné dražbě a zachovat si soukromí
            </li>
          </ul>

          <h3 className="mt-8 text-xl font-bold text-slate-900">
            Právní rámec prodeje před dražbou
          </h3>
          <p className="mt-4 text-slate-600">
            Prodej nemovitosti před dražbou je zcela legální postup upravený
            občanským zákoníkem a exekučním řádem. Klíčové je získat souhlas
            exekutora s prodejem, což náš právní tým zajistí za vás. Exekutor
            zpravidla souhlasí, pokud je zajištěno, že z kupní ceny budou
            uhrazeny veškeré pohledávky.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces probíhá transparentně a v souladu se zákonem. Kupní
            smlouva je připravena našimi právníky a všechny strany — vy,
            kupující i exekutor — mají jasně definované podmínky. Po uhrazení
            kupní ceny exekutor zruší exekuční příkaz a nemovitost je převedena
            na nového vlastníka.
          </p>
          <p className="mt-4 text-slate-600">
            Pokud vás zajímají další možnosti, přečtěte si o našich{" "}
            <Link
              href="/garance-vykupu"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              garancích výkupu
            </Link>{" "}
            nebo se podívejte,{" "}
            <Link
              href="/proc-my"
              className="text-emerald-600 underline hover:text-emerald-500"
            >
              proč si nás klienti vybírají
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu před dražbou
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

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Nenechte dražbu rozhodnout za vás
            </h2>
            <p className="mt-2 text-slate-600">
              Kontaktujte nás ještě dnes. Nezávazná konzultace zdarma — společně
              najdeme nejlepší řešení pro vaši situaci.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Chci nezávaznou nabídku
              </Link>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-500"
              >
                nebo zavolejte {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles
            articles={getRelatedArticles("vykup-pred-drazbou")}
          />
        </div>
      </section>

      <LeadMagnetCta />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
