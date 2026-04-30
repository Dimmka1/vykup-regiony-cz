import { describe, it, expect } from "vitest";
import { listRegions } from "@/lib/config";

describe("region theme colors", () => {
  const BANNED = new Set(["fuchsia", "magenta", "purple"]);

  it("none of the 14 regions uses a banned theme color", () => {
    const regions = listRegions();
    const violations = regions.filter(
      (r) => r.themeColor && BANNED.has(r.themeColor),
    );
    expect(violations.map((r) => `${r.key}=${r.themeColor}`)).toEqual([]);
  });
});
