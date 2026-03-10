"use client";

import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";
type FormStep = 0 | 1 | 2;

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
  { key: 0, title: "Тип нерухомості", description: "Вкажіть, що продаєте" },
  {
    key: 1,
    title: "Адреса",
    description: "Місцезнаходження допоможе з оцінкою",
  },
  { key: 2, title: "Контакт", description: "Куди надіслати пропозицію" },
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
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)} ${digits.slice(3)}`;
}

function scrollToFirstError(errors: Record<string, string>): void {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;
  const el = document.getElementById(firstKey);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

function inputBorderClass(
  fieldId: string,
  fieldErrors: Record<string, string>,
): string {
  return fieldErrors[fieldId] ? "border-red-500" : "border-slate-300";
}

export function UkLeadForm(): ReactElement {
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<FormStep>(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

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
    if (!isAddressValid) errors["uk-address"] = "Вкажіть вулицю";
    if (!isCityValid) errors["uk-city"] = "Вкажіть місто";
    if (!isPostalCodeValid) errors["uk-postal-code"] = "PSČ у форматі 123 45";
    return errors;
  }, [isAddressValid, isCityValid, isPostalCodeValid]);

  const validateStep2 = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!isNameValid) errors["uk-lead-name"] = "Вкажіть ім'я";
    if (!isPhoneValid)
      errors["uk-lead-phone"] = "Телефон у форматі +420 777 123 456";
    if (!formData.consent) errors["uk-consent"] = "Потрібна ваша згода";
    return errors;
  }, [isNameValid, isPhoneValid, formData.consent]);

  const handleNextStep = (): void => {
    if (currentStep === 0) {
      setCurrentStep(1);
      setErrorMessage("");
      setFieldErrors({});
      return;
    }

    if (currentStep === 1) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setErrorMessage("Будь ласка, заповніть адресу повністю.");
        scrollToFirstError(errors);
        return;
      }
      setFieldErrors({});
      setCurrentStep(2);
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
      setErrorMessage("Перевірте контактні дані та згоду GDPR.");
      scrollToFirstError(errors);
      return;
    }

    if (!isFormValid) {
      setErrorMessage("Перевірте контактні дані та згоду GDPR.");
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
          region: "uk",
          situation_type: formData.situationType,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          consent_gdpr: formData.consent,
          email: formData.email,
          website: formData.website,
          tag: "uk",
        }),
      });

      if (!response.ok) {
        throw new Error("Lead API error");
      }

      trackEvent("form_submit", {
        step: 4,
        stepName: "submit",
        region: "uk",
        utm_source: "",
      });
      trackEvent("lead_form_submit_success", {
        form_name: "uk_lead_form",
        region: "uk",
      });
      try {
        localStorage.setItem("form_submitted", String(Date.now()));
      } catch {
        /* noop */
      }
      router.push("/dekujeme");
      setCurrentStep(0);
      setFormData(INITIAL_FORM);
    } catch {
      trackEvent("lead_form_submit_error", {
        form_name: "uk_lead_form",
        region: "uk",
      });
      setStatus("error");
      setErrorMessage("Не вдалося відправити. Спробуйте ще раз.");
    }
  };

  return (
    <form
      ref={formRef}
      className="shadow-premium-lg space-y-5 rounded-3xl bg-white p-6 sm:p-8 md:p-10"
      onSubmit={handleSubmit}
      aria-label="Форма запиту на викуп нерухомості"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-600">
          <span>
            Крок {currentStep + 1} / {STEPS.length}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div
          className="h-2.5 w-full rounded-full bg-slate-200"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={STEPS.length}
          aria-valuenow={currentStep + 1}
          aria-label={`Крок ${currentStep + 1} з ${STEPS.length}`}
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
        <ol className="grid grid-cols-3 gap-2" aria-label="Прогрес форми">
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
          <legend className="sr-only">Тип нерухомості та ситуація</legend>
          <label htmlFor="uk-property-type" className="text-sm">
            Тип нерухомості
          </label>
          <select
            id="uk-property-type"
            className="input-focus-glow min-h-[52px] w-full rounded-xl border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
            value={formData.propertyType}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                propertyType: event.target.value,
              }))
            }
          >
            <option value="byt">Квартира (byt)</option>
            <option value="dum">Будинок (dům)</option>
            <option value="podil">Частка (podíl)</option>
            <option value="jine">Інше</option>
          </select>

          <label htmlFor="uk-situation-type" className="text-sm">
            Ситуація
          </label>
          <select
            id="uk-situation-type"
            className="input-focus-glow min-h-[52px] w-full rounded-xl border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
            value={formData.situationType}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                situationType: event.target.value,
              }))
            }
          >
            <option value="standard">Звичайний продаж</option>
            <option value="exekuce">Екзекуція</option>
            <option value="dedictvi">Спадщина</option>
            <option value="podil">Співвласницька частка</option>
          </select>
        </fieldset>
      ) : null}

      {currentStep === 1 ? (
        <fieldset className="grid gap-4">
          <legend className="sr-only">Адреса нерухомості</legend>
          <div>
            <label htmlFor="uk-address" className="text-sm">
              Вулиця та номер будинку
            </label>
            <input
              id="uk-address"
              className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("uk-address", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
              placeholder="Напр. Revoluční 12"
              autoComplete="street-address"
              enterKeyHint="next"
              value={formData.address}
              onChange={(event) => {
                setFormData((prev) => ({
                  ...prev,
                  address: event.target.value,
                }));
                if (fieldErrors["uk-address"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["uk-address"];
                    return next;
                  });
                }
              }}
              required
            />
            {fieldErrors["uk-address"] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors["uk-address"]}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="uk-city" className="text-sm">
                Місто
              </label>
              <input
                id="uk-city"
                className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("uk-city", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
                placeholder="Напр. Praha"
                autoComplete="address-level2"
                enterKeyHint="next"
                value={formData.city}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    city: event.target.value,
                  }));
                  if (fieldErrors["uk-city"]) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next["uk-city"];
                      return next;
                    });
                  }
                }}
                required
              />
              {fieldErrors["uk-city"] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors["uk-city"]}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="uk-postal-code" className="text-sm">
                PSČ (поштовий індекс)
              </label>
              <input
                id="uk-postal-code"
                className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("uk-postal-code", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
                placeholder="123 45"
                inputMode="numeric"
                autoComplete="postal-code"
                enterKeyHint="next"
                maxLength={6}
                value={formData.postalCode}
                onChange={(event) => {
                  setFormData((prev) => ({
                    ...prev,
                    postalCode: normalizePostalCode(event.target.value),
                  }));
                  if (fieldErrors["uk-postal-code"]) {
                    setFieldErrors((prev) => {
                      const next = { ...prev };
                      delete next["uk-postal-code"];
                      return next;
                    });
                  }
                }}
                required
              />
              <p
                className={`mt-1 text-xs ${formData.postalCode.trim() ? (isPostalCodeValid ? "text-[var(--theme-600)]" : "text-red-500") : "text-slate-500"}`}
              >
                Формат: 123 45
              </p>
              {fieldErrors["uk-postal-code"] ? (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors["uk-postal-code"]}
                </p>
              ) : null}
            </div>
          </div>
        </fieldset>
      ) : null}

      {currentStep === 2 ? (
        <fieldset className="grid gap-4">
          <legend className="sr-only">Контактні дані</legend>
          <div>
            <label htmlFor="uk-lead-name" className="text-sm">
              Ім&#39;я та прізвище
            </label>
            <input
              id="uk-lead-name"
              className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("uk-lead-name", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
              value={formData.name}
              autoComplete="name"
              enterKeyHint="next"
              onChange={(event) => {
                setFormData((prev) => ({ ...prev, name: event.target.value }));
                if (fieldErrors["uk-lead-name"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["uk-lead-name"];
                    return next;
                  });
                }
              }}
              required
            />
            {fieldErrors["uk-lead-name"] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors["uk-lead-name"]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="uk-lead-phone" className="text-sm">
              Телефон
            </label>
            <input
              id="uk-lead-phone"
              className={`input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border ${inputBorderClass("uk-lead-phone", fieldErrors)} px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]`}
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
                if (fieldErrors["uk-lead-phone"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["uk-lead-phone"];
                    return next;
                  });
                }
              }}
              required
            />
            {fieldErrors["uk-lead-phone"] ? (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors["uk-lead-phone"]}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="uk-lead-email" className="text-sm">
              E-mail <span className="text-slate-400">(необов&#39;язково)</span>
            </label>
            <input
              id="uk-lead-email"
              type="email"
              className="input-focus-glow mt-1 min-h-[52px] w-full rounded-xl border border-slate-300 px-3 py-3 text-base transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
              placeholder="name@example.com"
              autoComplete="email"
              enterKeyHint="next"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, email: event.target.value }))
              }
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="uk-lead-website">Website</label>
            <input
              id="uk-lead-website"
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
                if (fieldErrors["uk-consent"]) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next["uk-consent"];
                    return next;
                  });
                }
              }}
            />
            Я погоджуюсь на обробку персональних даних для зворотного
            зв&#39;язку.
          </label>
          {fieldErrors["uk-consent"] ? (
            <p className="text-xs text-red-600">{fieldErrors["uk-consent"]}</p>
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
            Далі
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "submitting"}
            className="cta-glow btn-ripple gradient-premium inline-flex min-h-[52px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {status === "submitting" ? "Відправляємо..." : "Надіслати запит"}
          </button>
        )}

        <button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 0 || status === "submitting"}
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Назад
        </button>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
      {status === "success" ? (
        <p className="text-sm text-[var(--theme-700)]" role="status">
          Дякуємо, ми зв&#39;яжемось з вами якнайшвидше.
        </p>
      ) : null}
    </form>
  );
}
