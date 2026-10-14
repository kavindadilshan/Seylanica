import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { PostMeta } from '../../types/blog'
import { blogPath, categoryPath, formatDate, getCategory, postImage, postImageAlt } from '../../data/blog'

export function PostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  const cat = getCategory(post.category)
  return (
    <article className={`card group flex flex-col overflow-hidden ${featured ? 'lg:grid lg:grid-cols-[1.1fr_1fr]' : 'h-full'}`}>
      {/* Featured: the image fills the text column's height instead of setting it. */}
      <Link
        to={blogPath(post.slug)}
        className={`relative block aspect-[16/10] overflow-hidden ${featured ? 'lg:aspect-auto lg:min-h-80' : ''}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={postImage(post)}
          alt={postImageAlt(post)}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
      <div className={`flex flex-1 flex-col ${featured ? 'p-7 sm:p-9' : 'p-6'}`}>
        {cat && (
          <Link to={categoryPath(cat.slug)} className="eyebrow self-start hover:text-cinnamon">
            {cat.name}
          </Link>
        )}
        <h3 className={`mt-2 font-semibold text-cinnamon ${featured ? 'text-3xl leading-tight sm:text-4xl' : 'text-2xl leading-snug'}`}>
          <Link to={blogPath(post.slug)} className="hover:text-cinnamon-500">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cinnamon/65">{post.description}</p>
        <p className="mt-auto flex items-center gap-3 pt-5 text-xs text-cinnamon/50">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readingMinutes} min read
          </span>
        </p>
      </div>
    </article>
  )
}
