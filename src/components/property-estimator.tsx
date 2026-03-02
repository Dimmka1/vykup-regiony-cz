"use client";

import { useState, useCallback, type ReactElement } from "react";
import {
  Home,
  Building2,
  TreePine,
  ChevronRight,
  ChevronLeft,
  Calculator,
} from "lucide-react";

// --- Types ---

type PropertyType = "byt" | "dum" | "pozemek";
type PropertyCondition = "dobry" | "rekonstrukce" | "spatny";

interface RegionPrices {
  byt_m2: number;
  dum_m2: number;
  pozemek_m2: number;
}

interface EstimatorState {
  propertyType: PropertyType | null;
  area: number;
  condition: PropertyCondition | null;
}

interface PriceRange {
  min: number;
  max: number;
}

interface PropertyEstimatorProps {
  regionKey?: string;
}

// --- Constants ---

const PROPERTY_TYPES = [
  { key: "byt" as const, label: "Byt", Icon: Building2 },
  { key: "dum" as const, label: "Rodinný dům", Icon: Home },
  { key: "pozemek" as const, label: "Pozemek", Icon: TreePine },
] as const;

const CONDITIONS = [
  { key: "dobry" as const, label: "Dobrý stav", emoji: "✨" },
  { key: "rekonstrukce" as const, label: "K rekonstrukci", emoji: "🔧" },
  { key: "spatny" as const, label: "Špatný stav", emoji: "🏚️" },
] as const;

/** Výkupní discount - we offer 75% of market price */
const VYKUPNI_DISCOUNT = 0.75;

/** Per-region market prices (CZK/m²), source: PRICE_RESEARCH.json */
const REGION_PRICES: Record<string, RegionPrices> = {
  praha: { byt_m2: 150_800, dum_m2: 105_000, pozemek_m2: 14_000 },
  "stredocesky-kraj": { byt_m2: 86_500, dum_m2: 60_000, pozemek_m2: 5_500 },
  "jihocesky-kraj": { byt_m2: 72_000, dum_m2: 48_000, pozemek_m2: 3_000 },
  "plzensky-kraj": { byt_m2: 78_000, dum_m2: 52_000, pozemek_m2: 3_200 },
  "karlovarsky-kraj": { byt_m2: 42_000, dum_m2: 32_000, pozemek_m2: 1_800 },
  "ustecky-kraj": { byt_m2: 40_000, dum_m2: 28_000, pozemek_m2: 1_800 },
  "liberecky-kraj": { byt_m2: 68_000, dum_m2: 45_000, pozemek_m2: 2_500 },
  "kralovehradecky-kraj": { byt_m2: 75_000, dum_m2: 48_000, pozemek_m2: 3_200 },
  "pardubicky-kraj": { byt_m2: 72_000, dum_m2: 46_000, pozemek_m2: 2_800 },
  vysocina: { byt_m2: 55_000, dum_m2: 38_000, pozemek_m2: 1_600 },
  "jihomoravsky-kraj": { byt_m2: 91_000, dum_m2: 58_000, pozemek_m2: 5_000 },
  "olomoucky-kraj": { byt_m2: 70_000, dum_m2: 42_000, pozemek_m2: 2_200 },
  "moravskoslezsky-kraj": { byt_m2: 50_000, dum_m2: 35_000, pozemek_m2: 1_700 },
  "zlinsky-kraj": { byt_m2: 68_000, dum_m2: 44_000, pozemek_m2: 2_400 },
};

/** Country-wide average (mean of all 14 regions) */
const COUNTRY_AVERAGE: RegionPrices = (() => {
  const values = Object.values(REGION_PRICES);
  const count = values.length;
  return {
    byt_m2: Math.round(values.reduce((s, r) => s + r.byt_m2, 0) / count),
    dum_m2: Math.round(values.reduce((s, r) => s + r.dum_m2, 0) / count),
    pozemek_m2: Math.round(
      values.reduce((s, r) => s + r.pozemek_m2, 0) / count,
    ),
  };
})();

const CONDITION_MULTIPLIERS: Record<PropertyCondition, number> = {
  dobry: 1.0,
  rekonstrukce: 0.7,
  spatny: 0.5,
};

// --- Helpers ---

function getRegionPrices(regionKey?: string): RegionPrices {
  if (regionKey && regionKey in REGION_PRICES) {
    return REGION_PRICES[regionKey];
  }
  return COUNTRY_AVERAGE;
}

function getBasePricePerM2(
  prices: RegionPrices,
  propertyType: PropertyType,
): number {
  const mapping: Record<PropertyType, keyof RegionPrices> = {
    byt: "byt_m2",
    dum: "dum_m2",
    pozemek: "pozemek_m2",
  };
  return prices[mapping[propertyType]];
}

// --- Price calculation ---

