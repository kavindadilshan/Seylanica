/*
 * Build-time prerender + crawler files.
 * ------------------------------------------------------------------
 * Runs after `vite build` (client) and `vite build --ssr` (server entry).
 * For every route in src/seo/meta.ts it writes static HTML with the full page
 * content and <head> baked in, so search engines and AI crawlers that do not
 * execute JavaScript see the real page. The client then hydrates it.
 *
 * Also generates sitemap.xml, robots.txt and llms.txt from the same data.
 */
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')

const server = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const { render, ROUTES, getPageMeta, headTags, headTagsToHtml, SITE, PRODUCTS, FAQ, CEYLON_VS_CASSIA } = server

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

// Pages: "/" -> index.html, "/products" -> products.html (served at /products via cleanUrls).
for (const route of ROUTES) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
  await writeFile(path.join(dist, file), await page(route))
  console.log(`  prerendered ${route.padEnd(12)} -> dist/${file}`)
}
await writeFile(path.join(dist, '404.html'), await page('/404'))
console.log('  prerendered 404          -> dist/404.html')

// sitemap.xml
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${SITE.url}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
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
`
await writeFile(path.join(dist, 'llms.txt'), llms)
console.log('  wrote sitemap.xml, robots.txt, llms.txt')

await rm(serverDir, { recursive: true, force: true })
