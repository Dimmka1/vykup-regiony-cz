"use client";
import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, var(--theme-500, #3b82f6), var(--theme-700, #1d4ed8))",
      }}
    />
  );
}
