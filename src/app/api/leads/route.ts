import { appendFileSync } from "node:fs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateLeadScore } from "@/lib/lead-scoring";
import { trackEvent } from "@/lib/server-analytics";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const requestCounter = new Map<string, { count: number; start: number }>();

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/),
  property_type: z.string().min(2),
  region: z.string().min(2),
  situation_type: z.string().min(2),
  consent_gdpr: z.literal(true),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().optional(),
});

const callbackSchema = z.object({
  type: z.literal("callback"),
  phone: z.string().regex(/^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/),
  source: z.string().min(1),
  region: z.string().min(2),
});

const quickEstimateSchema = z.object({
  type: z.literal("quick-estimate"),
  phone: z.string().regex(/^(\+?420|00420)?\s?\d{3}\s?\d{3}\s?\d{3}$/),
  source: z.string().min(1),
  region: z.string().min(2),
  psc: z.string().optional(),
});

type LeadData = z.infer<typeof leadSchema>;

interface CallbackNotificationPayload {
  lead_id: string;
  timestamp: string;
  ip: string;
  data: { type: "callback"; phone: string; source: string; region: string };
}

interface LeadNotificationPayload {
  lead_id: string;
  timestamp: string;
  ip: string;
  data: Omit<LeadData, "website" | "consent_gdpr">;
}

async function sendWebhookNotification(
  payload: LeadNotificationPayload,
): Promise<void> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[lead-notify] LEAD_WEBHOOK_URL not set. Lead data:",
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
    console.error("[lead-notify] Webhook failed:", {
      url: webhookUrl,
      lead_id: payload.lead_id,
      status: res.status,
      body,
    });
  }
}

async function sendEmailNotification(
  payload: LeadNotificationPayload,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.warn("[lead-notify] RESEND_API_KEY or LEAD_NOTIFY_EMAIL not set");
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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Vykoupím Nemovitost <noreply@vykoupim-nemovitost.cz>",
      to: [notifyEmail],
      subject: `Nový lead: ${data.name} – ${data.region}`,
      html: htmlBody,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[lead-notify] Email failed:", {
      lead_id: payload.lead_id,
      status: res.status,
      body,
    });
  }
}

