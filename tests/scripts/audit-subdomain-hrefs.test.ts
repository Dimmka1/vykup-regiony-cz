import { describe, it, expect } from "vitest";
import { findSubdomainContentHrefs } from "../../scripts/audit-subdomain-hrefs";

describe("findSubdomainContentHrefs", () => {
  it("returns empty when given source without any subdomain hrefs", () => {
    const findings = findSubdomainContentHrefs([
      { path: "x.tsx", text: 'href="/blog/foo"' },
    ]);
    expect(findings).toEqual([]);
  });

  it("ignores bare region subdomain home pages", () => {
    const findings = findSubdomainContentHrefs([
      {
        path: "x.tsx",
        text: 'href="https://praha.vykoupim-nemovitost.cz"',
      },
      {
        path: "y.tsx",
        text: 'href="https://praha.vykoupim-nemovitost.cz/"',
      },
    ]);
    expect(findings).toEqual([]);
  });

  it("flags subdomain content paths", () => {
    const findings = findSubdomainContentHrefs([
      {
        path: "bad.tsx",
        text: 'href="https://praha.vykoupim-nemovitost.cz/blog/foo"',
      },
    ]);
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("bad.tsx");
    expect(findings[0].href).toBe(
      "https://praha.vykoupim-nemovitost.cz/blog/foo",
    );
  });

  it("ignores tracking and external www URLs", () => {
    const findings = findSubdomainContentHrefs([
      {
        path: "x.tsx",
        text: 'src="https://www.googletagmanager.com/ns.html"',
      },
      {
        path: "y.tsx",
        text: 'src="https://www.facebook.com/tr?id=X"',
      },
    ]);
    expect(findings).toEqual([]);
  });

  it("flags absolute www.vykoupim-nemovitost.cz hrefs (not the root)", () => {
    const findings = findSubdomainContentHrefs([
      {
        path: "x.tsx",
        text: 'href="https://www.vykoupim-nemovitost.cz/vykup-bytu"',
      },
    ]);
    expect(findings).toHaveLength(1);
  });
});

describe("the live codebase", () => {
  it("contains zero subdomain content hrefs", async () => {
    const { auditCodebase } =
      await import("../../scripts/audit-subdomain-hrefs");
    const findings = await auditCodebase();
    if (findings.length > 0) {
      console.error(
        "Subdomain content hrefs found:\n" +
          findings.map((f) => `  ${f.path}: ${f.href}`).join("\n"),
      );
    }
    expect(findings).toEqual([]);
  });
});
