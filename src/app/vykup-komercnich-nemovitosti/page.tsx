import { LeadMagnetCta } from "@/components/lead-magnet-cta";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Warehouse,
  Store,
  Factory,
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  FileSignature,
  TrendingUp,
  Phone,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/vykup-komercnich-nemovitosti",
  },
  title:
    "Výkup komerčních nemovitostí — kanceláře, sklady, obchody | vykoupim-nemovitost.cz",
  description:
    "Rychlý výkup komerčních nemovitostí v celé ČR. Kanceláře, sklady, obchodní prostory i výrobní haly. Férová cena, výplata do 14 dnů, bez provize. Nezávazná nabídka zdarma.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jaké typy komerčních nemovitostí vykupujete?",
    answer:
      "Vykupujeme všechny typy komerčních nemovitostí — kancelářské prostory, skladové a logistické haly, obchodní prostory, výrobní haly, restaurace a provozovny, garáže i celé komerční budovy. Nezáleží na velikosti ani aktuálním stavu nemovitosti.",
  },
  {
    question: "Jak rychle proběhne výkup komerční nemovitosti?",
    answer:
      "Celý proces od prvního kontaktu po vyplacení kupní ceny trvá obvykle 2–4 týdny. U jednodušších případů to může být i 7–14 dnů. Rychlost závisí na právní čistotě nemovitosti a složitosti převodu.",
  },
  {
    question: "Kolik za komerční nemovitost nabídnete?",
    answer:
      "Nabízíme 75–90 % tržní hodnoty v závislosti na typu, stavu a lokalitě nemovitosti. Výhodou je rychlost, jistota prodeje a nulové náklady na vaší straně — neplatíte provizi, právní služby ani odhad.",
  },
  {
    question: "Vykupujete i komerční nemovitosti s nájemci?",
    answer:
      "Ano, odkoupíme i komerční nemovitost s existujícími nájemními smlouvami. Nájemní vztahy přecházejí na nového vlastníka ze zákona, takže nájemci nemusí nic měnit a vy získáte peníze bez komplikací.",
  },
  {
    question:
      "Mohu prodat komerční nemovitost zatíženou hypotékou nebo zástavou?",
    answer:
      "Ano, řešíme i nemovitosti se zástavním právem nebo nesplacenou hypotékou. Dluh uhradíme přímo z kupní ceny a zbytek vyplatíme vám. Naši právníci se postarají o veškerou komunikaci s bankou.",
  },
  {
    question: "Jaké dokumenty potřebuji k prodeji komerční nemovitosti?",
    answer:
      "Základem je list vlastnictví, nabývací titul (kupní smlouva, dědické usnesení apod.) a energetický štítek budovy (PENB). Pokud některé dokumenty nemáte, pomůžeme vám s jejich zajištěním.",
  },
  {
    question: "Vykupujete komerční nemovitosti v celé České republice?",
    answer:
      "Ano, působíme ve všech 14 krajích České republiky. Ať už se vaše komerční nemovitost nachází v Praze, Brně, Ostravě nebo v menším městě, rádi vám připravíme nezávaznou nabídku.",
  },
] as const;

interface PropertyType {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  priceRange: string;
}

const PROPERTY_TYPES: readonly PropertyType[] = [
  {
    icon: Building2,
    title: "Kancelářské prostory",
    description:
      "Samostatné kanceláře, kancelářské budovy, coworkingové prostory i administrativní komplexy v centrech měst i na periferii.",
    priceRange: "od 25 000 Kč/m²",
  },
  {
    icon: Warehouse,
    title: "Sklady a logistické haly",
    description:
      "Skladové prostory, logistická centra, distribuční haly i menší sklady. Vykupujeme bez ohledu na aktuální využití.",
    priceRange: "od 8 000 Kč/m²",
  },
  {
    icon: Store,
    title: "Obchodní prostory",
    description:
      "Obchody, showroomy, restaurace, provozovny služeb i celá obchodní centra. Včetně prostor s existujícími nájemci.",
    priceRange: "od 30 000 Kč/m²",
  },
  {
    icon: Factory,
    title: "Výrobní haly a průmyslové objekty",
    description:
      "Výrobní závody, dílny, průmyslové areály i brownfieldy. Řešíme i objekty vyžadující demolici nebo rekonstrukci.",
    priceRange: "od 5 000 Kč/m²",
  },
] as const;

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const STEPS: readonly Step[] = [
  {
    icon: Phone,
    title: "1. Nezávazná poptávka",
    description:
      "Vyplňte formulář nebo zavolejte. Do 24 hodin obdržíte předběžnou cenovou nabídku na vaši komerční nemovitost.",
  },
  {
    icon: FileSignature,
    title: "2. Prohlídka a ocenění",
    description:
      "Náš odborník provede prohlídku nemovitosti a připraví detailní ocenění. Vše zdarma a bez závazků.",
  },
  {
    icon: Shield,
    title: "3. Právní prověření",
    description:
      "Prověříme právní stav nemovitosti, existující nájemní smlouvy a případná zatížení. Připravíme kupní smlouvu.",
  },
  {
    icon: HandCoins,
    title: "4. Podpis a výplata",
    description:
      "Podepíšeme smlouvu s advokátní úschovou. Peníze obdržíte do 14 dnů od podpisu, často i dříve.",
  },
] as const;

