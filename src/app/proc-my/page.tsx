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
import { MAX_ZALOHA, PRICE_PERCENT } from "@/lib/pricing";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Proč prodat nemovitost nám | Výkup vs realitka vs dražba",
  description:
    "Srovnání výkupu nemovitosti přes nás, realitní kancelář a dražbu. Až 90 % tržní ceny, záloha ihned, bez provize — zjistěte, proč je přímý výkup nejlepší volba.",
  alternates: { canonical: "https://vykoupim-nemovitost.cz/proc-my" },
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

const CASE_STUDIES = [
  {
    title: "Exekuce v Praze — byt prodán za 5 dní",
    text: "Pan Karel z Prahy 4 čelil exekuci a potřeboval rychle prodat byt 2+kk. Realitní kancelář odhadla prodej na 4–6 měsíců. My jsme byt vykoupili do 5 dnů, zálohu vyplatili při podpisu a pan Karel stihl uhradit dluh dříve, než exekutor zabavil majetek.",
  },
  {
    title: "Dědictví v Brně — vyřešeno bez hádek",
    text: "Tři sourozenci zdědili rodinný dům v Brně-Židenicích. Jeden chtěl prodat, druhý bydlet, třetí nevěděl. Nabídli jsme férovou cenu, kterou přijali všichni tři. Právní servis i převod katastru jsme zajistili zdarma — bez realitky, bez provize.",
  },
  {
    title: "Rozvod v Ostravě — diskrétně a rychle",
    text: "Paní Eva se rozváděla a potřebovala rychle vypořádat společný byt v Ostravě-Porubě. Nechtěla veřejnou inzerci ani prohlídky s cizími lidmi. Vše jsme vyřešili diskrétně do 7 dnů — peníze dostala na účet a mohla začít novou kapitolu.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Proč prodat nemovitost nám | Výkup vs realitka vs dražba",
  description:
    "Srovnání výkupu nemovitosti přes nás, realitní kancelář a dražbu. Rychlost, záloha, provize, právní servis.",
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
  mainEntityOfPage: "https://vykoupim-nemovitost.cz/proc-my",
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

        {/* Case Studies */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
              Reálné příběhy našich klientů
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {CASE_STUDIES.map((cs) => (
                <article
                  key={cs.title}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {cs.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {cs.text}
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
              { href: "/reference", label: "Reference" },
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
