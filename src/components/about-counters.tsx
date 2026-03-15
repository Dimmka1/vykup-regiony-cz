"use client";

import { Building2, Clock, MapPin, ThumbsUp } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

const DEALS_COUNT = process.env.NEXT_PUBLIC_DEALS_COUNT || "200";
const YEARS_EXPERIENCE = process.env.NEXT_PUBLIC_YEARS_EXPERIENCE || "5";

const COUNTERS = [
  {
    value: `${DEALS_COUNT}+`,
    label: "vykoupených nemovitostí",
    Icon: Building2,
  },
  {
    value: `${YEARS_EXPERIENCE}+`,
    label: "let zkušeností na trhu",
    Icon: Clock,
  },
  {
    value: "14",
    label: "krajů po celé ČR",
    Icon: MapPin,
  },
  {
    value: "98 %",
    label: "spokojených klientů",
    Icon: ThumbsUp,
  },
] as const;

export function AboutCounters(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {COUNTERS.map((counter) => (
        <div
          key={counter.label}
          className="group rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md"
        >
          <counter.Icon className="mx-auto mb-3 h-8 w-8 text-[var(--theme-500)] transition group-hover:scale-110" />
          <div className="text-3xl font-bold text-slate-900 sm:text-4xl">
            <AnimatedCounter value={counter.value} duration={2000} />
          </div>
          <div className="mt-1 text-sm text-slate-600">{counter.label}</div>
        </div>
      ))}
    </div>
  );
}
