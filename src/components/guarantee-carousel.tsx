"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldCheck, Clock3, Scale, HandCoins } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Guarantee {
  title: string;
  description: string;
  Icon: LucideIcon;
}

const guarantees: Guarantee[] = [
  {
    title: "Garance ceny",
    description: "Výkupní cena zafixována ve smlouvě",
    Icon: ShieldCheck,
  },
  {
    title: "Platba do 48 hodin od podpisu",
    description: "Peníze odesíláme obvykle do 48 hodin od podpisu smlouvy",
    Icon: Clock3,
  },
  {
    title: "Právní servis zdarma",
    description: "Vše řešíme za vás",
    Icon: Scale,
  },
  {
    title: "Bez provize a skrytých poplatků",
    description: "Žádné skryté náklady navíc",
    Icon: HandCoins,
  },
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export function GuaranteeCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = guarantees.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [next, isHovered]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff > 0 ? next() : prev();
    }
  };

  const g = guarantees[current];
  const Icon = g.Icon;

  return (
    <div
      className="relative mx-auto max-w-2xl select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="rounded-2xl border border-slate-100 bg-slate-50 p-8 text-center"
        key={current}
        style={{ animation: "testimonialFadeIn 0.5s ease-in-out" }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--theme-100)]">
          <Icon className="h-6 w-6 text-[var(--theme-600)]" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{g.title}</h3>
        <p className="mt-2 text-slate-600">{g.description}</p>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 hidden -translate-x-12 -translate-y-1/2 rounded-full bg-white p-2 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 md:block"
        aria-label="Předchozí garance"
      >
        <svg
          className="h-5 w-5 text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-12 rounded-full bg-white p-2 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 md:block"
        aria-label="Další garance"
      >
        <svg
          className="h-5 w-5 text-slate-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex justify-center gap-2">
          {guarantees.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                i === current
                  ? "bg-[var(--theme-500)]"
                  : "bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Garance ${i + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-slate-400 md:hidden">
          Přejeďte prstem pro další →
        </p>
      </div>
    </div>
  );
}
