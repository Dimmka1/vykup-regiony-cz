import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  type StoredPartialLead,
  RECOVERY_MIN_AGE_MS,
} from "@/lib/partial-lead";

const CRON_SECRET = process.env.CRON_SECRET;

async function sendRecoverySms(phone: string): Promise<void> {
  const apiKey = process.env.GOSMSPRO_API_KEY;
  const channel = process.env.GOSMSPRO_CHANNEL;
  if (!apiKey || !channel) {
    console.warn("[recovery] GOSMSPRO_API_KEY or GOSMSPRO_CHANNEL not set");
    return;
  }

  const message =
    "Nedokončili jste poptávku na výkup nemovitosti. Rádi vám pomůžeme: +420 776 424 145";

  const res = await fetch("https://app.gosmspro.cz/api/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ channel, recipients: phone, message }),
  });

  if (!res.ok) {
    console.error("[recovery] SMS failed:", await res.text());
  }
}

async function sendRecoveryEmail(email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";

  const htmlBody = `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <h2 style="color:#1a56db">Nedokončili jste poptávku</h2>
  <p>Dobrý den,</p>
  <p>zaznamenali jsme, že jste začali vyplňovat formulář na výkup nemovitosti, ale nedokončili ho.</p>
  <p>Pokud máte jakékoli otázky nebo potřebujete pomoc, neváhejte nás kontaktovat:</p>
  <p style="font-size:18px;color:#1a56db;font-weight:bold">📞 +420 776 424 145</p>
  <p>Rádi vám pomůžeme s celým procesem.</p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:30px 0">
  <p style="font-size:12px;color:#94a3b8">Tento e-mail byl odeslán automaticky z webu vykoupím-nemovitost.cz</p>
</body>
</html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Výkup Nemovitostí <${fromEmail}>`,
      to: [email],
      subject: "Nedokončili jste formulář – rádi vám pomůžeme",
      html: htmlBody,
    }),
  });

  if (!res.ok) {
    console.error("[recovery] Email failed:", await res.text());
  }
}

async function appendToGoogleSheets(lead: StoredPartialLead): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("[recovery] GOOGLE_SHEETS_WEBHOOK_URL not set");
    return;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "incomplete",
      sessionId: lead.sessionId,
      step: lead.step,
      propertyType: lead.propertyType ?? "",
      region: lead.region ?? "",
      phone: lead.phone ?? "",
      email: lead.email ?? "",
      name: lead.name ?? "",
      city: lead.city ?? "",
      createdAt: lead.createdAt,
    }),
  });

  if (!res.ok) {
    console.error("[recovery] Google Sheets failed:", await res.text());
  }
}

async function sendTelegramNotification(
  lead: StoredPartialLead,
): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const text = [
    "⚠️ <b>Nedokončený formulář</b>",
    "",
    `📋 <b>Krok:</b> ${lead.step}/3`,
    lead.name ? `👤 <b>Jméno:</b> ${lead.name}` : null,
    lead.phone ? `📞 <b>Telefon:</b> ${lead.phone}` : null,
    lead.email ? `📧 <b>Email:</b> ${lead.email}` : null,
    lead.propertyType ? `🏘️ <b>Typ:</b> ${lead.propertyType}` : null,
    lead.region ? `📍 <b>Region:</b> ${lead.region}` : null,
    lead.city ? `🏙️ <b>Město:</b> ${lead.city}` : null,
    `🕐 <b>Vytvořeno:</b> ${lead.createdAt}`,
  ]
    .filter(Boolean)
    .join("\n");

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const redis = getRedis();
    const keys = await redis.keys("partial:*");

    if (keys.length === 0) {
      return NextResponse.json({ ok: true, processed: 0 });
    }

    const now = Date.now();
    let processed = 0;

    for (const key of keys) {
      const lead = await redis.get<StoredPartialLead>(key);
      if (!lead) continue;

      // Skip if recovery already sent
      if (lead.recoverySent) continue;

      // Skip if too fresh (< 1 hour)
      const age = now - new Date(lead.createdAt).getTime();
      if (age < RECOVERY_MIN_AGE_MS) continue;

      // Send recovery messages
      const tasks: Promise<void>[] = [];

      if (lead.phone && lead.smsConsent) {
        tasks.push(sendRecoverySms(lead.phone));
      }

      if (lead.email) {
        tasks.push(sendRecoveryEmail(lead.email));
      }

      // Always log to sheets + telegram
      tasks.push(appendToGoogleSheets(lead));
      tasks.push(sendTelegramNotification(lead));

      await Promise.allSettled(tasks);

      // Mark as recovery sent
      lead.recoverySent = true;
      const ttl = await redis.ttl(key);
      if (ttl > 0) {
        await redis.set(key, lead, { ex: ttl });
      }

      processed++;
    }

    return NextResponse.json({ ok: true, processed });
  } catch (error) {
    console.error("[recovery-cron] Error:", error);
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
