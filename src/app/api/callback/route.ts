import { NextResponse } from "next/server";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

const requestCounter = new Map<string, { count: number; start: number }>();

const callbackBookingSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slot: z.string().regex(/^\d{2}:\d{2}$/),
});

type CallbackBooking = z.infer<typeof callbackBookingSchema>;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const current = requestCounter.get(clientIp);

  if (!current || now - current.start > RATE_LIMIT_WINDOW_MS) {
    requestCounter.set(clientIp, { count: 1, start: now });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return true;
  }

  current.count += 1;
  return false;
}

async function sendToGoogleSheets(
  booking: CallbackBooking,
  leadId: string,
  timestamp: string,
): Promise<void> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[callback] LEAD_WEBHOOK_URL not set");
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lead_id: leadId,
      timestamp,
      type: "callback_scheduled",
      name: booking.name,
      phone: booking.phone,
      day: booking.day,
      slot: booking.slot,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[callback] Google Sheets webhook failed:", {
      leadId,
      status: res.status,
      body,
    });
  }
}

async function sendTelegramNotification(
  booking: CallbackBooking,
  leadId: string,
  timestamp: string,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[callback] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return;
  }

  const text = [
    "📅 <b>Naplánovaný hovor!</b>",
    "",
    `👤 <b>Jméno:</b> ${booking.name}`,
    `📞 <b>Telefon:</b> ${booking.phone}`,
    `📆 <b>Den:</b> ${booking.day}`,
    `🕐 <b>Čas:</b> ${booking.slot}`,
    `⏰ <b>Vytvořeno:</b> ${timestamp}`,
    `🆔 <b>ID:</b> ${leadId}`,
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
    console.error("[callback] Telegram failed:", {
      leadId,
      status: res.status,
      body,
    });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429 },
      );
    }

    const payload: unknown = await request.json();
    const result = callbackBookingSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const booking = result.data;
    const leadId = `sched_${Date.now().toString(36)}`;
    const timestamp = new Date().toISOString();

    const results = await Promise.allSettled([
      sendToGoogleSheets(booking, leadId, timestamp),
      sendTelegramNotification(booking, leadId, timestamp),
    ]);

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        const names = ["sheets", "telegram"];
        console.error(`[callback] ${names[i]} failed:`, r.reason);
      }
    });

    return NextResponse.json({ ok: true, lead_id: leadId }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
