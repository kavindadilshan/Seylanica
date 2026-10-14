import { Droplets, FileSearch, Ruler, Sparkles, Wind } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { CATEGORY_LABELS } from '../../data/products'

export function ProductCard({ product, onViewSpecs }: { product: Product; onViewSpecs: (p: Product) => void }) {
  const { highlights: h } = product
  return (
    <article className="group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cinnamon/15">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <img src={product.image} alt={product.imageAlt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-cinnamon-950/60 via-transparent" />
        <span className="absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold tracking-wider text-cinnamon uppercase backdrop-blur">
          {CATEGORY_LABELS[product.category]}
        </span>
        {product.grade && (
          <span className="absolute right-4 bottom-4 rounded-full bg-gold px-3 py-1 font-display text-lg leading-none font-bold text-cinnamon-950">{product.grade}</span>
        )}
        {product.comingSoon && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-cream">
            <Sparkles className="h-3 w-3" /> Coming soon
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] text-cinnamon/45">{product.sku}</p>
        <h3 className="mt-1 text-2xl leading-tight font-semibold text-cinnamon">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cinnamon/65">{product.shortDescription}</p>

        {!product.comingSoon && (
          <dl className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-sand/70 p-3 text-center">
            <div>
              <dt className="flex justify-center text-cinnamon/50">
                <Droplets className="h-4 w-4" aria-hidden />
                <span className="sr-only">Moisture</span>
              </dt>
              <dd className="mt-1 text-xs font-bold text-cinnamon">{h.moisture}</dd>
              <dd className="text-[10px] text-cinnamon/50">Moisture</dd>
            </div>
            <div>
              <dt className="flex justify-center text-cinnamon/50">
                <Wind className="h-4 w-4" aria-hidden />
                <span className="sr-only">Volatile oil</span>
              </dt>
              <dd className="mt-1 text-xs font-bold text-cinnamon">{h.volatileOil}</dd>
              <dd className="text-[10px] text-cinnamon/50">Volatile oil</dd>
            </div>
            <div>
              <dt className="flex justify-center text-cinnamon/50">
                <Ruler className="h-4 w-4" aria-hidden />
                <span className="sr-only">Size</span>
              </dt>
              <dd className="mt-1 text-xs font-bold text-cinnamon">{h.size ?? '—'}</dd>
              <dd className="text-[10px] text-cinnamon/50">Size</dd>
            </div>
          </dl>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          {product.comingSoon ? (
            <Link to={`/quote?product=${product.id}`} className="btn-gold w-full">
              Inquire for custom blends
            </Link>
          ) : (
            <>
              <button onClick={() => onViewSpecs(product)} className="btn-primary flex-1 !px-4">
                <FileSearch className="h-4 w-4" /> View Specs
              </button>
              <Link to={`/quote?product=${product.id}`} className="btn-outline flex-1 !px-4">
                Get Quote
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
