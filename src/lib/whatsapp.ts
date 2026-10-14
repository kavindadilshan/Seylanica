import { SITE } from '../config/site'

/**
 * Builds a click-to-chat link for WhatsApp (works on mobile app, desktop app and web).
 * https://faq.whatsapp.com/5913398998672934
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Opens WhatsApp in a new tab with a prefilled message. */
export function openWhatsApp(message?: string) {
  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
}

/** Formats key/value pairs as a tidy WhatsApp message block. */
export function formatMessage(title: string, rows: Array<[string, string | undefined | false]>, footer?: string) {
  const body = rows
    .filter(([, v]) => v !== undefined && v !== false && v !== '')
    .map(([k, v]) => `• *${k}:* ${v}`)
    .join('\n')
  return [`*${title}*`, '', body, footer ? `\n${footer}` : ''].join('\n').trim()
}
