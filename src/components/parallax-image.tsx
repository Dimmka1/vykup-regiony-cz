"use client";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "@/components/motion";
import Image from "next/image";
import { useRef } from "react";

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
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ y: prefersReduced ? 0 : y }}
        className="relative h-[120%] w-full"
      >
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}
