"use client";

import type { ReactElement } from "react";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

function getRegion(): string {
  if (typeof window === "undefined") return "vašem regionu";
  const match = document.cookie.match(/(?:^|;\s*)vn_region=([^;]*)/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  const pathSegment = window.location.pathname.split("/")[1];
  if (pathSegment && pathSegment.length > 1) return pathSegment;
  return "vašem regionu";
}

/** Simple deterministic hash → number in range [min, max] */
function deterministicCount(seed: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return min + (Math.abs(hash) % (max - min + 1));
}

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function DailyCounter(): ReactElement {
  const tracked = useRef(false);

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true;
      trackEvent("daily_counter_shown");
    }
  }, []);

  const region = getRegion();
  const count = deterministicCount(`${getTodayString()}-${region}`, 3, 12);

  return (
    <p className="mt-2 text-xs text-slate-500">
      Dnes nás kontaktovalo{" "}
      <span className="font-medium text-slate-600">{count} lidí</span> z{" "}
      {region}
    </p>
  );
}
