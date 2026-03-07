"use client";

import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { AnalyticsEventName } from "@/lib/analytics";

/* ── GTM form-step tracking (VR-129) ─────────────────────────── */

const STEP_EVENTS: readonly { event: AnalyticsEventName; stepName: string }[] =
  [
    { event: "form_step_1_type", stepName: "type" },
    { event: "form_step_2_address", stepName: "address" },
    { event: "form_step_3_contact", stepName: "contact" },
  ] as const;

function getUtmSource(): string {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("utm_source");
    if (fromUrl) return fromUrl;
  } catch {
    /* SSR guard */
  }
  try {
    return sessionStorage.getItem("utm_source") ?? "";
  } catch {
    return "";
  }
}

function pushFormStepEvent(step: number, region: string): void {
  const meta = STEP_EVENTS[step];
  if (!meta) return;
  trackEvent(meta.event, {
    step: step + 1,
    stepName: meta.stepName,
    region,
    utm_source: getUtmSource(),
  });
}

type FormStatus = "idle" | "submitting" | "success" | "error";
type FormStep = 0 | 1 | 2;

interface LeadFormProps {
  regionName: string;
}

interface FormDataState {
  name: string;
  phone: string;
  email: string;
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
  email: "",
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

function scrollToFirstError(errors: Record<string, string>): void {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;
  const el = document.getElementById(firstKey);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function inputBorderClass(
  fieldId: string,
  fieldErrors: Record<string, string>,
): string {
  return fieldErrors[fieldId] ? "border-red-500" : "border-slate-300";
}

export function LeadForm({ regionName }: LeadFormProps): ReactElement {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<FormStep>(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mountTimeRef = useRef(Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // VR-129: Track step 1 on mount
  useEffect(() => {
    pushFormStepEvent(0, regionName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const validateStep1 = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!isAddressValid) errors["address"] = "Zadejte ulici";
    if (!isCityValid) errors["city"] = "Zadejte město";
    if (!isPostalCodeValid) errors["postal-code"] = "PSČ ve formátu 123 45";
    return errors;
  }, [isAddressValid, isCityValid, isPostalCodeValid]);

  const validateStep2 = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!isNameValid) errors["lead-name"] = "Zadejte jméno";
    if (!isPhoneValid)
      errors["lead-phone"] = "Zadejte telefon ve formátu +420 777 123 456";
    if (!formData.consent) errors["consent"] = "Potřebujeme váš souhlas";
    return errors;
  }, [isNameValid, isPhoneValid, formData.consent]);

  const handleNextStep = (): void => {
    if (currentStep === 0) {
      setCurrentStep(1);
      pushFormStepEvent(1, regionName);
      setErrorMessage("");
      setFieldErrors({});
      return;
    }

    if (currentStep === 1) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setErrorMessage(
          "Doplňte prosím kompletní adresu ve formátu PSČ 123 45.",
        );
        scrollToFirstError(errors);
        return;
      }

      setFieldErrors({});
      setCurrentStep(2);
      pushFormStepEvent(2, regionName);
      setErrorMessage("");
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
      setErrorMessage("");
      setFieldErrors({});
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMessage("Zkontrolujte prosím kontakt, adresu a souhlas GDPR.");
      scrollToFirstError(errors);
      return;
    }

    if (!isFormValid) {
      setErrorMessage("Zkontrolujte prosím kontakt, adresu a souhlas GDPR.");
      return;
    }

