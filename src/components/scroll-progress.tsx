"use client";

import { useEffect, useRef, type ReactElement } from "react";

/**
 * Top-of-viewport scroll progress bar (3 px). Pure DOM scroll listener +
 * inline style mutation — avoids pulling framer-motion into the critical
 * path bundle. Updates run inside a passive listener and a single rAF
 * tick per scroll event.
 */
export function ScrollProgress(): ReactElement {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let ticking = false;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left"
      style={{
        transform: "scaleX(0)",
        background:
          "linear-gradient(90deg, var(--theme-500, #0f766e), var(--theme-700, #115e59))",
      }}
    />
  );
}
