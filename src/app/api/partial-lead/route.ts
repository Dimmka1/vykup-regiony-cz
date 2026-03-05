import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  type StoredPartialLead,
  PARTIAL_LEAD_TTL,
  partialLeadSchema,
} from "@/lib/partial-lead";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const payload: unknown = await request.json();
    const result = partialLeadSchema.safeParse(payload);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const data = result.data;
    const redis = getRedis();
    const key = `partial:${data.sessionId}`;

    const existing = await redis.get<StoredPartialLead>(key);
    const now = new Date().toISOString();

    const stored: StoredPartialLead = {
      ...(existing ?? {}),
      ...data,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      recoverySent: existing?.recoverySent ?? false,
    };

    await redis.set(key, stored, { ex: PARTIAL_LEAD_TTL });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, code: "MISSING_SESSION_ID" },
        { status: 400 },
      );
    }

    const redis = getRedis();
    await redis.del(`partial:${sessionId}`);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
