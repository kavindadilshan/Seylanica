/*
 * Build-time prerender + crawler files.
 * ------------------------------------------------------------------
 * Runs after `vite build` (client) and `vite build --ssr` (server entry).
 * For every route in src/seo/meta.ts it writes static HTML with the full page
 * content and <head> baked in, so search engines and AI crawlers that do not
 * execute JavaScript see the real page. The client then hydrates it.
 *
 * Also generates sitemap.xml, robots.txt, feed.xml (RSS), llms.txt and
 * llms-full.txt from the same data.
 */
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')

const server = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const { render, ROUTES, allRoutes, getPageMeta, headTags, headTagsToHtml, SITE, PRODUCTS, FAQ, CEYLON_VS_CASSIA, POSTS, BLOG_CATEGORIES, AUTHOR, postImage } =
  server
const blogDir = path.join(root, 'src/content/blog')
const postBySlug = new Map(POSTS.map((p) => [p.slug, p]))

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the <!--seo--> block or the empty #root div')
}

async function page(url) {
  const body = await render(url)
  const head = headTagsToHtml(headTags(getPageMeta(url)))
  return template.replace(SEO_BLOCK, `<!--seo-->\n    ${head}\n    <!--/seo-->`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)
}

// Pages: "/" -> index.html, "/products" -> products.html, "/blog/x" -> blog/x.html (served extensionless via cleanUrls).
const routes = allRoutes()
for (const route of routes) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
  await mkdir(path.dirname(path.join(dist, file)), { recursive: true })
  await writeFile(path.join(dist, file), await page(route))
}
console.log(`  prerendered ${routes.length} pages (${POSTS.length} articles)`)
await writeFile(path.join(dist, '404.html'), await page('/404'))

// sitemap.xml: articles carry their own last-modified date.
const today = new Date().toISOString().slice(0, 10)
const escXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const lastmod = (r) => {
  const post = postBySlug.get(r.replace(/^\/blog\//, ''))
  return post ? (post.updated ?? post.date) : today
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE.url}${r}</loc><lastmod>${lastmod(r)}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(path.join(dist, 'sitemap.xml'), sitemap)

// robots.txt: open to search and AI crawlers so the brand can be found and cited.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot']
const robots = `# Seylanica welcomes search engines and AI assistants.
User-agent: *
Allow: /

${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`
await writeFile(path.join(dist, 'robots.txt'), robots)

// llms.txt: a plain-Markdown brief for LLMs (https://llmstxt.org).
const pageLine = (r) => {
  const m = getPageMeta(r)
  return `- [${m.title.replace(/ \| .*$/, '')}](${SITE.url}${r}): ${m.description}`
}
const llms = `# ${SITE.brand}

> ${SITE.brand} (${SITE.legalName}) is a Sri Lankan exporter of True Ceylon cinnamon (Cinnamomum verum): SLS 81 graded quills (Alba, C5 Special, C5, C4), chips and lab-tested powder for importers, spice brands and tea blenders worldwide. Every export lot ships with a Certificate of Analysis.

- Origin: ${SITE.country}; export port ${SITE.exportPort}
- Orders and quotes: WhatsApp ${SITE.whatsappDisplay} (https://wa.me/${SITE.whatsappNumber}), email ${SITE.email}, or ${SITE.url}/quote
- Facebook: ${SITE.facebookUrl}
- Product statements are factual; binding specifications are those on each lot's Certificate of Analysis. No health or medical claims are made.

## Pages

${ROUTES.map(pageLine).join('\n')}

## Products

${PRODUCTS.map((p) => {
  const head = `### ${p.name}${p.comingSoon ? ' (coming soon)' : ''}\n\n${p.shortDescription} ${p.sensoryProfile}\n`
  const specs = p.specs.map((s) => `- ${s.label}: ${s.value}${s.reference ? ` (${s.reference})` : ''}`).join('\n')
  const bulk = `- MOQ: ${p.bulk.moq}\n- Lead time: ${p.bulk.leadTime}\n- Incoterms: ${p.bulk.incoterms.join(', ')}\n- Private label: ${p.bulk.privateLabel ? 'yes' : 'no'}`
  const retail = p.retailPacks.filter((r) => r.priceUsd != null).map((r) => `${r.label} USD ${r.priceUsd}`).join('; ')
  return `${head}\n${specs}\n${bulk}${retail ? `\n- Retail packs: ${retail}` : ''}`
}).join('\n\n')}

## Ceylon cinnamon vs cassia

| Attribute | Ceylon | Cassia |
| --- | --- | --- |
${CEYLON_VS_CASSIA.map((r) => `| ${r.attribute} | ${r.ceylon} | ${r.cassia} |`).join('\n')}

## FAQ

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Knowledge Hub articles

Written by ${AUTHOR.honorific} ${AUTHOR.name} (${AUTHOR.linkedin}). Full text of every article: ${SITE.url}/llms-full.txt

${BLOG_CATEGORIES.map((c) => {
  const posts = POSTS.filter((p) => p.category === c.slug)
  return `### ${c.name}\n\n${posts.map((p) => `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.description}`).join('\n')}`
}).join('\n\n')}
`
await writeFile(path.join(dist, 'llms.txt'), llms)

// llms-full.txt: every article's full Markdown, so AI assistants can read and cite them in one fetch.
const articleText = async (p) => {
  const raw = await readFile(path.join(blogDir, `${p.slug}.md`), 'utf8')
  const body = raw.replace(/^---[\s\S]*?\r?\n---\r?\n?/, '').trim()
  return `# ${p.title}\n\nURL: ${SITE.url}/blog/${p.slug}\nAuthor: ${AUTHOR.name}\nPublished: ${p.date}${p.updated ? `\nUpdated: ${p.updated}` : ''}\n\n> ${p.description}\n\n${body}`
}
const full = `# ${SITE.brand} Knowledge Hub: full articles\n\n> ${POSTS.length} articles on True Ceylon cinnamon trade by ${AUTHOR.name}. Source: ${SITE.url}/blog\n\n${(await Promise.all(POSTS.map(articleText))).join('\n\n---\n\n')}\n`
await writeFile(path.join(dist, 'llms-full.txt'), full)

// feed.xml: RSS 2.0 for the newest articles (feed readers, aggregators, Bing/Google discovery).
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escXml(`${SITE.brand} Knowledge Hub`)}</title>
    <link>${SITE.url}/blog</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Guides on True Ceylon cinnamon grades, quality, export and sourcing.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${POSTS.slice(0, 50)
  .map(
    (p) => `    <item>
      <title>${escXml(p.title)}</title>
      <link>${SITE.url}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}</guid>
      <description>${escXml(p.description)}</description>
      <dc:creator>${escXml(AUTHOR.name)}</dc:creator>
      <category>${escXml(BLOG_CATEGORIES.find((c) => c.slug === p.category)?.name ?? p.category)}</category>
      <pubDate>${new Date(`${p.date}T08:00:00Z`).toUTCString()}</pubDate>
      <enclosure url="${SITE.url}${postImage(p)}" type="image/${postImage(p).endsWith('.png') ? 'png' : postImage(p).endsWith('.webp') ? 'webp' : 'jpeg'}" length="0" />
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>
`
await writeFile(path.join(dist, 'feed.xml'), rss)
console.log('  wrote sitemap.xml, robots.txt, feed.xml, llms.txt, llms-full.txt')

await rm(serverDir, { recursive: true, force: true })
