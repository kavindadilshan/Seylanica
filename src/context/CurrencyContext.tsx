import { createContext, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import type { CurrencyCode } from '../types'
import { readStore, writeStore } from '../lib/storage'
import { formatPrice } from '../lib/currency'

interface CurrencyCtx {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  price: (usd: number) => string
}

const Ctx = createContext<CurrencyCtx | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Start from the default so prerendered HTML hydrates cleanly, then restore before first paint.
  const [currency, setCurrency] = useState<CurrencyCode>('USD')
  const [loaded, setLoaded] = useState(false)
  useLayoutEffect(() => {
    setCurrency(readStore<CurrencyCode>('sey.currency', 'USD'))
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (loaded) writeStore('sey.currency', currency)
  }, [currency, loaded])

  return <Ctx.Provider value={{ currency, setCurrency, price: (usd) => formatPrice(usd, currency) }}>{children}</Ctx.Provider>
}

export function useCurrency() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}
