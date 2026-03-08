"use client";

import { useState, useCallback } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  text: string;
  location: string;
}

interface QuoteBubblesProps {
  testimonials: Testimonial[];
}

const FLOAT_CONFIGS = [
  { y: 8, duration: 5, delay: 0, scale: 1 },
  { y: 12, duration: 6, delay: 0.5, scale: 0.95 },
  { y: 6, duration: 4.5, delay: 1, scale: 1.02 },
  { y: 10, duration: 5.5, delay: 0.3, scale: 0.98 },
  { y: 7, duration: 4, delay: 0.8, scale: 1 },
  { y: 14, duration: 6.5, delay: 0.2, scale: 0.96 },
];

function Bubble({
  testimonial,
  index,
  hoveredIdx,
  onHover,
}: {
  testimonial: Testimonial;
  index: number;
  hoveredIdx: number | null;
  onHover: (idx: number | null) => void;
}) {
  const { ref, isInView: inView } = useInView<HTMLDivElement>({
    once: true,
    margin: "-40px",
  });
  const reduced = useReducedMotion();
  const config = FLOAT_CONFIGS[index % FLOAT_CONFIGS.length];

  const isHovered = hoveredIdx === index;
  const isOtherHovered = hoveredIdx !== null && hoveredIdx !== index;

  const scale = isHovered ? 1.05 : isOtherHovered ? 0.97 : config.scale;

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: inView || reduced ? 1 : 0,
        transform:
          inView || reduced ? `scale(${scale})` : "scale(0.8) translateY(30px)",
        transition: `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${config.delay}s, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <div
        style={
          reduced
            ? undefined
            : {
                animation: `float-y ${config.duration}s ease-in-out infinite`,
                ["--float-y" as string]: `-${config.y}px`,
              }
        }
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md transition-colors hover:bg-white/15 sm:p-8">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%)",
            }}
            aria-hidden="true"
          />
          <div className="mb-4 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                style={{
                  filter: "drop-shadow(0 0 4px rgba(250,204,21,0.5))",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="relative text-sm leading-relaxed text-slate-200">
            <span className="text-2xl leading-none text-[var(--theme-300)]">
              &ldquo;
            </span>
            {testimonial.text}
            <span className="text-2xl leading-none text-[var(--theme-300)]">
              &rdquo;
            </span>
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--theme-500)] to-[var(--theme-700)] text-xs font-bold text-white shadow-lg">
              {testimonial.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {testimonial.name}
              </p>
              <p className="text-xs text-slate-400">{testimonial.location}</p>
            </div>
          </div>
          <div
            className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 border-b border-r border-white/15 bg-white/10 backdrop-blur-md"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

function Sparkles() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animation: `sparkle ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.2) % 4}s`,
          }}
        />
      ))}
    </div>
  );
}

export function QuoteBubbles({ testimonials }: QuoteBubblesProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const onHover = useCallback((idx: number | null) => setHoveredIdx(idx), []);
  const reduced = useReducedMotion();

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="relative">
      {!reduced && <Sparkles />}
      <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, idx) => (
          <Bubble
            key={idx}
            testimonial={testimonial}
            index={idx}
            hoveredIdx={hoveredIdx}
            onHover={onHover}
          />
        ))}
      </div>
    </div>
  );
}
