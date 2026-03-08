"use client";

import { useRef, useState, useCallback } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { SlotCounter } from "@/components/slot-counter";
import { HandCoins, Clock, FileSignature, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  HandCoins,
  Clock,
  FileSignature,
  ShieldCheck,
};

interface Metric {
  label: string;
  value: string;
  icon: string;
}

interface FloatingStatsProps {
  metrics: readonly Metric[];
}

const DEPTH_OFFSETS = [
  { z: 40, floatY: 8, delay: 0 },
  { z: 20, floatY: 12, delay: 100 },
  { z: 30, floatY: 6, delay: 200 },
  { z: 10, floatY: 10, delay: 300 },
];

function StatCard({ metric, index }: { metric: Metric; index: number }) {
  const { ref: cardRef, isInView: inView } = useInView<HTMLDivElement>({
    once: true,
    margin: "-60px",
  });
  const reduced = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const innerRef = useRef<HTMLElement>(null);

  const depth = DEPTH_OFFSETS[index % DEPTH_OFFSETS.length];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const card = innerRef.current;
      if (!card) return;
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 25;
      const y = (e.clientY - top - height / 2) / 25;
      setRotate({ x: -y, y: x });
    },
    [reduced],
  );

  const handleMouseLeave = useCallback(() => {
    setRotate({ x: 0, y: 0 });
  }, []);

  const floatStyle = reduced
    ? undefined
    : {
        animation: `float-y ${4 + index}s ease-in-out infinite`,
      };

  return (
    <div
      ref={cardRef}
      className="perspective-container"
      style={{
        opacity: inView || reduced ? 1 : 0,
        transform: inView || reduced ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${depth.delay}ms, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${depth.delay}ms`,
      }}
    >
      <article
        ref={innerRef}
        className="relative min-h-[140px] overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm md:p-8 lg:p-10"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: `0 ${8 + depth.z / 3}px ${32 + depth.z}px rgba(var(--theme-rgb-500), 0.08), 0 0 ${depth.z}px rgba(var(--theme-rgb-500), 0.04)`,
          transform: reduced
            ? undefined
            : `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: "transform 0.15s ease-out",
          ...floatStyle,
          // CSS custom property for float-y keyframes
          ["--float-y" as string]: `-${depth.floatY}px`,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl"
          style={{
            background: `radial-gradient(circle, rgba(var(--theme-rgb-400), 0.4), transparent 70%)`,
          }}
          aria-hidden="true"
        />
        <div className="flex min-w-0 items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--theme-50)] to-[var(--theme-100)]">
            {ICON_MAP[metric.icon] &&
              (() => {
                const I = ICON_MAP[metric.icon];
                return (
                  <I
                    className="h-7 w-7 text-[var(--theme-600)]"
                    aria-hidden="true"
                  />
                );
              })()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-2xl font-extrabold text-[var(--theme-700)] sm:text-3xl md:text-4xl lg:text-5xl">
              <SlotCounter value={metric.value} />
            </p>
            <p className="mt-2 text-sm text-slate-500">{metric.label}</p>
          </div>
        </div>
      </article>
    </div>
  );
}

export function FloatingStats({ metrics }: FloatingStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {metrics.map((metric, idx) => (
        <StatCard key={metric.label} metric={metric} index={idx} />
      ))}
    </div>
  );
}
