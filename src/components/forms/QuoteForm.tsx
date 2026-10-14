import { useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Mail, Package, Send } from 'lucide-react'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { PRODUCTS, getProduct } from '../../data/products'
import { SITE } from '../../config/site'
import { formatMessage, openWhatsApp } from '../../lib/whatsapp'
import type { FreightPreference, QuoteRequest } from '../../types'

const FREIGHT: FreightPreference[] = ['FOB Colombo', 'CIF Destination Port', 'Air Freight (Samples)', 'DAP / Courier']

/**
 * Import-rule checklist shown for sample requests. These are documents the buyer
 * may need for clearance; the buyer confirms which apply to their country.
 */
const IMPORT_CHECKLIST = [
  'Phytosanitary certificate (NPQS)',
  'Certificate of origin',
  'Certificate of Analysis (COA)',
  'Commercial invoice marked "Sample, no commercial value"',
  'FDA Prior Notice (USA)',
  'EU / UK importer EORI number available',
]

const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'Netherlands', 'France', 'Italy', 'Spain', 'Belgium', 'Poland', 'Sweden', 'Canada', 'Australia', 'United Arab Emirates', 'Other']

type Errors = Partial<Record<keyof QuoteRequest, string>>

function validate(f: QuoteRequest): Errors {
  const e: Errors = {}
  if (!f.fullName.trim()) e.fullName = 'Please enter your name'
  if (!f.company.trim()) e.company = 'Company name is required for B2B requests'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid business email'
  if (!f.country) e.country = 'Select a country'
  if (!f.productId) e.productId = 'Choose a product'
  if (f.requestType === 'quote' && !(Number(f.quantity) > 0)) e.quantity = 'Enter an estimated quantity'
  return e
}

