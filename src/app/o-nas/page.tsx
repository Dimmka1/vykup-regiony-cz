import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Handshake,
  Heart,
  Building2,
  Award,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { safeJsonLd } from "@/lib/jsonld";

/* ------------------------------------------------------------------ */
/*  Env-driven defaults                                                */
/* ------------------------------------------------------------------ */
const FOUNDER_NAME =
  process.env.NEXT_PUBLIC_FOUNDER_NAME ?? "Tým Výkupím Nemovitost";
const YEARS_ACTIVE = process.env.NEXT_PUBLIC_YEARS_ACTIVE ?? "3+";
const DEALS_COMPLETED = process.env.NEXT_PUBLIC_DEALS_COMPLETED ?? "200+";

const SITE_URL = "https://vykoupim-nemovitost.cz";

/* ------------------------------------------------------------------ */
/*  SEO metadata                                                       */
/* ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "O nás — Výkupím Nemovitost | Kdo jsme a proč nám věřit",
  description:
    "Zjistěte, kdo stojí za Výkupím Nemovitost. Náš příběh, hodnoty, certifikáty a důvody, proč nám důvěřují stovky klientů po celé České republice.",
  alternates: { canonical: `${SITE_URL}/o-nas` },
  openGraph: {
    title: "O nás — Výkupím Nemovitost | Kdo jsme a proč nám věřit",
    description:
      "Zjistěte, kdo stojí za Výkupím Nemovitost. Náš příběh, hodnoty a důvody, proč nám důvěřují stovky klientů.",
    url: `${SITE_URL}/o-nas`,
    type: "website",
  },
};

/* ------------------------------------------------------------------ */
/*  JSON-LD schemas                                                    */
/* ------------------------------------------------------------------ */
const REGIONS_SERVED = [
  "Praha",
  "Středočeský kraj",
  "Jihočeský kraj",
  "Plzeňský kraj",
  "Karlovarský kraj",
  "Ústecký kraj",
  "Liberecký kraj",
  "Královéhradecký kraj",
  "Pardubický kraj",
  "Kraj Vysočina",
  "Jihomoravský kraj",
  "Olomoucký kraj",
  "Moravskoslezský kraj",
  "Zlínský kraj",
];

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Výkupím Nemovitost",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+420776424145",
    contactType: "customer service",
    availableLanguage: ["Czech"],
    areaServed: REGIONS_SERVED.map((r) => ({
      "@type": "AdministrativeArea",
      name: r,
    })),
  },
  areaServed: REGIONS_SERVED.map((r) => ({
    "@type": "AdministrativeArea",
    name: r,
  })),
  sameAs: [],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: FOUNDER_NAME,
  jobTitle: "Zakladatel",
  worksFor: {
    "@type": "Organization",
    name: "Výkupím Nemovitost",
    url: SITE_URL,
  },
  sameAs: ["https://www.linkedin.com/in/PLACEHOLDER"],
};

