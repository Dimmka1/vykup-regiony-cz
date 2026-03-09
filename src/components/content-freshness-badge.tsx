import { RefreshCw } from "lucide-react";

/**
 * Visual badge indicating content freshness.
 * Used on evergreen pages to signal recent updates to users and crawlers.
 *
 * @example
 * <ContentFreshnessBadge date="2026-03-01" />
 */
interface ContentFreshnessBadgeProps {
  /** ISO date string (YYYY-MM-DD) of the last content update */
  date?: string;
  /** Optional className override */
  className?: string;
}

const MONTH_NAMES_CS: Record<number, string> = {
  1: "leden",
  2: "únor",
  3: "březen",
  4: "duben",
  5: "květen",
  6: "červen",
  7: "červenec",
  8: "srpen",
  9: "září",
  10: "říjen",
  11: "listopad",
  12: "prosinec",
};

function formatCzechDate(isoDate: string): string {
  const d = new Date(isoDate);
  const month = MONTH_NAMES_CS[d.getUTCMonth() + 1] ?? "";
  return `${month} ${d.getUTCFullYear()}`;
}

export function ContentFreshnessBadge({
  date = "2026-03-01",
  className = "",
}: ContentFreshnessBadgeProps) {
  const label = `Aktualizováno ${formatCzechDate(date)}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 ${className}`}
    >
      <RefreshCw className="h-3 w-3" aria-hidden="true" />
      <time dateTime={date}>{label}</time>
    </span>
  );
}