function calculatePrice(
  state: EstimatorState,
  regionKey?: string,
): PriceRange | null {
  if (!state.propertyType || !state.condition) return null;
  const prices = getRegionPrices(regionKey);
  const marketPrice =
    state.area *
    getBasePricePerM2(prices, state.propertyType) *
    CONDITION_MULTIPLIERS[state.condition];
  const vykupniPrice = marketPrice * VYKUPNI_DISCOUNT;
  return {
    min: Math.round(vykupniPrice * 0.85),
    max: Math.round(vykupniPrice * 1.15),
  };
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

// --- GTM helper ---

function pushGtmEvent(
  propertyType: PropertyType,
  condition: PropertyCondition,
): void {
  if (typeof window !== "undefined" && "dataLayer" in window) {
    (
      window as unknown as { dataLayer: Record<string, unknown>[] }
    ).dataLayer.push({
      event: "estimator_completed",
      estimator_type: propertyType,
      estimator_condition: condition,
    });
  }
}

// --- Sub-components ---

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}): ReactElement {
  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i <= current ? "bg-[var(--theme-50)]0 w-8" : "w-2 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function StepPropertyType({
  selected,
  onSelect,
}: {
  selected: PropertyType | null;
  onSelect: (t: PropertyType) => void;
}): ReactElement {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-900">
        Jaký typ nemovitosti prodáváte?
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {PROPERTY_TYPES.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition hover:-translate-y-0.5 hover:shadow-md ${
              selected === key
                ? "border-[var(--theme-500)] bg-[var(--theme-50)] shadow-md"
                : "border-slate-200 bg-white hover:border-[var(--theme-200)]"
            }`}
          >
            <Icon
              className={`h-10 w-10 ${selected === key ? "text-[var(--theme-600)]" : "text-slate-400"}`}
            />
            <span
              className={`text-sm font-semibold ${selected === key ? "text-[var(--theme-700)]" : "text-slate-700"}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepArea({
  area,
  onChange,
}: {
  area: number;
  onChange: (v: number) => void;
}): ReactElement {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-900">
        Jaká je plocha? (m²)
      </h3>
      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-4xl font-bold text-[var(--theme-600)]">{area} m²</p>
        <input
          type="range"
          min={20}
          max={500}
          step={5}
          value={area}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full max-w-md accent-[var(--theme-500)]"
          aria-label="Plocha nemovitosti v metrech čtverečních"
        />
        <div className="flex w-full max-w-md justify-between text-xs text-slate-400">
          <span>20 m²</span>
          <span>500 m²</span>
        </div>
      </div>
    </div>
  );
}

function StepCondition({
  selected,
  onSelect,
}: {
  selected: PropertyCondition | null;
  onSelect: (c: PropertyCondition) => void;
}): ReactElement {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-900">
        V jakém je stavu?
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {CONDITIONS.map(({ key, label, emoji }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition hover:-translate-y-0.5 hover:shadow-md ${
              selected === key
                ? "border-[var(--theme-500)] bg-[var(--theme-50)] shadow-md"
                : "border-slate-200 bg-white hover:border-[var(--theme-200)]"
            }`}
          >
            <span className="text-3xl">{emoji}</span>
            <span
              className={`text-sm font-semibold ${selected === key ? "text-[var(--theme-700)]" : "text-slate-700"}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepResult({ price }: { price: PriceRange }): ReactElement {
  return (
    <div className="flex flex-col items-center text-center">
      <Calculator className="mb-4 h-12 w-12 text-[var(--theme-500)]" />
      <h3 className="text-lg font-semibold text-slate-900">
        Odhadovaná výkupní cena vaší nemovitosti
      </h3>
      <p className="mt-4 text-3xl font-bold text-[var(--theme-600)] sm:text-4xl">
        {formatCzk(price.min)} - {formatCzk(price.max)}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Orientační odhad výkupní ceny na základě tržních cen ve vašem regionu.
      </p>
      <a
        href="#kontakt"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("kontakt")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        Získat nezávaznou nabídku →
      </a>
    </div>
  );
}

// --- Main component ---

export function PropertyEstimator({
  regionKey,
}: PropertyEstimatorProps): ReactElement {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<EstimatorState>({
    propertyType: null,
    area: 80,
    condition: null,
  });

  const canNext =
    (step === 0 && state.propertyType !== null) ||
    step === 1 ||
    (step === 2 && state.condition !== null);

  const goNext = useCallback(() => {
    if (step === 2 && state.propertyType && state.condition) {
      pushGtmEvent(state.propertyType, state.condition);
    }
    setStep((s) => Math.min(s + 1, 3));
  }, [step, state.propertyType, state.condition]);

  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const price = calculatePrice(state, regionKey);

  return (
    <section className="py-16" id="estimator">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Kolik může vaše nemovitost stát?
        </h2>
        <p className="mt-2 text-center text-slate-600">
          Odpovězte na 3 otázky a zjistěte orientační cenu za 30 sekund.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <StepIndicator current={step} total={4} />

          {/* Step content with slide animation */}
          <div className="relative min-h-[240px] overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                width: "400%",
                transform: `translateX(-${step * 25}%)`,
              }}
            >
              <div className="w-1/4 flex-shrink-0 px-1">
                <StepPropertyType
                  selected={state.propertyType}
                  onSelect={(t) => {
                    setState((s) => ({ ...s, propertyType: t }));
                    setStep(1);
                  }}
                />
              </div>
              <div className="w-1/4 flex-shrink-0 px-1">
                <StepArea
                  area={state.area}
                  onChange={(v) => setState((s) => ({ ...s, area: v }))}
                />
              </div>
              <div className="w-1/4 flex-shrink-0 px-1">
                <StepCondition
                  selected={state.condition}
                  onSelect={(c) => {
                    setState((s) => ({ ...s, condition: c }));
                    if (state.propertyType) {
                      pushGtmEvent(state.propertyType, c);
                    }
                    setStep(3);
                  }}
                />
              </div>
              <div className="w-1/4 flex-shrink-0 px-1">
                {price && <StepResult price={price} />}
              </div>
            </div>
          </div>

          {/* Navigation */}
          {step < 3 && (
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-slate-700 disabled:invisible"
              >
                <ChevronLeft className="h-4 w-4" />
                Zpět
              </button>
              {step === 1 && (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                  className="inline-flex items-center gap-1 rounded-xl bg-[var(--theme-600)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)] disabled:opacity-40"
                >
                  Další
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
