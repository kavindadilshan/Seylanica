import { Link, useParams } from 'react-router-dom'
import { PageHero } from '../components/ui/PageHero'
import { PostCard } from '../components/blog/PostCard'
import { TradeUpdates } from '../components/blog/TradeUpdates'
import { BLOG_CATEGORIES, categoryPath, getCategory, postsInCategory } from '../data/blog'
import NotFoundPage from './NotFoundPage'

export default function BlogCategoryPage() {
  const { category = '' } = useParams()
  const cat = getCategory(category)
  if (!cat) return <NotFoundPage />
  const posts = postsInCategory(cat.slug)

  return (
    <>
      <PageHero image={cat.image} eyebrow="Knowledge Hub" title={cat.name} intro={cat.description} />
      <section className="py-16">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-cinnamon/55">
            <Link to="/" className="hover:text-cinnamon">
              Home
            </Link>{' '}
            /{' '}
            <Link to="/blog" className="hover:text-cinnamon">
              Blog
            </Link>{' '}
            / <span className="text-cinnamon">{cat.name}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-6 sm:grid-cols-2">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <TradeUpdates compact />
              <div className="card p-6">
                <p className="eyebrow">Other topics</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {BLOG_CATEGORIES.filter((c) => c.slug !== cat.slug).map((c) => (
                    <li key={c.slug}>
                      <Link to={categoryPath(c.slug)} className="font-semibold text-cinnamon/75 hover:text-cinnamon">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
