"use client";

import dynamic from "next/dynamic";
import { useIdleLoad } from "@/hooks/use-idle-load";

const FloatingDesktopCta = dynamic(
  () =>
    import("@/components/floating-desktop-cta").then(
      (mod) => mod.FloatingDesktopCta,
    ),
  { ssr: false },
);

export function LazyFloatingDesktopCta() {
  const ready = useIdleLoad();
  if (!ready) return null;
  return <FloatingDesktopCta />;
}
