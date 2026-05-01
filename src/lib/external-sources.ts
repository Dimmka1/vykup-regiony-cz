/**
 * Tier-1 authoritative Czech sources used as inline citations across the site.
 *
 * Linking to these from factual claims is one of the strongest E-E-A-T signals
 * for Google AI Overview / AI Mode citation eligibility (see design doc:
 * +132% citation impact for Tier-1 source citations).
 *
 * Each source has a stable key so we can reference it from multiple pages
 * without duplicating the URL or describing it differently each time.
 */

export interface ExternalSource {
  /** Stable key used by content code to look the source up. */
  readonly key: string;
  /** Czech-language display name shown in citation links. */
  readonly name: string;
  /** Canonical homepage URL (no trailing slash). */
  readonly url: string;
  /** One-line Czech description of why this source is authoritative for our topic. */
  readonly description: string;
  /** Topical tags so we can render lists by area (e.g. "execution", "tax"). */
  readonly topics: readonly string[];
}

export const EXTERNAL_SOURCES = {
  cuzk: {
    key: "cuzk",
    name: "Český úřad zeměměřický a katastrální (ČÚZK)",
    url: "https://www.cuzk.cz",
    description:
      "Státní orgán spravující katastr nemovitostí ČR — zápisy vlastnictví, zástavních práv a věcných břemen.",
    topics: ["cadastre", "ownership", "easement", "mortgage-lien"],
  },
  financnisprava: {
    key: "financnisprava",
    name: "Finanční správa ČR",
    url: "https://www.financnisprava.cz",
    description:
      "Orgán státní správy v oblasti daní — daň z příjmů z prodeje nemovitosti, daň z nemovitých věcí.",
    topics: ["tax"],
  },
  mfcr: {
    key: "mfcr",
    name: "Ministerstvo financí ČR",
    url: "https://www.mfcr.cz",
    description:
      "Ústřední orgán státní správy pro finance, daně a regulaci finančního trhu v ČR.",
    topics: ["tax", "finance"],
  },
  czso: {
    key: "czso",
    name: "Český statistický úřad (ČSÚ)",
    url: "https://www.czso.cz",
    description:
      "Oficiální zdroj cenových a transakčních statistik realitního trhu v ČR podle krajů.",
    topics: ["market-data", "statistics"],
  },
  justice: {
    key: "justice",
    name: "Portál justice.cz (Ministerstvo spravedlnosti ČR)",
    url: "https://www.justice.cz",
    description:
      "Veřejný rejstřík, insolvenční rejstřík a evidence úpadců — ověřování zatížení nemovitosti.",
    topics: ["insolvency", "court-registry"],
  },
  exekutorskakomora: {
    key: "exekutorskakomora",
    name: "Exekutorská komora ČR",
    url: "https://www.ekcr.cz",
    description:
      "Stavovská organizace soudních exekutorů — Centrální evidence exekucí a postupy při exekuci nemovitosti.",
    topics: ["execution"],
  },
  cak: {
    key: "cak",
    name: "Česká advokátní komora (ČAK)",
    url: "https://www.cak.cz",
    description:
      "Stavovská organizace advokátů — pravidla advokátní úschovy a seznam advokátů.",
    topics: ["legal", "escrow"],
  },
  cnb: {
    key: "cnb",
    name: "Česká národní banka (ČNB)",
    url: "https://www.cnb.cz",
    description:
      "Centrální banka ČR — sazby, regulace hypotečního trhu, statistiky úvěrů.",
    topics: ["mortgage", "finance"],
  },
  zakonyprolidi: {
    key: "zakonyprolidi",
    name: "Zákony pro lidi",
    url: "https://www.zakonyprolidi.cz",
    description:
      "Plné znění občanského zákoníku, zákona o katastru nemovitostí a exekučního řádu.",
    topics: ["law"],
  },
  obcanskyzakonik: {
    key: "obcanskyzakonik",
    name: "Občanský zákoník (zákon č. 89/2012 Sb.)",
    url: "https://www.zakonyprolidi.cz/cs/2012-89",
    description:
      "Občanský zákoník — úprava vlastnictví, spoluvlastnictví, věcných břemen, kupní smlouvy.",
    topics: ["law", "ownership", "easement", "contract"],
  },
  insolvencnirejstrik: {
    key: "insolvencnirejstrik",
    name: "Insolvenční rejstřík (ISIR)",
    url: "https://isir.justice.cz",
    description:
      "Veřejný rejstřík insolvenčních řízení — ověřování insolvence vlastníka nemovitosti.",
    topics: ["insolvency"],
  },
  centralniEvidenceExekuci: {
    key: "centralniEvidenceExekuci",
    name: "Centrální evidence exekucí (CEE)",
    url: "https://www.ceecr.cz",
    description:
      "Veřejná evidence všech zahájených exekucí v ČR vedená Exekutorskou komorou.",
    topics: ["execution"],
  },
} as const satisfies Record<string, ExternalSource>;

export type ExternalSourceKey = keyof typeof EXTERNAL_SOURCES;

/** Get a source by its stable key. Throws at runtime only if a typo bypassed types. */
export function getExternalSource(key: ExternalSourceKey): ExternalSource {
  return EXTERNAL_SOURCES[key];
}

/** All sources matching a given topic tag. */
export function getSourcesByTopic(topic: string): readonly ExternalSource[] {
  return Object.values(EXTERNAL_SOURCES).filter((s) =>
    (s.topics as readonly string[]).includes(topic),
  );
}

/** All sources, in registration order. */
export function listExternalSources(): readonly ExternalSource[] {
  return Object.values(EXTERNAL_SOURCES);
}
