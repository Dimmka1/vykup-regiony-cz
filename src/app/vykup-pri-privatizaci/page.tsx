import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Clock,
  BadgeCheck,
  HandCoins,
  FileText,
  Scale,
  KeyRound,
  CalendarCheck,
} from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { LeadMagnetCta } from "@/components/lead-magnet-cta";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title:
    "Výkup při privatizaci bytu – prodej privatizovaného bytu rychle | Vykoupím Nemovitost",
  description:
    "Vykoupíme váš privatizovaný byt rychle a bez komplikací. Řešíme předkupní práva, družstevní podíly i právní záležitosti. Nabídka do 24 hodin.",
  alternates: {
    canonical: `${SITE_URL}/vykup-pri-privatizaci`,
  },
  openGraph: {
    url: `${SITE_URL}/vykup-pri-privatizaci`,
    title: "Výkup při privatizaci bytu – rychlý prodej bez komplikací",
    description:
      "Prodejte privatizovaný byt rychle a za férovou cenu. Řešíme právní komplikace za vás.",
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Co je privatizace bytu a jak ovlivňuje prodej?",
    answer:
      "Privatizace bytu je proces převodu obecního nebo družstevního bytu do osobního vlastnictví nájemníka. Po privatizaci se stáváte plnohodnotným vlastníkem a můžete byt volně prodat. Někdy však privatizace přináší komplikace — předkupní práva obce, omezení v kupní smlouvě nebo nedořešené právní vztahy s družstvem.",
  },
  {
    question: "Jak rychle lze prodat privatizovaný byt?",
    answer:
      "U standardních případů celý proces od prvního kontaktu po vyplacení peněz trvá 2–4 týdny. Pokud existují komplikace jako předkupní práva nebo omezení z privatizační smlouvy, může být potřeba dalších 1–2 týdnů na jejich vyřízení. I tak je to výrazně rychlejší než klasický prodej přes realitku.",
  },
  {
    question: "Musím dodržet předkupní právo obce při prodeji?",
    answer:
      "Záleží na podmínkách vaší privatizační smlouvy. Některé obce si v kupní smlouvě při privatizaci vyhradily předkupní právo na určitou dobu (typicky 5–10 let). Naši právníci zanalyzují vaši smlouvu a zajistí, že prodej proběhne v souladu se všemi podmínkami. Pokud předkupní právo stále platí, pomůžeme s jeho vypořádáním.",
  },
  {
    question: "Vykupujete i družstevní podíly?",
    answer:
      "Ano, vykupujeme jak byty v osobním vlastnictví po privatizaci, tak družstevní podíly. U družstevních bytů řešíme převod členského podílu v souladu se stanovami družstva. Celý proces zajistíme právně i administrativně za vás.",
  },
  {
    question: "Jakou cenu za privatizovaný byt nabídnete?",
    answer:
      "Nabízíme 80–90 % aktuální tržní hodnoty. Cenu stanovíme na základě lokality, stavu bytu, dispozice a aktuálních tržních podmínek. Ocenění je vždy zdarma a nezávazné. Finální nabídku obdržíte do 48 hodin od prohlídky.",
  },
  {
    question: "Co když ještě nebyla privatizace dokončena?",
    answer:
      "I v případě, kdy privatizace ještě probíhá nebo není zcela dokončena, dokážeme najít řešení. Naši právníci posoudí stav procesu a navrhnou optimální postup — ať už jde o dokončení privatizace před prodejem nebo převod družstevního podílu.",
  },
  {
    question: "Platím za právní služby nebo odhad nemovitosti?",
    answer:
      "Ne, veškeré náklady spojené s prodejem hradíme my. To zahrnuje právní servis, odhad nemovitosti, přípravu kupní smlouvy i poplatky za katastr nemovitostí. Částka, kterou vám nabídneme, je čistá suma, kterou obdržíte na účet.",
  },
] as const;

interface TimelineStep {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  time: string;
  description: string;
}

const TIMELINE: readonly TimelineStep[] = [
  {
    icon: FileText,
    title: "Poptávka a předběžná analýza",
    time: "Den 1",
    description:
      "Vyplníte formulář nebo nám zavoláte. Provedeme předběžnou analýzu a do 24 hodin vám sdělíme orientační nabídku.",
  },
  {
    icon: Scale,
    title: "Právní prověření",
    time: "Den 2–5",
    description:
      "Naši právníci prověří privatizační smlouvu, stav v katastru nemovitostí, předkupní práva a případná omezení.",
  },
  {
    icon: KeyRound,
    title: "Prohlídka a závazná nabídka",
    time: "Den 5–10",
    description:
      "Odborník provede prohlídku bytu a na základě všech informací připravíme závaznou cenovou nabídku.",
  },
  {
    icon: HandCoins,
    title: "Podpis smlouvy",
    time: "Den 10–14",
    description:
      "Připravíme kupní smlouvu, zajistíme úschovu kupní ceny u notáře a společně podepíšeme.",
  },
  {
    icon: CalendarCheck,
    title: "Výplata peněz",
    time: "Den 14–21",
    description:
      "Po zápisu do katastru obdržíte peníze na účet. U urgentních případů vyplatíme zálohu ihned při podpisu.",
  },
] as const;

