import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, Package, ShoppingBag, X } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { FacebookIcon } from '../brand/FacebookIcon'
import { NAV_LINKS, SITE } from '../../config/site'
import { useCurrency } from '../../context/CurrencyContext'
import { useCart } from '../../context/CartContext'
import { whatsappLink } from '../../lib/whatsapp'
import type { CurrencyCode } from '../../types'

const CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP']

function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()
  return (
    <div role="radiogroup" aria-label="Display currency" className="flex rounded-full border border-cinnamon/15 bg-white/70 p-0.5 text-xs font-bold">
      {CURRENCIES.map((c) => (
        <button
          key={c}
          role="radio"
          aria-checked={currency === c}
          onClick={() => setCurrency(c)}
          className={`rounded-full px-2.5 py-1.5 transition ${currency === c ? 'bg-cinnamon text-cream' : 'text-cinnamon/70 hover:text-cinnamon'}`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count } = useCart()
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="no-print sticky top-0 z-40">
      {/* Utility bar */}
      <div className="hidden bg-cinnamon-950 text-cream/80 md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p>
            Exporting <em className="font-display text-sm text-gold-200 not-italic">Cinnamomum verum</em> from {SITE.exportPort} to the EU, UK & USA
          </p>
          <div className="flex items-center gap-4">
            <a href={whatsappLink('Hello Seylanica, I have an inquiry.')} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold">
              <WhatsAppIcon className="h-3.5 w-3.5" /> Orders on WhatsApp: {SITE.whatsappDisplay}
            </a>
            <a href={SITE.facebookUrl} target="_blank" rel="noreferrer" aria-label="Seylanica on Facebook" className="hover:text-gold">
              <FacebookIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className={`border-b transition-all duration-300 ${scrolled ? 'border-cinnamon/10 bg-cream/90 shadow-sm backdrop-blur-xl' : 'border-transparent bg-cream'}`}>
        <div className="container-x flex h-18 items-center justify-between gap-4">
          <Link to="/" aria-label={`${SITE.brand} home`}>
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-semibold transition ${isActive ? 'bg-cinnamon/8 text-cinnamon' : 'text-cinnamon/70 hover:text-cinnamon'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <CurrencyToggle />
            </div>
            <Link to="/shop#cart" aria-label={`Cart, ${count} items`} className="relative grid h-10 w-10 place-items-center rounded-full text-cinnamon hover:bg-cinnamon/5">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-cinnamon-950">{count}</span>
              )}
            </Link>
            <Link to="/quote?type=sample" className="btn-primary hidden !px-5 !py-2.5 md:inline-flex">
              <Package className="h-4 w-4" /> Request Samples
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="grid h-10 w-10 place-items-center rounded-full text-cinnamon hover:bg-cinnamon/5 lg:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`grid overflow-hidden transition-all duration-300 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="min-h-0">
            <nav aria-label="Mobile" className="container-x flex flex-col gap-1 pt-2 pb-6">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) => `rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-cinnamon text-cream' : 'text-cinnamon hover:bg-cinnamon/5'}`}
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-3 flex items-center justify-between gap-3">
                <CurrencyToggle />
                <a href={SITE.facebookUrl} target="_blank" rel="noreferrer" aria-label="Seylanica on Facebook" className="grid h-10 w-10 place-items-center rounded-full text-cinnamon hover:bg-cinnamon/5">
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <Link to="/quote?type=sample" className="btn-primary !px-5 !py-2.5">
                  <Package className="h-4 w-4" /> Request Samples
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
