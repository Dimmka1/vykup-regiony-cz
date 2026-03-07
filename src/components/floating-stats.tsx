"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, useInView } from "@/components/motion";
import { SlotCounter } from "@/components/slot-counter";
import type { LucideIcon } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  Icon: LucideIcon;
}

interface FloatingStatsProps {
  metrics: readonly Metric[];
}

const DEPTH_OFFSETS = [
  { z: 40, floatY: 8, delay: 0 },
  { z: 20, floatY: 12, delay: 0.1 },
  { z: 30, floatY: 6, delay: 0.2 },
  { z: 10, floatY: 10, delay: 0.3 },
];

function StatCard({ metric, index }: { metric: Metric; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const depth = DEPTH_OFFSETS[index % DEPTH_OFFSETS.length];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      const card = cardRef.current;
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

  return (
    <motion.div
      ref={cardRef}
      className="perspective-container"
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      animate={
        inView
          ? { opacity: 1, y: 0 }
          : reduced
            ? { opacity: 1, y: 0 }
            : undefined
      }
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 18,
        delay: depth.delay,
      }}
    >
      <motion.article
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-8 backdrop-blur-sm md:p-10"
        style={{
          transformStyle: "preserve-3d",
          boxShadow: `0 ${8 + depth.z / 3}px ${32 + depth.z}px rgba(var(--theme-rgb-500), 0.08), 0 0 ${depth.z}px rgba(var(--theme-rgb-500), 0.04)`,
        }}
        animate={
          reduced
            ? undefined
            : {
                rotateX: rotate.x,
                rotateY: rotate.y,
                y: [0, -depth.floatY, 0],
              }
        }
        transition={{
          rotateX: { type: "spring", stiffness: 200, damping: 25 },
          rotateY: { type: "spring", stiffness: 200, damping: 25 },
          y: {
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradient glow behind */}
        <div
          className="absolute -inset-4 -z-10 rounded-3xl opacity-20 blur-2xl"
          style={{
            background: `radial-gradient(circle, rgba(var(--theme-rgb-400), 0.4), transparent 70%)`,
          }}
          aria-hidden="true"
        />

        <div className="flex items-start gap-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--theme-50)] to-[var(--theme-100)]">
            <metric.Icon
              className="h-7 w-7 text-[var(--theme-600)]"
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="text-4xl font-extrabold text-[var(--theme-700)] md:text-5xl">
              <SlotCounter value={metric.value} />
            </p>
            <p className="mt-2 text-sm text-slate-500">{metric.label}</p>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

export function FloatingStats({ metrics }: FloatingStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => (
        <StatCard key={metric.label} metric={metric} index={idx} />
      ))}
    </div>
  );
}
