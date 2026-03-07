import { NextResponse } from "next/server";

/**
 * Lead Response SLA Cron — runs every 5 minutes via Vercel Cron.
 *
 * Flow:
 * 1. GET Google Sheets webhook with ?action=uncontacted-leads
 *    → returns leads where created_at > 5 min ago AND contacted_at is empty
 *    → each lead: lead_id, name, phone, region, created_at, sla_reminders_sent, row_index
 * 2. For each lead with sla_reminders_sent < 3:
 *    a. Send Telegram SLA reminder
 *    b. POST webhook to increment sla_reminders_sent
 */

const MAX_REMINDERS = 3;
const SLA_THRESHOLD_MINUTES = 5;

interface UncontactedLead {
  lead_id: string;
  name: string;
  phone: string;
  region: string;
  created_at: string;
  sla_reminders_sent: number;
  row_index: number;
}

function getMinutesSince(isoDate: string): number {
  const created = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.round((now - created) / 60_000);
}

async function sendTelegramSlaReminder(
  lead: UncontactedLead,
  minutesElapsed: number,
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[lead-sla] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return false;
  }

  const reminderNum = lead.sla_reminders_sent + 1;
  const text = [
    `⚠️ <b>SLA Reminder #${reminderNum}</b>`,
    "",
    `Lead <b>${lead.lead_id}</b> (${lead.region}, ${lead.phone}) не обработан уже <b>${minutesElapsed} мин</b>!`,
    "",
    `👤 ${lead.name}`,
    `📞 ${lead.phone}`,
    `📍 ${lead.region}`,
    `🕐 Создан: ${lead.created_at}`,
    "",
    reminderNum >= MAX_REMINDERS
      ? "🔴 Последнее напоминание!"
      : `⏳ Осталось напоминаний: ${MAX_REMINDERS - reminderNum}`,
  ].join("\n");

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
    console.error("[lead-sla] Telegram send failed:", {
      lead_id: lead.lead_id,
      status: res.status,
      body,
    });
    return false;
  }

  return true;
}

async function incrementReminderCount(
  webhookUrl: string,
  rowIndex: number,
): Promise<void> {
  const url = new URL(webhookUrl);
  url.searchParams.set("action", "increment-sla-reminder");
  url.searchParams.set("row", String(rowIndex));

  const res = await fetch(url.toString(), { method: "POST" });

  if (!res.ok) {
    const body = await res.text();
    console.error("[lead-sla] Failed to increment reminder count:", {
      rowIndex,
      status: res.status,
      body,
    });
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("[lead-sla] GOOGLE_SHEETS_WEBHOOK_URL not set");
    return NextResponse.json(
      {
        ok: false,
        code: "CONFIG_ERROR",
        message: "GOOGLE_SHEETS_WEBHOOK_URL not set",
      },
      { status: 500 },
    );
  }

  try {
    // Fetch uncontacted leads from Google Sheets via webhook
    const fetchUrl = new URL(webhookUrl);
    fetchUrl.searchParams.set("action", "uncontacted-leads");

    const sheetsRes = await fetch(fetchUrl.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!sheetsRes.ok) {
      const body = await sheetsRes.text();
      console.error("[lead-sla] Failed to fetch uncontacted leads:", {
        status: sheetsRes.status,
        body,
      });
      return NextResponse.json(
        { ok: false, code: "SHEETS_ERROR" },
        { status: 502 },
      );
    }

    const leads: UncontactedLead[] = await sheetsRes.json();

    if (!Array.isArray(leads)) {
      console.error("[lead-sla] Invalid response from Sheets webhook:", leads);
      return NextResponse.json(
        { ok: false, code: "INVALID_RESPONSE" },
        { status: 502 },
      );
    }

    let remindersSent = 0;
    let skippedMaxReminders = 0;
    let skippedTooRecent = 0;

    for (const lead of leads) {
      const minutesElapsed = getMinutesSince(lead.created_at);

      // Skip leads created less than SLA threshold ago
      if (minutesElapsed < SLA_THRESHOLD_MINUTES) {
        skippedTooRecent++;
        continue;
      }

      // Skip leads that already received max reminders (anti-spam AC-3)
      if (lead.sla_reminders_sent >= MAX_REMINDERS) {
        skippedMaxReminders++;
        continue;
      }

      const sent = await sendTelegramSlaReminder(lead, minutesElapsed);

      if (sent) {
        await incrementReminderCount(webhookUrl, lead.row_index);
        remindersSent++;
      }
    }

    console.log("[lead-sla] Cron completed:", {
      totalLeads: leads.length,
      remindersSent,
      skippedMaxReminders,
      skippedTooRecent,
    });

    return NextResponse.json({
      ok: true,
      totalLeads: leads.length,
      remindersSent,
      skippedMaxReminders,
      skippedTooRecent,
    });
  } catch (error: unknown) {
    console.error("[lead-sla] Cron error:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { ok: false, code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
