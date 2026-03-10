import { NextResponse } from "next/server";
import { z } from "zod";
import { LEAD_STAGES } from "@/lib/lead-status";
import type { LeadStage } from "@/lib/lead-status";

const updateSchema = z.object({
  token: z.string().regex(/^[a-f0-9]{12}$/),
  stage: z.enum(
    LEAD_STAGES as unknown as [string, ...string[]],
  ) as z.ZodType<LeadStage>,
  note: z.string().max(500).optional(),
});

async function updateLeadInSheet(
  token: string,
  stage: LeadStage,
  note?: string,
): Promise<boolean> {
  const webhookUrl = process.env.LEAD_STATUS_UPDATE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[admin-lead-status] LEAD_STATUS_UPDATE_WEBHOOK_URL not set");
    return false;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      stage,
      note: note ?? "",
      updatedAt: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[admin-lead-status] Update failed:", {
      token,
      status: res.status,
      body,
    });
    return false;
  }

  return true;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      console.error("[admin-lead-status] ADMIN_SECRET not configured");
      return NextResponse.json(
        { ok: false, code: "SERVER_ERROR" },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("authorization");
    const providedSecret = authHeader?.replace("Bearer ", "");

    if (providedSecret !== adminSecret) {
      return NextResponse.json(
        { ok: false, code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { token, stage, note } = result.data;
    const success = await updateLeadInSheet(token, stage, note);

    if (!success) {
      return NextResponse.json(
        { ok: false, code: "UPDATE_FAILED" },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Status updated",
        token,
        stage,
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
