#!/usr/bin/env node
import { spawn } from "node:child_process";

// Always inject today's UTC date as BUILD_DATE so Next reads it
// inside src/lib/sitemap-helpers.ts for every <lastmod> entry.
const today = new Date().toISOString().slice(0, 10);
process.env.BUILD_DATE = process.env.BUILD_DATE ?? today;

const isWindows = process.platform === "win32";
const child = spawn(isWindows ? "next.cmd" : "next", ["build"], {
  stdio: "inherit",
  env: process.env,
  shell: isWindows,
});

child.on("exit", (code) => process.exit(code ?? 0));

child.on("error", (err) => {
  process.stderr.write(`build.mjs: failed to spawn Next.js: ${err.message}\n`);
  process.exit(1);
});
