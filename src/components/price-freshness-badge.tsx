import { getPriceLastUpdated, formatCzechDate } from "@/lib/price-data";

/**
 * Small, unobtrusive badge showing when prices were last updated.
 * Rendered server-side — reads from PRICE_RESEARCH.json at build time.
 */
export function PriceFreshnessBadge() {
  const lastUpdated = getPriceLastUpdated();
  const formattedDate = formatCzechDate(lastUpdated);

  return (
    <p className="mt-2 text-center text-xs text-slate-400">
      Ceny aktualizovány: {formattedDate}
    </p>
  );
}
