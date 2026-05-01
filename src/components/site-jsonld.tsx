/**
 * Site-wide Organization + WebSite JSON-LD, rendered once in the root layout.
 *
 * Every indexed page emits these two graphs in <head>, giving Google a
 * stable brand entity (@id "/#organization") and search-engine entry
 * (@id "/#website") that other per-page schemas (Service, Article,
 * WebPage, Product, etc.) can reference via @id.
 *
 * Server component: pulls the resolved region's contact info and bakes it
 * in. No "use client" because there's no interactivity.
 */

import { safeJsonLd } from "@/lib/jsonld";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/jsonld-org";

interface SiteJsonLdProps {
  readonly phone: string;
  readonly email: string;
}

export function SiteJsonLd({
  phone,
  email,
}: SiteJsonLdProps): React.ReactElement {
  const orgLd = buildOrganizationJsonLd({ phone, email });
  const webSiteLd = buildWebSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(webSiteLd) }}
      />
    </>
  );
}
