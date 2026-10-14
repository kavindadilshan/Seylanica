import { SITE } from '../config/site'
import { PRODUCTS } from '../data/products'
import { FAQ } from '../data/faq'
import type { Product } from '../types'

/*
 * SEO / AEO / GEO METADATA
 * ------------------------------------------------------------------
 * Single source of truth for every page's <head>: title, description, canonical,
 * Open Graph and JSON-LD structured data. Used by:
 *  - <Seo /> in the browser (updates <head> on navigation), and
 *  - scripts/prerender.mjs at build time (bakes it into static HTML, plus
 *    sitemap.xml, robots.txt and llms.txt) so crawlers that do not run
 *    JavaScript, including most AI crawlers, still see full content.
 */

export interface PageMeta {
  path: string
  title: string
  description: string
  image?: string
  noindex?: boolean
  jsonLd: object[]
}

/** Indexable routes, in sitemap order. Add new pages here. */
export const ROUTES = ['/', '/products', '/quality', '/buyer-hub', '/shop', '/quote'] as const

const abs = (path: string) => (path.startsWith('http') ? path : `${SITE.url}${path}`)
const ORG_ID = `${SITE.url}/#organization`
const SITE_ID = `${SITE.url}/#website`

const PAGES: Record<string, Omit<PageMeta, 'path' | 'jsonLd'> & { crumb: string }> = {
  '/': {
    crumb: 'Home',
    title: 'Seylanica · Ceylon Cinnamon Exporter from Sri Lanka',
    description:
      'Export-grade True Ceylon cinnamon (Cinnamomum verum) from Sri Lanka: Alba, C5 Special, C5 and C4 quills, chips and lab-tested powder, with a COA for every lot. FOB, CIF and air samples.',
  },
  '/products': {
    crumb: 'Products',
    title: 'Ceylon Cinnamon Quills, Chips & Powder: Wholesale Grades',
    description:
      'Compare Ceylon cinnamon grades side by side: Alba, C5 Special, C5 and C4 quills (SLS 81), chips for milling and blending, and 60/80 mesh powder. Moisture, volatile oil, MOQ and Incoterms.',
  },
  '/quality': {
    crumb: 'Quality & Origin',
    title: 'Ceylon vs Cassia Cinnamon & Lab Testing Standards',
    description:
      'How True Ceylon cinnamon differs from cassia in species, structure, flavour and coumarin, and what each Seylanica Certificate of Analysis tests: moisture, volatile oil, ash, microbiology, pesticides and heavy metals.',
  },
  '/buyer-hub': {
    crumb: 'B2B Buyer Hub',
    title: 'B2B Buyer Hub: Spec Sheets, COA & Shipping Planner',
    description:
      'Download Ceylon cinnamon spec sheets, view a sample Certificate of Analysis and import documents, and plan FOB Colombo or CIF container shipments for your port.',
  },
  '/shop': {
    crumb: 'Shop',
    title: 'Buy Ceylon Cinnamon Sticks & Powder Online',
    description:
      'Order True Ceylon cinnamon sticks and lab-tested powder in 50 g to 1 kg packs, priced in USD, EUR or GBP. Checkout and delivery confirmed on WhatsApp.',
  },
  '/quote': {
    crumb: 'Request a Quote',
    title: 'Request a Ceylon Cinnamon Quote or Samples',
    description:
      'Get a bulk Ceylon cinnamon quotation within 24 hours, or request air-couriered samples. Tell us your grade, volume, destination port and Incoterm.',
  },
}

const NOT_FOUND = {
  title: 'Page not found',
  description: 'The page you were looking for does not exist. Browse Seylanica Ceylon cinnamon products or contact our export team.',
}

const withBrand = (title: string) => (title.includes(SITE.brand) ? title : `${title} | ${SITE.brand}`)

/* ------------------------------ JSON-LD ------------------------------ */

function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.brand,
    legalName: SITE.legalName,
    slogan: SITE.tagline,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: abs(SITE.logoMarkImage), width: 256, height: 256 },
    image: abs(SITE.emblemImage),
    description:
      'Sri Lankan exporter of True Ceylon cinnamon (Cinnamomum verum): SLS 81 graded quills, chips and lab-tested powder for importers, spice brands and tea blenders, with lot-based Certificate of Analysis traceability.',
    email: SITE.email,
    telephone: `+${SITE.whatsappNumber}`,
    address: { '@type': 'PostalAddress', addressCountry: 'LK' },
    areaServed: 'Worldwide',
    sameAs: [SITE.facebookUrl],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: `+${SITE.whatsappNumber}`,
      email: SITE.email,
      availableLanguage: ['English'],
      areaServed: 'Worldwide',
    },
    knowsAbout: ['Ceylon cinnamon', 'Cinnamomum verum', 'Cinnamon quills', 'Cinnamon powder', 'Spice export', 'SLS 81 cinnamon grading'],
  }
}

