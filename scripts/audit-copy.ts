#!/usr/bin/env tsx
/**
 * VR-329: Czech Copy Native Quality Audit
 * Extracts visible text blocks from 10 key pages, analyzes AI markers.
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "audit-copy.txt");

const KEY_PAGES = [
  { name: "Homepage", file: "src/components/home-page-content.tsx" },
  { name: "/o-nas", file: "src/app/o-nas/page.tsx" },
  { name: "/reference", file: "src/app/reference/page.tsx" },
  { name: "/jak-to-funguje", file: "src/app/jak-to-funguje/page.tsx" },
  { name: "/proc-my", file: "src/app/proc-my/page.tsx" },
  { name: "/garance-vykupu", file: "src/app/garance-vykupu/page.tsx" },
  { name: "/caste-dotazy", file: "src/app/caste-dotazy/page.tsx" },
  { name: "/vykup-pri-exekuci", file: "src/app/vykup-pri-exekuci/page.tsx" },
  { name: "/vykup-pri-dedictvi", file: "src/app/vykup-pri-dedictvi/page.tsx" },
  { name: "/blog (index)", file: "src/app/blog/page.tsx" },
  { name: "Testimonials data", file: "src/data/testimonials.ts" },
];

const AI_MARKERS = [
  { pattern: /transparentn[íě]/gi, label: "transparentní" },
  { pattern: /férov[ýáéě]/gi, label: "férový" },
  { pattern: /profesionáln[íě]/gi, label: "profesionální" },
  { pattern: /bez starostí/gi, label: "bez starostí" },
  { pattern: /bez zbytečn/gi, label: "bez zbytečných" },
  { pattern: /diskrétn[íěé]/gi, label: "diskrétní" },
  { pattern: /nezávazn/gi, label: "nezávazný" },
  { pattern: /vřele doporuč/gi, label: "vřele doporučuji" },
  { pattern: /hladk|hladce/gi, label: "hladce" },
  { pattern: /novou kapitolu/gi, label: "novou kapitolu" },
  { pattern: /začít znovu/gi, label: "začít znovu" },
  { pattern: /maximáln[íě]/gi, label: "maximální" },
  { pattern: /vešker[éý]/gi, label: "veškeré" },
  { pattern: /kompletní/gi, label: "kompletní" },
  { pattern: /zcela/gi, label: "zcela" },
  { pattern: /bez provize/gi, label: "bez provize" },
  { pattern: /zdarma a nezávazně/gi, label: "zdarma a nezávazně" },
  { pattern: /do 24 hodin/gi, label: "do 24 hodin" },
];

function extractTextBlocks(content: string): string[] {
  const blocks: string[] = [];
  const stringPatterns = [/>([^<>{}\n]+)</g, /["']([^"']{15,})["']/g];
  for (const pattern of stringPatterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (
        text.length > 5 &&
        !text.startsWith("http") &&
        !text.startsWith("/") &&
        !text.includes("className") &&
        !text.includes("import") &&
        !text.match(/^[a-z]+[A-Z]/) &&
        !text.match(/^\{/) &&
        !text.match(/^#/) &&
        !text.includes("@type") &&
        !text.includes("schema.org") &&
        text !== "application/ld+json"
      ) {
        blocks.push(text);
      }
    }
  }
  return [...new Set(blocks)];
}

function analyzeMarkers(
  blocks: string[],
): Map<string, { count: number; examples: string[] }> {
  const results = new Map<string, { count: number; examples: string[] }>();
  for (const marker of AI_MARKERS) {
    let totalCount = 0;
    const examples: string[] = [];
    for (const block of blocks) {
      const matches = block.match(marker.pattern);
      if (matches) {
        totalCount += matches.length;
        if (examples.length < 3) examples.push(block.slice(0, 120));
      }
    }
    if (totalCount > 0)
      results.set(marker.label, { count: totalCount, examples });
  }
  return results;
}

const output: string[] = [];
output.push("=".repeat(70));
output.push("VR-329: CZECH COPY NATIVE QUALITY AUDIT");
output.push("Generated: " + new Date().toISOString());
output.push("=".repeat(70));

const allBlocks: string[] = [];
for (const page of KEY_PAGES) {
  const filePath = path.join(ROOT, page.file);
  if (!fs.existsSync(filePath)) {
    output.push(`\nMISSING: ${page.name}`);
    continue;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const blocks = extractTextBlocks(content);
  allBlocks.push(...blocks);
  output.push(`\n--- ${page.name} (${page.file}) ---`);
  for (const block of blocks) output.push(`  ${block}`);
}

output.push(`\n\n${"=".repeat(70)}\nAI MARKER ANALYSIS\n${"=".repeat(70)}`);
const markers = analyzeMarkers(allBlocks);
const sorted = [...markers.entries()].sort((a, b) => b[1].count - a[1].count);
for (const [label, data] of sorted) {
  output.push(`\n"${label}" - ${data.count} occurrences`);
  for (const ex of data.examples) output.push(`  > ${ex}`);
}

output.push(`\n\n${"=".repeat(70)}\nREPETITIVE PATTERNS\n${"=".repeat(70)}`);
const phraseMap = new Map<string, number>();
for (const block of allBlocks) {
  const n = block.toLowerCase().trim();
  if (n.length > 20) phraseMap.set(n, (phraseMap.get(n) || 0) + 1);
}
const repeated = [...phraseMap.entries()]
  .filter(([, c]) => c > 1)
  .sort((a, b) => b[1] - a[1]);
for (const [phrase, count] of repeated.slice(0, 20))
  output.push(`  ${count}x "${phrase.slice(0, 100)}"`);

output.push(`\n\nTotal text blocks: ${allBlocks.length}`);
output.push(`AI marker types: ${sorted.length}`);
output.push(`Repeated phrases: ${repeated.length}`);

fs.writeFileSync(OUT, output.join("\n"), "utf-8");
console.log(
  `Audit written to audit-copy.txt (${allBlocks.length} blocks, ${sorted.length} marker types)`,
);
