"use client";

import { useState } from "react";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";

const leadMagnetResponseSchema = z.object({
  ok: z.boolean(),
  pdfUrl: z.string().optional(),
});

type FormStatus = "idle" | "submitting" | "success" | "error";

export function LeadMagnetForm(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = leadMagnetResponseSchema.parse(await res.json());

      if (!res.ok || !data.ok) {
        setStatus("error");
        return;
      }

      setPdfUrl(data.pdfUrl ?? "/docs/pruvodce-vykupem.pdf");
      setStatus("success");
      trackEvent("lead_magnet_download", {
        source: "pruvodce-vykupem",
      });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success" && pdfUrl) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
      >
        <div className="mb-4 text-4xl" aria-hidden="true">
          ✅
        </div>
        <h3 className="mb-2 text-xl font-bold text-green-800">
          Děkujeme! Průvodce máte připravený ke stažení.
        </h3>
        <p className="mb-6 text-green-700">
          Odkaz pro stažení jsme vám zaslali také na <strong>{email}</strong>.
        </p>
        <a
          href={pdfUrl}
          download
          className="inline-block rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          Stáhnout průvodce (PDF)
        </a>
      </div>
    );
  }

  const errorId = status === "error" ? "lead-magnet-email-error" : undefined;

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label
          htmlFor="lead-magnet-email"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Váš e-mail
        </label>
        <input
          id="lead-magnet-email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          aria-invalid={status === "error"}
          aria-describedby={errorId}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jan@example.cz"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg focus-visible:border-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-xl bg-[var(--theme-600)] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[var(--theme-700)] disabled:opacity-50"
      >
        {status === "submitting" ? "Odesílám..." : "Stáhnout zdarma"}
      </button>
      {status === "error" && (
        <p
          id="lead-magnet-email-error"
          role="alert"
          className="text-center text-sm text-red-600"
        >
          Odeslání se nepodařilo. Zkontrolujte připojení a zkuste to znovu.
        </p>
      )}
      <p className="text-center text-xs text-slate-500">
        Vaše údaje jsou v bezpečí. Žádný spam.
      </p>
    </form>
  );
}
