"use client";

import type { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { captureGclid, getGclid } from "@/lib/use-gclid";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface PpcLeadFormProps {
  regionName: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

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

export function PpcLeadForm({
  regionName,
  utmSource,
  utmMedium,
  utmCampaign,
}: PpcLeadFormProps): ReactElement {
  const [formData, setFormData] = useState<PpcFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // VR-206: capture gclid from URL on mount
  useEffect(() => {
    captureGclid();
  }, []);

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
            region: regionName,
            consent_gdpr: formData.consent,
            website: formData.website,
            gclid: getGclid(),
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
          form_name: "ppc_lead_form",
          region: regionName,
          utm_source: utmSource,
        });

        try {
          localStorage.setItem("form_submitted", String(Date.now()));
        } catch {
          /* noop */
        }

        router.push("/dekujeme");
      } catch {
        trackEvent("lead_form_submit_error", {
          form_name: "ppc_lead_form",
          region: regionName,
        });
        setStatus("error");
        setErrorMessage("Odeslání se nepodařilo. Zkuste to prosím znovu.");
      }
    },
    [
      formData,
      isNameValid,
      isPhoneValid,
      regionName,
      utmSource,
      utmMedium,
      utmCampaign,
      router,
    ],
  );

  return (
    <form
      ref={formRef}
      className="space-y-4 rounded-xl bg-white p-5 shadow-lg sm:p-6"
      onSubmit={handleSubmit}
      aria-label="Rychlý formulář poptávky"
    >
      <h2 className="text-xl font-bold text-slate-900">
        Získejte nabídku zdarma
      </h2>
      <p className="text-sm text-slate-600">
        Vyplňte formulář a ozveme se vám do 24 hodin.
      </p>

      {/* Hidden UTM fields */}
      <input type="hidden" name="utm_source" value={utmSource} />
      <input type="hidden" name="utm_medium" value={utmMedium} />
      <input type="hidden" name="utm_campaign" value={utmCampaign} />
      <input type="hidden" name="region" value={regionName} />

      <div>
        <label htmlFor="ppc-property-type" className="text-sm font-medium">
          Typ nemovitosti
        </label>
        <select
          id="ppc-property-type"
          className="mt-1 min-h-11 w-full rounded border border-slate-300 px-3 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
          value={formData.propertyType}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, propertyType: e.target.value }))
          }
        >
          <option value="byt">Byt</option>
          <option value="dum">Dům</option>
          <option value="podil">Podíl</option>
          <option value="jine">Jiné</option>
        </select>
      </div>

      <div>
        <label htmlFor="ppc-name" className="text-sm font-medium">
          Jméno a příjmení
        </label>
        <input
          id="ppc-name"
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
        <label htmlFor="ppc-phone" className="text-sm font-medium">
          Telefon
        </label>
        <input
          id="ppc-phone"
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
        <label htmlFor="ppc-website">Website</label>
        <input
          id="ppc-website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          className="mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
          type="checkbox"
          checked={formData.consent}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, consent: e.target.checked }))
          }
        />
        Souhlasím se zpracováním osobních údajů pro účely zpětného kontaktu.
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-11 w-full items-center justify-center rounded bg-[var(--theme-600)] px-5 py-3 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:opacity-70"
      >
        {status === "submitting" ? "Odesílám..." : "Chci nabídku zdarma"}
      </button>

      {errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
