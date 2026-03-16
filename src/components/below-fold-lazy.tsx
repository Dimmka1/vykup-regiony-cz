"use client";

import dynamic from "next/dynamic";
import type { BelowFoldProps } from "@/components/below-fold-sections";

const BelowFoldSections = dynamic(
  () =>
    import("@/components/below-fold-sections").then((m) => m.BelowFoldSections),
  { ssr: false },
);

export function BelowFoldLazy(props: BelowFoldProps) {
  return <BelowFoldSections {...props} />;
}
