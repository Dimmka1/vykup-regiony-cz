#!/usr/bin/env node
/**
 * Image optimization script — converts JPG/PNG to WebP and optionally AVIF.
 * Usage: node scripts/optimize-images.mjs [--avif]
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const IMAGES_DIR = "public/images";
const WEBP_QUALITY = 80;
const AVIF_QUALITY = 65;
const generateAvif = process.argv.includes("--avif");

const EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function main() {
  const files = await readdir(IMAGES_DIR);
  const targets = files.filter((f) => EXTENSIONS.has(extname(f).toLowerCase()));

  if (!targets.length) {
    console.log("No images to optimize.");
    return;
  }

  console.log(`Found ${targets.length} image(s) to optimize.\n`);

  const report = [];

  for (const file of targets) {
    const src = join(IMAGES_DIR, file);
    const name = basename(file, extname(file));
    const origSize = (await stat(src)).size;

    // WebP
    const webpPath = join(IMAGES_DIR, `${name}.webp`);
    await sharp(src).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    const webpSize = (await stat(webpPath)).size;

    const entry = {
      file,
      original: origSize,
      webp: webpSize,
      webpSaving: (((origSize - webpSize) / origSize) * 100).toFixed(1),
    };

    // AVIF (optional)
    if (generateAvif) {
      const avifPath = join(IMAGES_DIR, `${name}.avif`);
      await sharp(src).avif({ quality: AVIF_QUALITY }).toFile(avifPath);
      const avifSize = (await stat(avifPath)).size;
      entry.avif = avifSize;
      entry.avifSaving = (((origSize - avifSize) / origSize) * 100).toFixed(1);
    }

    report.push(entry);
  }

  // Print report
  const fmt = (bytes) => (bytes / 1024).toFixed(0) + " KB";
  console.log("Image Optimization Report");
  console.log("=".repeat(70));
  for (const r of report) {
    console.log(`${r.file}`);
    console.log(
      `  Original: ${fmt(r.original)}  →  WebP: ${fmt(r.webp)} (-${r.webpSaving}%)`,
    );
    if (r.avif != null) {
      console.log(`  AVIF: ${fmt(r.avif)} (-${r.avifSaving}%)`);
    }
  }

  const totalOrig = report.reduce((s, r) => s + r.original, 0);
  const totalWebp = report.reduce((s, r) => s + r.webp, 0);
  console.log("=".repeat(70));
  console.log(
    `Total: ${fmt(totalOrig)} → ${fmt(totalWebp)} WebP (-${(((totalOrig - totalWebp) / totalOrig) * 100).toFixed(1)}%)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
