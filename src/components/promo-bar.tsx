"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type PromoConfig, isPromoActive } from "@/lib/promo";
import { trackEvent } from "@/lib/analytics";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function computeTimeLeft(expiresAt: string): TimeLeft | null {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function isDismissed(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(`promo_dismissed_${id}`) === "1";
  } catch {
    return false;
  }
}

function dismiss(id: string): void {
  try {
    sessionStorage.setItem(`promo_dismissed_${id}`, "1");
  } catch {
    // storage full or blocked
  }
}

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(computeTimeLeft(expiresAt));
    const timer = setInterval(() => {
      const tl = computeTimeLeft(expiresAt);
      setTimeLeft(tl);
      if (!tl) clearInterval(timer);
    }, 60_000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) return null;

  const parts: string[] = [];
  if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
  parts.push(`${timeLeft.hours}h`);
  parts.push(`${timeLeft.minutes}m`);

  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold tabular-nums backdrop-blur-sm sm:text-sm">
      <svg
        className="h-3 w-3 sm:h-3.5 sm:w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
      {parts.join(" : ")}
    </span>
  );
}

export function PromoBar() {
  const [promo, setPromo] = useState<PromoConfig | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const impressionFired = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/promo", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: PromoConfig) => {
        if (!cancelled && isPromoActive(data) && !isDismissed(data.id)) {
          setPromo(data);
          requestAnimationFrame(() => setVisible(true));
        }
      })
      .catch(() => {
        // silently ignore — no promo
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fire impression event once
  useEffect(() => {
    if (promo && visible && !impressionFired.current) {
      impressionFired.current = true;
      trackEvent("promo_impression" as Parameters<typeof trackEvent>[0], {
        campaign_id: promo.id,
      });
    }
  }, [promo, visible]);

  const handleDismiss = useCallback(() => {
    if (promo) {
      dismiss(promo.id);
      setDismissed(true);
    }
  }, [promo]);

  const handleCtaClick = useCallback(() => {
    if (promo) {
      trackEvent("promo_click" as Parameters<typeof trackEvent>[0], {
        campaign_id: promo.id,
      });
    }
  }, [promo]);

  if (!promo || dismissed) return null;

  const bgGradient =
    promo.color ??
    "linear-gradient(135deg, #ef4444 0%, #f97316 50%, #eab308 100%)";
  const bgStyle = bgGradient.includes("gradient")
    ? { backgroundImage: bgGradient }
    : { backgroundColor: bgGradient };

  return (
    <div
      role="banner"
      aria-label="Promočni akce"
      className={`relative z-50 overflow-hidden text-white shadow-lg transition-all duration-500 ease-out ${
        visible
          ? "max-h-32 translate-y-0 opacity-100"
          : "max-h-0 -translate-y-full opacity-0"
      }`}
      style={bgStyle}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:py-2.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="truncate text-sm font-bold sm:text-base">
            {promo.title}
          </span>
          <span className="hidden text-xs opacity-90 sm:inline sm:text-sm">
            {promo.subtitle}
          </span>
          <Countdown expiresAt={promo.expiresAt} />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={promo.ctaUrl}
            onClick={handleCtaClick}
            className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md transition-transform hover:scale-105 sm:px-4 sm:py-1.5 sm:text-sm"
          >
            {promo.ctaText}
          </a>

          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full p-1 opacity-70 transition-opacity hover:opacity-100"
            aria-label="Zavřít promočni banner"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
