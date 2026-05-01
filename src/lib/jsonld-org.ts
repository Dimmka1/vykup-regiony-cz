/**
 * Site-wide Organization + WebSite JSON-LD.
 *
 * Owner is a private individual, so we deliberately omit Person schema,
 * IČO, and any Czech business-register references. The Organization is
 * scoped as a brand entity only — name, URL, description, areaServed
 * (all 14 Czech regions), knowsAbout (topical authority), and a
 * contactPoint with phone and email pulled from the active region config.
 *
 * Designed to be rendered ONCE at site root (root layout) so every
 * indexed page has the brand entity baseline.
 */

import { listRegions } from "@/lib/config";

const SITE_URL = "https://vykoupim-nemovitost.cz";
const ORG_NAME = "Vykoupím Nemovitost";
const ORG_LEGAL_NAME = "Vykoupím Nemovitost"; // brand name; no IČO/legal entity exposed
const ORG_SLOGAN =
  "Rychlý a férový výkup nemovitostí po celé ČR — bez provize, do 14 dnů.";
const ORG_DESCRIPTION =
  "Specialisté na rychlý výkup nemovitostí v České republice. Vykupujeme byty, domy, pozemky i podíly — v jakémkoli stavu, včetně nemovitostí v exekuci, dražbě, dědictví, rozvodu, s hypotékou nebo věcným břemenem. Férová cena 80–90 % tržní hodnoty, vyplacení do 14 dnů, bez provize a bez skrytých poplatků.";

const ORG_KNOWS_ABOUT = [
  "výkup nemovitostí",
  "rychlý prodej nemovitosti",
  "výkup bytu",
  "výkup domu",
  "výkup pozemku",
  "výkup nemovitosti v exekuci",
  "výkup nemovitosti v dražbě",
  "výkup spoluvlastnického podílu",
  "výkup nemovitosti s hypotékou",
  "výkup nemovitosti s věcným břemenem",
  "výkup nemovitosti při dědictví",
  "výkup nemovitosti při rozvodu",
  "zpětný leasing nemovitosti",
  "advokátní úschova",
  "katastr nemovitostí",
] as const;

interface ContactInfo {
  readonly phone: string;
  readonly email: string;
}

/**
 * Build the Organization JSON-LD object.
 *
 * @param contact - phone + email of the resolved region (passed in to avoid
 *                  importing region resolution into a generic JSON-LD helper).
 */
export function buildOrganizationJsonLd(
  contact: ContactInfo,
): Record<string, unknown> {
  const regions = listRegions();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: ORG_NAME,
    legalName: ORG_LEGAL_NAME,
    alternateName: "Vykoupíme Nemovitost",
    slogan: ORG_SLOGAN,
    description: ORG_DESCRIPTION,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/opengraph-image`,
    knowsAbout: ORG_KNOWS_ABOUT,
    areaServed: regions.map((region) => ({
      "@type": "AdministrativeArea",
      name: region.name,
    })),
    address: {
      "@type": "PostalAddress",
      addressCountry: "CZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contact.phone,
      email: contact.email,
      contactType: "customer service",
      areaServed: "CZ",
      availableLanguage: ["cs", "Czech"],
    },
    inLanguage: "cs-CZ",
    foundingDate: "2025",
  };
}

/**
 * Build the WebSite JSON-LD with a SearchAction (sitelinks searchbox candidate).
 *
 * Rendered once at site root.
 */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    inLanguage: "cs-CZ",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export const ORG_CONSTANTS = {
  SITE_URL,
  ORG_NAME,
  ORG_DESCRIPTION,
  ORG_SLOGAN,
} as const;
