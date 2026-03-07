import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// VR-215: Production uptime monitor
// Vercel Cron hits this route every 5 minutes.
// Checks 4 endpoints; alerts via Telegram + Resend on failure.
// ---------------------------------------------------------------------------

const BASE_URL = "https://vykoupim-nemovitost.cz";
const TIMEOUT_MS = 10_000;

interface EndpointCheck {
  path: string;
  method: "GET" | "POST";
  expectedStatus: number;
}

const ENDPOINTS: EndpointCheck[] = [
  { path: "/", method: "GET", expectedStatus: 200 },
  { path: "/praha", method: "GET", expectedStatus: 200 },
  { path: "/api/leads", method: "POST", expectedStatus: 400 },
  { path: "/sitemap.xml", method: "GET", expectedStatus: 200 },
];

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

// ---------------------------------------------------------------------------
// Check single endpoint
// ---------------------------------------------------------------------------

interface CheckResult {
  url: string;
  method: string;
  expectedStatus: number;
  actualStatus: number | null;
  responseTimeMs: number;
  ok: boolean;
  error?: string;
}

async function checkEndpoint(ep: EndpointCheck): Promise<CheckResult> {
  const url = `${BASE_URL}${ep.path}`;
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      method: ep.method,
      signal: controller.signal,
      headers: { "User-Agent": "VykupRegiony-UptimeMonitor/1.0" },
      redirect: "follow",
    });

    clearTimeout(timer);
    const responseTimeMs = Date.now() - start;

    return {
      url,
      method: ep.method,
      expectedStatus: ep.expectedStatus,
      actualStatus: res.status,
      responseTimeMs,
      ok: res.status === ep.expectedStatus,
    };
  } catch (err) {
    const responseTimeMs = Date.now() - start;
    const message = err instanceof Error ? err.message : "Unknown error";

    return {
      url,
      method: ep.method,
      expectedStatus: ep.expectedStatus,
      actualStatus: null,
      responseTimeMs,
      ok: false,
      error: message,
    };
  }
}

// ---------------------------------------------------------------------------
// Alerting — Telegram
// ---------------------------------------------------------------------------

async function sendTelegramAlert(failures: CheckResult[]): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return; // silent skip (AC-5)

  const lines = [
    "🚨 <b>UPTIME ALERT — vykoupim-nemovitost.cz</b>",
    "",
    ...failures.map((f) => {
      const status =
        f.actualStatus !== null ? String(f.actualStatus) : "TIMEOUT/ERR";
      const detail = f.error ? ` (${f.error})` : "";
      return [
        `❌ <b>${f.method} ${f.url}</b>`,
        `   Status: ${status} (expected ${f.expectedStatus})${detail}`,
        `   Response time: ${f.responseTimeMs}ms`,
      ].join("\n");
    }),
    "",
    `🕐 ${new Date().toISOString()}`,
  ];

  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join("\n"),
      parse_mode: "HTML",
    }),
  });
}

// ---------------------------------------------------------------------------
// Alerting — Email (Resend)
// ---------------------------------------------------------------------------

async function sendEmailAlert(failures: CheckResult[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) return; // silent skip (AC-5)

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";

  const rows = failures
    .map((f) => {
      const status =
        f.actualStatus !== null ? String(f.actualStatus) : "TIMEOUT/ERR";
      const detail = f.error ? ` — ${f.error}` : "";
      return `<tr>
        <td>${f.method} ${f.url}</td>
        <td>${status} (expected ${f.expectedStatus})${detail}</td>
        <td>${f.responseTimeMs}ms</td>
      </tr>`;
    })
    .join("\n");

  const html = `
    <h2>🚨 Uptime Alert — vykoupim-nemovitost.cz</h2>
    <p>The following endpoints failed their health check:</p>
    <table border="1" cellpadding="6" cellspacing="0">
      <tr><th>Endpoint</th><th>Status</th><th>Response Time</th></tr>
      ${rows}
    </table>
    <p>Checked at: ${new Date().toISOString()}</p>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Uptime Monitor <${fromEmail}>`,
      to: [notifyEmail],
      subject: `🚨 Downtime detected — vykoupim-nemovitost.cz`,
      html,
    }),
  });
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  // Auth check — Vercel Cron sends CRON_SECRET automatically
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Run all checks in parallel
  const results = await Promise.all(ENDPOINTS.map(checkEndpoint));
  const failures = results.filter((r) => !r.ok);

  if (failures.length > 0) {
    // Fire alerts in parallel — don't let one failing block the other
    await Promise.allSettled([
      sendTelegramAlert(failures),
      sendEmailAlert(failures),
    ]);
  }

  return NextResponse.json({
    checked: results.length,
    failures: failures.length,
    results,
    timestamp: new Date().toISOString(),
  });
}
