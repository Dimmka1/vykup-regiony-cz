#!/usr/bin/env node

/**
 * update-prices.js
 *
 * Updates the `lastUpdated` timestamp in PRICE_RESEARCH.json.
 *
 * Usage:
 *   npm run update-prices
 *
 * Workflow:
 *   1. Manually collect fresh price data from Sreality, ČSÚ, RealityMIX, etc.
 *   2. Edit the `regions` object in PRICE_RESEARCH.json with new prices.
 *   3. Run `npm run update-prices` to stamp the current date.
 *   4. Commit & deploy — pages will show the new "Ceny aktualizovány" date.
 *
 * Future: This script can be extended with automated scraping/API calls.
 */

const fs = require("fs");
const path = require("path");

const PRICE_FILE = path.resolve(__dirname, "..", "PRICE_RESEARCH.json");

function main() {
  if (!fs.existsSync(PRICE_FILE)) {
    console.error("❌ PRICE_RESEARCH.json not found at:", PRICE_FILE);
    process.exit(1);
  }

  const raw = fs.readFileSync(PRICE_FILE, "utf-8");
  const data = JSON.parse(raw);

  const now = new Date().toISOString();
  data.lastUpdated = now;

  fs.writeFileSync(PRICE_FILE, JSON.stringify(data, null, 2) + "\n", "utf-8");

  console.log("✅ PRICE_RESEARCH.json updated");
  console.log(`   lastUpdated: ${now}`);
  console.log("");
  console.log(
    "📋 Reminder: Make sure you have updated the price data in the `regions`",
  );
  console.log("   object BEFORE running this script. Collect fresh data from:");
  console.log("   - https://realitymix.cz/statistika-nemovitosti/");
  console.log("   - https://csu.gov.cz (ČSÚ quarterly reports)");
  console.log("   - https://sreality.cz (market listings)");
  console.log("");
  console.log("   Then commit and deploy to update prices on all pages.");
}

main();
