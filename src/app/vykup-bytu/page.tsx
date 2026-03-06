import type { Metadata } from "next";
import { ShareButtons } from "@/components/share-buttons";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Building2,
  Users,
  AlertTriangle,
  Key,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/vykup-bytu" },
  title: "Výkup bytů - rychlý prodej bytu za hotové do 7 dnů",
  description:
    "Vykoupíme váš byt rychle a bez provize. Osobní, družstevní i problémové byty. Férová cena 80–90 % tržní hodnoty, vyplacení do 7 dnů. Celá ČR.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jak rychle dokážete byt vykoupit?",
    answer:
      "Od prvního kontaktu po vyplacení peněz to může být i 7 dní. Standardně celý proces trvá 2–4 týdny včetně právního prověření a zápisu do katastru nemovitostí.",
  },
  {
    question: "Vykupujete i družstevní byty?",
    answer:
      "Ano, vykupujeme družstevní byty včetně převodu členských práv. Zajistíme komunikaci s družstvem a vyřešíme veškeré formality spojené s převodem.",
  },
  {
    question: "Co když je v bytě nájemník?",
    answer:
      "Byty s nájemníkem vykupujeme také. Nájemní vztah není překážkou - ocenění zohledníme dle aktuálního stavu a podmínek nájemní smlouvy.",
  },
  {
    question: "Kolik za byt nabídnete?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty bytu. Přesnou nabídku obdržíte do 24 hodin po vyplnění formuláře. Neplatíte žádnou provizi ani skryté poplatky - veškeré náklady hradíme my.",
  },
] as const;

interface Situation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SITUATIONS: readonly Situation[] = [
  {
    icon: AlertTriangle,
    title: "Potřebujete rychle peníze",
    description:
      "Finanční tíseň, splátky, neočekávané výdaje - vykoupíme byt rychle a vyplatíme vás do 7 dnů.",
  },
  {
    icon: Users,
    title: "Spoluvlastníci se nemohou dohodnout",
    description:
      "Zděděný nebo společný byt, kde se spoluvlastníci neshodnou na prodeji? Vyřešíme to za vás.",
  },
  {
    icon: Building2,
    title: "Byt potřebuje rekonstrukci",
    description:
      "Starší byt v horším stavu, do kterého nechcete investovat? Vykoupíme ho v jakémkoli stavu.",
  },
  {
    icon: Key,
    title: "Byt s nájemníkem",
    description:
      "Nechcete řešit pronájem a správu bytu? Odkoupíme byt i s existujícím nájemním vztahem.",
  },
] as const;

const STEPS: readonly {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
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
      "Prověříme stav bytu v katastru, právní zatížení a připravíme smlouvu.",
  },
  {
    icon: BadgeCheck,
    title: "3. Podpis smlouvy",
    description:
      "Připravíme kupní smlouvu a zajistíme bezpečný převod vlastnictví.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Peníze obdržíte na účet do 7 dnů od podpisu smlouvy.",
  },
] as const;

export default async function VykupBytuPage(): Promise<React.ReactElement> {
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

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Výkup bytů - rychlý prodej bytu za hotové",
    description: metadata.description,
    url: "https://vykoupim-nemovitost.cz/vykup-bytu",
    isPartOf: { "@type": "WebSite", url: "https://vykoupim-nemovitost.cz" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                { label: "Výkup bytů", href: "/vykup-bytu" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup bytů - rychle, férově a bez provize
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Potřebujete prodat byt rychle a bez starostí? Vykoupíme váš byt za
            férovou cenu odpovídající 80–90 % tržní hodnoty. Celý proces
            zvládneme do 7 dnů - od první konzultace po vyplacení peněz na váš
            účet.
          </p>
          <p className="mt-4 text-slate-600">
            Specializujeme se na výkup všech typů bytů v celé České republice.
            Ať už vlastníte osobní byt, družstevní byt nebo byt zatížený
            hypotékou či exekucí - najdeme řešení přesně pro vaši situaci.
            Neplatíte žádnou provizi, poplatky za odhad ani právní služby.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od klasického prodeje přes realitní kancelář u nás
            nemusíte čekat měsíce na kupce, řešit prohlídky ani investovat do
            oprav. Byt vykoupíme v jakémkoli stavu - i bez rekonstrukce, s
            nájemníkem nebo s právním zatížením.
          </p>
          <p className="mt-4 text-slate-600">
            Proces je jednoduchý a transparentní. Po vyplnění nezávazného
            formuláře vám do 24 hodin zašleme cenovou nabídku. Pokud vám
            vyhovuje, připravíme kupní smlouvu a zajistíme vše potřebné včetně
            zápisu do katastru nemovitostí.
          </p>
          <p className="mt-4 text-slate-600">
            Vykupujeme byty v Praze, Brně, Ostravě i v menších městech po celé
            ČR. Nezáleží na velikosti, stavu ani lokalitě - každý byt posoudíme
            individuálně a nabídneme vám nejvýhodnější podmínky.
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
            <Shield className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> 80–90 % tržní
            hodnoty
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup bytu vhodný
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {SITUATIONS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <s.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak výkup bytu probíhá
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
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

      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-xl font-bold text-slate-900">
            Vykupujeme i další typy nemovitostí
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/vykup-domu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup domů →
            </Link>
            <Link
              href="/vykup-pozemku"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup pozemků →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu bytů
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
              Prodejte byt rychle a bez starostí
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Cenovou nabídku obdržíte do 24 hodin.
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
          <div className="mb-8 mt-8">
            <ShareButtons />
          </div>
          <RelatedArticles articles={getRelatedArticles("vykup-bytu")} />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
