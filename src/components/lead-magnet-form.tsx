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
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-bold text-green-800">
          Děkujeme! Váš průvodce je připraven.
        </h3>
        <p className="mb-6 text-green-700">
          Klikněte na tlačítko níže pro stažení PDF průvodce.
        </p>
        <a
          href={pdfUrl}
          download
          className="inline-block rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          📥 Stáhnout průvodce (PDF)
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label htmlFor="lead-magnet-email" className="sr-only">
          Váš e-mail
        </label>
        <input
          id="lead-magnet-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Váš e-mail"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg focus-visible:border-[var(--theme-500)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
          disabled={status === "submitting"}
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
        <p className="text-center text-sm text-red-600">
          Něco se pokazilo. Zkuste to prosím znovu.
        </p>
      )}
      <p className="text-center text-xs text-slate-500">
        Vaše údaje jsou v bezpečí. Žádný spam.
      </p>
    </form>
  );
}
