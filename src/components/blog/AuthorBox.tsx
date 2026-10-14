import { Link } from 'react-router-dom'
import { AUTHOR, authorPath } from '../../data/blog'
import { LinkedInIcon } from '../brand/LinkedInIcon'

/** Author credentials block (E-E-A-T): who wrote this, and where to verify them. */
export function AuthorBox() {
  return (
    <aside aria-label="About the author" className="flex flex-col gap-5 rounded-3xl border border-cinnamon/10 bg-sand/60 p-6 sm:flex-row sm:items-start sm:p-8">
      <img src={AUTHOR.image} alt={AUTHOR.name} width={96} height={96} loading="lazy" className="h-24 w-24 shrink-0 rounded-full object-cover" />
      <div>
        <p className="eyebrow">Written by</p>
        <p className="mt-1 font-display text-2xl font-semibold text-cinnamon">
          <Link to={authorPath()} className="hover:text-cinnamon-500" rel="author">
            {AUTHOR.honorific} {AUTHOR.name}
          </Link>
        </p>
        <p className="text-sm text-cinnamon/60">{AUTHOR.jobTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-cinnamon/75">{AUTHOR.bio}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={AUTHOR.linkedin} target="_blank" rel="noreferrer me" className="btn-outline !px-4 !py-2">
            <LinkedInIcon className="h-4 w-4 text-[#0A66C2]" /> Connect on LinkedIn
          </a>
          <Link to={authorPath()} className="btn-outline !px-4 !py-2">
            All articles
          </Link>
        </div>
      </div>
    </aside>
  )
}
