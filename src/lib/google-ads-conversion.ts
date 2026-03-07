/**
 * Server-side Google Ads Enhanced Conversions (VR-206)
 *
 * Primary: Google Ads Conversion Upload API (REST)
 * Fallback: GA4 Measurement Protocol (if GA4 env vars set instead)
 *
 * All env vars are optional — if not set, skip silently.
 */

import { createHash } from "node:crypto";

/* ── Types ─────────────────────────────────────────────────── */

interface ConversionData {
  gclid?: string;
  email?: string;
  phone?: string;
  conversionDateTime?: string;
}

/* ── Helpers ───────────────────────────────────────────────── */

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/[\s\-()]/g, "");
  if (digits.startsWith("00420")) return `+420${digits.slice(5)}`;
  if (digits.startsWith("420") && !digits.startsWith("+")) return `+${digits}`;
  if (/^\d{9}$/.test(digits)) return `+420${digits}`;
  return digits;
}

function formatConversionDateTime(date?: string): string {
  const d = date ? new Date(date) : new Date();
  const pad = (n: number): string => String(n).padStart(2, "0");
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hh = pad(Math.floor(absOffset / 60));
  const mm = pad(absOffset % 60);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `${sign}${hh}:${mm}`
  );
}

/* ── Google Ads Conversion Upload (primary) ────────────────── */

async function sendGoogleAdsConversion(data: ConversionData): Promise<boolean> {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const conversionActionId = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID;
  const apiToken = process.env.GOOGLE_ADS_API_TOKEN;

  if (!customerId || !conversionActionId || !apiToken) {
    return false;
  }

  const userIdentifiers: Record<string, string>[] = [];

  if (data.email && data.email.trim()) {
    userIdentifiers.push({ hashedEmail: sha256(data.email) });
  }

  if (data.phone && data.phone.trim()) {
    const normalized = normalizePhone(data.phone);
    userIdentifiers.push({ hashedPhoneNumber: sha256(normalized) });
  }

  if (!data.gclid && userIdentifiers.length === 0) {
    return false;
  }

  const cleanCustomerId = customerId.replace(/-/g, "");
  const conversionAction = `customers/${cleanCustomerId}/conversionActions/${conversionActionId}`;

  const conversion: Record<string, unknown> = {
    conversionAction,
    conversionDateTime: formatConversionDateTime(data.conversionDateTime),
  };

  if (data.gclid) {
    conversion.gclid = data.gclid;
  }

  if (userIdentifiers.length > 0) {
    conversion.userIdentifiers = userIdentifiers;
  }

  const url = `https://googleads.googleapis.com/v17/customers/${cleanCustomerId}:uploadClickConversions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      conversions: [conversion],
      partialFailure: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[enhanced-conversions] Google Ads API error:", {
      status: res.status,
      body,
    });
    return false;
  }

  return true;
}

/* ── GA4 Measurement Protocol (fallback) ───────────────────── */

async function sendGA4Conversion(data: ConversionData): Promise<boolean> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    return false;
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  const userProperties: Record<string, { value: string }> = {};
  if (data.email && data.email.trim()) {
    userProperties.hashed_email = { value: sha256(data.email) };
  }
  if (data.phone && data.phone.trim()) {
    userProperties.hashed_phone = {
      value: sha256(normalizePhone(data.phone)),
    };
  }

  const eventParams: Record<string, string> = {};
  if (data.gclid) {
    eventParams.gclid = data.gclid;
  }

  const clientId = data.gclid ?? `server.${Date.now()}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      user_properties: userProperties,
      events: [
        {
          name: "generate_lead",
          params: eventParams,
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[enhanced-conversions] GA4 MP error:", {
      status: res.status,
      body,
    });
    return false;
  }

  return true;
}

/* ── Public API ─────────────────────────────────────────────── */

export async function sendEnhancedConversion(
  data: ConversionData,
): Promise<void> {
  try {
    // Try Google Ads API first
    const googleAdsSent = await sendGoogleAdsConversion(data);
    if (googleAdsSent) return;

    // Fallback: GA4 Measurement Protocol
    const ga4Sent = await sendGA4Conversion(data);
    if (ga4Sent) return;

    // No env vars configured — skip silently (AC-4)
  } catch (error: unknown) {
    // Never throw — conversion tracking must not break lead submission (AC-4)
    console.error("[enhanced-conversions] Unexpected error:", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
