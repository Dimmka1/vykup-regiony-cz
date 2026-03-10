/** Use-case personalization config for return visitors (VR-270) */

export const USE_CASE_COOKIE_NAME = "last_use_case" as const;
export const USE_CASE_COOKIE_MAX_AGE_DAYS = 30;

export type UseCaseKey = "exekuce" | "dedictvi" | "rozvod" | "hypoteka";

export interface UseCaseContent {
  headline: string;
  subtitle: string;
  testimonial?: {
    name: string;
    text: string;
    location: string;
  };
}

/**
 * Maps URL pathname → use case key.
 * Only pages that represent a "situation" use case are included.
 */
export const PATH_TO_USE_CASE: Readonly<Record<string, UseCaseKey>> = {
  "/vykup-pri-exekuci": "exekuce",
  "/vykup-pri-dedictvi": "dedictvi",
  "/vykup-pri-rozvodu": "rozvod",
  "/vykup-nemovitosti-s-hypotekou": "hypoteka",
};

export const USE_CASE_CONTENT: Readonly<Record<UseCaseKey, UseCaseContent>> = {
  exekuce: {
    headline: "Řešíte exekuci? Vykoupíme nemovitost do 48 hodin",
    subtitle:
      "Pomůžeme vám rychle a diskrétně vyřešit exekuci. Uhradíme dluhy z kupní ceny a zbyde vám čistý start.",
    testimonial: {
      name: "Martin K.",
      text: "Měl jsem tři exekuce na bytě a nevěděl kudy kam. Během týdne bylo vše vyřešené, dluhy splacené a já mohl začít znovu.",
      location: "Praha",
    },
  },
  dedictvi: {
    headline: "Zdědili jste nemovitost? Pomůžeme s rychlým prodejem",
    subtitle:
      "Zděděnou nemovitost vykoupíme bez komplikací. Vyřešíme i spoluvlastnictví mezi dědici.",
    testimonial: {
      name: "Jana M.",
      text: "Po tatínkovi jsme zdědili dům, ale sourozenci se nemohli dohodnout. Výkup vše vyřešil za dva týdny.",
      location: "Brno",
    },
  },
  rozvod: {
    headline: "Rozvod a společná nemovitost? Vyřešíme to za vás",
    subtitle:
      "Férové vypořádání společné nemovitosti při rozvodu. Rychle, bez stresu a se zárukou férové ceny.",
    testimonial: {
      name: "Petra S.",
      text: "Při rozvodu jsme se s manželem nemohli dohodnout na bytě. Díky rychlému výkupu jsme oba dostali své peníze a mohli jít dál.",
      location: "Ostrava",
    },
  },
  hypoteka: {
    headline: "Nesplácíte hypotéku? Zbavíme vás dluhů",
    subtitle:
      "Vykoupíme nemovitost zatíženou hypotékou. Splatíme banku z kupní ceny a zbytek je váš.",
    testimonial: {
      name: "Tomáš R.",
      text: "Nespláceli jsme hypotéku a hrozila dražba. Výkup proběhl za 10 dní, banka byla splacená a nám zbylo na nový začátek.",
      location: "Plzeň",
    },
  },
};

/** All recognized use case keys */
export const USE_CASE_KEYS: readonly UseCaseKey[] = Object.keys(
  USE_CASE_CONTENT,
) as UseCaseKey[];

/** Type guard — checks if a string is a valid UseCaseKey */
export function isUseCaseKey(value: string): value is UseCaseKey {
  return USE_CASE_KEYS.includes(value as UseCaseKey);
}

/** Read the last_use_case cookie value (client-side only) */
export function getLastUseCaseCookie(): UseCaseKey | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${USE_CASE_COOKIE_NAME}=([^;]*)`),
  );
  if (!match) return null;

  const value = decodeURIComponent(match[1]);
  return isUseCaseKey(value) ? value : null;
}

/** Set the last_use_case cookie (client-side only) */
export function setLastUseCaseCookie(useCase: UseCaseKey): void {
  if (typeof document === "undefined") return;

  const maxAge = USE_CASE_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${USE_CASE_COOKIE_NAME}=${encodeURIComponent(useCase)};path=/;max-age=${maxAge};SameSite=Lax`;
}