interface Advantage {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const ADVANTAGES: readonly Advantage[] = [
  {
    icon: Clock,
    title: "Rychlost prodeje",
    description:
      "Zatímco prodej komerční nemovitosti přes realitku trvá měsíce až roky, u nás máte peníze na účtu do 2–4 týdnů.",
  },
  {
    icon: BadgeCheck,
    title: "Bez provize a poplatků",
    description:
      "Neplatíte žádnou provizi, právní služby ani odhad. Veškeré náklady spojené s převodem hradíme my.",
  },
  {
    icon: Shield,
    title: "Jistota prodeje",
    description:
      "Žádné čekání na kupce, žádné propadlé rezervace. Jakmile se dohodneme, prodej proběhne.",
  },
  {
    icon: TrendingUp,
    title: "Férová cena",
    description:
      "Nabízíme 75–90 % tržní hodnoty. Za rychlost a jistotu, kterou získáte, je to férový obchod.",
  },
  {
    icon: FileSignature,
    title: "Právní servis zdarma",
    description:
      "Kupní smlouvu připraví náš advokát. Peníze jdou přes advokátní úschovu pro maximální bezpečnost.",
  },
  {
    icon: Building2,
    title: "Řešíme komplikace",
    description:
      "Hypotéka, zástavní právo, spoluvlastnictví, nájemci — žádná komplikace pro nás není překážkou.",
  },
] as const;

export default async function VykupKomercnichNemovitostiPage(): Promise<React.ReactElement> {
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Výkup komerčních nemovitostí — kanceláře, sklady, obchody",
    description:
      "Rychlý výkup komerčních nemovitostí v celé ČR. Kanceláře, sklady, obchodní prostory i výrobní haly.",
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
    datePublished: "2026-03-10",
    dateModified: "2026-03-10",
    mainEntityOfPage:
      "https://vykoupim-nemovitost.cz/vykup-komercnich-nemovitosti",
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
        name: "Výkup komerčních nemovitostí",
        item: "https://vykoupim-nemovitost.cz/vykup-komercnich-nemovitosti",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                { label: "Služby", href: "/#sluzby" },
                {
                  label: "Výkup komerčních nemovitostí",
                  href: "/vykup-komercnich-nemovitosti",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup komerčních nemovitostí
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Potřebujete rychle prodat komerční nemovitost? Vykoupíme kanceláře,
            sklady, obchodní prostory i výrobní haly v celé České republice.
            Férová cena, rychlé vyřízení a žádné provize.
          </p>
          <p className="mt-4 text-slate-600">
            Prodej komerční nemovitosti tradičním způsobem přes realitní
            kancelář může trvat mnoho měsíců, někdy i déle než rok. Trh s
            komerčními nemovitostmi je specifický — kupců je méně než u
            rezidenčních nemovitostí a rozhodovací proces bývá zdlouhavý. Pokud
            potřebujete peníze rychle, nabízíme alternativu: přímý výkup bez
            zbytečného čekání.
          </p>
          <p className="mt-4 text-slate-600">
            Specializujeme se na rychlý výkup všech typů komerčních nemovitostí.
            Ať už vlastníte kancelářskou budovu v centru Prahy, skladovou halu
            na okraji Brna nebo obchod v menším městě — připravíme vám
            nezávaznou nabídku do 24 hodin. Celý proces od první konzultace po
            vyplacení kupní ceny trvá obvykle jen 2–4 týdny.
          </p>
          <p className="mt-4 text-slate-600">
            Naše služba je ideální pro vlastníky, kteří potřebují rychle uvolnit
            kapitál vázaný v nemovitosti, řeší finanční potíže firmy, chtějí se
            zbavit nevyužívaného majetku nebo plánují restrukturalizaci
            podnikání. Vyřešíme i komplikované situace — nemovitosti s
            hypotékou, zástavním právem, více vlastníky nebo existujícími
            nájemci.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <a
              href="tel:+420776424145"
              className="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Phone className="mr-2 h-4 w-4" />
              +420 776 424 145
            </a>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Výplata do 14 dnů
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> Advokátní úschova
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      {/* Property Types / Price Section (AC-2) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Typy komerčních nemovitostí, které vykupujeme
          </h2>
          <p className="mt-3 text-slate-600">
            Vykupujeme všechny typy komerčních nemovitostí bez ohledu na
            velikost, stav nebo aktuální využití. Níže najdete orientační ceny
            pro hlavní kategorie.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PROPERTY_TYPES.map((type) => (
              <div
                key={type.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <type.icon className="h-8 w-8 text-emerald-500" />
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {type.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {type.description}
                </p>
                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  {type.priceRange}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            * Uvedené ceny jsou orientační a závisí na lokalitě, stavu a
            vybavení nemovitosti. Pro přesnou nabídku nás{" "}
            <Link href="/#kontakt" className="text-emerald-600 underline">
              kontaktujte
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak probíhá výkup komerční nemovitosti
          </h2>
          <p className="mt-3 text-slate-600">
            Celý proces je jednoduchý a transparentní. Od prvního kontaktu po
            vyplacení peněz to zvládneme za 2–4 týdny.
          </p>
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

      {/* Advantages */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Proč prodat komerční nemovitost nám
          </h2>
          <p className="mt-3 text-slate-600">
            Oproti klasickému prodeji přes realitní kancelář získáte řadu výhod.
            Nemusíte čekat na kupce, řešit prohlídky ani vyjednávat o ceně.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map((advantage) => (
              <div
                key={advantage.title}
                className="rounded-2xl bg-slate-50 p-6 shadow-sm"
              >
                <advantage.icon className="h-6 w-6 text-emerald-500" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  {advantage.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Pro koho je výkup komerční nemovitosti vhodný
          </h2>
          <div className="mt-6 space-y-4 text-slate-600">
            <p>
              Rychlý výkup komerční nemovitosti je ideální řešení v mnoha
              životních a podnikatelských situacích. Nejčastěji se na nás
              obracejí:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                <strong>Podnikatelé</strong>, kteří potřebují rychle uvolnit
                kapitál pro nové investice nebo provoz firmy
              </li>
              <li>
                <strong>Vlastníci nevyužívaných prostor</strong>, kteří platí
                zbytečné náklady na údržbu, pojištění a daně z prázdné
                nemovitosti
              </li>
              <li>
                <strong>Firmy v restrukturalizaci</strong>, které potřebují
                zmenšit portfolio nemovitostí nebo získat prostředky na
                oddlužení
              </li>
              <li>
                <strong>Dědicové komerčních prostor</strong>, kteří nemají zájem
                o správu a pronájem komerční nemovitosti
              </li>
              <li>
                <strong>Spoluvlastníci</strong>, kteří se nemohou dohodnout na
                dalším využití společné komerční nemovitosti
              </li>
              <li>
                <strong>Investoři</strong>, kteří chtějí přesunout kapitál z
                nemovitostního trhu do jiných aktiv
              </li>
            </ul>
            <p>
              Bez ohledu na důvod prodeje vám připravíme férovou nabídku a
              postaráme se o celý proces od A do Z. Nemusíte řešit inzerci,
              prohlídky, vyjednávání ani právní záležitosti — vše zajistíme za
              vás.
            </p>
          </div>
        </div>
      </section>

      {/* Internal links section (AC-5) */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Další služby výkupu nemovitostí
          </h2>
          <p className="mt-3 text-slate-600">
            Kromě komerčních nemovitostí vykupujeme i rezidenční nemovitosti ve
            všech situacích:
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/vykup-bytu"
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              → Výkup bytů
            </Link>
            <Link
              href="/vykup-domu"
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              → Výkup domů
            </Link>
            <Link
              href="/vykup-pozemku"
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              → Výkup pozemků
            </Link>
            <Link
              href="/vykup-pri-exekuci"
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              → Výkup při exekuci
            </Link>
            <Link
              href="/vykup-nemovitosti-s-hypotekou"
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              → Výkup s hypotékou
            </Link>
            <Link
              href="/kraje"
              className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              → Výkup ve všech krajích ČR
            </Link>
          </div>
        </div>
      </section>

      {/* CTA with form link (AC-3: property_type=komercni) */}
      <section className="bg-emerald-50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Získejte nezávaznou nabídku na vaši komerční nemovitost
            </h2>
            <p className="mt-2 text-slate-600">
              Vyplňte formulář a do 24 hodin obdržíte cenovou nabídku. Bez
              závazků, bez poplatků.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Nebo zavolejte přímo na{" "}
              <a
                href="tel:+420776424145"
                className="font-semibold text-emerald-600"
              >
                +420 776 424 145
              </a>{" "}
              nebo napište na{" "}
              <a
                href="mailto:info@vykoupim-nemovitost.cz"
                className="font-semibold text-emerald-600"
              >
                info@vykoupim-nemovitost.cz
              </a>
            </p>
            <div className="mt-6">
              <Link
                href="/#kontakt"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Chci nezávaznou nabídku
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (AC-4) */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu komerčních nemovitostí
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

      {/* Related Articles */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles
            articles={getRelatedArticles("vykup-komercnich-nemovitosti")}
          />
        </div>
      </section>

      <LeadMagnetCta />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
