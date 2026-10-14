import { POSTS } from 'virtual:blog'
import type { Author, BlogCategory, PostMeta } from '../types/blog'

/*
 * KNOWLEDGE HUB
 * ------------------------------------------------------------------
 * Articles: src/content/blog/<slug>.md (format in src/content/blog/README.md).
 * Topic clusters: each category is a hub page (/blog/category/<slug>) that links
 * every article in it, and every article links back to its hub, its related
 * product and related articles, so search engines read the site as an authority
 * on Ceylon cinnamon trade.
 */

export { POSTS }

export const AUTHOR: Author = {
  slug: 'kavinda-dilshan',
  name: 'Kavinda Dilshan',
  honorific: 'Mr.',
  // TODO: confirm the exact job title to display.
  jobTitle: 'Author, Seylanica Knowledge Hub',
  bio: 'Kavinda Dilshan writes the Seylanica Knowledge Hub: practical guides on True Ceylon cinnamon grades, lab testing, export documentation and sourcing for importers, spice brands and food manufacturers. His articles focus on what buyers can verify, such as the grade standard, the Certificate of Analysis and the shipping paperwork, rather than marketing claims.',
  image: '/images/authors/kavinda-dilshan.png',
  linkedin: 'https://www.linkedin.com/in/kavindadilshan',
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'ceylon-cinnamon-basics',
    name: 'Ceylon Cinnamon Basics',
    description: 'What True Ceylon cinnamon is, how it differs from cassia, and the terms every buyer should know.',
    image: '/images/quills-white.jpg',
    productId: 'quills-c5sp',
  },
  {
    slug: 'grades-specifications',
    name: 'Grades & Specifications',
    description: 'SLS 81 quill grades, cut sizes, powder mesh and how to read a Ceylon cinnamon spec sheet.',
    image: '/images/sticks-powder.jpg',
    productId: 'quills-alba',
  },
  {
    slug: 'quality-lab-testing',
    name: 'Quality & Lab Testing',
    description: 'Certificates of Analysis, ISO test methods, coumarin, microbiology and contaminant limits explained.',
    image: '/images/powder.jpg',
    productId: 'powder',
  },
  {
    slug: 'import-export',
    name: 'Import & Export Guide',
    description: 'Incoterms, shipping, documents and market-entry rules for importing Ceylon cinnamon into the EU, UK, US and beyond.',
    image: '/images/hero.jpg',
    productId: 'quills-c5',
  },
  {
    slug: 'buying-sourcing',
    name: 'B2B Buying & Sourcing',
    description: 'How to choose a Ceylon cinnamon supplier, request samples, negotiate and build a reliable supply chain.',
    image: '/images/dark-jar.jpg',
    productId: 'quills-c5',
  },
  {
    slug: 'private-label-retail',
    name: 'Private Label & Retail',
    description: 'Building a cinnamon brand: packaging, labelling, positioning and selling Ceylon cinnamon to consumers.',
    image: '/images/powder-jar.jpg',
    productId: 'powder',
  },
  {
    slug: 'culinary-industry-uses',
    name: 'Culinary & Industry Uses',
    description: 'How chefs, bakers, tea blenders, beverage makers and food manufacturers use Ceylon cinnamon.',
    image: '/images/spice-bowls.jpg',
    productId: 'chips',
  },
  {
    slug: 'origin-sustainability',
    name: 'Origin & Sustainability',
    description: "Sri Lanka's cinnamon regions, the peeler's craft, harvest cycles and responsible sourcing.",
    image: '/images/plantation.jpg',
    productId: 'quills-alba',
  },
  {
    slug: 'market-insights',
    name: 'Market Insights & Strategy',
    description: 'Demand trends, price drivers and go-to-market strategy for businesses trading Ceylon cinnamon.',
    image: '/images/leaves.jpg',
    productId: 'quills-c4',
  },
]

export const getCategory = (slug: string) => BLOG_CATEGORIES.find((c) => c.slug === slug)
export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug)
export const postsInCategory = (slug: string) => POSTS.filter((p) => p.category === slug)

/*
 * Placeholder photos until real ones are added: each category starts from its own
 * image and rotates through the pool, so neighbouring cards never repeat a photo.
 */
const IMAGE_POOL = [...new Set(BLOG_CATEGORIES.map((c) => c.image))]
const placeholderBySlug = new Map<string, string>()
for (const c of BLOG_CATEGORIES) {
  const start = IMAGE_POOL.indexOf(c.image)
  POSTS.filter((p) => p.category === c.slug).forEach((p, i) => placeholderBySlug.set(p.slug, IMAGE_POOL[(start + i) % IMAGE_POOL.length]))
}

/** Real photo if one was added, otherwise a rotating placeholder. */
export const postImage = (p: PostMeta) => p.image ?? placeholderBySlug.get(p.slug) ?? '/images/hero.jpg'
export const postImageAlt = (p: PostMeta) => p.imageAlt ?? (p.image ? p.title : `${getCategory(p.category)?.name ?? 'Ceylon cinnamon'}: illustrative photo`)

/** Same-category articles first, then articles sharing tags, excluding the current one. */
export function relatedPosts(post: PostMeta, n = 3): PostMeta[] {
  const score = (p: PostMeta) => (p.category === post.category ? 10 : 0) + p.tags.filter((t) => post.tags.includes(t)).length
  return POSTS.filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || (a.p.date < b.p.date ? 1 : -1))
    .slice(0, n)
    .map((x) => x.p)
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export const blogPath = (slug: string) => `/blog/${slug}`
export const categoryPath = (slug: string) => `/blog/category/${slug}`
export const authorPath = () => `/author/${AUTHOR.slug}`
