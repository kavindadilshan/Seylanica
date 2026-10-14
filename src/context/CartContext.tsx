import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '../types'
import { readStore, writeStore } from '../lib/storage'
import { getProduct } from '../data/products'

interface CartCtx {
  lines: CartLine[]
  count: number
  subtotalUsd: number
  add: (productId: string, packId: string, qty?: number) => void
  setQty: (productId: string, packId: string, qty: number) => void
  remove: (productId: string, packId: string) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)
const same = (l: CartLine, productId: string, packId: string) => l.productId === productId && l.packId === packId

export function unitPriceUsd(line: CartLine) {
  return getProduct(line.productId)?.retailPacks.find((p) => p.id === line.packId)?.priceUsd ?? 0
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty so prerendered HTML hydrates cleanly, then restore before first paint.
  const [lines, setLines] = useState<CartLine[]>([])
  const [loaded, setLoaded] = useState(false)
  useLayoutEffect(() => {
    setLines(readStore<CartLine[]>('sey.cart', []))
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (loaded) writeStore('sey.cart', lines)
  }, [lines, loaded])

  const value = useMemo<CartCtx>(() => {
    const setQty = (productId: string, packId: string, qty: number) =>
      setLines((ls) => (qty <= 0 ? ls.filter((l) => !same(l, productId, packId)) : ls.map((l) => (same(l, productId, packId) ? { ...l, qty } : l))))
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotalUsd: lines.reduce((s, l) => s + unitPriceUsd(l) * l.qty, 0),
      add: (productId, packId, qty = 1) =>
        setLines((ls) =>
          ls.some((l) => same(l, productId, packId))
            ? ls.map((l) => (same(l, productId, packId) ? { ...l, qty: l.qty + qty } : l))
            : [...ls, { productId, packId, qty }],
        ),
      setQty,
      remove: (productId, packId) => setQty(productId, packId, 0),
      clear: () => setLines([]),
    }
  }, [lines])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
