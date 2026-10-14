import { useMemo, useState, type FormEvent } from 'react'
import { Anchor, Container, Download, FileCheck2, FileText, Plane, ShieldAlert, Ship } from 'lucide-react'
import { PageHero } from '../components/ui/PageHero'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SpecSheet } from '../components/product/SpecSheet'
import { WhatsAppIcon } from '../components/brand/WhatsAppIcon'
import { PRODUCTS, getProduct } from '../data/products'
import { formatMessage, openWhatsApp } from '../lib/whatsapp'
import type { FreightPreference, Product } from '../types'

const SPEC_PRODUCTS = PRODUCTS.filter((p) => !p.comingSoon)

/** Downloads a product's spec table as CSV for buyers' procurement / QA systems. */
function downloadSpecCsv(p: Product) {
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
  const rows = [['Parameter', 'Typical value', 'Method / Ref.'], ...p.specs.map((s) => [s.label, s.value, s.reference ?? ''])]
  rows.push(['Note', 'Indicative values. Binding results per lot Certificate of Analysis.', ''])
  const blob = new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: `${p.sku}-spec-sheet.csv` })
  a.click()
  URL.revokeObjectURL(url)
}

/*
 * Rough container fill guide (net kg) for planning only. Real loadability depends on
 * packing and is confirmed on the proforma invoice.
 */
const CONTAINER_KG: Record<Product['category'], number> = { quills: 7000, chips: 9000, powder: 14000, blends: 5000 }

const INCOTERMS: { id: FreightPreference; icon: typeof Ship; title: string; text: string }[] = [
  { id: 'FOB Colombo', icon: Anchor, title: 'FOB Colombo', text: 'We clear export and load on your nominated vessel. You control freight and insurance.' },
  { id: 'CIF Destination Port', icon: Ship, title: 'CIF Destination', text: 'We book sea freight and insurance to your port. You handle import clearance.' },
  { id: 'Air Freight (Samples)', icon: Plane, title: 'Air Freight', text: 'For samples and urgent small lots. Door delivery available by courier.' },
]

