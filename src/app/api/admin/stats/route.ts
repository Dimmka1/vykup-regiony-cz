import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/admin/stats
 *
 * Returns analytics data for the admin dashboard.
 * Protected by ADMIN_PASSWORD env var (passed via X-Admin-Password header).
 *
 * TODO: Connect to real Google Sheets API for production data.
 * Currently returns mock/sample data for demonstration.
 */
export async function GET(request: NextRequest) {
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

  // Generate mock data for last 30 days
  const now = new Date();
  const leadsByDay = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().slice(0, 10),
      count: Math.floor(Math.random() * 8) + 1,
    };
  });

  const leadsByRegion = [
    { region: "Středočeský kraj", count: 42 },
    { region: "Jihomoravský kraj", count: 35 },
    { region: "Moravskoslezský kraj", count: 28 },
    { region: "Ústecký kraj", count: 24 },
    { region: "Plzeňský kraj", count: 18 },
    { region: "Olomoucký kraj", count: 15 },
    { region: "Liberecký kraj", count: 12 },
    { region: "Královéhradecký kraj", count: 11 },
    { region: "Pardubický kraj", count: 10 },
    { region: "Zlínský kraj", count: 9 },
    { region: "Jihočeský kraj", count: 8 },
    { region: "Karlovarský kraj", count: 7 },
    { region: "Vysočina", count: 6 },
  ];

  const leadsBySource = [
    { source: "Organic", count: 98 },
    { source: "PPC", count: 67 },
    { source: "Direct", count: 45 },
    { source: "Referral", count: 15 },
  ];

  const funnel = {
    step1_view: 2840,
    step2_property_type: 1120,
    step3_contact_info: 680,
    step4_submit: 225,
  };

  return NextResponse.json({
    leadsByDay,
    leadsByRegion,
    leadsBySource,
    funnel,
    generatedAt: now.toISOString(),
    note: "This is mock data. Connect Google Sheets API for real analytics.",
  });
}
