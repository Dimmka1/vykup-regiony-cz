import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Users,
  Scale,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/vykup-spoluvlastnickeho-podilu",
  },
  title:
    "Výkup spoluvlastnického podílu na nemovitosti — férová cena bez soudů",
  description:
    "Vykoupíme váš spoluvlastnický podíl na nemovitosti rychle a bez soudních sporů. Férová cena, právní servis zdarma, výplata do 7 dnů. Bez provize.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Mohu prodat pouze svůj podíl na nemovitosti?",
    answer:
      "Ano, každý spoluvlastník má právo nakládat se svým podílem nezávisle na ostatních. Nepotřebujete souhlas ostatních spoluvlastníků k prodeji svého podílu. My váš podíl vykoupíme za férovou cenu bez zbytečných průtahů.",
  },
  {
    question: "Kolik za spoluvlastnický podíl dostanu?",
    answer:
      "Nabízíme 80–90 % tržní hodnoty vašeho podílu. Konečná cena závisí na velikosti podílu, stavu nemovitosti a případných právních komplikacích. Ocenění provádíme zdarma a nezávazně.",
  },
  {
    question: "Jak dlouho trvá výkup spoluvlastnického podílu?",
    answer:
      "Celý proces od prvního kontaktu po výplatu peněz trvá obvykle 2–4 týdny. V urgentních případech dokážeme celou transakci realizovat i do 7 dnů.",
  },
  {
    question: "Co když se ostatní spoluvlastníci staví proti prodeji?",
    answer:
      "Váš podíl je váš majetek a máte právo s ním nakládat. Ostatní spoluvlastníci mají ze zákona předkupní právo, které musíme respektovat, ale pokud ho nevyužijí ve lhůtě, prodej proběhne bez jejich souhlasu.",
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
      "Zašlete nám informace o nemovitosti a do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Scale,
    title: "2. Právní analýza",
    description:
      "Prověříme vlastnické vztahy, předkupní práva a připravíme optimální postup.",
  },
  {
    icon: Users,
    title: "3. Komunikace se spoluvlastníky",
    description:
      "Zajistíme zákonné oslovení spoluvlastníků ohledně předkupního práva.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Po podpisu smlouvy obdržíte peníze na účet do 7 dnů.",
  },
] as const;

export default async function VykupSpoluvlastnickehoPodilu(): Promise<React.ReactElement> {
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
    name: "Výkup spoluvlastnického podílu na nemovitosti",
    description:
      "Vykoupíme váš spoluvlastnický podíl na nemovitosti rychle a bez soudních sporů.",
    url: "https://vykup-regiony.cz/vykup-spoluvlastnickeho-podilu",
    publisher: {
      "@type": "Organization",
      name: "Výkup Nemovitostí",
      url: "https://vykup-regiony.cz",
    },
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
                {
                  label: "Výkup spoluvlastnického podílu",
                  href: "/vykup-spoluvlastnickeho-podilu",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup spoluvlastnického podílu na nemovitosti
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Spoluvlastnictví nemovitosti se může snadno proměnit v noční můru —
            neshody ohledně správy, oprav nebo budoucnosti nemovitosti jsou na
            denním pořádku. Pokud chcete ze spoluvlastnictví vystoupit rychle a
            bez soudních sporů, jsme tu pro vás.
          </p>
          <p className="mt-4 text-slate-600">
            Spoluvlastnický podíl na nemovitosti je specifický typ majetku,
            který se na běžném trhu prodává velmi obtížně. Většina kupujících
            hledá celé nemovitosti, nikoliv podíly s rizikem konfliktů s dalšími
            spoluvlastníky. Proto mnoho majitelů podílů zůstává v patové situaci
            roky.
          </p>
          <p className="mt-4 text-slate-600">
            My se specializujeme právě na tyto případy. Vykoupíme váš
            spoluvlastnický podíl za férovou tržní cenu a celý proces zvládneme
            bez zbytečné byrokracie. Naši právníci se postarají o veškerou
            dokumentaci včetně zákonného oslovení ostatních spoluvlastníků
            ohledně předkupního práva.
          </p>
          <p className="mt-4 text-slate-600">
            Spoluvlastnictví často vzniká při dědění, kdy nemovitost zdědí více
            dědiců, nebo po rozvodu, kdy se manželé nedokáží dohodnout na
            vypořádání. V obou případech nabízíme elegantní řešení — vykoupíme
            váš podíl a vy získáte finanční prostředky bez dlouhých soudních
            řízení.
          </p>
          <p className="mt-4 text-slate-600">
            Celý proces je zcela diskrétní. Respektujeme soukromí všech
            zúčastněných stran a jednáme profesionálně. Vaše data i podmínky
            obchodu považujeme za přísně důvěrné.
          </p>
          <p className="mt-4 text-slate-600">
            Neváhejte nás kontaktovat pro nezávaznou konzultaci. Posoudíme vaši
            situaci a navrhneme optimální řešení šité na míru. Vše bez poplatků
            a závazků.
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
            Časté dotazy k výkupu spoluvlastnického podílu
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
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Další situace, které řešíme
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/vykup-pri-exekuci"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup při exekuci
            </Link>
            <Link
              href="/vykup-pri-dedictvi"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup při dědictví
            </Link>
            <Link
              href="/vykup-pri-rozvodu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup při rozvodu
            </Link>
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup s hypotékou
            </Link>
            <Link
              href="/vykup-nemovitosti-s-vecnym-bremenem"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup s věcným břemenem
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Zbavte se spoluvlastnického podílu bez starostí
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
          <RelatedArticles
            articles={getRelatedArticles("vykup-spoluvlastnickeho-podilu")}
          />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
