"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div>
          <span className="text-7xl font-bold text-slate-200">500</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Něco se pokazilo
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Omlouváme se za technické potíže. Zkuste to prosím znovu.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--theme-600)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            Zkusit znovu
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </section>
  );
}
