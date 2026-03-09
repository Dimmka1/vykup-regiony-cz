"use client";

import { useState, useCallback, type ReactElement } from "react";
import { MapPin, Phone, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { resolveRegionByPsc, type PscLookupResult } from "@/lib/psc-regions";
import { trackEvent } from "@/lib/analytics";
import { useFieldTracking } from "@/hooks/use-field-tracking";

/** Average byt price per m² by region — used for quick range estimate */
const REGION_AVG_PRICES: Record<string, number> = {
  praha: 150_800,
  "stredocesky-kraj": 86_500,
  "jihocesky-kraj": 72_000,
  "plzensky-kraj": 78_000,
  "karlovarsky-kraj": 42_000,
  "ustecky-kraj": 40_000,
  "liberecky-kraj": 68_000,
  "kralovehradecky-kraj": 75_000,
  "pardubicky-kraj": 72_000,
  vysocina: 55_000,
  "jihomoravsky-kraj": 91_000,
  "olomoucky-kraj": 70_000,
  "moravskoslezsky-kraj": 50_000,
  "zlinsky-kraj": 68_000,
};

const VYKUPNI_DISCOUNT = 0.75;
const TYPICAL_AREA = 65; // m² — typical flat

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function getQuickEstimate(regionKey: string): { min: number; max: number } {
  const pricePerM2 = REGION_AVG_PRICES[regionKey] ?? 70_000;
  const base = pricePerM2 * TYPICAL_AREA * VYKUPNI_DISCOUNT;
  return {
    min: Math.round(base * 0.6),
    max: Math.round(base * 1.4),
  };
}

type FormStep = "psc" | "result" | "success";
type SubmitStatus = "idle" | "submitting" | "error";

const CZ_PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

interface QuickEstimateFormProps {
  regionName: string;
}

export function QuickEstimateForm({
  regionName,
}: QuickEstimateFormProps): ReactElement {
  const [step, setStep] = useState<FormStep>("psc");
  const [psc, setPsc] = useState("");
  const [region, setRegion] = useState<PscLookupResult | null>(null);
  const [pscError, setPscError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const { getFieldProps } = useFieldTracking("quick_estimate_form");

  const handlePscSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const result = resolveRegionByPsc(psc);
      if (!result) {
        setPscError("Zadejte platné PSČ (5 číslic)");
        return;
      }
      setPscError("");
      setRegion(result);
      setStep("result");
      trackEvent("quick_estimate_psc", {
        region: result.regionName,
        source: regionName,
      });
    },
    [psc, regionName],
  );

  const handlePhoneSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!CZ_PHONE_REGEX.test(phone.trim())) {
        setPhoneError("Zadejte telefon ve formátu +420 xxx xxx xxx");
        return;
      }
      setPhoneError("");
      setSubmitStatus("submitting");

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "quick-estimate",
            phone: phone.trim(),
            source: "quick-estimate-hero",
            region: region?.regionName ?? regionName,
            psc: psc.trim(),
          }),
        });

        if (!response.ok) throw new Error("API error");

        trackEvent("quick_estimate_phone_submit", {
          region: region?.regionName ?? regionName,
        });
        setStep("success");
      } catch {
        setSubmitStatus("error");
        setPhoneError("Nepodařilo se odeslat. Zkuste to znovu.");
      }
    },
    [phone, region, regionName, psc],
  );

  if (step === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
        <CheckCircle className="h-6 w-6 shrink-0 text-green-400" />
        <p className="text-sm font-semibold text-white">
          Děkujeme! Zavoláme vám s přesnou nabídkou do 30 minut.
        </p>
      </div>
    );
  }

  if (step === "result" && region) {
    const estimate = getQuickEstimate(region.regionKey);
    return (
      <div className="w-full max-w-lg rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--theme-300)]">
            Orientační výkupní cena • {region.regionName}
          </p>
          <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            {formatCzk(estimate.min)} – {formatCzk(estimate.max)}
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Pro byt ~{TYPICAL_AREA} m². Přesnou cenu stanovíme po prohlídce.
          </p>
        </div>
        <form
          onSubmit={handlePhoneSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="flex-1">
            <label htmlFor="qe-phone" className="sr-only">
              Váš telefon
            </label>
            <input
              id="qe-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+420 xxx xxx xxx"
              {...getFieldProps("qe-phone")}
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/[^\d+\s]/g, "").slice(0, 20));
                if (phoneError) setPhoneError("");
                if (submitStatus === "error") setSubmitStatus("idle");
              }}
              className="min-h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-[var(--theme-400)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-500)]"
              required
            />
            {phoneError && (
              <p className="mt-1 text-xs text-red-400" role="alert">
                {phoneError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={submitStatus === "submitting"}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--theme-500)] px-6 py-3 text-base font-bold text-white transition hover:bg-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-70"
          >
            {submitStatus === "submitting" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Phone className="h-4 w-4" />
                Získat přesnou nabídku
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Step: PSČ input
  return (
    <form
      onSubmit={handlePscSubmit}
      className="w-full max-w-lg"
      aria-label="Rychlý odhad ceny"
    >
      <p className="mb-2 text-sm font-medium text-slate-300">
        💰 Zjistěte orientační cenu za 30 sekund
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <label htmlFor="qe-psc" className="sr-only">
            PSČ vaší nemovitosti
          </label>
          <input
            id="qe-psc"
            type="text"
            inputMode="numeric"
            placeholder="Zadejte PSČ (např. 150 00)"
            {...getFieldProps("qe-psc")}
            value={psc}
            onChange={(e) => {
              setPsc(e.target.value.replace(/[^\d\s]/g, "").slice(0, 6));
              if (pscError) setPscError("");
            }}
            className="min-h-12 w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-base text-white placeholder-slate-400 backdrop-blur-sm transition focus:border-[var(--theme-400)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-500)]"
            required
          />
          {pscError && (
            <p className="mt-1 text-xs text-red-400" role="alert">
              {pscError}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--theme-500)] px-6 py-3 text-base font-bold text-white transition hover:bg-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          Zjistit cenu
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
