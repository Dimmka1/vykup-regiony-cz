import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/napiste-recenzi" },
  title: "Napište recenzi | Vykoupím nemovitost",
  description:
    "Podělte se o svou zkušenost s výkupem nemovitosti. Vaše recenze nám pomáhá zlepšovat služby.",
};

export default function NapišteRecenziLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
