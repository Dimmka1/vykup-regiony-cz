import type { ReactElement } from "react";
import type { Metadata } from "next";
import { getRegionByHost, getRegionByKey } from "@/lib/config";
import { getRequestHost } from "@/lib/request-host";

import {
  HomePageContent,
  COMPANY_NAME,
  buildCanonicalUrl,
  buildMetaDescription,
} from "@/components/home-page-content";
import { GoogleReviewsSection } from "@/components/google-reviews-section";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const host = await getRequestHost();
  const region = params.region
    ? getRegionByKey(params.region)
    : getRegionByHost(host);
  const canonicalUrl = buildCanonicalUrl(host);
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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}): Promise<ReactElement> {
  const params = await searchParams;
  const host = await getRequestHost();
  const region = params.region
    ? getRegionByKey(params.region)
    : getRegionByHost(host);
  const canonicalUrl = buildCanonicalUrl(host);

  return <HomePageContent region={region} canonicalUrl={canonicalUrl} />;
}
