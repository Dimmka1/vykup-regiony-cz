import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Banknote,
  Ban,
  Scale,
  EyeOff,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { MAX_ZALOHA, PRICE_PERCENT } from "@/lib/pricing";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Proč prodat nemovitost nám | Výkup vs realitka vs dražba",
  description:
    "Srovnání výkupu nemovitosti přes nás, realitní kancelář a dražbu. Až 90 % tržní ceny, záloha ihned, bez provize — zjistěte, proč je přímý výkup nejlepší volba.",
  alternates: withHreflang({
    canonical: "https://vykoupim-nemovitost.cz/proc-my",
  }),
};

const ZALOH_VARIANT = MAX_ZALOHA;

interface ComparisonRow {
  criterion: string;
  icon: React.ElementType;
  us: string;
  realitka: string;
  drazba: string;
}

const COMPARISON: ComparisonRow[] = [
  {
    criterion: "Rychlost prodeje",
    icon: Clock,
    us: "Do 7 dnů",
    realitka: "3–12 měsíců",
    drazba: "6–18 měsíců",
  },
  {
    criterion: "Záloha",
    icon: Banknote,
    us: `Až ${ZALOH_VARIANT} Kč ihned`,
    realitka: "Žádná záloha",
    drazba: "Žádná záloha",
  },
  {
    criterion: "Výkupní cena",
    icon: BadgeCheck,
    us: `Až ${PRICE_PERCENT} % tržní hodnoty`,
    realitka: "Tržní cena minus provize",
    drazba: "Závisí na zájemcích",
  },
  {
    criterion: "Provize",
    icon: Ban,
    us: "0 % — bez provize",
    realitka: "3–5 % z ceny",
    drazba: "Poplatky dražebníkovi",
  },
  {
    criterion: "Právní servis",
    icon: Scale,
    us: "Zdarma — vše zajistíme",
    realitka: "Na vaše náklady",
    drazba: "Na vaše náklady",
  },
  {
    criterion: "Diskrétnost",
    icon: EyeOff,
    us: "Plná diskrétnost",
    realitka: "Veřejná inzerce",
    drazba: "Veřejná dražba",
  },
  {
    criterion: "Jistota prodeje",
    icon: BadgeCheck,
    us: "Garantovaná — smlouva ihned",
    realitka: "Nejistá — závisí na kupci",
    drazba: "Nejistá — závisí na zájemcích",
  },
];

/**
 * Typické situace, ve kterých výkup nemovitosti dává smysl.
 * Nejsou to konkrétní klientské příběhy — popisujeme jen postup,
 * jak takovou situaci řešíme. Žádná smyšlená jména ani místa.
 */
const SITUATION_PATTERNS = [
  {
    title: "Hrozící exekuční dražba bytu",
    body: "Vlastník bytu zjistí, že na něj byla nařízena exekuční dražba. Klasický prodej přes realitku trvá 4–6 měsíců, dražba se ale koná za 30–60 dnů. Postup výkupu: ověření exekuce v Centrální evidenci exekucí, dohoda s exekutorem, kupní smlouva v advokátní úschově, úhrada vymáhané pohledávky → zastavení dražby. Lhůta 5–14 dnů od první konzultace.",
  },
  {
    title: "Spoluvlastnictví z dědictví, kde se dědicové neshodnou",
    body: "Po pravomocném usnesení o dědictví zdědí nemovitost více dědiců, dohoda na společném prodeji ale není. Postup: vykupujeme jednotlivé spoluvlastnické podíly samostatně, bez nutnosti souhlasu ostatních. Při dědictvím vzniklém spoluvlastnictví respektujeme 6měsíční předkupní právo dle § 1124 občanského zákoníku — komunikaci se spoluvlastníky vedeme za vás.",
  },
  {
    title: "Vypořádání SJM po rozvodu se zachováním diskrétnosti",
    body: "Po rozvodu se SJM přemění v podílové spoluvlastnictví a polovina jde prodat samostatně bez souhlasu druhého manžela. Postup: žádná veřejná inzerce, žádné prohlídky cizích zájemců — jen prodávající, advokát a kupní smlouva v úschově. Peníze rozdělíme dle dohody přímo na účty obou stran.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Proč prodat nemovitost nám | Výkup vs realitka vs dražba",
  description:
    "Srovnání výkupu nemovitosti přes nás, realitní kancelář a dražbu. Rychlost, záloha, provize, právní servis.",
  author: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
  mainEntityOfPage: "https://vykoupim-nemovitost.cz/proc-my",
  inLanguage: "cs-CZ",
};

export default function ProcMyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      <main className="bg-white">
        {/* Breadcrumbs */}
        <section className="mx-auto max-w-5xl px-6 pt-8">
          <Breadcrumbs
            items={[{ label: "Proč prodat nám", href: "/proc-my" }]}
          />
        </section>

        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-12 pt-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Proč výkup nemovitosti u&nbsp;nás?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Nabízíme až 90&nbsp;% tržní ceny. Srovnejte si přímý výkup
            s&nbsp;realitní kanceláří a&nbsp;dražbou — rozhodněte se na základě
            faktů.
          </p>
        </section>

        {/* Comparison Table */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Kritérium
                  </th>
                  <th className="px-4 py-3 font-semibold text-emerald-700">
                    ✅ Výkup u nás
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Realitní kancelář
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Dražba
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <tr
                      key={row.criterion}
                      className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                          {row.criterion}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">
                        {row.us}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.realitka}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.drazba}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Typical situations (no fabricated client testimonials) */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-3 text-center text-2xl font-bold text-slate-900">
              Typické situace, kdy výkup dává smysl
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-slate-500">
              Popisujeme postup, ne konkrétní klienty. Diskrétnost transakcí
              znamená, že jména, města ani fotky bytů na webu neuvádíme.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {SITUATION_PATTERNS.map((s) => (
                <article
                  key={s.title}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {s.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Internal Links */}
        <section className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Další informace
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/jak-to-funguje", label: "Jak to funguje" },
              { href: "/garance-vykupu", label: "Garance výkupu" },
              { href: "/caste-dotazy", label: "Časté dotazy" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                {link.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Form */}
        <section className="bg-slate-900 py-16">
          <div className="mx-auto max-w-xl px-6 text-center">
            <h2 className="mb-2 text-2xl font-bold text-white">
              Chcete nezávaznou nabídku?
            </h2>
            <p className="mb-8 text-slate-300">
              Vyplňte formulář a do 24 hodin vám zašleme nabídku na výkup vaší
              nemovitosti.
            </p>
            <LeadForm regionName="Česká republika" />
          </div>
        </section>
      </main>
    </>
  );
}
