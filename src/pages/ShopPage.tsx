import { useState, type FormEvent } from 'react'
import { CreditCard, Lock, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { WhatsAppIcon } from '../components/brand/WhatsAppIcon'
import { PRODUCTS, getProduct } from '../data/products'
import { useCart, unitPriceUsd } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { formatMessage, openWhatsApp } from '../lib/whatsapp'
import type { Product } from '../types'

const SHOP_PRODUCTS = PRODUCTS.filter((p) => p.retailPacks.length > 0)

function ShopItem({ product }: { product: Product }) {
  const { add } = useCart()
  const { price } = useCurrency()
  const [packId, setPackId] = useState(product.retailPacks[0].id)
  const [added, setAdded] = useState(false)
  const pack = product.retailPacks.find((p) => p.id === packId)!

  return (
    <article className="card flex flex-col overflow-hidden">
      <img src={product.image} alt={product.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl leading-tight font-semibold text-cinnamon">{product.name}</h3>
        <p className="mt-1 text-sm text-cinnamon/60">{product.sensoryProfile}</p>
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Pack size">
          {product.retailPacks.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={p.id === packId}
              onClick={() => setPackId(p.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${p.id === packId ? 'border-cinnamon bg-cinnamon text-cream' : 'border-cinnamon/15 text-cinnamon/70 hover:border-cinnamon/40'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="font-display text-3xl font-semibold text-cinnamon">{price(pack.priceUsd ?? 0)}</p>
          <button
            onClick={() => {
              add(product.id, packId)
              setAdded(true)
              window.setTimeout(() => setAdded(false), 1400)
            }}
            className={`btn !px-5 ${added ? 'bg-forest text-cream' : 'bg-gold text-cinnamon-950 hover:bg-gold-200'}`}
          >
            <ShoppingBag className="h-4 w-4" /> {added ? 'Added' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

function Cart() {
  const { lines, setQty, remove, subtotalUsd, clear } = useCart()
  const { price, currency } = useCurrency()
  const [details, setDetails] = useState({ name: '', email: '', country: '', address: '' })
  const [error, setError] = useState('')

  function checkout(e: FormEvent) {
    e.preventDefault()
    if (!details.name.trim() || !details.country.trim() || !details.address.trim()) {
      setError('Please add your name, country and delivery address.')
      return
    }
    setError('')
    const items = lines
      .map((l) => {
        const p = getProduct(l.productId)
        const pack = p?.retailPacks.find((x) => x.id === l.packId)
        return `${l.qty} × ${p?.name} – ${pack?.label} @ ${price(unitPriceUsd(l))}`
      })
      .join('\n')
    openWhatsApp(
      formatMessage(
        'New Order – Seylanica Shop',
        [
          ['Name', details.name],
          ['Email', details.email],
          ['Country', details.country],
          ['Delivery address', details.address],
          ['Currency', currency],
          ['Subtotal', price(subtotalUsd)],
        ],
        `*Items:*\n${items}\n\nPlease confirm shipping cost and payment link.`,
      ),
    )
  }

  if (lines.length === 0) {
    return (
      <div className="card p-8 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-cinnamon/30" />
        <p className="mt-3 font-semibold text-cinnamon">Your cart is empty</p>
        <p className="mt-1 text-sm text-cinnamon/55">Add retail packs to check out via WhatsApp.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <ul className="divide-y divide-cinnamon/10">
        {lines.map((l) => {
          const p = getProduct(l.productId)
          const pack = p?.retailPacks.find((x) => x.id === l.packId)
          if (!p || !pack) return null
          return (
            <li key={`${l.productId}-${l.packId}`} className="flex gap-3 p-4">
              <img src={p.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-cinnamon">{p.name}</p>
                <p className="text-xs text-cinnamon/55">
                  {pack.label} · {price(unitPriceUsd(l))}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button aria-label="Decrease quantity" onClick={() => setQty(l.productId, l.packId, l.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full border border-cinnamon/15 hover:bg-sand">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                  <button aria-label="Increase quantity" onClick={() => setQty(l.productId, l.packId, l.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full border border-cinnamon/15 hover:bg-sand">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button aria-label="Remove item" onClick={() => remove(l.productId, l.packId)} className="ml-auto text-cinnamon/40 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="space-y-1 border-t border-cinnamon/10 bg-sand/60 p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-cinnamon/60">Subtotal</span>
          <span className="font-bold text-cinnamon">{price(subtotalUsd)}</span>
        </div>
        <div className="flex justify-between text-xs text-cinnamon/55">
          <span>Shipping & duties</span>
          <span>Confirmed on WhatsApp</span>
        </div>
        <button onClick={clear} className="pt-1 text-xs font-semibold text-cinnamon/50 underline hover:text-cinnamon">
          Clear cart
        </button>
      </div>

      <form onSubmit={checkout} className="space-y-3 p-4">
        <p className="text-xs font-bold tracking-wider text-cinnamon-700 uppercase">Delivery details</p>
        <input className="field" placeholder="Full name *" autoComplete="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
        <input className="field" type="email" placeholder="Email" autoComplete="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
        <input className="field" placeholder="Country *" autoComplete="country-name" value={details.country} onChange={(e) => setDetails({ ...details, country: e.target.value })} />
        <textarea className="field resize-none" rows={2} placeholder="Delivery address *" autoComplete="street-address" value={details.address} onChange={(e) => setDetails({ ...details, address: e.target.value })} />
        {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
        <button type="submit" className="btn w-full bg-[#25D366] py-3.5 text-white hover:bg-[#1ebe5b]">
          <WhatsAppIcon /> Checkout on WhatsApp
        </button>
        {/*
          PAYMENT GATEWAY HOOK
          To enable card payments, create a Stripe Checkout Session on a server
          (never expose the secret key in this frontend) with `currency` set to
          the selected display currency, then redirect to session.url here.
          Sri Lanka options: PayHere, or Stripe via a supported entity.
        */}
        <button type="button" disabled className="btn-outline w-full" title="Card payments coming soon">
          <CreditCard className="h-4 w-4" /> Pay by card (coming soon)
        </button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-cinnamon/50">
          <Lock className="h-3 w-3" /> Prices shown in {currency}. Final invoice confirmed by our team.
        </p>
      </form>
    </div>
  )
}

export default function ShopPage() {
  return (
    <>
      <PageHero
        image="/images/powder-jar.jpg"
        eyebrow="Small Order Portal"
        title="Retail & trade packs, shipped worldwide."
        intro="For chefs, niche retailers and spice lovers. Switch currency in the header, then check out on WhatsApp and we'll confirm shipping and payment."
      />
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-6 sm:grid-cols-2">
            {SHOP_PRODUCTS.map((p) => (
              <ShopItem key={p.id} product={p} />
            ))}
          </div>
          <aside id="cart" className="scroll-mt-28 lg:sticky lg:top-28 lg:self-start">
            <h2 className="mb-4 text-3xl font-semibold text-cinnamon">Your cart</h2>
            <Cart />
          </aside>
        </div>
      </section>
    </>
  )
}
