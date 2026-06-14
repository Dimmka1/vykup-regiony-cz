import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function req(url: string): NextRequest {
  const u = new URL(url);
  return new NextRequest(u, { headers: { host: u.host } });
}

describe("proxy: inert ?kraj=/?mesto=/?typ= canonicalization", () => {
  it("301-strips ?mesto on a subdomain homepage (duplicate of bare home)", () => {
    const res = proxy(
      req("https://praha.vykoupim-nemovitost.cz/?mesto=praha-1"),
    );
    expect(res?.status).toBe(301);
    const loc = new URL(res!.headers.get("location")!);
    expect(loc.host).toBe("praha.vykoupim-nemovitost.cz");
    expect(loc.pathname).toBe("/");
    expect(loc.searchParams.has("mesto")).toBe(false);
  });

  it("301-strips ?typ on the homepage", () => {
    const res = proxy(
      req("https://stredocesky.vykoupim-nemovitost.cz/?typ=byt"),
    );
    expect(res?.status).toBe(301);
    const loc = new URL(res!.headers.get("location")!);
    expect(loc.pathname).toBe("/");
    expect(loc.searchParams.has("typ")).toBe(false);
  });

  it("preserves marketing params (utm_*) while stripping ?mesto", () => {
    const res = proxy(
      req("https://praha.vykoupim-nemovitost.cz/?mesto=x&utm_source=fb"),
    );
    expect(res?.status).toBe(301);
    const loc = new URL(res!.headers.get("location")!);
    expect(loc.searchParams.get("utm_source")).toBe("fb");
    expect(loc.searchParams.has("mesto")).toBe(false);
  });

  it("does NOT 301-strip ?mesto on use-case pages (geo system uses noindex there)", () => {
    const res = proxy(
      req("https://vykoupim-nemovitost.cz/vykup-pri-exekuci?mesto=benesov"),
    );
    // Either undefined or a CDN-headers passthrough (NextResponse.next) — never a 301 strip.
    if (res) expect(res.status).not.toBe(301);
  });

  it("does NOT redirect the bare homepage", () => {
    const res = proxy(req("https://praha.vykoupim-nemovitost.cz/"));
    if (res) expect(res.status).not.toBe(301);
  });

  it("301-strips ?kraj on a NON-geo use-case page (vykup-v-drazbe)", () => {
    const res = proxy(
      req("https://vykoupim-nemovitost.cz/vykup-v-drazbe?kraj=praha"),
    );
    expect(res?.status).toBe(301);
    const loc = new URL(res!.headers.get("location")!);
    expect(loc.pathname).toBe("/vykup-v-drazbe");
    expect(loc.searchParams.has("kraj")).toBe(false);
  });

  it("does NOT strip ?kraj on a geo-enabled use-case page (vykup-bytu)", () => {
    const res = proxy(
      req("https://vykoupim-nemovitost.cz/vykup-bytu?kraj=praha"),
    );
    if (res) expect(res.status).not.toBe(301);
  });
});
