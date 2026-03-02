const PRODUCTION_DOMAIN = "vykoupim-nemovitost.cz";

/**
 * Content paths that live on the root domain canonically.
 * Content lives on root domain canonically but is accessible from subdomains too.
 */
export const CONTENT_PATH_PREFIXES = [
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
] as const;

/**
 * Check if a pathname is a content path (root-domain only).
 */
export function isContentPath(pathname: string): boolean {
  return CONTENT_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Returns the canonical URL for a content path on the root domain.
 */
export function getCanonicalUrl(path: string): string {
  return `https://${PRODUCTION_DOMAIN}${path}`;
}

/**
 * Returns the URL for a content page link.
 * On production subdomains, returns absolute URL to root domain.
 * On root domain or dev/preview, returns the relative path.
 */
export function getContentUrl(path: string, currentHost?: string): string {
  if (!currentHost) return path;

  const normalized = currentHost
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  // If on a production subdomain, link to root domain
  if (
    normalized.endsWith(`.${PRODUCTION_DOMAIN}`) &&
    normalized !== PRODUCTION_DOMAIN
  ) {
    return `https://${PRODUCTION_DOMAIN}${path}`;
  }

  return path;
}

/**
 * Check if a host is a production subdomain (not root, not www).
 */
export function isProductionSubdomain(host: string): boolean {
  const normalized = host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];

  return (
    normalized.endsWith(`.${PRODUCTION_DOMAIN}`) &&
    normalized !== PRODUCTION_DOMAIN
  );
}
