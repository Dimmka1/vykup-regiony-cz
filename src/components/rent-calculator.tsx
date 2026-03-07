"use client";

import { useState, useMemo, type ReactElement } from "react";
import { Calculator, TrendingDown } from "lucide-react";

const REGIONS = [
  { key: "praha", name: "Praha", pricePerM2: 350 },
  { key: "stredocesky-kraj", name: "Středočeský kraj", pricePerM2: 230 },
  { key: "jihocesky-kraj", name: "Jihočeský kraj", pricePerM2: 190 },
  { key: "plzensky-kraj", name: "Plzeňský kraj", pricePerM2: 200 },
  { key: "karlovarsky-kraj", name: "Karlovarský kraj", pricePerM2: 170 },
  { key: "ustecky-kraj", name: "Ústecký kraj", pricePerM2: 160 },
  { key: "liberecky-kraj", name: "Liberecký kraj", pricePerM2: 195 },
  {
    key: "kralovehradecky-kraj",
    name: "Královéhradecký kraj",
    pricePerM2: 195,
  },
  { key: "pardubicky-kraj", name: "Pardubický kraj", pricePerM2: 185 },
  { key: "vysocina", name: "Vysočina", pricePerM2: 175 },
  { key: "jihomoravsky-kraj", name: "Jihomoravský kraj", pricePerM2: 280 },
  { key: "olomoucky-kraj", name: "Olomoucký kraj", pricePerM2: 195 },
  {
    key: "moravskoslezsky-kraj",
    name: "Moravskoslezský kraj",
    pricePerM2: 180,
  },
  { key: "zlinsky-kraj", name: "Zlínský kraj", pricePerM2: 190 },
] as const;

/** Dům je typicky o 15 % levnější na m² nájmu než byt */
const HOUSE_DISCOUNT = 0.85;

/**
 * Orientační měsíční splátka hypotéky.
 * Předpoklad: LTV 80 %, úrok 5,5 % p.a., 25 let.
 */
function estimateMortgage(rentPerMonth: number): number {
  return Math.round(rentPerMonth * 1.4);
}

function formatCzk(value: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
}

export function RentCalculator(): ReactElement {
  const [propertyType, setPropertyType] = useState<"byt" | "dum">("byt");
  const [area, setArea] = useState<string>("60");
  const [regionKey, setRegionKey] = useState<string>("praha");

  const areaNum = useMemo(() => {
    const parsed = parseInt(area, 10);
    return Number.isFinite(parsed) && parsed > 0 && parsed <= 1000 ? parsed : 0;
  }, [area]);

  const selectedRegion = useMemo(
    () => REGIONS.find((r) => r.key === regionKey) ?? REGIONS[0],
    [regionKey],
  );

  const monthlyRent = useMemo(() => {
    if (areaNum === 0) return 0;
    const base = selectedRegion.pricePerM2 * areaNum;
    return Math.round(propertyType === "dum" ? base * HOUSE_DISCOUNT : base);
  }, [areaNum, selectedRegion, propertyType]);

  const mortgagePayment = useMemo(
    () => (monthlyRent > 0 ? estimateMortgage(monthlyRent) : 0),
    [monthlyRent],
  );

  const savings = mortgagePayment - monthlyRent;

  return (
    <section className="bg-white py-16" id="kalkulacka">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex items-center gap-3">
          <Calculator className="h-7 w-7 text-emerald-600" />
          <h2 className="text-2xl font-bold text-slate-900">
            Kolik budu platit nájem?
          </h2>
        </div>
        <p className="mt-2 text-slate-600">
          Orientační kalkulačka měsíčního nájmu po zpětném prodeji. Zadejte
          parametry vaší nemovitosti.
        </p>

        {/* Inputs */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div>
            <label
              htmlFor="calc-type"
              className="block text-sm font-medium text-slate-700"
            >
              Typ nemovitosti
            </label>
            <select
              id="calc-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as "byt" | "dum")}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="byt">Byt</option>
              <option value="dum">Dům</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="calc-area"
              className="block text-sm font-medium text-slate-700"
            >
              Plocha (m²)
            </label>
            <input
              id="calc-area"
              type="number"
              inputMode="numeric"
              min={10}
              max={1000}
              placeholder="60"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label
              htmlFor="calc-region"
              className="block text-sm font-medium text-slate-700"
            >
              Kraj
            </label>
            <select
              id="calc-region"
              value={regionKey}
              onChange={(e) => setRegionKey(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              {REGIONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {monthlyRent > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <p className="text-sm font-medium text-emerald-700">
                Orientační měsíční nájem
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-800">
                {formatCzk(monthlyRent)}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                {propertyType === "byt" ? "Byt" : "Dům"} {areaNum}&nbsp;m² ·{" "}
                {selectedRegion.name}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-600">
                Srovnání s hypotékou
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-800">
                {formatCzk(mortgagePayment)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Splátka hypotéky (5,5&nbsp;%, 25 let, 80&nbsp;% LTV)
              </p>
            </div>

            {savings > 0 && (
              <div className="sm:col-span-2">
                <div className="flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 px-6 py-4">
                  <TrendingDown className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-semibold text-emerald-800">
                    Se zpětným nájmem ušetříte měsíčně cca{" "}
                    <span className="text-lg">{formatCzk(savings)}</span> oproti
                    hypotéce
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="mt-6 text-xs text-slate-400">
          * Kalkulace je orientační a slouží k prvnímu odhadu. Konkrétní
          podmínky nájmu závisí na stavu nemovitosti, lokalitě a dalších
          faktorech. Pro přesnou nabídku nás kontaktujte.
        </p>
      </div>
    </section>
  );
}
