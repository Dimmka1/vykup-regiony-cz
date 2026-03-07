import { NextResponse, type NextRequest } from "next/server";
import {
  collectWeeklyMetrics,
  formatEmailHtml,
  formatTelegramMessage,
} from "@/lib/digest";

/**
 * Vercel Cron: Weekly digest — every Monday 08:00 UTC (09:00 CET).
 * Collects lead metrics for past 7 days, sends HTML email via Resend
 * and compact Telegram summary.
 *
 * Env vars (all optional — skips silently if missing):
 *   CRON_SECRET          — Vercel cron auth token
 *   DIGEST_EMAIL         — recipient email for digest
 *   RESEND_API_KEY       — Resend API key
 *   RESEND_FROM_EMAIL    — sender address (default: noreply@vykoupim-nemovitost.cz)
 *   TELEGRAM_BOT_TOKEN   — Telegram Bot API token
 *   TELEGRAM_CHAT_ID     — Telegram chat to send to
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  // Verify Vercel Cron secret (if configured)
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const metrics = collectWeeklyMetrics(now);

  const results: { channel: string; ok: boolean; error?: string }[] = [];

  // --- Email via Resend ---
  const resendKey = process.env.RESEND_API_KEY;
  const digestEmail = process.env.DIGEST_EMAIL;

  if (resendKey && digestEmail) {
    try {
      const fromEmail =
        process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";
      const html = formatEmailHtml(metrics, dateStr);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: `Vykoupím Nemovitost <${fromEmail}>`,
          to: [digestEmail],
          subject: `📊 Týdenní digest — ${dateStr}`,
          html,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error("[weekly-digest] Email failed:", {
          status: res.status,
          body,
        });
        results.push({ channel: "email", ok: false, error: body });
      } else {
        results.push({ channel: "email", ok: true });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("[weekly-digest] Email error:", msg);
      results.push({ channel: "email", ok: false, error: msg });
    }
  } else {
    results.push({ channel: "email", ok: true, error: "skipped (no config)" });
  }

  // --- Telegram ---
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (botToken && chatId) {
    try {
      const text = formatTelegramMessage(metrics, dateStr);

      const res = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
        },
      );

      if (!res.ok) {
        const body = await res.text();
        console.error("[weekly-digest] Telegram failed:", {
          status: res.status,
          body,
        });
        results.push({ channel: "telegram", ok: false, error: body });
      } else {
        results.push({ channel: "telegram", ok: true });
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error("[weekly-digest] Telegram error:", msg);
      results.push({ channel: "telegram", ok: false, error: msg });
    }
  } else {
    results.push({
      channel: "telegram",
      ok: true,
      error: "skipped (no config)",
    });
  }

  return NextResponse.json({
    ok: true,
    date: dateStr,
    metrics: {
      totalLeads: metrics.totalLeads,
      avgScore: metrics.avgScore,
      topRegions: metrics.topRegions,
      prevTotalLeads: metrics.prev.totalLeads,
      prevAvgScore: metrics.prev.avgScore,
    },
    channels: results,
  });
}
