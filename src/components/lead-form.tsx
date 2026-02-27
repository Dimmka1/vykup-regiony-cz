"use client";

import type { ReactElement } from "react";
import { useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";
type FormStep = 0 | 1 | 2;

interface LeadFormProps {
  regionName: string;
}

interface FormDataState {
  name: string;
  phone: string;
  propertyType: string;
  situationType: string;
  address: string;
  postalCode: string;
  city: string;
  consent: boolean;
  website: string;
}

interface StepMeta {
  readonly key: FormStep;
  readonly title: string;
  readonly description: string;
}

const STEPS: readonly StepMeta[] = [
  { key: 0, title: "Typ nemovitosti", description: "Upřesněte, co vykupujeme" },
  {
    key: 1,
    title: "Adresa",
    description: "Lokalita pomůže se správným oceněním",
  },
  { key: 2, title: "Kontakt", description: "Kam vám máme poslat nabídku" },
] as const;

const INITIAL_FORM: FormDataState = {
  name: "",
  phone: "",
  propertyType: "byt",
  situationType: "standard",
  address: "",
  postalCode: "",
  city: "",
  consent: false,
  website: "",
};

const CZ_PHONE_REGEX = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
const CZ_POSTAL_CODE_REGEX = /^\d{3}\s?\d{2}$/;

function normalizePhone(rawPhone: string): string {
  return rawPhone.replace(/[^\d+\s]/g, "").slice(0, 16);
}

function normalizePostalCode(rawPostalCode: string): string {
  const digits = rawPostalCode.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 3) {
    return digits;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

export function LeadForm({ regionName }: LeadFormProps): ReactElement {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<FormStep>(0);

  const isPhoneValid = useMemo(
    () => CZ_PHONE_REGEX.test(formData.phone.trim()),
    [formData.phone],
  );
  const isNameValid = formData.name.trim().length > 1;
  const isAddressValid = formData.address.trim().length > 4;
  const isCityValid = formData.city.trim().length > 1;
  const isPostalCodeValid = useMemo(
    () => CZ_POSTAL_CODE_REGEX.test(formData.postalCode.trim()),
    [formData.postalCode],
  );
  const isFormValid =
    isNameValid &&
    isPhoneValid &&
    isAddressValid &&
    isCityValid &&
    isPostalCodeValid &&
    formData.consent;
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  const handleNextStep = (): void => {
    if (currentStep === 0) {
      setCurrentStep(1);
      setErrorMessage("");
      return;
    }

    if (currentStep === 1) {
      if (!isAddressValid || !isCityValid || !isPostalCodeValid) {
        setErrorMessage(
          "Doplňte prosím kompletní adresu ve formátu PSČ 123 45.",
        );
        return;
      }

      setCurrentStep(2);
      setErrorMessage("");
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (!isFormValid) {
      setErrorMessage("Zkontrolujte prosím kontakt, adresu a souhlas GDPR.");
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
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          consent_gdpr: formData.consent,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead API error");
      }

      trackEvent("lead_form_submit_success", {
        form_name: "lead_form",
        region: regionName,
      });
      setStatus("success");
      setCurrentStep(0);
      setFormData(INITIAL_FORM);
    } catch (_error) {
      trackEvent("lead_form_submit_error", {
        form_name: "lead_form",
        region: regionName,
      });
      setStatus("error");
      setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
    }
  };

  return (
    <form
      className="space-y-4 rounded-xl bg-white p-4 shadow sm:p-6"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>
            Krok {currentStep + 1} / {STEPS.length}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div
          className="h-2 w-full rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={currentStep + 1}
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">
          {STEPS[currentStep].title}
        </h3>
        <p className="text-sm text-slate-600">
          {STEPS[currentStep].description}
        </p>
        <ol className="grid grid-cols-3 gap-2" aria-label="Průběh formuláře">
          {STEPS.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted = index < currentStep;

            return (
              <li
                key={step.title}
                className={`rounded-lg px-2 py-2 text-center text-xs font-semibold ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : isCompleted
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                {index + 1}. {step.title}
              </li>
            );
          })}
        </ol>
      </div>

      {currentStep === 0 ? (
        <div className="grid gap-4">
          <label className="text-sm">
            Typ nemovitosti
            <select
              className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
              value={formData.propertyType}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyType: event.target.value,
                }))
              }
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
              className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
              value={formData.situationType}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  situationType: event.target.value,
                }))
              }
            >
              <option value="standard">Standardní prodej</option>
              <option value="exekuce">Exekuce</option>
              <option value="dedictvi">Dědictví</option>
              <option value="podil">Spoluvlastnický podíl</option>
            </select>
          </label>
        </div>
      ) : null}

      {currentStep === 1 ? (
        <div className="grid gap-4">
          <label className="text-sm">
            Ulice a č.p.
            <input
              className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
              placeholder="Např. Revoluční 12"
              autoComplete="street-address"
              enterKeyHint="next"
              value={formData.address}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  address: event.target.value,
                }))
              }
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Město
              <input
                className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
                placeholder="Např. Brno"
                autoComplete="address-level2"
                enterKeyHint="next"
                value={formData.city}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, city: event.target.value }))
                }
                required
              />
            </label>

            <label className="text-sm">
              PSČ
              <input
                className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
                placeholder="123 45"
                inputMode="numeric"
                autoComplete="postal-code"
                enterKeyHint="next"
                value={formData.postalCode}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: normalizePostalCode(event.target.value),
                  }))
                }
                required
              />
            </label>
          </div>
        </div>
      ) : null}

      {currentStep === 2 ? (
        <div className="grid gap-4">
          <label className="text-sm">
            Jméno a příjmení
            <input
              className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
              value={formData.name}
              autoComplete="name"
              enterKeyHint="next"
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, name: event.target.value }))
              }
              required
            />
          </label>

          <label className="text-sm">
            Telefon
            <input
              className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base"
              placeholder="+420 777 123 456"
              inputMode="tel"
              autoComplete="tel"
              enterKeyHint="send"
              value={formData.phone}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  phone: normalizePhone(event.target.value),
                }))
              }
              required
            />
          </label>

          <label className="hidden" aria-hidden="true">
            Website
            <input
              tabIndex={-1}
              className="min-h-11"
              autoComplete="off"
              value={formData.website}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  website: event.target.value,
                }))
              }
            />
          </label>

          <label className="flex items-start gap-2 text-sm">
            <input
              className="mt-1"
              type="checkbox"
              checked={formData.consent}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  consent: event.target.checked,
                }))
              }
            />
            Souhlasím se zpracováním osobních údajů pro účely zpětného kontaktu.
          </label>
        </div>
      ) : null}

      <div className="sticky bottom-3 z-10 -mx-2 flex flex-col gap-3 rounded-xl bg-white/95 px-2 py-2 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:py-0">
        <button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 0 || status === "submitting"}
          className="inline-flex min-h-11 items-center justify-center rounded border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Zpět
        </button>

        {currentStep < 2 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex min-h-11 items-center justify-center rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-700"
          >
            Pokračovat
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex min-h-11 items-center justify-center rounded bg-brand-500 px-5 py-3 text-base font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
          >
            {status === "submitting" ? "Odesílám..." : "Odeslat poptávku"}
          </button>
        )}
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
      {status === "success" ? (
        <p className="text-sm text-emerald-700">
          Děkujeme, ozveme se vám co nejdříve.
        </p>
      ) : null}
    </form>
  );
}
