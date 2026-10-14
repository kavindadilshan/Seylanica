import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { PostCard } from '../blog/PostCard'
import { POSTS } from '../../data/blog'

/** Homepage entry into the Knowledge Hub: fresh content signals and internal links to the newest articles. */
export function LatestArticles() {
  if (!POSTS.length) return null
  return (
    <section className="py-24">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Knowledge Hub" title="Guides for cinnamon buyers" intro="Grades, lab testing, export paperwork and sourcing strategy, explained by our team." />
          <Link to="/blog" className="btn-outline shrink-0">
            All {POSTS.length} articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.slice(0, 3).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
