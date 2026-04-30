"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_THRESHOLD = 300;
const FORM_SECTION_ID = "kontakt";

interface StickyMobileCTAProps {
  regionName: string;
}

export function StickyMobileCTA({
  regionName,
}: StickyMobileCTAProps): ReactElement | null {
  const [isVisible, setIsVisible] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Track scroll position ─────────────────────────── */
  useEffect(() => {
    function handleScroll(): void {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    }

    // Check initial position (page might already be scrolled on mount)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Observe form section visibility ───────────────── */
  useEffect(() => {
    const formEl = document.getElementById(FORM_SECTION_ID);
    if (!formEl) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setFormInView(entry.isIntersecting);
        }
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(formEl);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  /* ── Handle CTA click ─────────────────────────────── */
  const handleClick = useCallback((): void => {
    trackEvent("sticky_cta_click", { region: regionName });

    const formEl = document.getElementById(FORM_SECTION_ID);
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [regionName]);

  const show = isVisible && !formInView;

  return (
    <div
      role="complementary"
      aria-label="Rychlá poptávka"
      className={`fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        className="cta-glow btn-ripple mx-auto flex min-h-[48px] w-full max-w-lg items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--theme-600)] to-[var(--theme-700)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition hover:from-[var(--theme-500)] hover:to-[var(--theme-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)] focus-visible:ring-offset-2 active:scale-[0.98]"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Získat nabídku zdarma
      </button>
    </div>
  );
}
