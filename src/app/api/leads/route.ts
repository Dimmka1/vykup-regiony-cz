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

    const payload = await request.json();

    if (
      typeof payload.website === "string" &&
      payload.website.trim().length > 0
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
