import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/server-analytics";

const RATE_LIMIT_WINDOW_MS = 1_000;
const RATE_LIMIT_MAX = 10;

const requestCounter = new Map<string, { count: number; start: number }>();

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
  return false;
}

const ALLOWED_EVENTS = new Set([
  "page_view",
  "form_submit",
  "calculator_use",
  "cta_click",
  "scroll_depth",
  "callback_request",
  "lead_magnet_download",
  "exit_popup_shown",
  "exit_popup_submit",
  "phone_click",
  "whatsapp_click",
]);

interface TrackPayload {
  event: string;
  params?: Record<string, string | number | boolean>;
  client_id?: string;
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

    const body = (await request.json()) as TrackPayload;

    if (!body.event || typeof body.event !== "string") {
      return NextResponse.json(
        { ok: false, code: "INVALID_EVENT" },
        { status: 400 },
      );
    }

    if (!ALLOWED_EVENTS.has(body.event)) {
      return NextResponse.json(
        { ok: false, code: "EVENT_NOT_ALLOWED" },
        { status: 400 },
      );
    }

    const params = body.params ?? {};

    // Validate params — only primitives
    for (const [, v] of Object.entries(params)) {
      if (
        typeof v !== "string" &&
        typeof v !== "number" &&
        typeof v !== "boolean"
      ) {
        return NextResponse.json(
          { ok: false, code: "INVALID_PARAMS" },
          { status: 400 },
        );
      }
    }

    await trackEvent(body.event, params, body.client_id);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