function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.brand,
    url: `${SITE.url}/`,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  }
}

function breadcrumbLd(path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: PAGES[path].crumb, item: abs(path) },
    ],
  }
}

function faqLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
}

function productLd(p: Product) {
  const prices = p.retailPacks.map((r) => r.priceUsd).filter((n): n is number => n != null)
  return {
    '@type': 'Product',
    '@id': `${SITE.url}/products#${p.id}`,
    name: p.name,
    sku: p.sku,
    description: `${p.shortDescription} ${p.sensoryProfile}`,
    image: abs(p.image),
    brand: { '@type': 'Brand', name: SITE.brand },
    manufacturer: { '@id': ORG_ID },
    category: `Ceylon cinnamon ${p.category}`,
    countryOfOrigin: { '@type': 'Country', name: 'Sri Lanka' },
    additionalProperty: p.specs.map((s) => ({ '@type': 'PropertyValue', name: s.label, value: s.value })),
    ...(prices.length && !p.comingSoon
      ? {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: 'https://schema.org/InStock',
            url: abs('/shop'),
            seller: { '@id': ORG_ID },
          },
        }
      : {}),
  }
}

function productListLd(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: productLd(p) })),
  }
}

function webPageLd(path: string, title: string, description: string, extra: object = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': SITE_ID },
    publisher: { '@id': ORG_ID },
    ...extra,
  }
}

/* ------------------------------ Public API ------------------------------ */

export function getPageMeta(pathname: string): PageMeta {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const page = PAGES[path]
  if (!page) return { path, ...NOT_FOUND, title: withBrand(NOT_FOUND.title), noindex: true, jsonLd: [] }

  const title = withBrand(page.title)
  const jsonLd: object[] = [organizationLd(), websiteLd()]

  switch (path) {
    case '/':
      jsonLd.push(webPageLd(path, title, page.description, { about: { '@id': ORG_ID } }), faqLd())
      break
    case '/products':
      jsonLd.push(webPageLd(path, title, page.description), productListLd(PRODUCTS))
      break
    case '/shop':
      jsonLd.push(
        webPageLd(path, title, page.description),
        productListLd(PRODUCTS.filter((p) => !p.comingSoon && p.retailPacks.some((r) => r.priceUsd != null))),
      )
      break
    case '/quality':
      jsonLd.push(
        webPageLd(path, title, page.description, {
          about: [
            { '@type': 'Thing', name: 'Ceylon cinnamon', alternateName: 'Cinnamomum verum' },
            { '@type': 'Thing', name: 'Cassia', alternateName: 'Cinnamomum cassia' },
          ],
        }),
      )
      break
    default:
      jsonLd.push(webPageLd(path, title, page.description))
  }
  if (path !== '/') jsonLd.push(breadcrumbLd(path))

  return { path, title, description: page.description, image: SITE.emblemImage, jsonLd }
}

export interface HeadTag {
  tag: 'title' | 'meta' | 'link' | 'script'
  attrs?: Record<string, string>
  text?: string
}

/** Every <head> tag a page needs. Rendered to DOM by <Seo /> and to HTML by the prerenderer. */
export function headTags(meta: PageMeta): HeadTag[] {
  const url = abs(meta.path)
  const image = abs(meta.image ?? SITE.emblemImage)
  const tags: HeadTag[] = [
    { tag: 'title', text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'robots', content: meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1' } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE.brand } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_US' } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: `${SITE.brand} · ${SITE.tagline}` } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  ]
  if (!meta.noindex) tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } })
  for (const ld of meta.jsonLd) tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify(ld) })
  return tags
}

const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const escText = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

export function headTagsToHtml(tags: HeadTag[]): string {
  return tags
    .map(({ tag, attrs = {}, text }) => {
      const a = Object.entries({ ...attrs, 'data-seo': '' })
        .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${escAttr(v)}"`))
        .join('')
      if (tag === 'meta' || tag === 'link') return `<${tag}${a} />`
      // JSON-LD must not be HTML-escaped; only neutralise a closing </script>.
      const body = tag === 'script' ? (text ?? '').replace(/<\/(script)/gi, '<\\/$1') : escText(text ?? '')
      return `<${tag}${a}>${body}</${tag}>`
    })
    .join('\n    ')
}
