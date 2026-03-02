import type { Metadata } from "next";
import Link from "next/link";
import { Clock, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://www.vykupnemovitosticz.cz";

export const metadata: Metadata = {
  title: "Výkup bytu při exekuci v Praze – příběh paní N. | Reference",
  description:
    "Paní N. čelila exekuci na byt v Praze. Díky rychlému výkupu prodala nemovitost za 7 dní a vyřešila dluhy. Přečtěte si její příběh.",
  alternates: { canonical: `${SITE_URL}/reference/exekuce-praha` },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Výkup bytu při exekuci v Praze – příběh paní N.",
  description:
    "Paní N. čelila exekuci na byt v Praze. Díky rychlému výkupu prodala nemovitost za 7 dní a vyřešila dluhy.",
  datePublished: "2025-03-01",
  dateModified: "2025-03-01",
  author: { "@type": "Organization", name: "Výkup Nemovitostí" },
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: SITE_URL,
  },
  mainEntityOfPage: `${SITE_URL}/reference/exekuce-praha`,
};

interface TimelineStep {
  day: string;
  title: string;
  description: string;
}

const TIMELINE: TimelineStep[] = [
  {
    day: "Den 1",
    title: "První kontakt",
    description:
      "Paní N. vyplnila online formulář. Do 30 minut jsme ji kontaktovali telefonicky.",
  },
  {
    day: "Den 2",
    title: "Prohlídka a nabídka",
    description:
      "Prohlédli jsme byt 2+kk na Praze 4 a předložili nezávaznou nabídku 3 850 000 Kč.",
  },
  {
    day: "Den 3–4",
    title: "Právní příprava",
    description:
      "Naši právníci připravili kupní smlouvu a komunikovali s exekutorským úřadem o zrušení zástavy.",
  },
  {
    day: "Den 5",
    title: "Podpis smlouvy",
    description:
      "Smlouva podepsána u notáře. Záloha 500 000 Kč převedena na účet paní N. tentýž den.",
  },
  {
    day: "Den 7",
    title: "Vyplacení a předání",
    description:
      "Doplatek 3 350 000 Kč na účtu. Exekuce splacena. Byt předán bez komplikací.",
  },
];

export default function ExekucePrahaPage() {
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
              { label: "Exekuce Praha", href: "/reference/exekuce-praha" },
            ]}
          />
          <h1 className="mt-6 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Prodej bytu při exekuci za&nbsp;7&nbsp;dní
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Paní N. z Prahy čelila exekuci a hrozila jí dražba bytu. Díky
            rychlému výkupu vyřešila situaci bez stresu a zachránila většinu
            hodnoty nemovitosti.
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
              Paní N. (52 let) vlastnila byt 2+kk na Praze 4. Po ztrátě
              zaměstnání přestala splácet hypotéku a po dvou letech se situace
              vyostřila - exekutor zahájil řízení a hrozila nucená dražba. Tržní
              hodnota bytu činila přibližně <strong>4 200 000 Kč</strong>, ale
              dluh narostl na <strong>2 900 000 Kč</strong> včetně
              příslušenství.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Problém</h2>
          <ul className="space-y-3">
            {[
              "Exekutor naplánoval dražbu za 3 týdny",
              "Realitní kanceláře odmítaly nemovitost s exekucí nabízet",
              "Banka odmítla refinancování kvůli špatnému skóre",
              "Hrozba ztráty bytu za zlomek hodnoty v dražbě",
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
              Nabídli jsme přímý výkup bytu bez realitní kanceláře. Naši
              právníci komunikovali přímo s exekutorským úřadem a zajistili
              uvolnění zástavy při podpisu smlouvy. Paní N. nemusela řešit žádné
              papírování - vše jsme vyřídili za ni.
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
              { icon: Clock, label: "Doba prodeje", value: "7 dní" },
              {
                icon: TrendingUp,
                label: "Výkupní cena",
                value: "3 850 000 Kč",
              },
              {
                icon: CheckCircle,
                label: "Čistý zisk klientky",
                value: "950 000 Kč",
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
            Paní N. splatila celý dluh <strong>2 900 000 Kč</strong> a zbylo jí{" "}
            <strong>950 000 Kč</strong> na nový začátek. Bez dražby by
            pravděpodobně přišla o vše.
          </p>
        </section>

        <section className="rounded-2xl bg-[var(--theme-50)] p-8 text-center">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            Řešíte podobnou situaci?
          </h2>
          <p className="mb-6 text-slate-600">
            Pomůžeme vám s rychlým prodejem nemovitosti při exekuci.
          </p>
          <Link
            href="/vykup-pri-exekuci"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--theme-700)] px-8 py-3 font-semibold text-white transition hover:bg-[var(--theme-800)]"
          >
            Více o výkupu při exekuci
            <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </article>
    </>
  );
}
