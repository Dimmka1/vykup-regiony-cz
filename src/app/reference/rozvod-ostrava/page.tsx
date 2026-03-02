import type { Metadata } from "next";
import Link from "next/link";
import { Clock, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://www.vykupnemovitosticz.cz";

export const metadata: Metadata = {
  title:
    "Rychlý prodej bytu při rozvodu v Ostravě – příběh paní K. | Reference",
  description:
    "Paní K. potřebovala rychle prodat byt v Ostravě kvůli rozvodu. Výkup proběhl za 10 dní a oba manželé dostali férový podíl.",
  alternates: { canonical: `${SITE_URL}/reference/rozvod-ostrava` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Rychlý prodej bytu při rozvodu v Ostravě – příběh paní K.",
  description:
    "Paní K. potřebovala rychle prodat byt v Ostravě kvůli rozvodu. Výkup proběhl za 10 dní a oba manželé dostali férový podíl.",
  datePublished: "2025-03-01",
  dateModified: "2025-03-01",
  author: { "@type": "Organization", name: "Výkup Nemovitostí" },
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: SITE_URL,
  },
  mainEntityOfPage: `${SITE_URL}/reference/rozvod-ostrava`,
};

interface TimelineStep {
  day: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineStep[] = [
  {
    day: "Den 1",
    title: "Poptávka paní K.",
    description:
      "Paní K. zavolala s urgentní potřebou prodat společný byt. Manžel souhlasil s rychlým výkupem.",
  },
  {
    day: "Den 2",
    title: "Prohlídka a ocenění",
    description:
      "Prohlédli jsme byt 3+1 v Ostravě-Porubě. Nabídka 2 650 000 Kč — oba manželé souhlasili.",
  },
  {
    day: "Den 4–6",
    title: "Právní příprava",
    description:
      "Koordinace s advokáty obou stran. Kupní smlouva zohledňující rozvodové řízení a rozdělení výnosu 50:50.",
  },
  {
    day: "Den 8",
    title: "Podpis smlouvy",
    description:
      "Oba manželé podepsali kupní smlouvu. Částka uložena do advokátní úschovy.",
  },
  {
    day: "Den 10",
    title: "Vyplacení a předání",
    description:
      "Po zápisu do katastru obdržel každý z manželů svůj podíl. Byt předán.",
  },
];

export default function RozvodOstravaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleLd) }}
      />

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Breadcrumbs
            items={[
              { label: "Reference", href: "/reference" },
              { label: "Rozvod Ostrava", href: "/reference/rozvod-ostrava" },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Rychlý prodej bytu při rozvodu za&nbsp;10&nbsp;dní
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Paní K. z Ostravy procházela rozvodem a potřebovala rychle vyřešit
            společnou nemovitost. Výkup proběhl hladce a oba manželé dostali
            férový podíl.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-6 py-16">
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Situace klientky
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="leading-relaxed text-slate-600">
              Paní K. (38 let) a její manžel vlastnili byt 3+1 v Ostravě-Porubě
              v SJM (společném jmění manželů). Po podání návrhu na rozvod se
              dohodli, že byt prodají a výnos si rozdělí. Tržní hodnota bytu
              činila přibližně <strong>2 900 000 Kč</strong>. Paní K.
              potřebovala peníze co nejdříve na kauci nového bydlení pro sebe a
              dvě děti.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Problém</h2>
          <ul className="space-y-3">
            {[
              "Napjatá atmosféra — manželé spolu nechtěli komunikovat",
              "Standardní prodej přes realitku by trval měsíce",
              "Paní K. urgentně potřebovala prostředky na nové bydlení",
              "Hypotéka na bytě stále běžela — 1 100 000 Kč zůstatek",
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
              Fungovali jsme jako neutrální prostředník. S každým manželem jsme
              komunikovali zvlášť přes jejich advokáty. Zajistili jsme splacení
              hypotéky z kupní ceny a férové rozdělení zbytku. Celý proces byl
              transparentní a bez emocí.
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--theme-100)] text-sm font-bold text-[var(--theme-700)]">
                    <Clock className="h-5 w-5" />
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className="mt-2 h-full w-px bg-[var(--theme-200)]" />
                  )}
                </div>
                <div className="pb-6">
                  <p className="text-sm font-semibold text-[var(--theme-700)]">
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
              { icon: Clock, label: "Doba prodeje", value: "10 dní" },
              {
                icon: TrendingUp,
                label: "Výkupní cena",
                value: "2 650 000 Kč",
              },
              {
                icon: CheckCircle,
                label: "Čistý zisk po hypotéce",
                value: "1 550 000 Kč",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <Icon className="mx-auto mb-2 h-8 w-8 text-[var(--theme-600)]" />
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-slate-600">
            Po splacení hypotéky <strong>1 100 000 Kč</strong> zbylo{" "}
            <strong>1 550 000 Kč</strong> k rozdělení. Každý manžel obdržel{" "}
            <strong>775 000 Kč</strong> čistého. Paní K. si ihned zajistila nový
            pronájem pro sebe a děti.
          </p>
        </section>

        <section className="rounded-2xl bg-[var(--theme-50)] p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Procházíte rozvodem?
          </h2>
          <p className="mb-6 text-slate-600">
            Pomůžeme vám rychle a férově vyřešit společnou nemovitost.
          </p>
          <Link
            href="/vykup-pri-rozvodu"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-700)] px-8 py-3 font-semibold text-white transition hover:bg-[var(--theme-800)]"
          >
            Více o výkupu při rozvodu
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </article>
    </>
  );
}
