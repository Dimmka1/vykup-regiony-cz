"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone, RefreshCw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const PHONE = "+420 776 424 145";
const PHONE_HREF = "tel:+420776424145";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
    trackEvent("page_error", {
      message: error.message,
      digest: error.digest ?? "",
    });
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        <div>
          <span className="text-8xl font-bold text-slate-200">500</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          Něco se pokazilo
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Omlouváme se za technické potíže. Zkuste to prosím znovu, nebo nám
          zavolejte.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" />
            Zkusit znovu
          </button>

          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--theme-600)] px-6 py-3 text-base font-semibold text-[var(--theme-600)] shadow-sm transition-colors hover:bg-[var(--theme-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
          >
            <Phone className="h-4 w-4" />
            Zavolat: {PHONE}
          </a>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-base font-medium text-[var(--theme-600)] transition-colors hover:text-[var(--theme-700)]"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </section>
  );
}
