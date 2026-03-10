import { NextResponse } from "next/server";
import { readRange, appendRows } from "@/lib/google-sheets";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface RegionWeekData {
  region: string;
  leads: number;
  visitors: number;
  cr: number;
}

interface WeeklyReport {
  weekStart: string;
  regions: RegionWeekData[];
  totalLeads: number;
  totalVisitors: number;
  totalCr: number;
}

interface WowEntry {
  region: string;
  currentLeads: number;
  previousLeads: number;
  currentCr: number;
  previousCr: number;
  crChange: number;
  leadsChange: number;
}

/* ------------------------------------------------------------------ */
/*  Config                                                            */
/* ------------------------------------------------------------------ */

const LEADS_SHEET = "Leads";
const CR_HISTORY_SHEET = "CR_History";
const VISITORS_SHEET = "Visitors";
const CR_DROP_THRESHOLD = -20;

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function getWeekBounds(weeksAgo: number): { start: Date; end: Date } {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const thisMonday = new Date(now);
  thisMonday.setUTCDate(now.getUTCDate() + mondayOffset);
  thisMonday.setUTCHours(0, 0, 0, 0);

  const start = new Date(thisMonday);
  start.setUTCDate(start.getUTCDate() - weeksAgo * 7);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);

  return { start, end };
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0] ?? "";
}

function pct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

/* ------------------------------------------------------------------ */
/*  Data fetching                                                     */
/* ------------------------------------------------------------------ */

async function getLeadsByWeek(weeksAgo: number): Promise<Map<string, number>> {
  const { start, end } = getWeekBounds(weeksAgo);
  const startStr = formatDate(start);
  const endStr = formatDate(end);

  // Leads sheet expected format: Date | Region | Name | Phone | ...
  const rows = await readRange(`${LEADS_SHEET}!A:B`);
  const counts = new Map<string, number>();

  for (const row of rows) {
    const dateStr = row[0];
    const region = row[1];
    if (!dateStr || !region) continue;

    // Skip header
    if (dateStr.toLowerCase() === "date") continue;

    if (dateStr >= startStr && dateStr < endStr) {
      counts.set(region, (counts.get(region) ?? 0) + 1);
    }
  }

  return counts;
}

async function getVisitorsByWeek(
  weeksAgo: number,
): Promise<Map<string, number>> {
  const { start, end } = getWeekBounds(weeksAgo);
  const startStr = formatDate(start);
  const endStr = formatDate(end);

  try {
    // Visitors sheet expected format: Date | Region | Count
    const rows = await readRange(`${VISITORS_SHEET}!A:C`);
    const counts = new Map<string, number>();

    for (const row of rows) {
      const dateStr = row[0];
      const region = row[1];
      const count = row[2];
      if (!dateStr || !region || !count) continue;
      if (dateStr.toLowerCase() === "date") continue;

      if (dateStr >= startStr && dateStr < endStr) {
        counts.set(region, (counts.get(region) ?? 0) + Number(count));
      }
    }

    return counts;
  } catch {
    // Visitors sheet might not exist — fallback to empty
    console.warn(
      "[cr-report] Visitors sheet not available, using leads-only mode",
    );
    return new Map<string, number>();
  }
}

function buildWeekData(
  leads: Map<string, number>,
  visitors: Map<string, number>,
  weeksAgo: number,
): WeeklyReport {
  const { start } = getWeekBounds(weeksAgo);
  const allRegions = new Set([...leads.keys(), ...visitors.keys()]);
  const regions: RegionWeekData[] = [];

  let totalLeads = 0;
  let totalVisitors = 0;

  for (const region of allRegions) {
    const regionLeads = leads.get(region) ?? 0;
    const regionVisitors = visitors.get(region) ?? 0;
    const cr = regionVisitors > 0 ? (regionLeads / regionVisitors) * 100 : 0;

    regions.push({ region, leads: regionLeads, visitors: regionVisitors, cr });
    totalLeads += regionLeads;
    totalVisitors += regionVisitors;
  }

  regions.sort((a, b) => b.leads - a.leads);

  const totalCr = totalVisitors > 0 ? (totalLeads / totalVisitors) * 100 : 0;

  return {
    weekStart: formatDate(start),
    regions,
    totalLeads,
    totalVisitors,
    totalCr,
  };
}

/* ------------------------------------------------------------------ */
/*  WoW comparison                                                    */
/* ------------------------------------------------------------------ */

function compareWeeks(
  current: WeeklyReport,
  previous: WeeklyReport,
): WowEntry[] {
  const allRegions = new Set([
    ...current.regions.map((r) => r.region),
    ...previous.regions.map((r) => r.region),
  ]);

  const prevMap = new Map(previous.regions.map((r) => [r.region, r]));
  const currMap = new Map(current.regions.map((r) => [r.region, r]));

  const entries: WowEntry[] = [];

  for (const region of allRegions) {
    const curr = currMap.get(region);
    const prev = prevMap.get(region);

    const currentLeads = curr?.leads ?? 0;
    const previousLeads = prev?.leads ?? 0;
    const currentCr = curr?.cr ?? 0;
    const previousCr = prev?.cr ?? 0;

    const crChange =
      previousCr > 0 ? ((currentCr - previousCr) / previousCr) * 100 : 0;
    const leadsChange =
      previousLeads > 0
        ? ((currentLeads - previousLeads) / previousLeads) * 100
        : currentLeads > 0
          ? 100
          : 0;

    entries.push({
      region,
      currentLeads,
      previousLeads,
      currentCr,
      previousCr,
      crChange,
      leadsChange,
    });
  }

  entries.sort((a, b) => b.currentLeads - a.currentLeads);
  return entries;
}

