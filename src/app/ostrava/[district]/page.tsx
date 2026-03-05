import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  OSTRAVA_DISTRICTS,
  getOstravaDistrictBySlug,
  OSTRAVA_DISTRICT_SLUGS,
} from "@/data/ostrava-districts";
import { DistrictPage } from "@/components/district-page";

const SITE_URL = "https://vykoupim-nemovitost.cz";

interface PageProps {
  params: Promise<{ district: string }>;
}

export function generateStaticParams() {
  return OSTRAVA_DISTRICT_SLUGS.map((slug) => ({ district: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { district: slug } = await params;
  const district = getOstravaDistrictBySlug(slug);
  if (!district) return {};

  return {
    title: district.seoTitle,
    description: district.seoDescription,
    keywords: district.keywords,
    alternates: {
      canonical: `${SITE_URL}/ostrava/${district.slug}`,
    },
  };
}

export default async function OstravaDistrictPage({ params }: PageProps) {
  const { district: slug } = await params;
  const district = getOstravaDistrictBySlug(slug);

  if (!district) {
    notFound();
  }

  return (
    <DistrictPage
      district={district}
      cityName="Ostrava"
      citySlug="ostrava"
      allDistricts={OSTRAVA_DISTRICTS}
      themeColor="slate"
    />
  );
}
