/**
 * Abstract SMS service for sending text messages.
 * Default implementation targets GoSMS.cz API.
 *
 * Required env vars:
 *  - SMS_API_URL   (e.g. https://app.gosms.cz/api/v1/messages)
 *  - SMS_API_KEY   (Bearer token)
 *  - SMS_SENDER_NAME (optional, defaults to "VykupNemov")
 *
 * Graceful degradation: if env vars are missing, logs a warning and returns ok:false.
 */

export interface SmsResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

export interface SmsPayload {
  to: string;
  text: string;
}

function isSmsConfigured(): boolean {
  return Boolean(process.env.SMS_API_URL && process.env.SMS_API_KEY);
}

/**
 * Send a single SMS message via the configured gateway.
 */
export async function sendSms(payload: SmsPayload): Promise<SmsResult> {
  if (!isSmsConfigured()) {
    console.warn(
      "[sms] SMS_API_URL or SMS_API_KEY not configured — skipping SMS",
    );
    return { ok: false, error: "SMS not configured" };
  }

  const apiUrl = process.env.SMS_API_URL!;
  const apiKey = process.env.SMS_API_KEY!;
  const senderName = process.env.SMS_SENDER_NAME ?? "VykupNemov";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: payload.text,
        recipients: payload.to,
        channel: senderName,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[sms] API error:", {
        status: res.status,
        body,
        to: payload.to,
      });
      return { ok: false, error: `HTTP ${res.status}: ${body}` };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, messageId: data.id ?? undefined };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[sms] Send failed:", { to: payload.to, error: msg });
    return { ok: false, error: msg };
  }
}

/** SMS templates for the lead pipeline */
export const SMS_TEMPLATES = {
  instant:
    "Děkujeme za poptávku na vykoupim-nemovitost.cz! Ozveme se vám do 30 minut. Pro rychlý kontakt volejte +420 776 424 145",
  drip_day_2:
    "Dobrý den, stále máme zájem o vaši nemovitost. Zavolejte nám: +420 776 424 145",
  drip_day_5:
    "Poslední připomínka — naše nabídka na výkup platí. Kontaktujte nás: +420 776 424 145",
} as const;
