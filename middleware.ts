import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveGeoRegion, GEO_REGION_COOKIE } from "@/lib/geo-regions";

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();

  // Skip if cookie already set (don't overwrite user's manual choice)
  if (request.cookies.get(GEO_REGION_COOKIE)) {
    return response;
  }

  // Vercel provides geo data via headers (Next.js 15+)
  const city = request.headers.get("x-vercel-ip-city") ?? undefined;
  const country = request.headers.get("x-vercel-ip-country") ?? undefined;

  const regionKey = resolveGeoRegion(city, country);

  if (regionKey) {
    response.cookies.set(GEO_REGION_COOKIE, regionKey, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next (static files, images, etc.)
     * - favicon, robots, sitemap, icons, images
     */
    "/((?!api|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml|icon\\.svg|apple-touch-icon\\.png|images/).*)",
  ],
};
