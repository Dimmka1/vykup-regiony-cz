"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "@/components/motion";

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
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Enhanced parallax: deeper movement, zoom, and fade
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.6, 0.2]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={reduced ? {} : { y, scale, opacity }}
      >
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
      </motion.div>
      {/* Cinematic vignette overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(2,6,23,0.5) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
