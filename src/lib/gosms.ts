/**
 * GoSMS.cz API client for sending SMS messages.
 *
 * Env vars required:
 *   GOSMS_CLIENT_ID     – OAuth2 client ID from GoSMS admin
 *   GOSMS_CLIENT_SECRET – OAuth2 client secret
 *   GOSMS_CHANNEL_ID    – Numeric channel ID (default: 1)
 *
 * API docs: https://doc.gosms.cz
 */

import { z } from "zod";

const GOSMS_BASE_URL = "https://app.gosms.cz";
const OAUTH_PATH = "/oauth/v2/token";
const SEND_PATH = "/api/v1/messages/";

const goSmsTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});

const goSmsSendSchema = z.object({
  link: z.string(),
});

const goSmsErrorSchema = z.object({
  error: z.string().optional(),
  error_description: z.string().optional(),
  title: z.string().optional(),
  detail: z.string().optional(),
});

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch(`${GOSMS_BASE_URL}${OAUTH_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const raw = await res.json().catch(() => ({}));
    const body = goSmsErrorSchema.parse(raw);
    throw new Error(
      `[gosms] Auth failed (${res.status}): ${body.error_description ?? body.error ?? "unknown"}`,
    );
  }

  const data = goSmsTokenSchema.parse(await res.json());

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

/**
 * Normalise a Czech phone number to +420XXXXXXXXX format.
 */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\s+/g, "").replace(/^00/, "+");
  if (digits.startsWith("+420")) return digits;
  if (/^\d{9}$/.test(digits)) return `+420${digits}`;
  return digits;
}

export interface SendSmsResult {
  ok: boolean;
  link?: string;
  error?: string;
}

/**
 * Send an SMS message via GoSMS.cz.
 *
 * Returns `{ ok: true, link }` on success, `{ ok: false, error }` on failure.
 * Never throws — all errors are caught and returned gracefully.
 */
export async function sendSms(
  phone: string,
  message: string,
): Promise<SendSmsResult> {
  const clientId = process.env.GOSMS_CLIENT_ID;
  const clientSecret = process.env.GOSMS_CLIENT_SECRET;
  const channelId = parseInt(process.env.GOSMS_CHANNEL_ID ?? "1", 10);

  if (!clientId || !clientSecret) {
    console.warn("[gosms] GOSMS_CLIENT_ID or GOSMS_CLIENT_SECRET not set");
    return { ok: false, error: "GoSMS credentials not configured" };
  }

  try {
    const token = await getAccessToken(clientId, clientSecret);
    const recipient = normalizePhone(phone);

    const res = await fetch(`${GOSMS_BASE_URL}${SEND_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message,
        recipients: [recipient],
        channel: channelId,
      }),
    });

    if (res.status === 201) {
      const data = goSmsSendSchema.parse(await res.json());
      console.log("[gosms] SMS sent to", recipient, "link:", data.link);
      return { ok: true, link: data.link };
    }

    // Token expired — clear cache and retry once
    if (res.status === 401) {
      cachedToken = null;
      const freshToken = await getAccessToken(clientId, clientSecret);

      const retryRes = await fetch(`${GOSMS_BASE_URL}${SEND_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${freshToken}`,
        },
        body: JSON.stringify({
          message,
          recipients: [recipient],
          channel: channelId,
        }),
      });

      if (retryRes.status === 201) {
        const data = goSmsSendSchema.parse(await retryRes.json());
        console.log(
          "[gosms] SMS sent (retry) to",
          recipient,
          "link:",
          data.link,
        );
        return { ok: true, link: data.link };
      }

      const retryRaw = await retryRes.json().catch(() => ({}));
      const body = goSmsErrorSchema.parse(retryRaw);
      const msg = body.detail ?? body.title ?? `HTTP ${retryRes.status}`;
      console.error("[gosms] SMS send failed after retry:", msg);
      return { ok: false, error: msg };
    }

    const errorRaw = await res.json().catch(() => ({}));
    const body = goSmsErrorSchema.parse(errorRaw);
    const msg = body.detail ?? body.title ?? `HTTP ${res.status}`;
    console.error("[gosms] SMS send failed:", msg);
    return { ok: false, error: msg };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[gosms] SMS error:", msg);
    return { ok: false, error: msg };
  }
}
