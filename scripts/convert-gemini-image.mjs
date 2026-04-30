#!/usr/bin/env node
/**
 * Convert the most recent Gemini canvas-saved JPEG to a sized JPEG and place
 * it at the project's expected path.
 *
 * Two filename patterns supported:
 *  - `gemini-canvas-<timestamp>.jpg` (canvas/blob/`<a download>` flow).
 *  - `Gemini_Generated_Image_*.png`  (legacy in-app download button).
 *
 * Usage: node scripts/convert-gemini-image.mjs <target-path>
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/convert-gemini-image.mjs <target-path>");
  process.exit(1);
}

const downloads = path.join(os.homedir(), "Downloads");
const candidates = fs
  .readdirSync(downloads)
  .filter(
    (f) =>
      /^gemini-canvas-\d+\.jpg$/.test(f) ||
      /^Gemini_Generated_Image_.*\.png$/.test(f),
  )
  .map((f) => ({
    name: f,
    full: path.join(downloads, f),
    mtime: fs.statSync(path.join(downloads, f)).mtimeMs,
  }))
  .sort((a, b) => b.mtime - a.mtime);

if (candidates.length === 0) {
  console.error("no Gemini image in", downloads, "— aborting");
  process.exit(1);
}

const src = candidates[0];
const targetAbs = path.resolve(process.cwd(), target);
fs.mkdirSync(path.dirname(targetAbs), { recursive: true });

await sharp(src.full)
  .resize(1200, 800, { fit: "cover", position: "centre" })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(targetAbs);

const stat = fs.statSync(targetAbs);
console.log(
  `${path.basename(src.full)} → ${target} (${(stat.size / 1024).toFixed(0)} KB)`,
);

const archived = path.join(downloads, "_gemini_used");
fs.mkdirSync(archived, { recursive: true });
fs.renameSync(src.full, path.join(archived, src.name));
