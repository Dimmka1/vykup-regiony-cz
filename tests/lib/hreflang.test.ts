import { describe, it, expect, vi } from "vitest";

// next/font/google is a compile-time helper that doesn't run under vitest.
// Mock it so the layout module's top-level Inter() call doesn't throw.
vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "__inter-mock",
    className: "__inter-mock",
  }),
}));

describe("root layout metadata", () => {
  it("declares hreflang cs + x-default with absolute URLs", async () => {
    const mod = await import("@/app/layout");
    const md = mod.metadata;
    const langs = md.alternates?.languages;
    expect(langs).toBeTruthy();
    expect(langs?.["cs"]).toBe("https://vykoupim-nemovitost.cz");
    expect(langs?.["x-default"]).toBe("https://vykoupim-nemovitost.cz");
  });
});
