import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fetchCoverageData, fetchSearchAnalytics } from "@/lib/gsc";

const SNAPSHOTS_DIR = "/tmp/gsc-snapshots";

interface GscSnapshot {
  date: string;
  indexed: number;
  submitted: number;
  totalClicks: number;
  totalImpressions: number;
}

function getSnapshotPath(): string {
  if (!existsSync(SNAPSHOTS_DIR)) {
    mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  }
  return join(SNAPSHOTS_DIR, "snapshots.json");
}

function loadSnapshots(): GscSnapshot[] {
  const path = getSnapshotPath();
  if (!existsSync(path)) return [];
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as GscSnapshot[];
  } catch {
    return [];
  }
}

function saveSnapshots(snapshots: GscSnapshot[]): void {
  writeFileSync(getSnapshotPath(), JSON.stringify(snapshots, null, 2));
}

async function sendTelegramAlert(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[gsc-cron] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set");
    return;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("[gsc-cron] Telegram alert failed:", res.status, body);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Verify cron secret (Vercel Cron sends this header)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [coverage, analytics] = await Promise.all([
      fetchCoverageData(),
      fetchSearchAnalytics(),
    ]);

    const today = new Date().toISOString().split("T")[0];

    const snapshot: GscSnapshot = {
      date: today,
      indexed: coverage.indexed,
      submitted: coverage.submitted,
      totalClicks: analytics.totals.clicks,
      totalImpressions: analytics.totals.impressions,
    };

    // Save snapshot
    const snapshots = loadSnapshots();
    // Remove today's entry if exists (idempotent)
    const filtered = snapshots.filter((s) => s.date !== today);
    filtered.push(snapshot);
    // Keep last 90 days
    const trimmed = filtered.slice(-90);
    saveSnapshots(trimmed);

    // Check if indexed == 0 for >7 days
    const recentSnapshots = trimmed.slice(-8);
    const allZero =
      recentSnapshots.length >= 8 &&
      recentSnapshots.every((s) => s.indexed === 0);

    if (allZero) {
      await sendTelegramAlert(
        [
          "🚨 <b>GSC Alert: 0 indexed pages for 7+ days!</b>",
          "",
          `📅 Checked: ${today}`,
          `📄 Submitted: ${coverage.submitted}`,
          `❌ Indexed: ${coverage.indexed}`,
          "",
          "Action needed: check Google Search Console for issues.",
        ].join("\n"),
      );
    }

    return NextResponse.json({
      ok: true,
      snapshot,
      alertSent: allZero,
      totalSnapshots: trimmed.length,
    });
  } catch (error: unknown) {
    console.error("[gsc-cron]", error);
    return NextResponse.json(
      {
        error: "Cron job failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
