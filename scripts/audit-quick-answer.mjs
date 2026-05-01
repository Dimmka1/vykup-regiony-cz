/**
 * Audit Quick Answer word counts across priority pages.
 * Extracts the JSX content of <QuickAnswer>...</QuickAnswer> blocks
 * from source TSX, strips JSX/markup, counts words.
 *
 * Target: 134-167 words per AI Overview citation research.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "src/app";
const FILES_TO_AUDIT = [
  "vykup-bytu/page.tsx",
  "vykup-domu/page.tsx",
  "vykup-pozemku/page.tsx",
  "vykup-pri-exekuci/page.tsx",
  "vykup-pri-dedictvi/page.tsx",
  "vykup-pri-rozvodu/page.tsx",
  "vykup-spoluvlastnickeho-podilu/page.tsx",
  "vykup-nemovitosti-s-hypotekou/page.tsx",
  "vykup-nemovitosti-s-vecnym-bremenem/page.tsx",
  "vykup-v-drazbe/page.tsx",
  "vykup-cinzovnich-domu/page.tsx",
  "vykup-pri-privatizaci/page.tsx",
  "zpetny-najem/page.tsx",
  "jak-to-funguje/page.tsx",
  "caste-dotazy/page.tsx",
  "jak-stanovujeme-cenu/page.tsx",
  "redakcni-zasady/page.tsx",
  "zdroje-a-citace/page.tsx",
];

function extractQuickAnswerText(source) {
  // Find <QuickAnswer> ... </QuickAnswer> block (multiline)
  const m = source.match(/<QuickAnswer[^>]*>([\s\S]*?)<\/QuickAnswer>/);
  if (!m) return null;
  const inner = m[1];
  // Strip JSX tags and {} expressions for rough word count
  let text = inner
    .replace(/\{[^{}]*\}/g, " ") // {expressions}
    .replace(/<[^>]+>/g, " ") // <Tag>
    .replace(/&[a-z]+;/gi, " ") // entities
    .replace(/[\s]+/g, " ")
    .trim();
  return text;
}

let issues = 0;
console.log("\nQuick Answer audit — target 134-167 words\n");
for (const rel of FILES_TO_AUDIT) {
  const path = join(ROOT, rel);
  try {
    const src = readFileSync(path, "utf8");
    const text = extractQuickAnswerText(src);
    if (!text) {
      console.log(`  ✗ ${rel} — no <QuickAnswer> block found`);
      issues++;
      continue;
    }
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const ok = words >= 134 && words <= 167;
    if (!ok) {
      console.log(
        `  ${words < 100 ? "✗" : "⚠"} ${rel} — ${words} words ${words < 134 ? "(too short)" : "(too long)"}`,
      );
      if (words < 100) issues++;
    } else {
      console.log(`  ✓ ${rel} — ${words} words`);
    }
  } catch (e) {
    console.log(`  ! ${rel} — ${e.message}`);
    issues++;
  }
}
console.log(
  `\n${issues} hard issues. Soft warnings (slightly out of range) ok.\n`,
);
process.exit(issues > 0 ? 1 : 0);
