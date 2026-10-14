import { Factory, FlaskConical, Package, Sprout, Stamp } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const STEPS = [
  { icon: Sprout, title: 'Farm & Sourcing', text: 'Bark harvested from Cinnamomum verum gardens following GAP. Lot number assigned at intake.' },
  { icon: Factory, title: 'Processing & Milling', text: 'Peeled, rolled and sun/shade dried by skilled peelers; graded under SLS 81 and milled in hygienic conditions.' },
  { icon: FlaskConical, title: 'Lab Batch Testing', text: 'Moisture, volatile oil, ash, microbiology, pesticide and heavy metals tested; COA issued per lot.' },
  { icon: Stamp, title: 'Export Clearance', text: 'NPQS phytosanitary inspection, certificate of origin and Sri Lanka Customs clearance at Colombo.' },
  { icon: Package, title: 'Buyer Delivery', text: 'Shipped FOB, CFR or CIF by sea, or by air for samples, with full document pack.' },
]

/** Visual infographic: Farm → Processing → Lab → Export → Buyer. */
export function TraceabilityFlow() {
  return (
    <section className="relative overflow-hidden bg-forest py-24 text-cream">
      <img src="/images/plantation.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-linear-to-b from-forest via-forest/90 to-forest" />
      <div className="container-x relative">
        <SectionHeading
          light
          align="center"
          eyebrow="Traceability"
          title={
            <>
              From garden to your warehouse, <span className="text-gold italic">documented</span>.
            </>
          }
          intro="Every consignment carries its lot number through each stage, so your QA team can trace any bag back to its batch tests."
        />

        <ol className="relative mt-16 grid gap-6 md:grid-cols-5 md:gap-4">
          {/* connector line */}
          <div aria-hidden className="absolute top-8 right-[10%] left-[10%] hidden h-px bg-linear-to-r from-gold/0 via-gold/60 to-gold/0 md:block" />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 110} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
                <span className="relative z-10 grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-forest-700 text-gold shadow-lg shadow-black/20">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-gold text-xs font-bold text-cinnamon-950">{i + 1}</span>
                </span>
                <div>
                  <h3 className="font-sans text-base font-bold md:mt-5">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
