import { NextResponse } from "next/server";
import { z } from "zod";

const callEventSchema = z.object({
  phone_from: z.string().min(1),
  phone_to: z.string().min(1),
  duration: z.number().int().nonnegative(),
  timestamp: z.string().min(1),
  call_id: z.string().min(1),
  // Optional fields for future use
  utm_source: z.string().optional(),
  recording_url: z.string().url().optional(),
  status: z.enum(["answered", "missed", "voicemail"]).optional(),
});

/**
 * POST /api/webhooks/calls
 *
 * Receives call events from external call tracking providers.
 * Logs to Google Sheets (if configured) and sends Telegram notification.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = callEventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const call = result.data;

    // Log to console for debugging
    console.log("[call-webhook] Received call event:", JSON.stringify(call));

    // Run logging tasks in parallel
    const tasks: Promise<void>[] = [];

    // 1. Google Sheets logging
    tasks.push(
      logToGoogleSheets(call).catch((err) => {
        console.error("[call-webhook] Google Sheets error:", err);
      }),
    );

    // 2. Telegram notification
    tasks.push(
      sendTelegramNotification(call).catch((err) => {
        console.error("[call-webhook] Telegram error:", err);
      }),
    );

    await Promise.allSettled(tasks);

    return NextResponse.json({ ok: true, call_id: call.call_id });
  } catch (error) {
    console.error("[call-webhook] Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

type CallEvent = z.infer<typeof callEventSchema>;

/**
 * Log call event to Google Sheets.
 * Requires GOOGLE_SHEETS_WEBHOOK_URL env var (Apps Script Web App URL).
 *
 * Setup: Create a Google Apps Script that accepts POST with call data
 * and appends a row to the "Calls" sheet. Deploy as Web App.
 */
async function logToGoogleSheets(call: CallEvent): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_CALLS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[call-webhook] GOOGLE_SHEETS_CALLS_WEBHOOK_URL not set, skipping Sheets logging",
    );
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      call_id: call.call_id,
      phone_from: call.phone_from,
      phone_to: call.phone_to,
      duration: call.duration,
      timestamp: call.timestamp,
      utm_source: call.utm_source || "unknown",
      status: call.status || "answered",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets responded with ${response.status}`);
  }
}

/**
 * Send Telegram notification about incoming call.
 * Uses existing TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID env vars.
 */
async function sendTelegramNotification(call: CallEvent): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[call-webhook] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set, skipping notification",
    );
    return;
  }

  const duration = call.duration
    ? `${Math.floor(call.duration / 60)}m ${call.duration % 60}s`
    : "N/A";

  const statusEmoji =
    call.status === "missed" ? "🔴" : call.status === "voicemail" ? "📩" : "📞";

  const message = [
    `${statusEmoji} *Příchozí hovor*`,
    "",
    `📱 Od: \`${call.phone_from}\``,
    `📞 Na: \`${call.phone_to}\``,
    `⏱ Délka: ${duration}`,
    `🕐 Čas: ${call.timestamp}`,
    call.utm_source ? `🏷 Zdroj: ${call.utm_source}` : "",
    `🔑 ID: \`${call.call_id}\``,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Telegram API error: ${response.status} ${errorText}`);
  }
}
