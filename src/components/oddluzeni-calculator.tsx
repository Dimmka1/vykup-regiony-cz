"use client";

import { useState, type ReactElement } from "react";

const DRAZBA_NAKLADY_PCT = 0.18;
const VYKUP_PCT_MIN = 0.8;
const VYKUP_PCT_MAX = 0.9;

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseInput(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function OddluzeniCalculator(): ReactElement {
  const [rawDluh, setRawDluh] = useState("");
  const [rawHodnota, setRawHodnota] = useState("");

  const dluh = parseInput(rawDluh);
  const hodnota = parseInput(rawHodnota);

  const drazbaCisty = Math.max(
    0,
    Math.round(hodnota * (1 - DRAZBA_NAKLADY_PCT) - dluh),
  );
  const vykupMin = Math.max(0, Math.round(hodnota * VYKUP_PCT_MIN - dluh));
  const vykupMax = Math.max(0, Math.round(hodnota * VYKUP_PCT_MAX - dluh));

  const hasInput = hodnota > 0;
  const uspora = vykupMin - drazbaCisty;

  return (
    <section className="py-16" id="kalkulacka">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Kalkulačka: Výkup vs. dražba při oddlužení
        </h2>
        <p className="mt-2 text-slate-600">
          Zadejte výši dluhu a odhadovanou hodnotu nemovitosti. Porovnáme, kolik
          vám zbude při výkupu oproti nucené dražbě.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="oddluzeni-dluh"
              className="block text-sm font-medium text-slate-700"
            >
              Celková výše dluhu
            </label>
            <div className="relative mt-1">
              <input
                id="oddluzeni-dluh"
                type="text"
                inputMode="numeric"
                placeholder="např. 800 000"
                value={rawDluh}
                onChange={(e) => setRawDluh(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                Kč
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="oddluzeni-hodnota"
              className="block text-sm font-medium text-slate-700"
            >
              Odhadovaná hodnota nemovitosti
            </label>
            <div className="relative mt-1">
              <input
                id="oddluzeni-hodnota"
                type="text"
                inputMode="numeric"
                placeholder="např. 3 000 000"
                value={rawHodnota}
                onChange={(e) => setRawHodnota(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 px-4 py-3 pr-14 text-lg font-semibold text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                Kč
              </span>
            </div>
          </div>
        </div>

        {hasInput && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-red-700">
                Nucená dražba
              </h3>
              <p className="mt-3 text-2xl font-bold text-red-800">
                {formatCzk(drazbaCisty)}
              </p>
              <p className="mt-1 text-sm text-red-600">
                zbyde vám po uhrazení dluhu
              </p>
              <ul className="mt-3 space-y-1 text-xs text-red-600">
                <li>• Náklady dražby ~18 % z hodnoty</li>
                <li>• Proces trvá 6–12 měsíců</li>
                <li>• Nemáte kontrolu nad cenou</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Přímý výkup
              </h3>
              <p className="mt-3 text-2xl font-bold text-emerald-800">
                {formatCzk(vykupMin)} – {formatCzk(vykupMax)}
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                zbyde vám po uhrazení dluhu
              </p>
              <ul className="mt-3 space-y-1 text-xs text-emerald-600">
                <li>• 80–90 % tržní hodnoty</li>
                <li>• Peníze do 48 hodin</li>
                <li>• Dluhy uhradíme za vás</li>
              </ul>
            </div>
          </div>
        )}

        {hasInput && uspora > 0 && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-sm text-emerald-700">
              S výkupem získáte navíc minimálně
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-800 sm:text-3xl">
              {formatCzk(uspora)}
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              oproti nucené dražbě — a peníze dostanete do 48 hodin
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
