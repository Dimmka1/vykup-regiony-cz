/**
 * CLI trigger for SEO check via API route.
 * Usage: npx tsx scripts/seo-check.ts [url]
 */
const url = process.argv[2] || "http://localhost:3000/api/cron/seo-check";
const secret = process.env.CRON_SECRET || "test";

fetch(url, { headers: { Authorization: `Bearer ${secret}` } })
  .then((r) => r.json())
  .then((report) => {
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.issues?.length ? 1 : 0);
  })
  .catch((err) => {
    console.error("Failed to reach SEO check endpoint:", err);
    process.exit(2);
  });
