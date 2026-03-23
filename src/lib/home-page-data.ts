/**
 * Data builders for the homepage.
 * Extracted from home-page-content.tsx for SRP.
 */

import { isProductionHost, getRegionSubdomainUrl } from "@/lib/config";
import type { RegionConfig } from "@/lib/types";

export const COMPANY_NAME = "Vykoupím Nemovitost";

export function getRegionalFaq(
  region: RegionConfig,
): { question: string; answer: string }[] {
  return [
    {
      question: `Jak dlouho trvá celý proces výkupu nemovitosti ${region.locative}?`,
      answer: `Celý proces výkupu nemovitosti ${region.locative} trvá obvykle 7–14 dní od prvního kontaktu. V urgentních případech ${region.primaryCityLocative} a okolí dokážeme vše vyřídit i do 48 hodin.`,
    },
    {
      question: `Kolik peněz za nemovitost ${region.locative} dostanu?`,
      answer: `Nabízíme férovou tržní cenu stanovenou na základě aktuálních dat z realitního trhu ${region.locative} a individuálního posouzení stavu nemovitosti. Cenovou nabídku pro ${region.accusative} dostanete zdarma a nezávazně do 24 hodin.`,
    },
    {
      question: `Je výkup nemovitosti ${region.locative} bezpečný?`,
      answer: `Ano. Celý proces výkupu ${region.locative} zajišťují naši právníci, kupní smlouvu připravujeme s advokátní úschovou kupní ceny. Peníze jsou chráněny na úschovním účtu a uvolněny až po zápisu do katastru.`,
    },
    {
      question: "Musím platit provizi nebo nějaké poplatky?",
      answer: `Ne. Výkup nemovitosti ${region.locative} je pro vás zcela bez poplatků a bez provize. Veškeré náklady spojené s převodem, včetně právního servisu a poplatků za katastr, hradíme my.`,
    },
    {
      question: `Vykupujete ${region.locative} i nemovitosti s hypotékou nebo exekucí?`,
      answer: `Ano, ${region.locative} běžně řešíme nemovitosti zatížené hypotékou, exekucí, věcným břemenem nebo zástavním právem. Pomůžeme vám s vypořádáním všech závazků v rámci výkupu ${region.primaryCityLocative} a okolí.`,
    },
    {
      question: `Jak probíhá ocenění nemovitosti ${region.locative}?`,
      answer: `Po vyplnění formuláře náš odborník provede analýzu na základě lokality ${region.locative}, stavu a aktuálních tržních cen ${region.primaryCityLocative}. U složitějších případů nabídneme osobní prohlídku. Ocenění je vždy zdarma a nezávazné.`,
    },
  ];
}

export function getProcessSteps(region: RegionConfig) {
  return [
    {
      title: "Vyplníte formulář",
      eta: "2 min",
      icon: "FileText",
      description: `Stačí základní údaje o nemovitosti ${region.locative}`,
    },
    {
      title: "Nabídka do 24h",
      eta: "24 h",
      icon: "Zap",
      description: `Připravíme nezávaznou cenovou nabídku pro ${region.accusative}`,
    },
    {
      title: "Podpis smlouvy",
      eta: "dle dohody",
      icon: "FilePenLine",
      description: `Vše vyřídíme za vás ${region.locative}, včetně právního servisu`,
    },
    {
      title: "Peníze na účtu",
      eta: "do 48h",
      icon: "Banknote",
      description: `Výplata ihned po podpisu smlouvy za nemovitost ${region.locative}`,
    },
  ];
}

export function getComplexSituations(region: RegionConfig) {
  return [
    {
      label: "Exekuce",
      icon: "Gavel",
      description: `Vykoupíme nemovitost ${region.locative} i s exekucí a pomůžeme s oddlužením`,
    },
    {
      label: "Insolvence",
      icon: "FileWarning",
      description: `Řešení pro nemovitosti v insolvenčním řízení ${region.locative}`,
    },
    {
      label: "Hypotéka",
      icon: "Landmark",
      description: `Převezmeme nemovitost ${region.locative} se zatížením hypotékou`,
    },
    {
      label: "Dědictví",
      icon: "ScrollText",
      description: `Rychlý výkup zděděných nemovitostí ${region.locative} bez komplikací`,
    },
    {
      label: "Spoluvlastnický podíl",
      icon: "Users",
      description: `Odkoupíme i podíl na nemovitosti ${region.locative} bez souhlasu ostatních`,
    },
    {
      label: "Věcné břemeno",
      icon: "Link2",
      description: `Nemovitosti s věcným břemenem ${region.locative} nejsou problém`,
    },
  ];
}

function normalizeHost(host: string | null): string {
  if (!host) {
    return "vykoupim-nemovitost.cz";
  }
  return host
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
}

export function buildCanonicalUrl(
  host: string | null,
  regionKey?: string,
): string {
  const normalized = normalizeHost(host);
  const isProd = isProductionHost(host);

  if (regionKey === "national") {
    return "https://vykoupim-nemovitost.cz";
  }

  if (isProd && regionKey) {
    return getRegionSubdomainUrl(regionKey);
  }

  if (isProd) {
    return "https://vykoupim-nemovitost.cz";
  }

  const base = `https://${normalized}`;
  if (regionKey) {
    return `${base}/${regionKey}`;
  }
  return base;
}

export function buildMetaDescription(region: RegionConfig): string {
  const uspSnippet = region.uspPoints.slice(0, 2).join(" • ");
  const base = `${region.description} ${uspSnippet}. Nezávazná nabídka do 24 hodin.`;
  if (base.length <= 160) {
    return base;
  }
  const sentenceBoundary = base.lastIndexOf(".", 160);
  if (sentenceBoundary >= 120) {
    return base.slice(0, sentenceBoundary + 1).trim();
  }
  return `${base.slice(0, 157).trimEnd()}...`;
}

export function buildSchema(
  region: RegionConfig,
  canonicalUrl: string,
): object[] {
  const ogImageUrl = `${canonicalUrl}/opengraph-image`;

  const faqItems = [
    ...getRegionalFaq(region).slice(0, 2),
    ...region.faq.slice(0, 2),
    ...(region.regionFaq ?? []).slice(0, 2),
  ];

  return [
    {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "@id": `${canonicalUrl}#business`,
      name: `${COMPANY_NAME} – ${region.name}`,
      description:
        region.seoDescription ??
        `Rychlý výkup nemovitostí ${region.locative}. Nabídka do 24 hodin, peníze do 3 dnů.`,
      telephone: region.phone,
      email: region.email,
      url: canonicalUrl,
      priceRange: "$$",
      image: ogImageUrl,
      logo: "https://vykoupim-nemovitost.cz/icon.svg",
      areaServed: {
        "@type": "AdministrativeArea",
        name: region.name,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: region.primaryCity,
        addressRegion: region.name,
        addressCountry: "CZ",
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: region.phone,
        contactType: "customer service",
        areaServed: "CZ",
        availableLanguage: "Czech",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question" as const,
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: item.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Výkup nemovitostí – ${region.name}`,
      description: `Rychlý výkup nemovitostí ${region.locative}. Nabídka do 24 hodin, peníze do 3 dnů. Bez provize, právní servis zdarma.`,
      serviceType: "Výkup nemovitostí",
      areaServed: {
        "@type": "AdministrativeArea",
        name: region.name,
      },
      provider: {
        "@type": "Organization",
        name: COMPANY_NAME,
        url: "https://vykoupim-nemovitost.cz",
        telephone: region.phone,
      },
    },
  ];
}
