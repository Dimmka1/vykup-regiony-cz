import type { ReactElement } from "react";
import type { Metadata } from "next";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title: "Sell Your Property in Prague Fast | Cash Offer in 48h",
  description:
    "We buy properties in Prague for cash. No fees, no agents, direct purchase. Get a free, no-obligation offer within 48 hours. Contract in English available.",
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      cs: SITE_URL,
      en: `${SITE_URL}/en`,
    },
  },
  openGraph: {
    title: "Sell Your Property in Prague Fast | Cash Offer in 48h",
    description:
      "We buy properties in Prague for cash. No fees, no agents, direct purchase. Get a free offer within 48 hours.",
    url: `${SITE_URL}/en`,
    siteName: "Vykoupím Nemovitost",
    locale: "en",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sell Your Property in Prague Fast | Cash Offer in 48h",
    description:
      "We buy properties in Prague for cash. No fees, no agents. Free offer in 48h.",
  },
};

export default function EnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): ReactElement {
  return <>{children}</>;
}
