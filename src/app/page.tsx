import type { ReactElement } from "react";
import type { Metadata } from "next";
import {
  getRegionByHost,
  getRegionByKey,
  isProductionHost,
  getRegionSubdomainUrl,
} from "@/lib/config";
import { getRequestHost, getRegionKeyOverride } from "@/lib/request-host";

import {
  HomePageContent,
  COMPANY_NAME,
  buildCanonicalUrl,
  buildMetaDescription,
} from "@/components/home-page-content";

async function resolveRegion() {
  const host = await getRequestHost();
  const regionKeyOverride = await getRegionKeyOverride();

  // If middleware set a region key override (dev/preview path-based routing), use it
  if (regionKeyOverride) {
    return { region: getRegionByKey(regionKeyOverride), host };
  }

  // Otherwise resolve by host (production subdomains + dev host-based)
  return { region: getRegionByHost(host), host };
}

export async function generateMetadata(): Promise<Metadata> {
  const { region, host } = await resolveRegion();
  const canonicalUrl = buildCanonicalUrl(host, region.key);
  const metaDescription = region.seoDescription || buildMetaDescription(region);
  const ogImageUrl = `${canonicalUrl}/opengraph-image`;

  return {
    title: region.seoTitle || region.title,
    description: metaDescription,
    keywords: region.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: region.seoTitle || region.title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: COMPANY_NAME,
      locale: "cs_CZ",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${region.h1} — ${COMPANY_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: region.seoTitle || region.title,
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function HomePage(): Promise<ReactElement> {
  const { region, host } = await resolveRegion();
  const canonicalUrl = buildCanonicalUrl(host, region.key);

  return (
    <HomePageContent
      region={region}
      canonicalUrl={canonicalUrl}
      currentHost={host}
    />
  );
}
