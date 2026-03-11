"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

/* ── Czech cities in locative case (used after "z") ──────────── */

interface CityEntry {
  readonly nominative: string;
  readonly locative: string;
}

const CZECH_CITIES: readonly CityEntry[] = [
  { nominative: "Praha", locative: "Prahy" },
  { nominative: "Brno", locative: "Brna" },
  { nominative: "Ostrava", locative: "Ostravy" },
  { nominative: "Plzeň", locative: "Plzně" },
  { nominative: "Liberec", locative: "Liberce" },
  { nominative: "Olomouc", locative: "Olomouce" },
  { nominative: "České Budějovice", locative: "Českých Budějovic" },
  { nominative: "Hradec Králové", locative: "Hradce Králové" },
  { nominative: "Ústí nad Labem", locative: "Ústí nad Labem" },
  { nominative: "Pardubice", locative: "Pardubic" },
  { nominative: "Zlín", locative: "Zlína" },
  { nominative: "Karlovy Vary", locative: "Karlových Varů" },
] as const;

/* ── Deterministic "today" counter (5-15) ────────────────────── */

function getTodayCount(): number {
  const now = new Date();
  const dayOfYear =
    Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24),
    ) + 1;
  return 5 + (((dayOfYear * 7 + now.getFullYear() * 13) % 11) | 0);
}

/* ── Seeded pseudo-random for city/time rotation ─────────────── */

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getRotatingCity(tick: number): CityEntry {
  const index = Math.floor(seededRandom(tick * 17 + 42) * CZECH_CITIES.length);
  return CZECH_CITIES[index];
}

function getRotatingMinutes(tick: number): number {
  return 5 + Math.floor(seededRandom(tick * 31 + 7) * 41);
}

/* ── Component ───────────────────────────────────────────────── */

export function FormSocialProof(): ReactElement {
  const todayCount = useMemo(() => getTodayCount(), []);
  const [tick, setTick] = useState<number>(0);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    setTick(Math.floor(Date.now() / 30000));

    const interval = setInterval(() => {
      setTick(Math.floor(Date.now() / 30000));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const city = useMemo(() => getRotatingCity(tick), [tick]);
  const minutes = useMemo(() => getRotatingMinutes(tick), [tick]);

  return (
    <div className="mb-4 space-y-2.5" aria-live="polite">
      {/* Today counter */}
      <div className="flex items-center gap-2 rounded-xl bg-[var(--theme-50)] px-3.5 py-2.5">
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
          <svg
            className="h-5 w-5 text-[var(--theme-600)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-form-proof-pulse rounded-full bg-green-500" />
        </span>
        <span className="text-sm font-semibold text-[var(--theme-800)]">
          Dnes vyplnilo <span className="tabular-nums">{todayCount}</span> lidí
        </span>
      </div>

      {/* Last inquiry */}
      <div
        className={`flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-2.5 transition-opacity duration-500 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <svg
            className="h-5 w-5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
        <span className="text-sm text-slate-600">
          Poslední poptávka z{" "}
          <span className="font-semibold text-slate-800">{city.locative}</span>{" "}
          před <span className="font-semibold tabular-nums">{minutes}</span>{" "}
          minutami
        </span>
      </div>
    </div>
  );
}
