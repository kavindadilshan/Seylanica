import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, MapPin, ShieldCheck } from 'lucide-react'
import { SITE } from '../../config/site'

export function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden bg-cinnamon-950 text-cream">
      {/* Decorative glows */}
      <div aria-hidden className="absolute -top-40 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-cinnamon-500/30 blur-[120px]" />
      <div aria-hidden className="absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-gold/20 blur-[120px]" />

      <div className="container-x grid items-center gap-14 py-16 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-gold-200 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {SITE.tagline}
          </p>
          <h1 className="mt-6 text-5xl leading-[0.98] font-semibold sm:text-6xl xl:text-7xl">
            True origin.
            <br />
            <span className="text-gold italic">Traceable</span> to the lot.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
            Export-grade <em>Cinnamomum verum</em> quills, chips and lab-tested powder from Sri Lanka, with a Certificate of Analysis for every
            batch and documentation built for EU, UK and US importers.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/quote" className="btn-gold px-7 py-4 text-base">
              Request B2B Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/buyer-hub" className="btn-ghost-light px-7 py-4 text-base">
              <FlaskConical className="h-4 w-4" /> View Lab Specifications
            </Link>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-cream/10 pt-8">
            {[
              ['SLS 81', 'Graded quills'],
              ['Per lot', 'COA testing'],
              ['FOB · CIF', 'Air samples'],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="font-display text-3xl font-semibold text-gold">{v}</dt>
                <dd className="mt-1 text-xs tracking-wider text-cream/55 uppercase">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Visual composition */}
        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/40 ring-1 ring-gold/20 sm:aspect-[5/6]">
            <img src="/images/sticks-powder.jpg" alt="Ceylon cinnamon quills showing their layered, paper-thin bark beside fine cinnamon powder" className="h-full w-full object-cover" fetchPriority="high" />
            <div className="absolute inset-0 bg-linear-to-t from-cinnamon-950/70 via-transparent to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 flex items-center gap-3 text-sm text-cream">
              <MapPin className="h-4 w-4 text-gold" /> Product of Sri Lanka · {SITE.exportPort}
            </div>
          </div>

          {/* Floating glass spec card */}
          <div className="absolute top-8 -left-4 w-56 animate-float rounded-2xl border border-cream/15 bg-cinnamon-950/60 p-4 shadow-xl backdrop-blur-xl sm:-left-10">
            <p className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Lot Spec · Alba</p>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                ['Moisture', '≤ 12%'],
                ['Volatile oil', '≥ 1.0%'],
                ['Quill Ø', '≤ 6 mm'],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="text-cream/60">{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute -right-3 bottom-24 flex items-center gap-3 rounded-2xl bg-cream p-3 pr-5 text-cinnamon shadow-xl sm:-right-8">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest text-gold">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold">COA per batch</span>
              <span className="block text-xs text-cinnamon/60">Coumarin verified by lab</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
