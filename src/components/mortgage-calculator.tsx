"use client";

import { useState, useMemo, type ReactElement } from "react";
import Link from "next/link";
import { Calculator, TrendingUp, AlertTriangle } from "lucide-react";

interface CalculatorResult {
  oldPayment: number;
  newPayment: number;
  difference: number;
  percentageIncrease: number;
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseNumericInput(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * Calculate monthly annuity payment.
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0 || annualRate <= 0 || years <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = years * 12;
  const factor = Math.pow(1 + monthlyRate, totalPayments);
  return (principal * monthlyRate * factor) / (factor - 1);
}

const DEFAULT_REMAINING_YEARS = 20;

export function MortgageCalculator(): ReactElement {
  const [rawPrincipal, setRawPrincipal] = useState("");
  const [rawOldRate, setRawOldRate] = useState("");
  const [rawNewRate, setRawNewRate] = useState("");

  const principal = parseNumericInput(rawPrincipal);
  const oldRate = parseNumericInput(rawOldRate);
  const newRate = parseNumericInput(rawNewRate);

  const result: CalculatorResult | null = useMemo(() => {
    if (principal <= 0 || oldRate <= 0 || newRate <= 0) return null;

    const oldPayment = calculateMonthlyPayment(
      principal,
      oldRate,
      DEFAULT_REMAINING_YEARS,
    );
    const newPayment = calculateMonthlyPayment(
      principal,
      newRate,
      DEFAULT_REMAINING_YEARS,
    );
    const difference = newPayment - oldPayment;
    const percentageIncrease =
      oldPayment > 0 ? (difference / oldPayment) * 100 : 0;

    return {
      oldPayment: Math.round(oldPayment),
      newPayment: Math.round(newPayment),
      difference: Math.round(difference),
      percentageIncrease: Math.round(percentageIncrease),
    };
  }, [principal, oldRate, newRate]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Calculator className="h-5 w-5 text-amber-600" />
        </span>
        <h3 className="text-xl font-bold text-slate-900">
          Kalkulačka: nová vs. stará splátka
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="mortgage-principal"
            className="block text-sm font-medium text-slate-700"
          >
            Zbývající jistina hypotéky
          </label>
          <div className="relative mt-1">
            <input
              id="mortgage-principal"
              type="text"
              inputMode="numeric"
              placeholder="např. 2 500 000"
              value={rawPrincipal}
              onChange={(e) => setRawPrincipal(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              Kč
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="mortgage-old-rate"
            className="block text-sm font-medium text-slate-700"
          >
            Stará úroková sazba
          </label>
          <div className="relative mt-1">
            <input
              id="mortgage-old-rate"
              type="text"
              inputMode="decimal"
              placeholder="např. 2,5"
              value={rawOldRate}
              onChange={(e) => setRawOldRate(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              %
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="mortgage-new-rate"
            className="block text-sm font-medium text-slate-700"
          >
            Nová úroková sazba
          </label>
          <div className="relative mt-1">
            <input
              id="mortgage-new-rate"
              type="text"
              inputMode="decimal"
              placeholder="např. 5,5"
              value={rawNewRate}
              onChange={(e) => setRawNewRate(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-10 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              %
            </span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Kalkulace počítá s anuitní splátkou a zbývající dobou splatnosti 20 let.
      </p>

      {result !== null && (
        <div className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Stará splátka
              </p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {formatCzk(result.oldPayment)}
              </p>
              <p className="text-xs text-slate-400">měsíčně</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Nová splátka
              </p>
              <p className="mt-1 text-xl font-bold text-red-600">
                {formatCzk(result.newPayment)}
              </p>
              <p className="text-xs text-slate-400">měsíčně</p>
            </div>
            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-red-600">
                Nárůst splátky
              </p>
              <p className="mt-1 text-xl font-bold text-red-700">
                +{formatCzk(result.difference)}
              </p>
              <p className="text-xs text-red-500">
                +{result.percentageIncrease} % měsíčně
              </p>
            </div>
          </div>

          {result.difference > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">
                    Ročně navíc: {formatCzk(result.difference * 12)}
                  </p>
                  <p className="mt-1 text-sm text-amber-700">
                    Pokud nové splátky nezvládáte, nemusíte čekat na exekuci.
                    Existují řešení — refinancování, prodej nebo rychlý výkup
                    nemovitosti.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-emerald-50 p-5 text-center">
            <p className="text-sm font-medium text-emerald-800">
              Pokud nestiháte splácet, vykoupíme nemovitost do 48 hodin
            </p>
            <Link
              href="/#kontakt"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
            >
              <TrendingUp className="h-4 w-4" />
              Získat nezávaznou nabídku
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
