import { NextResponse } from "next/server";
import { getLeadsWithGclidForExport } from "@/lib/google-sheets";

const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

function isAuthorized(request: Request): boolean {
  if (!ADMIN_SECRET) return false;
  // Support both header and query param for easy browser download
  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${ADMIN_SECRET}`) return true;

  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  return token === ADMIN_SECRET;
}

/**
 * Format datetime for Google Ads Offline Conversion Import
 * Expected format: yyyy-MM-dd HH:mm:ss+zzzz (e.g. 2024-01-15 14:30:00+0100)
 */
function formatGoogleAdsDateTime(isoString: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;

    // Format in Europe/Prague timezone using Intl
    const parts = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Prague",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(d);

    const get = (type: string): string =>
      parts.find((p) => p.type === type)?.value ?? "00";

    const dateStr = `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;

    // Calculate Prague offset
    const utc = d.getTime();
    const pragueTime = new Date(
      utc + new Date(utc).getTimezoneOffset() * 60000,
    );
    // Use Intl to get the actual offset
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: "Europe/Prague",
      timeZoneName: "shortOffset",
    });
    const tzPart = formatter
      .formatToParts(d)
      .find((p) => p.type === "timeZoneName");
    // tzPart.value is like "GMT+1" or "GMT+2"
    const offsetMatch = tzPart?.value?.match(/GMT([+-]\d+)/);
    const offsetHours = offsetMatch ? parseInt(offsetMatch[1], 10) : 1;
    const sign = offsetHours >= 0 ? "+" : "-";
    const absHours = Math.abs(offsetHours);
    const offsetStr = `${sign}${String(absHours).padStart(2, "0")}00`;

    return `${dateStr}${offsetStr}`;
  } catch {
    return isoString;
  }
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const leads = await getLeadsWithGclidForExport();

    const CONVERSION_NAME =
      process.env.GOOGLE_ADS_CONVERSION_NAME ?? "Offline Lead Conversion";

    // Google Ads Offline Conversion Import CSV format
    const header =
      "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency";
    const rows = leads.map((lead) =>
      [
        escapeCSV(lead.gclid),
        escapeCSV(CONVERSION_NAME),
        escapeCSV(
          formatGoogleAdsDateTime(lead.conversion_time || lead.timestamp),
        ),
        escapeCSV(lead.conversion_value || "0"),
        escapeCSV(lead.conversion_currency || "CZK"),
      ].join(","),
    );

    const csv = [header, ...rows].join("\n");
    const filename = `gclid-export-${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[conversions-export] Error:", message);
    return NextResponse.json(
      {
        ok: false,
        code: "GOOGLE_SHEETS_ERROR",
        error: `Google Sheets unavailable: ${message}`,
      },
      { status: 500 },
    );
  }
}
