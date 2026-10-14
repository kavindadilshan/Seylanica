import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { Boxes, CheckCircle2, ClipboardList, Clock, FileText, FlaskConical, Hourglass, Printer, Ship, Tag, X } from 'lucide-react'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import type { ComplianceStatus, Product } from '../../types'
import { lotsFor } from '../../data/lots'
import { openWhatsApp } from '../../lib/whatsapp'

const STATUS_STYLE: Record<ComplianceStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  compliant: { label: 'Compliant', cls: 'bg-forest-100 text-forest', icon: CheckCircle2 },
  'per-lot': { label: 'Tested per lot', cls: 'bg-gold/20 text-cinnamon', icon: FlaskConical },
  pending: { label: 'Pending', cls: 'bg-sand text-cinnamon/70 border border-dashed border-cinnamon/25', icon: Hourglass },
}

type Tab = 'specs' | 'compliance' | 'commercial' | 'lots'

const TABS: { id: Tab; label: string; icon: typeof ClipboardList }[] = [
  { id: 'specs', label: 'Specifications', icon: ClipboardList },
  { id: 'compliance', label: 'Compliance', icon: CheckCircle2 },
  { id: 'commercial', label: 'MOQ & Shipping', icon: Ship },
  { id: 'lots', label: 'Lot Traceability', icon: Tag },
]

/**
 * Interactive B2B specification sheet, rendered as an accessible modal dialog.
 * "Print / Save PDF" uses the browser's print dialog so buyers get a clean sheet
 * without us hosting static PDFs that could drift out of date.
 */
