import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGrid, Table2 } from 'lucide-react'
import { CATEGORY_LABELS, PRODUCTS, getProduct } from '../../data/products'
import type { Product, ProductCategory } from '../../types'
import { ProductCard } from './ProductCard'
import { SpecSheet } from './SpecSheet'

type Filter = ProductCategory | 'all'
const FILTERS: Filter[] = ['all', 'quills', 'powder', 'chips', 'blends']

/**
 * Filterable catalog with grid / comparison-table views.
 * Opening a spec sheet syncs to `?spec=<id>` so B2B buyers can share deep links.
 */
export function ProductMatrix({ limit, showViewToggle = true }: { limit?: number; showViewToggle?: boolean }) {
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const specId = params.get('spec')
  const active = specId ? getProduct(specId) : undefined

  const items = useMemo(() => {
    const list = PRODUCTS.filter((p) => filter === 'all' || p.category === filter)
    return limit ? list.slice(0, limit) : list
  }, [filter, limit])

  const openSpecs = (p: Product) => {
    params.set('spec', p.id)
    setParams(params, { replace: true, preventScrollReset: true })
  }
  const closeSpecs = () => {
    params.delete('spec')
    setParams(params, { replace: true, preventScrollReset: true })
  }

  // Fall back to grid on small screens where the table would be cramped.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => mq.matches && setView('grid')
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter products" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f ? 'bg-cinnamon text-cream shadow-md shadow-cinnamon/20' : 'border border-cinnamon/15 bg-white text-cinnamon/75 hover:border-cinnamon/40'
              }`}
            >
              {CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>
        {showViewToggle && (
          <div className="hidden rounded-full border border-cinnamon/15 bg-white p-1 md:flex">
            {(['grid', 'table'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${view === v ? 'bg-cinnamon text-cream' : 'text-cinnamon/60'}`}
              >
                {v === 'grid' ? <LayoutGrid className="h-3.5 w-3.5" /> : <Table2 className="h-3.5 w-3.5" />}
                {v === 'grid' ? 'Cards' : 'Compare'}
              </button>
            ))}
          </div>
        )}
      </div>

      {view === 'grid' ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} onViewSpecs={openSpecs} />
          ))}
        </div>
      ) : (
        <div className="card mt-8 overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-sand text-left text-xs tracking-wider text-cinnamon-700 uppercase">
              <tr>
                {['Product', 'Grade', 'Size', 'Moisture', 'Volatile oil', 'MOQ', ''].map((h) => (
                  <th key={h} className="px-5 py-4 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cinnamon/5">
              {items.map((p) => (
                <tr key={p.id} className="transition hover:bg-cream">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-11 w-11 rounded-xl object-cover" />
                      <span className="font-semibold text-cinnamon">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">{p.grade ?? '—'}</td>
                  <td className="px-5 py-4">{p.highlights.size ?? '—'}</td>
                  <td className="px-5 py-4">{p.highlights.moisture}</td>
                  <td className="px-5 py-4">{p.highlights.volatileOil}</td>
                  <td className="px-5 py-4 font-semibold">{p.bulk.moq}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openSpecs(p)} disabled={p.comingSoon} className="font-bold text-gold-600 hover:text-cinnamon disabled:opacity-40">
                      Specs →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active && !active.comingSoon && <SpecSheet key={active.id} product={active} onClose={closeSpecs} />}
    </div>
  )
}
