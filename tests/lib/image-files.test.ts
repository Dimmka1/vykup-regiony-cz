import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

/**
 * Runtime guard: every use-case + blog page that we promise a unique image
 * for in `src/app/image-sitemap.xml/route.ts` must have its file on disk.
 * Catches missing assets in CI before they reach prod.
 */

const USE_CASE_SLUGS = [
  "exekuce",
  "dedictvi",
  "rozvod",
  "spoluvlastnicky-podil",
  "s-hypotekou",
  "s-vecnym-bremenem",
  "zpetny-najem",
  "byty",
  "domy",
  "pozemky",
  "drazba",
] as const;

const BLOG_SLUGS = [
  "jak-rychle-prodat-nemovitost",
  "vykup-nemovitosti-vs-realitni-kancelar",
  "nemovitost-v-exekuci-pruvodce",
  "jak-probiha-rychly-vykup",
  "5-duvodu-proc-prodat",
  "vykup-v-exekuci",
  "jake-dokumenty-potrebuji",
  "vykup-krok-za-krokem",
  "vykup-vs-drazba",
  "dan-z-prodeje-nemovitosti-2026",
  "kolik-stoji-vykup",
] as const;

describe("image-sitemap unique illustrations exist on disk", () => {
  for (const slug of USE_CASE_SLUGS) {
    it(`use-cases/${slug}.jpg`, () => {
      const p = path.join(
        process.cwd(),
        "public/images/use-cases",
        `${slug}.jpg`,
      );
      expect(fs.existsSync(p), `missing: ${p}`).toBe(true);
    });
  }

  for (const slug of BLOG_SLUGS) {
    it(`blog/${slug}.jpg`, () => {
      const p = path.join(process.cwd(), "public/images/blog", `${slug}.jpg`);
      expect(fs.existsSync(p), `missing: ${p}`).toBe(true);
    });
  }
});
