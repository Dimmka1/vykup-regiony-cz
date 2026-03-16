"use client";

import { useState, type ReactElement } from "react";
import { Calculator } from "lucide-react";

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseInputValue(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

const TAX_RATE = 0.15;

export function TaxCalculator(): ReactElement {
  const [rawSellPrice, setRawSellPrice] = useState("");
  const [rawBuyPrice, setRawBuyPrice] = useState("");
  const [ownershipYears, setOwnershipYears] = useState("");
  const [acquiredBefore2021, setAcquiredBefore2021] = useState(false);

  const sellPrice = parseInputValue(rawSellPrice);
  const buyPrice = parseInputValue(rawBuyPrice);
  const years = parseInputValue(ownershipYears);

  const exemptionLimit = acquiredBefore2021 ? 5 : 10;
  const isExempt = years >= exemptionLimit;
  const profit = Math.max(sellPrice - buyPrice, 0);
  const tax = isExempt ? 0 : Math.round(profit * TAX_RATE);

  const hasInput = sellPrice > 0 || buyPrice > 0 || ownershipYears !== "";

  return (
    <div className="my-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
          <Calculator className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Kalkulačka daně z prodeje nemovitosti
          </h3>
          <p className="text-sm text-slate-500">
            Spočítejte si orientační výši daně
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="tax-sell-price"
            className="block text-sm font-medium text-slate-700"
          >
            Prodejní cena
          </label>
          <div className="relative mt-1">
            <input
              id="tax-sell-price"
              type="text"
              inputMode="numeric"
              placeholder="např. 4 000 000"
              value={rawSellPrice}
              onChange={(e) => setRawSellPrice(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              Kč
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="tax-buy-price"
            className="block text-sm font-medium text-slate-700"
          >
            Původní pořizovací cena
          </label>
          <div className="relative mt-1">
            <input
              id="tax-buy-price"
              type="text"
              inputMode="numeric"
              placeholder="např. 2 500 000"
              value={rawBuyPrice}
              onChange={(e) => setRawBuyPrice(e.target.value)}
              className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
              Kč
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="tax-years"
            className="block text-sm font-medium text-slate-700"
          >
            Doba vlastnictví (roky)
          </label>
          <input
            id="tax-years"
            type="text"
            inputMode="numeric"
            placeholder="např. 3"
            value={ownershipYears}
            onChange={(e) => setOwnershipYears(e.target.value)}
            className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={acquiredBefore2021}
              onChange={(e) => setAcquiredBefore2021(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            Nemovitost nabyta před rokem 2021
          </label>
        </div>
      </div>

      {hasInput && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          {isExempt ? (
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-700">
                ✅ Osvobozeno od daně
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                Vlastníte nemovitost déle než {exemptionLimit} let — prodej je
                osvobozen od daně z příjmů.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Zisk z prodeje:</span>
                <span className="font-medium text-slate-900">
                  {formatCzk(profit)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Sazba daně:</span>
                <span className="font-medium text-slate-900">15 %</span>
              </div>
              <div className="border-t border-emerald-200 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">
                    Odhadovaná daň:
                  </span>
                  <span className="text-xl font-bold text-emerald-700">
                    {formatCzk(tax)}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                * Orientační výpočet. Skutečná daňová povinnost závisí na
                individuálních okolnostech. Doporučujeme konzultaci s daňovým
                poradcem.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
