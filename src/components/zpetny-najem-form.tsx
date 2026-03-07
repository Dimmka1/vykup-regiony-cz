"use client";

import { useState, useMemo, type ReactElement, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";

const CZ_PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\s]/g, "").slice(0, 16);
}

export function ZpetnyNajemForm(): ReactElement {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const isPhoneValid = useMemo(
    () => CZ_PHONE_REGEX.test(phone.trim()),
    [phone],
  );
  const isNameValid = name.trim().length > 1;

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isNameValid || !isPhoneValid || !consent) {
      setErrorMessage("Vyplňte prosím jméno, telefon a souhlas s GDPR.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          property_type: "byt",
          region: "Praha",
          situation_type: "zpetny-najem",
          consent_gdpr: true,
          email: email.trim(),
          website,
        }),
      });

      if (!response.ok) throw new Error("API error");

      trackEvent("lead_form_submit_success", {
        form_name: "zpetny_najem_form",
        region: "all",
      });

      try {
        localStorage.setItem("form_submitted", String(Date.now()));
      } catch {
        /* noop */
      }

      setStatus("success");
      router.push("/dekujeme");
    } catch {
      setStatus("error");
      setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
    }
  };

  return (
    <section className="bg-emerald-50 py-16" id="formular-zpetny-najem">
      <div className="mx-auto max-w-xl px-4">
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">
          <h2 className="text-xl font-bold text-slate-900">
            Mám zájem o zpětný nájem
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Vyplňte krátký formulář a do 24 hodin vám připravíme nezávaznou
            nabídku včetně podmínek nájmu.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit}
            aria-label="Formulář pro zpětný nájem"
          >
            {/* Hidden tag field */}
            <input type="hidden" name="interest_type" value="zpetny-najem" />

            <div>
              <label
                htmlFor="zn-name"
                className="block text-sm font-medium text-slate-700"
              >
                Jméno a příjmení
              </label>
              <input
                id="zn-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label
                htmlFor="zn-phone"
                className="block text-sm font-medium text-slate-700"
              >
                Telefon
              </label>
              <input
                id="zn-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+420 777 123 456"
                required
                value={phone}
                onChange={(e) => setPhone(normalizePhone(e.target.value))}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div>
              <label
                htmlFor="zn-email"
                className="block text-sm font-medium text-slate-700"
              >
                E-mail <span className="text-slate-400">(nepovinné)</span>
              </label>
              <input
                id="zn-email"
                type="email"
                autoComplete="email"
                placeholder="jan@example.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="zn-website">Website</label>
              <input
                id="zn-website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="mt-1"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              Souhlasím se zpracováním osobních údajů pro účely zpětného
              kontaktu.
            </label>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-70"
            >
              {status === "submitting"
                ? "Odesílám..."
                : "Chci nabídku na zpětný nájem"}
            </button>

            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
