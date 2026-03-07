#!/usr/bin/env node

/**
 * VR-218: JSON-LD Schema Validation (source-level)
 *
 * Scans .tsx/.ts source files for JSON-LD blocks defined as JS object literals.
 * Validates @context and @type are present and correct.
 *
 * Zero external dependencies — Node.js built-ins only.
 *
 * Usage: node scripts/validate-jsonld.js
 * Exit codes: 0 = all valid, 1 = errors found
 */

const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────────────────
const SRC_DIRS = ["src/app", "src/components"];
const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];
const VALID_CONTEXTS = ["https://schema.org", "http://schema.org"];

// ── Helpers ─────────────────────────────────────────────────────────────────

function findFiles(dir, exts) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, exts));
    } else if (exts.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extract balanced brace block starting from index (must point at '{').
 */
function extractBracedBlock(source, startIdx) {
  let depth = 0;
  let i = startIdx;
  while (i < source.length && source[i] !== "{") i++;
  if (i >= source.length) return null;

  const blockStart = i;
  while (i < source.length) {
    const ch = source[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return source.slice(blockStart, i + 1);
    } else if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      i++;
      if (quote === "`") {
        while (i < source.length) {
          if (source[i] === "\\") {
            i++;
          } else if (source[i] === "`") break;
          else if (source[i] === "$" && source[i + 1] === "{") {
            // skip template expression — just count braces
            i += 2;
            let td = 1;
            while (i < source.length && td > 0) {
              if (source[i] === "{") td++;
              else if (source[i] === "}") td--;
              i++;
            }
            continue;
          }
          i++;
        }
      } else {
        while (i < source.length && source[i] !== quote) {
          if (source[i] === "\\") i++;
          i++;
        }
      }
    }
    i++;
  }
  return null;
}

/**
 * Find JSON-LD object definitions in source code.
 */
function findJsonLdBlocks(source, filePath) {
  const blocks = [];
  const contextPattern = /"@context"\s*:\s*"https?:\/\/schema\.org"/g;
  let match;

  while ((match = contextPattern.exec(source)) !== null) {
    // Walk backwards to find the opening { of this object
    let braceDepth = 0;
    let objStart = match.index;

    for (let i = match.index - 1; i >= 0; i--) {
      const ch = source[i];
      if (ch === "}") braceDepth++;
      else if (ch === "{") {
        if (braceDepth === 0) {
          objStart = i;
          break;
        }
        braceDepth--;
      }
    }

    const block = extractBracedBlock(source, objStart);
    if (block) {
      const lineNum = source.slice(0, objStart).split("\n").length;
      blocks.push({ raw: block, line: lineNum, file: filePath });
    }
  }

  return blocks;
}

/**
 * Validate a JSON-LD block from source. Since these are JS objects (not pure JSON),
 * we use regex checks on the raw source rather than trying to JSON.parse.
 */
function validateBlock(block, relPath) {
  const location = `${relPath}:${block.line}`;
  const errors = [];

  // Check @context
  const contextMatch = block.raw.match(/"@context"\s*:\s*"(.*?)"/);
  if (!contextMatch) {
    errors.push(`${location}: missing @context`);
  } else if (!VALID_CONTEXTS.includes(contextMatch[1])) {
    errors.push(
      `${location}: unexpected @context "${contextMatch[1]}" (expected https://schema.org)`,
    );
  }

  // Check @type
  const typeMatch = block.raw.match(/"@type"\s*:\s*"(.*?)"/);
  if (!typeMatch) {
    errors.push(`${location}: missing @type`);
  }

  const type = typeMatch ? typeMatch[1] : "unknown";
  return { location, type, errors };
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const projectRoot = path.resolve(__dirname, "..");
  const allFiles = [];

  for (const dir of SRC_DIRS) {
    allFiles.push(...findFiles(path.join(projectRoot, dir), EXTENSIONS));
  }

  console.log("🔍 JSON-LD Schema Validation (source-level)\n");
  console.log(`   Scanning: ${SRC_DIRS.join(", ")}`);
  console.log(`   Files found: ${allFiles.length}\n`);

  let totalBlocks = 0;
  let validBlocks = 0;
  let invalidBlocks = 0;
  const allErrors = [];
  let filesWithJsonLd = 0;

  for (const filePath of allFiles) {
    const source = fs.readFileSync(filePath, "utf-8");

    // Quick filter
    if (!source.includes("@context")) continue;

    const blocks = findJsonLdBlocks(source, filePath);
    if (blocks.length === 0) continue;

    filesWithJsonLd++;
    const relPath = path.relative(projectRoot, filePath);

    for (const block of blocks) {
      totalBlocks++;
      const result = validateBlock(block, relPath);

      if (result.errors.length > 0) {
        invalidBlocks++;
        allErrors.push(...result.errors);
        console.log(
          `  ❌ ${result.location} [@type: ${result.type}] — ${result.errors.length} error(s)`,
        );
      } else {
        validBlocks++;
        console.log(`  ✅ ${result.location} [@type: ${result.type}]`);
      }
    }
  }

  // ── Summary ──
  console.log("\n" + "─".repeat(60));
  console.log("Summary:");
  console.log(`   Files scanned:       ${allFiles.length}`);
  console.log(`   Files with JSON-LD:  ${filesWithJsonLd}`);
  console.log(`   JSON-LD blocks:      ${totalBlocks}`);
  console.log(`   Valid:               ${validBlocks}`);
  console.log(`   Invalid:             ${invalidBlocks}`);

  if (allErrors.length > 0) {
    console.log(`\n❌ ${allErrors.length} error(s) found:\n`);
    for (const err of allErrors) {
      console.log(`   • ${err}`);
    }
    process.exitCode = 1;
  } else if (totalBlocks === 0) {
    console.log("\n⚠️  No JSON-LD blocks found! Something may be wrong.");
    process.exitCode = 1;
  } else {
    console.log("\n✅ All JSON-LD schemas valid!");
  }
}

main();
