import type { ReactElement } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/ppc/exekuce" },
  title: "Výkup nemovitosti v exekuci — řešení do 48 hodin | Nabídka zdarma",
  description:
    "Nemovitost v exekuci? Vykoupíme ji rychle a férově. 80–90 % tržní hodnoty, uhradíme dluhy, vyplatíme vás do 7 dnů. Nezávazná nabídka zdarma.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExekucePpcLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): ReactElement {
  return <>{children}</>;
}
