"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedCounterProps {
  /** Target value to animate to (e.g. "1 250+", "24", "4.9/5") */
  readonly value: string;
  /** Animation duration in ms */
  readonly duration?: number;
}

function parseNumericPart(value: string): {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
} {
  const match = value.match(/^([^\d]*?)([\d\s,.]+)(.*)$/);
  if (!match) {
    return { prefix: "", number: 0, decimals: 0, suffix: value };
  }

  const prefix = match[1];
  const rawNumber = match[2].replace(/\s/g, "").replace(",", ".");
  const suffix = match[3];
  const number = parseFloat(rawNumber);
  const decimalPart = rawNumber.split(".")[1];
  const decimals = decimalPart ? decimalPart.length : 0;

  return { prefix, number, decimals, suffix };
}

function formatNumber(
  n: number,
  decimals: number,
  originalValue: string,
): string {
  const formatted = n.toFixed(decimals);

  // Restore space-separated thousands if original had them
  if (/\d\s\d/.test(originalValue)) {
    const [intPart, decPart] = formatted.split(".");
    const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decPart ? `${withSpaces}.${decPart}` : withSpaces;
  }

  return formatted;
}

export function AnimatedCounter({
  value,
  duration = 2000,
}: AnimatedCounterProps): React.ReactElement {
  const { prefix, number: target, decimals, suffix } = parseNumericPart(value);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function step(now: number): void {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(`${prefix}${formatNumber(current, decimals, value)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [duration, target, decimals, prefix, suffix, value]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return <span ref={ref}>{display}</span>;
}
