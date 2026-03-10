import type { Metadata } from "next";
import type { ReactElement } from "react";

import {
  PpcVerticalPage,
  type PpcVerticalConfig,
} from "@/components/ppc-vertical-page";

export const metadata: Metadata = {
  alternates: { canonical: "https://vykoupim-nemovitost.cz/ppc/oddluzeni" },
  title: "Výkup nemovitosti při oddlužení | Zachraňte nemovitost před dražbou",
  description:
    "Hrozí vám exekuce nebo dražba? Vykoupíme nemovitost rychle a férově. Pomůžeme zachránit vaši situaci. Nabídka zdarma do 24 hodin.",
  robots: { index: false, follow: false },
};

const CONFIG: PpcVerticalConfig = {
  serviceTag: "oddluzeni",
  heroTitle: "Zachraňte nemovitost před dražbou",
  heroHighlight: "Pomůžeme vám z dluhové pasti",
  heroSubtitle:
    "Hrozí vám exekuce nebo nucená dražba? Vykoupíme vaši nemovitost rychle, splatíte dluhy a zachráníte maximum hodnoty. Diskrétně a bez stresu.",
  trustBullets: [
    {
      icon: "🛡️",
      title: "Zastavíme dražbu",
      description:
        "Rychlým výkupem předejdeme nucené dražbě a ušetříme vám peníze.",
    },
    {
      icon: "⚡",
      title: "Vyřízení do 7 dnů",
      description:
        "Urgentní případy řešíme přednostně. Peníze na účtu do týdne.",
    },
    {
      icon: "🤝",
      title: "Diskrétní jednání",
      description:
        "Vše proběhne v naprosté diskrétnosti. Sousedé se nic nedozví.",
    },
    {
      icon: "📋",
      title: "Právní pomoc zdarma",
      description:
        "Pomůžeme s komunikací s exekutory a věřiteli. Právník v ceně.",
    },
  ],
  testimonial: {
    text: "Měli jsme exekuci na byt a hrozila nám dražba. Firma vykoupila nemovitost za férovou cenu, splatili jsme dluhy a mohli začít znovu. Bez nich bychom přišli o všechno.",
    author: "Jana a Petr S.",
    location: "Brno",
  },
  ctaText: "Chci zachránit nemovitost",
  formTitle: "Získejte nabídku zdarma",
};

export default function OddluzeniPpcPage(): ReactElement {
  return <PpcVerticalPage config={CONFIG} />;
}
