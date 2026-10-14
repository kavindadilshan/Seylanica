import { Bug, Droplets, FlaskConical, HandHeart, Microscope, ScanSearch, ShieldCheck, Sprout, Stamp, Thermometer } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { ComplianceBadges } from '../components/ui/ComplianceBadges'
import { Reveal } from '../components/ui/Reveal'
import { CEYLON_VS_CASSIA } from '../data/comparison'

const COA_TESTS = [
  { icon: Droplets, title: 'Moisture', text: 'ISO 939 distillation method. Keeps quills stable in transit and storage.' },
  { icon: FlaskConical, title: 'Volatile oil', text: 'ISO 6571. The key indicator of aroma strength and grade quality.' },
  { icon: ScanSearch, title: 'Ash & foreign matter', text: 'Total and acid-insoluble ash (ISO 928/930) and extraneous matter (ISO 927).' },
  { icon: Microscope, title: 'Microbiology', text: 'TPC, yeast & mould, E. coli and Salmonella per batch of powder.' },
  { icon: Bug, title: 'Pesticides & heavy metals', text: 'Screened against EU MRLs and contaminant limits by accredited labs.' },
  { icon: Thermometer, title: 'Coumarin (HPLC)', text: 'Reported as a measured value on the COA, never as a general claim.' },
]

const PROTOCOLS = [
  { icon: Sprout, title: 'Good Agricultural Practices', text: 'Sourcing from growers following GAP, with lot numbers assigned at intake.' },
  { icon: HandHeart, title: 'Hygienic processing', text: 'Clean peeling sheds, covered drying, food-grade packing materials and pest control, aligned with ISO 22000 / GMP principles.' },
  { icon: ShieldCheck, title: 'Release control', text: 'No lot is released for export until its COA is within specification.' },
  { icon: Stamp, title: 'NPQS phytosanitary', text: 'Each consignment is inspected by the National Plant Quarantine Service and issued a phytosanitary certificate.' },
]

export default function QualityPage() {
  return (
    <>
      <PageHero
        image="/images/plantation.jpg"
        eyebrow="Quality & Origin"
        title="Transparency you can put in your QA file."
        intro="What makes cinnamon 'Ceylon', how we test every batch, and the controls between the garden and the port of Colombo."
      />

      {/* Ceylon vs Cassia */}
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Botany"
              title="True Ceylon cinnamon vs Cassia"
              intro="Both are sold as 'cinnamon', but they are different species with different structure, flavour and natural coumarin content."
            />
            <img src="/images/sticks-powder.jpg" alt="Cross-section of Ceylon cinnamon quills showing many thin rolled layers" loading="lazy" className="mt-8 aspect-[4/3] w-full rounded-3xl object-cover shadow-lg" />
            <p className="mt-3 text-xs text-cinnamon/55">Ceylon quills are made of many thin rolled layers, visible at the cut end.</p>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="bg-cinnamon text-left text-cream">
                  <th className="p-4 text-xs tracking-wider uppercase">Attribute</th>
                  <th className="p-4 font-display text-xl font-semibold">
                    Ceylon <span className="block font-sans text-xs font-normal text-gold-200 italic">C. verum</span>
                  </th>
                  <th className="p-4 font-display text-xl font-semibold text-cream/70">
                    Cassia <span className="block font-sans text-xs font-normal italic">C. cassia</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinnamon/5">
                {CEYLON_VS_CASSIA.map((r) => (
                  <tr key={r.attribute}>
                    <th scope="row" className="p-4 text-left text-xs font-bold tracking-wider text-cinnamon-700 uppercase">
                      {r.attribute}
                    </th>
                    <td className="p-4 font-semibold text-cinnamon">{r.ceylon}</td>
                    <td className="p-4 text-cinnamon/55">{r.cassia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* COA */}
      <section className="bg-sand py-20">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Batch COA" title="What every Certificate of Analysis covers" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COA_TESTS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="card h-full p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cinnamon text-gold">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-sans text-lg font-bold text-cinnamon">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-cinnamon/65">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Protocols */}
      <section className="py-20">
        <div className="container-x grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="Protocols" title="Hygiene, processing & export controls" intro="The checks that sit behind every Seylanica shipment." />
          <ol className="space-y-4">
            {PROTOCOLS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-cinnamon/10 bg-white p-5">
                <Icon className="h-6 w-6 shrink-0 text-forest" />
                <div>
                  <h3 className="font-sans font-bold text-cinnamon">{title}</h3>
                  <p className="mt-1 text-sm text-cinnamon/65">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cinnamon-950 py-16">
        <div className="container-x">
          <p className="eyebrow mb-6 text-center !text-gold">Current status</p>
          <ComplianceBadges dark />
          <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-cream/50">
            Certification marks are displayed only once the relevant certificate is held and verified. Product information is factual and is not a
            health or medical claim.
          </p>
        </div>
      </section>
    </>
  )
}
