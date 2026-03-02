import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Home,
  Wrench,
  Landmark,
  Users,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/vykup-domu" },
  title: "Výkup domů — rychlý prodej rodinného domu za hotové",
  description:
    "Vykoupíme váš rodinný dům rychle a bez provize. Staré domy, domy k rekonstrukci i se zástavou. Férová cena, vyplacení do 7 dnů. Celá ČR.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Vykupujete i staré domy v špatném stavu?",
    answer:
      "Ano, vykupujeme domy v jakémkoli stavu — i zchátralé, poškozené nebo vyžadující kompletní rekonstrukci. Stav domu není překážkou, naopak se na takové nemovitosti specializujeme.",
  },
  {
    question: "Jak stanovíte cenu za rodinný dům?",
    answer:
      "Cenu stanovíme na základě lokality, stavu nemovitosti, velikosti pozemku a aktuálních tržních podmínek. Nabízíme 80–90 % tržní hodnoty. Odhad je zdarma a nezávazný.",
  },
  {
    question: "Co když je na domě zástavní právo nebo hypotéka?",
    answer:
      "Domy se zástavním právem nebo hypotékou vykupujeme běžně. Hypotéku splatíme přímo z kupní ceny a zajistíme výmaz zástavního práva z katastru nemovitostí.",
  },
  {
    question: "Jak dlouho trvá výkup domu?",
    answer:
      "Celý proces od prvního kontaktu po vyplacení peněz trvá obvykle 2–4 týdny. V urgentních případech to zvládneme i do 7 dnů.",
  },
] as const;

interface Situation {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SITUATIONS: readonly Situation[] = [
  {
    icon: Home,
    title: "Zděděný dům, který nevyužíváte",
    description:
      "Zdědili jste dům, o který se nechcete starat? Vykoupíme ho rychle a bez starostí s údržbou.",
  },
  {
    icon: Wrench,
    title: "Dům vyžadující nákladnou rekonstrukci",
    description:
      "Starý dům potřebuje opravu střechy, elektřiny nebo zateplení? Vykoupíme ho bez nutnosti investic.",
  },
  {
    icon: Landmark,
    title: "Dům zatížený hypotékou nebo zástavou",
    description:
      "Nemůžete splácet hypotéku? Vykoupíme dům, splatíme dluh a zbytek vyplatíme vám.",
  },
  {
    icon: Users,
    title: "Spoluvlastnictví nebo rozvod",
    description:
      "Potřebujete rozdělit majetek po rozvodu nebo mezi spoluvlastníky? Rychlý výkup situaci vyřeší.",
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
    title: "2. Prohlídka a posouzení",
    description: "Provedeme prohlídku domu a prověříme právní stav v katastru.",
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

export default function VykupDomuPage(): React.ReactElement {
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
    name: "Výkup domů — rychlý prodej rodinného domu za hotové",
    description: metadata.description,
    url: "https://vykup-regiony.cz/vykup-domu",
    isPartOf: { "@type": "WebSite", url: "https://vykup-regiony.cz" },
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
                { label: "Výkup domů", href: "/vykup-domu" },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup rodinných domů — rychle, férově a bez provize
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Chcete prodat rodinný dům rychle a bez komplikací? Vykoupíme váš dům
            za férovou cenu odpovídající 80–90 % tržní hodnoty. Celý proces
            zvládneme do 7 dnů — vy nemusíte řešit inzerci, prohlídky ani
            opravy.
          </p>
          <p className="mt-4 text-slate-600">
            Specializujeme se na výkup rodinných domů po celé České republice.
            Vykoupíme domy v jakémkoli stavu — starší domy, domy k demolici,
            rozestavěné projekty i nemovitosti zatížené hypotékou, exekucí nebo
            věcným břemenem. Každou situaci posoudíme individuálně.
          </p>
          <p className="mt-4 text-slate-600">
            Klasický prodej rodinného domu přes realitní kancelář trvá v průměru
            6–12 měsíců. U nás je to otázka dnů. Neplatíte žádnou provizi,
            poplatky za odhad, právní služby ani náklady na převod — vše hradíme
            my.
          </p>
          <p className="mt-4 text-slate-600">
            Náš tým zkušených odhadců a právníků zajistí rychlé a bezpečné
            převedení vlastnických práv. Komunikujeme transparentně a na každém
            kroku víte, co se děje. Žádné skryté podmínky, žádné nepříjemné
            překvapení.
          </p>
          <p className="mt-4 text-slate-600">
            Ať už prodáváte dům ve velkém městě nebo na vesnici, kontaktujte
            nás. Nabídku obdržíte do 24 hodin a peníze mohou být na vašem účtu
            už za týden.
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
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Domy v jakémkoli
            stavu
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup domu vhodný
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
            Jak výkup domu probíhá
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
              href="/vykup-bytu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Výkup bytů →
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
            Časté dotazy k výkupu domů
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
              Prodejte dům rychle a výhodně
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
          <RelatedArticles articles={getRelatedArticles("vykup-domu")} />
        </div>
      </section>
    </>
  );
}