async function sendTelegramNotification(
  payload: LeadNotificationPayload,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[lead-notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  const { data } = payload;
  const scoring = calculateLeadScore({
    property_type: data.property_type,
    region: data.region,
    situation_type: data.situation_type,
  });
  const text = [
    `${scoring.emoji} <b>${scoring.tier.toUpperCase()} lead (${scoring.score})</b>: ${data.property_type} ${data.region}${data.situation_type !== "standard" ? ", " + data.situation_type : ""}`,
    "",
    `👤 <b>Jméno:</b> ${data.name}`,
    `📞 <b>Telefon:</b> ${data.phone}`,
    `🏘️ <b>Typ:</b> ${data.property_type}`,
    `📍 <b>Region:</b> ${data.region}`,
    `📋 <b>Situace:</b> ${data.situation_type}`,
    `🕐 <b>Čas:</b> ${payload.timestamp}`,
    `🆔 <b>ID:</b> ${payload.lead_id}`,
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
    console.error("[lead-notify] Telegram API error:", {
      lead_id: payload.lead_id,
      status: res.status,
      body,
    });
  }
}

async function sendAutoReplyEmail(
  payload: LeadNotificationPayload & { email: string },
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";
  const { data, email } = payload;

  const propertyTypeLabels: Record<string, string> = {
    byt: "Byt",
    dum: "Dům",
    podil: "Podíl",
    jine: "Jiné",
  };

  const situationLabels: Record<string, string> = {
    standard: "Standardní prodej",
    exekuce: "Exekuce",
    dedictvi: "Dědictví",
    podil: "Spoluvlastnický podíl",
  };

  const htmlBody = `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="color:#1a56db">Děkujeme za vaši poptávku!</h2>
  <p>Dobrý den, <strong>${data.name}</strong>,</p>
  <p>obdrželi jsme vaši poptávku na výkup nemovitosti a děkujeme za důvěru.</p>
  <table style="border-collapse:collapse;width:100%;margin:20px 0">
    <tr style="background:#f8fafc">
      <td style="padding:10px;border:1px solid #e2e8f0"><strong>Typ nemovitosti</strong></td>
      <td style="padding:10px;border:1px solid #e2e8f0">${propertyTypeLabels[data.property_type] ?? data.property_type}</td>
    </tr>
    <tr>
      <td style="padding:10px;border:1px solid #e2e8f0"><strong>Region</strong></td>
      <td style="padding:10px;border:1px solid #e2e8f0">${data.region}</td>
    </tr>
    <tr style="background:#f8fafc">
      <td style="padding:10px;border:1px solid #e2e8f0"><strong>Situace</strong></td>
      <td style="padding:10px;border:1px solid #e2e8f0">${situationLabels[data.situation_type] ?? data.situation_type}</td>
    </tr>
  </table>
  <p style="font-size:18px;color:#1a56db;font-weight:bold">📞 Zavoláme vám do 30 minut!</p>
  <p>Pokud máte mezitím jakékoli dotazy, neváhejte nás kontaktovat na telefonu <strong>+420 725 877 076</strong>.</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0">
  <p style="font-size:12px;color:#94a3b8">Tento e-mail byl odeslán automaticky z webu vykoupím-nemovitost.cz</p>
</body>
</html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `Výkup Nemovitostí <${fromEmail}>`,
        to: [email],
        subject: "Děkujeme za poptávku – ozveme se do 30 minut",
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[auto-reply] Email failed:", {
        lead_id: payload.lead_id,
        status: res.status,
        body,
      });
    }
  } catch (error: unknown) {
    console.error("[auto-reply] Email error:", {
      lead_id: payload.lead_id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
async function sendCallbackTelegramNotification(
  payload: CallbackNotificationPayload,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[lead-notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  const { data } = payload;
  const text = [
    "📞 <b>Zpětné zavolání!</b>",
    "",
    `📞 <b>Telefon:</b> ${data.phone}`,
    `📍 <b>Region:</b> ${data.region}`,
    `📋 <b>Zdroj:</b> ${data.source}`,
    `🕐 <b>Čas:</b> ${payload.timestamp}`,
    `🆔 <b>ID:</b> ${payload.lead_id}`,
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
    console.error("[lead-notify] Callback Telegram failed:", {
      lead_id: payload.lead_id,
      status: res.status,
      body,
    });
  }
}

function saveLeadToFile(
  payload: LeadNotificationPayload | CallbackNotificationPayload,
): void {
  try {
    appendFileSync("/tmp/leads-backup.json", JSON.stringify(payload) + "\n");
  } catch (error: unknown) {
    console.error("[lead-backup] File write failed:", {
      lead_id: payload.lead_id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
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

    const isCallback =
      typeof (payload as Record<string, unknown>).type === "string" &&
      (payload as Record<string, unknown>).type === "callback";

    if (isCallback) {
      const cbResult = callbackSchema.safeParse(payload);
      if (!cbResult.success) {
        return NextResponse.json(
          { ok: false, code: "VALIDATION_ERROR" },
          { status: 400 },
        );
      }

      const leadId = `cb_${Date.now().toString(36)}`;
      const cbData = cbResult.data;

      const cbPayload: CallbackNotificationPayload = {
        lead_id: leadId,
        timestamp: new Date().toISOString(),
        ip: clientIp,
        data: {
          type: "callback",
          phone: cbData.phone,
          source: cbData.source,
          region: cbData.region,
        },
      };

      const cbResults = await Promise.allSettled([
        sendCallbackTelegramNotification(cbPayload),
      ]);

      cbResults.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(
            `[lead-notify] Callback notification ${i} failed:`,
            r.reason,
          );
        }
      });

      saveLeadToFile(cbPayload);

      return NextResponse.json(
        { ok: true, lead_id: leadId, message: "Callback lead accepted" },
        { status: 200 },
      );
    }

    const isQuickEstimate =
      typeof (payload as Record<string, unknown>).type === "string" &&
      (payload as Record<string, unknown>).type === "quick-estimate";

    if (isQuickEstimate) {
      const qeResult = quickEstimateSchema.safeParse(payload);
      if (!qeResult.success) {
        return NextResponse.json(
          { ok: false, code: "VALIDATION_ERROR" },
          { status: 400 },
        );
      }

      const leadId = `qe_${Date.now().toString(36)}`;
      const qeData = qeResult.data;

      const qePayload: CallbackNotificationPayload = {
        lead_id: leadId,
        timestamp: new Date().toISOString(),
        ip: clientIp,
        data: {
          type: "callback",
          phone: qeData.phone,
          source: qeData.source,
          region: qeData.region,
        },
      };

      const qeResults = await Promise.allSettled([
        sendCallbackTelegramNotification(qePayload),
      ]);

      qeResults.forEach((r, i) => {
        if (r.status === "rejected") {
          console.error(
            `[lead-notify] Quick-estimate notification ${i} failed:`,
            r.reason,
          );
        }
      });

      saveLeadToFile(qePayload);

      return NextResponse.json(
        { ok: true, lead_id: leadId, message: "Quick estimate lead accepted" },
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

    const notifyResults = await Promise.allSettled([
      sendWebhookNotification(notificationPayload),
      sendEmailNotification(notificationPayload),
      sendTelegramNotification(notificationPayload),
      ...(validatedData.email && validatedData.email.trim()
        ? [
            sendAutoReplyEmail({
              ...notificationPayload,
              email: validatedData.email.trim(),
            }),
          ]
        : []),
    ]);

    const notifyNames = ["webhook", "email", "telegram", "auto-reply"];
    notifyResults.forEach((r, i) => {
      if (r.status === "rejected") {
        console.error(`[lead-notify] ${notifyNames[i]} failed:`, r.reason);
      }
    });

    saveLeadToFile(notificationPayload);

    // Server-side GA4 Measurement Protocol — generate_lead event
    trackEvent("generate_lead", {
      region: validatedData.region,
      type: validatedData.property_type,
      source: validatedData.situation_type,
      lead_id: leadId,
    }).catch(() => {
      // fire-and-forget, already logged inside trackEvent
    });

    const leadScore = calculateLeadScore({
      property_type: validatedData.property_type,
      region: validatedData.region,
      situation_type: validatedData.situation_type,
    });

    return NextResponse.json(
      {
        ok: true,
        lead_id: leadId,
        message: "Lead accepted",
        score: leadScore.score,
        tier: leadScore.tier,
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { ok: false, code: "DELIVERY_ERROR" },
      { status: 500 },
    );
  }
}
