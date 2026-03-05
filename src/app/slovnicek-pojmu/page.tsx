import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Phone } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/slovnicek-pojmu",
  },
  title: "Slovníček pojmů - výkup nemovitostí od A do Z",
  description:
    "Vysvětlení 20+ klíčových pojmů z oblasti výkupu nemovitostí: exekuce, insolvence, katastr, hypotéka a další. Srozumitelně a prakticky.",
};

interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
}

const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    slug: "advokatni-uschova",
    term: "Advokátní úschova",
    definition:
      "Bezpečný způsob úschovy kupní ceny u advokáta během prodeje nemovitosti. Peníze jsou uvolněny prodávajícímu až po splnění dohodnutých podmínek, např. po zápisu do katastru. Při výkupu nemovitostí advokátní úschova chrání obě strany a zajišťuje férový průběh transakce.",
  },
  {
    slug: "dan-z-nabyti",
    term: "Daň z nabytí nemovitosti",
    definition:
      "Daň z nabytí nemovitých věcí byla v Česku zrušena v roce 2020. Dříve činila 4 % z kupní ceny a platil ji nabyvatel. Při výkupu nemovitosti dnes tuto daň platit nemusíte, což zjednodušuje a zlevňuje celý proces prodeje.",
  },
  {
    slug: "dedicke-rizeni",
    term: "Dědické řízení",
    definition:
      "Soudní proces, při kterém se po smrti vlastníka rozděluje majetek mezi dědice. Řízení může trvat měsíce i roky, zejména pokud se dědici neshodnou. Výkup zděděné nemovitosti umožňuje rychle vyřešit spoluvlastnictví a získat hotovost bez čekání na ukončení sporů.",
  },
  {
    slug: "drazba",
    term: "Dražba",
    definition:
      "Veřejný prodej nemovitosti, při kterém se cena stanovuje nabídkami účastníků. Dražba může být dobrovolná nebo nucená (exekuční). Oproti dražbě nabízí výkup nemovitosti jistotu prodejní ceny, rychlost a diskrétnost bez veřejného vystavení.",
  },
  {
    slug: "exekuce",
    term: "Exekuce",
    definition:
      "Nucený výkon soudního rozhodnutí, při kterém exekutor zabavuje majetek dlužníka k uspokojení věřitelů. Na nemovitost může být uvaleno exekuční zástavní právo. Výkup nemovitosti v exekuci je legální řešení — z kupní ceny se uhradí dluhy a zbytek obdrží prodávající.",
  },
  {
    slug: "hypoteka",
    term: "Hypotéka",
    definition:
      "Úvěr zajištěný zástavním právem k nemovitosti, typicky na její koupi nebo rekonstrukci. Pokud nesplácíte hypotéku, hrozí ztráta nemovitosti. Výkup nemovitosti s hypotékou je běžná praxe — z kupní ceny se předčasně splatí zůstatek úvěru a rozdíl dostanete vyplacen.",
  },
  {
    slug: "insolvence",
    term: "Insolvence",
    definition:
      "Stav, kdy dlužník není schopen splácet své závazky. V insolvenčním řízení se majetek dlužníka zpeněžuje ve prospěch věřitelů. Výkup nemovitosti v insolvenci může proběhnout se souhlasem insolvenčního správce a často je výhodnější než prodej v dražbě.",
  },
  {
    slug: "katastr-nemovitosti",
    term: "Katastr nemovitostí",
    definition:
      "Veřejný registr vedený katastrálními úřady, který eviduje vlastnická a další práva k nemovitostem v Česku. Z katastru zjistíte, kdo je vlastníkem, zda na nemovitosti neváznou zástavní práva nebo věcná břemena. Při výkupu nemovitosti je kontrola katastru prvním krokem.",
  },
  {
    slug: "kupni-smlouva",
    term: "Kupní smlouva",
    definition:
      "Písemná smlouva mezi prodávajícím a kupujícím, která převádí vlastnické právo k nemovitosti. Musí obsahovat přesnou identifikaci stran, nemovitosti a kupní cenu. Při výkupu nemovitosti připravujeme kupní smlouvu zdarma a zajišťujeme její právní bezchybnost.",
  },
  {
    slug: "list-vlastnictvi",
    term: "List vlastnictví",
    definition:
      "Výpis z katastru nemovitostí, který obsahuje informace o vlastníkovi, nemovitosti a případných právních závadách (zástavní práva, věcná břemena, exekuce). Při výkupu nemovitosti je list vlastnictví klíčový dokument pro ověření právního stavu.",
  },
  {
    slug: "nuceny-prodej",
    term: "Nucený prodej",
    definition:
      "Prodej nemovitosti nařízený soudem nebo exekutorem proti vůli vlastníka, typicky k úhradě dluhů. Nucený prodej bývá nevýhodný — nemovitost se často prodá pod tržní cenou. Včasný dobrovolný výkup je lepší alternativa, která vlastníkovi přinese vyšší cenu i důstojnější řešení.",
  },
  {
    slug: "odhad-nemovitosti",
    term: "Odhad nemovitosti",
    definition:
      "Stanovení tržní hodnoty nemovitosti odborníkem nebo znalcem. Odhad zohledňuje polohu, stav, velikost a aktuální situaci na trhu. Při výkupu nemovitosti provádíme odhad zdarma a na jeho základě vám předložíme férovou nabídku.",
  },
  {
    slug: "predkupni-pravo",
    term: "Předkupní právo",
    definition:
      "Právo určité osoby koupit nemovitost přednostně před ostatními zájemci. Předkupní právo může být zákonné (např. u spoluvlastníků) nebo smluvní. Při výkupu nemovitosti je nutné předkupní právo respektovat, jinak může být prodej napadnutelný.",
  },
  {
    slug: "rozvod-majetku",
    term: "Rozvod majetku",
    definition:
      "Vypořádání společného jmění manželů při rozvodu, včetně nemovitostí. Pokud se manželé nedohodnou, rozhoduje soud. Výkup nemovitosti při rozvodu je rychlé řešení — nemovitost prodáte a peníze si rozdělíte bez dlouhých soudních sporů.",
  },
  {
    slug: "spoluvlastnictvi",
    term: "Spoluvlastnictví",
    definition:
      "Situace, kdy nemovitost vlastní dva nebo více spoluvlastníků. Každý má ideální podíl, ale žádný nemá výlučné právo k konkrétní části. Výkup spoluvlastnického podílu umožňuje prodat váš podíl bez souhlasu ostatních spoluvlastníků.",
  },
  {
    slug: "trzni-hodnota",
    term: "Tržní hodnota",
    definition:
      "Odhadovaná cena, za kterou by se nemovitost prodala na volném trhu za standardních podmínek. Tržní hodnota se liší od ceny v katastru nebo pojistné hodnoty. Při výkupu nemovitostí nabízíme 80–90 % tržní hodnoty s výhodou okamžitého prodeje.",
  },
  {
    slug: "vecne-bremeno",
    term: "Věcné břemeno",
    definition:
      "Právní omezení spojené s nemovitostí, které zavazuje vlastníka něco strpět, konat nebo se něčeho zdržet (např. právo průchodu, dožití). Věcné břemeno snižuje hodnotu nemovitosti. Výkup nemovitosti s věcným břemenem je možný — specializujeme se na tyto případy.",
  },
  {
    slug: "vykup-nemovitosti",
    term: "Výkup nemovitosti",
    definition:
      "Přímý odkup nemovitosti výkupní firmou za hotovost, obvykle do 7–14 dnů. Na rozdíl od klasického prodeje přes realitní kancelář nabízí výkup rychlost, jistotu a žádné provize. Ideální řešení v situacích jako exekuce, rozvod nebo dědictví.",
  },
  {
    slug: "zaloha",
    term: "Záloha",
    definition:
      "Peněžní částka zaplacená předem jako potvrzení závazku koupit nemovitost. Záloha se započítává do kupní ceny. Při výkupu nemovitosti vyplácíme zálohu ihned po podpisu smlouvy, aby prodávající měl jistotu a finanční prostředky co nejdříve.",
  },
  {
    slug: "zastavni-pravo",
    term: "Zástavní právo",
    definition:
      "Právo věřitele uspokojit svou pohledávku z výtěžku prodeje zastavené nemovitosti, pokud dlužník nesplní svůj závazek. Zástavní právo se zapisuje do katastru. Při výkupu nemovitosti se zástavní právo vypořádá z kupní ceny a z katastru se vymaže.",
  },
  {
    slug: "znalecky-posudek",
    term: "Znalecký posudek",
    definition:
      "Oficiální dokument vypracovaný soudním znalcem, který stanovuje hodnotu nemovitosti. Na rozdíl od běžného odhadu má právní váhu a je vyžadován např. u soudních sporů nebo dědického řízení. Při výkupu nemovitosti znalecký posudek zajišťujeme na naše náklady.",
  },
];

