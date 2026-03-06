"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
}

export function StarRating({
  value,
  onChange,
  max = 5,
}: StarRatingProps): ReactElement {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Hodnocení"
      onMouseLeave={() => setHovered(0)}
    >
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= (hovered || value);

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} z ${max} hvězd`}
            className="rounded p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-500)]"
            onMouseEnter={() => setHovered(star)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-slate-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
