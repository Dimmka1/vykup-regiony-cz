"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";
import { CheckCircle, Phone, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function DekujemePage(): ReactElement {
  useEffect(() => {
    trackEvent("form_submission_success", {
      page: "dekujeme",
    });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[var(--theme-50)] to-white px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--theme-100)]">
          <CheckCircle
            className="h-10 w-10 text-[var(--theme-600)]"
            aria-hidden="true"
          />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-slate-900">
          Děkujeme za vaši poptávku!
        </h1>

        <p className="mb-8 text-lg text-slate-600">
          Ozveme se vám <strong>do 24 hodin</strong> s nezávaznou nabídkou na
          výkup vaší nemovitosti.
        </p>

        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Co bude následovat
          </h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-sm font-bold text-[var(--theme-700)]">
                1
              </span>
              <span className="text-slate-700">
                Náš specialista posoudí vaši nemovitost a připraví nabídku.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-sm font-bold text-[var(--theme-700)]">
                2
              </span>
              <span className="text-slate-700">
                Zavoláme vám s konkrétní cenovou nabídkou - nezávazně.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--theme-100)] text-sm font-bold text-[var(--theme-700)]">
                3
              </span>
              <span className="text-slate-700">
                Pokud souhlasíte, vyřídíme vše za vás - rychle a bez starostí.
              </span>
            </li>
          </ol>
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-center gap-2 text-amber-800">
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">Potřebujete rychlou odpověď?</span>
          </div>
          <p className="mt-1 text-amber-700">
            Zavolejte nám na{" "}
            <a
              href="tel:+420776424145"
              className="font-bold underline hover:no-underline"
            >
              +420 776 424 145
            </a>
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>Vaše data jsou v bezpečí</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>Odpověď do 24 h</span>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded bg-[var(--theme-600)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}
