"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "@/components/motion";

export function HeroParallaxShapes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0]);

  if (reduced) return null;

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Large ring — top right */}
      <motion.div
        style={reduced ? {} : { y: y1, rotate: rotate1, opacity }}
        className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full border border-white/[0.06] md:h-[700px] md:w-[700px]"
      />

      {/* Small ring — left center */}
      <motion.div
        style={reduced ? {} : { y: y2, rotate: rotate2, opacity }}
        className="border-[var(--theme-400)]/[0.08] absolute -left-10 top-1/3 h-[200px] w-[200px] rounded-full border md:h-[300px] md:w-[300px]"
      />

      {/* Accent dot cluster — bottom left */}
      <motion.div
        style={reduced ? {} : { y: y3, opacity }}
        className="absolute bottom-32 left-[15%]"
      >
        <div className="flex gap-2">
          <div className="bg-[var(--theme-400)]/30 h-1.5 w-1.5 rounded-full" />
          <div className="bg-[var(--theme-400)]/20 h-1.5 w-1.5 rounded-full" />
          <div className="bg-[var(--theme-400)]/10 h-1.5 w-1.5 rounded-full" />
        </div>
      </motion.div>

      {/* Diagonal line — right side */}
      <motion.div
        style={reduced ? {} : { y: y2, opacity }}
        className="absolute right-[20%] top-[20%] h-px w-40 origin-center rotate-[30deg] bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      {/* Gradient glow — bottom center */}
      <motion.div
        style={reduced ? {} : { y: y1, opacity }}
        className="bg-[var(--theme-600)]/[0.06] absolute -bottom-40 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full blur-[100px]"
      />
    </div>
  );
}
