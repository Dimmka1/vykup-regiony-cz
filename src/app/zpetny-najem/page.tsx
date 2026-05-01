import type { Metadata } from "next";
import Link from "next/link";
import { Home, FileSignature, HandCoins, KeyRound } from "lucide-react";
import { safeJsonLd } from "@/lib/jsonld";
import { withHreflang } from "@/lib/seo-hreflang";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { RelatedArticles } from "@/components/related-articles";
import { RentCalculator } from "@/components/rent-calculator";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { GeoRelatedPages } from "@/components/geo-related-pages";
import { getRequestHost } from "@/lib/request-host";
import {
  buildGeoCanonicalUrl,
  buildGeoMetadataRobots,
} from "@/lib/geo-canonical";
import {
  resolveGeoRegion,
  injectRegionIntoTitle,
  injectRegionIntoDescription,
  injectRegionIntoH1,
} from "@/lib/geo-seo";
import { GeoServiceJsonLd } from "@/components/geo-service-jsonld";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const params = await searchParams;
  const canonicalUrl = buildGeoCanonicalUrl("/zpetny-najem", params);
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet | vykoupim-nemovitost.cz",
          region.locative,
        )
      : "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet | vykoupim-nemovitost.cz",
    description: region
      ? injectRegionIntoDescription(
          "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí. Férové podmínky, rychlé vyřízení.",
          region.locative,
        )
      : "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí. Férové podmínky, rychlé vyřízení.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Mohu po prodeji zůstat v nemovitosti bydlet?",
    answer:
      "Ano. Zpětný nájem (sale & leaseback) je transakce, při které vlastník prodá nemovitost a zároveň s novým vlastníkem uzavře nájemní smlouvu na stejnou nemovitost. Vy zůstáváte ve své nemovitosti jako nájemce, dostáváte plnou kupní cenu a platíte tržní nájemné.",
  },
  {
    question: "Jak dlouho mohu v nemovitosti zůstat?",
    answer:
      "Délka nájmu se stanovuje smlouvou — standardně 1–5 let s možností prodloužení nebo přeměny na nájem na dobu neurčitou. U zpětného leasingu lze sjednat i delší dobu (10+ let), pokud máte zájem o dlouhodobý nájem se stabilitou tržního nájemného.",
  },
  {
    question: "Kolik budu platit za nájem?",
    answer:
      "Nájemné odpovídá tržnímu nájemnému v dané lokalitě podle aktuálních inzerátů. Pro byt 2+kk v Praze obvykle 18–25 tisíc Kč/měsíc, ve středně velkém městě 12–18 tisíc Kč. Konkrétní výši uvedeme v cenové nabídce ještě před podpisem.",
  },
  {
    question: "Pro koho je zpětný nájem vhodný?",
    answer:
      "Pro seniory uvolňující finance z nemovitosti pro důchod, pro lidi řešící dluhy nebo exekuce bez nutnosti se stěhovat, pro podnikatele potřebující kapitál pro firmu, pro rodiče vyplácející dědictví dětem. Vždy tam, kde je nutná likvidita, ale nemovitost se nemá opouštět.",
  },
  {
    question: "Mohu si nemovitost odkoupit zpět?",
    answer:
      "Ano. Smlouva může obsahovat předkupní právo nebo opci odkupu — máte právo nemovitost odkoupit zpět za sjednanou cenu a v sjednaném termínu. Cena odkupu se stanovuje smluvně (typicky kupní cena + nájemné nebo aktuální tržní cena) a nemusíte dokládat příjmy.",
  },
  {
    question: "Co když nemovitost má hypotéku?",
    answer:
      "Hypotéku uhradíme přímo bance z kupní ceny při převodu vlastnictví. Po splacení banka vystaví potvrzení a vzdá se zástavního práva, které katastr vymaže. Vy obdržíte rozdíl a můžete v nemovitosti zůstat jako nájemce.",
  },
  {
    question: "Co když mě postihne exekuce — můžu zůstat v nájmu?",
    answer:
      "Ano. Po prodeji nemovitost přechází na nového vlastníka, exekuce se z ní vyplatí v plné výši. Nájemní smlouva mezi vámi a novým vlastníkem zůstává v platnosti — exekuce se vás dále netýká, dokud platíte nájem podle smlouvy.",
  },
  {
    question: "Jak rychle proběhne celá transakce?",
    answer:
      "Standardně 14 dnů od první konzultace. Smlouva se uzavírá současně jako kupní smlouva (převod vlastnictví) a nájemní smlouva (váš pobyt v nemovitosti). Smlouvu připravuje advokát a peníze procházejí advokátní úschovou podle pravidel České advokátní komory.",
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
      "Společně nastavíme výši nájmu, dobu trvání smlouvy a další podmínky podle vašich potřeb.",
  },
  {
    icon: KeyRound,
    title: "3. Prodej a nájemní smlouva",
    description:
      "Podepíšeme kupní smlouvu i nájemní smlouvu současně. Peníze dostanete ihned po zápisu do katastru.",
  },
  {
    icon: Home,
    title: "4. Bydlíte dál",
    description:
      "Zůstáváte ve svém domově jako nájemník. Žádné stěhování, žádný stres.",
  },
] as const;

