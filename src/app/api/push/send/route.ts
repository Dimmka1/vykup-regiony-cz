import { NextResponse } from "next/server";
import webpush from "web-push";
import { z } from "zod";

const sendSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  url: z.string().default("/"),
});

interface SheetRow {
  endpoint: string;
  p256dh: string;
  auth: string;
}

async function getSubscribers(): Promise<SheetRow[]> {
  const spreadsheetId = process.env.PUSH_SUBSCRIBERS_SPREADSHEET_ID;
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;

  if (!spreadsheetId || !apiKey) {
    throw new Error(
      "PUSH_SUBSCRIBERS_SPREADSHEET_ID or GOOGLE_SHEETS_API_KEY not set",
    );
  }

  const sheetName = "push_subscribers";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}?key=${apiKey}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as { values?: string[][] };
  const rows = data.values;
  if (!rows || rows.length < 2) return [];

  const headers = rows[0];
  const endpointIdx = headers.indexOf("endpoint");
  const p256dhIdx = headers.indexOf("p256dh");
  const authIdx = headers.indexOf("auth");

  if (endpointIdx === -1 || p256dhIdx === -1 || authIdx === -1) {
    throw new Error("Sheet missing required columns: endpoint, p256dh, auth");
  }

  return rows
    .slice(1)
    .map((row) => ({
      endpoint: row[endpointIdx] || "",
      p256dh: row[p256dhIdx] || "",
      auth: row[authIdx] || "",
    }))
    .filter((r) => r.endpoint && r.p256dh && r.auth);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const reqApiKey = request.headers.get("x-api-key");
    if (!reqApiKey || reqApiKey !== process.env.PUSH_API_KEY) {
      return NextResponse.json(
        { ok: false, code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const result = sendSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          ok: false,
          code: "VALIDATION_ERROR",
          errors: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { title, body: notifBody, url } = result.data;

    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublic || !vapidPrivate) {
      return NextResponse.json(
        { ok: false, code: "VAPID_NOT_CONFIGURED" },
        { status: 500 },
      );
    }

    webpush.setVapidDetails(
      "mailto:info@vykoupim-nemovitost.cz",
      vapidPublic,
      vapidPrivate,
    );

    const subscribers = await getSubscribers();

    if (subscribers.length === 0) {
      return NextResponse.json(
        { ok: true, sent: 0, failed: 0, message: "No subscribers" },
        { status: 200 },
      );
    }

    const payload = JSON.stringify({ title, body: notifBody, url });

    const results = await Promise.allSettled(
      subscribers.map((sub) =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload,
        ),
      ),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({ ok: true, sent, failed }, { status: 200 });
  } catch (error) {
    console.error("[push-send] Error:", error);
    return NextResponse.json(
      { ok: false, code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