export function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [params] = useSearchParams()
  const [form, setForm] = useState<QuoteRequest>(() => ({
    requestType: params.get('type') === 'sample' ? 'sample' : 'quote',
    fullName: '',
    company: '',
    email: '',
    country: '',
    productId: getProduct(params.get('product') ?? '')?.id ?? '',
    quantity: '',
    unit: 'kg',
    destinationPort: '',
    freight: params.get('type') === 'sample' ? 'Air Freight (Samples)' : 'FOB Colombo',
    privateLabel: params.get('privateLabel') === '1',
    notes: '',
    importChecklist: [],
  }))
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const isSample = form.requestType === 'sample'
  const set = <K extends keyof QuoteRequest>(k: K, v: QuoteRequest[K]) => setForm((f) => ({ ...f, [k]: v }))

  const message = useMemo(() => {
    const p = getProduct(form.productId)
    return formatMessage(isSample ? 'Sample Request – Seylanica' : 'B2B Quote Request – Seylanica', [
      ['Name', form.fullName],
      ['Company', form.company],
      ['Email', form.email],
      ['Country', form.country],
      ['Product', p ? `${p.name} (${p.sku})` : undefined],
      ['Quantity', form.quantity && `${form.quantity} ${form.unit}`],
      ['Destination port', form.destinationPort],
      ['Freight', form.freight],
      ['Private label', form.privateLabel && 'Yes'],
      ['Import documents needed', form.importChecklist.length > 0 && form.importChecklist.join(', ')],
      ['Notes', form.notes],
    ])
  }, [form, isSample])

  function submit(e: FormEvent, channel: 'whatsapp' | 'email') {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    if (channel === 'whatsapp') openWhatsApp(message)
    else window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(isSample ? 'Sample request' : 'Quote request')}&body=${encodeURIComponent(message.replace(/\*/g, ''))}`
    setSent(true)
  }

  const err = (k: keyof QuoteRequest) =>
    errors[k] ? (
      <p id={`${k}-err`} className="mt-1 text-xs font-semibold text-red-700">
        {errors[k]}
      </p>
    ) : null
  const aria = (k: keyof QuoteRequest) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  if (sent) {
    return (
      <div className="card p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-forest" />
        <h3 className="mt-4 text-3xl font-semibold text-cinnamon">Request ready to send</h3>
        <p className="mx-auto mt-2 max-w-md text-cinnamon/70">
          We've prepared your {isSample ? 'sample request' : 'quotation request'}. Press send in WhatsApp or your email app and our export team will reply,
          usually within 24 hours.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => openWhatsApp(message)} className="btn bg-[#25D366] text-white hover:bg-[#1ebe5b]">
            <WhatsAppIcon /> Open WhatsApp again
          </button>
          <button onClick={() => setSent(false)} className="btn-outline">
            Edit request
          </button>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={(e) => submit(e, 'whatsapp')} className={`card ${compact ? 'p-6 sm:p-8' : 'p-6 sm:p-10'}`}>
      {/* Request type switch */}
      <div role="radiogroup" aria-label="Request type" className="grid grid-cols-2 gap-2 rounded-2xl bg-sand p-1.5">
        {(['quote', 'sample'] as const).map((t) => (
          <button
            type="button"
            role="radio"
            aria-checked={form.requestType === t}
            key={t}
            onClick={() => setForm((f) => ({ ...f, requestType: t, freight: t === 'sample' ? 'Air Freight (Samples)' : 'FOB Colombo' }))}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
              form.requestType === t ? 'bg-white text-cinnamon shadow' : 'text-cinnamon/60 hover:text-cinnamon'
            }`}
          >
            {t === 'quote' ? <Send className="h-4 w-4" /> : <Package className="h-4 w-4" />}
            {t === 'quote' ? 'Bulk Quotation' : 'Physical Samples'}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="label">Full name *</label>
          <input id="fullName" className="field" autoComplete="name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} {...aria('fullName')} />
          {err('fullName')}
        </div>
        <div>
          <label htmlFor="company" className="label">Company name *</label>
          <input id="company" className="field" autoComplete="organization" value={form.company} onChange={(e) => set('company', e.target.value)} {...aria('company')} />
          {err('company')}
        </div>
        <div>
          <label htmlFor="email" className="label">Business email *</label>
          <input id="email" type="email" className="field" autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} {...aria('email')} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="country" className="label">Country *</label>
          <select id="country" className="field" value={form.country} onChange={(e) => set('country', e.target.value)} {...aria('country')}>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {err('country')}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="productId" className="label">Target SKU / grade *</label>
          <select id="productId" className="field" value={form.productId} onChange={(e) => set('productId', e.target.value)} {...aria('productId')}>
            <option value="">Choose a product</option>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.sku}
                {p.comingSoon ? ' (custom inquiry)' : ''}
              </option>
            ))}
          </select>
          {err('productId')}
        </div>
        <div>
          <label htmlFor="quantity" className="label">{isSample ? 'Sample size (optional)' : 'Estimated quantity *'}</label>
          <div className="flex gap-2">
            <input id="quantity" inputMode="decimal" className="field" placeholder={isSample ? 'e.g. 0.25' : 'e.g. 500'} value={form.quantity} onChange={(e) => set('quantity', e.target.value.replace(/[^\d.]/g, ''))} {...aria('quantity')} />
            <select aria-label="Unit" className="field !w-28" value={form.unit} onChange={(e) => set('unit', e.target.value as QuoteRequest['unit'])}>
              <option value="kg">KG</option>
              <option value="MT">MT</option>
            </select>
          </div>
          {err('quantity')}
        </div>
        <div>
          <label htmlFor="port" className="label">Destination port / city</label>
          <input id="port" className="field" placeholder="e.g. Rotterdam, Felixstowe, New York" value={form.destinationPort} onChange={(e) => set('destinationPort', e.target.value)} />
        </div>

        <fieldset className="sm:col-span-2">
          <legend className="label">Freight preference</legend>
          <div className="grid gap-2 sm:grid-cols-4">
            {FREIGHT.map((f) => (
              <label
                key={f}
                className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-xs font-bold transition ${
                  form.freight === f ? 'border-gold bg-gold/10 text-cinnamon' : 'border-cinnamon/15 bg-white text-cinnamon/65 hover:border-cinnamon/35'
                }`}
              >
                <input type="radio" name="freight" className="sr-only" checked={form.freight === f} onChange={() => set('freight', f)} />
                {f}
              </label>
            ))}
          </div>
        </fieldset>

        {isSample && (
          <fieldset className="rounded-2xl border border-dashed border-cinnamon/20 bg-cream p-5 sm:col-span-2">
            <legend className="px-2 text-sm font-bold text-cinnamon">Destination import checklist</legend>
            <p className="mb-3 text-xs text-cinnamon/60">Tick the documents your customs broker needs. We'll include them with your samples where applicable.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {IMPORT_CHECKLIST.map((item) => (
                <label key={item} className="flex cursor-pointer items-start gap-2.5 text-sm text-cinnamon/80">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-cinnamon"
                    checked={form.importChecklist.includes(item)}
                    onChange={(e) => set('importChecklist', e.target.checked ? [...form.importChecklist, item] : form.importChecklist.filter((i) => i !== item))}
                  />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
          <input type="checkbox" className="h-4 w-4 accent-cinnamon" checked={form.privateLabel} onChange={(e) => set('privateLabel', e.target.checked)} />
          <span className="text-sm font-semibold text-cinnamon">I'm interested in private-label packaging</span>
        </label>

        <div className="sm:col-span-2">
          <label htmlFor="notes" className="label">Notes</label>
          <textarea id="notes" rows={compact ? 3 : 4} className="field resize-none" placeholder="Packing, cut length, mesh size, target price, certifications required…" value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn flex-1 bg-[#25D366] py-3.5 text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#1ebe5b]">
          <WhatsAppIcon /> Send via WhatsApp
        </button>
        <button type="button" onClick={(e) => submit(e, 'email')} className="btn-outline flex-1 py-3.5">
          <Mail className="h-4 w-4" /> Send via Email
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-cinnamon/50">
        Your details are only used to answer this request. WhatsApp: {SITE.whatsappDisplay}
      </p>
    </form>
  )
}
