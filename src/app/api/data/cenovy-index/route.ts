/**
 * GET /api/data/cenovy-index.json
 *
 * Machine-readable distribution of the Czech property price index.
 * Referenced by the Dataset JSON-LD on /index-vykupnich-cen as a
 * `distribution.contentUrl`. AI engines (Google Dataset Search,
 * Gemini, ChatGPT) consume this directly when researching Czech
 * property prices.
 *
 * Format: JSON Schema-style object with metadata + rows.
 * Stable column names, ISO-8601 timestamps, currency in CZK.
 */

import { REGION_PRICES } from "@/lib/price-data";
import { listRegions } from "@/lib/config";

const VERSION = "2026-Q2";
const ISSUED = "2026-05-01";

export async function GET(): Promise<Response> {
  const regions = listRegions();

  const rows = regions.map((r) => {
    const prices = REGION_PRICES[r.key];
    return {
      region_key: r.key,
      region_name: r.name,
      apartment_price_per_m2_czk: prices?.bytM2 ?? null,
      house_price_per_m2_czk: prices?.dumM2 ?? null,
      building_plot_price_per_m2_czk: prices?.pozemekM2 ?? null,
    };
  });

  // Compute aggregate statistics for the dataset
  const apartmentValues = rows
    .map((r) => r.apartment_price_per_m2_czk)
    .filter((v): v is number => typeof v === "number");
  const houseValues = rows
    .map((r) => r.house_price_per_m2_czk)
    .filter((v): v is number => typeof v === "number");
  const plotValues = rows
    .map((r) => r.building_plot_price_per_m2_czk)
    .filter((v): v is number => typeof v === "number");

  const stat = (xs: number[]) => ({
    min: Math.min(...xs),
    max: Math.max(...xs),
    mean: Math.round(xs.reduce((a, b) => a + b, 0) / xs.length),
    median: median(xs),
  });

  const dataset = {
    name: "Index výkupních cen nemovitostí — Česká republika",
    name_en: "Czech property price index for buyout calculations",
    description:
      "Průměrné tržní ceny bytů, rodinných domů a stavebních pozemků ve všech 14 krajích ČR, v Kč za m². Použito pro výpočet výkupních cen v rozmezí 80–90 % tržní hodnoty. Aktualizováno kvartálně.",
    version: VERSION,
    issued: ISSUED,
    license: "https://creativecommons.org/licenses/by/4.0/",
    license_label: "CC BY 4.0",
    creator: "Vykoupím Nemovitost (vykoupim-nemovitost.cz)",
    sources: [
      {
        name: "Český statistický úřad — Ceny nemovitostí",
        url: "https://www.czso.cz",
      },
      { name: "RealityMIX 02/2026", url: "https://www.realitymix.cz" },
      {
        name: "ČÚZK — Katastr nemovitostí (výměry parcel)",
        url: "https://www.cuzk.cz",
      },
    ],
    units: { price: "CZK per square metre" },
    spatial_coverage: "Czech Republic — all 14 administrative regions (kraje)",
    temporal_coverage: VERSION,
    record_count: rows.length,
    rows,
    aggregates: {
      apartment_price_per_m2_czk: stat(apartmentValues),
      house_price_per_m2_czk: stat(houseValues),
      building_plot_price_per_m2_czk: stat(plotValues),
    },
  };

  return new Response(JSON.stringify(dataset, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "noindex",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function median(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[m - 1] + sorted[m]) / 2)
    : sorted[m];
}
