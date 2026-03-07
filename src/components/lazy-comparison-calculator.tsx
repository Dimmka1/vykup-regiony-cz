"use client";

import dynamic from "next/dynamic";

const ComparisonCalculator = dynamic(
  () =>
    import("@/components/comparison-calculator").then(
      (mod) => mod.ComparisonCalculator,
    ),
  { ssr: false },
);

/**
 * Lazy-loaded ComparisonCalculator — code-split and deferred from initial bundle.
 * The component is below the fold so it doesn't affect INP-critical interactions.
 */
export function LazyComparisonCalculator() {
  return <ComparisonCalculator />;
}
