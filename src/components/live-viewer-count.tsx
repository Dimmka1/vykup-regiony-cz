"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LiveViewerCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(randomBetween(3, 12));

    const interval = setInterval(
      () => {
        setCount((prev) => {
          if (prev === null) return randomBetween(3, 12);
          const delta = randomBetween(-2, 2);
          return Math.max(3, Math.min(12, prev + delta));
        });
      },
      randomBetween(30_000, 60_000),
    );

    return () => clearInterval(interval);
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
      <Eye className="h-4 w-4 text-slate-400" />
      <span>
        <span className="font-medium text-slate-800">{count}</span> lidí si
        právě prohlíží tuto stránku
      </span>
    </div>
  );
}
