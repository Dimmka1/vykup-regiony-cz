#!/usr/bin/env npx tsx
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    title: { type: "string" },
    body: { type: "string" },
    url: { type: "string", default: "/" },
  },
  strict: true,
  allowPositionals: false,
});

if (!values.title || !values.body) {
  console.error(
    "Usage: npx tsx scripts/send-push.ts --title '...' --body '...' [--url '/...']",
  );
  process.exit(1);
}

const baseUrl = process.env.PUSH_SEND_URL || "http://localhost:3000";
const pushApiKey = process.env.PUSH_API_KEY;

if (!pushApiKey) {
  console.error("Error: PUSH_API_KEY env var not set");
  process.exit(1);
}

async function main() {
  const res = await fetch(`${baseUrl}/api/push/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": pushApiKey!,
    },
    body: JSON.stringify({
      title: values.title,
      body: values.body,
      url: values.url,
    }),
  });

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));

  if (!res.ok) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
