import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Clock, BadgeCheck, HandCoins } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { GeoRelatedPages } from "@/components/geo-related-pages";
import { getRequestHost } from "@/lib/request-host";
import { buildGeoCanonicalUrl } from "@/lib/geo-canonical";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const canonicalUrl = buildGeoCanonicalUrl("/vykup-pri-exekuci", params);

  return {
    alternates: { canonical: canonicalUrl },
    openGraph: { url: canonicalUrl },
    title: "Výkup nemovitosti při exekuci - rychlé řešení bez starostí",
    description:
      "Prodejte nemovitost zatíženou exekucí rychle a diskrétně. Vyřešíme dluhy, uhradíme exekuci z kupní ceny a vyplatíme vás do 7 dnů. Bez provize.",
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Lze prodat nemovitost v exekuci?",
    answer:
      "Ano, prodej nemovitosti v exekuci je možný se souhlasem exekutora. My se postaráme o veškerou komunikaci s exekutorským úřadem a zajistíme hladký průběh celého procesu.",
  },
  {
    question: "Kolik za nemovitost v exekuci dostanu?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty nemovitosti. Z kupní ceny uhradíme exekuční pohledávky a zbytek vyplatíme přímo vám. Neplatíte žádné provize ani skryté poplatky.",
  },
  {
    question: "Jak rychle proběhne výkup?",
    answer:
      "Od prvního kontaktu po vyplacení peněz to může být i 7 dní. Standardně celý proces trvá 2–4 týdny včetně vyřízení exekuce a zápisu do katastru.",
  },
  {
    question: "Co když mám více exekucí na nemovitosti?",
    answer:
      "I v případě více exekucí dokážeme situaci vyřešit. Naši právníci koordinují úhradu všech pohledávek z kupní ceny tak, aby byl prodej co nejrychlejší a nejvýhodnější pro vás.",
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
      "Vyplňte formulář a do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Shield,
    title: "2. Právní prověření",
    description:
      "Naši právníci prověří stav exekuce a připraví optimální řešení.",
  },
  {
    icon: BadgeCheck,
    title: "3. Dohoda s exekutorem",
    description: "Zajistíme souhlas exekutora a připravíme kupní smlouvu.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Uhradíme dluhy z kupní ceny a zbytek vyplatíme přímo vám.",
  },
] as const;

export default async function VykupPriExekuciPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const host = await getRequestHost();
  const params = await searchParams;
  const krajParam = typeof params.kraj === "string" ? params.kraj : null;
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
                { label: "Výkup při exekuci", href: "/vykup-pri-exekuci" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti při exekuci
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Exekuce na nemovitost je stresující situace, ale existuje cesta ven.
            Pomůžeme vám nemovitost rychle prodat, uhradit dluhy a začít znovu -
            bez zbytečných průtahů a bez provize.
          </p>
          <p className="mt-4 text-slate-600">
            Mnoho majitelů neví, že nemovitost zatíženou exekucí lze legálně
            prodat. Klíčem je spolupráce s exekutorským úřadem a správné právní
            zajištění celého procesu. Přesně to za vás vyřešíme.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od dražby, kde nemovitost často odejde pod cenou, vám
            nabídneme férovou cenu odpovídající 80–90 % tržní hodnoty. Exekuční
            pohledávky uhradíme přímo z kupní ceny, takže se zbavíte dluhů
            jedním krokem.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces probíhá diskrétně - vaši sousedé ani okolí se o prodeji
            nedozví. Veškeré náklady na právní služby, odhad a převod hradíme
            my.
          </p>
          <p className="mt-4 text-slate-600">
            Pokud vám hrozí nucená dražba, neváhejte nás kontaktovat co
            nejdříve. Čím dříve začneme, tím lepší podmínky pro vás dokážeme
            vyjednat.
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
            Časté dotazy k výkupu při exekuci
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
              Zbavte se exekuce ještě dnes
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Pomůžeme vám najít nejlepší řešení.
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
          <RelatedArticles articles={getRelatedArticles("vykup-pri-exekuci")} />
        </div>
      </section>

      <LeadMagnetCta />
      <GeoRelatedPages
        currentSlug="vykup-pri-exekuci"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
