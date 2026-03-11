export interface PromoConfig {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  expiresAt: string;
  color?: string;
  active: boolean;
}

export const EMPTY_PROMO: PromoConfig = {
  id: "",
  title: "",
  subtitle: "",
  ctaText: "",
  ctaUrl: "",
  expiresAt: "",
  active: false,
};

export function isPromoActive(promo: PromoConfig): boolean {
  if (!promo.active || !promo.id) return false;
  const now = Date.now();
  const expiry = new Date(promo.expiresAt).getTime();
  return !isNaN(expiry) && expiry > now;
}
