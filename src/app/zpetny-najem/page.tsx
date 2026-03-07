import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  FileSignature,
  HandCoins,
  KeyRound,
  MapPin,
  Building2,
  Banknote,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { RentCalculator } from "@/components/rent-calculator";
import { ZpetnyNajemForm } from "@/components/zpetny-najem-form";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/zpetny-najem" },
  title:
    "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet | vykoupim-nemovitost.cz",
  description:
    "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí. Férové podmínky, rychlé vyřízení.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Mohu po prodeji zůstat v nemovitosti bydlet?",
    answer:
      "Ano, to je podstata zpětného nájmu. Po prodeji s vámi uzavřeme nájemní smlouvu a vy zůstáváte bydlet ve svém domově tak dlouho, jak potřebujete.",
  },
  {
    question: "Jak dlouho mohu v nemovitosti zůstat?",
    answer:
      "Doba nájmu je flexibilní a záleží na vaší dohodě. Standardně nabízíme smlouvy na 1–5 let s možností prodloužení. Konkrétní podmínky nastavíme podle vašich potřeb.",
  },
  {
    question: "Kolik budu platit za nájem?",
    answer:
      "Nájemné stanovujeme férově podle aktuálních tržních cen v dané lokalitě. Přesnou částku vám sdělíme předem v rámci nezávazné nabídky, abyste se mohli svobodně rozhodnout. Orientační výši si můžete spočítat v naší kalkulačce výše.",
  },
  {
    question: "Pro koho je zpětný nájem vhodný?",
    answer:
      "Zpětný nájem je ideální pro seniory, kteří potřebují uvolnit finance z nemovitosti, pro lidi řešící dluhy či exekuce, nebo pro kohokoli, kdo potřebuje rychle peníze, ale nechce se stěhovat.",
  },
  {
    question: "Jaká je výkupní cena při zpětném nájmu?",
    answer:
      "Výkupní cena se odvíjí od tržní hodnoty nemovitosti a zpravidla činí 70–85 % odhadní ceny. Konkrétní nabídku připravíme do 24 hodin po vaší poptávce.",
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
    title: "1. Nezávazná nabídka",
    description:
      "Vyplňte formulář nebo zavolejte. Do 24 hodin obdržíte cenovou nabídku včetně podmínek zpětného nájmu.",
  },
  {
    icon: FileSignature,
    title: "2. Dohoda podmínek",
    description:
      "Společně nastavíme výši nájmu, dobu trvání smlouvy a další podmínky podle vašich potřeb.",
  },
  {
    icon: KeyRound,
    title: "3. Prodej a nájemní smlouva",
    description:
      "Podepíšeme kupní smlouvu i nájemní smlouvu současně. Peníze dostanete ihned po zápisu do katastru.",
  },
  {
    icon: Home,
    title: "4. Bydlíte dál",
    description:
      "Zůstáváte ve svém domově jako nájemník. Žádné stěhování, žádný stres.",
  },
] as const;

interface CaseStudy {
  name: string;
  location: string;
  propertyType: string;
  icon: React.ComponentType<{ className?: string }>;
  purchasePrice: string;
  monthlyRent: string;
  story: string;
  quote: string;
}

const CASE_STUDIES: readonly CaseStudy[] = [
  {
    name: "Pan Novák z Brna",
    location: "Brno, Jihomoravský kraj",
    propertyType: "Byt 3+1, 72 m²",
    icon: Building2,
    purchasePrice: "3 200 000 Kč",
    monthlyRent: "14 500 Kč",
    story:
      "Pan Novák (58 let) se dostal do finančních potíží kvůli podnikatelskému úvěru. Hrozila mu exekuce na byt, ve kterém bydlel s rodinou přes 20 let. Díky zpětnému nájmu prodal nemovitost, splatil dluhy a rodina zůstala bydlet ve svém domově.",
    quote:
      "Zachránili jsme bydlení pro celou rodinu. Děti nemusely měnit školu a my máme klid.",
  },
  {
    name: "Paní Svobodová z Prahy",
    location: "Praha 4, Praha",
    propertyType: "Byt 2+kk, 54 m²",
    icon: MapPin,
    purchasePrice: "4 800 000 Kč",
    monthlyRent: "18 900 Kč",
    story:
      "Paní Svobodová (67 let), seniorka žijící sama, potřebovala finance na nákladnou léčbu a pomoc vnukům se studiem. Klasický prodej by znamenal stěhování z bytu, kde žila 30 let. Se zpětným nájmem získala potřebné prostředky a zůstala bydlet doma.",
    quote:
      "Prodala jsem a zůstala bydlet. Konečně mám finance na to, co je důležité, a nemusela jsem opustit svůj domov.",
  },
] as const;

