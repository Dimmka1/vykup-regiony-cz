"use client";

import { useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  email?: string;
  phone?: string;
}

const PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
const PDF_URL = "/docs/vzor-kupni-smlouvy.pdf";

function validateEmail(value: string): string | undefined {
  if (!value.trim()) {
    return "Zadejte prosím svůj e-mail";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Zadejte platný e-mail";
  }
  return undefined;
}

function validatePhone(value: string): string | undefined {
  if (!value.trim()) {
    return "Zadejte prosím telefonní číslo";
  }
  if (!PHONE_REGEX.test(value.replace(/\s/g, ""))) {
    return "Zadejte platné české telefonní číslo";
  }
  return undefined;
}

function validateForm(email: string, phone: string): FormErrors {
  return {
    email: validateEmail(email),
    phone: validatePhone(phone),
  };
}

function hasErrors(errors: FormErrors): boolean {
  return Boolean(errors.email ?? errors.phone);
}

export function VzorLeadGateForm(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
      e.preventDefault();

      const validationErrors = validateForm(email, phone);
      setErrors(validationErrors);

      if (hasErrors(validationErrors)) {
        return;
      }

      setStatus("submitting");

      try {
        const res = await fetch("/api/lead-magnet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            phone,
            type: "vzor-smlouvy",
          }),
        });

        const data = (await res.json()) as { ok: boolean };

        if (!res.ok || !data.ok) {
          setStatus("error");
          return;
        }

        setStatus("success");

        trackEvent("lead_magnet_download", {
          type: "vzor-smlouvy",
          email,
        });

        const link = document.createElement("a");
        link.href = PDF_URL;
        link.download = "vzor-kupni-smlouvy.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch {
        setStatus("error");
      }
    },
    [email, phone],
  );

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-bold text-green-800">
          Děkujeme! Váš vzor smlouvy je připraven.
        </h3>
        <p className="mb-6 text-green-700">
          Stahování by mělo začít automaticky. Pokud ne, klikněte na tlačítko
          níže.
        </p>
        <a
          href={PDF_URL}
          download="vzor-kupni-smlouvy.pdf"
          className="inline-block rounded-xl bg-green-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-700"
        >
          📥 Stáhnout vzor smlouvy (PDF)
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--theme-200)] bg-white p-8 shadow-lg">
      <div className="mb-6 text-center">
        <div className="mb-3 text-4xl">📄</div>
        <h3 className="text-xl font-bold text-slate-900">
          Stáhněte si kompletní vzor kupní smlouvy
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          Zadejte svůj e-mail a telefon — vzor smlouvy vám ihned zašleme ke
          stažení.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="vzor-email" className="sr-only">
            Váš e-mail
          </label>
          <input
            id="vzor-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
            placeholder="Váš e-mail"
            className={`w-full rounded-xl border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-[var(--theme-500)] focus:ring-[var(--theme-500)]"
            }`}
            disabled={status === "submitting"}
            autoComplete="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="vzor-phone" className="sr-only">
            Telefonní číslo
          </label>
          <input
            id="vzor-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) {
                setErrors((prev) => ({ ...prev, phone: undefined }));
              }
            }}
            placeholder="Telefonní číslo (např. 777 123 456)"
            className={`w-full rounded-xl border px-4 py-3 text-lg focus:outline-none focus:ring-2 ${
              errors.phone
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-slate-300 focus:border-[var(--theme-500)] focus:ring-[var(--theme-500)]"
            }`}
            disabled={status === "submitting"}
            autoComplete="tel"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-xl bg-[var(--theme-600)] px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-[var(--theme-700)] disabled:opacity-50"
        >
          {status === "submitting"
            ? "Odesílám..."
            : "📥 Stáhnout vzor smlouvy zdarma"}
        </button>

        {status === "error" && (
          <p className="text-center text-sm text-red-600">
            Něco se pokazilo. Zkuste to prosím znovu.
          </p>
        )}

        <p className="text-center text-xs text-slate-500">
          Vaše údaje jsou v bezpečí. Žádný spam, žádné závazky.
        </p>
      </form>
    </div>
  );
}
