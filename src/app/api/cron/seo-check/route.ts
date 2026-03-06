import { NextResponse } from "next/server";
import { runSeoCheck, sendTelegramAlert } from "@/lib/seo-monitor";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await runSeoCheck();

  if (report.issues.length > 0) {
    await sendTelegramAlert(report);
  }

  return NextResponse.json(report);
}
