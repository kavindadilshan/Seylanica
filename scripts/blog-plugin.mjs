/*
 * BLOG CONTENT PIPELINE (Vite plugin)
 * ------------------------------------------------------------------
 * Articles live in src/content/blog/<slug>.md with a small YAML-style
 * frontmatter block (see src/content/blog/README.md for the format).
 *
 *  - `virtual:blog` exports POSTS: metadata for every article, newest first.
 *    It is small and used for listings, sitemap, RSS and structured data.
 *  - Importing a .md file returns { html, toc, keyTakeaways, faq }, compiled
 *    at build time with `marked`, so no Markdown parser ships to the browser.
 *    Each article becomes its own lazy chunk.
 *
 * Images: drop a photo at public/images/blog/<slug>.(webp|jpg|jpeg|png) and it is
 * picked up automatically on the next build/dev reload; no code or frontmatter
 * change needed. Without one, the article uses its category's default image.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { Marked } from 'marked'

const VIRTUAL_ID = 'virtual:blog'
const RESOLVED_ID = '\0' + VIRTUAL_ID
const IMAGE_EXTS = ['webp', 'jpg', 'jpeg', 'png']
const WORDS_PER_MINUTE = 230

const unquote = (s) => s.trim().replace(/^(['"])(.*)\1$/, '$2')

/** Parses the frontmatter subset we use: scalars, `- item` lists and `- q: / a:` lists. */
export function parseFrontmatter(raw, file) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) throw new Error(`${file}: missing --- frontmatter block`)
  const data = {}
  let listKey = null
  let current = null
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const top = line.match(/^([A-Za-z][\w]*):\s*(.*)$/)
    if (top) {
      const [, key, value] = top
      listKey = value === '' ? key : null
      data[key] = value === '' ? [] : unquote(value)
      continue
    }
    const item = line.match(/^\s+-\s+(.*)$/)
    if (item && listKey) {
      const kv = item[1].match(/^([a-z]+):\s*(.*)$/)
      if (kv) {
        current = { [kv[1]]: unquote(kv[2]) }
        data[listKey].push(current)
      } else {
        current = null
        data[listKey].push(unquote(item[1]))
      }
      continue
    }
    const cont = line.match(/^\s+([a-z]+):\s*(.*)$/)
    if (cont && current) {
      current[cont[1]] = unquote(cont[2])
      continue
    }
    throw new Error(`${file}: cannot parse frontmatter line "${line}"`)
  }
  return { data, body: m[2] }
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"')

function compile(body) {
  const marked = new Marked({ gfm: true })
  let html = marked.parse(body)
  const toc = []
  // Anchor ids on h2/h3 for the table of contents and deep links.
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const id = slugify(inner)
    if (level === '2') toc.push({ id, text: stripTags(inner) })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
  // Horizontal scroll wrapper so wide tables never break the mobile layout.
  html = html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>')
  // External links open in a new tab.
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"')
  return { html, toc }
}

export function blogPlugin({ root = process.cwd() } = {}) {
  const contentDir = path.join(root, 'src/content/blog')
  const imageDir = path.join(root, 'public/images/blog')

  const realImage = (slug) => {
    for (const ext of IMAGE_EXTS) if (existsSync(path.join(imageDir, `${slug}.${ext}`))) return `/images/blog/${slug}.${ext}`
    return undefined
  }

  const loadIndex = () => {
    const files = readdirSync(contentDir).filter((f) => f.endsWith('.md') && f !== 'README.md')
    const posts = files.map((file) => {
      const slug = file.replace(/\.md$/, '')
      const { data, body } = parseFrontmatter(readFileSync(path.join(contentDir, file), 'utf8'), file)
      for (const key of ['title', 'description', 'category', 'date']) {
        if (!data[key]) throw new Error(`${file}: frontmatter "${key}" is required`)
      }
      const wordCount = body.split(/\s+/).filter(Boolean).length
      return {
        slug,
        title: data.title,
        description: data.description,
        category: data.category,
        date: data.date,
        updated: data.updated || undefined,
        tags: typeof data.tags === 'string' ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        image: data.image || realImage(slug),
        imageAlt: data.imageAlt || undefined,
        wordCount,
        readingMinutes: Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE)),
      }
    })
    return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)))
  }

  return {
    name: 'seylanica-blog',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      // Dev reloads on article/image changes are handled by configureServer below.
      if (id === RESOLVED_ID) return `export const POSTS = ${JSON.stringify(loadIndex())}`
    },
    transform(code, id) {
      const file = id.split('?')[0]
      if (!file.endsWith('.md') || file.endsWith('README.md') || !path.resolve(file).startsWith(contentDir)) return
      const { data, body } = parseFrontmatter(code, path.basename(file))
      const { html, toc } = compile(body)
      const out = { html, toc, keyTakeaways: data.keyTakeaways ?? [], faq: data.faq ?? [] }
      return { code: `export default ${JSON.stringify(out)}`, map: null }
    },
    configureServer(server) {
      // New/removed articles or images: rebuild the index and reload the page.
      const refresh = (f) => {
        if (!f.startsWith(contentDir) && !f.startsWith(imageDir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.add(imageDir)
      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
      server.watcher.on('change', (f) => f.startsWith(contentDir) && refresh(f))
    },
  }
}
