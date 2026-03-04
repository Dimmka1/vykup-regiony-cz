"use client";

import { useEffect, useState } from "react";
import {
  ZALOHA_COOKIE_NAME,
  ZALOHA_BADGE_TEXT,
  isValidZalohaVariant,
  type ZalohaVariant,
} from "@/lib/ab-variants";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)",
    ),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Renders the záloha hero badge text based on the A/B cookie (VR-149).
 * Falls back to variant A (control) on SSR and before hydration.
 */
export function ZalohaBadge(): React.ReactElement {
  const [variant, setVariant] = useState<ZalohaVariant>("A");

  useEffect(() => {
    const raw = getCookie(ZALOHA_COOKIE_NAME);
    if (isValidZalohaVariant(raw)) {
      setVariant(raw);
    }
  }, []);

  return <>{ZALOHA_BADGE_TEXT[variant]}</>;
}
