/**
 * Fetch the current ČNB 2T repo rate and update src/lib/cnb-rate.ts.
 *
 * Usage: npx tsx scripts/update-cnb-rate.ts
 *
 * Data source: ČNB ARAD public text export (no API key needed).
 * Fallback: HTML scrape from cnb.cz main page.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const CONFIG_PATH = resolve(__dirname, "../src/lib/cnb-rate.ts");

/** Parse rate from ČNB ARAD text export (CSV-like, pipe-separated). */
async function fetchFromArad(): Promise<number | null> {
  // ČNB publishes daily fixing / monetary policy rates as text
  const url =
    "https://www.cnb.cz/cs/financni-trhy/penezni-trh/sazby-cnb/denni_tabulka.txt";
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const text = await res.text();
    // The file typically has lines like:
    // 2T repo sazba|3.75
    const match = text.match(/2T\s+repo\s+sazba\|(\d+[.,]\d+)/i);
    if (match) {
      return parseFloat(match[1].replace(",", "."));
    }
    // Alternative: look for a line with "repo" and a decimal
    const altMatch = text.match(/repo.*?(\d+[.,]\d+)/i);
    if (altMatch) {
      return parseFloat(altMatch[1].replace(",", "."));
    }
    return null;
  } catch {
    return null;
  }
}

/** Fallback: scrape the ČNB homepage for the 2T repo rate. */
async function fetchFromHomepage(): Promise<number | null> {
  const url = "https://www.cnb.cz/cs/";
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return null;
    const html = await res.text();
    // Look for "2T repo sazba" followed by a percentage
    const match = html.match(
      /2T\s+repo\s+sazba[\s\S]{0,200}?(\d+[.,]\d+)\s*%/i,
    );
    if (match) {
      return parseFloat(match[1].replace(",", "."));
    }
    return null;
  } catch {
    return null;
  }
}

function generateConfig(rate: number, dateIso: string): string {
  return `/**
 * ČNB repo rate configuration.
 *
 * Updated automatically via \`npm run update:cnb-rate\`.
 * Manual edits are safe — the update script rewrites this file.
 */

export interface CnbRateConfig {
  /** 2T repo sazba ČNB (%) */
  readonly repoRate: number;
  /** ISO date of last data update */
  readonly lastUpdated: string;
  /** Human-readable source label */
  readonly source: string;
}

export const CNB_RATE: CnbRateConfig = {
  repoRate: ${rate},
  lastUpdated: "${dateIso}",
  source: "Česká národní banka",
};
`;
}

async function main(): Promise<void> {
  console.log("⏳ Fetching ČNB 2T repo rate…");

  let rate = await fetchFromArad();
  if (rate !== null) {
    console.log(`✅ ARAD: ${rate}%`);
  } else {
    console.log("⚠️  ARAD unavailable, trying homepage…");
    rate = await fetchFromHomepage();
    if (rate !== null) {
      console.log(`✅ Homepage: ${rate}%`);
    }
  }

  if (rate === null) {
    console.error("❌ Could not fetch rate from any source. Config unchanged.");
    process.exit(1);
  }

  const today = new Date().toISOString().slice(0, 10);
  const content = generateConfig(rate, today);
  writeFileSync(CONFIG_PATH, content, "utf-8");
  console.log(`📝 Updated ${CONFIG_PATH}`);
  console.log(`   repoRate: ${rate}%, lastUpdated: ${today}`);
}

main();
