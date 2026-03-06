import { appendFileSync } from "node:fs";
import { NextResponse } from "next/server";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestCounter = new Map<string, { count: number; start: number }>();

const reviewSchema = z.object({
  name: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10),
  website: z.string().optional(),
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

interface ReviewPayload {
  review_id: string;
  timestamp: string;
  ip: string;
  data: { name: string; rating: number; text: string };
}

async function sendTelegramNotification(payload: ReviewPayload): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[review-notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  const { data } = payload;
  const stars = "⭐".repeat(data.rating);
  const text = [
    `⭐ <b>Nová recenze!</b>`,
    "",
    `👤 <b>Jméno:</b> ${data.name}`,
    `⭐ <b>Hodnocení:</b> ${stars}`,
    `📝 <b>Text:</b> ${data.text}`,
    `🕐 <b>Čas:</b> ${payload.timestamp}`,
    `🆔 <b>ID:</b> ${payload.review_id}`,
  ].join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("[review-notify] Telegram failed:", {
      review_id: payload.review_id,
      status: res.status,
      body,
    });
  }
}

async function sendWebhookNotification(payload: ReviewPayload): Promise<void> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[review-notify] LEAD_WEBHOOK_URL not set");
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, type: "review" }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[review-notify] Webhook failed:", {
      review_id: payload.review_id,
      status: res.status,
      body,
    });
  }
}

function saveReviewToFile(payload: ReviewPayload): void {
  try {
    appendFileSync("/tmp/reviews-backup.json", JSON.stringify(payload) + "\n");
  } catch (error: unknown) {
    console.error("[review-backup] File write failed:", {
      review_id: payload.review_id,
      error: error instanceof Error ? error.message : String(error),
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

    // Honeypot
    if (
      typeof (payload as Record<string, unknown>).website === "string" &&
      ((payload as Record<string, unknown>).website as string).trim().length > 0
    ) {
      return NextResponse.json(
        { ok: true, review_id: "honeypot-discarded" },
        { status: 200 },
      );
    }

    const result = reviewSchema.safeParse(payload);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const reviewId = `rev_${Date.now().toString(36)}`;
    const data = result.data;

    const reviewPayload: ReviewPayload = {
      review_id: reviewId,
      timestamp: new Date().toISOString(),
      ip: clientIp,
      data: { name: data.name, rating: data.rating, text: data.text },
    };

    await Promise.allSettled([
      sendTelegramNotification(reviewPayload),
      sendWebhookNotification(reviewPayload),
    ]);

    saveReviewToFile(reviewPayload);

    return NextResponse.json(
      { ok: true, review_id: reviewId },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
