import { listRegions, getRegionSubdomainUrl } from "@/lib/config";
import { BLOG_POSTS } from "@/app/blog/data";

const ROOT_DOMAIN = "vykoupim-nemovitost.cz";
const BASE_URL = `https://${ROOT_DOMAIN}`;

/** Property types with Czech SEO titles/captions */
const PROPERTY_TYPES = [
  {
    slug: "bytu",
    singular: "bytu",
    plural: "bytů",
    title: "Výkup bytů",
    image: "property-exterior.jpg",
  },
  {
    slug: "domu",
    singular: "domu",
    plural: "domů",
    title: "Výkup domů",
    image: "happy-family-home.jpg",
  },
  {
    slug: "pozemku",
    singular: "pozemku",
    plural: "pozemků",
    title: "Výkup pozemků",
    image: "property-exterior.jpg",
  },
] as const;

/** Use-case pages on root domain with Czech titles/captions */
const USE_CASE_PAGES = [
  {
    path: "/vykup-pri-exekuci",
    title: "Výkup nemovitostí při exekuci",
    caption:
      "Rychlý výkup nemovitostí zatížených exekucí — diskrétní řešení a férové podmínky",
  },
  {
    path: "/vykup-pri-dedictvi",
    title: "Výkup nemovitostí při dědictví",
    caption:
      "Výkup zděděných nemovitostí bez zbytečných průtahů — kompletní právní servis",
  },
  {
    path: "/vykup-pri-rozvodu",
    title: "Výkup nemovitostí při rozvodu",
    caption:
      "Rychlé vypořádání společného majetku při rozvodu — férový výkup nemovitosti",
  },
  {
    path: "/vykup-spoluvlastnickeho-podilu",
    title: "Výkup spoluvlastnického podílu",
    caption:
      "Výkup podílu na nemovitosti bez souhlasu ostatních spoluvlastníků",
  },
  {
    path: "/vykup-nemovitosti-s-hypotekou",
    title: "Výkup nemovitosti s hypotékou",
    caption: "Výkup nemovitosti zatížené hypotékou — splatíme úvěr za vás",
  },
  {
    path: "/vykup-nemovitosti-s-vecnym-bremenem",
    title: "Výkup nemovitosti s věcným břemenem",
    caption: "Výkup nemovitostí s věcným břemenem nebo služebností dožití",
  },
  {
    path: "/zpetny-najem",
    title: "Zpětný nájem nemovitosti",
    caption: "Prodejte nemovitost a zůstaňte bydlet — program zpětného nájmu",
  },
  {
    path: "/vykup-bytu",
    title: "Výkup bytů v celé ČR",
    caption: "Rychlý výkup bytů — nabídka do 24 hodin a vyplacení do 14 dnů",
  },
  {
    path: "/vykup-domu",
    title: "Výkup rodinných domů",
    caption: "Férový výkup rodinných domů v jakémkoli stavu — bez provize",
  },
  {
    path: "/vykup-pozemku",
    title: "Výkup pozemků",
    caption: "Rychlý výkup stavebních i zemědělských pozemků v celé ČR",
  },
] as const;

