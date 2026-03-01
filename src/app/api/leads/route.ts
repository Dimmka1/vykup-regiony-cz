import { NextResponse } from "next/server";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const requestCounter = new Map<string, { count: number; start: number }>();

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/),
  property_type: z.string().min(2),
  region: z.string().min(2),
  situation_type: z.string().min(2),
  consent_gdpr: z.literal(true),
  website: z.string().optional(),
});

type LeadData = z.infer<typeof leadSchema>;

interface LeadNotificationPayload {
  lead_id: string;
  timestamp: string;
  ip: string;
  data: Omit<LeadData, "website" | "consent_gdpr">;
}

function sendWebhookNotification(payload: LeadNotificationPayload): void {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[lead-notify] LEAD_WEBHOOK_URL not set. Lead data:",
      JSON.stringify(payload),
    );
    return;
  }

  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((error: unknown) => {
    console.error("[lead-notify] Webhook failed:", {
      url: webhookUrl,
      lead_id: payload.lead_id,
      error: error instanceof Error ? error.message : String(error),
    });
  });
}

function sendEmailNotification(payload: LeadNotificationPayload): void {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    return;
  }

  const { data } = payload;
  const htmlBody = [
    `<h2>Nový lead – ${data.name}</h2>`,
    "<table>",
    `<tr><td><strong>Jméno:</strong></td><td>${data.name}</td></tr>`,
    `<tr><td><strong>Telefon:</strong></td><td>${data.phone}</td></tr>`,
    `<tr><td><strong>Typ nemovitosti:</strong></td><td>${data.property_type}</td></tr>`,
    `<tr><td><strong>Region:</strong></td><td>${data.region}</td></tr>`,
    `<tr><td><strong>Situace:</strong></td><td>${data.situation_type}</td></tr>`,
    `<tr><td><strong>IP:</strong></td><td>${payload.ip}</td></tr>`,
    `<tr><td><strong>Čas:</strong></td><td>${payload.timestamp}</td></tr>`,
    "</table>",
  ].join("\n");

  fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Výkup Regiony <noreply@vykup-regiony.cz>",
      to: [notifyEmail],
      subject: `Nový lead: ${data.name} – ${data.region}`,
      html: htmlBody,
    }),
  }).catch((error: unknown) => {
    console.error("[lead-notify] Email failed:", {
      lead_id: payload.lead_id,
      error: error instanceof Error ? error.message : String(error),
    });
  });
}

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
  requestCounter.set(clientIp, current);
  return false;
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

    if (
      typeof (payload as Record<string, unknown>).website === "string" &&
      ((payload as Record<string, unknown>).website as string).trim().length > 0
    ) {
      return NextResponse.json(
        { ok: true, lead_id: "honeypot-discarded" },
        { status: 200 },
      );
    }

    const result = leadSchema.safeParse(payload);
    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const leadId = `lead_${Date.now().toString(36)}`;
    const validatedData = result.data;

    const notificationPayload: LeadNotificationPayload = {
      lead_id: leadId,
      timestamp: new Date().toISOString(),
      ip: clientIp,
      data: {
        name: validatedData.name,
        phone: validatedData.phone,
        property_type: validatedData.property_type,
        region: validatedData.region,
        situation_type: validatedData.situation_type,
      },
    };

    // Fire-and-forget: don't block client response
    sendWebhookNotification(notificationPayload);
    sendEmailNotification(notificationPayload);

    return NextResponse.json(
      { ok: true, lead_id: leadId, message: "Lead accepted" },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { ok: false, code: "DELIVERY_ERROR" },
      { status: 500 },
    );
  }
}
