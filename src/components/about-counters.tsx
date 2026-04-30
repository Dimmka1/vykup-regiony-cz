"use client";

import { HandCoins, Clock, MapPin, Scale } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";

const COUNTERS = [
  {
    value: "0 Kč",
    label: "provize a skrytých poplatků",
    Icon: HandCoins,
  },
  {
    value: "48 h",
    label: "obvyklá doba splatnosti od podpisu",
    Icon: Clock,
  },
  {
    value: "14",
    label: "krajů po celé ČR",
    Icon: MapPin,
  },
  {
    value: "Zdarma",
    label: "právní servis a kompletní zastoupení",
    Icon: Scale,
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
