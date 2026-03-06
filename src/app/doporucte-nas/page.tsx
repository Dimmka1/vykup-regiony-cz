import type { Metadata } from "next";
import { safeJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReferralForm } from "@/components/referral-form";

const REFERRAL_BONUS = process.env.NEXT_PUBLIC_REFERRAL_BONUS ?? "5 000 Kč";

export const metadata: Metadata = {
  title: "Doporučte nás | vykoupim-nemovitost.cz",
  description: `Doporučte nás svým známým a získejte odměnu ${REFERRAL_BONUS} za každý úspěšný výkup nemovitosti.`,
  alternates: { canonical: "https://vykoupim-nemovitost.cz/doporucte-nas" },
};

const JSON_LD_WEBPAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Doporučte nás",
  description: `Doporučte nás svým známým a získejte odměnu ${REFERRAL_BONUS} za každý úspěšný výkup.`,
  url: "https://vykoupim-nemovitost.cz/doporucte-nas",
  publisher: {
    "@type": "Organization",
    name: "Výkup Nemovitostí",
    url: "https://vykoupim-nemovitost.cz",
  },
};

export default function DoporucteNasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(JSON_LD_WEBPAGE) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--theme-800)] to-[var(--theme-900)] pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Doporučte nás svým známým
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--theme-100)]">
            Získejte odměnu{" "}
            <strong className="text-amber-300">{REFERRAL_BONUS}</strong> za
            každý úspěšný výkup nemovitosti, který vzejde z vašeho doporučení.
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <div className="mx-auto max-w-4xl px-6 pt-6">
        <Breadcrumbs
          items={[{ label: "Doporučte nás", href: "/doporucte-nas" }]}
        />
      </div>

      {/* How it works */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Jak to funguje?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Vyplňte formulář",
                description:
                  "Zadejte své kontaktní údaje a údaje osoby, kterou nám doporučujete.",
              },
              {
                step: "2",
                title: "My se ozveme",
                description:
                  "Kontaktujeme doporučenou osobu a nabídneme jí nezávaznou konzultaci.",
              },
              {
                step: "3",
                title: "Získejte odměnu",
                description: `Po úspěšném výkupu vám vyplatíme odměnu ${REFERRAL_BONUS}.`,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-100)] text-xl font-bold text-[var(--theme-700)]">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="bg-slate-50 py-16" id="formular">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Doporučení
          </h2>
          <p className="mt-2 text-center text-slate-600">
            Vyplňte formulář a my se postaráme o zbytek.
          </p>
          <div className="mt-8">
            <ReferralForm />
          </div>
        </div>
      </section>
    </>
  );
}
