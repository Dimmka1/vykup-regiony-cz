import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("BUILD_DATE", () => {
  const ORIGINAL_ENV = process.env.BUILD_DATE;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.BUILD_DATE;
    } else {
      process.env.BUILD_DATE = ORIGINAL_ENV;
    }
  });

  it("uses process.env.BUILD_DATE when set", async () => {
    process.env.BUILD_DATE = "2026-09-01";
    const mod = await import("@/lib/sitemap-helpers");
    expect(mod.BUILD_DATE).toBe("2026-09-01");
  });

  it("falls back to today's ISO date (UTC) when env is unset", async () => {
    delete process.env.BUILD_DATE;
    const mod = await import("@/lib/sitemap-helpers");
    const today = new Date().toISOString().slice(0, 10);
    expect(mod.BUILD_DATE).toBe(today);
  });

  it("rejects malformed env values and falls back to today", async () => {
    process.env.BUILD_DATE = "not-a-date";
    const mod = await import("@/lib/sitemap-helpers");
    const today = new Date().toISOString().slice(0, 10);
    expect(mod.BUILD_DATE).toBe(today);
  });
});
