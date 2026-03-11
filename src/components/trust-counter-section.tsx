"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TrustCounterItem } from "@/lib/trust-counters";

/* ------------------------------------------------------------------ */
/*  Single animated counter (IntersectionObserver + rAF, no libs)     */
/* ------------------------------------------------------------------ */

function CounterValue({
  item,
  duration = 2000,
}: {
  readonly item: TrustCounterItem;
  readonly duration?: number;
}): React.ReactElement {
  const { value: target, suffix, prefix = "" } = item;
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [current, setCurrent] = useState(target); // SSR: show final value

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // "0 Kč" — nothing to animate, just show 0
    if (target === 0) {
      setCurrent(0);
      return;
    }

    const startTime = performance.now();

    function step(now: number): void {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    setCurrent(0);
    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Prefer reduced-motion: skip animation
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setCurrent(target);
      hasAnimated.current = true;
      return;
    }

    // Fallback: animate after 3 s even if IntersectionObserver misses
    const timeout = setTimeout(() => {
      animate();
    }, 3000);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          clearTimeout(timeout);
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [animate, target]);

  return (
    <span ref={ref}>
      {prefix}
      {current.toLocaleString("cs-CZ")}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper (responsive grid)                                  */
/* ------------------------------------------------------------------ */

interface TrustCounterSectionProps {
  readonly items: readonly TrustCounterItem[];
}

export function TrustCounterSection({
  items,
}: TrustCounterSectionProps): React.ReactElement {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-14 md:py-20"
      aria-label="Klíčová čísla"
    >
      {/* Decorative gradient line at top */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
              <CounterValue item={item} />
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-slate-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Decorative gradient line at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-500)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
