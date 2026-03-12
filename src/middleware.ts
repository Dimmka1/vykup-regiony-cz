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

/**
 * City-name → regional subdomain mapping.
 * When a user visits e.g. brno.vykoupim-nemovitost.cz, they are
 * 301-redirected to jihomoravsky.vykoupim-nemovitost.cz (preserving path).
 */
const CITY_TO_REGION_SUBDOMAIN: Record<string, string> = {
  // Jihomoravský kraj
  brno: "jihomoravsky",
  znojmo: "jihomoravsky",
  breclav: "jihomoravsky",
  hodonin: "jihomoravsky",
  vyskov: "jihomoravsky",
  blansko: "jihomoravsky",

  // Moravskoslezský kraj
  ostrava: "moravskoslezsky",
  karvina: "moravskoslezsky",
  "frydek-mistek": "moravskoslezsky",
  opava: "moravskoslezsky",
  havirov: "moravskoslezsky",
  "novy-jicin": "moravskoslezsky",

  // Plzeňský kraj
  plzen: "plzensky",
  klatovy: "plzensky",
  domazlice: "plzensky",
  rokycany: "plzensky",
  tachov: "plzensky",

  // Liberecký kraj
  liberec: "liberecky",
  "jablonec-nad-nisou": "liberecky",
  "ceska-lipa": "liberecky",
  turnov: "liberecky",
  semily: "liberecky",

  // Olomoucký kraj
  olomouc: "olomoucky",
  prerov: "olomoucky",
  prostejov: "olomoucky",
  sumperk: "olomoucky",
  jesenik: "olomoucky",

  // Jihočeský kraj
  "ceske-budejovice": "jihocesky",
  tabor: "jihocesky",
  pisek: "jihocesky",
  "jindrichuv-hradec": "jihocesky",
  "cesky-krumlov": "jihocesky",
  strakonice: "jihocesky",

  // Královéhradecký kraj
  "hradec-kralove": "kralovehradecky",
  trutnov: "kralovehradecky",
  nachod: "kralovehradecky",
  jicin: "kralovehradecky",
  "rychnov-nad-kneznou": "kralovehradecky",

  // Ústecký kraj
  "usti-nad-labem": "ustecky",
  most: "ustecky",
  chomutov: "ustecky",
  teplice: "ustecky",
  decin: "ustecky",
  litomerice: "ustecky",

  // Pardubický kraj
  pardubice: "pardubicky",
  chrudim: "pardubicky",
  svitavy: "pardubicky",
  "usti-nad-orlici": "pardubicky",
  litomysl: "pardubicky",

  // Zlínský kraj
  zlin: "zlinsky",
  "uherske-hradiste": "zlinsky",
  kromeriz: "zlinsky",
  vsetin: "zlinsky",
  "roznov-pod-radhostem": "zlinsky",
  "valasske-mezirici": "zlinsky",

  // Kraj Vysočina
  jihlava: "vysocina",
  trebic: "vysocina",
  "zdar-nad-sazavou": "vysocina",
  "havlickuv-brod": "vysocina",
  pelhrimov: "vysocina",

  // Karlovarský kraj
  "karlovy-vary": "karlovarsky",
  cheb: "karlovarsky",
  sokolov: "karlovarsky",
  "marianske-lazne": "karlovarsky",
  ostrov: "karlovarsky",
  as: "karlovarsky",

  // Středočeský kraj
  kladno: "stredocesky",
  "mlada-boleslav": "stredocesky",
  kolin: "stredocesky",
  pribram: "stredocesky",
  beroun: "stredocesky",
  benesov: "stredocesky",
};

const PRODUCTION_DOMAIN = "vykoupim-nemovitost.cz";

/** Valid subdomains on production (known regions + www) */
const VALID_SUBDOMAINS = new Set([...Object.values(REGION_SUBDOMAINS), "www"]);

/**
 * Paths that should stay on regional subdomains (not redirected to root).
 * Everything else gets 301'd to the root domain for SEO canonicalization.
 */
const SUBDOMAIN_ALLOWED_EXACT = new Set([
  "/",
  "/sitemap.xml",
  "/image-sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  "/icon.svg",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/ppc",
]);

const SUBDOMAIN_ALLOWED_PREFIXES = ["/api/", "/opengraph-image"];

function isSubdomainAllowedPath(pathname: string): boolean {
  if (SUBDOMAIN_ALLOWED_EXACT.has(pathname)) return true;
  return SUBDOMAIN_ALLOWED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
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

/**
 * SEO 301 redirects for legacy/alternative URLs → canonical paths.
 * Keeps old bookmarks and external links working.
 */
const SEO_REDIRECTS: Record<string, string> = {
  "/kde-pusobime": "/kraje",
};

export function middleware(request: NextRequest): NextResponse | undefined {
  const host = request.headers.get("host") ?? "";
  const { pathname, searchParams } = request.nextUrl;
  const isProd = isProductionDomain(host);

  // 0a. SEO redirects for legacy/alternative paths
  const redirectTarget = SEO_REDIRECTS[pathname.toLowerCase()];
  if (redirectTarget) {
    const url = request.nextUrl.clone();
    url.pathname = redirectTarget;
    return NextResponse.redirect(url, 301);
  }

  // 0. PPC landing — stripped layout (no header/footer)
  if (pathname === "/ppc") {
    const response = NextResponse.next();
    response.headers.set("x-layout-stripped", "1");
    return response;
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

  // 2.5. SEO: 301 redirect content pages from regional subdomains to root domain.
  // Fixes "duplicate without user-selected canonical" in Google Search Console.
  // Only whitelisted paths (homepage, sitemaps, API, assets) stay on subdomain.
  if (isProd) {
    const subdomain = getSubdomain(host);
    if (subdomain && VALID_SUBDOMAINS.has(subdomain) && subdomain !== "www") {
      if (!isSubdomainAllowedPath(pathname)) {
        const destination = new URL(`https://${PRODUCTION_DOMAIN}${pathname}`);
        destination.search = request.nextUrl.search;
        return NextResponse.redirect(destination.toString(), 301);
      }
    }
  }

  // 3. City-name subdomain → 301 redirect to regional subdomain
  //    e.g. brno.vykoupim-nemovitost.cz → jihomoravsky.vykoupim-nemovitost.cz
  //    e.g. brno.vykoupim-nemovitost.cz → jihomoravsky.vykoupim-nemovitost.cz
  if (isProd) {
    const subdomain = getSubdomain(host);
    if (subdomain) {
      const regionSubdomain = CITY_TO_REGION_SUBDOMAIN[subdomain];
      if (regionSubdomain) {
        // Preserve original path + query string
        const url = request.nextUrl.clone();
        const target = `https://${regionSubdomain}.${PRODUCTION_DOMAIN}${url.pathname}${url.search}`;
        return NextResponse.redirect(target, 301);
      }

      // 4. Unknown subdomain on production → redirect to root
      if (!VALID_SUBDOMAINS.has(subdomain)) {
        return NextResponse.redirect(`https://${PRODUCTION_DOMAIN}/`, 301);
      }
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
