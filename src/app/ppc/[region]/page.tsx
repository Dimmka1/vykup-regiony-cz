import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegionByKey } from "@/lib/config";
import {
  PPC_SLUG_TO_REGION_KEY,
  PPC_REGION_LOCATIVES,
  PPC_SOCIAL_PROOF_COUNTS,
  ALL_PPC_SLUGS,
} from "@/lib/ppc-regions";
import { RegionalPpcContent } from "@/components/regional-ppc-content";

interface Props {
  params: Promise<{ region: string }>;
}

export function generateStaticParams(): { region: string }[] {
  return ALL_PPC_SLUGS.map((slug) => ({ region: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { region: slug } = await params;
  const locative = PPC_REGION_LOCATIVES[slug];

  if (!locative) {
    return {};
  }

  return {
    title: `Rychlý výkup nemovitostí ${locative} | Nabídka zdarma`,
    description: `Vykoupíme vaši nemovitost ${locative} rychle a férově. Nezávazná nabídka do 24 hodin.`,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `https://vykoupim-nemovitost.cz/ppc/${slug}`,
    },
  };
}

export default async function RegionalPpcPage({ params }: Props) {
  const { region: slug } = await params;
  const regionKey = PPC_SLUG_TO_REGION_KEY[slug];

  if (!regionKey) {
    notFound();
  }

  const region = getRegionByKey(regionKey);
  const locative = PPC_REGION_LOCATIVES[slug] ?? region.locative;
  const socialProofCount = PPC_SOCIAL_PROOF_COUNTS[slug] ?? 40;
  const uspBullets = region.uspPoints.slice(0, 3);
  const testimonial =
    region.testimonials && region.testimonials.length > 0
      ? region.testimonials[0]
      : null;

  return (
    <RegionalPpcContent
      regionKey={region.key}
      locative={locative}
      socialProofCount={socialProofCount}
      uspBullets={uspBullets}
      testimonial={testimonial}
    />
  );
}
