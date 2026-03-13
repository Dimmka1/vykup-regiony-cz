import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  Scale,
  HandCoins,
  Home,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { buildGeoCanonicalUrl } from "@/lib/geo-canonical";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-pri-rozvodu", params);

  return {
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
    title: "Výkup nemovitosti při rozvodu - rychlé vypořádání majetku",
    description:
      "Řešíte rozvod a potřebujete rychle prodat společnou nemovitost? Vykoupíme váš byt nebo dům za férovou cenu. Diskrétně a bez provize.",
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Mohu prodat nemovitost při rozvodu bez souhlasu partnera?",
    answer:
      "Pokud je nemovitost ve společném jmění manželů, je k prodeji potřeba souhlas obou stran. Pokud vlastníte nemovitost výhradně vy (např. jste ji zdědili nebo koupili před manželstvím), můžete ji prodat samostatně.",
  },
  {
    question: "Jak se rozdělí peníze z prodeje?",
    answer:
      "Rozdělení závisí na dohodě obou manželů nebo na rozhodnutí soudu o vypořádání společného jmění. Peníze z prodeje převedeme podle vaší dohody - každému jeho podíl na úschovní účet.",
  },
  {
    question: "Jak rychle můžeme nemovitost prodat?",
    answer:
      "Od prvního kontaktu po vyplacení peněz to může být i 7 dní. Rychlý prodej vám umožní uzavřít tuto kapitolu a soustředit se na nový začátek.",
  },
  {
    question: "Co když na nemovitosti vázne hypotéka?",
    answer:
      "Zbývající hypotéku uhradíme přímo bance z kupní ceny. Rozdíl mezi kupní cenou a zbytkem hypotéky vyplatíme vám dle dohodnutého poměru.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: Home,
    title: "1. Ocenění nemovitosti",
    description:
      "Zdarma oceníme vaši nemovitost a do 24 hodin vám sdělíme nabídku.",
  },
  {
    icon: Scale,
    title: "2. Dohoda obou stran",
    description:
      "Pomůžeme nastavit podmínky prodeje, které vyhovují oběma manželům.",
  },
  {
    icon: HandCoins,
    title: "3. Férový prodej",
    description:
      "Nabídneme 80–90 % tržní hodnoty. Náklady na převod hradíme my.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Peníze rozdělíme dle dohody a vyplatíme do několika dnů.",
  },
] as const;

export default async function VykupPriRozvoduPage(): Promise<React.ReactElement> {
  const host = await getRequestHost();
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                { label: "Výkup při rozvodu", href: "/vykup-pri-rozvodu" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti při rozvodu
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Rozvod je náročné životní období a vypořádání společné nemovitosti
            bývá jedním z nejtěžších kroků. Pomůžeme vám prodat nemovitost
            rychle, férově a bez zbytečných sporů.
          </p>
          <p className="mt-4 text-slate-600">
            Při rozvodu se manželé často neshodnou na dalším využití společné
            nemovitosti. Jeden chce bydlet dál, druhý chce svůj podíl vyplatit.
            Rychlý výkup je řešení, které vyhovuje oběma stranám.
          </p>
          <p className="mt-4 text-slate-600">
            Nabídneme férovou cenu odpovídající 80–90 % tržní hodnoty. Peníze z
            prodeje rozdělíme podle vaší dohody nebo rozhodnutí soudu - každému
            jeho podíl na úschovní účet.
          </p>
          <p className="mt-4 text-slate-600">
            Pokud na nemovitosti vázne hypotéka, není to překážka. Zbývající
            dluh uhradíme přímo bance z kupní ceny. Vy se zbavíte závazku a
            můžete začít novou etapu života.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces probíhá diskrétně a profesionálně. Veškerou
            administrativu, právní služby i komunikaci s katastrem zajistíme za
            vás. Neplatíte žádné provize ani poplatky.
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
            <Clock className="h-4 w-4 text-emerald-500" /> Výplata do 7 dnů
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> 100% diskrétní
            jednání
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak vám pomůžeme
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

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu při rozvodu
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
              Vyřešte prodej nemovitosti při rozvodu rychle a férově
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Diskrétní přístup garantován.
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
          <RelatedArticles articles={getRelatedArticles("vykup-pri-rozvodu")} />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