    setFieldErrors({});
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
          email: formData.email,
          fill_time_ms: Date.now() - mountTimeRef.current,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        throw new Error("Lead API error");
      }

      // VR-129: Track form submission
      trackEvent("form_submit", {
        step: 4,
        stepName: "submit",
        region: regionName,
        utm_source: getUtmSource(),
      });
      trackEvent("lead_form_submit_success", {
        form_name: "lead_form",
        region: regionName,
      });
      try {
        localStorage.setItem("form_submitted", String(Date.now()));
      } catch {
        /* noop */
      }
      router.push("/dekujeme");
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
      ref={formRef}
      className="shadow-premium-lg space-y-5 rounded-3xl bg-white p-6 sm:p-8 md:p-10"
      onSubmit={handleSubmit}
      aria-label="Formulář poptávky výkupu nemovitosti"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
          <span>
            Krok {currentStep + 1} / {STEPS.length}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div
          className="h-2.5 w-full rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={currentStep + 1}
          aria-label={`Krok ${currentStep + 1} z ${STEPS.length}`}
        >
          <div
            className="h-full rounded-full bg-[var(--theme-600)] transition-all"
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
                aria-current={isActive ? "step" : undefined}
                className={`rounded-xl px-3 py-2.5 text-center text-xs font-semibold ${
                  isActive
                    ? "bg-[var(--theme-100)] text-[var(--theme-800)]"
                    : isCompleted
                      ? "bg-[var(--theme-50)] text-[var(--theme-700)]"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {index + 1}. {step.title}
              </li>
            );
          })}
        </ol>
      </div>

      {currentStep === 0 ? (
        <fieldset className="grid gap-4">
          <legend className="sr-only">Typ nemovitosti a situace</legend>
          <label htmlFor="property-type" className="text-sm">
            Typ nemovitosti
          </label>
          <select
            id="property-type"
            className="input-focus-glow min-h-[52px] w-full rounded-xl border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
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

          <label htmlFor="situation-type" className="text-sm">
            Situace
          </label>
          <select
            id="situation-type"
            className="input-focus-glow min-h-[52px] w-full rounded-xl border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
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
        </fieldset>
      ) : null}

      {currentStep === 1 ? (
        <fieldset className="grid gap-4">
          <legend className="sr-only">Adresa nemovitosti</legend>
          <div>
            <label htmlFor="address" className="text-sm">
              Ulice a č.p.
            </label>
            <input
              id="address"
              className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("address", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
              placeholder="Např. Revoluční 12"
              autoComplete="street-address"
              enterKeyHint="next"
              value={formData.address}
              onChange={(event) => {
                setFormData((prev) => ({
                  ...prev,
                  address: event.target.value,
                }));
                if (fieldErrors["address"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["address"];
                    return next;
                  });
                }
              }}
              required
            />
            {fieldErrors["address"] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors["address"]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="text-sm">
                Město
              </label>
              <input
                id="city"
                className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("city", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
                placeholder="Např. Brno"
                autoComplete="address-level2"
                enterKeyHint="next"
                value={formData.city}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    city: event.target.value,
                  }));
                  if (fieldErrors["city"]) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next["city"];
                      return next;
                    });
                  }
                }}
                required
              />
              {fieldErrors["city"] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors["city"]}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="postal-code" className="text-sm">
                PSČ
              </label>
              <input
                id="postal-code"
                className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("postal-code", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
                placeholder="123 45"
                inputMode="numeric"
                autoComplete="postal-code"
                enterKeyHint="next"
                maxLength={6}
                aria-invalid={!isPostalCodeValid}
                aria-describedby="psc-hint"
                value={formData.postalCode}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: normalizePostalCode(event.target.value),
                  }));
                  if (fieldErrors["postal-code"]) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next["postal-code"];
                      return next;
                    });
                  }
                }}
                required
              />
              <p
                id="psc-hint"
                className={`mt-1 text-xs ${formData.postalCode.trim() ? (isPostalCodeValid ? "text-[var(--theme-600)]" : "text-red-500") : "text-slate-500"}`}
              >
                Formát: 123 45
              </p>
              {fieldErrors["postal-code"] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors["postal-code"]}
                </p>
              ) : null}
            </div>
          </div>
        </fieldset>
      ) : null}

      {currentStep === 2 ? (
        <fieldset className="grid gap-4">
          <legend className="sr-only">Kontaktní údaje</legend>
          <div>
            <label htmlFor="lead-name" className="text-sm">
              Jméno a příjmení
            </label>
            <input
              id="lead-name"
              className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("lead-name", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
              value={formData.name}
              autoComplete="name"
              enterKeyHint="next"
              onChange={(event) => {
                setFormData((prev) => ({ ...prev, name: event.target.value }));
                if (fieldErrors["lead-name"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["lead-name"];
                    return next;
                  });
                }
              }}
              required
            />
            {fieldErrors["lead-name"] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors["lead-name"]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="lead-phone" className="text-sm">
              Telefon
            </label>
            <input
              id="lead-phone"
              className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("lead-phone", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
              placeholder="+420 777 123 456"
              inputMode="tel"
              autoComplete="tel"
              enterKeyHint="send"
              value={formData.phone}
              onChange={(event) => {
                setFormData((prev) => ({
                  ...prev,
                  phone: normalizePhone(event.target.value),
                }));
                if (fieldErrors["lead-phone"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["lead-phone"];
                    return next;
                  });
                }
              }}
              required
            />
            {fieldErrors["lead-phone"] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors["lead-phone"]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="lead-email" className="text-sm">
              E-mail <span className="text-slate-400">(nepovinné)</span>
            </label>
            <input
              id="lead-email"
              type="email"
              className="input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              placeholder="jan@example.cz"
              autoComplete="email"
              enterKeyHint="next"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="lead-website">Website</label>
            <input
              id="lead-website"
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
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input
              className="mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              type="checkbox"
              checked={formData.consent}
              onChange={(event) => {
                setFormData((prev) => ({
                  ...prev,
                  consent: event.target.checked,
                }));
                if (fieldErrors["consent"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["consent"];
                    return next;
                  });
                }
              }}
            />
            Souhlasím se zpracováním osobních údajů pro účely zpětného kontaktu.
          </label>
          {fieldErrors["consent"] ? (
            <p className="text-xs text-red-600">{fieldErrors["consent"]}</p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="sticky bottom-3 z-10 -mx-2 flex flex-col-reverse gap-3 rounded-xl bg-white/95 px-2 py-2 backdrop-blur sm:static sm:mx-0 sm:flex-col sm:bg-transparent sm:px-0 sm:py-0">
        {currentStep < 2 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className={`cta-glow btn-ripple inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[var(--theme-600)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 ${currentStep === 1 && (!isAddressValid || !isCityValid || !isPostalCodeValid) ? "pointer-events-none cursor-not-allowed opacity-60" : ""}`}
          >
            Pokračovat
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="cta-glow btn-ripple gradient-premium inline-flex min-h-[52px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {status === "submitting" ? "Odesílám..." : "Odeslat poptávku"}
          </button>
        )}

        <button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 0 || status === "submitting"}
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Zpět
        </button>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {status === "success" ? (
        <p className="text-sm text-[var(--theme-700)]" role="status">
          Děkujeme, ozveme se vám co nejdříve.
        </p>
      ) : null}
    </form>
  );
}
