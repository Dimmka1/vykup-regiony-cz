"use client";

import { useState, useCallback, type ReactElement } from "react";
import {
  Home,
  Building2,
  TreePine,
  Store,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Lock,
  Send,
  MapPin,
} from "lucide-react";
import {
  calculateValuation,
  PROPERTY_TYPE_LABELS,
  CONDITION_LABELS,
  FLOOR_LABELS,
  REGION_LABELS,
  type PropertyType,
  type PropertyCondition,
  type FloorCategory,
  type ValuationResult,
} from "@/lib/valuation";

// --- Constants ---

interface TypeOption {
  key: PropertyType;
  label: string;
  Icon: typeof Building2;
}

const TYPE_OPTIONS: readonly TypeOption[] = [
  { key: "byt", label: PROPERTY_TYPE_LABELS.byt, Icon: Building2 },
  { key: "dum", label: PROPERTY_TYPE_LABELS.dum, Icon: Home },
  { key: "pozemek", label: PROPERTY_TYPE_LABELS.pozemek, Icon: TreePine },
  { key: "komercni", label: PROPERTY_TYPE_LABELS.komercni, Icon: Store },
] as const;

interface ConditionOption {
  key: PropertyCondition;
  label: string;
  emoji: string;
}

const CONDITION_OPTIONS: readonly ConditionOption[] = [
  { key: "vyborny", label: CONDITION_LABELS.vyborny, emoji: "✨" },
  { key: "dobry", label: CONDITION_LABELS.dobry, emoji: "👍" },
  { key: "horsi", label: CONDITION_LABELS.horsi, emoji: "🔧" },
  { key: "rekonstrukce", label: CONDITION_LABELS.rekonstrukce, emoji: "🏚️" },
] as const;

interface FloorOption {
  key: FloorCategory;
  label: string;
}

const FLOOR_OPTIONS: readonly FloorOption[] = [
  { key: "prizemi", label: FLOOR_LABELS.prizemi },
  { key: "1-3", label: FLOOR_LABELS["1-3"] },
  { key: "4+", label: FLOOR_LABELS["4+"] },
  { key: "podkrovi", label: FLOOR_LABELS.podkrovi },
] as const;

const REGION_KEYS = Object.keys(REGION_LABELS);

const TOTAL_STEPS = 6; // region, type, m2, condition, floor, results

