"use client";

import { useEffect } from "react";
import { ZALOHA_COOKIE_NAME, isValidZalohaVariant } from "@/lib/ab-variants";

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Pushes zaloha_variant to GTM dataLayer on mount (VR-149).
 * AC-2: GTM dataLayer event `ab_variant` with `zaloha_variant: A|B|C`
 */
export function ZalohaVariantTracker(): null {
  useEffect(() => {
    const raw = getCookie(ZALOHA_COOKIE_NAME);
    const variant = isValidZalohaVariant(raw) ? raw : "A";

    window.dataLayer = window.dataLayer ?? [];
    (window.dataLayer as Record<string, unknown>[]).push({
      event: "ab_variant",
      zaloha_variant: variant,
    });
  }, []);

  return null;
}