export default function VykupPriPrivatizaciPage(): React.ReactElement {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "Výkup při privatizaci bytu – jak prodat privatizovaný byt rychle",
    description:
      "Kompletní průvodce prodejem privatizovaného bytu. Předkupní práva, družstevní podíly a právní aspekty privatizace.",
    author: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/vykup-pri-privatizaci`,
    datePublished: "2025-03-14",
    dateModified: "2025-03-14",
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Domů",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Služby",
        item: `${SITE_URL}/#sluzby`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Výkup při privatizaci",
        item: `${SITE_URL}/vykup-pri-privatizaci`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />

      {/* Hero section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                {
                  label: "Výkup při privatizaci",
                  href: "/vykup-pri-privatizaci",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Výkup při privatizaci bytu — prodejte privatizovaný byt bez
            komplikací
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Privatizovali jste byt a chcete ho prodat? Nebo máte družstevní
            podíl, který chcete zpeněžit? Jsme specialisté na výkup
            privatizovaných bytů — řešíme předkupní práva, omezení z
            privatizačních smluv i nedořešené právní vztahy. Celý proces
            zvládneme za 2–4 týdny, bez provize a se zárukou férové ceny.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <Link
              href="/jak-to-funguje"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Jak to funguje
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-slate-100 bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-4 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" /> Výplata do 7 dnů
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-500" /> Řešíme právní
            komplikace
          </span>
          <span className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-emerald-500" /> Bez provize a
            poplatků
          </span>
        </div>
      </section>

      {/* Co je privatizace */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Co je privatizace bytu a jak ovlivňuje prodej?
          </h2>
          <p className="mt-4 text-slate-600">
            Privatizace bytového fondu probíhala v České republice zejména v 90.
            letech a na začátku 21. století. Obce a města převáděly byty z
            obecního vlastnictví do rukou stávajících nájemníků za zvýhodněné
            ceny — často hluboko pod tržní hodnotou. Díky tomu miliony Čechů
            získaly vlastní bydlení za zlomek jeho skutečné hodnoty.
          </p>
          <p className="mt-4 text-slate-600">
            Privatizace však s sebou často přinesla řadu právních komplikací,
            které mohou prodej bytu zkomplikovat i po mnoha letech. Předkupní
            práva obcí, časová omezení pro další prodej, nedořešené vztahy se
            správcem budovy nebo družstvem — to vše může klasický prodej přes
            realitní kancelář výrazně zdržet nebo dokonce znemožnit.
          </p>
          <p className="mt-4 text-slate-600">
            Právě proto nabízíme specializovaný výkup privatizovaných bytů. Máme
            zkušenosti s řešením všech typických komplikací a dokážeme celý
            prodej uskutečnit i tam, kde jiní kupující váhají nebo odmítají. Náš
            právní tým zajistí bezchybný průběh celé transakce.
          </p>
        </div>
      </section>

      {/* Problémy při prodeji */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté problémy při prodeji privatizovaného bytu
          </h2>
          <p className="mt-4 text-slate-600">
            Prodej privatizovaného bytu se na první pohled nemusí lišit od
            prodeje jakékoliv jiné nemovitosti. V praxi však narazíte na řadu
            specifických překážek, které vyžadují odborný přístup a znalost
            právních souvislostí privatizace.
          </p>
          <div className="mt-8 space-y-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Předkupní právo obce nebo města
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Mnoho privatizačních smluv obsahuje předkupní právo obce na
                zpětný odkup bytu po dobu 5–10 let (někdy i déle). Pokud tato
                lhůta ještě neuplynula, musíte obci nabídnout byt ke koupi za
                stejných podmínek. Naši právníci ověří, zda předkupní právo
                stále platí, a pokud ano, zajistí jeho řádné vypořádání před
                prodejem.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Omezení doby dalšího prodeje
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Některé privatizační smlouvy obsahují smluvní pokutu za prodej
                bytu v určité lhůtě po privatizaci (např. do 5 let od převodu).
                Pokud tuto podmínku porušíte, může obec požadovat smluvní
                pokutu, která se typicky rovná rozdílu mezi privatizační a tržní
                cenou. Pomůžeme vám zjistit, zda se vás toto omezení týká.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Nedořešené vztahy s družstvem
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                U bytů privatizovaných přes bytové družstvo může nastat situace,
                kdy převod do osobního vlastnictví nebyl zcela dokončen. Byt
                může být stále formálně družstevní, i když jste za něj zaplatili
                plnou cenu. V takovém případě se neprodává byt, ale členský
                podíl v družstvu — a i to za vás umíme zajistit.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">
                Zástavní právo a nesplacený anuální úvěr
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                V některých případech byla privatizace financována úvěrem obce
                nebo družstva, který je zajištěn zástavním právem na bytě. Před
                prodejem je nutné tento úvěr splatit a zástavní právo vymazat.
                Naši právníci zajistí koordinaci s věřitelem a katastrálním
                úřadem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jak pomůžeme */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Jak vám pomůžeme s prodejem privatizovaného bytu
          </h2>
          <p className="mt-4 text-slate-600">
            Náš tým má rozsáhlé zkušenosti s výkupem privatizovaných bytů po
            celé České republice. Víme přesně, na co si dát pozor, a dokážeme
            vyřešit i ty nejsložitější právní situace. Celý proces je navržen
            tak, abyste se nemuseli o nic starat.
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-600">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Bezplatná právní analýza
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Zanalyzujeme vaši privatizační smlouvu, stav v katastru a
                  všechna případná omezení. Zjistíme, zda existují překážky
                  prodeje a jak je vyřešit.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-600">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Vypořádání předkupních práv
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Pokud obec nebo jiný subjekt má předkupní právo, zajistíme
                  jeho řádné vypořádání. Komunikujeme s obcí, zajistíme
                  stanovisko a celý proces dotáhneme do konce.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-600">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Férová nabídka a rychlá výplata
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Na základě analýzy připravíme závaznou nabídku odpovídající
                  80–90 % tržní hodnoty. Po podpisu smlouvy obdržíte peníze na
                  účet v řádu dnů. Podrobnosti o procesu najdete na stránce{" "}
                  <Link
                    href="/jak-to-funguje"
                    className="font-medium text-emerald-600 underline hover:text-emerald-500"
                  >
                    Jak to funguje
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časový průběh výkupu privatizovaného bytu
          </h2>
          <p className="mt-4 text-slate-600">
            Celý proces je transparentní a předvídatelný. Zde je typický průběh
            výkupu krok za krokem. Více informací o našich garancích najdete na
            stránce{" "}
            <Link
              href="/garance-vykupu"
              className="font-medium text-emerald-600 underline hover:text-emerald-500"
            >
              Garance výkupu
            </Link>
            .
          </p>
          <div className="mt-8 space-y-6">
            {TIMELINE.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <step.icon className="h-5 w-5 text-emerald-600" />
                  </div>
                  {index < TIMELINE.length - 1 && (
                    <div className="mt-2 h-full w-px bg-emerald-200" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {step.time}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proč zvolit nás */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Proč prodat privatizovaný byt právě nám?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6 shadow-sm">
              <Shield className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Specializace na privatizaci
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Máme rozsáhlé zkušenosti s výkupem privatizovaných bytů. Známe
                všechna úskalí a dokážeme je vyřešit efektivně a rychle.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 shadow-sm">
              <Scale className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Právní zázemí
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Náš právní tým se specializuje na nemovitostní právo a
                privatizační problematiku. Veškerý právní servis hradíme my.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 shadow-sm">
              <Clock className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Rychlost a jistota
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Celý proces zvládneme za 2–4 týdny. Cena je garantována ve
                smlouvě — žádné změny na poslední chvíli.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 shadow-sm">
              <HandCoins className="h-6 w-6 text-emerald-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Nulové náklady pro vás
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Žádné provize, žádné poplatky. Veškeré náklady na právní servis,
                odhad i katastr hradíme my.
              </p>
            </div>
          </div>
          <p className="mt-6 text-slate-600">
            Stovky klientů úspěšně prodali svou nemovitost prostřednictvím
            našeho výkupu.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy k výkupu při privatizaci
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

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="rounded-2xl bg-emerald-50 p-8">
            <h2 className="text-xl font-bold text-slate-900">
              Prodejte privatizovaný byt rychle a bez starostí
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace a právní analýza zdarma. Do 24 hodin se vám
              ozveme s předběžnou nabídkou.
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
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-4">
          <RelatedArticles
            articles={getRelatedArticles("vykup-pri-privatizaci")}
          />
        </div>
      </section>

      <LeadMagnetCta />
    </>
  );
}
