import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirect legacy ?region=X query param to clean /<region-key> URL.
 * Returns 301 permanent redirect for SEO.
 */
export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname, searchParams } = request.nextUrl;
  const regionParam = searchParams.get("region");

  // Only redirect on the home page with ?region= param
  if (pathname === "/" && regionParam) {
    const url = request.nextUrl.clone();
    url.pathname = `/${regionParam}`;
    url.searchParams.delete("region");
    return NextResponse.redirect(url, 301);
  }

  return undefined;
}

export const config = {
  matcher: ["/"],
};
