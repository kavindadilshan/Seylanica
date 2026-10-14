import { useId, useState, type FormEvent } from 'react'
import { BellRing } from 'lucide-react'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { openWhatsApp } from '../../lib/whatsapp'

/**
 * Lead capture: buyers opt in to harvest, availability and price updates.
 * No backend needed: the opt-in lands in the export team's WhatsApp with the
 * buyer's details, ready to add to a broadcast list or CRM.
 */
export function TradeUpdates({ compact = false }: { compact?: boolean }) {
  const id = useId()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [interest, setInterest] = useState('Quills')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    openWhatsApp(
      `Hello Seylanica, please add me to your trade updates (harvest, availability and price news).\n\nName: ${name}\nCompany: ${company || '-'}\nInterested in: ${interest}`,
    )
  }
  return (
    <form onSubmit={submit} className={`grain rounded-3xl bg-forest text-cream ${compact ? 'p-6' : 'p-7 sm:p-9'}`}>
      <BellRing className="h-7 w-7 text-gold" />
      <p className={`mt-3 font-display font-semibold ${compact ? 'text-2xl' : 'text-3xl'}`}>Get trade updates</p>
      <p className="mt-2 text-sm text-cream/70">Harvest outlook, grade availability and price movements, sent to buyers a few times a season.</p>
      <div className="mt-5 space-y-3">
        <label className="sr-only" htmlFor={`${id}-name`}>
          Your name
        </label>
        <input id={`${id}-name`} required className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="sr-only" htmlFor={`${id}-co`}>
          Company
        </label>
        <input id={`${id}-co`} className="field" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)} />
        <label className="sr-only" htmlFor={`${id}-int`}>
          Interested in
        </label>
        <select id={`${id}-int`} className="field" value={interest} onChange={(e) => setInterest(e.target.value)}>
          {['Quills', 'Powder', 'Chips', 'Private label', 'Everything'].map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn mt-4 w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]">
        <WhatsAppIcon className="h-4 w-4" /> Subscribe on WhatsApp
      </button>
    </form>
  )
}
