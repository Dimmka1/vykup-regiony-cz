"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * VR-195: Client-side retargeting audience tracker.
 * Fires:
 *  - return_visitor  (localStorage flag)
 *  - high_value_visitor (≥3 pages via sessionStorage OR >2min on site)
 */
export function RetargetingTracker(): null {
  useEffect(() => {
    /* ── return_visitor ─────────────────────────── */
    try {
      const visited = localStorage.getItem("vr_visited");
      if (visited) {
        trackEvent("return_visitor", {});
      }
      localStorage.setItem("vr_visited", "1");
    } catch {
      /* private browsing */
    }

    /* ── high_value_visitor: page count ─────────── */
    let fired = false;
    try {
      const key = "vr_page_count";
      const count = Number(sessionStorage.getItem(key) || "0") + 1;
      sessionStorage.setItem(key, String(count));
      if (count >= 3) {
        trackEvent("high_value_visitor", { trigger: "pages", pages: count });
        fired = true;
      }
    } catch {
      /* noop */
    }

    /* ── high_value_visitor: time on site (>2min) ─ */
    if (!fired) {
      const timer = setTimeout(() => {
        trackEvent("high_value_visitor", { trigger: "time", seconds: 120 });
      }, 120_000);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
