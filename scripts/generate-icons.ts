import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EMERALD_500 = "#10b981";
const PUBLIC_DIR = join(__dirname, "..", "public");

function createSvg(size: number): Buffer {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;
  const s = size / 100;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="${EMERALD_500}"/>
  <g transform="translate(${cx}, ${cy}) scale(${s})">
    <path d="M0,-30 L-28,0 L-20,0 L-20,22 L20,22 L20,0 L28,0 Z" fill="white"/>
    <rect x="-7" y="6" width="14" height="16" rx="1" fill="${EMERALD_500}"/>
  </g>
</svg>`;
  return Buffer.from(svg);
}

interface IconSpec {
  name: string;
  size: number;
}

const icons: IconSpec[] = [
  { name: "favicon.ico", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

async function main(): Promise<void> {
  writeFileSync(join(PUBLIC_DIR, "icon.svg"), createSvg(512));
  console.log("Created icon.svg");

  for (const { name, size } of icons) {
    const svg = createSvg(size);
    const png = await sharp(svg).resize(size, size).png().toBuffer();
    writeFileSync(join(PUBLIC_DIR, name), png);
    console.log(`Created ${name} (${size}x${size})`);
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
