import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/dekujeme" },
  title: "Děkujeme | Vykoupím nemovitost",
  description: "Děkujeme za vaši poptávku. Brzy se vám ozveme.",
};

export default function DekujemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
