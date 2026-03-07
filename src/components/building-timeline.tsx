"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "@/components/motion";
import type { LucideIcon } from "lucide-react";

interface Step {
  title: string;
  eta: string;
  Icon: LucideIcon;
  description: string;
}

interface BuildingTimelineProps {
  steps: Step[];
}

function Floor({
  step,
  index,
  total,
}: {
  step: Step;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  const floorNumber = index + 1;
  const isTop = index === total - 1;

  return (
    <motion.div
      ref={ref}
      className="relative flex items-stretch gap-4 sm:gap-8"
      initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      animate={
        inView
          ? { opacity: 1, x: 0 }
          : reduced
            ? { opacity: 1, x: 0 }
            : undefined
      }
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 18,
        delay: index * 0.15,
      }}
    >
      {/* Building column */}
      <div className="relative flex w-20 flex-col items-center sm:w-28">
        {/* Floor block */}
        <motion.div
          className={`relative flex h-full w-full items-center justify-center border-x-2 border-t-2 border-[var(--theme-500)] ${
            index === 0 ? "rounded-b-lg border-b-2" : ""
          } ${isTop ? "rounded-t-lg" : ""}`}
          style={{
            background: `linear-gradient(135deg, rgba(var(--theme-rgb-${
              900 - index * 100 > 500 ? 900 - index * 100 : 500
            }), 0.15), rgba(var(--theme-rgb-800), 0.08))`,
          }}
          initial={reduced ? { scaleY: 1 } : { scaleY: 0, originY: "bottom" }}
          animate={inView ? { scaleY: 1 } : reduced ? { scaleY: 1 } : undefined}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay: index * 0.2,
          }}
        >
          {/* Window-like decorative elements */}
          <div className="flex gap-2 p-3">
            <div className="h-3 w-3 rounded-sm bg-[var(--theme-400)] opacity-30 sm:h-4 sm:w-4" />
            <div className="h-3 w-3 rounded-sm bg-[var(--theme-400)] opacity-20 sm:h-4 sm:w-4" />
          </div>
          <span className="absolute left-2 top-1 text-xs font-bold text-[var(--theme-400)] opacity-60 sm:text-sm">
            {floorNumber}
          </span>
        </motion.div>

        {/* Key icon at top */}
        {isTop && inView && (
          <motion.div
            className="absolute -top-10 flex h-8 w-8 items-center justify-center"
            initial={
              reduced ? { rotate: 0, scale: 1 } : { rotate: -90, scale: 0 }
            }
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: total * 0.2 + 0.3,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
              fill="currentColor"
            >
              <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          </motion.div>
        )}

        {/* Foundation at bottom */}
        {index === 0 && (
          <div className="flex h-4 w-full items-center justify-center">
            <div className="h-full w-full rounded-b bg-gradient-to-r from-[var(--theme-700)] via-[var(--theme-600)] to-[var(--theme-700)]">
              <div className="flex h-full items-center justify-center gap-0.5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-sm bg-[var(--theme-500)] opacity-40 sm:w-3"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col justify-center py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-50)] text-[var(--theme-600)] sm:h-12 sm:w-12">
            <step.Icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
              {step.title}
            </h3>
            <span className="text-xs font-medium text-[var(--theme-600)]">
              {step.eta}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export function BuildingTimeline({ steps }: BuildingTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl">
      <div className="flex flex-col-reverse">
        {steps.map((step, i) => (
          <Floor key={step.title} step={step} index={i} total={steps.length} />
        ))}
      </div>
    </div>
  );
}
