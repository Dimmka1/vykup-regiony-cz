import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/funnel
 *
 * Returns form funnel data for the admin dashboard (VR-207).
 * Protected by ADMIN_PASSWORD env var (passed via X-Admin-Password header).
 *
 * Query params:
 *   - period: "7d" | "30d" | "all" (default: "30d")
 *   - region: region key or "all" (default: "all")
 *
 * TODO: Connect to real Google Sheets API for production data.
 * Currently returns mock data that simulates realistic funnel drop-offs.
 */

interface FunnelStep {
  step: string;
  label: string;
  count: number;
}

interface FunnelResponse {
  steps: FunnelStep[];
  period: string;
  region: string;
  generatedAt: string;
  source: "mock" | "google_sheets";
  note: string;
}

const REGIONS: Record<string, string> = {
  praha: "Praha",
  "stredocesky-kraj": "Středočeský kraj",
  "jihocesky-kraj": "Jihočeský kraj",
  "plzensky-kraj": "Plzeňský kraj",
  "karlovarsky-kraj": "Karlovarský kraj",
  "ustecky-kraj": "Ústecký kraj",
  "liberecky-kraj": "Liberecký kraj",
  "kralovehradecky-kraj": "Královéhradecký kraj",
  "pardubicky-kraj": "Pardubický kraj",
  vysocina: "Vysočina",
  "jihomoravsky-kraj": "Jihomoravský kraj",
  "olomoucky-kraj": "Olomoucký kraj",
  "moravskoslezsky-kraj": "Moravskoslezský kraj",
  "zlinsky-kraj": "Zlínský kraj",
};

/** Generate deterministic-ish mock data based on period & region */
function generateMockFunnel(period: string, region: string): FunnelStep[] {
  const periodMultiplier = period === "7d" ? 0.25 : period === "30d" ? 1 : 3.5;

  let regionMultiplier = 1;
  if (region !== "all") {
    const keys = Object.keys(REGIONS);
    const idx = keys.indexOf(region);
    // Praha gets most traffic, others proportionally less
    regionMultiplier = idx === 0 ? 0.35 : 0.04 + idx * 0.005;
  }

  const base = Math.round(2840 * periodMultiplier * regionMultiplier);

  // Realistic drop-off rates between steps
  const step1 = base;
  const step2 = Math.round(step1 * 0.41); // ~41% proceed
  const step3 = Math.round(step2 * 0.6); // ~60% proceed
  const submit = Math.round(step3 * 0.33); // ~33% submit

  return [
    { step: "step_1", label: "Krok 1: Typ nemovitosti", count: step1 },
    { step: "step_2", label: "Krok 2: Adresa a PSČ", count: step2 },
    { step: "step_3", label: "Krok 3: Kontaktní údaje", count: step3 },
    { step: "submit", label: "Odeslání formuláře", count: submit },
  ];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured" },
      { status: 503 },
    );
  }

  const providedPassword = request.headers.get("x-admin-password");
  if (providedPassword !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "30d";
  const region = searchParams.get("region") ?? "all";

  if (!["7d", "30d", "all"].includes(period)) {
    return NextResponse.json(
      { error: "Invalid period. Use: 7d, 30d, all" },
      { status: 400 },
    );
  }

  if (region !== "all" && !REGIONS[region]) {
    return NextResponse.json({ error: "Invalid region key" }, { status: 400 });
  }

  // TODO: Replace mock with real Google Sheets data
  // When GOOGLE_SHEETS_ID is set, fetch from partial submissions sheet
  const sheetsAvailable = false;

  const steps = generateMockFunnel(period, region);

  const response: FunnelResponse = {
    steps,
    period,
    region,
    generatedAt: new Date().toISOString(),
    source: sheetsAvailable ? "google_sheets" : "mock",
    note: sheetsAvailable
      ? "Data z Google Sheets"
      : "Mock data. Nastavte GOOGLE_SHEETS_ID pro reálná data z partial submissions.",
  };

  return NextResponse.json(response);
}
