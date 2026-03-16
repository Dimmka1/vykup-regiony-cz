import type { Metadata } from "next";
import Link from "next/link";
import { Home, FileSignature, HandCoins, KeyRound } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { RentCalculator } from "@/components/rent-calculator";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { GeoRelatedPages } from "@/components/geo-related-pages";
import { getRequestHost } from "@/lib/request-host";
import { buildGeoCanonicalUrl } from "@/lib/geo-canonical";
import {
  resolveGeoRegion,
  injectRegionIntoTitle,
  injectRegionIntoDescription,
  injectRegionIntoH1,
} from "@/lib/geo-seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const canonicalUrl = buildGeoCanonicalUrl("/zpetny-najem", params);
  const region = resolveGeoRegion(params);

  return {
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet | vykoupim-nemovitost.cz",
          region.locative,
        )
      : "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet | vykoupim-nemovitost.cz",
    description: region
      ? injectRegionIntoDescription(
          "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí. Férové podmínky, rychlé vyřízení.",
          region.locative,
        )
      : "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí. Férové podmínky, rychlé vyřízení.",
  };
}

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
      "Nájemné stanovujeme férově podle aktuálních tržních cen v dané lokalitě. Přesnou částku vám sdělíme předem v rámci nezávazné nabídky, abyste se mohli svobodně rozhodnout.",
  },
  {
    question: "Pro koho je zpětný nájem vhodný?",
    answer:
      "Zpětný nájem je ideální pro seniory, kteří potřebují uvolnit finance z nemovitosti, pro lidi řešící dluhy či exekuce, nebo pro kohokoli, kdo potřebuje rychle peníze, ale nechce se stěhovat.",
  },
  {
    question: "Mohu si nemovitost odkoupit zpět?",
    answer:
      "Ano, nabízíme možnost zpětného odkupu nemovitosti. Nemusíte dokládat příjmy — stačí dodržet sjednané podmínky a termín odkupu stanovený ve smlouvě. Konkrétní podmínky zpětného odkupu (cenu a lhůtu) nastavíme individuálně při podpisu smlouvy.",
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

export default async function ZpetnyNajemPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const host = await getRequestHost();
  const params = await searchParams;
  const krajParam = typeof params.kraj === "string" ? params.kraj : null;
  const region = resolveGeoRegion(params);

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
            {region
              ? injectRegionIntoH1(
                  "Prodejte nemovitost a zůstaňte bydlet — zpětný nájem",
                  region.locative,
                )
              : "Prodejte nemovitost a zůstaňte bydlet — zpětný nájem"}
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
          <div className="mt-8">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
          </div>
        </div>
      </section>

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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Kolik budete platit v nájmu?
          </h2>
          <p className="mt-2 text-slate-600">
            Orientační výpočet měsíčního nájmu podle ceny vaší nemovitosti.
          </p>
          <div className="mt-8">
            <RentCalculator />
          </div>
        </div>
      </section>

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
                href="/#kontakt"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Chci nezávaznou nabídku
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles articles={getRelatedArticles("zpetny-najem")} />
        </div>
      </section>

      <GeoRelatedPages currentSlug="zpetny-najem" currentKraj={krajParam} />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
