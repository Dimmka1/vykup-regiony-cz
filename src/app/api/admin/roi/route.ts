import { NextResponse } from "next/server";
import { z } from "zod";
import { validateAdminAuth } from "@/lib/admin-auth";
import {
  getSheetValues,
  updateSheetValues,
  appendSheetValues,
} from "@/lib/google-sheets";
import {
  CHANNELS,
  type Channel,
  type ChannelData,
  type RoiResponse,
  mapUtmToChannel,
} from "@/lib/roi-types";

/** Sheet tab "Leads" expected columns: timestamp, name, phone, ..., utm_source, status */
const LEADS_RANGE = "Leads!A:Z";
/** Sheet tab "ROI_Spend" columns: month, channel, spend */
const SPEND_RANGE = "ROI_Spend!A:Z";

const spendSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, "Month must be YYYY-MM format"),
  channel: z.enum(CHANNELS),
  spend: z.number().min(0),
});

function getMonthRange(month: string): { start: Date; end: Date } {
  const [year, mon] = month.split("-").map(Number) as [number, number];
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 0, 23, 59, 59, 999);
  return { start, end };
}

function countLeadsByChannel(
  rows: string[][],
  month: string,
): Record<Channel, { leads: number; deals: number }> {
  const result: Record<Channel, { leads: number; deals: number }> =
    {} as Record<Channel, { leads: number; deals: number }>;
  for (const ch of CHANNELS) {
    result[ch] = { leads: 0, deals: 0 };
  }

  if (rows.length === 0) return result;

  // Find header row to locate utm_source and status columns
  const header = rows[0]?.map((h) => h.toLowerCase().trim()) ?? [];
  const utmIdx = header.findIndex(
    (h) => h === "utm_source" || h === "utmsource" || h === "source",
  );
  const statusIdx = header.findIndex((h) => h === "status" || h === "stav");
  const dateIdx = header.findIndex(
    (h) =>
      h === "timestamp" ||
      h === "date" ||
      h === "datum" ||
      h === "created" ||
      h === "cas",
  );

  if (dateIdx === -1) return result;

  const { start, end } = getMonthRange(month);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[dateIdx]) continue;

    const rowDate = new Date(row[dateIdx]);
    if (isNaN(rowDate.getTime())) continue;
    if (rowDate < start || rowDate > end) continue;

    const utmSource = utmIdx >= 0 ? (row[utmIdx] ?? "") : "";
    const channel = mapUtmToChannel(utmSource);
    result[channel].leads += 1;

    // Count as deal if status indicates conversion
    const status = statusIdx >= 0 ? (row[statusIdx] ?? "").toLowerCase() : "";
    if (
      status === "deal" ||
      status === "converted" ||
      status === "won" ||
      status === "obchod"
    ) {
      result[channel].deals += 1;
    }
  }

  return result;
}

function parseSpendData(
  rows: string[][],
  month: string,
): Record<Channel, number> {
  const result: Record<Channel, number> = {} as Record<Channel, number>;
  for (const ch of CHANNELS) {
    result[ch] = 0;
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row[0] !== month) continue;

    const channel = row[1] as Channel;
    if (CHANNELS.includes(channel)) {
      result[channel] = parseFloat(row[2] ?? "0") || 0;
    }
  }

  return result;
}

export async function GET(request: Request): Promise<NextResponse> {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const month =
    searchParams.get("month") ?? new Date().toISOString().slice(0, 7);

  try {
    const [leadsRows, spendRows] = await Promise.all([
      getSheetValues(LEADS_RANGE),
      getSheetValues(SPEND_RANGE),
    ]);

    const leadCounts = countLeadsByChannel(leadsRows, month);
    const spendData = parseSpendData(spendRows, month);

    const channels: ChannelData[] = CHANNELS.map((ch) => {
      const spend = spendData[ch];
      const leads = leadCounts[ch].leads;
      const deals = leadCounts[ch].deals;
      return {
        channel: ch,
        spend,
        leads,
        deals,
        cpl: leads > 0 ? Math.round(spend / leads) : null,
        cpa: deals > 0 ? Math.round(spend / deals) : null,
      };
    });

    const totals = channels.reduce(
      (acc, ch) => ({
        spend: acc.spend + ch.spend,
        leads: acc.leads + ch.leads,
        deals: acc.deals + ch.deals,
        cpl: null as number | null,
        cpa: null as number | null,
      }),
      {
        spend: 0,
        leads: 0,
        deals: 0,
        cpl: null as number | null,
        cpa: null as number | null,
      },
    );
    totals.cpl =
      totals.leads > 0 ? Math.round(totals.spend / totals.leads) : null;
    totals.cpa =
      totals.deals > 0 ? Math.round(totals.spend / totals.deals) : null;

    const response: RoiResponse = { month, channels, totals };
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("[roi] GET error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const body: unknown = await request.json();
    const parsed = spendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation error", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const { month, channel, spend } = parsed.data;

    // Check if row already exists, update it; otherwise append
    const spendRows = await getSheetValues(SPEND_RANGE);
    let found = false;

    for (let i = 1; i < spendRows.length; i++) {
      const row = spendRows[i];
      if (row && row[0] === month && row[1] === channel) {
        // Update existing row (i+1 because Sheets is 1-indexed)
        const cellRange = `ROI_Spend!C${i + 1}`;
        await updateSheetValues(cellRange, [[spend.toString()]]);
        found = true;
        break;
      }
    }

    if (!found) {
      await appendSheetValues("ROI_Spend!A:C", [
        [month, channel, spend.toString()],
      ]);
    }

    return NextResponse.json({ ok: true, month, channel, spend });
  } catch (error: unknown) {
    console.error("[roi] POST error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