// --- Helpers ---

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function pushValuationGtmEvent(result: ValuationResult): void {
  if (typeof window !== "undefined" && "dataLayer" in window) {
    (
      window as unknown as { dataLayer: Record<string, unknown>[] }
    ).dataLayer.push({
      event: "valuation_complete",
      value_min: result.min,
      value_max: result.max,
      vykup_min: result.vykupMin,
      vykup_max: result.vykupMax,
      market_estimate: result.marketEstimate,
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
            i <= current ? "w-8 bg-[var(--theme-500)]" : "w-2 bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function StepRegion({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (r: string) => void;
}): ReactElement {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-900">
        <MapPin className="mb-1 inline h-5 w-5 text-[var(--theme-500)]" /> Ve
        kterém kraji se nemovitost nachází?
      </h3>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {REGION_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition hover:shadow-sm ${
              selected === key
                ? "border-[var(--theme-500)] bg-[var(--theme-50)] text-[var(--theme-700)]"
                : "border-slate-200 bg-white text-slate-700 hover:border-[var(--theme-200)]"
            }`}
          >
            {REGION_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}

function StepType({
  selected,
  onSelect,
}: {
  selected: PropertyType | null;
  onSelect: (t: PropertyType) => void;
}): ReactElement {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-900">
        Jaký typ nemovitosti oceňujete?
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TYPE_OPTIONS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex items-center gap-3 rounded-2xl border-2 p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
              selected === key
                ? "border-[var(--theme-500)] bg-[var(--theme-50)] shadow-md"
                : "border-slate-200 bg-white hover:border-[var(--theme-200)]"
            }`}
          >
            <Icon
              className={`h-8 w-8 ${selected === key ? "text-[var(--theme-600)]" : "text-slate-400"}`}
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
        Jaká je plocha nemovitosti? (m²)
      </h3>
      <div className="mt-6 flex flex-col items-center gap-4">
        <p className="text-4xl font-bold text-[var(--theme-600)]">{area} m²</p>
        <input
          type="range"
          min={10}
          max={500}
          step={5}
          value={area}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full max-w-md accent-[var(--theme-500)]"
          aria-label="Plocha nemovitosti v metrech čtverečních"
        />
        <div className="flex w-full max-w-md justify-between text-xs text-slate-400">
          <span>10 m²</span>
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
        V jakém je nemovitost stavu?
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CONDITION_OPTIONS.map(({ key, label, emoji }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`flex items-center gap-3 rounded-2xl border-2 p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
              selected === key
                ? "border-[var(--theme-500)] bg-[var(--theme-50)] shadow-md"
                : "border-slate-200 bg-white hover:border-[var(--theme-200)]"
            }`}
          >
            <span className="text-2xl">{emoji}</span>
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

function StepFloor({
  selected,
  onSelect,
}: {
  selected: FloorCategory | null;
  onSelect: (f: FloorCategory) => void;
}): ReactElement {
  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-slate-900">
        V jakém patře se nemovitost nachází?
      </h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FLOOR_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`rounded-2xl border-2 p-5 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
              selected === key
                ? "border-[var(--theme-500)] bg-[var(--theme-50)] shadow-md"
                : "border-slate-200 bg-white hover:border-[var(--theme-200)]"
            }`}
          >
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

function RangeBar({
  vykupMin,
  vykupMax,
  marketMin,
  marketMax,
}: {
  vykupMin: number;
  vykupMax: number;
  marketMin: number;
  marketMax: number;
}): ReactElement {
  // Normalize positions relative to the full range
  const absMin = vykupMin;
  const absMax = marketMax;
  const range = absMax - absMin || 1;

  const vykupStartPct = 0;
  const vykupEndPct = ((vykupMax - absMin) / range) * 100;
  const marketStartPct = ((marketMin - absMin) / range) * 100;
  const marketEndPct = 100;

  return (
    <div className="mt-6 w-full space-y-3">
      {/* Výkupní cena bar */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold text-emerald-700">Výkupní cena</span>
          <span>
            {formatCzk(vykupMin)} – {formatCzk(vykupMax)}
          </span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-1000 ease-out"
            style={{
              left: `${vykupStartPct}%`,
              width: `${vykupEndPct - vykupStartPct}%`,
            }}
          />
        </div>
      </div>
      {/* Tržní cena bar */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold text-blue-700">Tržní odhad</span>
          <span>
            {formatCzk(marketMin)} – {formatCzk(marketMax)}
          </span>
        </div>
        <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="absolute inset-y-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000 ease-out"
            style={{
              left: `${marketStartPct}%`,
              width: `${marketEndPct - marketStartPct}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function GatedReportForm({
  valuation,
  region,
  propertyType,
}: {
  valuation: ValuationResult;
  region: string;
  propertyType: PropertyType;
}): ReactElement {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "valuation-report",
            email,
            phone,
            region,
            property_type: propertyType,
            valuation_data: {
              marketEstimate: valuation.marketEstimate,
              vykupMin: valuation.vykupMin,
              vykupMax: valuation.vykupMax,
              min: valuation.min,
              max: valuation.max,
            },
          }),
        });

        if (res.ok) {
          setSubmitted(true);
        } else {
          setError("Nepodařilo se odeslat. Zkuste to prosím znovu.");
        }
      } catch {
        setError("Chyba připojení. Zkuste to prosím znovu.");
      } finally {
        setSubmitting(false);
      }
    },
    [email, phone, region, propertyType, valuation],
  );

  if (submitted) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-semibold text-emerald-800">
          ✅ Děkujeme! Podrobný odhad vám zašleme na e-mail.
        </p>
        <p className="mt-2 text-sm text-emerald-600">
          Náš specialista se vám ozve do 24 hodin.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Lock className="h-4 w-4" />
        Získat podrobný odhad zdarma
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Váš e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[var(--theme-500)] focus:ring-2 focus:ring-[var(--theme-200)]"
        />
        <input
          type="tel"
          required
          placeholder="Telefon (např. +420 777 123 456)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[var(--theme-500)] focus:ring-2 focus:ring-[var(--theme-200)]"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--theme-600)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)] disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitting ? "Odesílám…" : "Získat podrobný odhad"}
        </button>
      </form>
    </div>
  );
}

function StepResults({
  valuation,
  region,
  propertyType,
}: {
  valuation: ValuationResult;
  region: string;
  propertyType: PropertyType;
}): ReactElement {
  return (
    <div className="flex flex-col items-center text-center">
      <TrendingUp className="mb-4 h-12 w-12 text-[var(--theme-500)]" />
      <h3 className="text-lg font-semibold text-slate-900">
        Odhadovaná hodnota vaší nemovitosti
      </h3>

      <RangeBar
        vykupMin={valuation.vykupMin}
        vykupMax={valuation.vykupMax}
        marketMin={valuation.min}
        marketMax={valuation.max}
      />

      <p className="mt-4 text-xs text-slate-400">
        Předběžný odhad — nezávazný. Konečná cena závisí na individuálním
        posouzení.
      </p>

      <GatedReportForm
        valuation={valuation}
        region={region}
        propertyType={propertyType}
      />
    </div>
  );
}

// --- Main component ---

interface ValuationCalculatorProps {
  regionKey?: string;
}

export function ValuationCalculator({
  regionKey,
}: ValuationCalculatorProps): ReactElement {
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState<string | null>(regionKey ?? null);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [area, setArea] = useState(80);
  const [condition, setCondition] = useState<PropertyCondition | null>(null);
  const [floor, setFloor] = useState<FloorCategory | null>(null);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);

  // If regionKey is provided, skip region step
  const hasRegion = Boolean(regionKey);
  const effectiveStep = hasRegion ? step + 1 : step;
  const totalSteps = hasRegion ? TOTAL_STEPS - 1 : TOTAL_STEPS;

  const computeResult = useCallback(() => {
    if (!region || !propertyType || !condition || !floor) return;
    const result = calculateValuation({
      region,
      type: propertyType,
      m2: area,
      condition,
      floor,
    });
    setValuation(result);
    pushValuationGtmEvent(result);
  }, [region, propertyType, area, condition, floor]);

  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const isResultStep = effectiveStep === TOTAL_STEPS - 1;

  return (
    <section className="py-16" id="odhad-ceny">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Zjistěte hodnotu vaší nemovitosti
        </h2>
        <p className="mt-2 text-center text-slate-600">
          5 otázek → okamžitý odhad tržní i výkupní ceny.
        </p>

        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <StepIndicator current={step} total={totalSteps} />

          <div className="min-h-[280px]">
            {/* Step 0: Region (skipped if regionKey provided) */}
            {effectiveStep === 0 && (
              <StepRegion
                selected={region}
                onSelect={(r) => {
                  setRegion(r);
                  setStep((s) => s + 1);
                }}
              />
            )}

            {/* Step 1: Property type */}
            {effectiveStep === 1 && (
              <StepType
                selected={propertyType}
                onSelect={(t) => {
                  setPropertyType(t);
                  setStep((s) => s + 1);
                }}
              />
            )}

            {/* Step 2: Area (m²) */}
            {effectiveStep === 2 && <StepArea area={area} onChange={setArea} />}

            {/* Step 3: Condition */}
            {effectiveStep === 3 && (
              <StepCondition
                selected={condition}
                onSelect={(c) => {
                  setCondition(c);
                  setStep((s) => s + 1);
                }}
              />
            )}

            {/* Step 4: Floor */}
            {effectiveStep === 4 && (
              <StepFloor
                selected={floor}
                onSelect={(f) => {
                  setFloor(f);
                  computeResult();
                  setStep((s) => s + 1);
                }}
              />
            )}

            {/* Step 5: Results */}
            {isResultStep && valuation && region && propertyType && (
              <StepResults
                valuation={valuation}
                region={region}
                propertyType={propertyType}
              />
            )}
          </div>

          {/* Navigation */}
          {!isResultStep && (
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
              {/* Next button only for area step (others auto-advance) */}
              {effectiveStep === 2 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => s + 1)}
                  className="inline-flex items-center gap-1 rounded-xl bg-[var(--theme-600)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--theme-700)]"
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
