import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  FileSignature,
  HandCoins,
  KeyRound,
  Shield,
  Users,
  Banknote,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/vykup-s-najmem",
  },
  title:
    "Zpětný výkup nemovitosti s nájmem — prodejte a zůstaňte bydlet | vykoupim-nemovitost.cz",
  description:
    "Zpětný výkup s nájmem (sale-leaseback): prodejte nemovitost a zůstaňte v ní bydlet jako nájemník. Rychlé peníze, férový nájem, žádné stěhování. Nabídka zdarma do 24 h.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jak se zpětný výkup s nájmem liší od klasického prodeje?",
    answer:
      "Při klasickém prodeji se musíte vystěhovat. Při zpětném výkupu s nájmem prodáte nemovitost, ale současně podepíšete nájemní smlouvu — zůstáváte bydlet ve svém domově jako nájemník. Získáte peníze ihned a nemusíte řešit stěhování ani hledání nového bydlení.",
  },
  {
    question: "Mohu nemovitost v budoucnu odkoupit zpět?",
    answer:
      "Ano, v rámci smlouvy je možné sjednat předkupní právo. Pokud se vaše finanční situace zlepší, můžete nemovitost odkoupit zpět za předem dohodnutých podmínek. Tuto možnost doporučujeme projednat již při uzavírání smlouvy.",
  },
  {
    question: "Jaké jsou podmínky nájmu po zpětném výkupu?",
    answer:
      "Nájemné stanovujeme férově podle aktuálních tržních cen v dané lokalitě. Doba nájmu je flexibilní — standardně 1–5 let s možností prodloužení. Vše nastavíme podle vašich potřeb ještě před podpisem kupní smlouvy, abyste přesně věděli, co vás čeká.",
  },
  {
    question: "Je zpětný výkup s nájmem vhodný, když mám exekuci nebo dluhy?",
    answer:
      "Právě v těchto situacích je zpětný výkup s nájmem nejčastěji využíván. Z kupní ceny uhradíme vaše dluhy či exekuce a vy zůstanete bydlet. Vyhnete se tak nucené dražbě i vystěhování. Celý proces vyřídíme diskrétně a rychle.",
  },
  {
    question: "Jak rychle mohu získat peníze ze zpětného výkupu?",
    answer:
      "Peníze můžete mít do 14 dnů od prvního kontaktu. Po dohodě podmínek podepíšeme kupní i nájemní smlouvu současně. Částka je vyplacena ihned po zápisu do katastru nemovitostí.",
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
      "Společně nastavíme výkupní cenu, výši nájmu a dobu trvání nájemní smlouvy podle vašich potřeb.",
  },
  {
    icon: KeyRound,
    title: "3. Podpis smluv",
    description:
      "Podepíšeme kupní smlouvu i nájemní smlouvu současně. Peníze dostanete ihned po zápisu do katastru.",
  },
  {
    icon: Home,
    title: "4. Zůstáváte doma",
    description:
      "Bydlíte dál ve svém domově jako nájemník. Žádné stěhování, žádný stres — vše zůstává při starém.",
  },
] as const;

interface TargetGroup {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const TARGET_GROUPS: readonly TargetGroup[] = [
  {
    icon: Shield,
    title: "Exekuce a dluhy",
    description:
      "Hrozí vám dražba? Zpětný výkup zastaví exekuci a vy nemusíte opustit domov.",
  },
  {
    icon: Banknote,
    title: "Potřeba hotovosti",
    description:
      "Potřebujete rychle peníze na léčbu, podnikání nebo investici? Uvolněte finance z nemovitosti bez stěhování.",
  },
  {
    icon: Users,
    title: "Senioři a důchodci",
    description:
      "Získejte peníze na důstojný život ve stáří. Zůstanete ve svém domově, kde jste celý život žili.",
  },
] as const;

export default async function VykupSNajmemPage(): Promise<React.ReactElement> {
  const host = await getRequestHost();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Zpětný výkup nemovitosti s nájmem",
    name: "Zpětný výkup nemovitosti s nájmem (sale-leaseback)",
    description:
      "Prodejte nemovitost a zůstaňte v ní bydlet jako nájemník. Rychlé peníze, férový nájem, žádné stěhování.",
    provider: {
      "@type": "Organization",
      name: "vykoupim-nemovitost.cz",
      url: "https://vykoupim-nemovitost.cz",
    },
    areaServed: {
      "@type": "Country",
      name: "Česká republika",
    },
    url: "https://vykoupim-nemovitost.cz/vykup-s-najmem",
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
        name: "Zpětný výkup s nájmem",
        item: "https://vykoupim-nemovitost.cz/vykup-s-najmem",
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                {
                  label: "Zpětný výkup s nájmem",
                  href: "/vykup-s-najmem",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Prodejte nemovitost a zůstaňte bydlet — zpětný výkup s nájmem
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Zpětný výkup s nájmem (sale-leaseback) je řešení pro ty, kdo
            potřebují rychle peníze z nemovitosti, ale nechtějí se stěhovat.
            Prodáte nám svůj byt nebo dům a současně uzavřeme nájemní smlouvu —
            vy bydlíte dál ve svém domově.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od klasického prodeje se nemusíte starat o stěhování,
            hledání nového bydlení ani změnu adresy dětí ve škole. Vše zůstává
            při starém — jen místo vlastníka se stáváte nájemníkem s
            garantovanými podmínkami.
          </p>
          <p className="mt-4 text-slate-600">
            Toto řešení využívají zejména lidé v&nbsp;exekuci, s&nbsp;dluhy,
            senioři i ti, kdo potřebují rychle uvolnit kapitál. Nabízíme férovou
            výkupní cenu 80–90&nbsp;% tržní hodnoty a transparentní nájemní
            podmínky.
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

      {/* Trust strip */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Home className="h-4 w-4 text-emerald-500" /> Zůstanete bydlet
          </span>
          <span className="flex items-center gap-2">
            <HandCoins className="h-4 w-4 text-emerald-500" /> Peníze do 14 dnů
          </span>
          <span className="flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-emerald-500" /> Férový nájem
          </span>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak zpětný výkup s nájmem funguje
          </h2>
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

      {/* Target groups */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je zpětný výkup s nájmem
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {TARGET_GROUPS.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <group.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {group.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {group.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy ke zpětnému výkupu s nájmem
          </h2>
          <div className="mt-8 space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <details
                key={index}
                className="group rounded-2xl bg-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md"
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
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Získejte peníze a zůstaňte doma
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Zjistěte, kolik můžete získat a za
              jakých podmínek budete dál bydlet.
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

      {/* Related articles */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles articles={getRelatedArticles("vykup-s-najmem")} />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
