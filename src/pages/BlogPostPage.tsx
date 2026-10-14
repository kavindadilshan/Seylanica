import { use, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CalendarDays, ChevronDown, Clock, Lightbulb, Package } from 'lucide-react'
import { AUTHOR, authorPath, blogPath, categoryPath, formatDate, getCategory, getPost, postImage, postImageAlt, relatedPosts } from '../data/blog'
import { loadPostBody } from '../lib/blogContent'
import { SITE } from '../config/site'
import { PostCard } from '../components/blog/PostCard'
import { AuthorBox } from '../components/blog/AuthorBox'
import { ShareButtons } from '../components/blog/ShareButtons'
import { ArticleCta } from '../components/blog/ArticleCta'
import { TradeUpdates } from '../components/blog/TradeUpdates'
import { WhatsAppIcon } from '../components/brand/WhatsAppIcon'
import { whatsappLink } from '../lib/whatsapp'
import NotFoundPage from './NotFoundPage'

export default function BlogPostPage() {
  const { slug = '' } = useParams()
  const post = getPost(slug)
  if (!post) return <NotFoundPage />
  return <Article slug={slug} />
}

function Article({ slug }: { slug: string }) {
  const post = getPost(slug)!
  const body = use(loadPostBody(slug))
  const cat = getCategory(post.category)
  const navigate = useNavigate()
  const url = `${SITE.url}${blogPath(slug)}`

  // Article HTML is static markup: route internal links through the SPA router.
  const onBodyClick = (e: MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest('a')
    const href = a?.getAttribute('href')
    if (!a || !href || !href.startsWith('/') || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    navigate(href)
  }

  // FAQ structured data travels with the article so it is present in the prerendered HTML.
  const faqLd = body.faq.length
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: body.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      })
    : null

  return (
    <article>
      <header className="bg-sand/70">
        <div className="container-x max-w-4xl pt-10 pb-12 sm:pt-14">
          <nav aria-label="Breadcrumb" className="text-sm text-cinnamon/55">
            <Link to="/" className="hover:text-cinnamon">
              Home
            </Link>{' '}
            /{' '}
            <Link to="/blog" className="hover:text-cinnamon">
              Blog
            </Link>
            {cat && (
              <>
                {' '}
                /{' '}
                <Link to={categoryPath(cat.slug)} className="hover:text-cinnamon">
                  {cat.name}
                </Link>
              </>
            )}
          </nav>
          {cat && (
            <Link to={categoryPath(cat.slug)} className="eyebrow mt-6 inline-block hover:text-cinnamon">
              {cat.name}
            </Link>
          )}
          <h1 className="mt-3 text-4xl leading-[1.05] font-semibold text-cinnamon sm:text-5xl lg:text-6xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-cinnamon/70">{post.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-cinnamon/60">
            <Link to={authorPath()} rel="author" className="flex items-center gap-2.5 font-semibold text-cinnamon hover:text-cinnamon-500">
              <img src={AUTHOR.image} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
              {AUTHOR.honorific} {AUTHOR.name}
            </Link>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            {post.updated && post.updated !== post.date && (
              <span>
                Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingMinutes} min read
            </span>
          </div>
        </div>
      </header>

      <div className="container-x max-w-6xl">
        <img src={postImage(post)} alt={postImageAlt(post)} className="-mt-2 aspect-[21/9] w-full rounded-3xl object-cover shadow-xl" />
      </div>

      <div className="container-x grid max-w-6xl gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {body.keyTakeaways.length > 0 && (
            <section aria-labelledby="takeaways" className="mb-10 rounded-3xl border border-gold/40 bg-gold/10 p-6 sm:p-7">
              <h2 id="takeaways" className="flex items-center gap-2 font-sans text-sm font-bold tracking-[0.18em] text-gold-600 uppercase">
                <Lightbulb className="h-4 w-4" /> Key takeaways
              </h2>
              <ul className="mt-4 space-y-2.5">
                {body.keyTakeaways.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-cinnamon/85">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" />
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="prose-article" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: body.html }} />

          {body.faq.length > 0 && (
            <section aria-labelledby="faq" className="mt-12">
              <h2 id="faq" className="text-3xl font-semibold text-cinnamon">
                Frequently asked questions
              </h2>
              <div className="mt-5 divide-y divide-cinnamon/10 rounded-3xl border border-cinnamon/10 bg-white">
                {body.faq.map((f) => (
                  <details key={f.q} className="group p-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-sans font-bold text-cinnamon [&::-webkit-details-marker]:hidden">
                      <h3>{f.q}</h3>
                      <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-cinnamon/75">{f.a}</p>
                  </details>
                ))}
              </div>
              {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqLd.replace(/</g, '\\u003c') }} />}
            </section>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-cinnamon/10 py-5">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-cinnamon/70">
                  #{t}
                </span>
              ))}
            </div>
            <ShareButtons url={url} title={post.title} />
          </div>

          <div className="mt-10 space-y-10">
            <AuthorBox />
            {cat && <ArticleCta productId={cat.productId} topic={post.title} />}
          </div>
        </div>

        <aside className="hidden space-y-6 lg:sticky lg:top-28 lg:block lg:self-start">
          {body.toc.length > 1 && (
            <nav aria-label="On this page" className="card p-6">
              <p className="eyebrow">On this page</p>
              <ol className="mt-3 space-y-2 text-sm">
                {body.toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-cinnamon/70 hover:text-cinnamon">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className="card p-6">
            <p className="font-display text-2xl font-semibold text-cinnamon">Buying Ceylon cinnamon?</p>
            <p className="mt-2 text-sm text-cinnamon/65">Get a quote within 24 hours, or test the grade with samples first.</p>
            <Link to="/quote" className="btn-primary mt-4 w-full !py-2.5">
              Request a quote
            </Link>
            <Link to="/quote?type=sample" className="btn-outline mt-2 w-full !py-2.5">
              <Package className="h-4 w-4" /> Samples
            </Link>
            <a href={whatsappLink(`Hello Seylanica, a question about "${post.title}": `)} target="_blank" rel="noreferrer" className="btn mt-2 w-full bg-[#25D366] !py-2.5 text-white hover:bg-[#1ebe5b]">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <TradeUpdates compact />
        </aside>
      </div>

      <RelatedArticles slug={slug} />
    </article>
  )
}

function RelatedArticles({ slug }: { slug: string }) {
  const related = relatedPosts(getPost(slug)!)
  if (!related.length) return null
  return (
    <section aria-labelledby="related" className="bg-sand py-16">
      <div className="container-x">
        <h2 id="related" className="text-4xl font-semibold text-cinnamon">
          Keep reading
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
