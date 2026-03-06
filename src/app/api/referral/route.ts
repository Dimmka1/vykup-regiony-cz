import { appendFileSync } from "node:fs";
import { NextResponse } from "next/server";
import { z } from "zod";

const PHONE_REGEX = /^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;

const referralSchema = z.object({
  recommender_name: z.string().min(2),
  recommender_phone: z.string().regex(PHONE_REGEX),
  referral_name: z.string().min(2),
  referral_phone: z.string().regex(PHONE_REGEX),
});

type ReferralData = z.infer<typeof referralSchema>;

interface ReferralPayload {
  referral_id: string;
  timestamp: string;
  ip: string;
  data: ReferralData;
}

async function sendWebhook(payload: ReferralPayload): Promise<void> {
  const webhookUrl = process.env.REFERRAL_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn(
      "[referral] REFERRAL_WEBHOOK_URL not set. Data:",
      JSON.stringify(payload),
    );
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[referral] Webhook failed:", { status: res.status, body });
  }
}

async function sendTelegramNotification(
  payload: ReferralPayload,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[referral] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return;
  }

  const { data } = payload;
  const text = [
    "🤝 <b>Nové doporučení!</b>",
    "",
    "<b>Doporučitel:</b>",
    `👤 ${data.recommender_name}`,
    `📞 ${data.recommender_phone}`,
    "",
    "<b>Doporučená osoba:</b>",
    `👤 ${data.referral_name}`,
    `📞 ${data.referral_phone}`,
    "",
    `🕐 <b>Čas:</b> ${payload.timestamp}`,
    `🆔 <b>ID:</b> ${payload.referral_id}`,
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
    console.error("[referral] Telegram failed:", { status: res.status, body });
  }
}

function saveToFile(payload: ReferralPayload): void {
  try {
    appendFileSync(
      "/tmp/referrals-backup.json",
      JSON.stringify(payload) + "\n",
    );
  } catch (error: unknown) {
    console.error("[referral] File write failed:", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? (forwarded.split(",")[0]?.trim() ?? "unknown") : "unknown";
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const result = referralSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const referralId = `ref_${Date.now().toString(36)}`;
    const payload: ReferralPayload = {
      referral_id: referralId,
      timestamp: new Date().toISOString(),
      ip: getClientIp(request),
      data: result.data,
    };

    const results = await Promise.allSettled([
      sendWebhook(payload),
      sendTelegramNotification(payload),
    ]);

    results.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[referral] Notification ${i} failed:`, r.reason);
      }
    });

    saveToFile(payload);

    return NextResponse.json(
      { ok: true, referral_id: referralId, message: "Referral accepted" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, code: "DELIVERY_ERROR" },
      { status: 500 },
    );
  }
}
