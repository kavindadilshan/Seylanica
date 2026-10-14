import { Link } from 'react-router-dom'
import { ArrowRight, Check, X } from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { TrustBanner } from '../components/home/TrustBanner'
import { TraceabilityFlow } from '../components/home/TraceabilityFlow'
import { SampleCTA } from '../components/home/SampleCTA'
import { FaqSection } from '../components/home/FaqSection'
import { LatestArticles } from '../components/home/LatestArticles'
import { ProductMatrix } from '../components/product/ProductMatrix'
import { QuoteForm } from '../components/forms/QuoteForm'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Reveal } from '../components/ui/Reveal'
import { WhatsAppIcon } from '../components/brand/WhatsAppIcon'
import { CEYLON_VS_CASSIA } from '../data/comparison'
import { SITE } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'

const BUYER_TYPES = [
  { title: 'Importers & Distributors', text: 'Container loads of graded quills and chips, FOB Colombo or CIF your port, with full document packs.' },
  { title: 'Spice Retailers & Brands', text: 'Alba and C5 Special in cut sticks or fine powder, with private-label tubes, pouches and jars.' },
  { title: 'Tea Blenders & Manufacturers', text: 'Dust-extracted tea-cut chips and steam-sterilised powder, consistent lot to lot.' },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBanner />

      {/* Product matrix */}
      <section className="py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Catalog"
              title={
                <>
                  Graded, specified, <span className="text-cinnamon-500 italic">ready to ship</span>.
                </>
              }
              intro="Filter by format and open any spec sheet for moisture, volatile oil, compliance status and MOQ."
            />
            <Link to="/products" className="btn-outline shrink-0">
              Full catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ProductMatrix limit={6} showViewToggle={false} />
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-sand py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <img src="/images/plantation.jpg" alt="Sunlit hillside plantation in Sri Lanka" loading="lazy" className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-xl" />
            <img
              src="/images/quills-white.jpg"
              alt="Cinnamon quills"
              loading="lazy"
              className="absolute -right-4 -bottom-10 hidden w-44 rounded-3xl border-8 border-sand object-cover shadow-xl sm:block lg:-right-10"
            />
          </Reveal>
          <div>
            <SectionHeading eyebrow="Built for B2B" title="One origin. Three kinds of buyer." />
            <div className="mt-8 space-y-4">
              {BUYER_TYPES.map((b, i) => (
                <Reveal key={b.title} delay={i * 100}>
                  <div className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
                    <span className="font-display text-3xl font-semibold text-gold">0{i + 1}</span>
                    <div>
                      <h3 className="font-sans text-base font-bold text-cinnamon">{b.title}</h3>
                      <p className="mt-1 text-sm text-cinnamon/65">{b.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TraceabilityFlow />

      {/* Ceylon vs Cassia teaser */}
      <section className="py-24">
        <div className="container-x">
          <SectionHeading
            align="center"
            eyebrow="Know your cinnamon"
            title="True Ceylon vs Cassia"
            intro="Most cinnamon traded worldwide is cassia. Here is how genuine Cinnamomum verum differs."
          />
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-3xl border border-cinnamon/10 bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_1fr] bg-cinnamon text-cream sm:grid-cols-[0.8fr_1fr_1fr]">
              <div className="hidden p-4 text-xs font-bold tracking-wider uppercase sm:block" />
              <div className="flex items-center gap-2 p-4 font-display text-xl font-semibold">
                <Check className="h-5 w-5 text-gold" /> Ceylon
              </div>
              <div className="flex items-center gap-2 p-4 font-display text-xl font-semibold text-cream/70">
                <X className="h-5 w-5" /> Cassia
              </div>
            </div>
            {CEYLON_VS_CASSIA.slice(2).map((r) => (
              <div key={r.attribute} className="grid grid-cols-2 border-t border-cinnamon/5 text-sm sm:grid-cols-[0.8fr_1fr_1fr]">
                <div className="col-span-2 bg-sand/60 px-4 pt-3 text-xs font-bold tracking-wider text-cinnamon-700 uppercase sm:col-span-1 sm:bg-transparent sm:py-4">{r.attribute}</div>
                <div className="px-4 py-3 font-semibold text-cinnamon sm:py-4">{r.ceylon}</div>
                <div className="px-4 py-3 text-cinnamon/55 sm:py-4">{r.cassia}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link to="/quality" className="font-semibold text-cinnamon underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-600">
              Read about our testing & origin protocols →
            </Link>
          </p>
        </div>
      </section>

      <SampleCTA />

      <FaqSection />

      <LatestArticles />

      {/* Inquiry form */}
      <section id="inquiry" className="bg-sand py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Inquiry"
              title="Tell us what you need. We'll quote within 24 hours."
              intro="Share your grade, volume and destination. Your request is sent straight to our export desk on WhatsApp or email."
            />
            <ul className="mt-8 space-y-3 text-sm text-cinnamon/80">
              {['Grade-specific pricing by volume tier', 'FOB / CFR / CIF and air options', 'Lot COA shared before confirmation', 'Private label & custom cut lengths'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-forest text-gold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <a href={whatsappLink('Hello Seylanica, I have a B2B inquiry.')} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white p-4 pr-6 shadow-sm transition hover:shadow-md">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366] text-white">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-xs text-cinnamon/55">Prefer to chat?</span>
                <span className="block font-bold text-cinnamon">{SITE.whatsappDisplay}</span>
              </span>
            </a>
          </div>
          <QuoteForm compact />
        </div>
      </section>
    </>
  )
}
