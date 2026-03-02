import { readFileSync } from "node:fs";
import { join } from "node:path";

let cachedFont: ArrayBuffer | null = null;

export function getInterBoldFont(): ArrayBuffer {
  if (cachedFont) return cachedFont;
  const fontPath = join(process.cwd(), "src/assets/fonts/Inter-Bold.ttf");
  cachedFont = readFileSync(fontPath).buffer as ArrayBuffer;
  return cachedFont;
}

export const interFontConfig = {
  name: "Inter",
  style: "normal" as const,
  weight: 700 as const,
};
