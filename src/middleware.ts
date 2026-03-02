import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Region keys - keep in sync with regions.yml.
 * Static Set because middleware runs on the Edge runtime (no fs reads).
 */
const REGION_KEYS = new Set([
  "praha",
  "stredocesky-kraj",
  "jihocesky-kraj",
  "plzensky-kraj",
  "karlovarsky-kraj",
  "ustecky-kraj",
  "liberecky-kraj",
  "kralovehradecky-kraj",
  "pardubicky-kraj",
  "vysocina",
  "jihomoravsky-kraj",
  "olomoucky-kraj",
  "moravskoslezsky-kraj",
  "zlinsky-kraj",
]);

/**
 * Map from region key to subdomain on vykoupim-nemovitost.cz.
 */
const REGION_SUBDOMAINS: Record<string, string> = {
  praha: "praha",
  "stredocesky-kraj": "stredocesky",
  "jihocesky-kraj": "jihocesky",
  "plzensky-kraj": "plzensky",
  "karlovarsky-kraj": "karlovarsky",
  "ustecky-kraj": "ustecky",
  "liberecky-kraj": "liberecky",
  "kralovehradecky-kraj": "kralovehradecky",
  "pardubicky-kraj": "pardubicky",
  vysocina: "vysocina",
  "jihomoravsky-kraj": "jihomoravsky",
  "olomoucky-kraj": "olomoucky",
  "moravskoslezsky-kraj": "moravskoslezsky",
  "zlinsky-kraj": "zlinsky",
};

const PRODUCTION_DOMAIN = "vykoupim-nemovitost.cz";

/** Valid subdomains on production */
const VALID_SUBDOMAINS = new Set([...Object.values(REGION_SUBDOMAINS), "www"]);

/**
 * Content path prefixes that must live ONLY on root domain.
 * Duplicated from lib/content-url.ts because middleware runs on Edge runtime.
 */
const CONTENT_PATH_PREFIXES = [
  "/blog",
  "/caste-dotazy",
  "/jak-to-funguje",
  "/reference",
  "/vykup-pri-exekuci",
  "/vykup-pri-dedictvi",
  "/vykup-pri-rozvodu",
  "/vykup-spoluvlastnickeho-podilu",
  "/vykup-nemovitosti-s-hypotekou",
  "/vykup-nemovitosti-s-vecnym-bremenem",
  "/vykup-bytu",
  "/vykup-domu",
  "/vykup-pozemku",
  "/ochrana-osobnich-udaju",
  "/dekujeme",
  "/kraje",
];

function isContentPath(pathname: string): boolean {
  return CONTENT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function normalizeHost(host: string): string {
  return host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
}

function isProductionDomain(host: string): boolean {
  const normalized = normalizeHost(host);
  return (
    normalized === PRODUCTION_DOMAIN ||
    normalized.endsWith(`.${PRODUCTION_DOMAIN}`)
  );
}

function getSubdomain(host: string): string | null {
  const normalized = normalizeHost(host);
  if (
    normalized.endsWith(`.${PRODUCTION_DOMAIN}`) &&
    normalized !== PRODUCTION_DOMAIN
  ) {
    return normalized.replace(`.${PRODUCTION_DOMAIN}`, "");
  }
  return null;
}

export function middleware(request: NextRequest): NextResponse | undefined {
  const host = request.headers.get("host") ?? "";
  const { pathname, searchParams } = request.nextUrl;
  const isProd = isProductionDomain(host);

  // 0. Content path on ANY production subdomain → 301 redirect to root domain
  if (isProd) {
    const subdomain = getSubdomain(host);
    if (subdomain && isContentPath(pathname)) {
      return NextResponse.redirect(
        `https://${PRODUCTION_DOMAIN}${pathname}`,
        301,
      );
    }
  }

  // 1. Handle ?region=X query param
  const regionParam = searchParams.get("region");
  if (pathname === "/" && regionParam && REGION_KEYS.has(regionParam)) {
    if (isProd) {
      const subdomain = REGION_SUBDOMAINS[regionParam] ?? regionParam;
      return NextResponse.redirect(
        `https://${subdomain}.${PRODUCTION_DOMAIN}/`,
        301,
      );
    }
    // Dev/preview: rewrite to / with x-region-key header
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.delete("region");
    const response = NextResponse.rewrite(url);
    response.headers.set("x-region-key", regionParam);
    return response;
  }

  // 2. Path-based regional URLs (/praha, /brno, etc.)
  const pathSegment = pathname.split("/")[1] ?? "";
  if (
    pathSegment &&
    REGION_KEYS.has(pathSegment) &&
    pathname === `/${pathSegment}`
  ) {
    if (isProd) {
      const subdomain = REGION_SUBDOMAINS[pathSegment] ?? pathSegment;
      return NextResponse.redirect(
        `https://${subdomain}.${PRODUCTION_DOMAIN}/`,
        301,
      );
    }
    // Dev/preview: rewrite /{region} → / with x-region-key header
    // so page.tsx can resolve the correct region
    const url = request.nextUrl.clone();
    url.pathname = "/";
    const response = NextResponse.rewrite(url);
    response.headers.set("x-region-key", pathSegment);
    return response;
  }

  // 3. Invalid subdomain on production → redirect to root
  if (isProd) {
    const subdomain = getSubdomain(host);
    if (subdomain && !VALID_SUBDOMAINS.has(subdomain)) {
      return NextResponse.redirect(`https://${PRODUCTION_DOMAIN}/`, 301);
    }
  }

  return undefined;
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|ttf|eot)).*)",
  ],
};
