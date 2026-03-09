"use client";

import type { ReactElement } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface EnLeadFormData {
  name: string;
  phone: string;
  email: string;
  propertyType: string;
  message: string;
  consent: boolean;
  website: string;
}

const INITIAL_FORM: EnLeadFormData = {
  name: "",
  phone: "",
  email: "",
  propertyType: "apartment",
  message: "",
  consent: false,
  website: "",
};

const PHONE_REGEX = /^(\+?\d{1,4})?\s?\d{3,4}\s?\d{3,4}\s?\d{0,4}$/;

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
] as const;

function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+\s]/g, "").slice(0, 20);
}

export function EnLeadForm(): ReactElement {
  const [formData, setFormData] = useState<EnLeadFormData>(INITIAL_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const isPhoneValid = useMemo(
    () => PHONE_REGEX.test(formData.phone.trim()),
    [formData.phone],
  );
  const isNameValid = formData.name.trim().length > 1;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      if (!isNameValid || !isPhoneValid || !formData.consent) {
        setErrorMessage(
          "Please fill in your name, phone number and accept the privacy policy.",
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
            region: "praha",
            situation_type: "standard",
            consent_gdpr: formData.consent,
            email: formData.email,
            source: "en",
            website: formData.website,
          }),
        });

        if (!response.ok) {
          throw new Error("Lead API error");
        }

        trackEvent("lead_form_submit_success", {
          form_name: "en_lead_form",
          region: "praha",
        });

        setStatus("success");
        setFormData(INITIAL_FORM);
      } catch {
        trackEvent("lead_form_submit_error", {
          form_name: "en_lead_form",
          region: "praha",
        });
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again or call us.");
      }
    },
    [formData, isNameValid, isPhoneValid],
  );

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mb-4 text-4xl">✅</div>
        <h3 className="mb-2 text-xl font-bold text-slate-900">
          Thank you for your inquiry!
        </h3>
        <p className="text-slate-600">
          We&apos;ll contact you within 24 hours with a free, no-obligation
          offer.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="space-y-4 rounded-2xl bg-white p-6 shadow-lg sm:p-8"
      onSubmit={handleSubmit}
      aria-label="Property inquiry form"
    >
      <h3 className="text-lg font-bold text-slate-900">
        Get Your Free Cash Offer
      </h3>
      <p className="text-sm text-slate-600">
        Fill in the form and we&apos;ll get back to you within 24 hours.
      </p>

      <div>
        <label htmlFor="en-name" className="text-sm font-medium text-slate-700">
          Full Name *
        </label>
        <input
          id="en-name"
          className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="John Smith"
          autoComplete="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label
          htmlFor="en-phone"
          className="text-sm font-medium text-slate-700"
        >
          Phone *
        </label>
        <input
          id="en-phone"
          className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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

      <div>
        <label
          htmlFor="en-email"
          className="text-sm font-medium text-slate-700"
        >
          Email <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="en-email"
          type="email"
          className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="john@example.com"
          autoComplete="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      <div>
        <label
          htmlFor="en-property-type"
          className="text-sm font-medium text-slate-700"
        >
          Property Type
        </label>
        <select
          id="en-property-type"
          className="mt-1 min-h-[48px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          value={formData.propertyType}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, propertyType: e.target.value }))
          }
        >
          {PROPERTY_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>
              {pt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="en-message"
          className="text-sm font-medium text-slate-700"
        >
          Message <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="en-message"
          className="mt-1 min-h-[80px] w-full rounded-xl border border-slate-300 px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Any additional details about your property..."
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          rows={3}
        />
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="en-website">Website</label>
        <input
          id="en-website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, website: e.target.value }))
          }
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          className="mt-1"
          type="checkbox"
          checked={formData.consent}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, consent: e.target.checked }))
          }
        />
        I agree to the processing of my personal data for the purpose of being
        contacted.
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Get My Cash Offer"}
      </button>

      {errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