export default async function ZpetnyNajemPage(): Promise<React.ReactElement> {
  const host = await getRequestHost();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet",
    description:
      "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí.",
    author: {
      "@type": "Organization",
      name: "vykoupim-nemovitost.cz",
      url: "https://vykoupim-nemovitost.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "vykoupim-nemovitost.cz",
      url: "https://vykoupim-nemovitost.cz",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vykoupim-nemovitost.cz/zpetny-najem",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domů",
        item: "https://vykoupim-nemovitost.cz",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Služby",
        item: "https://vykoupim-nemovitost.cz/#sluzby",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Zpětný nájem",
        item: "https://vykoupim-nemovitost.cz/zpetny-najem",
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Výkup nemovitostí se zpětným nájmem",
    name: "Zpětný nájem — prodej a zůstaňte bydlet",
    description:
      "Odkoupíme vaši nemovitost a uzavřeme s vámi nájemní smlouvu. Získáte peníze ihned a zůstanete bydlet ve svém domově.",
    provider: {
      "@type": "Organization",
      name: "vykoupim-nemovitost.cz",
      url: "https://vykoupim-nemovitost.cz",
      telephone: "+420725877076",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CZ",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Česká republika",
    },
    url: "https://vykoupim-nemovitost.cz/zpetny-najem",
    termsOfService: "https://vykoupim-nemovitost.cz/ochrana-osobnich-udaju",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                { label: "Zpětný nájem", href: "/zpetny-najem" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Prodejte nemovitost a zůstaňte bydlet — zpětný nájem
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Zpětný nájem (sale and leaseback) je moderní způsob, jak získat
            peníze z nemovitosti, aniž byste se museli stěhovat. Prodáte nám
            svůj byt nebo dům a současně s vámi uzavřeme nájemní smlouvu — vy
            bydlíte dál ve svém domově.
          </p>
          <p className="mt-4 text-slate-600">
            Toto řešení je ideální pro seniory, kteří chtějí uvolnit finance
            vázané v nemovitosti, pro lidi v tíživé finanční situaci, nebo pro
            kohokoli, kdo potřebuje rychle hotovost, ale nechce měnit své
            bydlení.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od klasického prodeje nemusíte řešit stěhování, hledání
            nového bydlení ani změnu adresy. Vše zůstává při starém — jen místo
            vlastníka se stáváte nájemníkem s garantovanými podmínkami.
          </p>
          <p className="mt-4 text-slate-600">
            Nabízíme férovou výkupní cenu odpovídající 80–90 % tržní hodnoty a
            transparentní nájemní podmínky. Celý proces vyřídíme diskrétně a
            rychle — peníze můžete mít už do 14 dnů.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#formular-zpetny-najem"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Chci zpětný nájem
            </Link>
            <Link
              href="#kalkulacka"
              className="inline-flex items-center rounded-xl border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Spočítat nájem
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-emerald-500" /> Zůstanete bydlet
          </span>
          <span className="flex items-center gap-2">
            <HandCoins className="h-4 w-4 text-emerald-500" /> Peníze ihned
          </span>
          <span className="flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-emerald-500" /> Férový nájem
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Jak to funguje</h2>
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

      {/* Rent Calculator (AC-1) */}
      <RentCalculator />

      {/* Case Studies (AC-3) */}
      <section className="bg-slate-50 py-16" id="pripadove-studie">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Příběhy našich klientů
          </h2>
          <p className="mt-2 text-slate-600">
            Zpětný nájem pomohl desítkám rodin v celé České republice. Zde jsou
            dva příklady.
          </p>

          <div className="mt-8 space-y-6">
            {CASE_STUDIES.map((cs) => (
              <div
                key={cs.name}
                className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <cs.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {cs.name}
                    </h3>
                    <p className="text-sm text-slate-500">{cs.location}</p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-center text-sm">
                  <div>
                    <Building2 className="mx-auto h-4 w-4 text-slate-400" />
                    <p className="mt-1 font-medium text-slate-700">
                      {cs.propertyType}
                    </p>
                  </div>
                  <div>
                    <Banknote className="mx-auto h-4 w-4 text-slate-400" />
                    <p className="mt-1 font-medium text-slate-700">
                      {cs.purchasePrice}
                    </p>
                    <p className="text-xs text-slate-500">výkupní cena</p>
                  </div>
                  <div>
                    <Home className="mx-auto h-4 w-4 text-slate-400" />
                    <p className="mt-1 font-medium text-slate-700">
                      {cs.monthlyRent}
                    </p>
                    <p className="text-xs text-slate-500">měsíční nájem</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {cs.story}
                </p>

                <blockquote className="mt-4 border-l-4 border-emerald-300 pl-4 text-sm italic text-slate-700">
                  &ldquo;{cs.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated CTA Form (AC-2) */}
      <ZpetnyNajemForm />

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy ke zpětnému nájmu
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

      {/* Bottom CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Získejte peníze a zůstaňte doma
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Zjistěte, kolik můžete získat a za
              jakých podmínek.
            </p>
            <div className="mt-6">
              <Link
                href="#formular-zpetny-najem"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Chci nezávaznou nabídku
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles articles={getRelatedArticles("zpetny-najem")} />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
