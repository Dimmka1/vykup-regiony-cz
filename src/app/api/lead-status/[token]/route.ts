import { NextResponse } from "next/server";
import { LEAD_STAGES, STAGE_LABELS, isValidStage } from "@/lib/lead-status";
import type { LeadStage, LeadStatusResponse } from "@/lib/lead-status";

interface LeadSheetRow {
  token: string;
  currentStage: string;
  note?: string;
  timestamps?: Record<string, string>;
}

async function fetchLeadFromSheet(token: string): Promise<LeadSheetRow | null> {
  const webhookUrl = process.env.LEAD_STATUS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[lead-status] LEAD_STATUS_WEBHOOK_URL not set");
    return null;
  }

  const res = await fetch(`${webhookUrl}?token=${encodeURIComponent(token)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    console.error("[lead-status] Sheet fetch failed:", res.status);
    return null;
  }

  const data: unknown = await res.json();
  if (
    typeof data === "object" &&
    data !== null &&
    "token" in data &&
    "currentStage" in data
  ) {
    return data as LeadSheetRow;
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  const { token } = await params;

  if (!/^[a-f0-9]{12}$/.test(token)) {
    return NextResponse.json(
      { ok: false, code: "INVALID_TOKEN" },
      { status: 400 },
    );
  }

  const lead = await fetchLeadFromSheet(token);

  if (!lead) {
    return NextResponse.json({ ok: false, code: "NOT_FOUND" }, { status: 404 });
  }

  const currentStage: LeadStage = isValidStage(lead.currentStage)
    ? lead.currentStage
    : "prijato";

  const currentIndex = LEAD_STAGES.indexOf(currentStage);

  const stages = LEAD_STAGES.map((stage, index) => ({
    stage,
    label: STAGE_LABELS[stage],
    completedAt:
      index <= currentIndex
        ? (lead.timestamps?.[stage] ?? new Date().toISOString())
        : null,
  }));

  const response: LeadStatusResponse = {
    token,
    currentStage,
    stages,
    ...(lead.note ? { note: lead.note } : {}),
  };

  return NextResponse.json(response, { status: 200 });
}
