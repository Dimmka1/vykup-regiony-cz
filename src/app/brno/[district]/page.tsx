import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BRNO_DISTRICTS,
  getBrnoDistrictBySlug,
  BRNO_DISTRICT_SLUGS,
} from "@/data/brno-districts";
import { DistrictPage } from "@/components/district-page";

const SITE_URL = "https://vykoupim-nemovitost.cz";

interface PageProps {
  params: Promise<{ district: string }>;
}

export function generateStaticParams() {
  return BRNO_DISTRICT_SLUGS.map((slug) => ({ district: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { district: slug } = await params;
  const district = getBrnoDistrictBySlug(slug);
  if (!district) return {};

  return {
    title: district.seoTitle,
    description: district.seoDescription,
    keywords: district.keywords,
    alternates: {
      canonical: `${SITE_URL}/brno/${district.slug}`,
    },
  };
}

export default async function BrnoDistrictPage({ params }: PageProps) {
  const { district: slug } = await params;
  const district = getBrnoDistrictBySlug(slug);

  if (!district) {
    notFound();
  }

  return (
    <DistrictPage
      district={district}
      cityName="Brno"
      citySlug="brno"
      allDistricts={BRNO_DISTRICTS}
      themeColor="blue"
    />
  );
}
