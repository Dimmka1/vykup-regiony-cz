"use client";

import { useIdleLoad } from "@/hooks/use-idle-load";
import type { ReactNode } from "react";

interface IdleLoadWrapperProps {
  children: ReactNode;
  timeoutMs?: number;
}

/**
 * Defers rendering of children until the browser is idle.
 * Used to keep non-critical UI (popups, consent bars, tracking)
 * off the initial critical path, improving INP/TBT.
 */
export function IdleLoadWrapper({
  children,
  timeoutMs = 2000,
}: IdleLoadWrapperProps) {
  const ready = useIdleLoad(timeoutMs);
  if (!ready) return null;
  return <>{children}</>;
}