function ShippingEstimator() {
  const [productId, setProductId] = useState(SPEC_PRODUCTS[0].id)
  const [qty, setQty] = useState('2000')
  const [unit, setUnit] = useState<'kg' | 'MT'>('kg')
  const [incoterm, setIncoterm] = useState<FreightPreference>('FOB Colombo')
  const [port, setPort] = useState('')

  const product = getProduct(productId)!
  const kg = (Number(qty) || 0) * (unit === 'MT' ? 1000 : 1)
  const estimate = useMemo(() => {
    if (!kg) return null
    if (incoterm === 'Air Freight (Samples)' || kg < 1000) return { mode: 'Air freight / LCL consolidation', detail: 'Below a full container: we consolidate (LCL) or send by air.' }
    const per = CONTAINER_KG[product.category]
    const n = kg / per
    if (n <= 1) return { mode: n < 0.6 ? 'LCL (shared container)' : "1 × 20' FCL", detail: `≈ ${Math.round(n * 100)}% of a 20 ft container` }
    return { mode: `${Math.ceil(n)} × 20' FCL (or ${Math.ceil(n / 2)} × 40')`, detail: `≈ ${(kg / 1000).toFixed(1)} MT net` }
  }, [kg, incoterm, product.category])

  function submit(e: FormEvent) {
    e.preventDefault()
    openWhatsApp(
      formatMessage('Shipping Inquiry – Seylanica', [
        ['Product', `${product.name} (${product.sku})`],
        ['Quantity', `${qty} ${unit}`],
        ['Incoterm', incoterm],
        ['Destination port', port || 'TBC'],
        ['Planning estimate', estimate?.mode],
      ]),
    )
  }

  return (
    <form onSubmit={submit} className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          {INCOTERMS.map(({ id, icon: Icon, title, text }) => (
            <label key={id} className={`cursor-pointer rounded-2xl border p-4 transition ${incoterm === id ? 'border-gold bg-gold/10' : 'border-cinnamon/10 hover:border-cinnamon/30'}`}>
              <input type="radio" name="incoterm" className="sr-only" checked={incoterm === id} onChange={() => setIncoterm(id)} />
              <Icon className="h-5 w-5 text-gold-600" />
              <p className="mt-2 text-sm font-bold text-cinnamon">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-cinnamon/60">{text}</p>
            </label>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ship-product" className="label">Product</label>
            <select id="ship-product" className="field" value={productId} onChange={(e) => setProductId(e.target.value)}>
              {SPEC_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ship-qty" className="label">Quantity</label>
            <div className="flex gap-2">
              <input id="ship-qty" inputMode="decimal" className="field" value={qty} onChange={(e) => setQty(e.target.value.replace(/[^\d.]/g, ''))} />
              <select aria-label="Unit" className="field !w-24" value={unit} onChange={(e) => setUnit(e.target.value as 'kg' | 'MT')}>
                <option value="kg">KG</option>
                <option value="MT">MT</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="ship-port" className="label">Destination port</label>
            <input id="ship-port" className="field" placeholder="e.g. Hamburg" value={port} onChange={(e) => setPort(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-3xl bg-forest p-6 text-cream">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Planning estimate</p>
          <div className="mt-4 flex items-center gap-3">
            <Container className="h-9 w-9 text-gold" />
            <p className="font-display text-3xl leading-tight font-semibold">{estimate?.mode ?? 'Enter a quantity'}</p>
          </div>
          {estimate && <p className="mt-2 text-sm text-cream/70">{estimate.detail}</p>}
          <dl className="mt-6 space-y-2 border-t border-cream/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-cream/60">MOQ for this grade</dt>
              <dd className="font-semibold">{product.bulk.moq}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream/60">Lead time</dt>
              <dd className="text-right font-semibold">{product.bulk.leadTime}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[11px] text-cream/50">Indicative planning guide only. Freight is quoted live per inquiry.</p>
        </div>
        <button type="submit" className="btn mt-6 bg-[#25D366] text-white hover:bg-[#1ebe5b]">
          <WhatsAppIcon /> Get freight quote
        </button>
      </div>
    </form>
  )
}

export default function BuyerHubPage() {
  const [specProduct, setSpecProduct] = useState<Product | null>(null)
  const [dossierId, setDossierId] = useState(SPEC_PRODUCTS[0].id)
  const dossierProduct = getProduct(dossierId)!

  const requestDoc = (doc: string) => openWhatsApp(`Hello Seylanica, please send the ${doc} for ${dossierProduct.name} (SKU ${dossierProduct.sku}).`)

  return (
    <>
      <PageHero
        image="/images/powder.jpg"
        eyebrow="B2B Buyer Hub"
        title="Everything your QA and procurement teams need."
        intro="Interactive spec sheets, a quality dossier per SKU, and shipping planning for FOB, CIF and air freight."
      />

      {/* Spec sheet viewer */}
      <section className="py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Spec Sheet Viewer" title="Open any product's technical specification" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SPEC_PRODUCTS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSpecProduct(p)}
                className="group card flex items-center gap-4 p-4 text-left transition hover:-translate-y-0.5 hover:border-gold/50"
              >
                <img src={p.image} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[11px] text-cinnamon/45">{p.sku}</span>
                  <span className="block truncate font-bold text-cinnamon">{p.name.replace('Ceylon Cinnamon ', '')}</span>
                  <span className="block text-xs text-cinnamon/55">
                    Moisture {p.highlights.moisture} · Oil {p.highlights.volatileOil}
                  </span>
                </span>
                <FileText className="h-5 w-5 text-gold-600 transition group-hover:scale-110" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quality dossier */}
      <section className="bg-sand py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Quality Dossier"
            title="Download & request documents"
            intro="Spec sheets download instantly. COAs and SDS are issued per lot, so we send the current document for the lot you'll receive rather than a generic file."
          />
          <div className="card p-6 sm:p-8">
            <label htmlFor="dossier" className="label">Product</label>
            <select id="dossier" className="field" value={dossierId} onChange={(e) => setDossierId(e.target.value)}>
              {SPEC_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ul className="mt-6 divide-y divide-cinnamon/10">
              <li className="flex items-center gap-4 py-4">
                <FileText className="h-6 w-6 shrink-0 text-cinnamon" />
                <div className="flex-1">
                  <p className="font-bold text-cinnamon">Specification Sheet</p>
                  <p className="text-xs text-cinnamon/55">CSV for procurement systems, or print to PDF</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadSpecCsv(dossierProduct)} className="btn-primary !px-4 !py-2 text-xs">
                    <Download className="h-3.5 w-3.5" /> CSV
                  </button>
                  <button onClick={() => setSpecProduct(dossierProduct)} className="btn-outline !px-4 !py-2 text-xs">
                    PDF
                  </button>
                </div>
              </li>
              <li className="flex items-center gap-4 py-4">
                <FileCheck2 className="h-6 w-6 shrink-0 text-cinnamon" />
                <div className="flex-1">
                  <p className="font-bold text-cinnamon">Certificate of Analysis (sample / lot)</p>
                  <p className="text-xs text-cinnamon/55">Issued by lab for each export lot</p>
                </div>
                <button onClick={() => requestDoc('sample Certificate of Analysis (COA)')} className="btn-outline !px-4 !py-2 text-xs">
                  Request
                </button>
              </li>
              <li className="flex items-center gap-4 py-4">
                <ShieldAlert className="h-6 w-6 shrink-0 text-cinnamon" />
                <div className="flex-1">
                  <p className="font-bold text-cinnamon">Safety Data Sheet (SDS)</p>
                  <p className="text-xs text-cinnamon/55">Handling, storage & dust guidance</p>
                </div>
                <button onClick={() => requestDoc('Safety Data Sheet (SDS)')} className="btn-outline !px-4 !py-2 text-xs">
                  Request
                </button>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section id="shipping" className="scroll-mt-28 py-20">
        <div className="container-x">
          <SectionHeading eyebrow="Incoterms & Shipping" title="Plan your shipment" intro="Pick your Incoterm and volume for an instant container planning estimate, then send it to our export desk for a live freight quote." />
          <div className="mt-10">
            <ShippingEstimator />
          </div>
        </div>
      </section>

      {specProduct && <SpecSheet key={specProduct.id} product={specProduct} onClose={() => setSpecProduct(null)} />}
    </>
  )
}
