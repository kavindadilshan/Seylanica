import type { CurrencyCode, ComplianceFlags } from '../types'

/**
 * Central brand + business configuration.
 * Change values here instead of hard-coding them in components.
 */
export const SITE = {
  /**
   * Public origin, no trailing slash. Used for canonical URLs, sitemap and structured data.
   * Override per deployment with VITE_SITE_URL. TODO: confirm the production domain.
   */
  url: ((import.meta.env?.VITE_SITE_URL as string | undefined) ?? 'https://seylanica.com').replace(/\/$/, ''),
  brand: 'Seylanica',
  tagline: 'Exquisite Ceylon Cinnamon',
  legalName: 'Seylanica Spices',
  country: 'Sri Lanka',
  email: 'export@seylanica.com', // TODO: replace with the real inbox
  /** WhatsApp number in international format, digits only (used for wa.me links). */
  whatsappNumber: '94763737145',
  whatsappDisplay: '+94 76 373 7145',
  exportPort: 'Colombo, Sri Lanka',
  facebookUrl: 'https://www.facebook.com/Seylanica',
  /** Full emblem (mark + wordmark); used as the social share / profile image. */
  emblemImage: '/images/seylanica-emblem.png',
  logoMarkImage: '/images/logo-mark.png',
} as const

/**
 * COMPLIANCE FEATURE FLAGS
 * ------------------------------------------------------------------
 * Certification marks must never render unless the certificate is held and
 * verified. Each flag defaults to `false`; flip one to `true` ONLY after the
 * certificate (and licence to use the mark) is on file.
 *
 * - pgiRegistered: EU PGI "Ceylon Cinnamon" registration for this producer.
 *   While false, we show a neutral "PGI Eligible / Pending Approval" placeholder.
 * - pureCeylonLionMark: Sri Lanka Export Development Board "Pure Ceylon Cinnamon"
 *   lion logo licence.
 * - usdaOrganic / euOrganic: Organic certification held for the lot/SKU.
 * - nonGmoProject: Non-GMO Project verification.
 */
export const COMPLIANCE: ComplianceFlags = {
  pgiRegistered: false,
  pureCeylonLionMark: false,
  usdaOrganic: false,
  euOrganic: false,
  nonGmoProject: false,
}

/**
 * Indicative FX rates against USD (base currency of the price list).
 * These are display-only. Final invoices are issued in the agreed contract currency.
 * TODO: replace with a live FX feed if real-time pricing is needed.
 */
export const FX_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
}

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/buyer-hub', label: 'B2B Buyer Hub' },
  { to: '/quality', label: 'Quality & Origin' },
  { to: '/shop', label: 'Shop' },
] as const