/* ------------------------------------------------------------------ */
/*  Telegram message                                                  */
/* ------------------------------------------------------------------ */

function buildTelegramMessage(
  current: WeeklyReport,
  previous: WeeklyReport,
  entries: WowEntry[],
  hasVisitorData: boolean,
): string {
  const totalLeadsChange =
    previous.totalLeads > 0
      ? ((current.totalLeads - previous.totalLeads) / previous.totalLeads) * 100
      : 0;

  const totalCrChange =
    previous.totalCr > 0
      ? ((current.totalCr - previous.totalCr) / previous.totalCr) * 100
      : 0;

  const hasAlert = hasVisitorData
    ? totalCrChange < CR_DROP_THRESHOLD
    : totalLeadsChange < CR_DROP_THRESHOLD;

  const headerEmoji = hasAlert ? "🔴" : "📊";
  const alertLine = hasAlert
    ? "\n⚠️ <b>ALERT: Significant drop detected! Immediate action required.</b>\n"
    : "";

  const lines: string[] = [
    `${headerEmoji} <b>Weekly CR Report — ${current.weekStart}</b>`,
    alertLine,
    `<b>Total:</b> ${current.totalLeads} leads (${pct(totalLeadsChange)} WoW)`,
  ];

  if (hasVisitorData) {
    lines.push(
      `<b>Visitors:</b> ${current.totalVisitors} | <b>CR:</b> ${current.totalCr.toFixed(2)}% (${pct(totalCrChange)} WoW)`,
    );
  }

  lines.push("", "📍 <b>Per region:</b>");

  for (const entry of entries) {
    if (entry.currentLeads === 0 && entry.previousLeads === 0) continue;

    const regionEmoji =
      hasVisitorData && entry.crChange < CR_DROP_THRESHOLD
        ? "🔴"
        : entry.leadsChange < CR_DROP_THRESHOLD
          ? "🟡"
          : "✅";

    let regionLine = `${regionEmoji} <b>${entry.region}</b>: ${entry.currentLeads} leads (${pct(entry.leadsChange)})`;

    if (hasVisitorData && entry.currentCr > 0) {
      regionLine += ` | CR ${entry.currentCr.toFixed(2)}% (${pct(entry.crChange)})`;
    }

    lines.push(regionLine);
  }

  lines.push(
    "",
    `📅 Week: ${current.weekStart} vs ${previous.weekStart}`,
    hasVisitorData
      ? "📊 Data: Google Sheets (leads + visitors)"
      : "📊 Data: Google Sheets (leads only, no visitor data)",
  );

  return lines.join("\n");
}

/* ------------------------------------------------------------------ */
/*  Telegram send                                                     */
/* ------------------------------------------------------------------ */

async function sendTelegram(text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[cr-report] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`[cr-report] Telegram failed: ${res.status} ${body}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Save to Google Sheets                                             */
/* ------------------------------------------------------------------ */

async function saveToHistory(
  current: WeeklyReport,
  entries: WowEntry[],
  hasVisitorData: boolean,
): Promise<void> {
  const rows: (string | number)[][] = [];

  for (const entry of entries) {
    rows.push([
      current.weekStart,
      entry.region,
      entry.currentLeads,
      hasVisitorData ? entry.currentCr : "N/A",
      hasVisitorData ? pct(entry.crChange) : "N/A",
      pct(entry.leadsChange),
    ]);
  }

  // Total row
  rows.push([
    current.weekStart,
    "TOTAL",
    current.totalLeads,
    hasVisitorData ? current.totalCr.toFixed(2) : "N/A",
    "—",
    "—",
  ]);

  await appendRows(`${CR_HISTORY_SHEET}!A:F`, rows);
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                     */
/* ------------------------------------------------------------------ */

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch data for current and previous week
    const [currentLeads, previousLeads, currentVisitors, previousVisitors] =
      await Promise.all([
        getLeadsByWeek(1), // last completed week
        getLeadsByWeek(2), // week before that
        getVisitorsByWeek(1),
        getVisitorsByWeek(2),
      ]);

    const hasVisitorData =
      currentVisitors.size > 0 || previousVisitors.size > 0;

    const current = buildWeekData(currentLeads, currentVisitors, 1);
    const previous = buildWeekData(previousLeads, previousVisitors, 2);
    const entries = compareWeeks(current, previous);

    // Build and send Telegram report
    const message = buildTelegramMessage(
      current,
      previous,
      entries,
      hasVisitorData,
    );
    await sendTelegram(message);

    // Save to Google Sheets history
    await saveToHistory(current, entries, hasVisitorData);

    return NextResponse.json({
      ok: true,
      weekStart: current.weekStart,
      totalLeads: current.totalLeads,
      totalVisitors: current.totalVisitors,
      totalCr: current.totalCr,
      regions: entries.length,
      hasVisitorData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[cr-report] Error:", message);

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
