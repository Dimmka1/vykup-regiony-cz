/**
 * Shared Czech number/currency formatting utilities.
 */

const CZK_FORMATTER = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
});

export function formatCzk(value: number): string {
  return CZK_FORMATTER.format(value);
}

export function parseInputValue(raw: string): number {
  const cleaned = raw.replace(/\s/g, "").replace(/,/g, ".");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}
