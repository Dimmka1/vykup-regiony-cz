"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ParallaxImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
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
        const y = -10 + clamped * 20;
        inner.style.transform = `translateY(${y}%)`;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={innerRef} className="relative h-[120%] w-full">
        <Image src={src} alt={alt} fill className="object-cover" />
      </div>
    </div>
  );
}
