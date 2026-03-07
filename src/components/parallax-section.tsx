"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "@/components/motion";

interface ParallaxSectionProps {
  children: ReactNode;
  /** How much offset from the scroll center (default 30 = ±30px) */
  offset?: number;
  className?: string;
}

/**
 * Wraps a section and applies a subtle vertical parallax shift
 * as the user scrolls. Respects prefers-reduced-motion.
 */
export function ParallaxSection({
  children,
  offset = 30,
  className = "",
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduced ? 0 : y }}>{children}</motion.div>
    </div>
  );
}
