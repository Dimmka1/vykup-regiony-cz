import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

/**
 * POST /api/webhooks/sentry
 *
 * Receives Sentry webhook alerts (event_alert / issue) and forwards
 * formatted notifications to Telegram.
 *
 * Required env vars:
 *   SENTRY_WEBHOOK_SECRET  – webhook client secret for HMAC verification
 *   TELEGRAM_BOT_TOKEN     – Telegram bot token (shared with lead notifications)
 *   TELEGRAM_CHAT_ID       – Telegram chat id (shared with lead notifications)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SentryEventAlertPayload {
  action: string;
  data: {
    event: {
      event_id?: string;
      title?: string;
      message?: string;
      level?: string;
      culprit?: string;
      url?: string;
      web_url?: string;
      timestamp?: number;
      tags?: Array<{ key: string; value: string }> | Record<string, string>;
      exception?: {
        values?: Array<{
          type?: string;
          value?: string;
          stacktrace?: {
            frames?: Array<{
              filename?: string;
              function?: string;
              lineno?: number;
              colno?: number;
            }>;
          };
        }>;
      };
    };
    triggered_rule?: string;
  };
}

interface SentryIssuePayload {
  action: string;
  data: {
    issue: {
      id?: string;
      title?: string;
      culprit?: string;
      level?: string;
      permalink?: string;
      shortId?: string;
      metadata?: {
        type?: string;
        value?: string;
        filename?: string;
        function?: string;
      };
    };
  };
}

type SentryWebhookPayload = SentryEventAlertPayload | SentryIssuePayload;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.SENTRY_WEBHOOK_SECRET;
  if (!secret) {
    console.warn(
      "[sentry-webhook] SENTRY_WEBHOOK_SECRET not set — rejecting request",
    );
    return false;
  }
  if (!signature) return false;

  const hmac = createHmac("sha256", secret);
  hmac.update(rawBody, "utf8");
  const expected = hmac.digest("hex");

  // Constant-time comparison
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}

function isAllowedLevel(level: string | undefined): boolean {
  if (!level) return false;
  const normalized = level.toLowerCase();
  return normalized === "error" || normalized === "fatal";
}

interface ParsedAlert {
  errorMessage: string;
  endpoint: string;
  stackFrame: string;
  level: string;
  timestamp: string;
  sentryLink: string;
}

function parseEventAlert(payload: SentryEventAlertPayload): ParsedAlert | null {
  const event = payload.data?.event;
  if (!event) return null;

  const level = (event.level ?? "error").toLowerCase();
  if (!isAllowedLevel(level)) return null;

  const errorMessage = event.title ?? event.message ?? "Unknown error";
  const endpoint = event.culprit ?? event.url ?? "unknown";
  const sentryLink = event.web_url ?? "";
  const timestamp = event.timestamp
    ? new Date(event.timestamp * 1000).toISOString()
    : new Date().toISOString();

  // Extract first meaningful stack frame (Sentry: last frame = most recent)
  let stackFrame = "";
  const exception = event.exception;
  if (exception?.values?.length) {
    const firstException = exception.values[0];
    const frames = firstException?.stacktrace?.frames;
    if (frames?.length) {
      const frame = frames[frames.length - 1];
      if (frame) {
        stackFrame = `${frame.filename ?? "?"}:${frame.lineno ?? "?"}${frame.function ? ` in ${frame.function}` : ""}`;
      }
    }
  }

  return { errorMessage, endpoint, stackFrame, level, timestamp, sentryLink };
}

function parseIssueAlert(payload: SentryIssuePayload): ParsedAlert | null {
  const issue = payload.data?.issue;
  if (!issue) return null;

  const level = (issue.level ?? "error").toLowerCase();
  if (!isAllowedLevel(level)) return null;

  const errorMessage = issue.title ?? "Unknown issue";
  const endpoint = issue.culprit ?? "unknown";
  const sentryLink = issue.permalink ?? "";
  const timestamp = new Date().toISOString();

  let stackFrame = "";
  if (issue.metadata) {
    const { filename, function: fn } = issue.metadata;
    if (filename) {
      stackFrame = `${filename}${fn ? ` in ${fn}` : ""}`;
    }
  }

  return { errorMessage, endpoint, stackFrame, level, timestamp, sentryLink };
}

function formatTelegramMessage(alert: ParsedAlert): string {
  const lines = [
    `🚨 <b>Sentry Alert:</b> ${escapeHtml(alert.errorMessage)}`,
    `📍 <b>Endpoint:</b> ${escapeHtml(alert.endpoint)}`,
    `⚠️ <b>Level:</b> ${alert.level}`,
  ];

  if (alert.stackFrame) {
    lines.push(`📂 <b>Stack:</b> ${escapeHtml(alert.stackFrame)}`);
  }

  lines.push(`🕐 <b>Time:</b> ${alert.timestamp}`);

  if (alert.sentryLink) {
    lines.push(
      `🔗 <a href="${escapeHtml(alert.sentryLink)}">Open in Sentry</a>`,
    );
  }

  return lines.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendTelegramAlert(text: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn(
      "[sentry-webhook] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set",
    );
    return;
  }

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    console.error("[sentry-webhook] Telegram API error:", {
      status: res.status,
      body,
    });
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawBody = await request.text();

    // AC-4: Verify webhook signature
    const signature = request.headers.get("sentry-hook-signature");
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json(
        { ok: false, error: "Invalid signature" },
        { status: 401 },
      );
    }

    const resource = request.headers.get("sentry-hook-resource");
    const payload: SentryWebhookPayload = JSON.parse(rawBody);

    let alert: ParsedAlert | null = null;

    if (resource === "event_alert") {
      alert = parseEventAlert(payload as SentryEventAlertPayload);
    } else if (resource === "issue") {
      alert = parseIssueAlert(payload as SentryIssuePayload);
    } else if (resource === "error") {
      // "error" resource uses same structure as event_alert
      alert = parseEventAlert(payload as SentryEventAlertPayload);
    } else {
      // Acknowledge unknown resources without sending alert
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "unsupported_resource",
      });
    }

    // AC-3: Skip if level is not error/fatal (filter applied inside parsers)
    if (!alert) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        reason: "filtered_level",
      });
    }

    // AC-2: Send Telegram notification
    const message = formatTelegramMessage(alert);
    await sendTelegramAlert(message);

    return NextResponse.json({ ok: true, sent: true });
  } catch (error: unknown) {
    console.error("[sentry-webhook] Error processing webhook:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
