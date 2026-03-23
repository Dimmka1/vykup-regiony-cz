"use client";

import { useState, useCallback } from "react";
import { Calculator } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { formatCzk } from "@/lib/format";
import type { ReactElement } from "react";

const MIN_PRICE = 1_000_000;
const MAX_PRICE = 20_000_000;
const STEP = 500_000;
const MONTHLY_RATE = 0.004;

export function RentCalculator(): ReactElement {
  const [price, setPrice] = useState(5_000_000);
  const [hasFired, setHasFired] = useState(false);

  const monthlyRent = Math.round(price * MONTHLY_RATE);

  const fireGtmEvent = useCallback(() => {
    if (hasFired) return;
    setHasFired(true);
    trackEvent("calculator_najem_used", {
      calculator_price: price,
      calculator_rent: monthlyRent,
    });
  }, [hasFired, price, monthlyRent]);

  const handleChange = (newPrice: number): void => {
    setPrice(newPrice);
    fireGtmEvent();
  };

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Calculator className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        </span>
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          Kalkulačka měsíčního nájmu
        </h3>
      </div>

      <label
        htmlFor="rent-calc-slider"
        className="block text-sm font-medium text-slate-700"
      >
        Cena nemovitosti
      </label>
      <output className="mt-1 block text-2xl font-extrabold text-slate-900">
        {formatCzk(price)}
      </output>

      <input
        id="rent-calc-slider"
        type="range"
        min={MIN_PRICE}
        max={MAX_PRICE}
        step={STEP}
        value={price}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="mt-4 w-full cursor-pointer accent-emerald-600"
        aria-label="Nastavte cenu nemovitosti pro výpočet nájmu"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{formatCzk(MIN_PRICE)}</span>
        <span>{formatCzk(MAX_PRICE)}</span>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center">
        <p className="text-sm text-slate-600">Orientační měsíční nájem</p>
        <p className="mt-1 text-3xl font-extrabold text-emerald-700">
          {formatCzk(monthlyRent)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Výpočet: {formatCzk(price)} × 0,4 % měsíčně
        </p>
      </div>
    </div>
  );
}
