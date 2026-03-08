"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  offset = 30,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = ref.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (vh + rect.height);
        const clamped = Math.min(Math.max(progress, 0), 1);
        const y = offset - clamped * (offset * 2);
        inner.style.transform = `translateY(${y}px)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, offset]);

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
