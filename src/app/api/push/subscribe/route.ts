import { NextResponse } from "next/server";
import { z } from "zod";

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();
    const result = subscribeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const { endpoint, p256dh, auth } = result.data;
    const webhookUrl = process.env.PUSH_SUBSCRIBERS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error(
        "[push-subscribe] PUSH_SUBSCRIBERS_WEBHOOK_URL not configured",
      );
      return NextResponse.json(
        { ok: false, code: "SERVER_CONFIG_ERROR" },
        { status: 500 },
      );
    }

    const payload = {
      endpoint,
      p256dh,
      auth,
      created_at: new Date().toISOString(),
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[push-subscribe] Webhook failed:", {
        status: res.status,
        body: text,
      });
      return NextResponse.json(
        { ok: false, code: "WEBHOOK_ERROR" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
