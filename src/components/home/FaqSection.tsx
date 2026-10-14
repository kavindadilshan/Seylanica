import { ChevronDown } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { FAQ } from '../../data/faq'

/**
 * Buyer FAQ. Uses native <details> so every answer is in the HTML (crawlable and
 * quotable) even while collapsed. Mirrors the FAQPage structured data in seo/meta.ts.
 */
export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-28 py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          eyebrow="FAQ"
          title="Ceylon cinnamon, answered."
          intro="Straight answers to the questions importers, brands and blenders ask us most."
        />
        <div className="divide-y divide-cinnamon/10 rounded-3xl border border-cinnamon/10 bg-white shadow-sm">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-sans text-base font-bold text-cinnamon [&::-webkit-details-marker]:hidden">
                <h3>{f.q}</h3>
                <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-cinnamon/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
