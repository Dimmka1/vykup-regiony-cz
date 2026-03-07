import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { SerpHistory } from "@/lib/serp-keywords";

const HISTORY_FILE = join(process.cwd(), "data", "serp-history.json");

export async function GET(): Promise<NextResponse> {
  if (!existsSync(HISTORY_FILE)) {
    return NextResponse.json({ snapshots: [] } satisfies SerpHistory);
  }
  try {
    const data = JSON.parse(readFileSync(HISTORY_FILE, "utf-8")) as SerpHistory;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ snapshots: [] } satisfies SerpHistory);
  }
}
