"use client";

import { useState, useCallback, useMemo, type ReactElement } from "react";
import { formatCzk } from "@/lib/format";
import { CZ_PHONE_REGEX } from "@/lib/validation";
import {
  Home,
  Building2,
  TreePine,
  Calculator,
  Mail,
  Phone,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

// --- Types ---

type PropertyType = "byt" | "dum" | "pozemek";
type PropertyCondition = "novy" | "dobry" | "rekonstrukce" | "spatny";

interface RegionOption {
  key: string;
  label: string;
}

interface PriceRange {
  min: number;
  max: number;
  marketMin: number;
  marketMax: number;
}

interface LeadData {
  email: string;
  phone: string;
}

// --- Constants ---

const PROPERTY_TYPES: readonly {
  key: PropertyType;
  label: string;
  Icon: typeof Building2;
}[] = [
  { key: "byt", label: "Byt", Icon: Building2 },
  { key: "dum", label: "Rodinný dům", Icon: Home },
  { key: "pozemek", label: "Pozemek", Icon: TreePine },
];

const CONDITIONS: readonly {
  key: PropertyCondition;
  label: string;
  description: string;
}[] = [
  {
    key: "novy",
    label: "Novostavba",
    description: "Nový nebo po celkové rekonstrukci",
  },
  {
    key: "dobry",
    label: "Dobrý stav",
    description: "Udržovaný, bez nutnosti oprav",
  },
  {
    key: "rekonstrukce",
    label: "K rekonstrukci",
    description: "Vyžaduje částečnou rekonstrukci",
  },
  {
    key: "spatny",
    label: "Špatný stav",
    description: "Vyžaduje kompletní rekonstrukci",
  },
];

const REGIONS: readonly RegionOption[] = [
  { key: "praha", label: "Praha" },
  { key: "stredocesky-kraj", label: "Středočeský kraj" },
  { key: "jihocesky-kraj", label: "Jihočeský kraj" },
  { key: "plzensky-kraj", label: "Plzeňský kraj" },
  { key: "karlovarsky-kraj", label: "Karlovarský kraj" },
  { key: "ustecky-kraj", label: "Ústecký kraj" },
  { key: "liberecky-kraj", label: "Liberecký kraj" },
  { key: "kralovehradecky-kraj", label: "Královéhradecký kraj" },
  { key: "pardubicky-kraj", label: "Pardubický kraj" },
  { key: "vysocina", label: "Vysočina" },
  { key: "jihomoravsky-kraj", label: "Jihomoravský kraj" },
  { key: "olomoucky-kraj", label: "Olomoucký kraj" },
  { key: "moravskoslezsky-kraj", label: "Moravskoslezský kraj" },
  { key: "zlinsky-kraj", label: "Zlínský kraj" },
];

const REGION_PRICES: Record<
  string,
  { byt: number; dum: number; pozemek: number }
> = {
  praha: { byt: 150_800, dum: 105_000, pozemek: 14_000 },
  "stredocesky-kraj": { byt: 86_500, dum: 60_000, pozemek: 5_500 },
  "jihocesky-kraj": { byt: 72_000, dum: 48_000, pozemek: 3_000 },
  "plzensky-kraj": { byt: 78_000, dum: 52_000, pozemek: 3_200 },
  "karlovarsky-kraj": { byt: 42_000, dum: 32_000, pozemek: 1_800 },
  "ustecky-kraj": { byt: 40_000, dum: 28_000, pozemek: 1_800 },
  "liberecky-kraj": { byt: 68_000, dum: 45_000, pozemek: 2_500 },
  "kralovehradecky-kraj": { byt: 75_000, dum: 48_000, pozemek: 3_200 },
  "pardubicky-kraj": { byt: 72_000, dum: 46_000, pozemek: 2_800 },
  vysocina: { byt: 55_000, dum: 38_000, pozemek: 1_600 },
  "jihomoravsky-kraj": { byt: 91_000, dum: 58_000, pozemek: 5_000 },
  "olomoucky-kraj": { byt: 70_000, dum: 42_000, pozemek: 2_200 },
  "moravskoslezsky-kraj": { byt: 50_000, dum: 35_000, pozemek: 1_700 },
  "zlinsky-kraj": { byt: 68_000, dum: 44_000, pozemek: 2_400 },
};

const CONDITION_MULTIPLIERS: Record<PropertyCondition, number> = {
  novy: 1.15,
  dobry: 1.0,
  rekonstrukce: 0.7,
  spatny: 0.5,
};

const VYKUPNI_DISCOUNT = 0.8;

// --- Helpers ---

function calculatePrice(
  propertyType: PropertyType,
  area: number,
  regionKey: string,
  condition: PropertyCondition,
): PriceRange {
  const prices = REGION_PRICES[regionKey];
  if (!prices) {
    const avg = Object.values(REGION_PRICES);
    const count = avg.length;
    const avgPrices = {
      byt: Math.round(avg.reduce((s, r) => s + r.byt, 0) / count),
      dum: Math.round(avg.reduce((s, r) => s + r.dum, 0) / count),
      pozemek: Math.round(avg.reduce((s, r) => s + r.pozemek, 0) / count),
    };
    const base =
      avgPrices[propertyType] * area * CONDITION_MULTIPLIERS[condition];
    return {
      marketMin: Math.round(base * 0.9),
      marketMax: Math.round(base * 1.1),
      min: Math.round(base * VYKUPNI_DISCOUNT * 0.9),
      max: Math.round(base * VYKUPNI_DISCOUNT * 1.1),
    };
  }

  const base = prices[propertyType] * area * CONDITION_MULTIPLIERS[condition];
  return {
    marketMin: Math.round(base * 0.9),
    marketMax: Math.round(base * 1.1),
    min: Math.round(base * VYKUPNI_DISCOUNT * 0.9),
    max: Math.round(base * VYKUPNI_DISCOUNT * 1.1),
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- Component ---

export function OdhadCalculator(): ReactElement {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [area, setArea] = useState<number>(80);
  const [areaInput, setAreaInput] = useState<string>("80");
  const [regionKey, setRegionKey] = useState<string>("");
  const [condition, setCondition] = useState<PropertyCondition | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showDetailedResult, setShowDetailedResult] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({ email: "", phone: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState("");

  const isFormComplete =
    propertyType !== null && regionKey !== "" && condition !== null && area > 0;

  const price = useMemo(() => {
    if (!isFormComplete || !propertyType || !condition) return null;
    return calculatePrice(propertyType, area, regionKey, condition);
  }, [propertyType, area, regionKey, condition, isFormComplete]);

  const handleEstimate = useCallback(() => {
    if (!isFormComplete || !propertyType || !condition) return;

    trackEvent("calculator_estimate", {
      property_type: propertyType,
      area,
      region: regionKey,
      condition,
    });

    setShowResult(true);
    setShowDetailedResult(false);
  }, [isFormComplete, propertyType, area, regionKey, condition]);

  const handleLeadSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLeadError("");

      if (!EMAIL_REGEX.test(leadData.email.trim())) {
        setLeadError("Zadejte platný e-mail.");
        return;
      }
      if (!CZ_PHONE_REGEX.test(leadData.phone.trim())) {
        setLeadError("Zadejte telefon ve formátu +420 777 123 456.");
        return;
      }

      setLeadSubmitting(true);

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "",
            phone: leadData.phone.trim(),
            email: leadData.email.trim(),
            property_type: propertyType ?? "",
            region: regionKey,
            situation_type: "odhad-ceny",
            address: "",
            postal_code: "",
            city: "",
            consent_gdpr: true,
            website: "",
          }),
        });

        if (!response.ok) throw new Error("API error");

        trackEvent("calculator_lead", {
          property_type: propertyType ?? "",
          region: regionKey,
        });

        setShowDetailedResult(true);
      } catch {
        setLeadError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
      } finally {
        setLeadSubmitting(false);
      }
    },
    [leadData, propertyType, regionKey],
  );

  const handleAreaInputChange = useCallback((value: string) => {
    setAreaInput(value);
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 10000) {
      setArea(parsed);
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
        {/* Property Type */}
        <div className="mb-8">
          <label className="mb-3 block text-sm font-semibold text-slate-800">
            1. Typ nemovitosti
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {PROPERTY_TYPES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPropertyType(key);
                  setShowResult(false);
                }}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition hover:shadow-sm ${
                  propertyType === key
                    ? "border-[var(--theme-500)] bg-[var(--theme-50)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    propertyType === key
                      ? "text-[var(--theme-600)]"
                      : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    propertyType === key
                      ? "text-[var(--theme-700)]"
                      : "text-slate-700"
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Area */}
        <div className="mb-8">
          <label
            htmlFor="odhad-area"
            className="mb-3 block text-sm font-semibold text-slate-800"
          >
            2. Plocha (m²)
          </label>
          <div className="flex items-center gap-4">
            <input
              id="odhad-area"
              type="number"
              min={1}
              max={10000}
              value={areaInput}
              onChange={(e) => handleAreaInputChange(e.target.value)}
              onBlur={() => {
                setShowResult(false);
                if (area > 0) setAreaInput(String(area));
              }}
              className="w-28 rounded-xl border border-slate-300 px-4 py-3 text-center text-lg font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
            />
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={Math.min(area, 500)}
              onChange={(e) => {
                const v = Number(e.target.value);
                setArea(v);
                setAreaInput(String(v));
                setShowResult(false);
              }}
              className="flex-1 accent-[var(--theme-500)]"
              aria-label="Plocha nemovitosti"
            />
          </div>
        </div>

        {/* Region */}
        <div className="mb-8">
          <label
            htmlFor="odhad-region"
            className="mb-3 block text-sm font-semibold text-slate-800"
          >
            3. Kraj / region
          </label>
          <select
            id="odhad-region"
            value={regionKey}
            onChange={(e) => {
              setRegionKey(e.target.value);
              setShowResult(false);
            }}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
          >
            <option value="">Vyberte kraj</option>
            {REGIONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div className="mb-8">
          <label className="mb-3 block text-sm font-semibold text-slate-800">
            4. Stav nemovitosti
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONDITIONS.map(({ key, label, description }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCondition(key);
                  setShowResult(false);
                }}
                className={`rounded-xl border-2 px-4 py-3 text-left transition hover:shadow-sm ${
                  condition === key
                    ? "border-[var(--theme-500)] bg-[var(--theme-50)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <span
                  className={`block text-sm font-semibold ${
                    condition === key
                      ? "text-[var(--theme-700)]"
                      : "text-slate-700"
                  }`}
                >
                  {label}
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  {description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <button
          type="button"
          onClick={handleEstimate}
          disabled={!isFormComplete}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-4 text-base font-semibold text-white transition hover:bg-[var(--theme-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Calculator className="h-5 w-5" />
          Spočítat odhad ceny
        </button>

        {/* Preview Result */}
        {showResult && price && (
          <div className="mt-8 rounded-2xl border border-[var(--theme-200)] bg-[var(--theme-50)] p-6">
            <div className="flex items-center gap-2 text-[var(--theme-700)]">
              <TrendingUp className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Orientační odhad ceny</h3>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tržní hodnota
                </p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {formatCzk(price.marketMin)} – {formatCzk(price.marketMax)}
                </p>
              </div>
              <div className="rounded-xl bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Výkupní cena
                </p>
                <p className="mt-1 text-xl font-bold text-[var(--theme-600)]">
                  {formatCzk(price.min)} – {formatCzk(price.max)}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Orientační výpočet na základě průměrných cen v kraji. Pro
              přesnější odhad vyplňte kontakt níže.
            </p>

            {/* Lead Capture Gate */}
            {!showDetailedResult ? (
              <div className="mt-6 rounded-xl border border-[var(--theme-200)] bg-white p-6">
                <h4 className="text-base font-semibold text-slate-900">
                  📊 Získejte detailní odhad zdarma
                </h4>
                <p className="mt-1 text-sm text-slate-600">
                  Zanechte kontakt a obdržíte podrobný odhad s porovnáním tržní
                  a výkupní ceny, přizpůsobený přesně vaší nemovitosti.
                </p>
                <form onSubmit={handleLeadSubmit} className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:ring-2 focus-within:ring-[var(--theme-500)]">
                    <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="email"
                      placeholder="vas@email.cz"
                      value={leadData.email}
                      onChange={(e) =>
                        setLeadData((p) => ({ ...p, email: e.target.value }))
                      }
                      className="w-full text-sm focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 focus-within:ring-2 focus-within:ring-[var(--theme-500)]">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+420 777 123 456"
                      value={leadData.phone}
                      onChange={(e) =>
                        setLeadData((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full text-sm focus:outline-none"
                      required
                    />
                  </div>
                  {leadError && (
                    <p className="text-xs text-red-600">{leadError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)] disabled:opacity-70"
                  >
                    {leadSubmitting
                      ? "Odesílám..."
                      : "Získat detailní odhad zdarma"}
                    {!leadSubmitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                  <p className="text-center text-xs text-slate-400">
                    Odesláním souhlasíte se{" "}
                    <a
                      href="/ochrana-osobnich-udaju"
                      className="underline hover:text-slate-600"
                    >
                      zpracováním osobních údajů
                    </a>
                    .
                  </p>
                </form>
              </div>
            ) : (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
                <h4 className="text-base font-semibold text-green-800">
                  ✅ Detailní odhad odeslán
                </h4>
                <p className="mt-2 text-sm text-green-700">
                  Děkujeme! Na váš e-mail jsme odeslali podrobný odhad ceny. Náš
                  specialista vás bude kontaktovat do 24 hodin s přesnou
                  nabídkou.
                </p>
                <a
                  href="#kontakt"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)]"
                >
                  Chci nezávaznou nabídku ihned
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
