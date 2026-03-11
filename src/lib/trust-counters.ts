/**
 * Trust counter configuration.
 *
 * Values are read from environment variables when available
 * (NEXT_PUBLIC_TRUST_*), falling back to sensible defaults.
 * This keeps numbers out of JSX and lets the site owner
 * change them via env / .env.local without touching code.
 */

export interface TrustCounterItem {
  /** Numeric value to animate to */
  readonly value: number;
  /** Suffix shown after the animated number (e.g. "+", "%", " Kč") */
  readonly suffix: string;
  /** Label below the number */
  readonly label: string;
  /** Optional prefix before the number */
  readonly prefix?: string;
}

function envInt(key: string, fallback: number): number {
  const raw = typeof process !== "undefined" ? (process.env[key] ?? "") : "";
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getTrustCounters(): readonly TrustCounterItem[] {
  return [
    {
      value: envInt("NEXT_PUBLIC_TRUST_PROPERTIES", 500),
      suffix: "+",
      label: "nemovitostí vykoupeno",
    },
    {
      value: 24,
      suffix: "h",
      label: "nabídka zdarma",
    },
    {
      value: 0,
      suffix: " Kč",
      label: "provize",
    },
    {
      value: envInt("NEXT_PUBLIC_TRUST_SATISFACTION", 98),
      suffix: "%",
      label: "spokojených klientů",
    },
  ] as const;
}
