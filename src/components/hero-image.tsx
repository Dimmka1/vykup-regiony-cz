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

  // Parallax: image moves slower than scroll (zoomed in, shifts up)
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.4]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.6, 0.3]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={reduced ? {} : { y, scale, opacity }}
        initial={reduced ? false : { scale: 1.3 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={className}
          sizes="100vw"
          quality={85}
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
            "radial-gradient(ellipse at center, transparent 40%, rgba(15,23,42,0.4) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
