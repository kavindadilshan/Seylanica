import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { PostCard } from '../components/blog/PostCard'
import { TradeUpdates } from '../components/blog/TradeUpdates'
import { BLOG_CATEGORIES, POSTS, categoryPath, postsInCategory } from '../data/blog'

export default function BlogPage() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = useMemo(
    () => (q ? POSTS.filter((p) => `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase().includes(q)) : []),
    [q],
  )
  const [featured, ...latest] = POSTS

  return (
    <>
      <PageHero
        image="/images/leaves.jpg"
        eyebrow="Knowledge Hub"
        title="The Ceylon cinnamon trade, explained."
        intro={`${POSTS.length} practical guides on grades, lab testing, export paperwork, sourcing and building a cinnamon business, written for importers, brands and food makers.`}
      />

      <section className="border-b border-cinnamon/10 bg-sand/60 py-6">
        <div className="container-x flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Blog categories" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
            {BLOG_CATEGORIES.map((c) => (
              <Link key={c.slug} to={categoryPath(c.slug)} className="shrink-0 rounded-full border border-cinnamon/15 bg-white px-4 py-2 text-sm font-semibold text-cinnamon/80 transition hover:border-gold hover:text-cinnamon">
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="relative lg:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-cinnamon/40" />
            <label htmlFor="blog-search" className="sr-only">
              Search articles
            </label>
            <input id="blog-search" type="search" className="field !pl-11" placeholder="Search articles…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </section>

      {q ? (
        <section className="py-16">
          <div className="container-x">
            <h2 className="text-3xl font-semibold text-cinnamon">
              {results.length} {results.length === 1 ? 'article' : 'articles'} for “{query.trim()}”
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="py-16">
            <div className="container-x grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-8">
                {featured && <PostCard post={featured} featured />}
                <div className="grid gap-6 sm:grid-cols-2">
                  {latest.slice(0, 4).map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              </div>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <TradeUpdates compact />
              </div>
            </div>
          </section>

          {BLOG_CATEGORIES.map((c, i) => {
            const posts = postsInCategory(c.slug)
            if (!posts.length) return null
            return (
              <section key={c.slug} className={`py-16 ${i % 2 === 0 ? 'bg-sand' : ''}`}>
                <div className="container-x">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div className="max-w-2xl">
                      <p className="eyebrow">{posts.length} articles</p>
                      <h2 className="mt-2 text-4xl font-semibold text-cinnamon">
                        <Link to={categoryPath(c.slug)} className="hover:text-cinnamon-500">
                          {c.name}
                        </Link>
                      </h2>
                      <p className="mt-2 text-cinnamon/65">{c.description}</p>
                    </div>
                    <Link to={categoryPath(c.slug)} className="btn-outline shrink-0">
                      View all <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.slice(0, 3).map((p) => (
                      <PostCard key={p.slug} post={p} />
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </>
      )}
    </>
  )
}
