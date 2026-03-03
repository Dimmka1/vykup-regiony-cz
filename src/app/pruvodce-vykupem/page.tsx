import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LeadMagnetForm } from "@/components/lead-magnet-form";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/pruvodce-vykupem",
  },
  title: "Průvodce rychlým výkupem nemovitosti — zdarma ke stažení",
  description:
    "Stáhněte si zdarma PDF průvodce rychlým výkupem nemovitosti. Dozvíte se, jak probíhá výkup, na co si dát pozor a jak získat nejlepší cenu.",
};

export default function PruvodceVykupemPage(): React.ReactElement {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Domů", href: "/" },
          { label: "Průvodce výkupem", href: "/pruvodce-vykupem" },
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--theme-50)] to-white px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 text-5xl">📚</div>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Stáhněte si zdarma: Průvodce rychlým výkupem nemovitosti
          </h1>
          <p className="mb-8 text-lg text-slate-600 sm:text-xl">
            Vše, co potřebujete vědět o prodeji nemovitosti — od prvního
            kontaktu po předání peněz. Bez registrace, bez závazků.
          </p>
          <LeadMagnetForm />
        </div>
      </section>

      {/* What's inside */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
            Co v průvodci najdete?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: "📋",
                title: "Jak probíhá výkup krok za krokem",
                desc: "Celý proces od prvního kontaktu po převod peněz přehledně vysvětlený.",
              },
              {
                icon: "💰",
                title: "Jak získat nejlepší cenu",
                desc: "Tipy, jak maximalizovat hodnotu vaší nemovitosti při rychlém prodeji.",
              },
              {
                icon: "⚖️",
                title: "Právní aspekty a dokumenty",
                desc: "Jaké dokumenty potřebujete a na co si dát pozor v kupní smlouvě.",
              },
              {
                icon: "⏰",
                title: "Časový harmonogram",
                desc: "Realistický přehled, jak dlouho jednotlivé kroky trvají.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
