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
  const isNumeric = /\d/.test(value);
  // SSR fallback: show target value initially so users never see "0"
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current || !isNumeric) return;
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

    // Start animation from 0
    setDisplay(`${prefix}${formatNumber(0, decimals, value)}${suffix}`);
    requestAnimationFrame(step);
  }, [duration, target, decimals, prefix, suffix, value, isNumeric]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Timeout fallback: start animation after 3s even if not intersecting
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
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [animate]);

  return <span ref={ref}>{display}</span>;
}
