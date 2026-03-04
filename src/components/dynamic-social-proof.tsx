"use client";

import { useEffect, useState } from "react";

/** Czech month names in locative case (v lednu, v únoru, ...) */
const CZECH_MONTHS_LOCATIVE = [
  "lednu",
  "únoru",
  "březnu",
  "dubnu",
  "květnu",
  "červnu",
  "červenci",
  "srpnu",
  "září",
  "říjnu",
  "listopadu",
  "prosinci",
] as const;

interface StatsData {
  readonly totalLeads: number;
  readonly monthLeads: number;
  readonly lastRegion: string;
}

const MIN_LEADS_THRESHOLD = 5;

export function DynamicSocialProof(): React.ReactElement | null {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) return;
        const data = (await res.json()) as StatsData;
        if (!cancelled) setStats(data);
      } catch {
        // Silent fail — component simply won't render
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  const now = new Date();
  const monthName = CZECH_MONTHS_LOCATIVE[now.getMonth()];
  const year = now.getFullYear();

  // AC-3: Fallback for < 5 leads
  const text =
    stats.monthLeads >= MIN_LEADS_THRESHOLD
      ? `📊 ${stats.monthLeads} poptávek v ${monthName} ${year}`
      : "🆕 Nová služba — prvních 10 klientů se slevou";

  return (
    <div className="border-[var(--theme-200)]/30 bg-[var(--theme-500)]/10 border-b py-2 text-center text-sm font-medium text-white backdrop-blur-sm">
      {text}
    </div>
  );
}
