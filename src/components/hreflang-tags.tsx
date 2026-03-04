import { listRegions, getRegionSubdomainUrl } from "@/lib/config";

const ROOT_DOMAIN = "vykoupim-nemovitost.cz";

/**
 * Renders hreflang alternate <link> tags for all regional subdomains.
 * Each page gets links to all 14 subdomains + root domain (x-default).
 * This tells Google these are regional variants, not duplicates.
 */
export function HreflangTags() {
  const regions = listRegions();
  const rootUrl = `https://${ROOT_DOMAIN}/`;

  return (
    <>
      {/* x-default points to root domain */}
      <link rel="alternate" hrefLang="x-default" href={rootUrl} />
      {/* Root domain also gets cs hreflang */}
      <link rel="alternate" hrefLang="cs" href={rootUrl} />
      {/* Each regional subdomain */}
      {regions.map((region) => {
        const url = getRegionSubdomainUrl(region.key) + "/";
        // Skip if this would duplicate the root URL
        if (url === rootUrl) return null;
        return (
          <link key={region.key} rel="alternate" hrefLang="cs" href={url} />
        );
      })}
    </>
  );
}
