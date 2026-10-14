import { useSearchParams } from 'react-router-dom'
import { Clock, FileCheck2, Globe } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { QuoteForm } from '../components/forms/QuoteForm'

export default function QuotePage() {
  const [params] = useSearchParams()
  const isSample = params.get('type') === 'sample'

  return (
    <>
      <PageHero
        image="/images/spice-bowls.jpg"
        eyebrow={isSample ? 'Sample Request' : 'B2B Quotation'}
        title={isSample ? 'Order test samples for your QA team.' : 'Request a bulk quotation.'}
        intro="Complete the form and send it straight to our export desk on WhatsApp or email."
      />
      <section className="py-16 sm:py-20">
        {/* key: remount when switching between quote and sample links so defaults reset */}
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_320px]">
          <QuoteForm key={params.toString()} />
          <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            {[
              { icon: Clock, title: 'Fast response', text: 'Quotes are usually returned within 24 hours (Sri Lanka time, GMT+5:30).' },
              { icon: FileCheck2, title: 'Documents up front', text: 'Spec sheet and current lot COA shared before you confirm.' },
              { icon: Globe, title: 'Export-ready', text: 'Experienced with EU, UK and US import requirements.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-cinnamon/10 bg-white p-5">
                <Icon className="h-6 w-6 shrink-0 text-gold-600" />
                <div>
                  <p className="font-bold text-cinnamon">{title}</p>
                  <p className="mt-1 text-sm text-cinnamon/60">{text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </>
  )
}
