import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/reference" },
  title: "Reference | Vykoupím nemovitost",
  description: "Reference a hodnocení služby rychlého výkupu nemovitostí.",
};

export default function ReferenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
