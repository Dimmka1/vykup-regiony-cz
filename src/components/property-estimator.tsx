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

interface EstimatorState {
  propertyType: PropertyType | null;
  area: number;
  condition: PropertyCondition | null;
}

interface PriceRange {
  min: number;
  max: number;
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

const BASE_PRICES: Record<PropertyType, number> = {
  byt: 45_000,
  dum: 35_000,
  pozemek: 3_000,
};

const CONDITION_MULTIPLIERS: Record<PropertyCondition, number> = {
  dobry: 1.0,
  rekonstrukce: 0.7,
  spatny: 0.5,
};

// --- Price calculation ---

function calculatePrice(state: EstimatorState): PriceRange | null {
  if (!state.propertyType || !state.condition) return null;
  const base =
    state.area *
    BASE_PRICES[state.propertyType] *
    CONDITION_MULTIPLIERS[state.condition];
  return { min: Math.round(base * 0.85), max: Math.round(base * 1.15) };
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
            i <= current ? "w-8 bg-teal-500" : "w-2 bg-slate-200"
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
                ? "border-teal-500 bg-teal-50 shadow-md"
                : "border-slate-200 bg-white hover:border-teal-300"
            }`}
          >
            <Icon
              className={`h-10 w-10 ${selected === key ? "text-teal-600" : "text-slate-400"}`}
            />
            <span
              className={`text-sm font-semibold ${selected === key ? "text-teal-700" : "text-slate-700"}`}
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
        <p className="text-4xl font-bold text-teal-600">{area} m²</p>
        <input
          type="range"
          min={20}
          max={500}
          step={5}
          value={area}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full max-w-md accent-teal-500"
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
                ? "border-teal-500 bg-teal-50 shadow-md"
                : "border-slate-200 bg-white hover:border-teal-300"
            }`}
          >
            <span className="text-3xl">{emoji}</span>
            <span
              className={`text-sm font-semibold ${selected === key ? "text-teal-700" : "text-slate-700"}`}
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
      <Calculator className="mb-4 h-12 w-12 text-teal-500" />
      <h3 className="text-lg font-semibold text-slate-900">
        Odhadovaná cena vaší nemovitosti
      </h3>
      <p className="mt-4 text-3xl font-bold text-teal-600 sm:text-4xl">
        {formatCzk(price.min)} — {formatCzk(price.max)}
      </p>
      <p className="mt-2 text-sm text-slate-500">
        Orientační odhad na základě průměrných tržních cen v ČR.
      </p>
      <a
        href="#kontakt"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3 text-base font-semibold text-white transition hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
      >
        Chcete přesnou nabídku? Vyplňte kontakt
        <ChevronRight className="h-5 w-5" />
      </a>
    </div>
  );
}

// --- Main component ---

export function PropertyEstimator(): ReactElement {
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

  const price = calculatePrice(state);

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
              <div className="w-full flex-shrink-0 px-1">
                <StepPropertyType
                  selected={state.propertyType}
                  onSelect={(t) => {
                    setState((s) => ({ ...s, propertyType: t }));
                    setStep(1);
                  }}
                />
              </div>
              <div className="w-full flex-shrink-0 px-1">
                <StepArea
                  area={state.area}
                  onChange={(v) => setState((s) => ({ ...s, area: v }))}
                />
              </div>
              <div className="w-full flex-shrink-0 px-1">
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
              <div className="w-full flex-shrink-0 px-1">
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
                  className="inline-flex items-center gap-1 rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:opacity-40"
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
