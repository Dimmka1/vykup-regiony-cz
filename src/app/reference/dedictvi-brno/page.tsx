import type { Metadata } from "next";
import Link from "next/link";
import { Clock, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://www.vykupnemovitosticz.cz";

export const metadata: Metadata = {
  title: "Výkup zděděného domu v Brně – příběh pana S. | Reference",
  description:
    "Pan S. zdědil dům v Brně se 4 spoluvlastníky. Díky rychlému výkupu se vyřešil spor a všichni dostali férovou částku do 14 dní.",
  alternates: { canonical: `${SITE_URL}/reference/dedictvi-brno` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Výkup zděděného domu v Brně – příběh pana S.",
  description:
    "Pan S. zdědil dům v Brně se 4 spoluvlastníky. Díky rychlému výkupu se vyřešil spor a všichni dostali férovou částku do 14 dní.",
  datePublished: "2025-03-01",
  dateModified: "2025-03-01",
  author: { "@type": "Organization", name: "Výkup Nemovitostí" },
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: SITE_URL,
  },
  mainEntityOfPage: `${SITE_URL}/reference/dedictvi-brno`,
};

interface TimelineStep {
  day: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineStep[] = [
  {
    day: "Den 1",
    title: "Poptávka od pana S.",
    description:
      "Pan S. nás kontaktoval s žádostí o pomoc s prodejem zděděného domu. Popsal komplikovanou situaci se spoluvlastníky.",
  },
  {
    day: "Den 3",
    title: "Prohlídka a ocenění",
    description:
      "Prohlédli jsme rodinný dům 4+1 v Brně-Králově Poli. Odhadní hodnota 5 800 000 Kč. Nabídli jsme 5 200 000 Kč.",
  },
  {
    day: "Den 5–7",
    title: "Jednání se spoluvlastníky",
    description:
      "Kontaktovali jsme všechny 4 spoluvlastníky a individuálně vyjednali podmínky. Dva bydleli v zahraničí — řešili jsme plnou moc.",
  },
  {
    day: "Den 10",
    title: "Podpis smluv",
    description:
      "Všichni spoluvlastníci podepsali kupní smlouvu. Dva podepsali přes ověřenou plnou moc z ambasády.",
  },
  {
    day: "Den 14",
    title: "Vyplacení všech podílů",
    description:
      "Každý spoluvlastník obdržel svůj podíl na účet. Dům předán a zapsán v katastru.",
  },
];

export default function DedictviBrnoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLd) }}
      />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Breadcrumbs
            items={[
              { label: "Reference", href: "/reference" },
              { label: "Dědictví Brno", href: "/reference/dedictvi-brno" },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Prodej zděděného domu s&nbsp;více spoluvlastníky
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Pan S. z Brna zdědil dům se 4 spoluvlastníky, kteří se nemohli
            dohodnout. Výkup vyřešil situaci za 14 dní ke spokojenosti všech.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Situace klienta
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="leading-relaxed text-slate-600">
              Pan S. (45 let) zdědil po otci čtvrtinový podíl na rodinném domě
              4+1 v Brně-Králově Poli. Dalšími spoluvlastníky byli jeho dva
              bratři a sestra. Dva sourozenci žili v Německu a Rakousku.
              Nemovitost nebyla udržovaná a její tržní hodnota činila přibližně{" "}
              <strong>5 800 000 Kč</strong>.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Problém</h2>
          <ul className="space-y-3">
            {[
              "4 spoluvlastníci se nemohli dohodnout na ceně ani způsobu prodeje",
              "2 spoluvlastníci žili v zahraničí a odmítali jezdit na jednání",
              "Dům chátral a generoval náklady (daně, údržba, pojištění)",
              "Realitky odmítaly prodej kvůli komplikovaným vlastnickým vztahům",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-slate-600">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Jak jsme pomohli
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="leading-relaxed text-slate-600">
              Převzali jsme komunikaci se všemi spoluvlastníky. Každému jsme
              představili férovou nabídku odpovídající jeho podílu. Pro
              spoluvlastníky v zahraničí jsme zajistili ověření plných mocí přes
              české ambasády. Celý proces koordinovali naši právníci.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Průběh výkupu
          </h2>
          <div className="space-y-6">
            {TIMELINE.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="mt-2 h-full w-px bg-teal-200" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-teal-700">
                    {step.day}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Výsledek</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Clock, label: "Doba prodeje", value: "14 dní" },
              {
                icon: TrendingUp,
                label: "Výkupní cena",
                value: "5 200 000 Kč",
              },
              {
                icon: CheckCircle,
                label: "Podíl každého",
                value: "1 300 000 Kč",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <Icon className="mx-auto mb-2 h-8 w-8 text-teal-600" />
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-slate-600">
            Všichni 4 spoluvlastníci obdrželi <strong>1 300 000 Kč</strong> za
            svůj podíl. Rodinný spor byl vyřešen a vztahy se zlepšily, protože
            nikdo nemusel ustupovat.
          </p>
        </section>

        <section className="rounded-2xl bg-teal-50 p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Zdědili jste nemovitost?
          </h2>
          <p className="mb-6 text-slate-600">
            Pomůžeme vám s rychlým prodejem i při komplikovaném dědictví.
          </p>
          <Link
            href="/vykup-pri-dedictvi"
            className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-8 py-3 font-semibold text-white transition hover:bg-teal-800"
          >
            Více o výkupu při dědictví
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </article>
    </>
  );
}
