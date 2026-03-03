"use client";

import { useEffect } from "react";
import { AB_COOKIE_NAME } from "@/lib/ab-variants";

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function ABVariantTracker(): null {
  useEffect(() => {
    const variant = getCookie(AB_COOKIE_NAME) ?? "A";
    window.dataLayer = window.dataLayer ?? [];
    (window.dataLayer as Record<string, unknown>[]).push({
      ab_variant: variant,
    });
  }, []);

  return null;
}
