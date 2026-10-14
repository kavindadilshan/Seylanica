import type { PostBody } from '../types/blog'

/* Article bodies are compiled at build time and split into one lazy chunk each. */
const loaders = import.meta.glob<{ default: PostBody }>(['../content/blog/*.md', '!../content/blog/README.md'])
const bySlug = new Map(Object.entries(loaders).map(([file, load]) => [file.split('/').pop()!.replace(/\.md$/, ''), load]))
const cache = new Map<string, Promise<PostBody>>()

/** Stable promise per article, for React's use(): suspends until the chunk has loaded. */
export function loadPostBody(slug: string): Promise<PostBody> {
  let p = cache.get(slug)
  if (!p) {
    const load = bySlug.get(slug)
    p = load ? load().then((m) => m.default) : Promise.reject(new Error(`No article "${slug}"`))
    cache.set(slug, p)
  }
  return p
}