/** Other content pages on root domain */
const CONTENT_PAGES = [
  {
    path: "/jak-to-funguje",
    title: "Jak funguje výkup nemovitostí",
    caption:
      "Proces výkupu nemovitosti krok za krokem — od prvního kontaktu po vyplacení",
  },
  {
    path: "/proc-my",
    title: "Proč zvolit náš výkup nemovitostí",
    caption:
      "Výhody rychlého výkupu nemovitostí — bez provize, právní servis zdarma",
  },
  {
    path: "/caste-dotazy",
    title: "Časté dotazy k výkupu nemovitostí",
    caption: "Odpovědi na nejčastější otázky o rychlém výkupu nemovitostí v ČR",
  },
  {
    path: "/reference",
    title: "Reference — výkup nemovitostí",
    caption: "Zkušenosti klientů s rychlým výkupem nemovitostí po celé ČR",
  },
  {
    path: "/kraje",
    title: "Výkup nemovitostí podle krajů",
    caption:
      "Přehled regionů v ČR kde vykupujeme nemovitosti — 14 krajů pokrytých",
  },
  {
    path: "/garance-vykupu",
    title: "Garance výkupu nemovitosti",
    caption: "Naše garance férového a bezpečného výkupu nemovitostí",
  },
  {
    path: "/pruvodce-vykupem",
    title: "Průvodce výkupem nemovitosti",
    caption:
      "Kompletní průvodce procesem výkupu nemovitosti — vše co potřebujete vědět",
  },
  {
    path: "/blog",
    title: "Blog o výkupu nemovitostí",
    caption: "Články a rady k prodeji a výkupu nemovitostí v České republice",
  },
] as const;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface ImageEntry {
  loc: string;
  images: Array<{
    imageLoc: string;
    title: string;
    caption: string;
  }>;
}

