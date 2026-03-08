"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { FileText, Zap, FilePenLine, Banknote } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Zap,
  FilePenLine,
  Banknote,
};

interface Step {
  title: string;
  eta: string;
  icon: string;
  description: string;
}

interface BuildingTimelineProps {
  steps: Step[];
}

const FLOOR_GRADIENTS = [
  "from-[var(--theme-800)] to-[var(--theme-900)]",
  "from-[var(--theme-700)] to-[var(--theme-800)]",
  "from-[var(--theme-600)] to-[var(--theme-700)]",
  "from-[var(--theme-500)] to-[var(--theme-600)]",
];

function ArchedWindow({ delay }: { delay: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="h-2 w-4 rounded-t-full bg-[var(--theme-300)] opacity-40 sm:h-3 sm:w-5"
        style={{ animationDelay: `${delay}ms` }}
      />
      <div className="h-3 w-4 bg-[var(--theme-300)] opacity-30 sm:h-4 sm:w-5" />
    </div>
  );
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
  const { ref, isInView: inView } = useInView<HTMLDivElement>({
    once: true,
    margin: "-60px",
  });
  const reduced = useReducedMotion();

  const floorNumber = index + 1;
  const isTop = index === total - 1;
  const gradient = FLOOR_GRADIENTS[index % FLOOR_GRADIENTS.length];
  const delayMs = index * 150;

  return (
    <div
      ref={ref}
      className="relative flex items-stretch gap-4 sm:gap-8"
      style={{
        opacity: inView || reduced ? 1 : 0,
        transform: inView || reduced ? "translateX(0)" : "translateX(-30px)",
        transition: `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delayMs}ms`,
      }}
    >
      {/* Building column */}
      <div className="relative flex w-20 flex-col items-center sm:w-28">
        {isTop && (
          <div
            className="relative w-full"
            style={{
              transform: inView || reduced ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "bottom",
              transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 200 - 50}ms`,
            }}
          >
            <svg viewBox="0 0 112 32" className="w-full" aria-hidden="true">
              <polygon
                points="56,2 108,30 4,30"
                fill="var(--theme-700)"
                stroke="var(--theme-500)"
                strokeWidth="1.5"
              />
              <polygon
                points="56,2 80,16 56,30 32,16"
                fill="var(--theme-600)"
                opacity="0.5"
              />
            </svg>
          </div>
        )}

        <div
          className={`border-[var(--theme-500)]/60 relative flex h-full w-full items-center justify-center border-x-2 border-t-2 bg-gradient-to-br ${gradient} ${
            index === 0 ? "rounded-b-lg border-b-2" : ""
          }`}
          style={{
            boxShadow:
              "inset 0 2px 8px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)",
            transform: inView || reduced ? "scaleY(1)" : "scaleY(0)",
            transformOrigin: "bottom",
            transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 200}ms`,
          }}
        >
          <div className="flex gap-1.5 p-3 sm:gap-2">
            <ArchedWindow delay={index * 200} />
            <ArchedWindow delay={index * 200 + 100} />
            <ArchedWindow delay={index * 200 + 200} />
          </div>
          <span className="absolute left-1.5 top-1 text-[10px] font-bold text-[var(--theme-300)] opacity-50 sm:left-2 sm:text-xs">
            {floorNumber}P
          </span>
          <div className="absolute bottom-0 right-0 top-0 w-1 bg-black/10" />
        </div>

        {isTop && inView && (
          <div
            className="absolute -top-16 z-10 flex h-10 w-10 items-center justify-center sm:h-12 sm:w-12"
            style={{
              opacity: 0,
              animation: `scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${total * 200 + 300}ms forwards`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 text-yellow-400 sm:h-11 sm:w-11"
              fill="currentColor"
              style={
                reduced
                  ? undefined
                  : { animation: "glow-pulse 2s ease-in-out infinite" }
              }
            >
              <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          </div>
        )}

        {index === 0 && (
          <div className="w-full">
            <div className="flex h-6 w-full items-end overflow-hidden rounded-b-lg bg-gradient-to-b from-stone-600 to-stone-700">
              <div className="flex h-full w-full flex-wrap items-center justify-center gap-px p-0.5">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2.5 rounded-[1px] sm:w-3"
                    style={{
                      background:
                        i % 3 === 0
                          ? "var(--theme-600)"
                          : i % 2 === 0
                            ? "rgb(120,113,108)"
                            : "rgb(87,83,78)",
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-stone-500 to-transparent opacity-50" />
          </div>
        )}
      </div>

      {/* Step content */}
      <div className="flex flex-1 flex-col justify-center py-4 sm:py-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--theme-50)] text-[var(--theme-600)] shadow-md sm:h-12 sm:w-12">
            {(() => {
              const I = ICON_MAP[step.icon];
              return I ? (
                <I className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              ) : null;
            })()}
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
    </div>
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
