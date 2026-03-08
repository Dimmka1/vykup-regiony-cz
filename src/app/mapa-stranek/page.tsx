import type { Metadata } from "next";
import Link from "next/link";
import {
  listRegions,
  getRegionSubdomainUrl,
  isProductionHost,
} from "@/lib/config";
import { getRequestHost } from "@/lib/request-host";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BLOG_POSTS } from "@/app/blog/data";
import { safeJsonLd } from "@/lib/jsonld";

const SITE_URL = "https://vykoupim-nemovitost.cz";

export const metadata: Metadata = {
  title: "Mapa stránek | vykoupim-nemovitost.cz",
  description:
    "Kompletní přehled všech stránek webu vykoupim-nemovitost.cz. Najděte rychle informace o výkupu nemovitostí, kraje, blog, služby a právní situace.",
  alternates: {
    canonical: `${SITE_URL}/mapa-stranek`,
  },
};

const SERVICE_PAGES = [
  { href: "/vykup-pri-exekuci", label: "Výkup při exekuci" },
  { href: "/vykup-pri-dedictvi", label: "Výkup při dědictví" },
  { href: "/vykup-pri-rozvodu", label: "Výkup při rozvodu" },
  {
    href: "/vykup-spoluvlastnickeho-podilu",
    label: "Výkup spoluvlastnického podílu",
  },
  { href: "/vykup-nemovitosti-s-hypotekou", label: "Výkup s hypotékou" },
  {
    href: "/vykup-nemovitosti-s-vecnym-bremenem",
    label: "Výkup s věcným břemenem",
  },
  { href: "/zpetny-najem", label: "Zpětný nájem" },
] as const;

const PROPERTY_PAGES = [
  { href: "/vykup-bytu", label: "Výkup bytů" },
  { href: "/vykup-domu", label: "Výkup domů" },
  { href: "/vykup-pozemku", label: "Výkup pozemků" },
] as const;

const INFO_PAGES = [
  { href: "/jak-to-funguje", label: "Jak to funguje" },
  { href: "/proc-my", label: "Proč prodat nám" },
  { href: "/garance-vykupu", label: "Garance výkupu" },
  { href: "/caste-dotazy", label: "Časté dotazy" },
  { href: "/reference", label: "Reference" },
  { href: "/pruvodce-vykupem", label: "Průvodce výkupem" },
] as const;

const LEGAL_PAGES = [
  { href: "/ochrana-osobnich-udaju", label: "Ochrana osobních údajů" },
  { href: "/cookies", label: "Cookies" },
] as const;

function SitemapSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-slate-900">{title}</h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function SitemapLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[var(--theme-700)] transition hover:text-[var(--theme-600)] hover:underline"
      >
        {label}
      </Link>
    </li>
  );
}

export default async function MapaStranekPage() {
  const host = await getRequestHost();
  const regions = listRegions();
  const isProd = isProductionHost(host);

  const allUrls = [
    `${SITE_URL}/`,
    `${SITE_URL}/mapa-stranek`,
    ...SERVICE_PAGES.map((p) => `${SITE_URL}${p.href}`),
    ...PROPERTY_PAGES.map((p) => `${SITE_URL}${p.href}`),
    ...INFO_PAGES.map((p) => `${SITE_URL}${p.href}`),
    ...LEGAL_PAGES.map((p) => `${SITE_URL}${p.href}`),
    `${SITE_URL}/kraje`,
    ...regions.map((r) => getRegionSubdomainUrl(r.key)),
    `${SITE_URL}/blog`,
    ...BLOG_POSTS.map((p) => `${SITE_URL}/blog/${p.slug}`),
  ];

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Mapa stránek – vykoupim-nemovitost.cz",
    description: "Kompletní přehled všech stránek webu vykoupim-nemovitost.cz",
    url: `${SITE_URL}/mapa-stranek`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allUrls.length,
      itemListElement: allUrls.map((url, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionPageJsonLd) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white pb-16 pt-28">
        <div className="mx-auto max-w-5xl px-6">
          <Breadcrumbs
            items={[{ label: "Mapa stránek", href: "/mapa-stranek" }]}
          />

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Mapa stránek
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Kompletní přehled všech stránek webu. Rychle najděte informace o
            výkupu nemovitostí ve vašem regionu.
          </p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <SitemapSection title="Právní situace">
              {SERVICE_PAGES.map((page) => (
                <SitemapLink key={page.href} {...page} />
              ))}
            </SitemapSection>

            <SitemapSection title="Typy nemovitostí">
              {PROPERTY_PAGES.map((page) => (
                <SitemapLink key={page.href} {...page} />
              ))}
            </SitemapSection>

            <SitemapSection title="Informace">
              {INFO_PAGES.map((page) => (
                <SitemapLink key={page.href} {...page} />
              ))}
            </SitemapSection>

            <SitemapSection title="Blog">
              <SitemapLink href="/blog" label="Všechny články" />
              {BLOG_POSTS.map((post) => (
                <SitemapLink
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  label={post.title}
                />
              ))}
            </SitemapSection>

            <SitemapSection title="Regiony">
              <SitemapLink href="/kraje" label="Kde působíme – přehled krajů" />
              {regions.map((region) => {
                const href = isProd
                  ? getRegionSubdomainUrl(region.key)
                  : `/${region.key}`;
                return (
                  <li key={region.key}>
                    <a
                      href={href}
                      className="text-[var(--theme-700)] transition hover:text-[var(--theme-600)] hover:underline"
                    >
                      Výkup nemovitostí – {region.name}
                    </a>
                  </li>
                );
              })}
            </SitemapSection>

            <SitemapSection title="Právní informace">
              {LEGAL_PAGES.map((page) => (
                <SitemapLink key={page.href} {...page} />
              ))}
            </SitemapSection>
          </div>
        </div>
      </section>
    </>
  );
}
