import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/stav-poptavky" },
  title: "Stav poptávky | Vykoupím nemovitost",
  description: "Sledujte aktuální stav vaší poptávky na výkup nemovitosti.",
  robots: { index: false, follow: false },
};

export default function StavPoptavkyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
