import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  Landmark,
  FileCheck,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { ContentFreshnessBadge } from "@/components/content-freshness-badge";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou",
  },
  title: "Výkup nemovitosti s hypotékou - rychlé řešení zatížené nemovitosti",
  description:
    "Vykoupíme nemovitost zatíženou hypotékou nebo zástavním právem. Vyřešíme komunikaci s bankou, splatíme úvěr z kupní ceny. Výplata do 7 dnů, bez provize.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Lze prodat nemovitost s nesplacenou hypotékou?",
    answer:
      "Ano, prodej nemovitosti s hypotékou je zcela legální a běžný. Hypotéka se splatí z kupní ceny při převodu nemovitosti. My celý proces koordinujeme s vaší bankou, aby vše proběhlo hladce a bez komplikací.",
  },
  {
    question: "Co když dlužím na hypotéce více, než je hodnota nemovitosti?",
    answer:
      "I v případě tzv. podvodní hypotéky (negative equity) vám pomůžeme najít řešení. Vyjednáme s bankou optimální podmínky splacení a navrhneme postup, který minimalizuje vaše ztráty.",
  },
  {
    question: "Jak rychle dokážete nemovitost s hypotékou vykoupit?",
    answer:
      "Standardně celý proces trvá 3–5 týdnů, protože je nutná součinnost banky při výmazu zástavního práva. V urgentních případech dokážeme proces urychlit na minimum.",
  },
  {
    question: "Musím platit bance poplatek za předčasné splacení?",
    answer:
      "Poplatek za předčasné splacení závisí na vaší smlouvě s bankou. U hypoték uzavřených po roce 2016 je poplatek omezený zákonem. Naši specialisté vám pomohou zjistit přesné podmínky a minimalizovat náklady.",
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
      "Zašlete nám informace o nemovitosti a hypotéce. Do 24 hodin obdržíte cenovou nabídku zdarma.",
  },
  {
    icon: Landmark,
    title: "2. Komunikace s bankou",
    description:
      "Ověříme výši nesplaceného úvěru a dohodneme podmínky předčasného splacení.",
  },
  {
    icon: FileCheck,
    title: "3. Příprava smlouvy",
    description:
      "Naši právníci připraví kupní smlouvu zajišťující splacení hypotéky z kupní ceny.",
  },
  {
    icon: Clock,
    title: "4. Výplata a výmaz zástavy",
    description:
      "Splatíme hypotéku, zajistíme výmaz zástavního práva a zbytek vyplatíme vám.",
  },
] as const;

export default async function VykupNemovitostiSHypotekou(): Promise<React.ReactElement> {
  const host = await getRequestHost();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    dateModified: "2026-03-09",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Výkup nemovitosti s hypotékou",
    description:
      "Vykoupíme nemovitost zatíženou hypotékou nebo zástavním právem rychle a bez komplikací.",
    url: "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou",
    publisher: {
      "@type": "Organization",
      name: "Výkup Nemovitostí",
      url: "https://vykoupim-nemovitost.cz",
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
                  label: "Výkup s hypotékou",
                  href: "/vykup-nemovitosti-s-hypotekou",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup nemovitosti s hypotékou
          </h1>
          <div className="mt-3">
            <ContentFreshnessBadge date="2026-03-09" />
          </div>
          <p className="mt-4 text-lg text-slate-600">
            Splácíte hypotéku, kterou už nezvládáte? Potřebujete rychle prodat
            nemovitost zatíženou zástavním právem banky? Pomůžeme vám celou
            situaci vyřešit - splatíme hypotéku z kupní ceny a zbytek vyplatíme
            přímo vám.
          </p>
          <p className="mt-4 text-slate-600">
            Prodej nemovitosti s hypotékou je běžná praxe, ale vyžaduje
            koordinaci s bankou a správné právní zajištění. Mnoho majitelů se
            bojí, že nemovitost s nesplacenou hypotékou nelze prodat, ale opak
            je pravdou. Důležité je správně nastavit proces tak, aby banka
            obdržela svou pohledávku a vy zbytek kupní ceny.
          </p>
          <p className="mt-4 text-slate-600">
            Specializujeme se na výkup nemovitostí zatížených zástavním právem.
            Komunikujeme přímo s vaší bankou, zjistíme přesnou výši nesplaceného
            úvěru a dohodneme podmínky předčasného splacení. Vy se nemusíte o
            nic starat.
          </p>
          <p className="mt-4 text-slate-600">
            Situace, kdy majitelé nemohou splácet hypotéku, není výjimečná.
            Ztráta zaměstnání, rozvod, nemoc nebo pokles příjmů - důvodů může
            být mnoho. Důležité je jednat včas, než se situace zkomplikuje
            exekucí nebo nuceným prodejem.
          </p>
          <p className="mt-4 text-slate-600">
            Nabízíme férovou cenu odpovídající 80–90 % tržní hodnoty
            nemovitosti. Z kupní ceny uhradíme zůstatek hypotéky přímo bance a
            rozdíl vyplatíme na váš účet. Celý proces je transparentní a bez
            skrytých poplatků.
          </p>
          <p className="mt-4 text-slate-600">
            Veškeré právní služby, odhad nemovitosti a administrativu hradíme
            my. Vy neplatíte žádnou provizi ani poplatky. Kontaktujte nás ještě
            dnes pro nezávaznou konzultaci a zjistěte, kolik za svou nemovitost
            můžete získat.
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
            Časté dotazy k výkupu nemovitosti s hypotékou
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
              href="/vykup-spoluvlastnickeho-podilu"
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200"
            >
              Výkup spoluvlastnického podílu
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
              Zbavte se hypotéky bez starostí
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
            articles={getRelatedArticles("vykup-nemovitosti-s-hypotekou")}
          />
        </div>
      </section>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