// Extract unique first letters for alphabetical navigation
const ALPHABET_LETTERS = Array.from(
  new Set(
    GLOSSARY_TERMS.map((t) =>
      t.term
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .charAt(0)
        .toUpperCase(),
    ),
  ),
).sort();

function getLetterForTerm(term: string): string {
  return term
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .charAt(0)
    .toUpperCase();
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Slovníček pojmů - výkup nemovitostí",
  description:
    "Vysvětlení klíčových pojmů z oblasti výkupu nemovitostí v České republice.",
  url: "https://vykoupim-nemovitost.cz/slovnicek-pojmu",
  hasDefinedTerm: GLOSSARY_TERMS.map((t) => ({
    "@type": "DefinedTerm",
    name: t.term,
    description: t.definition,
    url: `https://vykoupim-nemovitost.cz/slovnicek-pojmu#${t.slug}`,
  })),
};

export default function SlovnicekPojmuPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <section className="bg-gradient-to-b from-slate-50 to-white py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Breadcrumbs
            items={[{ label: "Slovníček pojmů", href: "/slovnicek-pojmu" }]}
          />

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Slovníček pojmů
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Přehled klíčových pojmů z oblasti{" "}
            <Link
              href="/"
              className="text-[var(--theme-600)] underline hover:text-[var(--theme-700)]"
            >
              výkupu nemovitostí
            </Link>
            . Srozumitelně a prakticky — abyste věděli, co vás čeká.
          </p>

          {/* Alphabetical navigation */}
          <nav
            aria-label="Abecední navigace"
            className="mt-8 flex flex-wrap gap-2"
          >
            {ALPHABET_LETTERS.map((letter) => (
              <a
                key={letter}
                href={`#pismeno-${letter.toLowerCase()}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-[var(--theme-50)] hover:text-[var(--theme-700)] hover:ring-[var(--theme-300)]"
              >
                {letter}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-4xl px-4">
          {ALPHABET_LETTERS.map((letter) => {
            const termsForLetter = GLOSSARY_TERMS.filter(
              (t) => getLetterForTerm(t.term) === letter,
            );
            if (termsForLetter.length === 0) return null;
            return (
              <div
                key={letter}
                id={`pismeno-${letter.toLowerCase()}`}
                className="mb-10"
              >
                <h2 className="mb-4 border-b-2 border-[var(--theme-200)] pb-2 text-2xl font-bold text-[var(--theme-700)]">
                  {letter}
                </h2>
                <div className="space-y-6">
                  {termsForLetter.map((t) => (
                    <article
                      key={t.slug}
                      id={t.slug}
                      className="scroll-mt-24 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
                    >
                      <h3 className="text-xl font-semibold text-slate-900">
                        <a
                          href={`#${t.slug}`}
                          className="hover:text-[var(--theme-600)]"
                        >
                          {t.term}
                        </a>
                      </h3>
                      <p className="mt-2 leading-relaxed text-slate-600">
                        {t.definition}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-[var(--theme-600)] py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Potřebujete pomoc s výkupem nemovitosti?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Ozvěte se nám — poradíme vám zdarma a nezávazně.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/#kontakt"
              className="inline-flex items-center rounded-xl bg-white px-8 py-3 font-semibold text-[var(--theme-700)] shadow-lg transition hover:bg-slate-50"
            >
              Nezávazná konzultace
            </Link>
            <a
              href="tel:+420776888999"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              Zavolat ihned
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
