"use client";

import type { ReactElement } from "react";
import { useCallback, useState } from "react";
import { Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type CallbackStatus = "idle" | "open" | "submitting" | "success" | "error";

interface CallbackFormProps {
  regionName: string;
}

const CZ_PHONE_REGEX = /^(\+420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\s]/g, "").slice(0, 20);
}

export function CallbackForm({ regionName }: CallbackFormProps): ReactElement {
  const [status, setStatus] = useState<CallbackStatus>("idle");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const isPhoneValid = CZ_PHONE_REGEX.test(phone.trim());

  const handleToggle = useCallback(() => {
    setStatus((prev) => (prev === "idle" ? "open" : prev));
    trackEvent("callback_form_open", { region: regionName });
  }, [regionName]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isPhoneValid) {
        setError("Zadejte telefon ve formátu +420 xxx xxx xxx");
        return;
      }

      setError("");
      setStatus("submitting");

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "callback",
            phone: phone.trim(),
            source: "callback-form",
            region: regionName,
          }),
        });

        if (!response.ok) {
          throw new Error("API error");
        }

        trackEvent("callback_form_submit_success", { region: regionName });
        setStatus("success");
      } catch {
        trackEvent("callback_form_submit_error", { region: regionName });
        setStatus("error");
        setError("Odeslání se nepodařilo. Zkuste to prosím znovu.");
      }
    },
    [phone, isPhoneValid, regionName],
  );

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-[var(--theme-50)] px-4 py-3 text-sm font-medium text-[var(--theme-800)]">
        <Phone className="h-4 w-4 shrink-0" />
        Děkujeme! Zavoláme vám zpět co nejdříve.
      </div>
    );
  }

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 rounded-lg border-2 border-[var(--theme-600)] bg-white px-5 py-3 text-sm font-semibold text-[var(--theme-700)] transition hover:bg-[var(--theme-50)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2"
      >
        <Phone className="h-4 w-4" />
        Zavolejte mi zpět
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md sm:flex-row sm:items-end sm:gap-2"
      aria-label="Formulář pro zpětné zavolání"
    >
      <div className="flex-1">
        <label
          htmlFor="callback-phone"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Váš telefon
        </label>
        <input
          id="callback-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+420 xxx xxx xxx"
          value={phone}
          onChange={(e) => {
            setPhone(normalizePhone(e.target.value));
            if (error) setError("");
          }}
          className={`min-h-11 w-full rounded border px-3 py-2.5 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] ${
            error ? "border-red-500" : "border-slate-300"
          }`}
          required
        />
        {error ? (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded bg-[var(--theme-600)] px-5 py-2.5 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
      >
        <Phone className="h-4 w-4" />
        {status === "submitting" ? "Odesílám..." : "Zavolejte mi"}
      </button>
    </form>
  );
}
