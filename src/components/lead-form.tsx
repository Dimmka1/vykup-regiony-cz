"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface LeadFormProps {
  regionName: string;
}

interface FormDataState {
  name: string;
  phone: string;
  propertyType: string;
  situationType: string;
  consent: boolean;
  website: string;
}

const INITIAL_FORM: FormDataState = {
  name: "",
  phone: "",
  propertyType: "byt",
  situationType: "standard",
  consent: false,
  website: "",
};

const CZ_PHONE_REGEX = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

export function LeadForm({ regionName }: LeadFormProps): ReactElement {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isPhoneValid = useMemo(() => CZ_PHONE_REGEX.test(formData.phone.trim()), [formData.phone]);
  const isNameValid = formData.name.trim().length > 1;
  const isFormValid = isNameValid && isPhoneValid && formData.consent;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!isFormValid) {
      setErrorMessage("Zkontrolujte prosím jméno, telefon a souhlas GDPR.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          property_type: formData.propertyType,
          region: regionName,
          situation_type: formData.situationType,
          consent_gdpr: formData.consent,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead API error");
      }

      setStatus("success");
      setFormData(INITIAL_FORM);
    } catch (_error) {
      setStatus("error");
      setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
    }
  };

  return (
    <form className="space-y-4 rounded-xl bg-white p-6 shadow" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Jméno a příjmení
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm">
          Telefon
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            placeholder="+420 777 123 456"
            value={formData.phone}
            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            required
          />
        </label>

        <label className="text-sm">
          Typ nemovitosti
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={formData.propertyType}
            onChange={(event) => setFormData((prev) => ({ ...prev, propertyType: event.target.value }))}
          >
            <option value="byt">Byt</option>
            <option value="dum">Dům</option>
            <option value="podil">Podíl</option>
            <option value="jine">Jiné</option>
          </select>
        </label>

        <label className="text-sm">
          Situace
          <select
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
            value={formData.situationType}
            onChange={(event) => setFormData((prev) => ({ ...prev, situationType: event.target.value }))}
          >
            <option value="standard">Standardní prodej</option>
            <option value="exekuce">Exekuce</option>
            <option value="dedictvi">Dědictví</option>
            <option value="podil">Spoluvlastnický podíl</option>
          </select>
        </label>
      </div>

      <label className="hidden" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(event) => setFormData((prev) => ({ ...prev, website: event.target.value }))}
        />
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          className="mt-1"
          type="checkbox"
          checked={formData.consent}
          onChange={(event) => setFormData((prev) => ({ ...prev, consent: event.target.checked }))}
        />
        Souhlasím se zpracováním osobních údajů pro účely zpětného kontaktu.
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
      >
        {status === "submitting" ? "Odesílám..." : "Odeslat poptávku"}
      </button>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-700">Děkujeme, ozveme se vám co nejdříve.</p>
      ) : null}
    </form>
  );
}
