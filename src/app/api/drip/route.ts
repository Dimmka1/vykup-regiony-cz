import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { sendSms, SMS_TEMPLATES } from "@/lib/sms";

/**
 * Vercel Cron handler for email + SMS drip sequences.
 * Called daily via vercel.json cron config.
 *
 * Redis subscriber record shape:
 * key: `subscriber:{lead_id}`
 * value: {
 *   phone: string;
 *   email?: string;
 *   sms_consent: boolean;
 *   created_at: string; // ISO date
 *   email_sent_days: number[];
 *   sms_sent_days: number[];
 * }
 */

interface Subscriber {
  phone: string;
  email?: string;
  sms_consent: boolean;
  created_at: string;
  email_sent_days: number[];
  sms_sent_days: number[];
}

const SMS_DRIP_SCHEDULE: {
  day: number;
  template: keyof typeof SMS_TEMPLATES;
}[] = [
  { day: 2, template: "drip_day_2" },
  { day: 5, template: "drip_day_5" },
];

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function daysSinceCreation(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    console.warn("[drip] Redis not configured — skipping drip");
    return NextResponse.json({ ok: false, error: "Redis not configured" });
  }

  try {
    // Scan for all subscriber keys
    const keys: string[] = [];
    let cursor = "0";
    do {
      const [nextCursor, batch] = await redis.scan(cursor, {
        match: "subscriber:*",
        count: 100,
      });
      cursor = String(nextCursor);
      keys.push(...batch);
    } while (cursor !== "0");

    let smsSent = 0;

    for (const key of keys) {
      const subscriber = (await redis.get(key)) as Subscriber | null;
      if (!subscriber) continue;

      const dayAge = daysSinceCreation(subscriber.created_at);

      // SMS drip
      if (subscriber.sms_consent && subscriber.phone) {
        for (const schedule of SMS_DRIP_SCHEDULE) {
          if (
            dayAge >= schedule.day &&
            !subscriber.sms_sent_days.includes(schedule.day)
          ) {
            const result = await sendSms({
              to: subscriber.phone,
              text: SMS_TEMPLATES[schedule.template],
            });

            if (result.ok) {
              subscriber.sms_sent_days.push(schedule.day);
              await redis.set(key, subscriber);
              smsSent++;
              console.log("[drip] SMS sent:", {
                key,
                day: schedule.day,
                messageId: result.messageId,
              });
            }
          }
        }
      }
    }

    return NextResponse.json({
      ok: true,
      processed: keys.length,
      sms_sent: smsSent,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[drip] Error:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
