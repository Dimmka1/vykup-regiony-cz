"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface ReferralFormData {
  recommenderName: string;
  recommenderPhone: string;
  referralName: string;
  referralPhone: string;
}

const PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

const INITIAL_STATE: ReferralFormData = {
  recommenderName: "",
  recommenderPhone: "",
  referralName: "",
  referralPhone: "",
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ReferralForm() {
  const [form, setForm] = useState<ReferralFormData>(INITIAL_STATE);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(field: keyof ReferralFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): string | null {
    if (form.recommenderName.trim().length < 2) {
      return "Zadejte prosím vaše jméno (min. 2 znaky).";
    }
    if (!PHONE_REGEX.test(form.recommenderPhone.trim())) {
      return "Zadejte prosím platné telefonní číslo (váš kontakt).";
    }
    if (form.referralName.trim().length < 2) {
      return "Zadejte prosím jméno doporučené osoby (min. 2 znaky).";
    }
    if (!PHONE_REGEX.test(form.referralPhone.trim())) {
      return "Zadejte prosím platné telefonní číslo doporučené osoby.";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommender_name: form.recommenderName.trim(),
          recommender_phone: form.recommenderPhone.trim(),
          referral_name: form.referralName.trim(),
          referral_phone: form.referralPhone.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Odeslání se nezdařilo.");
      }

      setStatus("success");
      trackEvent("referral_submit" as Parameters<typeof trackEvent>[0]);
    } catch {
      setStatus("error");
      setErrorMessage("Něco se pokazilo. Zkuste to prosím znovu.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-xl font-bold text-green-800">
          Děkujeme za doporučení!
        </h3>
        <p className="mt-2 text-green-700">
          Ozveme se doporučené osobě co nejdříve. O výsledku vás budeme
          informovat.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-[var(--theme-500)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-500)]/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Recommender */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-slate-900">
          Vaše kontaktní údaje
        </legend>
        <div>
          <label
            htmlFor="recommenderName"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Jméno a příjmení
          </label>
          <input
            id="recommenderName"
            type="text"
            required
            minLength={2}
            placeholder="Jan Novák"
            value={form.recommenderName}
            onChange={(e) => handleChange("recommenderName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="recommenderPhone"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Telefon
          </label>
          <input
            id="recommenderPhone"
            type="tel"
            required
            placeholder="+420 123 456 789"
            value={form.recommenderPhone}
            onChange={(e) => handleChange("recommenderPhone", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      {/* Referral */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-bold text-slate-900">
          Koho doporučujete?
        </legend>
        <div>
          <label
            htmlFor="referralName"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Jméno a příjmení
          </label>
          <input
            id="referralName"
            type="text"
            required
            minLength={2}
            placeholder="Petr Svoboda"
            value={form.referralName}
            onChange={(e) => handleChange("referralName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="referralPhone"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Telefon
          </label>
          <input
            id="referralPhone"
            type="tel"
            required
            placeholder="+420 987 654 321"
            value={form.referralPhone}
            onChange={(e) => handleChange("referralPhone", e.target.value)}
            className={inputClass}
          />
        </div>
      </fieldset>

      {errorMessage && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-600 disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Odesílám…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Odeslat doporučení
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-400">
        Odesláním formuláře souhlasíte se{" "}
        <a href="/ochrana-osobnich-udaju" className="underline">
          zpracováním osobních údajů
        </a>
        .
      </p>
    </form>
  );
}
