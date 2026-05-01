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
import { withHreflang } from "@/lib/seo-hreflang";
import { buildSpeakableSpec } from "@/lib/jsonld-speakable";
import { EXTERNAL_SOURCES } from "@/lib/external-sources";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LastUpdated } from "@/components/last-updated";
import { QuickAnswer } from "@/components/quick-answer";
import { RelatedArticles } from "@/components/related-articles";
import { getRelatedArticles } from "@/lib/related-articles";
import { AllRegionsSection } from "@/components/all-regions-section";
import { GeoRelatedPages } from "@/components/geo-related-pages";
import { GeoRegionContent } from "@/components/geo-region-content";
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
  const canonicalUrl = buildGeoCanonicalUrl(
    "/vykup-nemovitosti-s-hypotekou",
    params,
  );
  const region = resolveGeoRegion(params);
  const robots = buildGeoMetadataRobots(params);

  return {
    alternates: withHreflang({ canonical: canonicalUrl }),
    openGraph: { url: canonicalUrl },
    title: region
      ? injectRegionIntoTitle(
          "Výkup nemovitosti s hypotékou - rychlé řešení zatížené nemovitosti",
          region.locative,
        )
      : "Výkup nemovitosti s hypotékou - rychlé řešení zatížené nemovitosti",
    description: region
      ? injectRegionIntoDescription(
          "Vykoupíme nemovitost zatíženou hypotékou nebo zástavním právem. Vyřešíme komunikaci s bankou, splatíme úvěr z kupní ceny. Výplata do 7 dnů, bez provize.",
          region.locative,
        )
      : "Vykoupíme nemovitost zatíženou hypotékou nebo zástavním právem. Vyřešíme komunikaci s bankou, splatíme úvěr z kupní ceny. Výplata do 7 dnů, bez provize.",
    ...(robots && { robots }),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Lze prodat nemovitost s nesplacenou hypotékou?",
    answer:
      "Ano, prodej nemovitosti s hypotékou je legální a běžný postup. Zůstatek hypotéky se uhradí přímo bance z kupní ceny při převodu vlastnictví. Komunikaci s bankou ohledně předčasného splacení a výmazu zástavního práva vede náš právní zástupce.",
  },
  {
    question: "Co když dlužím na hypotéce více, než je hodnota nemovitosti?",
    answer:
      "U podvodní hypotéky (negative equity) je nutné rozdíl mezi zůstatkem hypotéky a výkupní cenou doplatit. Některé banky umožňují konverzi rozdílu na nezajištěný úvěr nebo dohodu o splátkovém kalendáři. Postup vyjednáváme s bankou individuálně pro každý případ.",
  },
  {
    question: "Jak rychle dokážete nemovitost s hypotékou vykoupit?",
    answer:
      "Standardně 14–30 dnů. K běžné lhůtě výkupu se přičítá komunikace s bankou ohledně potvrzení zůstatku, předčasného splacení a výmazu zástavního práva v katastru. Některé banky tuto lhůtu prodlužují, pracujeme s nimi paralelně s přípravou smlouvy.",
  },
  {
    question: "Jaký je poplatek bance za předčasné splacení hypotéky?",
    answer:
      "Podle zákona č. 257/2016 Sb. o spotřebitelském úvěru je poplatek za předčasné splacení omezen na nutné a účelně vynaložené náklady banky — typicky 0,1–1 % z předčasně splacené částky. U hypoték před fixací úrokové sazby je poplatek vyšší. Přesnou výši zjistíme z výpisu z účtu nebo dotazem v bance.",
  },
  {
    question: "Co když mám hypotéku u dvou bank současně?",
    answer:
      "Postup je obdobný — obě banky se musí písemně vzdát zástavního práva po splacení svých pohledávek. Naši právníci koordinují proces s oběma bankami současně, aby výmaz zástavního práva v katastru proběhl ve stejném vkladovém řízení.",
  },
  {
    question: "Vykupujete i nemovitost s hypotékou v exekuci?",
    answer:
      "Ano. Při kombinaci hypotéky a exekuce nejprve uhradíme exekuční pohledávky (přednost má přednostní pohledávka), pak zůstatek hypotéky. Postup ověřujeme v Centrální evidenci exekucí a v katastru — vidíme všechna zatížení současně.",
  },
  {
    question: "Co když má hypotéku jen jeden z manželů?",
    answer:
      "Hypotéka uzavřená jedním manželem za trvání manželství spadá do SJM. Při rozvodu nebo prodeji se hypotéka vypořádá podle režimu SJM. Pokud hypotéka byla uzavřena před manželstvím, jde o samostatný dluh — vypořádává se odděleně.",
  },
  {
    question: "Můžu si nemovitost po výkupu pronajmout zpátky?",
    answer:
      "Ano, jde o tzv. zpětný leasing (sale & leaseback). Po výkupu zůstanete v nemovitosti jako nájemce s nájemní smlouvou. Tato varianta je vhodná, pokud chcete získat likviditu, ale neopustit nemovitost. Detail najdete na samostatné stránce o zpětném nájmu.",
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

export default async function VykupNemovitostiSHypotekou({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<React.ReactElement> {
  const host = await getRequestHost();
  const params = await searchParams;
  const krajParam = typeof params.kraj === "string" ? params.kraj : null;
  const region = resolveGeoRegion(params);
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
    "@id": "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou",
    name: "Výkup nemovitosti s hypotékou",
    description:
      "Vykoupíme nemovitost zatíženou hypotékou nebo zástavním právem rychle a bez komplikací.",
    url: "https://vykoupim-nemovitost.cz/vykup-nemovitosti-s-hypotekou",
    inLanguage: "cs-CZ",
    isPartOf: { "@id": "https://vykoupim-nemovitost.cz/#website" },
    publisher: { "@id": "https://vykoupim-nemovitost.cz/#organization" },
    speakable: buildSpeakableSpec(),
    dateModified: "2026-05-01",
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

      <GeoServiceJsonLd
        useCaseSlug="vykup-nemovitosti-s-hypotekou"
        searchParams={params}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6">
            <Breadcrumbs
              items={[
                {
                  label: "Výkup s hypotékou",
                  href: "/vykup-nemovitosti-s-hypotekou",
                },
              ]}
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {region
              ? injectRegionIntoH1(
                  "Výkup nemovitosti s hypotékou",
                  region.locative,
                )
              : "Výkup nemovitosti s hypotékou"}
          </h1>
          <LastUpdated path="/vykup-nemovitosti-s-hypotekou" />
          <QuickAnswer>
            <p>
              Nemovitost zatíženou hypotékou lze legálně prodat — zůstatek úvěru
              se uhradí přímo bance z kupní ceny při převodu vlastnictví.
              Výkupní cena se pohybuje 80–90 % tržní hodnoty nemovitosti,
              prodávající dostává rozdíl mezi výkupní cenou a zůstatkem
              hypotéky. Sazby a regulace hypotečního trhu vede{" "}
              <a
                href={EXTERNAL_SOURCES.cnb.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                Česká národní banka
              </a>
              .
            </p>
            <p>
              Poplatek za předčasné splacení je podle zákona č. 257/2016 Sb.
              omezen na účelně vynaložené náklady banky — typicky 0,1–1 %
              předčasně splacené částky. Banka po splacení vystaví potvrzení a
              vzdá se zástavního práva, které následně katastrální úřad vymaže z
              listu vlastnictví. Komunikaci s bankou, dohodu o předčasném
              splacení a přípravu kupní smlouvy v advokátní úschově zajišťujeme
              za prodávajícího.
            </p>
            <p>
              Celý proces trvá 14–30 dnů — k běžné lhůtě výkupu se přičítá
              komunikace s bankou, ověření zůstatku, předčasné splacení a výmaz
              zástavního práva v katastru. Vykupujeme nemovitosti i s hypotékou
              v exekuci, u dvou bank současně, nebo s kombinací hypotéky a
              věcného břemene.
            </p>
          </QuickAnswer>
          <p className="mt-6 text-lg text-slate-600">
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
      <GeoRegionContent
        useCaseSlug="vykup-nemovitosti-s-hypotekou"
        regionKey={krajParam}
      />

      <GeoRelatedPages
        currentSlug="vykup-nemovitosti-s-hypotekou"
        currentKraj={krajParam}
      />
      <AllRegionsSection currentHost={host} />
    </>
  );
}