/* ------------------------------------------------------------------ */
/*  Values data                                                        */
/* ------------------------------------------------------------------ */
const VALUES = [
  {
    icon: ShieldCheck,
    title: "Transparentnost",
    description:
      "Žádné skryté poplatky, žádné drobné písmo. Otevřeně komunikujeme každý krok procesu — od prvního ocenění až po podpis smlouvy. Každý klient má přístup ke kompletní dokumentaci a může si nechat vše zkontrolovat vlastním právníkem.",
  },
  {
    icon: Zap,
    title: "Rychlost",
    description:
      "Nabídku předložíme do 24 hodin, celou transakci zvládneme za 7 až 14 dní. Víme, že čas hraje roli — ať už řešíte rozvod, dědictví nebo finanční potíže. Proto jsme celý proces navrhli tak, aby byl maximálně efektivní bez zbytečné byrokracie.",
  },
  {
    icon: Handshake,
    title: "Férovost",
    description:
      "Nabízíme reálné ceny odpovídající aktuálnímu trhu. Nepoužíváme nátlakové taktiky, nedáváme nerealistické sliby. Naše nabídka vychází z důkladné analýzy tržních dat a individuálního posouzení každé nemovitosti. Cena, na které se dohodneme, je cena, kterou obdržíte.",
  },
  {
    icon: Heart,
    title: "Osobní přístup",
    description:
      "Každá situace je jiná a zaslouží si individuální řešení. Nasloucháme vašim potřebám a přizpůsobujeme proces vašim okolnostem. Ať už potřebujete delší lhůtu pro vystěhování nebo pomoc s jednáním s exekutorem — jsme tu pro vás.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ONasPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <Breadcrumbs items={[{ label: "O nás", href: "/o-nas" }]} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Kdo stojí za Výkupím Nemovitost
          </h1>
          <p className="mt-4 text-lg text-slate-600 md:text-xl">
            Jsme tým odborníků na výkup nemovitostí, který pomáhá lidem po celé
            České republice rychle a bezpečně prodat jejich nemovitosti. Za dobu
            naší existence jsme pomohli stovkám klientů vyřešit složité životní
            situace — od rozvodů přes dědictví až po exekuce.
          </p>
        </div>
      </section>

      {/* Náš příběh */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Náš příběh
          </h2>
          <div className="mt-8 space-y-6 leading-relaxed text-slate-700">
            <p>
              Výkupím Nemovitost vznikl z přesvědčení, že prodej nemovitosti
              nemusí být zdlouhavý, stresující ani komplikovaný proces.
              Zakladatel {FOUNDER_NAME} se s realitním trhem setkával dlouhé
              roky a opakovaně viděl, jak lidé v obtížných životních situacích
              narážejí na nepružný systém klasického prodeje. Čekání měsíce na
              kupce, nejistota, zda se obchod vůbec uskuteční, a vysoké provize
              realitních kanceláří — to vše motivovalo ke vzniku alternativního
              řešení.
            </p>
            <p>
              Naše firma byla založena s jasnou vizí: nabídnout lidem rychlý,
              transparentní a férový způsob, jak prodat nemovitost bez
              zbytečných komplikací. Od prvního dne jsme se zaměřili na to,
              abychom celý proces maximálně zjednodušili. Klient vyplní krátký
              formulář, do 24 hodin obdrží cenovou nabídku a celá transakce může
              být dokončena za pouhé dva týdny. Žádné skryté poplatky, žádné
              provize, žádná nejistota.
            </p>
            <p>
              Za {YEARS_ACTIVE} let fungování jsme úspěšně dokončili více než{" "}
              {DEALS_COMPLETED} transakcí napříč všemi 14 kraji České republiky.
              Pomohli jsme rodinám procházejícím rozvodem spravedlivě rozdělit
              majetek, dědicům rychle vyřešit zdlouhavá dědická řízení a
              dlužníkům zachránit co nejvíce z hodnoty nemovitosti před hrozící
              exekucí. Každý případ je pro nás jedinečný a ke každému klientovi
              přistupujeme individuálně.
            </p>
            <p>
              Náš tým dnes tvoří zkušení odborníci na ocenění nemovitostí,
              právníci specializující se na nemovitostní právo a klientští
              poradci, kteří provázejí prodávající celým procesem. Věříme, že
              důvěra se buduje činy, nikoliv slovy — proto klademe důraz na
              transparentnost v každém kroku spolupráce.
            </p>
          </div>
        </div>
      </section>

      {/* Naše hodnoty */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Naše hodnoty
          </h2>
          <p className="mt-4 text-slate-600">
            Každé rozhodnutí, které děláme, vychází ze čtyř základních pilířů.
            Tyto hodnoty definují, jak přistupujeme ke klientům, partnerům i k
            sobě navzájem.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <value.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proč nám věřit */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Proč nám věřit
          </h2>
          <p className="mt-4 text-slate-600">
            Důvěra je základ každé úspěšné transakce. Zde jsou konkrétní důvody,
            proč nám klienti svěřují prodej svých nemovitostí.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <Clock className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">
                  {YEARS_ACTIVE} let na trhu
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Prokazatelná historie úspěšných výkupů nemovitostí v celé
                  České republice. Dlouhodobé působení na trhu je zárukou
                  stability a spolehlivosti.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">
                  14 krajů České republiky
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Působíme ve všech krajích — od Prahy přes Brno a Ostravu až po
                  menší města a obce. Znalost lokálního trhu nám umožňuje
                  nabídnout reálné a férové ocenění.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <Users className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">
                  {DEALS_COMPLETED} dokončených transakcí
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Každá transakce je dokladem naší zkušenosti. Pomohli jsme
                  stovkám klientů v rozmanitých situacích — od jednoduchých
                  prodejů po složité právní případy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">
                  Advokátní úschova peněz
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Všechny platby procházejí přes advokátní úschovu —
                  nejbezpečnější způsob převodu peněz při prodeji nemovitosti.
                  Vaše peníze jsou chráněny zákonem.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">
                  Ověřený proces krok za krokem
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Náš proces je navržený tak, aby byl transparentní a
                  předvídatelný. Každý krok je jasně popsán a klient má vždy
                  přehled o tom, co se děje a co bude následovat.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <Handshake className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-slate-900">
                  Bezplatná konzultace bez závazků
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  První konzultace je vždy zdarma a nezávazná. Netlačíme na
                  okamžité rozhodnutí — dáváme klientům prostor na rozmyšlenou a
                  doporučujeme konzultovat nabídku s rodinou či právníkem.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4 leading-relaxed text-slate-700">
            <p>
              Celý náš výkupní proces probíhá podle jasně definovaných kroků,
              které zajišťují maximální bezpečnost a transparentnost pro obě
              strany. Začínáme nezávaznou konzultací, pokračujeme odborným
              oceněním nemovitosti a po odsouhlasení nabídky připravíme veškerou
              smluvní dokumentaci. Podrobný popis jednotlivých kroků najdete na
              stránce{" "}
              <Link
                href="/jak-to-funguje"
                className="text-emerald-600 hover:text-emerald-500"
              >
                Jak to funguje
              </Link>
              . Pokud vás zajímají zkušenosti našich klientů, podívejte se na
              naše{" "}
              <Link
                href="/reference"
                className="text-emerald-600 hover:text-emerald-500"
              >
                reference
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Certifikáty a členství */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Certifikáty a členství
          </h2>
          <p className="mt-4 text-slate-600">
            Naše podnikání je plně v souladu s českým právním řádem. Klademe
            důraz na profesionalitu a dodržování nejvyšších standardů v oboru.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Building2 className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                Registrovaný podnikatel
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Řádně registrovaný podnikatelský subjekt v České republice se
                všemi potřebnými oprávněními pro činnost v oblasti výkupu
                nemovitostí.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                Pojištění profesní odpovědnosti
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Disponujeme pojištěním profesní odpovědnosti, které chrání naše
                klienty v případě jakýchkoliv komplikací během transakce.
              </p>
            </div>

            <div className="flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <Award className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                Spolupráce s advokátními kancelářemi
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Spolupracujeme s renomovanými advokátními kancelářemi, které
                zajišťují bezchybnou právní stránku každé transakce včetně
                advokátní úschovy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Chcete prodat nemovitost rychle a bezpečně?
          </h2>
          <p className="mt-4 text-slate-600">
            Získejte nezávaznou cenovou nabídku do 24 hodin. Konzultace je
            zdarma a bez jakýchkoliv závazků — pomáháme klientům ve všech 14
            krajích České republiky.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              Získat nabídku zdarma
            </Link>
            <Link
              href="/jak-to-funguje"
              className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Jak to funguje
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