export function SpecSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('specs')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lots = lotsFor(product.id)

  useEffect(() => {
    const d = dialogRef.current
    d?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const requestDoc = (doc: string) =>
    openWhatsApp(`Hello Seylanica, please send the ${doc} for ${product.name} (SKU ${product.sku}).`)

  // Portalled to <body> so the print stylesheet can hide the page behind the sheet.
  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      aria-labelledby="spec-title"
      className="m-auto max-h-[92dvh] w-[min(980px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl bg-cream p-0 text-ink shadow-2xl backdrop:bg-cinnamon-950/70 backdrop:backdrop-blur-sm print:max-h-none print:w-full print:shadow-none"
    >
      <div className="flex max-h-[92dvh] flex-col print:max-h-none">
        {/* Header */}
        <header className="grain relative flex gap-5 bg-cinnamon p-5 text-cream sm:p-7">
          <img src={product.image} alt={product.imageAlt} className="hidden h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-gold/40 sm:block" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">Specification Sheet · {product.sku}</p>
            <h2 id="spec-title" className="mt-1 text-3xl leading-tight font-semibold sm:text-4xl">
              {product.name}
            </h2>
            <p className="mt-1 text-sm text-cream/70 italic">Cinnamomum verum · Product of Sri Lanka</p>
          </div>
          <button onClick={() => dialogRef.current?.close()} aria-label="Close specification sheet" className="no-print grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream/10 hover:bg-cream/20">
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Tabs */}
        <div role="tablist" className="no-print flex gap-1 overflow-x-auto border-b border-cinnamon/10 bg-white px-3 sm:px-5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-semibold transition ${
                tab === id ? 'border-gold text-cinnamon' : 'border-transparent text-cinnamon/50 hover:text-cinnamon'
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {tab === 'specs' && (
            <div className="space-y-6">
              <p className="text-sm text-cinnamon/75">
                <strong className="text-cinnamon">Sensory profile:</strong> {product.sensoryProfile}
              </p>
              <div className="overflow-hidden rounded-2xl border border-cinnamon/10 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-sand text-left text-xs tracking-wider text-cinnamon-700 uppercase">
                    <tr>
                      <th className="px-4 py-3 font-bold">Parameter</th>
                      <th className="px-4 py-3 font-bold">Typical value</th>
                      <th className="hidden px-4 py-3 font-bold sm:table-cell">Method / Ref.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cinnamon/5">
                    {product.specs.map((s) => (
                      <tr key={s.label} className="hover:bg-cream">
                        <td className="px-4 py-3 font-semibold text-cinnamon">{s.label}</td>
                        <td className="px-4 py-3">{s.value}</td>
                        <td className="hidden px-4 py-3 text-cinnamon/60 sm:table-cell">{s.reference ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Compliance: specs are indicative; the lot COA is the binding document. */}
              <p className="rounded-xl bg-gold/10 px-4 py-3 text-xs text-cinnamon/80">
                Values are indicative for the grade. Binding results are stated on the Certificate of Analysis issued for each export lot.
              </p>
            </div>
          )}

          {tab === 'compliance' && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.compliance.length === 0 && <li className="text-sm text-cinnamon/60">Compliance documentation will be issued with the final formulation.</li>}
              {product.compliance.map((c) => {
                const s = STATUS_STYLE[c.status]
                return (
                  <li key={c.label} className="rounded-2xl border border-cinnamon/10 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-cinnamon">{c.label}</p>
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.cls}`}>
                        <s.icon className="h-3.5 w-3.5" /> {s.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-cinnamon/65">{c.note}</p>
                  </li>
                )
              })}
            </ul>
          )}

          {tab === 'commercial' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Boxes, label: 'Minimum order', value: product.bulk.moq },
                { icon: Clock, label: 'Lead time', value: product.bulk.leadTime },
                { icon: Ship, label: 'Incoterms', value: product.bulk.incoterms.join(' · ') },
                { icon: Tag, label: 'Private label', value: product.bulk.privateLabel ? 'Available' : 'Not offered for this grade' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 rounded-2xl border border-cinnamon/10 bg-white p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-cinnamon/55 uppercase">{label}</p>
                    <p className="mt-0.5 font-semibold text-cinnamon">{value}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-cinnamon/10 bg-white p-4 sm:col-span-2">
                <p className="text-xs font-bold tracking-wider text-cinnamon/55 uppercase">Packaging options</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {product.bulk.packaging.map((p) => (
                    <li key={p} className="rounded-full bg-sand px-3 py-1.5 text-sm text-cinnamon">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'lots' && (
            <div className="space-y-3">
              {lots.length === 0 && <p className="text-sm text-cinnamon/60">No open lots listed. Contact us for current availability.</p>}
              {lots.map((l) => (
                <div key={l.lotNo} className="grid gap-3 rounded-2xl border border-cinnamon/10 bg-white p-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-cinnamon/55">Lot no.</p>
                    <p className="font-mono text-sm font-bold text-cinnamon">{l.lotNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cinnamon/55">Harvest</p>
                    <p className="text-sm font-semibold">{l.harvestSeason}</p>
                  </div>
                  <div>
                    {/* Origin is shown only from verified lot data, never from static copy. */}
                    <p className="text-xs text-cinnamon/55">Sourcing region</p>
                    <p className="text-sm font-semibold">{l.sourcingRegion ?? 'Sri Lanka · per COA'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cinnamon/55">Coumarin</p>
                    <p className="text-sm font-semibold">{l.coumarinPct ? `${l.coumarinPct} (lot COA)` : 'Per COA'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <footer className="no-print flex flex-col gap-3 border-t border-cinnamon/10 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="btn-outline !px-4 !py-2.5">
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button onClick={() => requestDoc('lot Certificate of Analysis (COA)')} className="btn-outline !px-4 !py-2.5">
              <FileText className="h-4 w-4" /> Request COA
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => requestDoc('price quotation and availability')} className="btn !px-4 !py-2.5 bg-[#25D366] text-white hover:bg-[#1ebe5b]">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </button>
            <Link to={`/quote?product=${product.id}`} className="btn-primary !px-5 !py-2.5">
              Request B2B Quote
            </Link>
          </div>
        </footer>
      </div>
    </dialog>,
    document.body,
  )
}
