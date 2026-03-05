"use client";

import type { ReactElement } from "react";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const COOKIE_NAME = "vn_capacity_dismissed";
const COOKIE_TTL_MS = 24 * 60 * 60 * 1000;
const SCROLL_THRESHOLD = 0.3;

function getRegionFromCookieOrDefault(): string {
  if (typeof document === "undefined") return "vašem regionu";
  const match = document.cookie.match(/(?:^|;\s*)vn_region=([^;]*)/);
  if (match?.[1]) return decodeURIComponent(match[1]);
  const pathSegment = window.location.pathname.split("/")[1];
  if (pathSegment && pathSegment.length > 1) return pathSegment;
  return "vašem regionu";
}

function isDismissedCheck(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(COOKIE_NAME);
}

function setDismissedCookie(): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + COOKIE_TTL_MS).toUTCString();
  document.cookie = `${COOKIE_NAME}=1; path=/; expires=${expires}; SameSite=Lax`;
}

function getCapacityNumber(): number {
  const day = new Date().getDate();
  return (day % 4) + 2;
}

export function CapacityBanner(): ReactElement | null {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(isDismissedCheck());
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const scrollable = docHeight - viewportHeight;
    if (scrollable > 0 && scrollY / scrollable > SCROLL_THRESHOLD) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed, handleScroll]);

  useEffect(() => {
    if (visible && !dismissed) {
      trackEvent("capacity_banner_shown");
    }
  }, [visible, dismissed]);

  const handleDismiss = (): void => {
    setDismissedCookie();
    setDismissed(true);
    trackEvent("capacity_banner_dismissed");
  };

  if (!visible || dismissed) return null;

  const region = getRegionFromCookieOrDefault();
  const count = getCapacityNumber();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-300 bg-amber-50 px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <p className="text-sm text-amber-900">
          Tento měsíc můžeme vykoupit ještě{" "}
          <strong className="font-semibold">{count} nemovitostí</strong> v{" "}
          {region}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 rounded-full p-1 text-amber-600 transition hover:bg-amber-100 hover:text-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Zavřít"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
