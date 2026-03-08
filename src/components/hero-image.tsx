"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface HeroImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  priority?: boolean;
}

export function HeroImage({
  src,
  alt,
  fallbackSrc = "/images/hero-default.png",
  className,
  priority,
}: HeroImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const progress = Math.min(
          Math.max(-rect.top / (rect.height || 1), 0),
          1,
        );
        const y = progress * 15;
        const scale = 1 + progress * 0.08;
        const opacity = 1 - progress * 0.6;
        inner.style.transform = `translateY(${y}%) scale(${scale})`;
        inner.style.opacity = String(Math.max(opacity, 0.4));
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div ref={innerRef} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={className}
          sizes="100vw"
          quality={75}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.src.includes(fallbackSrc)) {
              target.src = fallbackSrc;
            }
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(15,23,42,0.4) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
