import { NextResponse } from "next/server";
import { getAllLeads, saveAllLeads } from "@/lib/lead-store";
import {
  renderDripDay1,
  DRIP_DAY1_SUBJECT,
} from "@/lib/email-templates/drip-day1";
import {
  renderDripDay3,
  DRIP_DAY3_SUBJECT,
} from "@/lib/email-templates/drip-day3";
import {
  renderDripDay7,
  DRIP_DAY7_SUBJECT,
} from "@/lib/email-templates/drip-day7";

const DAY_MS = 24 * 60 * 60 * 1000;

interface DripStep {
  step: number;
  minAgeMs: number;
  maxAgeMs: number;
  subject: string;
  render: (opts: { siteUrl: string; unsubscribeUrl: string }) => string;
}

const DRIP_STEPS: DripStep[] = [
  {
    step: 1,
    minAgeMs: 1 * DAY_MS,
    maxAgeMs: 3 * DAY_MS,
    subject: DRIP_DAY1_SUBJECT,
    render: renderDripDay1,
  },
  {
    step: 2,
    minAgeMs: 3 * DAY_MS,
    maxAgeMs: 7 * DAY_MS,
    subject: DRIP_DAY3_SUBJECT,
    render: renderDripDay3,
  },
  {
    step: 3,
    minAgeMs: 7 * DAY_MS,
    maxAgeMs: 30 * DAY_MS,
    subject: DRIP_DAY7_SUBJECT,
    render: renderDripDay7,
  },
];

async function sendEmail(opts: {
  apiKey: string;
  from: string;
  to: string;
  subject: string;
  html: string;
}): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      from: `Výkup Nemovitostí <${opts.from}>`,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[drip] Resend error for ${opts.to}:`, res.status, body);
    return false;
  }
  return true;
}

export async function GET(request: Request): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET not configured" },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "RESEND_API_KEY not configured" },
      { status: 500 },
    );
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vykoupim-nemovitost.cz";
  const unsubscribeUrl = process.env.UNSUBSCRIBE_URL ?? `${siteUrl}/odhlasit`;

  const leads = getAllLeads();
  const now = Date.now();
  let sent = 0;
  let skipped = 0;

  for (const lead of leads) {
    const ageMs = now - new Date(lead.created_at).getTime();
    if (!lead.email) continue;

    for (const step of DRIP_STEPS) {
      if (lead.drip_sent.includes(step.step)) continue;
      if (ageMs < step.minAgeMs || ageMs >= step.maxAgeMs) continue;
      if (step.step > 1 && !lead.drip_sent.includes(step.step - 1)) continue;

      const html = step.render({ siteUrl, unsubscribeUrl });
      const success = await sendEmail({
        apiKey,
        from: fromEmail,
        to: lead.email,
        subject: step.subject,
        html,
      });

      if (success) {
        lead.drip_sent.push(step.step);
        sent++;
        console.log(`[drip] Sent step ${step.step} to ${lead.email}`);
      } else {
        skipped++;
      }
      break;
    }
  }

  saveAllLeads(leads);

  return NextResponse.json({
    ok: true,
    processed: leads.length,
    sent,
    skipped,
  });
}
