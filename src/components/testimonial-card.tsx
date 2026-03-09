import { Star, MapPin, Quote } from "lucide-react";
import type { NarrativeTestimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: NarrativeTestimonial;
  variant?: "light" | "dark";
}

export function TestimonialCard({
  testimonial,
  variant = "light",
}: TestimonialCardProps) {
  const isDark = variant === "dark";

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-shadow hover:shadow-lg sm:p-8 ${
        isDark
          ? "border-white/15 bg-white/10 backdrop-blur-md"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Situation badge */}
      <span
        className={`mb-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          isDark
            ? "bg-[var(--theme-600)]/20 text-[var(--theme-300)]"
            : "bg-[var(--theme-50)] text-[var(--theme-700)]"
        }`}
      >
        {testimonial.situationLabel}
      </span>

      {/* Stars */}
      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-yellow-400 text-yellow-400"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Quote icon */}
      <Quote
        className={`mb-2 h-6 w-6 ${isDark ? "text-[var(--theme-400)]" : "text-[var(--theme-300)]"}`}
        aria-hidden="true"
      />

      {/* Story text */}
      <p
        className={`flex-1 text-sm leading-relaxed sm:text-base ${
          isDark ? "text-slate-200" : "text-slate-700"
        }`}
      >
        {testimonial.text}
      </p>

      {/* Result highlight */}
      <p
        className={`mt-4 rounded-xl p-3 text-sm font-medium ${
          isDark
            ? "bg-[var(--theme-600)]/10 text-[var(--theme-200)]"
            : "bg-[var(--theme-50)] text-[var(--theme-800)]"
        }`}
      >
        ✓ {testimonial.result}
      </p>

      {/* Author */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--theme-500)] to-[var(--theme-700)] text-sm font-bold text-white">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            {testimonial.name}
          </p>
          <p
            className={`flex items-center gap-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {testimonial.city}
          </p>
        </div>
      </div>
    </article>
  );
}
