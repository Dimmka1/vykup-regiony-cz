"use client";

import type { ReactElement } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface PpcFormData {
  name: string;
  phone: string;
  propertyType: string;
  consent: boolean;
  website: string;
}

const INITIAL_FORM: PpcFormData = {
  name: "",
  phone: "",
  propertyType: "byt",
  consent: false,
  website: "",
};

const CZ_PHONE_REGEX = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

function normalizePhone(rawPhone: string): string {
  return rawPhone.replace(/[^\d+\s]/g, "").slice(0, 16);
}

interface Testimonial {
  readonly text: string;
  readonly author: string;
  readonly location: string;
}

interface TrustBullet {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
}

export interface PpcVerticalConfig {
  readonly serviceTag: string;
  readonly heroTitle: string;
  readonly heroHighlight: string;
  readonly heroSubtitle: string;
  readonly trustBullets: readonly TrustBullet[];
  readonly testimonial: Testimonial;
  readonly ctaText: string;
  readonly formTitle: string;
}

const PHONE = "+420 776 424 145";
const PHONE_HREF = "tel:+420776424145";

function PpcVerticalContent({
  config,
}: {
  readonly config: PpcVerticalConfig;
}): ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();

  const utmSource = searchParams.get("utm_source") ?? "";
  const utmMedium = searchParams.get("utm_medium") ?? "";
  const utmCampaign = searchParams.get("utm_campaign") ?? "";

  const [formData, setFormData] = useState<PpcFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const isPhoneValid = useMemo(
    () => CZ_PHONE_REGEX.test(formData.phone.trim()),
    [formData.phone],
  );
  const isNameValid = formData.name.trim().length > 1;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      if (!isNameValid || !isPhoneValid || !formData.consent) {
        setErrorMessage(
          "Vyplňte prosím jméno, telefon a souhlas se zpracováním údajů.",
        );
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
            service_tag: config.serviceTag,
            consent_gdpr: formData.consent,
            website: formData.website,
            utm_source: utmSource,
            utm_medium: utmMedium,
            utm_campaign: utmCampaign,
            source: "ppc",
          }),
        });

        if (!response.ok) {
          throw new Error("Lead API error");
        }

        trackEvent("lead_form_submit_success", {
          form_name: "ppc_vertical_lead_form",
          service_vertical: config.serviceTag,
          utm_source: utmSource,
        });

        trackEvent("form_submit", {
          form_name: `ppc_${config.serviceTag}`,
          service_vertical: config.serviceTag,
        });

        try {
          localStorage.setItem("form_submitted", String(Date.now()));
        } catch {
          /* noop */
        }

        router.push("/dekujeme");
      } catch {
        trackEvent("lead_form_submit_error", {
          form_name: "ppc_vertical_lead_form",
          service_vertical: config.serviceTag,
        });
        setStatus("error");
        setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
      }
    },
    [
      formData,
      isNameValid,
      isPhoneValid,
      config.serviceTag,
      utmSource,
      utmMedium,
      utmCampaign,
      router,
    ],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Minimal header — no navigation */}
      <header className="border-b border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4">
          <span className="text-xl font-bold text-slate-900">
            Výkup Nemovitostí
          </span>
          <a
            href={PHONE_HREF}
            className="text-sm font-semibold text-[var(--theme-600)] hover:underline"
          >
            {PHONE}
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Hero */}
        <section className="mb-10 text-center sm:mb-14">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {config.heroTitle}
            <br />
            <span className="text-[var(--theme-600)]">
              {config.heroHighlight}
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600">
            {config.heroSubtitle}
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Trust bullets + Testimonial */}
          <div className="space-y-8">
            <section aria-label="Výhody">
              <ul className="space-y-5">
                {config.trustBullets.map((bullet) => (
                  <li key={bullet.title} className="flex gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--theme-50)] text-2xl"
                      aria-hidden="true"
                    >
                      {bullet.icon}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {bullet.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {bullet.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Testimonial */}
            <section
              aria-label="Reference"
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <blockquote className="text-sm italic text-slate-700">
                &ldquo;{config.testimonial.text}&rdquo;
              </blockquote>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                — {config.testimonial.author},{" "}
                <span className="font-normal text-slate-500">
                  {config.testimonial.location}
                </span>
              </p>
            </section>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                ✓ Bez provize
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                ✓ Právní servis zdarma
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                ✓ Garance ceny
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                ✓ 500+ spokojených klientů
              </span>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            <form
              ref={formRef}
              className="space-y-4 rounded-xl bg-white p-5 shadow-lg sm:p-6"
              onSubmit={handleSubmit}
              aria-label="Rychlý formulář poptávky"
            >
              <h2 className="text-xl font-bold text-slate-900">
                {config.formTitle}
              </h2>
              <p className="text-sm text-slate-600">
                Vyplňte formulář a ozveme se vám do 24 hodin.
              </p>

              {/* Hidden fields */}
              <input type="hidden" name="utm_source" value={utmSource} />
              <input type="hidden" name="utm_medium" value={utmMedium} />
              <input type="hidden" name="utm_campaign" value={utmCampaign} />
              <input
                type="hidden"
                name="service_tag"
                value={config.serviceTag}
              />

              <div>
                <label
                  htmlFor="ppc-v-property-type"
                  className="text-sm font-medium"
                >
                  Typ nemovitosti
                </label>
                <select
                  id="ppc-v-property-type"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                    }))
                  }
                >
                  <option value="byt">Byt</option>
                  <option value="dum">Dům</option>
                  <option value="podil">Podíl</option>
                  <option value="jine">Jiné</option>
                </select>
              </div>

              <div>
                <label htmlFor="ppc-v-name" className="text-sm font-medium">
                  Jméno a příjmení
                </label>
                <input
                  id="ppc-v-name"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label htmlFor="ppc-v-phone" className="text-sm font-medium">
                  Telefon
                </label>
                <input
                  id="ppc-v-phone"
                  className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  placeholder="+420 777 123 456"
                  inputMode="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: normalizePhone(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              {/* Honeypot */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="ppc-v-website">Website</label>
                <input
                  id="ppc-v-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                />
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input
                  className="mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consent: e.target.checked,
                    }))
                  }
                />
                Souhlasím se zpracováním osobních údajů pro účely zpětného
                kontaktu.
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex min-h-11 w-full items-center justify-center rounded bg-[var(--theme-600)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
              >
                {status === "submitting" ? "Odesílám..." : config.ctaText}
              </button>

              {errorMessage ? (
                <p className="text-sm text-red-600" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </form>

            {/* Phone CTA below form */}
            <p className="mt-4 text-center text-sm text-slate-500">
              Nebo zavolejte přímo:{" "}
              <a
                href={PHONE_HREF}
                className="font-semibold text-[var(--theme-600)] hover:underline"
              >
                {PHONE}
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} vykoupim-nemovitost.cz — Všechna práva
          vyhrazena
        </div>
      </footer>
    </div>
  );
}

export function PpcVerticalPage({
  config,
}: {
  readonly config: PpcVerticalConfig;
}): ReactElement {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-slate-500">Načítám…</p>
        </div>
      }
    >
      <PpcVerticalContent config={config} />
    </Suspense>
  );
}
