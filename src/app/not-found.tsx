"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { trackEvent } from "@/lib/analytics";
import { DynamicPhone } from "@/components/dynamic-phone";

const POPULAR_REGIONS = [
  { label: "Praha", href: "/praha" },
  { label: "Středočeský kraj", href: "/stredocesky-kraj" },
  { label: "Jihomoravský kraj", href: "/jihomoravsky-kraj" },
  { label: "Moravskoslezský kraj", href: "/moravskoslezsky-kraj" },
  { label: "Plzeňský kraj", href: "/plzensky-kraj" },
  { label: "Ústecký kraj", href: "/ustecky-kraj" },
];

export default function NotFound() {
  useEffect(() => {
    trackEvent("page_not_found", { requestedUrl: window.location.href });
  }, []);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Breadcrumbs items={[{ label: "Stránka nenalezena", href: "/404" }]} />

        {/* Hero */}
        <div className="mt-8">
          <span className="text-8xl font-bold text-slate-200">404</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Stránka nenalezena
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Omlouváme se, ale hledaná stránka neexistuje nebo byla přesunuta.
          Zkuste se podívat na některý z odkazů níže.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            🏠 Zpět na hlavní stránku
          </Link>

          <DynamicPhone>
            {({ phone, href }) => (
              <a
                href={href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--theme-600)] px-6 py-3 text-base font-semibold text-[var(--theme-600)] shadow-sm transition-colors hover:bg-[var(--theme-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
              >
                📞 Zavolejte nám: {phone}
              </a>
            )}
          </DynamicPhone>
        </div>

        {/* All regions link */}
        <div className="mt-6">
          <Link
            href="/kraje"
            className="inline-flex items-center gap-2 text-base font-medium text-[var(--theme-600)] transition-colors hover:text-[var(--theme-700)]"
          >
            📍 Zobrazit všechny regiony
          </Link>
        </div>

        {/* Quick region links */}
        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Nejčastěji hledané regiony
          </h2>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {POPULAR_REGIONS.map((region) => (
              <Link
                key={region.href}
                href={region.href}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[var(--theme-300)] hover:bg-[var(--theme-50)] hover:text-[var(--theme-700)]"
              >
                {region.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Phone CTA bottom */}
        <p className="mt-10 text-sm text-slate-500">
          Potřebujete poradit? Zavolejte nám na{" "}
          <DynamicPhone className="font-medium text-[var(--theme-600)] transition-colors hover:text-[var(--theme-700)]" />{" "}
          — konzultace zdarma.
        </p>
      </div>
    </section>
  );
}
