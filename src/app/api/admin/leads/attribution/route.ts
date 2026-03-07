import { readFileSync, existsSync } from "node:fs";
import { NextResponse, type NextRequest } from "next/server";

const LEADS_BACKUP = "/tmp/leads-backup.json";

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
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    gclid?: string;
  };
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

function checkAuth(request: NextRequest): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const auth = request.headers.get("x-admin-password");
  return auth === password;
}

function classifySource(lead: LeadRecord): string {
  const d = lead.data;
  if (d.gclid) return "google_ads";
  if (d.utm_source) return d.utm_source;
  if (d.source === "ppc") return "ppc";
  if (d.type === "callback") return "callback";
  if (d.type === "quick-estimate") return "quick-estimate";
  return "direct";
}

function calculateLeadScoreSimple(lead: LeadRecord): number {
  let score = 0;
  const d = lead.data;
  const pt = (d.property_type ?? "").toLowerCase();
  if (pt === "byt") score += 30;
  else if (pt === "dum" || pt === "d\u016Fm") score += 20;
  else if (pt.includes("komer\u010D") || pt.includes("komercni")) score += 15;
  else score += 10;

  const region = (d.region ?? "").toLowerCase();
  if (region === "praha") score += 30;
  else if (region === "brno" || region === "ostrava") score += 20;
  else score += 15;

  const sit = (d.situation_type ?? "").toLowerCase();
  if (sit === "exekuce" || sit === "insolvence") score += 20;
  else if (
    sit === "dedictvi" ||
    sit === "d\u011Bdictv\u00ED" ||
    sit === "rozvod"
  )
    score += 15;

  return score;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const daysParam = url.searchParams.get("days");
  const dateFromParam = url.searchParams.get("from");
  const dateToParam = url.searchParams.get("to");

  let leads = readLeads();

  // Date filtering
  const now = new Date();
  if (daysParam) {
    const days = parseInt(daysParam, 10);
    if (!isNaN(days) && days > 0) {
      const cutoff = new Date(now.getTime() - days * 86400000);
      leads = leads.filter((l) => new Date(l.timestamp) >= cutoff);
    }
  }
  if (dateFromParam) {
    const from = new Date(dateFromParam);
    if (!isNaN(from.getTime())) {
      leads = leads.filter((l) => new Date(l.timestamp) >= from);
    }
  }
  if (dateToParam) {
    const to = new Date(dateToParam + "T23:59:59");
    if (!isNaN(to.getTime())) {
      leads = leads.filter((l) => new Date(l.timestamp) <= to);
    }
  }

  // Leads by source
  const bySource: Record<string, number> = {};
  // Leads by campaign
  const byCampaign: Record<string, number> = {};
  // Region x source matrix
  const regionSourceMatrix: Record<string, Record<string, number>> = {};
  // Score accumulator per source
  const scoreBySource: Record<string, { total: number; count: number }> = {};

  for (const lead of leads) {
    const source = classifySource(lead);
    const campaign = lead.data.utm_campaign || "(none)";
    const region = lead.data.region || "(unknown)";
    const score = calculateLeadScoreSimple(lead);

    bySource[source] = (bySource[source] ?? 0) + 1;
    byCampaign[campaign] = (byCampaign[campaign] ?? 0) + 1;

    if (!regionSourceMatrix[region]) regionSourceMatrix[region] = {};
    regionSourceMatrix[region][source] =
      (regionSourceMatrix[region][source] ?? 0) + 1;

    if (!scoreBySource[source]) scoreBySource[source] = { total: 0, count: 0 };
    scoreBySource[source].total += score;
    scoreBySource[source].count += 1;
  }

  const avgScoreBySource: Record<string, number> = {};
  for (const [src, { total, count }] of Object.entries(scoreBySource)) {
    avgScoreBySource[src] = Math.round(total / count);
  }

  const allSources = [...new Set(leads.map(classifySource))].sort();
  const allRegions = [
    ...new Set(leads.map((l) => l.data.region || "(unknown)")),
  ].sort();

  return NextResponse.json({
    total: leads.length,
    bySource,
    byCampaign,
    regionSourceMatrix,
    avgScoreBySource,
    allSources,
    allRegions,
  });
}
