import type { ReactElement } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rychlý výkup nemovitostí | Nabídka zdarma",
  description:
    "Vykoupíme vaši nemovitost rychle a férově. Nezávazná nabídka do 24 hodin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PpcLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): ReactElement {
  return <>{children}</>;
}
