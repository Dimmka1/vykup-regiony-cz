import type { Metadata } from "next";
import Link from "next/link";
import { safeJsonLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/caste-dotazy" },
  title: "Časté dotazy k výkupu nemovitostí",
  description:
    "Odpovědi na nejčastější otázky o rychlém výkupu nemovitostí v České republice. Jak probíhá výkup, kolik dostanete, jak dlouho trvá celý proces.",
};

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "Jak probíhá výkup nemovitosti?",
    answer:
      "Vyplníte formulář na stránkách — stačí adresa a typ nemovitosti. Do 24 hodin vám zavoláme s cenovou nabídkou. Pokud vám sedne, domluvíme prohlídku, připravíme kupní smlouvu a peníze vám pošleme do 48 hodin od podpisu.",
  },
  {
    question: "Kolik za mou nemovitost dostanu?",
    answer:
      "Nabízíme 80–90 % odhadní ceny. Přesná částka závisí na lokalitě, stavu a typu nemovitosti — u bytů v Praze je to jinak než u domu na vesnici. Provize ani poplatky neplatíte, takže co řekneme, to dostanete na účet.",
  },
  {
    question: "Jak dlouho celý proces trvá?",
    answer:
      "Od prvního kontaktu po vyplacení peněz to může být i 7 dní. Standardně celý výkup trvá 2–4 týdny, včetně právního zajištění a přepisu na katastru.",
  },
  {
    question: "Musím platit provizi nebo poplatky?",
    answer:
      "Ne, veškeré náklady spojené s převodem nemovitosti hradíme my. Neplatíte žádnou provizi realitní kanceláři ani poplatky za právní služby.",
  },
  {
    question: "Vykupujete i nemovitosti s exekucí nebo zástavou?",
    answer:
      "Ano, specializujeme se i na výkup nemovitostí zatížených exekucí, zástavním právem nebo jinými břemeny. Pomůžeme vám celou situaci vyřešit a dluh uhradit z kupní ceny.",
  },
  {
    question: "Musím nemovitost před prodejem opravovat?",
    answer:
      "Vůbec ne. Nemovitost kupujeme v aktuálním stavu - bez nutnosti rekonstrukce, malování nebo úklidu. To je jedna z hlavních výhod rychlého výkupu.",
  },
  {
    question: "Je nabídka závazná?",
    answer:
      "Naše první cenová nabídka je zcela nezávazná a zdarma. Teprve po vašem souhlasu a prohlídce nemovitosti připravíme závaznou nabídku a kupní smlouvu.",
  },
  {
    question: "Vykupujete nemovitosti v celé ČR?",
    answer:
      "Ano, působíme ve všech 14 krajích České republiky. Ať už vlastníte byt v Praze, dům na Moravě nebo pozemek v Karlovarském kraji - rádi vám pomůžeme.",
  },
  {
    question: "Jak je zajištěna bezpečnost transakce?",
    answer:
      "Převod běží přes advokátní úschovu — peníze leží na úschovním účtu, dokud katastr nezapíše nového vlastníka. Smlouvu připravuje advokát, který zastupuje vaše zájmy. Vy nám žádné peníze nepředáváte, je to naopak.",
  },
  {
    question: "Co když mám na nemovitosti hypotéku?",
    answer:
      "Žádný problém. Zbývající hypotéku uhradíme přímo bance z kupní ceny. Vy obdržíte rozdíl mezi dohodnutou cenou a zbytkem hypotéky.",
  },
  {
    question: "Mohu prodat i spoluvlastnický podíl?",
    answer:
      "Ano, vykupujeme i spoluvlastnické podíly na nemovitostech. Nemusíte čekat na souhlas ostatních spoluvlastníků - váš podíl můžete prodat samostatně.",
  },
  {
    question: "Kdy dostanu peníze?",
    answer:
      "Zálohu až 500 000 Kč vyplácíme přímo při podpisu smlouvy. Zbytek kupní ceny obdržíte do 3–5 pracovních dnů po zápisu do katastru. Když hoří (exekuce, dražba), zálohu pošleme ještě ten den.",
  },
] as const;

export default function CasteDotazyPage(): React.ReactElement {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
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
            Časté dotazy k výkupu nemovitostí
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Připravili jsme odpovědi na nejčastější otázky, které nám naši
            klienti pokládají. Pokud nenajdete odpověď na svou otázku,{" "}
            <Link
              href="/"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              kontaktujte nás
            </Link>
            .
          </p>

          <div className="mt-10 space-y-4">
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

          <div className="mt-12 rounded-2xl bg-emerald-50 p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Máte další otázky?
            </h2>
            <p className="mt-2 text-slate-600">
              Neváhejte nás kontaktovat - poradíme vám zdarma a nezávazně.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
              >
                Získat nabídku zdarma
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
              >
                Přečíst si náš blog
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            <Link
              href="/ochrana-osobnich-udaju"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Ochrana osobních údajů
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
