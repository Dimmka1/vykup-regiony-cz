import Link from "next/link";

/**
 * VR-342: Blog→Geo Internal Links.
 *
 * Maps blog article slugs to relevant use-case pages, then renders
 * a "Související v regionech" section with links to top geo pages.
 */

interface GeoLink {
  label: string;
  href: string;
}

/** Top regions by population/relevance */
const TOP_REGIONS: ReadonlyArray<{ key: string; name: string }> = [
  { key: "praha", name: "Praha" },
  { key: "jihomoravsky-kraj", name: "Jihomoravský kraj" },
  { key: "moravskoslezsky-kraj", name: "Moravskoslezský kraj" },
  { key: "stredocesky-kraj", name: "Středočeský kraj" },
  { key: "ustecky-kraj", name: "Ústecký kraj" },
];

/** Map blog slug → relevant use-case paths */
const BLOG_USE_CASE_MAP: Record<string, string[]> = {
  // Exekuce-related articles
  "nemovitost-v-exekuci-pruvodce": ["/vykup-pri-exekuci"],
  "vykup-v-exekuci": ["/vykup-pri-exekuci"],
  // General process articles → vykup-bytu, vykup-domu
  "jake-dokumenty-potrebuji": ["/vykup-bytu", "/vykup-domu"],
  "vykup-krok-za-krokem": ["/vykup-bytu", "/vykup-domu"],
  "jak-probiha-rychly-vykup": ["/vykup-bytu", "/vykup-domu"],
  // Comparison articles → general use-cases
  "vykup-vs-drazba": ["/vykup-pri-exekuci", "/vykup-bytu"],
  "kolik-stoji-vykup": ["/vykup-bytu", "/vykup-domu"],
  "vykup-nemovitosti-vs-realitni-kancelar": ["/vykup-bytu", "/vykup-domu"],
  // Quick sell article
  "jak-rychle-prodat-nemovitost": [
    "/vykup-bytu",
    "/vykup-domu",
    "/vykup-pozemku",
  ],
  // Reasons article
  "5-duvodu-proc-prodat": ["/vykup-bytu", "/vykup-domu"],
};

function buildGeoLinks(slug: string): GeoLink[] {
  const useCases = BLOG_USE_CASE_MAP[slug];
  if (!useCases) return [];

  const links: GeoLink[] = [];
  // For each use-case, pick top regions (limit to 5 total links)
  for (const useCasePath of useCases) {
    for (const region of TOP_REGIONS) {
      if (links.length >= 5) break;
      links.push({
        label: `${formatUseCaseName(useCasePath)} – ${region.name}`,
        href: `${useCasePath}?kraj=${region.key}`,
      });
    }
    if (links.length >= 5) break;
  }

  return links;
}

function formatUseCaseName(path: string): string {
  const names: Record<string, string> = {
    "/vykup-bytu": "Výkup bytů",
    "/vykup-domu": "Výkup domů",
    "/vykup-pozemku": "Výkup pozemků",
    "/vykup-pri-exekuci": "Výkup při exekuci",
    "/vykup-pri-dedictvi": "Výkup při dědictví",
    "/vykup-pri-rozvodu": "Výkup při rozvodu",
    "/vykup-spoluvlastnickeho-podilu": "Výkup spoluvlastnického podílu",
    "/vykup-nemovitosti-s-hypotekou": "Výkup s hypotékou",
    "/vykup-nemovitosti-s-vecnym-bremenem": "Výkup s věcným břemenem",
    "/zpetny-najem": "Zpětný nájem",
  };
  return names[path] ?? "Výkup nemovitostí";
}

interface BlogGeoLinksProps {
  slug: string;
}

export function BlogGeoLinks({
  slug,
}: BlogGeoLinksProps): React.ReactElement | null {
  const links = buildGeoLinks(slug);
  if (links.length === 0) return null;

  return (
    <nav
      aria-label="Související v regionech"
      className="mt-12 rounded-2xl bg-slate-50 p-8"
    >
      <h2 className="text-lg font-bold text-slate-900">
        Související v regionech
      </h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-emerald-600 hover:text-emerald-500 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