export default async function ZpetnyNajemPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const host = await getRequestHost();
  const params = await searchParams;
  const krajParam = typeof params.kraj === "string" ? params.kraj : null;
  const region = resolveGeoRegion(params);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Zpětný nájem nemovitosti — prodejte a zůstaňte bydlet",
    description:
      "Prodejte nemovitost a zůstaňte v ní bydlet díky zpětnému nájmu. Získejte peníze ihned a bydlete dál bez starostí.",
    author: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://vykoupim-nemovitost.cz/zpetny-najem",
    },
    inLanguage: "cs-CZ",
    dateModified: "2026-05-01",
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://vykoupim-nemovitost.cz/zpetny-najem",
    name: "Zpětný nájem nemovitosti",
    url: "https://vykoupim-nemovitost.cz/zpetny-najem",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    speakable: buildSpeakableSpec(),
    dateModified: "2026-05-01",
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
        name: "Zpětný nájem",
        item: "https://vykoupim-nemovitost.cz/zpetny-najem",
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
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
      />

      <GeoServiceJsonLd useCaseSlug="zpetny-najem" searchParams={params} />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[{ label: "Zpětný nájem", href: "/zpetny-najem" }]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Prodejte nemovitost a zůstaňte bydlet — zpětný nájem",
                  region.locative,
                )
              : "Prodejte nemovitost a zůstaňte bydlet — zpětný nájem"}
          </h1>
          <LastUpdated path="/zpetny-najem" />
          <QuickAnswer>
            <p>
              Zpětný nájem (sale &amp; leaseback) je transakce, při které
              vlastník prodá nemovitost a zároveň s novým vlastníkem uzavře
              nájemní smlouvu na stejnou nemovitost. Vlastník dostane plnou
              kupní cenu (80–90 % tržní hodnoty), zůstává v nemovitosti jako
              nájemce a platí tržní nájemné. Smlouva může obsahovat opci na
              zpětný odkup za sjednanou cenu a v sjednaném termínu.
            </p>
            <p>
              Tato struktura je vhodná pro seniory uvolňující finance pro
              důchod, pro lidi řešící exekuce nebo dluhy bez nutnosti stěhování,
              pro podnikatele potřebující kapitál a pro řešení dědických
              vypořádání. Hypotéku nebo exekuci lze uhradit přímo z kupní ceny —
              věřitelé dostanou své peníze, vy zůstanete v nemovitosti.
            </p>
            <p>
              Kupní i nájemní smlouva se podepisují současně, smlouvy připravuje
              advokát, peníze procházejí{" "}
              <a
                href={EXTERNAL_SOURCES.cak.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                advokátní úschovou
              </a>{" "}
              do zápisu nového vlastníka v katastru. Celá transakce trvá 14 dnů
              a kupní cena se pohybuje 80–90 % tržní hodnoty.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
            Zpětný nájem (sale and leaseback) je moderní způsob, jak získat
            peníze z nemovitosti, aniž byste se museli stěhovat. Prodáte nám
            svůj byt nebo dům a současně s vámi uzavřeme nájemní smlouvu — vy
            bydlíte dál ve svém domově.
          </p>
          <p className="mt-4 text-slate-600">
            Toto řešení je ideální pro seniory, kteří chtějí uvolnit finance
            vázané v nemovitosti, pro lidi v tíživé finanční situaci, nebo pro
            kohokoli, kdo potřebuje rychle hotovost, ale nechce měnit své
            bydlení.
          </p>
          <p className="mt-4 text-slate-600">
            Na rozdíl od klasického prodeje nemusíte řešit stěhování, hledání
            nového bydlení ani změnu adresy. Vše zůstává při starém — jen místo
            vlastníka se stáváte nájemníkem s garantovanými podmínkami.
          </p>
          <p className="mt-4 text-slate-600">
            Nabízíme férovou výkupní cenu odpovídající 80–90 % tržní hodnoty a
            transparentní nájemní podmínky. Celý proces vyřídíme diskrétně a
            rychle — peníze můžete mít už do 14 dnů.
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
            <Home className="h-4 w-4 text-emerald-500" /> Zůstanete bydlet
          </span>
          <span className="flex items-center gap-2">
            <HandCoins className="h-4 w-4 text-emerald-500" /> Peníze ihned
          </span>
          <span className="flex items-center gap-2">
            <FileSignature className="h-4 w-4 text-emerald-500" /> Férový nájem
          </span>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Jak to funguje</h2>
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

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Kolik budete platit v nájmu?
          </h2>
          <p className="mt-2 text-slate-600">
            Orientační výpočet měsíčního nájmu podle ceny vaší nemovitosti.
          </p>
          <div className="mt-8">
            <RentCalculator />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">
            Časté dotazy ke zpětnému nájmu
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
              Získejte peníze a zůstaňte doma
            </h2>
            <p className="mt-2 text-slate-600">
              Nezávazná konzultace zdarma. Zjistěte, kolik můžete získat a za
              jakých podmínek.
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
          <RelatedArticles articles={getRelatedArticles("zpetny-najem")} />
        </div>
      </section>

      <GeoRelatedPages currentSlug="zpetny-najem" currentKraj={krajParam} />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
