import type { ReactElement } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulačka ceny nemovitosti | Vykoupím Nemovitost",
  description:
    "Orientační kalkulačka ceny nemovitosti podle kraje, typu a plochy.",
  robots: { index: false, follow: false },
};

export default function EmbedKalkulackaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): ReactElement {
  return <>{children}</>;
}
