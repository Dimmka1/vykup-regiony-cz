/**
 * Server-side analytics — GA4 Measurement Protocol
 *
 * Sends events to GA4 without client-side JS or cookies.
 * Gracefully degrades when env vars are missing.
 *
 * Required env:
 *   GA4_MEASUREMENT_ID — e.g. "G-XXXXXXXXXX"
 *   GA4_API_SECRET     — MP API secret from GA4 admin
 */

const GA4_MP_URL = "https://www.google-analytics.com/mp/collect";

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Send a server-side event to GA4 Measurement Protocol.
 * No-op if GA4_MEASUREMENT_ID or GA4_API_SECRET are not set.
 */
export async function trackEvent(
  name: string,
  params: EventParams = {},
  clientId?: string,
): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    return;
  }

  // Filter out undefined values
  const cleanParams: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) {
      cleanParams[k] = v;
    }
  }

  const body = {
    client_id: clientId ?? `server.${Date.now()}`,
    events: [
      {
        name,
        params: cleanParams,
      },
    ],
  };

  try {
    const url = `${GA4_MP_URL}?measurement_id=${measurementId}&api_secret=${apiSecret}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("[server-analytics] GA4 MP error:", {
        status: res.status,
        event: name,
      });
    }
  } catch (error: unknown) {
    console.error("[server-analytics] GA4 MP failed:", {
      event: name,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
