/**
 * Codebase audit: catch any internal href / URL string that points to a
 * regional subdomain *content* path. All such hrefs cause an extra 301
 * hop because src/middleware.ts redirects subdomain content → root.
 *
 * Allowed absolute subdomain URLs:
 *  - `https://<region>.vykoupim-nemovitost.cz`     (bare region home)
 *  - `https://<region>.vykoupim-nemovitost.cz/`    (bare region home, trailing /)
 *
 * Flagged:
 *  - `https://<region>.vykoupim-nemovitost.cz/<anything-else>`
 *  - `https://www.vykoupim-nemovitost.cz/<anything-but-empty>` (www inner pages
 *    redirect to non-www; the apex root URL itself is fine).
 *
 * Usage:
 *   npm run audit:subdomain-hrefs   # exits 1 if findings exist
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = "vykoupim-nemovitost.cz";

/** Regex: any absolute subdomain URL (subdomain may include www) */
const SUBDOMAIN_URL_RE =
  /https:\/\/([a-z0-9-]+)\.vykoupim-nemovitost\.cz([^"'\s)]*)/g;

/** Subdomains we never care about (tracking pixels etc.) */
const EXTERNAL_HOSTS = new Set<string>([
  "www.googletagmanager.com",
  "www.facebook.com",
  "www.uoou.cz",
]);

interface Source {
  path: string;
  text: string;
}

interface Finding {
  path: string;
  href: string;
}

export function findSubdomainContentHrefs(sources: Source[]): Finding[] {
  const findings: Finding[] = [];
  for (const src of sources) {
    SUBDOMAIN_URL_RE.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = SUBDOMAIN_URL_RE.exec(src.text)) !== null) {
      const [full, sub, rest] = match;
      // Skip external tracking hosts that happen to match (they are
      // www.googletagmanager.com etc., not our subdomains).
      const fullHost = `${sub}.${ROOT}`;
      if (EXTERNAL_HOSTS.has(fullHost)) continue;
      // Allow bare root + bare home subdomain.
      if (rest === "" || rest === "/") continue;
      findings.push({ path: src.path, href: full });
    }
  }
  return findings;
}

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md"]);
const IGNORE_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "coverage",
  "dist",
  "build",
  "test-results",
  "playwright-report",
  "tests", // never lint our tests for "bad" hrefs (they intentionally include them)
  "scripts", // the audit script itself contains the URL literally
  "docs", // planning / runbook docs — not crawled by middleware, may contain example URLs
]);

function walk(dir: string, acc: string[]): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), acc);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (SCAN_EXTENSIONS.has(ext)) acc.push(path.join(dir, entry.name));
    }
  }
}

export async function auditCodebase(): Promise<Finding[]> {
  const cwd = process.cwd();
  const files: string[] = [];
  walk(cwd, files);
  const sources: Source[] = files.map((p) => ({
    path: path.relative(cwd, p),
    text: fs.readFileSync(p, "utf8"),
  }));
  return findSubdomainContentHrefs(sources);
}

async function main(): Promise<void> {
  const findings = await auditCodebase();
  if (findings.length === 0) {
    console.log("✅ No subdomain content hrefs found.");
    return;
  }
  console.error("❌ Subdomain content hrefs found:");
  for (const f of findings) {
    console.error(`  ${f.path}: ${f.href}`);
  }
  process.exit(1);
}

// Use fileURLToPath to normalise Windows drive letters / backslashes so that
// the ESM import.meta.url comparison works correctly on all platforms.
const isDirectInvocation =
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectInvocation) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
