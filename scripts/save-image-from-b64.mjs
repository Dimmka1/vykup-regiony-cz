#!/usr/bin/env node
/**
 * Read base64 (with or without data: URL prefix) from stdin, decode, and save
 * to <target> path resized to 1200×800 JPEG q85.
 *
 * Usage: node scripts/save-image-from-b64.mjs <target-path>
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/save-image-from-b64.mjs <target-path>");
  process.exit(1);
}

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
let raw = Buffer.concat(chunks).toString("utf8").trim();
const m = raw.match(/^data:[^;]+;base64,(.*)$/);
if (m) raw = m[1];
const buf = Buffer.from(raw, "base64");

const targetAbs = path.resolve(process.cwd(), target);
fs.mkdirSync(path.dirname(targetAbs), { recursive: true });
await sharp(buf)
  .resize(1200, 800, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(targetAbs);
const stat = fs.statSync(targetAbs);
console.log(`saved ${target} (${(stat.size / 1024).toFixed(0)} KB)`);
