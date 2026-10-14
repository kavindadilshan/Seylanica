import { CURRENCY_SYMBOL, FX_RATES } from '../config/site'
import type { CurrencyCode } from '../types'

/** Converts a USD list price into the selected display currency. */
export function convert(usd: number, currency: CurrencyCode) {
  return usd * FX_RATES[currency]
}

/** Locale per currency so symbols render natively ($, €, £). */
const LOCALE: Record<CurrencyCode, string> = { USD: 'en-US', EUR: 'en-IE', GBP: 'en-GB' }

export function formatPrice(usd: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(LOCALE[currency], { style: 'currency', currency, minimumFractionDigits: 2 }).format(convert(usd, currency))
}

export const symbolFor = (c: CurrencyCode) => CURRENCY_SYMBOL[c]
