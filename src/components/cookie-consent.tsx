"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie-consent";

type ConsentValue = "accepted" | "rejected";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      // Focus the banner for screen readers
      bannerRef.current?.focus();
    }
  }, [visible]);

  const handleConsent = useCallback((value: ConsentValue) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // Restore focus
    previousFocusRef.current?.focus();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 p-4 pb-[max(1rem,calc(env(safe-area-inset-bottom)+4.5rem))] lg:pb-4"
      role="dialog"
      aria-label="Souhlas s cookies"
      ref={bannerRef}
      tabIndex={-1}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-gray-700">
          Tento web používá cookies pro zajištění nejlepšího zážitku.
          Pokračováním souhlasíte s použitím cookies.{" "}
          <Link
            href="/ochrana-osobnich-udaju"
            className="text-brand-700 underline hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Více informací
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => handleConsent("rejected")}
            className="min-h-[44px] rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Odmítnout
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="min-h-[44px] rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            Přijmout
          </button>
        </div>
      </div>
    </div>
  );
}
