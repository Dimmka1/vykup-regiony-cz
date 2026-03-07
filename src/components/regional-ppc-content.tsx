"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PpcLeadForm } from "@/components/ppc-lead-form";

interface Testimonial {
  name: string;
  text: string;
  location: string;
}

interface RegionalPpcContentProps {
  regionKey: string;
  locative: string;
  socialProofCount: number;
  uspBullets: string[];
  testimonial: Testimonial | null;
}

const USP_ICONS = ["⚡", "💰", "✅"];

function RegionalPpcInner({
  regionKey,
  locative,
  socialProofCount,
  uspBullets,
  testimonial,
}: RegionalPpcContentProps): ReactElement {
  const searchParams = useSearchParams();

  const utmSource = searchParams.get("utm_source") ?? "";
  const utmMedium = searchParams.get("utm_medium") ?? "";
  const utmCampaign = searchParams.get("utm_campaign") ?? "";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Logo only header — stripped down, no nav */}
      <header className="border-b border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-5xl px-4">
          <span className="text-xl font-bold text-slate-900">
            Výkup Nemovitostí
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Hero section with regional H1 */}
        <section className="mb-10 text-center sm:mb-14">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Rychlý výkup nemovitostí
            <br />
            <span className="text-[var(--theme-600)]">{locative}</span>
          </h1>
          <p className="mx-auto mb-4 max-w-2xl text-lg text-slate-600">
            Získejte nezávaznou nabídku do 24 hodin. Žádné provize, žádné skryté
            poplatky. Vše vyřídíme za vás.
          </p>

          {/* Social proof */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
            <span aria-hidden="true">✅</span>
            <span>
              Již {socialProofCount}+ úspěšných výkupů {locative}
            </span>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: USP bullets + guarantee */}
          <div className="space-y-8">
            {/* Regional USP bullets */}
            <section aria-label="Proč nás zvolit">
              <ul className="space-y-5">
                {uspBullets.map((point, idx) => (
                  <li key={idx} className="flex gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-50)] text-2xl"
                      aria-hidden="true"
                    >
                      {USP_ICONS[idx] ?? "📌"}
                    </span>
                    <div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {point}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Guarantee */}
            <section
              aria-label="Garance"
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <h3 className="mb-3 font-semibold text-slate-900">
                Naše garance
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ Garance ceny ve smlouvě</li>
                <li>✓ Platba do 48 hodin</li>
                <li>✓ Právní servis zdarma</li>
                <li>✓ Bez provize</li>
              </ul>
            </section>

            {/* Testimonial if available */}
            {testimonial && (
              <section
                aria-label="Reference"
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <blockquote className="text-sm italic text-slate-600">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  — {testimonial.name}, {testimonial.location}
                </p>
              </section>
            )}
          </div>

          {/* Right: Form with pre-selected region */}
          <div>
            <PpcLeadForm
              regionName={regionKey}
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

export function RegionalPpcContent(
  props: RegionalPpcContentProps,
): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500">Načítám…</p>
        </div>
      }
    >
      <RegionalPpcInner {...props} />
    </Suspense>
  );
}
