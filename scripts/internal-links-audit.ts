/**
 * VR-191: Internal links audit script
 * Usage: npx tsx scripts/internal-links-audit.ts
 * Output: docs/INTERNAL_LINKS_REPORT.md
 */

import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const APP_DIR = path.join(PROJECT_ROOT, "src/app");
const SRC_DIRS = [
  path.join(PROJECT_ROOT, "src/app"),
  path.join(PROJECT_ROOT, "src/components"),
  path.join(PROJECT_ROOT, "src/lib"),
  path.join(PROJECT_ROOT, "src/config"),
];
const OUTPUT = path.join(PROJECT_ROOT, "docs/INTERNAL_LINKS_REPORT.md");

// ── 1. Discover all valid routes ──

function discoverRoutes(): Set<string> {
  const routes = new Set<string>();

  function walkApp(dir: string, prefix: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith("api") || e.name.startsWith("_")) continue;
      if (e.isDirectory()) {
        if (e.name.startsWith("[")) continue;
        walkApp(path.join(dir, e.name), `${prefix}/${e.name}`);
      }
      if (e.name === "page.tsx" || e.name === "page.ts") {
        routes.add(prefix || "/");
      }
    }
  }
  walkApp(APP_DIR, "");

  // Blog posts (dynamic [slug])
  try {
    const blogDataRaw = fs.readFileSync(
      path.join(APP_DIR, "blog/data.ts"),
      "utf8",
    );
    const slugMatches = blogDataRaw.matchAll(/slug:\s*"([^"]+)"/g);
    for (const m of slugMatches) {
      routes.add(`/blog/${m[1]}`);
    }
  } catch {
    /* no blog data */
  }

  return routes;
}

// ── 2. Extract all internal links from source files ──

interface LinkRef {
  source: string;
  href: string;
  line: number;
}

function extractLinks(): LinkRef[] {
  const links: LinkRef[] = [];

  function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    const relPath = path.relative(PROJECT_ROOT, filePath);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const patterns = [
        /href=["'](\/[\w\-\/]*(?:#[\w\-]*)?)["']/g,
        /href:\s*["'](\/[\w\-\/]*(?:#[\w\-]*)?)["']/g,
      ];
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const href = match[1].split("#")[0].split("?")[0];
          if (href && href.startsWith("/")) {
            links.push({ source: relPath, href, line: i + 1 });
          }
        }
      }
    }
  }

  function walkDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name === ".next") continue;
        walkDir(full);
      } else if (/\.(tsx?|jsx?)$/.test(e.name)) {
        processFile(full);
      }
    }
  }

  for (const d of SRC_DIRS) walkDir(d);
  return links;
}

// ── 3. Build link graph & analyze ──

interface PageStats {
  inbound: Set<string>;
  outbound: Set<string>;
}

function fileToRoute(source: string): string | null {
  const match = source.match(/^src\/app\/(.+)\/page\.tsx?$/);
  if (match) return `/${match[1]}`;
  if (source === "src/app/page.tsx") return "/";
  return null;
}

function analyze() {
  const routes = discoverRoutes();
  const links = extractLinks();

  const norm = (href: string) => (href === "/" ? "/" : href.replace(/\/$/, ""));

  const stats = new Map<string, PageStats>();
  for (const route of routes) {
    stats.set(norm(route), { inbound: new Set(), outbound: new Set() });
  }

  const brokenLinks: LinkRef[] = [];

  for (const link of links) {
    const target = norm(link.href);
    if (!target) continue;

    if (!routes.has(target)) {
      // Skip anchors like /#kontakt
      if (target === "/") continue;
      brokenLinks.push(link);
      continue;
    }

    const sourcePage = fileToRoute(link.source) || `[${link.source}]`;
    const targetStats = stats.get(target);
    if (targetStats) {
      targetStats.inbound.add(sourcePage);
    }

    const sourceRoute = fileToRoute(link.source);
    if (sourceRoute) {
      const sourceStats = stats.get(norm(sourceRoute));
      if (sourceStats) {
        sourceStats.outbound.add(target);
      }
    }
  }

  return { routes, links, stats, brokenLinks };
}

// ── 4. Generate report ──

function generateReport() {
  const { routes, links, stats, brokenLinks } = analyze();

  const orphans: string[] = [];
  const lowInbound: string[] = [];

  for (const [route, pageStats] of stats) {
    const inCount = pageStats.inbound.size;
    if (inCount === 0) orphans.push(route);
    else if (inCount < 2) lowInbound.push(route);
  }

  orphans.sort();
  lowInbound.sort();

  const now = new Date().toISOString().split("T")[0];

  let report = `# Internal Links Audit Report

**Generated:** ${now}
**Total routes:** ${routes.size}
**Total internal links found:** ${links.length}
**Broken links:** ${brokenLinks.length}
**Orphan pages (0 inbound):** ${orphans.length}
**Low-link pages (<2 inbound):** ${lowInbound.length}

---

## Orphan Pages (0 inbound internal links)

${
  orphans.length === 0
    ? "✅ No orphan pages found!"
    : orphans.map((r) => `- \`${r}\``).join("\n")
}

## Low-Link Pages (<2 inbound internal links)

${
  lowInbound.length === 0
    ? "✅ All pages have ≥2 inbound links!"
    : lowInbound
        .map((r) => {
          const s = stats.get(r)!;
          return `- \`${r}\` — ${s.inbound.size} inbound from: ${[...s.inbound].join(", ")}`;
        })
        .join("\n")
}

## Broken Internal Links

${
  brokenLinks.length === 0
    ? "✅ No broken internal links found!"
    : brokenLinks
        .map((l) => `- \`${l.href}\` in \`${l.source}:${l.line}\``)
        .join("\n")
}

## Per-Page Link Summary

| Route | Inbound | Outbound | Total |
|-------|---------|----------|-------|
${[...stats.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([route, s]) => {
    const total = s.inbound.size + s.outbound.size;
    const flag = total < 3 ? " ⚠️" : "";
    return `| \`${route}\` | ${s.inbound.size} | ${s.outbound.size} | ${total}${flag} |`;
  })
  .join("\n")}
`;

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, report, "utf8");
  console.log("Report written to docs/INTERNAL_LINKS_REPORT.md");
  console.log("  Routes:", routes.size);
  console.log("  Links:", links.length);
  console.log("  Broken:", brokenLinks.length);
  console.log("  Orphans:", orphans.length);
  console.log("  Low-link:", lowInbound.length);
}

generateReport();
