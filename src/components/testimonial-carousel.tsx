"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Testimonial {
  quote: string;
  author: string;
  region: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Měli jsme exekuci a hrozila nám dražba. Během dvou týdnů nám nabídli férovou cenu a vše vyřídili za nás. Obrovská úleva pro celou rodinu.",
    author: "Paní M.",
    region: "Praha",
    rating: 5,
  },
  {
    quote:
      "Po dědictví jsme se sourozenci nemohli dohodnout na prodeji. Tým nám pomohl najít řešení, které vyhovovalo všem. Profesionální a rychlý přístup.",
    author: "Pan K.",
    region: "Brno",
    rating: 5,
  },
  {
    quote:
      "Při rozvodu jsem potřebovala rychle prodat společný byt. Celý proces proběhl hladce a peníze jsem měla na účtu do měsíce. Děkuji!",
    author: "Paní J.",
    region: "Ostrava",
    rating: 5,
  },
  {
    quote:
      "Ve svém věku jsem už nezvládal údržbu domu. Nabídli mi slušnou cenu a pomohli s přestěhováním. Vstřícný a lidský přístup.",
    author: "Pan V.",
    region: "Plzeň",
    rating: 5,
  },
  {
    quote:
      "Potřeboval jsem rychle uvolnit kapitál z investičního bytu. Ocenění bylo férové, jednání transparentní. Doporučuji každému, kdo nechce čekat měsíce na realitce.",
    author: "Pan S.",
    region: "Liberec",
    rating: 5,
  },
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = testimonials.length;

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

  const t = testimonials[current];

  return (
    <div
      ref={containerRef}
      className="relative mx-auto max-w-2xl select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="rounded-2xl border border-slate-100 bg-slate-50 p-8"
        key={current}
        style={{ animation: "testimonialFadeIn 0.5s ease-in-out" }}
      >
        <div className="mb-4 flex gap-0.5" aria-label={`${t.rating} z 5 hvězd`}>
          {Array.from({ length: t.rating }, (_, i) => (
            <svg
              key={i}
              className="h-5 w-5 fill-[var(--theme-400)] text-[var(--theme-400)]"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        <blockquote className="text-base italic leading-relaxed text-slate-600">
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        <figcaption className="mt-4 text-sm font-semibold text-slate-800">
          {t.author}{" "}
          <span className="font-normal text-slate-400">&mdash; {t.region}</span>
        </figcaption>
      </div>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 hidden -translate-x-12 -translate-y-1/2 rounded-full bg-white p-2 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-50 md:block"
        aria-label="Předchozí recenze"
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
        aria-label="Další recenze"
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

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
              i === current
                ? "bg-[var(--theme-500)]"
                : "bg-slate-300 hover:bg-slate-400"
            }`}
            aria-label={`Recenze ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
