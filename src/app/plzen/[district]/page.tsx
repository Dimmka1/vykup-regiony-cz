import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  PLZEN_DISTRICTS,
  getPlzenDistrictBySlug,
  PLZEN_DISTRICT_SLUGS,
} from "@/data/plzen-districts";
import { DistrictPage } from "@/components/district-page";

const SITE_URL = "https://vykoupim-nemovitost.cz";

interface PageProps {
  params: Promise<{ district: string }>;
}

export function generateStaticParams() {
  return PLZEN_DISTRICT_SLUGS.map((slug) => ({ district: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { district: slug } = await params;
  const district = getPlzenDistrictBySlug(slug);
  if (!district) return {};

  return {
    title: district.seoTitle,
    description: district.seoDescription,
    keywords: district.keywords,
    alternates: {
      canonical: `${SITE_URL}/plzen/${district.slug}`,
    },
  };
}

export default async function PlzenDistrictPage({ params }: PageProps) {
  const { district: slug } = await params;
  const district = getPlzenDistrictBySlug(slug);

  if (!district) {
    notFound();
  }

  return (
    <DistrictPage
      district={district}
      cityName="Plzeň"
      citySlug="plzen"
      allDistricts={PLZEN_DISTRICTS}
      themeColor="amber"
    />
  );
}
