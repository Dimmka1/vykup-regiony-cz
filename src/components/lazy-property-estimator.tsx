"use client";

import dynamic from "next/dynamic";

const PropertyEstimator = dynamic(
  () =>
    import("@/components/property-estimator").then(
      (mod) => mod.PropertyEstimator,
    ),
  { ssr: false },
);

interface Props {
  regionKey: string;
}

/**
 * Lazy-loaded PropertyEstimator — code-split and deferred from initial bundle.
 * Heavy component (431 lines) kept off the critical path.
 */
export function LazyPropertyEstimator({ regionKey }: Props) {
  return <PropertyEstimator regionKey={regionKey} />;
}
