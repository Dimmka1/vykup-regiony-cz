import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const LEADS_FILE = "/tmp/leads-backup.json";
const TRACKING_FILE = "/tmp/review-requests-sent.json";
const REVIEW_DELAY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface LeadRecord {
  email?: string;
  lead_id: string;
  timestamp: string;
  data: {
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
  };
}

function loadSentIds(): Set<string> {
  try {
    if (!existsSync(TRACKING_FILE)) return new Set();
    const raw = readFileSync(TRACKING_FILE, "utf-8");
    const arr: string[] = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function saveSentIds(ids: Set<string>): void {
  writeFileSync(TRACKING_FILE, JSON.stringify([...ids]), "utf-8");
}

function loadLeads(): LeadRecord[] {
  try {
    if (!existsSync(LEADS_FILE)) return [];
    const raw = readFileSync(LEADS_FILE, "utf-8");
    return raw
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LeadRecord);
  } catch {
    return [];
  }
}

function buildReviewEmailHtml(name: string, siteUrl: string): string {
  const reviewUrl = `${siteUrl}/napiste-recenzi`;
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;background:#f9fafb">
  <div style="background:#fff;border-radius:8px;padding:30px;border:1px solid #e5e7eb">
    <h2 style="color:#1a56db;margin-top:0">Jak jste byli spokojeni?</h2>
    <p>Dobrý den${name ? ` <strong>${name}</strong>` : ""},</p>
    <p>děkujeme za zájem o náš výkup nemovitostí. Rádi bychom se zeptali, jak jste byli spokojeni s naší službou.</p>
    <p>Vaše zpětná vazba nám pomáhá zlepšovat naše služby a pomáhá dalším klientům při rozhodování.</p>
    <div style="text-align:center;margin:30px 0">
      <a href="${reviewUrl}" style="display:inline-block;background:#1a56db;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:bold;font-size:16px">Napsat recenzi</a>
    </div>
    <p style="color:#6b7280;font-size:14px">Zabere to jen minutku a velmi si toho vážíme.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0">
    <p style="font-size:12px;color:#9ca3af;margin-bottom:0">Tento e-mail byl odeslán automaticky z webu vykoupím-nemovitost.cz</p>
  </div>
</body>
</html>`;
}

async function sendReviewEmail(
  email: string,
  name: string,
  siteUrl: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";

  if (!apiKey) {
    console.error("[review-request] RESEND_API_KEY not set");
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `Výkup Nemovitostí <${fromEmail}>`,
        to: [email],
        subject: "Jak jste byli spokojeni s naší službou?",
        html: buildReviewEmailHtml(name, siteUrl),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[review-request] Email send failed:", {
        email,
        status: res.status,
        body,
      });
      return false;
    }

    return true;
  } catch (error: unknown) {
    console.error("[review-request] Email error:", {
      email,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vykoupim-nemovitost.cz";
  const leads = loadLeads();
  const sentIds = loadSentIds();
  const now = Date.now();

  let sent = 0;
  let skipped = 0;

  for (const lead of leads) {
    // Skip callbacks and quick-estimates (no email)
    if (lead.lead_id.startsWith("cb_") || lead.lead_id.startsWith("qe_")) {
      continue;
    }

    // Skip already sent
    if (sentIds.has(lead.lead_id)) {
      skipped++;
      continue;
    }

    // Check if lead is older than 7 days
    const leadTime = new Date(lead.timestamp).getTime();
    if (isNaN(leadTime) || now - leadTime < REVIEW_DELAY_MS) {
      continue;
    }

    // Need email from the lead data
    const email = lead.email ?? lead.data.email;
    if (!email || !email.trim()) {
      sentIds.add(lead.lead_id); // Mark as processed to skip next time
      continue;
    }

    const name = lead.data.name ?? "";
    const success = await sendReviewEmail(email.trim(), name, siteUrl);

    if (success) {
      sentIds.add(lead.lead_id);
      sent++;
      console.log(`[review-request] Sent to ${email} (lead: ${lead.lead_id})`);
    }
  }

  saveSentIds(sentIds);

  console.log(
    `[review-request] Completed: ${sent} sent, ${skipped} already sent, ${leads.length} total leads`,
  );

  return NextResponse.json({
    ok: true,
    sent,
    skipped,
    total: leads.length,
  });
}
