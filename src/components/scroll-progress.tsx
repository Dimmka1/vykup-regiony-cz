"use client";
import { motion, useScroll } from "@/components/motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left"
      style={{
        scaleX: scrollYProgress,
        background:
          "linear-gradient(90deg, var(--theme-500, #0f766e), var(--theme-700, #115e59))",
      }}
    />
  );
}
