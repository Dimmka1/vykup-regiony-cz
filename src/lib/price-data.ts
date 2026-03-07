import fs from "fs";
import path from "path";

interface PriceResearchData {
  lastUpdated?: string;
  date: string;
  [key: string]: unknown;
}

let _cached: PriceResearchData | null = null;

function loadPriceData(): PriceResearchData {
  if (_cached) return _cached;
  const filePath = path.join(process.cwd(), "PRICE_RESEARCH.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _cached = JSON.parse(raw) as PriceResearchData;
  return _cached;
}

/**
 * Returns the `lastUpdated` ISO string from PRICE_RESEARCH.json.
 * Falls back to the `date` field if `lastUpdated` is missing.
 */
export function getPriceLastUpdated(): string {
  const data = loadPriceData();
  return data.lastUpdated ?? data.date;
}

/**
 * Returns a formatted Czech date string like "1. března 2026".
 */
export function formatCzechDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
