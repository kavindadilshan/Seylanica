import { Link } from 'react-router-dom'
import { Mail, MapPin } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { FacebookIcon } from '../brand/FacebookIcon'
import { NAV_LINKS, SITE } from '../../config/site'
import { BLOG_CATEGORIES, categoryPath } from '../../data/blog'
import { whatsappLink } from '../../lib/whatsapp'

export function Footer() {
  return (
    <footer className="no-print grain relative bg-cinnamon-950 text-cream/75">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-md text-sm leading-relaxed">
            Export-grade True Ceylon Cinnamon (<em>Cinnamomum verum</em>): whole quills, chips and lab-tested powder, traceable lot by lot from
            Sri Lankan growers to your warehouse.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a href={whatsappLink('Hello Seylanica, I would like to place an order.')} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:bg-[#1ebe5b]">
              <WhatsAppIcon /> Order on WhatsApp
            </a>
            <a href={SITE.facebookUrl} target="_blank" rel="noreferrer" aria-label="Seylanica on Facebook" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition hover:border-gold hover:text-gold">
              <FacebookIcon />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/quote" className="hover:text-gold">
                Request a Quote
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="hover:text-gold">
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <FacebookIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={SITE.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-gold">
                facebook.com/Seylanica
              </a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {SITE.country}
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x border-t border-cream/10 py-8">
        <h3 className="font-sans text-xs font-bold tracking-[0.2em] text-gold uppercase">Knowledge Hub</h3>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {BLOG_CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to={categoryPath(c.slug)} className="hover:text-gold">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-cream/10">
        {/* Compliance disclaimer: keeps all product statements factual and lot-bound. */}
        <div className="container-x flex flex-col gap-3 pt-6 pb-24 text-xs text-cream/50 md:flex-row md:items-center md:justify-between md:pr-56 md:pb-6">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            Specifications shown are indicative. Binding values are stated on each lot's Certificate of Analysis. Product information is not
            intended to diagnose, treat, cure or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  )
}
