import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AllRegionsSection } from "@/components/all-regions-section";
import { getRequestHost } from "@/lib/request-host";
import { CNB_RATE } from "@/lib/cnb-rate";

const TITLE = "Sazby ČNB 2026 a dopad na prodej nemovitostí";
const DESCRIPTION =
  "Aktuální 2T repo sazba ČNB, vliv na hypotéky a proč je výkup nemovitosti výhodnější při vysokých úrokových sazbách. Kompletní přehled pro rok 2026.";
const SLUG = "sazby-cnb-2026";
const DATE_PUBLISHED = "2026-03-10";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    publishedTime: DATE_PUBLISHED,
  },
  alternates: {
    canonical: `https://vykoupim-nemovitost.cz/blog/${SLUG}`,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

function formatCzechDate(iso: string): string {
  return new Date(iso).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function SazbyCnb2026Page(): Promise<React.ReactElement> {
  const host = await getRequestHost();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: DATE_PUBLISHED,
    dateModified: CNB_RATE.lastUpdated,
    author: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    publisher: {
      "@type": "Organization",
      name: "Vykoupím Nemovitost",
      url: "https://vykoupim-nemovitost.cz",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vykoupim-nemovitost.cz/blog/${SLUG}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />

      <article className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: TITLE, href: `/blog/${SLUG}` },
              ]}
            />
          </div>

          <header>
            <time dateTime={DATE_PUBLISHED} className="text-sm text-slate-500">
              {formatCzechDate(DATE_PUBLISHED)}
            </time>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {TITLE}
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <span>2T repo sazba ČNB:</span>
              <span className="text-lg font-bold">{CNB_RATE.repoRate} %</span>
              <span className="text-xs text-slate-500">
                · Aktualizováno{" "}
                {new Date(CNB_RATE.lastUpdated).toLocaleDateString("cs-CZ", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <div className="prose-article mt-10 rounded-2xl bg-white p-8 shadow-sm">
            <p>
              Česká národní banka (ČNB) ovlivňuje celý nemovitostní trh
              prostřednictvím své měnové politiky. Klíčovým nástrojem je
              dvoutýdenní repo sazba, která aktuálně činí{" "}
              <strong>{CNB_RATE.repoRate} %</strong>. Tato sazba přímo ovlivňuje
              úrokové sazby hypoték, a tím i schopnost lidí kupovat nemovitosti.
              V tomto článku se podíváme na to, co aktuální sazby znamenají pro
              majitele nemovitostí, kteří zvažují prodej, a proč může být rychlý
              výkup v současné situaci výhodnější než čekání na klasického
              kupce.
            </p>

            <h2>Co je 2T repo sazba a proč na ní záleží</h2>
            <p>
              Dvoutýdenní repo sazba je základní úroková sazba České národní
              banky. Funguje jako referenční bod pro celý finanční systém —
              komerční banky podle ní nastavují úroky na úvěrech, hypotékách i
              spořicích účtech. Když ČNB sazbu zvýší, zdraží se půjčky a
              hypotéky. Když ji sníží, úvěry zlevní a trh s nemovitostmi se
              oživí.
            </p>
            <p>
              Bankovní rada ČNB o sazbě rozhoduje na pravidelných měnových
              zasedáních, která se konají přibližně osmkrát ročně. Rozhodnutí
              závisí na inflaci, ekonomickém růstu, kurzu koruny a dalších
              makroekonomických faktorech. Pro majitele nemovitostí je klíčové
              sledovat nejen aktuální sazbu, ale i výhled — tedy kam se sazby
              pravděpodobně budou ubírat v následujících měsících.
            </p>

            <h2>Historický vývoj sazeb ČNB</h2>
            <p>
              Abychom lépe pochopili současnou situaci, podívejme se na
              historický kontext. V období 2017–2019 se repo sazba pohybovala
              kolem 2 %. Během pandemie v roce 2020 ČNB sazbu dramaticky snížila
              na 0,25 %, což vedlo k hypotečnímu boomu a prudkému růstu cen
              nemovitostí. Levné hypotéky s úrokem pod 2 % přilákaly na trh
              tisíce nových kupujících.
            </p>
            <p>
              V roce 2022 pak ČNB reagovala na rostoucí inflaci agresivním
              zvyšováním sazeb až na 7 %. Hypotéky se rázem zdražily na 6–7 %
              ročně, poptávka po nemovitostech prudce klesla a ceny stagnovaly
              nebo mírně klesaly. Od konce roku 2023 ČNB postupně sazby snižuje.
              Aktuální sazba <strong>{CNB_RATE.repoRate} %</strong> představuje
              kompromis mezi podporou ekonomiky a kontrolou inflace.
            </p>

            <h2>Jak aktuální sazba {CNB_RATE.repoRate} % ovlivňuje hypotéky</h2>
            <p>
              Při repo sazbě {CNB_RATE.repoRate} % se hypoteční úroky pohybují
              přibližně kolem 4–5 % ročně. To znamená, že u hypotéky na 3
              miliony korun s dobou splácení 30 let činí měsíční splátka
              přibližně 15 000 až 17 000 Kč. Pro srovnání — v době nejnižších
              sazeb v roce 2021 byla stejná splátka kolem 10 000 Kč. Rozdíl v
              měsíční splátce tedy činí 5 000 až 7 000 Kč, což za rok
              představuje 60 000 až 84 000 Kč navíc.
            </p>
            <p>
              Vyšší splátky znamenají, že mnoho potenciálních kupců na hypotéku
              jednoduše nedosáhne. Banky zpřísnily podmínky pro schvalování
              hypoték — vyžadují vyšší příjmy, nižší poměr dluhů k příjmům a
              větší vlastní zdroje. Pro prodávající to znamená menší počet
              zájemců a delší dobu prodeje. Nemovitosti, které se v roce 2021
              prodávaly za týden, dnes mohou na kupce čekat měsíce.
            </p>

            <h2>Konec fixace hypotéky — problém tisíců Čechů</h2>
            <p>
              V letech 2020 a 2021 si desetitisíce Čechů pořídily hypotéky s
              úrokem pod 2 % a fixací na 3–5 let. Těmto lidem nyní končí výhodné
              fixace a musí přejít na nové podmínky — s úrokem kolem 4–5 %. To
              může znamenat nárůst měsíční splátky o tisíce korun. Více o tomto
              tématu a jak jej řešit najdete na naší stránce{" "}
              <Link
                href="/konec-fixace-hypoteky"
                className="text-emerald-600 hover:text-emerald-500"
              >
                Konec fixace hypotéky
              </Link>
              .
            </p>
            <p>
              Pro některé majitele může být refinancování za nových podmínek
              finančně neúnosné. V takovém případě je rychlý prodej nemovitosti
              racionálním řešením — lepší prodat za férovou cenu nyní, než
              riskovat platební neschopnost a potenciální exekuci. Výkupní firma
              dokáže celý proces zvládnout za 7–14 dní, což je v krizové situaci
              neocenitelná výhoda.
            </p>

            <h2>Proč je výkup nemovitosti výhodnější při vysokých sazbách</h2>
            <p>
              Vysoké úrokové sazby paradoxně zvyšují atraktivitu rychlého výkupu
              oproti klasickému prodeji přes realitní kancelář. Důvody jsou
              následující:
            </p>
            <p>
              <strong>Méně kupců s hypotékou na trhu.</strong> Při vysokých
              sazbách si méně lidí může dovolit hypotéku. Klasický prodej tak
              trvá déle — průměrně 4–6 měsíců místo obvyklých 2–3 měsíců v
              období nízkých sazeb. Výkupní firma kupuje za vlastní prostředky,
              takže na výši hypoték nezávisí. Nabídku dostanete do 24 hodin a
              peníze máte do dvou týdnů.
            </p>
            <p>
              <strong>Klesající kupní síla snižuje prodejní ceny.</strong> Když
              si kupující mohou dovolit nižší hypotéky, nemohou nabízet tak
              vysoké ceny. To tlačí tržní ceny dolů. Výkupní firma nabízí 80–90
              % aktuální tržní hodnoty — a v prostředí klesajících cen může být
              dnešních 85 % více než zítřejších 90 %.
            </p>
            <p>
              <strong>Čas jsou peníze — doslova.</strong> Každý měsíc čekání na
              kupce vás stojí peníze: splátky hypotéky, pojistné, daň z
              nemovitosti, energie, údržba. Pokud platíte hypotéku 15 000 Kč
              měsíčně a prodej přes realitku trvá 5 měsíců, stojí vás čekání 75
              000 Kč na splátkách plus další náklady. Rychlý výkup tyto náklady
              eliminuje.
            </p>

            <h2>Dopad na ceny nemovitostí v roce 2026</h2>
            <p>
              Aktuální situace na trhu je taková, že ceny nemovitostí ve velkých
              městech (Praha, Brno, Ostrava) se stabilizovaly, ale v menších
              městech a na periferii mohou stále mírně klesat. Analytici
              očekávají, že ČNB bude pokračovat v opatrném snižování sazeb během
              roku 2026, ale návrat k sazbám pod 2 % je v nedohlednu.
            </p>
            <p>
              Pro prodávající to znamená, že čekání na {"„"}lepší časy{"“"} s
              výrazně nižšími sazbami a vyššími cenami nemusí být racionální
              strategie. Trh se přizpůsobil vyšším sazbám a nový normál může být
              právě současná úroveň. Kdo potřebuje prodat, měl by jednat spíše
              dříve než později.
            </p>

            <h2>Výhled sazeb ČNB — co čekat ve zbytku roku 2026</h2>
            <p>
              Podle prognóz ČNB i nezávislých analytiků lze očekávat postupné
              snižování repo sazby směrem k 3–3,5 % do konce roku 2026. To by
              znamenalo mírné zlevnění hypoték na úroveň kolem 3,5–4,5 %.
              Zásadní obrat v dostupnosti bydlení to ale nepřinese — sazby
              zůstanou výrazně nad úrovněmi z let 2020–2021.
            </p>
            <p>
              Pro majitele nemovitostí je důležité vnímat širší kontext: i když
              sazby mírně klesnou, poptávka po nemovitostech roste pomalu a
              nabídka zůstává relativně vysoká. To znamená, že prodej
              nemovitosti v roce 2026 vyžaduje realistická očekávání a správnou
              strategii.
            </p>

            <h2>
              Prodej{" "}
              <Link
                href="/vykup-bytu"
                className="text-emerald-600 hover:text-emerald-500"
              >
                bytu
              </Link>{" "}
              v prostředí vyšších sazeb — praktické rady
            </h2>
            <p>
              Pokud zvažujete prodej bytu nebo domu v současném prostředí
              vyšších úrokových sazeb, zde je několik praktických doporučení. Za
              prvé, nečekejte na zázračný pokles sazeb. Trh se přizpůsobil a
              dramatický obrat není na obzoru. Za druhé, buďte realisté s cenou
              — přeceněná nemovitost bude ležet na trhu měsíce. Za třetí, zvažte
              více prodejních kanálů současně — inzerát, realitku i nabídku od
              výkupní firmy.
            </p>
            <p>
              Za čtvrté, pokud potřebujete prodat rychle (konec fixace, finanční
              potíže, rozvod, dědictví), výkup je nejefektivnější cesta. Žádné
              čekání na hypoteční schválení kupce, žádné riziko krachu obchodu
              na poslední chvíli. Nabídku získáte do 24 hodin a celý proces
              dokončíme za 7–14 dní.
            </p>

            <h2>Jak se chrání chytří majitelé nemovitostí</h2>
            <p>
              Nejchytřejší přístup v současné situaci je mít informace a
              připravený plán. Sledujte zasedání bankovní rady ČNB (termíny
              najdete na cnb.cz), porovnávejte nabídky hypoték při refinancování
              a mějte přehled o aktuálních cenách nemovitostí ve vaší lokalitě.
              Pokud vlastníte nemovitost, kterou neplánujete dlouhodobě držet,
              zvažte prodej v období relativní stability — tedy právě nyní —
              místo čekání na nejistou budoucnost.
            </p>
            <p>
              Nabízíme bezplatnou a nezávaznou konzultaci, při které posoudíme
              hodnotu vaší nemovitosti a doporučíme optimální strategii prodeje.
              Ať už se rozhodnete pro rychlý výkup nebo klasický prodej, budete
              mít jasný přehled o svých možnostech.
            </p>
          </div>

          {/* CTA section */}
          <div
            id="cta-calculator"
            className="mt-12 rounded-2xl bg-emerald-50 p-8 text-center"
          >
            <h2 className="text-xl font-bold text-slate-900">
              Spočítejte kolik ušetříte
            </h2>
            <p className="mt-2 text-slate-600">
              Získejte nezávaznou nabídku na výkup vaší nemovitosti do 24 hodin.
              Porovnejte s náklady na čekání při aktuálních sazbách{" "}
              {CNB_RATE.repoRate} % a zjistěte, co se vám vyplatí více.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
            >
              Spočítejte kolik ušetříte →
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm">
            <Link
              href="/konec-fixace-hypoteky"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Konec fixace hypotéky
            </Link>
            <Link
              href="/vykup-bytu"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Výkup bytu
            </Link>
            <Link
              href="/blog"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Všechny články
            </Link>
          </div>
        </div>
      </article>

      <AllRegionsSection currentHost={host} />
    </>
  );
}
