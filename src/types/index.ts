export type CurrencyCode = 'USD' | 'EUR' | 'GBP'

export type ProductCategory = 'quills' | 'chips' | 'powder' | 'blends'

export type ComplianceStatus = 'compliant' | 'per-lot' | 'pending'

export interface ComplianceFlags {
  pgiRegistered: boolean
  pureCeylonLionMark: boolean
  usdaOrganic: boolean
  euOrganic: boolean
  nonGmoProject: boolean
}

/** A single measurable specification line on a spec sheet. */
export interface SpecItem {
  label: string
  value: string
  /** Optional standard or method reference, e.g. "ISO 6538". */
  reference?: string
}

export interface ComplianceItem {
  label: string
  status: ComplianceStatus
  note: string
}

export interface PackOption {
  id: string
  label: string
  /** Net weight in kilograms for one unit of this pack. */
  netKg: number
  /** Indicative unit price in USD for small orders (B2C / sample shop). */
  priceUsd?: number
}

export interface Product {
  id: string
  sku: string
  name: string
  category: ProductCategory
  grade?: string
  shortDescription: string
  sensoryProfile: string
  image: string
  imageAlt: string
  /** Headline numbers used on cards and the product matrix. */
  highlights: {
    moisture: string
    volatileOil: string
    size?: string
  }
  specs: SpecItem[]
  compliance: ComplianceItem[]
  bulk: {
    moq: string
    leadTime: string
    packaging: string[]
    incoterms: string[]
    privateLabel: boolean
  }
  retailPacks: PackOption[]
  comingSoon?: boolean
}

/**
 * Per-lot traceability record. Sourcing origin is ONLY ever displayed from this
 * data (never from static marketing copy), so claims stay tied to a real lot.
 */
export interface Lot {
  lotNo: string
  productId: string
  harvestSeason: string
  /** District / region as stated on lot paperwork. Leave undefined if unverified. */
  sourcingRegion?: string
  coumarinPct?: string
  coaAvailable: boolean
  testedAt?: string
}

export type FreightPreference = 'FOB Colombo' | 'CIF Destination Port' | 'Air Freight (Samples)' | 'DAP / Courier'

export interface QuoteRequest {
  requestType: 'quote' | 'sample'
  fullName: string
  company: string
  email: string
  country: string
  productId: string
  quantity: string
  unit: 'kg' | 'MT'
  destinationPort: string
  freight: FreightPreference
  privateLabel: boolean
  notes: string
  importChecklist: string[]
}

export interface CartLine {
  productId: string
  packId: string
  qty: number
}
