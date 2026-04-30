import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

/**
 * Static guardrail for hreflang in the root layout. We avoid actually
 * importing `@/app/layout` because that pulls in next/font/google,
 * next/headers, cookies(), and the entire client-component tree — far too
 * heavy for a unit test. Reading the source file as text is sufficient to
 * verify the metadata block contains the canonical `cs` + `x-default`
 * languages map.
 */
describe("root layout metadata", () => {
  it("declares hreflang cs + x-default in metadata.alternates.languages", () => {
    const layoutSrc = fs.readFileSync(
      path.join(process.cwd(), "src/app/layout.tsx"),
      "utf8",
    );

    expect(layoutSrc).toMatch(/alternates:\s*\{[\s\S]*?languages:/);
    expect(layoutSrc).toMatch(/cs:\s*"https:\/\/vykoupim-nemovitost\.cz"/);
    expect(layoutSrc).toMatch(
      /"x-default":\s*"https:\/\/vykoupim-nemovitost\.cz"/,
    );
  });
});
