import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { type PromoConfig, EMPTY_PROMO } from "@/lib/promo";

const PROMO_FILE = "/tmp/promo-campaign.json";

function getStoredPromo(): PromoConfig {
  try {
    if (existsSync(PROMO_FILE)) {
      const raw = readFileSync(PROMO_FILE, "utf-8");
      return JSON.parse(raw) as PromoConfig;
    }
  } catch {
    // corrupted file — return empty
  }
  return { ...EMPTY_PROMO };
}

function storePromo(promo: PromoConfig): void {
  writeFileSync(PROMO_FILE, JSON.stringify(promo, null, 2), "utf-8");
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(): Promise<NextResponse> {
  const promo = getStoredPromo();
  return NextResponse.json(promo);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  const requiredFields = [
    "id",
    "title",
    "subtitle",
    "ctaText",
    "ctaUrl",
    "expiresAt",
    "active",
  ] as const;

  for (const field of requiredFields) {
    if (data[field] === undefined) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 },
      );
    }
  }

  const promo: PromoConfig = {
    id: String(data.id),
    title: String(data.title),
    subtitle: String(data.subtitle),
    ctaText: String(data.ctaText),
    ctaUrl: String(data.ctaUrl),
    expiresAt: String(data.expiresAt),
    color: data.color ? String(data.color) : undefined,
    active: Boolean(data.active),
  };

  // Validate expiresAt is a valid date
  if (isNaN(new Date(promo.expiresAt).getTime())) {
    return NextResponse.json(
      { error: "Invalid expiresAt date format" },
      { status: 400 },
    );
  }

  storePromo(promo);

  return NextResponse.json({ ok: true, promo });
}
