import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import type { Metadata } from "next";
import { getRegionByKey, listRegions } from "@/lib/config";
import { getRequestHost } from "@/lib/request-host";
import {
  HomePageContent,
  COMPANY_NAME,
  buildCanonicalUrl,
  buildMetaDescription,
} from "@/components/home-page-content";

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

/** Pre-generate all 14 region pages at build time. */
export function generateStaticParams(): { region: string }[] {
  return listRegions().map((r) => ({ region: r.key }));
}

export async function generateMetadata({
  params,
}: RegionPageProps): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const allKeys = new Set(listRegions().map((r) => r.key));

  if (!allKeys.has(regionSlug)) {
    return {};
  }

  const region = getRegionByKey(regionSlug);
  const host = await getRequestHost();
  const canonicalUrl = buildCanonicalUrl(host, regionSlug);
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

export default async function RegionPage({
  params,
}: RegionPageProps): Promise<ReactElement> {
  const { region: regionSlug } = await params;
  const allKeys = new Set(listRegions().map((r) => r.key));

  if (!allKeys.has(regionSlug)) {
    notFound();
  }

  const region = getRegionByKey(regionSlug);
  const host = await getRequestHost();
  const canonicalUrl = buildCanonicalUrl(host, regionSlug);

  return <HomePageContent region={region} canonicalUrl={canonicalUrl} />;
}
