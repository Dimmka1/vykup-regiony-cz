/**
 * Weekly digest data collection and formatting.
 *
 * Reads leads from /tmp/leads-backup.json (same source as admin API),
 * computes metrics for current vs previous week, formats HTML email
 * and compact Telegram message.
 */

import { readFileSync, existsSync } from "node:fs";
import { calculateLeadScore } from "@/lib/lead-scoring";

const LEADS_BACKUP = "/tmp/leads-backup.json";

interface LeadRecord {
  lead_id: string;
  timestamp: string;
  ip: string;
  data: {
    type?: string;
    name?: string;
    phone: string;
    email?: string;
    property_type?: string;
    region: string;
    situation_type?: string;
    source?: string;
  };
}

export interface WeeklyMetrics {
  totalLeads: number;
  topRegions: { region: string; count: number }[];
  avgScore: number;
  /** Previous week metrics for trend comparison */
  prev: {
    totalLeads: number;
    avgScore: number;
  };
}

function readLeads(): LeadRecord[] {
  if (!existsSync(LEADS_BACKUP)) return [];
  try {
    const raw = readFileSync(LEADS_BACKUP, "utf-8");
    return raw
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line) as LeadRecord);
  } catch {
    return [];
  }
}

function filterByDateRange(
  leads: LeadRecord[],
  from: Date,
  to: Date,
): LeadRecord[] {
  return leads.filter((l) => {
    const ts = new Date(l.timestamp);
    return ts >= from && ts < to;
  });
}

function computeAvgScore(leads: LeadRecord[]): number {
  if (leads.length === 0) return 0;
  const total = leads.reduce((sum, lead) => {
    const score = calculateLeadScore({
      property_type: lead.data.property_type ?? "",
      region: lead.data.region ?? "",
      situation_type: lead.data.situation_type ?? "",
      source: lead.data.source,
    });
    return sum + score.score;
  }, 0);
  return Math.round(total / leads.length);
}

function topRegions(
  leads: LeadRecord[],
  limit: number,
): { region: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const lead of leads) {
    const region = lead.data.region || "(unknown)";
    counts[region] = (counts[region] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function collectWeeklyMetrics(now?: Date): WeeklyMetrics {
  const ref = now ?? new Date();
  const weekEnd = new Date(ref);
  const weekStart = new Date(ref.getTime() - 7 * 86_400_000);
  const prevWeekStart = new Date(ref.getTime() - 14 * 86_400_000);

  const allLeads = readLeads();
  const currentWeek = filterByDateRange(allLeads, weekStart, weekEnd);
  const previousWeek = filterByDateRange(allLeads, prevWeekStart, weekStart);

  return {
    totalLeads: currentWeek.length,
    topRegions: topRegions(currentWeek, 3),
    avgScore: computeAvgScore(currentWeek),
    prev: {
      totalLeads: previousWeek.length,
      avgScore: computeAvgScore(previousWeek),
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Trend helpers                                                      */
/* ------------------------------------------------------------------ */

function trendArrow(current: number, previous: number): string {
  if (current > previous) return "▲";
  if (current < previous) return "▼";
  return "—";
}

function trendDiff(current: number, previous: number): string {
  const diff = current - previous;
  const arrow = trendArrow(current, previous);
  const sign = diff > 0 ? "+" : "";
  return `${arrow} ${sign}${diff}`;
}

function trendPct(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "▲ new" : "—";
  const pct = Math.round(((current - previous) / previous) * 100);
  const arrow = trendArrow(current, previous);
  const sign = pct > 0 ? "+" : "";
  return `${arrow} ${sign}${pct}%`;
}

/* ------------------------------------------------------------------ */
/*  Email HTML                                                         */
/* ------------------------------------------------------------------ */

export function formatEmailHtml(m: WeeklyMetrics, dateStr: string): string {
  const topRegionRows = m.topRegions
    .map(
      (r, i) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e2e8f0">${i + 1}.</td>` +
        `<td style="padding:8px 12px;border:1px solid #e2e8f0">${r.region}</td>` +
        `<td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${r.count}</td></tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:640px;margin:0 auto;padding:20px">
  <h2 style="color:#1a56db">📊 Týdenní digest — ${dateStr}</h2>
  <p>Automatický souhrn za posledních 7 dní.</p>

  <table style="border-collapse:collapse;width:100%;margin:20px 0">
    <thead>
      <tr style="background:#f1f5f9">
        <th style="padding:10px 12px;border:1px solid #e2e8f0;text-align:left">Metrika</th>
        <th style="padding:10px 12px;border:1px solid #e2e8f0;text-align:right">Tento týden</th>
        <th style="padding:10px 12px;border:1px solid #e2e8f0;text-align:right">Minulý týden</th>
        <th style="padding:10px 12px;border:1px solid #e2e8f0;text-align:right">Trend</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:8px 12px;border:1px solid #e2e8f0"><strong>Celkem leadů</strong></td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${m.totalLeads}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${m.prev.totalLeads}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${trendDiff(m.totalLeads, m.prev.totalLeads)} (${trendPct(m.totalLeads, m.prev.totalLeads)})</td>
      </tr>
      <tr style="background:#f8fafc">
        <td style="padding:8px 12px;border:1px solid #e2e8f0"><strong>Průměrné skóre</strong></td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${m.avgScore}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${m.prev.avgScore}</td>
        <td style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">${trendDiff(m.avgScore, m.prev.avgScore)}</td>
      </tr>
    </tbody>
  </table>

  <h3 style="color:#1a56db">Top 3 regiony</h3>
  <table style="border-collapse:collapse;width:100%;margin:10px 0">
    <thead>
      <tr style="background:#f1f5f9">
        <th style="padding:8px 12px;border:1px solid #e2e8f0">#</th>
        <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:left">Region</th>
        <th style="padding:8px 12px;border:1px solid #e2e8f0;text-align:right">Leadů</th>
      </tr>
    </thead>
    <tbody>
      ${topRegionRows || '<tr><td colspan="3" style="padding:8px 12px;border:1px solid #e2e8f0;text-align:center">Žádné leady</td></tr>'}
    </tbody>
  </table>

  <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0">
  <p style="font-size:12px;color:#94a3b8">Automatický digest z webu vykoupim-nemovitost.cz. Každé pondělí v 09:00 CET.</p>
</body>
</html>`;
}

/* ------------------------------------------------------------------ */
/*  Telegram message                                                   */
/* ------------------------------------------------------------------ */

export function formatTelegramMessage(
  m: WeeklyMetrics,
  dateStr: string,
): string {
  const topRegionsText =
    m.topRegions.length > 0
      ? m.topRegions
          .map((r, i) => `  ${i + 1}. ${r.region}: ${r.count}`)
          .join("\n")
      : "  (žádné leady)";

  return [
    `📊 <b>Týdenní digest — ${dateStr}</b>`,
    "",
    `📈 Leady: <b>${m.totalLeads}</b> ${trendPct(m.totalLeads, m.prev.totalLeads)}`,
    `⭐ Avg skóre: <b>${m.avgScore}</b> ${trendDiff(m.avgScore, m.prev.avgScore)}`,
    `🏆 Top regiony:`,
    topRegionsText,
  ].join("\n");
}
