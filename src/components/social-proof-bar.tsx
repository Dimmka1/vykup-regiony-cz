"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, Clock, Scale, FileSignature } from "lucide-react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 1500,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    if (started) {
      if (prefersReduced) {
        setCount(target);
        return;
      }
      const startTime = performance.now();
      let animId: number;
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animId);
    }

    return () => observer.disconnect();
  }, [started, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

const PROOF_ITEMS = [
  {
    icon: Shield,
    value: 0,
    suffix: " Kč",
    label: "Provize",
    highlight: true,
  },
  {
    icon: Clock,
    value: 24,
    suffix: "h",
    label: "Nabídka",
    highlight: false,
  },
  {
    icon: Scale,
    value: 0,
    suffix: " Kč",
    label: "Právní servis",
    highlight: false,
  },
  {
    icon: FileSignature,
    value: 14,
    suffix: "",
    label: "krajů ČR",
    highlight: false,
  },
] as const;

export function SocialProofBar() {
  return (
    <div className="relative border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {PROOF_ITEMS.map((item) => (
            <div
              key={item.label}
              className="group flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--theme-50)] transition-colors group-hover:bg-[var(--theme-100)]">
                <item.icon
                  className="h-5 w-5 text-[var(--theme-600)]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">
                  <AnimatedCounter target={item.value} suffix={item.suffix} />
                </p>
                <p className="text-xs text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
