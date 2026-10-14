import { Link } from 'react-router-dom'
import { Package, Plane } from 'lucide-react'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { whatsappLink } from '../../lib/whatsapp'

export function SampleCTA() {
  return (
    <section className="py-20">
      <div className="container-x">
        <div className="grain relative isolate overflow-hidden rounded-[2.5rem] bg-cinnamon px-6 py-14 text-cream sm:px-14 sm:py-16">
          <img src="/images/hero.jpg" alt="" aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-cinnamon via-cinnamon/90 to-cinnamon/30" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow !text-gold">For verified buyers</p>
              <h2 className="mt-3 text-4xl leading-tight font-semibold sm:text-5xl">Taste the grade before you commit a container.</h2>
              <p className="mt-4 max-w-xl text-cream/75">
                Order air-freighted test samples of Alba, C5 Special, C5, C4, chips or powder, packed with the lot COA and the import documents your
                broker needs.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/quote?type=sample" className="btn-gold py-4 text-base">
                <Package className="h-5 w-5" /> Order Test Samples
              </Link>
              <a href={whatsappLink('Hello Seylanica, I would like to request test samples.')} target="_blank" rel="noreferrer" className="btn bg-[#25D366] py-4 text-base text-white hover:bg-[#1ebe5b]">
                <WhatsAppIcon /> Request on WhatsApp
              </a>
              <p className="flex items-center justify-center gap-2 text-xs text-cream/60">
                <Plane className="h-3.5 w-3.5" /> Sent by tracked air courier with the lot COA
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
