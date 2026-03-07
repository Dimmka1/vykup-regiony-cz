import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { NextResponse, type NextRequest } from "next/server";

const LEADS_BACKUP = "/tmp/leads-backup.json";
const LEADS_STATUS_FILE = "/tmp/leads-status.json";

interface LeadRecord {
  lead_id: string;
  timestamp: string;
  ip: string;
  data: {
    type?: string;
    name?: string;
    phone: string;
    email?: string;
    property_type?: string;
    region: string;
    situation_type?: string;
    source?: string;
  };
}

interface LeadStatus {
  status: string;
  notes: string;
  updated_at: string;
}

function readLeads(): LeadRecord[] {
  if (!existsSync(LEADS_BACKUP)) return [];
  try {
    const raw = readFileSync(LEADS_BACKUP, "utf-8");
    return raw
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line) as LeadRecord);
  } catch {
    return [];
  }
}

function readStatuses(): Record<string, LeadStatus> {
  if (!existsSync(LEADS_STATUS_FILE)) return {};
  try {
    return JSON.parse(readFileSync(LEADS_STATUS_FILE, "utf-8")) as Record<
      string,
      LeadStatus
    >;
  } catch {
    return {};
  }
}

function writeStatuses(statuses: Record<string, LeadStatus>): void {
  writeFileSync(LEADS_STATUS_FILE, JSON.stringify(statuses, null, 2));
}

function checkAuth(request: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const auth = request.headers.get("x-admin-password");
  return auth === password;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = readLeads();
  const statuses = readStatuses();

  const enriched = leads.map((lead) => {
    const st = statuses[lead.lead_id];
    return {
      ...lead,
      crm_status: st?.status ?? "new",
      notes: st?.notes ?? "",
      status_updated_at: st?.updated_at ?? null,
    };
  });

  enriched.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return NextResponse.json({ leads: enriched });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    lead_id: string;
    status?: string;
    notes?: string;
  };

  if (!body.lead_id) {
    return NextResponse.json({ error: "lead_id required" }, { status: 400 });
  }

  const validStatuses = ["new", "contacted", "won", "lost"];
  if (body.status && !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const statuses = readStatuses();
  const existing = statuses[body.lead_id] ?? {
    status: "new",
    notes: "",
    updated_at: "",
  };

  statuses[body.lead_id] = {
    status: body.status ?? existing.status,
    notes: body.notes ?? existing.notes,
    updated_at: new Date().toISOString(),
  };

  writeStatuses(statuses);

  return NextResponse.json({ ok: true });
}
