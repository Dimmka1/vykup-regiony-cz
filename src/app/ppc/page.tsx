"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PpcLeadForm } from "@/components/ppc-lead-form";

const TRUST_BULLETS = [
  {
    icon: "⚡",
    title: "Nabídka do 24 hodin",
    description: "Nezávaznou nabídku dostanete do jednoho pracovního dne.",
  },
  {
    icon: "💰",
    title: "Férová cena",
    description: "Nabízíme až 90 % tržní hodnoty vaší nemovitosti.",
  },
  {
    icon: "✅",
    title: "Bez starostí",
    description: "Vše vyřídíme za vás — právník, odhad, smlouvy.",
  },
] as const;

const TESTIMONIAL = {
  author: "Jana K.",
  city: "Praha",
  quote:
    "Potřebovala jsem prodat byt rychle kvůli rozvodu. Nabídku jsem dostala do 24 hodin a do měsíce bylo vše vyřízeno. Profesionální a férový přístup.",
};

function PpcPageContent(): ReactElement {
  const searchParams = useSearchParams();

  const utmSource = searchParams.get("utm_source") ?? "";
  const utmMedium = searchParams.get("utm_medium") ?? "";
  const utmCampaign = searchParams.get("utm_campaign") ?? "";
  const region = searchParams.get("region") ?? "praha";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Logo only header */}
      <header className="border-b border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-5xl px-4">
          <span className="text-xl font-bold text-slate-900">
            Výkup Nemovitostí
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Hero section */}
        <section className="mb-10 text-center sm:mb-14">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Vykoupíme vaši nemovitost
            <br />
            <span className="text-[var(--theme-600)]">rychle a férově</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            Získejte nezávaznou nabídku do 24 hodin. Žádné provize, žádné skryté
            poplatky. Vše vyřídíme za vás.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Trust bullets + testimonial */}
          <div className="space-y-8">
            {/* Trust bullets */}
            <section aria-label="Proč nás zvolit">
              <ul className="space-y-5">
                {TRUST_BULLETS.map((bullet) => (
                  <li key={bullet.title} className="flex gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-50)] text-2xl"
                      aria-hidden="true"
                    >
                      {bullet.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {bullet.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {bullet.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Testimonial */}
            <section
              aria-label="Reference"
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <blockquote>
                <p className="mb-3 text-sm italic leading-relaxed text-slate-700">
                  &ldquo;{TESTIMONIAL.quote}&rdquo;
                </p>
                <footer className="text-sm font-semibold text-slate-900">
                  — {TESTIMONIAL.author}, {TESTIMONIAL.city}
                </footer>
              </blockquote>
            </section>
          </div>

          {/* Right: Form */}
          <div>
            <PpcLeadForm
              regionName={region}
              utmSource={utmSource}
              utmMedium={utmMedium}
              utmCampaign={utmCampaign}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PpcPage(): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500">Načítám…</p>
        </div>
      }
    >
      <PpcPageContent />
    </Suspense>
  );
}
