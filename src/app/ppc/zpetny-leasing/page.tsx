import type { Metadata } from "next";
import type { ReactElement } from "react";

import {
  PpcVerticalPage,
  type PpcVerticalConfig,
} from "@/components/ppc-vertical-page";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://vykoupim-nemovitost.cz/ppc/zpetny-leasing",
  },
  title: "Zpětný leasing nemovitosti | Prodejte a bydlete dál",
  description:
    "Potřebujete peníze, ale nechcete se stěhovat? Zpětný leasing vám umožní prodat nemovitost a dál v ní bydlet. Nabídka zdarma do 24 hodin.",
  robots: { index: false, follow: false },
};

const CONFIG: PpcVerticalConfig = {
  serviceTag: "zpetny-leasing",
  heroTitle: "Prodejte a bydlete dál",
  heroHighlight: "Zpětný leasing nemovitosti",
  heroSubtitle:
    "Potřebujete rychle peníze, ale nechcete se stěhovat? Vykoupíme vaši nemovitost a vy v ní můžete dál bydlet. Férové podmínky, žádné skryté poplatky.",
  trustBullets: [
    {
      icon: "🏠",
      title: "Zůstanete doma",
      description:
        "Po prodeji podepíšeme nájemní smlouvu — bydlíte dál ve svém.",
    },
    {
      icon: "⚡",
      title: "Peníze do 7 dnů",
      description: "Rychlé vyřízení bez čekání na hypotéku kupujícího.",
    },
    {
      icon: "💰",
      title: "Férová cena",
      description:
        "Nabídneme až 90 % tržní hodnoty. Bez provize, bez skrytých poplatků.",
    },
    {
      icon: "📋",
      title: "Vše zařídíme za vás",
      description: "Právník, odhad, smlouvy — kompletní servis zdarma.",
    },
  ],
  testimonial: {
    text: "Potřeboval jsem rychle vyřešit finanční situaci, ale nechtěl jsem opustit svůj byt. Díky zpětnému leasingu jsem získal peníze a dál bydlím u sebe. Celý proces proběhl hladce a profesionálně.",
    author: "Martin K.",
    location: "Praha 5",
  },
  ctaText: "Chci nabídku na zpětný leasing",
  formTitle: "Získejte nabídku zdarma",
};

export default function ZpetnyLeasingPpcPage(): ReactElement {
  return <PpcVerticalPage config={CONFIG} />;
}
