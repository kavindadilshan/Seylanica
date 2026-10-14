import { Link } from 'react-router-dom'
import { AUTHOR, BLOG_CATEGORIES, POSTS, blogPath, formatDate, postsInCategory } from '../data/blog'
import { LinkedInIcon } from '../components/brand/LinkedInIcon'

/** Author profile (E-E-A-T): identity, credentials link and the full list of articles. */
export default function AuthorPage() {
  return (
    <>
      <section className="grain bg-cinnamon-950 text-cream">
        <div className="container-x flex flex-col items-start gap-8 py-16 sm:flex-row sm:items-center sm:py-20">
          <img src={AUTHOR.image} alt={AUTHOR.name} width={160} height={160} className="h-40 w-40 rounded-full object-cover ring-4 ring-gold/40" />
          <div className="max-w-2xl">
            <p className="eyebrow !text-gold">Author</p>
            <h1 className="mt-2 text-5xl font-semibold sm:text-6xl">
              {AUTHOR.honorific} {AUTHOR.name}
            </h1>
            <p className="mt-2 text-gold-200">{AUTHOR.jobTitle}</p>
            <p className="mt-4 leading-relaxed text-cream/75">{AUTHOR.bio}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a href={AUTHOR.linkedin} target="_blank" rel="noreferrer me" className="btn bg-[#0A66C2] text-white hover:bg-[#0958a8]">
                <LinkedInIcon className="h-4 w-4" /> LinkedIn profile
              </a>
              <span className="text-sm text-cream/60">{POSTS.length} articles published</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          {BLOG_CATEGORIES.map((c) => {
            const posts = postsInCategory(c.slug)
            if (!posts.length) return null
            return (
              <div key={c.slug}>
                <h2 className="text-2xl font-semibold text-cinnamon">{c.name}</h2>
                <ul className="mt-4 space-y-3">
                  {posts.map((p) => (
                    <li key={p.slug}>
                      <Link to={blogPath(p.slug)} className="font-semibold text-cinnamon/85 hover:text-cinnamon-500">
                        {p.title}
                      </Link>
                      <time dateTime={p.date} className="block text-xs text-cinnamon/45">
                        {formatDate(p.date)}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
