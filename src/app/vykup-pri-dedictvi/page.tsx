import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  Users,
  FileText,
  HandCoins,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Výkup nemovitosti při dědictví — rychlý prodej zděděné nemovitosti",
  description:
    "Zdědili jste nemovitost a chcete ji rychle prodat? Vykoupíme zděděný byt nebo dům za férovou cenu. Vyřešíme i spoluvlastnictví a dědické spory.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Kdy mohu zděděnou nemovitost prodat?",
    answer:
      "Nemovitost můžete prodat ihned po pravomocném usnesení o dědictví. Nemusíte čekat na zápis do katastru — stačí pravomocné rozhodnutí soudu a můžeme zahájit výkup.",
  },
  {
    question: "Co když je více dědiců a neshodnou se?",
    answer:
      "Vykupujeme i spoluvlastnické podíly. Pokud se dědici neshodnou na společném prodeji, můžete prodat svůj podíl samostatně bez souhlasu ostatních spoluvlastníků.",
  },
  {
    question: "Musím zděděnou nemovitost před prodejem opravovat?",
    answer:
      "Ne, nemovitost kupujeme v aktuálním stavu. Nemusíte investovat do rekonstrukce, malování ani úklidu. Často vykupujeme i nemovitosti, které byly dlouho neobývané.",
  },
  {
    question: "Jak se řeší daně z prodeje zděděné nemovitosti?",
    answer:
      "Prodej zděděné nemovitosti je osvobozen od daně z příjmu po 5 letech od nabytí původním vlastníkem (zůstavitelem). V případě kratší doby vám poradíme s optimálním postupem.",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: FileText,
    title: "1. Posouzení situace",
    description:
      "Zhodnotíme stav dědického řízení a připravíme nezávaznou nabídku.",
  },
  {
    icon: Users,
    title: "2. Řešení spoluvlastnictví",
    description:
      "Pomůžeme vyřešit vztahy mezi dědici a navrhneme optimální postup.",
  },
  {
    icon: HandCoins,
    title: "3. Férová nabídka",
    description: "Nabídneme 80–90 % tržní hodnoty. Veškeré náklady hradíme my.",
  },
  {
    icon: Clock,
    title: "4. Rychlá výplata",
    description: "Peníze obdržíte do několika dnů od podpisu kupní smlouvy.",
  },
] as const;

export default function VykupPriDedictviPage(): React.ReactElement {
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
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti při dědictví
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Zdědili jste nemovitost a nevíte, co s ní? Ať už jde o byt, dům nebo
            pozemek — pomůžeme vám s rychlým a bezstarostným prodejem za férovou
            cenu.
          </p>
          <p className="mt-4 text-slate-600">
            Dědické řízení bývá náročné nejen emočně, ale i právně. Často se
            stává, že nemovitost zdědí více osob, které se neshodnou na dalším
            využití. Dlouhé spory a neobývaná nemovitost přitom znamenají
            zbytečné náklady.
          </p>
          <p className="mt-4 text-slate-600">
            Nabízíme rychlé řešení — vykoupíme celou nemovitost nebo i váš
            spoluvlastnický podíl. Nemusíte čekat měsíce na klasický prodej přes
            realitní kancelář.
          </p>
          <p className="mt-4 text-slate-600">
            Postaráme se o veškerou administrativu včetně komunikace s katastrem
            nemovitostí a notářem. Vy se nemusíte o nic starat.
          </p>
          <p className="mt-4 text-slate-600">
            Nemovitost kupujeme v aktuálním stavu — bez nutnosti rekonstrukce,
            vyklízení nebo oprav. I pokud byla nemovitost dlouho neobývaná, není
            to pro nás překážka.
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
            Časté dotazy k výkupu při dědictví
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
              Prodejte zděděnou nemovitost bez starostí
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Vyřešíme vše za vás.
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
    </>
  );
}
