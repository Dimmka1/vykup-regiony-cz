import { describe, it, expect } from "vitest";

describe("smoke tests", () => {
  it("project loads zod schemas", async () => {
    const { z } = await import("zod");
    const schema = z.object({ key: z.string() });
    expect(schema.parse({ key: "test" })).toEqual({ key: "test" });
  });

  it("yaml parsing works", async () => {
    const { parse } = await import("yaml");
    const result = parse("key: value");
    expect(result).toEqual({ key: "value" });
  });
});