function buildXml(entries: ImageEntry[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const entry of entries) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(entry.loc)}</loc>\n`;
    for (const img of entry.images) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(img.imageLoc)}</image:loc>\n`;
      xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export async function GET(): Promise<Response> {
  const regions = listRegions();
  const entries: ImageEntry[] = [];

  // ─── 1. Regional subdomain homepages (14 entries) ───
  for (const region of regions) {
    const regionUrl = getRegionSubdomainUrl(region.key);

    entries.push({
      loc: regionUrl,
      images: [
        {
          imageLoc: `${BASE_URL}/images/hero-${region.key === "praha" ? "prague" : region.key}.jpg`,
          title: region.h1,
          caption: region.description.slice(0, 200),
        },
        {
          imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
          title: `Výkup nemovitostí ${region.locative}`,
          caption: `Nemovitost k výkupu ${region.locative} — rychlý a férový proces`,
        },
        {
          imageLoc: `${BASE_URL}/images/happy-family-home.jpg`,
          title: `Spokojení klienti ${region.locative}`,
          caption: `Úspěšný výkup nemovitosti ${region.locative}`,
        },
        {
          imageLoc: `${BASE_URL}/images/process-consultation.webp`,
          title: `Konzultace výkupu ${region.locative}`,
          caption: `Bezplatná konzultace k výkupu nemovitosti ${region.locative}`,
        },
        {
          imageLoc: `${BASE_URL}/images/process-valuation.webp`,
          title: `Ocenění nemovitosti ${region.locative}`,
          caption: `Profesionální ocenění nemovitosti ${region.locative}`,
        },
      ],
    });
  }

  // ─── 2. Root domain homepage (1 entry) ───
  entries.push({
    loc: BASE_URL,
    images: [
      {
        imageLoc: `${BASE_URL}/images/hero-prague.jpg`,
        title: "Výkup nemovitostí v celé ČR",
        caption: "Rychlý výkup bytů, domů a pozemků — nabídka do 24 hodin",
      },
      {
        imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
        title: "Nemovitost k výkupu",
        caption:
          "Vykupujeme nemovitosti v jakémkoli stavu po celé České republice",
      },
      {
        imageLoc: `${BASE_URL}/images/happy-family-home.jpg`,
        title: "Spokojení klienti výkupu nemovitostí",
        caption:
          "Tisíce spokojených klientů po celé ČR — férový a rychlý výkup",
      },
    ],
  });

  // ─── 3. Use-case pages on root domain (10 entries) ───
  for (const page of USE_CASE_PAGES) {
    entries.push({
      loc: `${BASE_URL}${page.path}`,
      images: [
        {
          imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
          title: page.title,
          caption: page.caption,
        },
        {
          imageLoc: `${BASE_URL}/images/process-consultation.webp`,
          title: `${page.title} — konzultace`,
          caption: `Bezplatná konzultace: ${page.caption}`,
        },
        {
          imageLoc: `${BASE_URL}/images/happy-family-home.jpg`,
          title: `${page.title} — spokojení klienti`,
          caption: `Spokojení klienti kteří využili službu: ${page.title.toLowerCase()}`,
        },
      ],
    });
  }

  // ─── 4. Content pages on root domain (8 entries) ───
  for (const page of CONTENT_PAGES) {
    entries.push({
      loc: `${BASE_URL}${page.path}`,
      images: [
        {
          imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
          title: page.title,
          caption: page.caption,
        },
        {
          imageLoc: `${BASE_URL}/images/process-consultation.webp`,
          title: `${page.title} — ilustrace`,
          caption: page.caption,
        },
      ],
    });
  }

  // ─── 5. Blog posts (10 entries) ───
  for (const post of BLOG_POSTS) {
    entries.push({
      loc: `${BASE_URL}/blog/${post.slug}`,
      images: [
        {
          imageLoc: `${BASE_URL}/blog/${post.slug}/opengraph-image`,
          title: post.title,
          caption: post.excerpt.slice(0, 200),
        },
        {
          imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
          title: `${post.title} — ilustrace`,
          caption: post.excerpt.slice(0, 200),
        },
      ],
    });
  }

  // ─── 6. Regional × use-case programmatic pages (14 × 10 = 140 entries) ───
  for (const region of regions) {
    for (const page of USE_CASE_PAGES) {
      entries.push({
        loc: `${BASE_URL}${page.path}?kraj=${region.key}`,
        images: [
          {
            imageLoc: `${BASE_URL}/images/hero-${region.key === "praha" ? "prague" : region.key}.jpg`,
            title: `${page.title} ${region.locative}`,
            caption: `${page.caption} ${region.locative}`,
          },
          {
            imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
            title: `${page.title} — ${region.name}`,
            caption: `${page.caption} — region ${region.name}`,
          },
        ],
      });
    }
  }

  // ─── 7. Regional × city programmatic pages (14 × 6 = 84 entries) ───
  for (const region of regions) {
    const regionUrl = getRegionSubdomainUrl(region.key);

    for (const city of region.supportedCities) {
      const citySlug = slugify(city);
      entries.push({
        loc: `${regionUrl}?mesto=${citySlug}`,
        images: [
          {
            imageLoc: `${BASE_URL}/images/hero-${region.key === "praha" ? "prague" : region.key}.jpg`,
            title: `Výkup nemovitostí ${city}`,
            caption: `Rychlý výkup nemovitostí ve městě ${city} — ${region.name}`,
          },
          {
            imageLoc: `${BASE_URL}/images/property-exterior.jpg`,
            title: `Nemovitost k výkupu ${city}`,
            caption: `Vykupujeme byty, domy a pozemky v ${city} a okolí`,
          },
          {
            imageLoc: `${BASE_URL}/images/happy-family-home.jpg`,
            title: `Spokojení klienti ${city}`,
            caption: `Úspěšný výkup nemovitosti v ${city}`,
          },
        ],
      });
    }
  }

  // ─── 8. City × property type pages (84 × 3 = 252 entries) ───
  for (const region of regions) {
    const regionUrl = getRegionSubdomainUrl(region.key);

    for (const city of region.supportedCities) {
      const citySlug = slugify(city);

      for (const propType of PROPERTY_TYPES) {
        entries.push({
          loc: `${regionUrl}?mesto=${citySlug}&typ=${propType.slug}`,
          images: [
            {
              imageLoc: `${BASE_URL}/images/${propType.image}`,
              title: `${propType.title} ${city}`,
              caption: `Rychlý výkup ${propType.plural} ve městě ${city} — férové podmínky`,
            },
            {
              imageLoc: `${BASE_URL}/images/process-consultation.webp`,
              title: `Konzultace výkupu ${propType.singular} ${city}`,
              caption: `Bezplatná konzultace k výkupu ${propType.singular} v ${city}`,
            },
          ],
        });
      }
    }
  }

  const xml = buildXml(entries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
