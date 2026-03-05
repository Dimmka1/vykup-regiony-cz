import { NextResponse } from "next/server";
import {
  getActiveSubscribers,
  getSubscriber,
  updateSubscriber,
} from "@/lib/drip/subscriber";
import { dripEmails } from "@/lib/drip/templates";
import { DRIP_DAYS } from "@/lib/drip/types";

function daysSince(isoDate: string): number {
  const created = new Date(isoDate).getTime();
  const now = Date.now();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

async function sendDripEmail(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL ?? "noreply@vykoupim-nemovitost.cz";
  if (!apiKey) {
    console.error("[drip] RESEND_API_KEY not set");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: `Výkup Nemovitostí <${fromEmail}>`,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[drip] Send failed:", {
      to,
      subject,
      status: res.status,
      body,
    });
    return false;
  }
  return true;
}

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://vykoupim-nemovitost.cz";
  const emails = await getActiveSubscribers();
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const email of emails) {
    const sub = await getSubscriber(email);
    if (!sub || sub.unsubscribed) {
      skipped++;
      continue;
    }

    const elapsed = daysSince(sub.createdAt);
    const nextDay = DRIP_DAYS.find((d) => d > sub.lastSentDay && d <= elapsed);

    if (nextDay === undefined) {
      skipped++;
      continue;
    }

    const template = dripEmails.find((e) => e.day === nextDay);
    if (!template) {
      skipped++;
      continue;
    }

    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(Buffer.from(email).toString("base64url"))}`;
    const html = template.html({
      name: sub.name,
      region: sub.region,
      unsubscribeUrl,
    });

    const ok = await sendDripEmail(email, template.subject, html);
    if (ok) {
      await updateSubscriber(email, { lastSentDay: nextDay });
      sent++;
    } else {
      errors++;
    }
  }

  return NextResponse.json({
    ok: true,
    processed: emails.length,
    sent,
    skipped,
    errors,
  });
}
