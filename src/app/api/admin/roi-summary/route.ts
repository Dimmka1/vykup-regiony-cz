import { NextResponse } from "next/server";
import { validateAdminAuth } from "@/lib/admin-auth";
import { getSheetValues } from "@/lib/google-sheets";
import {
  CHANNELS,
  CHANNEL_LABELS,
  type Channel,
  type ChannelData,
  mapUtmToChannel,
} from "@/lib/roi-types";

const LEADS_RANGE = "Leads!A:Z";
const SPEND_RANGE = "ROI_Spend!A:Z";

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
  const result = {} as Record<Channel, { leads: number; deals: number }>;
  for (const ch of CHANNELS) {
    result[ch] = { leads: 0, deals: 0 };
  }

  if (rows.length === 0) return result;

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
    if (isNaN(rowDate.getTime()) || rowDate < start || rowDate > end) continue;

    const utmSource = utmIdx >= 0 ? (row[utmIdx] ?? "") : "";
    const channel = mapUtmToChannel(utmSource);
    result[channel].leads += 1;

    const status = statusIdx >= 0 ? (row[statusIdx] ?? "").toLowerCase() : "";
    if (["deal", "converted", "won", "obchod"].includes(status)) {
      result[channel].deals += 1;
    }
  }

  return result;
}

function parseSpendData(
  rows: string[][],
  month: string,
): Record<Channel, number> {
  const result = {} as Record<Channel, number>;
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

async function sendTelegramMessage(text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
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
    throw new Error(`Telegram API error: ${res.status} ${body}`);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const authError = validateAdminAuth(request);
  if (authError) return authError;

  try {
    const month = new Date().toISOString().slice(0, 7);

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

    // Find best/worst by CPL (only channels with spend > 0 and leads > 0)
    const withCpl = channels.filter((c) => c.cpl !== null && c.spend > 0);
    const bestChannel =
      withCpl.length > 0
        ? withCpl.reduce((a, b) =>
            (a.cpl ?? Infinity) < (b.cpl ?? Infinity) ? a : b,
          )
        : null;
    const worstChannel =
      withCpl.length > 0
        ? withCpl.reduce((a, b) => ((a.cpl ?? 0) > (b.cpl ?? 0) ? a : b))
        : null;

    const totalSpend = channels.reduce((s, c) => s + c.spend, 0);
    const totalLeads = channels.reduce((s, c) => s + c.leads, 0);
    const totalDeals = channels.reduce((s, c) => s + c.deals, 0);

    const lines = [
      "📊 <b>Weekly ROI Summary</b>",
      `📅 Month: <b>${month}</b>`,
      "",
      ...channels
        .filter((c) => c.spend > 0 || c.leads > 0)
        .map(
          (c) =>
            `• <b>${CHANNEL_LABELS[c.channel]}</b>: ${c.leads} leads, ${c.spend.toLocaleString("cs-CZ")} Kč → CPL ${c.cpl !== null ? c.cpl.toLocaleString("cs-CZ") + " Kč" : "N/A"}`,
        ),
      "",
      `💰 Total: ${totalSpend.toLocaleString("cs-CZ")} Kč spend, ${totalLeads} leads, ${totalDeals} deals`,
      `📈 Avg CPL: ${totalLeads > 0 ? Math.round(totalSpend / totalLeads).toLocaleString("cs-CZ") + " Kč" : "N/A"}`,
      "",
      bestChannel
        ? `✅ Best: <b>${CHANNEL_LABELS[bestChannel.channel]}</b> (CPL ${bestChannel.cpl?.toLocaleString("cs-CZ")} Kč)`
        : "",
      worstChannel && worstChannel.channel !== bestChannel?.channel
        ? `⚠️ Worst: <b>${CHANNEL_LABELS[worstChannel.channel]}</b> (CPL ${worstChannel.cpl?.toLocaleString("cs-CZ")} Kč)`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    await sendTelegramMessage(lines);

    return NextResponse.json({ ok: true, message: "Summary sent to Telegram" });
  } catch (error: unknown) {
    console.error("[roi-summary] Error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
