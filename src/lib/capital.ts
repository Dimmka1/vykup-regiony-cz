/**
 * Vlastní kapitál configuration via NEXT_PUBLIC_CAPITAL_AMOUNT env var.
 *
 * When set (e.g. "15"), displays "Vlastní kapitál 15 mil. Kč" across the site.
 * When empty or unset, all capital-related badges/sections are hidden.
 */

const CAPITAL_UNIT = "mil. Kč";

export function getCapitalAmount(): string {
  return process.env.NEXT_PUBLIC_CAPITAL_AMOUNT?.trim() ?? "";
}

export function isCapitalEnabled(): boolean {
  return getCapitalAmount().length > 0;
}

export function formatCapitalLabel(): string {
  const amount = getCapitalAmount();
  if (!amount) {
    return "";
  }
  return `Vlastní kapitál ${amount} ${CAPITAL_UNIT}`;
}
