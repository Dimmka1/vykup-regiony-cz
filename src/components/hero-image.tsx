"use client";

import Image from "next/image";

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
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={className}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (!target.src.includes(fallbackSrc)) {
          target.src = fallbackSrc;
        }
      }}
    />
  );
}
