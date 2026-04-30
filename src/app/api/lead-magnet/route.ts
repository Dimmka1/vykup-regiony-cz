import "server-only";
import { NextResponse } from "next/server";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestCounter = new Map<string, { count: number; start: number }>();

const emailSchema = z.object({
  email: z.string().email(),
});

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? (forwarded.split(",")[0]?.trim() ?? "unknown") : "unknown";
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

async function sendTelegramNotification(email: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[lead-magnet] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  const text = [
    "📚 <b>Lead magnet download!</b>",
    "",
    `📧 <b>Email:</b> ${email}`,
    `🕐 <b>Čas:</b> ${new Date().toISOString()}`,
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
    console.error("[lead-magnet] Telegram failed:", {
      status: res.status,
      body,
    });
  }
}

async function sendToWebhook(email: string): Promise<void> {
  const webhookUrl = process.env.LEAD_MAGNET_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[lead-magnet] LEAD_MAGNET_WEBHOOK_URL not set, skipping webhook",
    );
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      type: "lead-magnet",
      source: "pruvodce-vykupem",
      timestamp: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[lead-magnet] Webhook failed:", {
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
    const result = emailSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { email } = result.data;

    await Promise.allSettled([
      sendTelegramNotification(email),
      sendToWebhook(email),
    ]);

    return NextResponse.json({
      ok: true,
      pdfUrl: "/docs/pruvodce-vykupem.pdf",
    });
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
