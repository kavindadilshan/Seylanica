import type { ComplianceItem, Product, SpecItem } from '../types'

/*
 * PRODUCT CATALOG
 * ------------------------------------------------------------------
 * Values are INDICATIVE TYPICAL SPECIFICATIONS for each grade.
 * The binding values for any shipment are those on the lot's Certificate of
 * Analysis (COA). Keep wording factual: no medical or health-benefit claims.
 *
 * Grade sizing follows the Sri Lanka Standard SLS 81:2021 grading scheme.
 * TODO: confirm every figure against your current lab reports before launch.
 */

const BOTANICAL: SpecItem = { label: 'Botanical name', value: 'Cinnamomum verum J.Presl (syn. C. zeylanicum)' }
const ORIGIN: SpecItem = { label: 'Country of origin', value: 'Sri Lanka' }

/** Shared compliance lines. "per-lot" means it is tested and reported on each lot's COA. */
const STANDARD_COMPLIANCE: ComplianceItem[] = [
  { label: 'Pesticide residues', status: 'per-lot', note: 'Screened against EU MRLs (Reg. (EC) 396/2005); results on lot COA.' },
  { label: 'Heavy metals (Pb, Cd, Hg, As)', status: 'per-lot', note: 'Tested against EU Reg. (EU) 2023/915 limits.' },
  { label: 'Phytosanitary certificate', status: 'compliant', note: 'Issued by NPQS Sri Lanka for every export consignment.' },
  { label: 'Certificate of origin', status: 'compliant', note: 'Issued per shipment.' },
  { label: 'EU PGI "Ceylon Cinnamon"', status: 'pending', note: 'PGI eligible. Mark not used until producer registration is confirmed.' },
]

const MICRO_COMPLIANCE: ComplianceItem = {
  label: 'Microbiology (TPC, yeast & mould, E. coli, Salmonella)',
  status: 'per-lot',
  note: 'Each milled batch is tested; Salmonella absent in 25 g required for release.',
}

export const PRODUCTS: Product[] = [
  {
    id: 'quills-alba',
    sku: 'SEY-Q-ALBA',
    name: 'Ceylon Cinnamon Quills · Alba',
    category: 'quills',
    grade: 'Alba',
    shortDescription: 'The thinnest, most delicate hand-rolled quills. Pale golden bark with tightly packed inner layers.',
    sensoryProfile: 'Sweet, floral and citrus-bright with a gentle, lingering warmth.',
    image: '/images/sticks-powder.jpg',
    imageAlt: 'Close-up of layered Ceylon cinnamon quills beside ground cinnamon',
    highlights: { moisture: '≤ 12%', volatileOil: '≥ 1.0% v/w', size: 'Ø ≤ 6 mm' },
    specs: [
      BOTANICAL,
      ORIGIN,
      { label: 'Grade', value: 'Alba', reference: 'SLS 81:2021' },
      { label: 'Quill diameter', value: '≤ 6 mm' },
      { label: 'Quill length', value: '42 cm (cut to 5, 8 or 10 cm on request)' },
      { label: 'Moisture', value: '≤ 12% m/m', reference: 'ISO 939' },
      { label: 'Volatile oil', value: '≥ 1.0% v/w (typical)', reference: 'ISO 6571' },
      { label: 'Foreign matter', value: '≤ 1% m/m', reference: 'ISO 927' },
      { label: 'Coumarin', value: 'Naturally low; value reported on lot COA' },
    ],
    compliance: STANDARD_COMPLIANCE,
    bulk: {
      moq: '100 kg',
      leadTime: '3–4 weeks after PO & deposit',
      packaging: ['5 kg / 10 kg lined cartons', 'Vacuum-packed inner bags', 'Private-label retail tubes'],
      incoterms: ['FOB Colombo', 'CIF', 'CFR', 'DAP (air)'],
      privateLabel: true,
    },
    retailPacks: [
      { id: '50g', label: '50 g tube', netKg: 0.05, priceUsd: 9.5 },
      { id: '250g', label: '250 g pouch', netKg: 0.25, priceUsd: 34 },
      { id: '1kg', label: '1 kg trade pack', netKg: 1, priceUsd: 110 },
    ],
  },
  {
    id: 'quills-c5sp',
    sku: 'SEY-Q-C5SP',
    name: 'Ceylon Cinnamon Quills · C5 Special',
    category: 'quills',
    grade: 'C5 Special',
    shortDescription: 'Premium continental grade for gourmet retail and spice merchants. Uniform colour and tight roll.',
    sensoryProfile: 'Honeyed sweetness, clove-like top notes and a smooth woody finish.',
    image: '/images/quills-white.jpg',
    imageAlt: 'Two cinnamon quills with star anise on a white background',
    highlights: { moisture: '≤ 12%', volatileOil: '≥ 1.0% v/w', size: 'Ø ≈ 8–10 mm' },
    specs: [
      BOTANICAL,
      ORIGIN,
      { label: 'Grade', value: 'C5 Special (Continental)', reference: 'SLS 81:2021' },
      { label: 'Quill diameter', value: '≈ 8–10 mm (typical)' },
      { label: 'Quill length', value: '42 cm, or cut 5 / 8 / 10 cm' },
      { label: 'Moisture', value: '≤ 12% m/m', reference: 'ISO 939' },
      { label: 'Volatile oil', value: '≥ 1.0% v/w (typical)', reference: 'ISO 6571' },
      { label: 'Foreign matter', value: '≤ 1% m/m', reference: 'ISO 927' },
      { label: 'Coumarin', value: 'Naturally low; value reported on lot COA' },
    ],
    compliance: STANDARD_COMPLIANCE,
    bulk: {
      moq: '200 kg',
      leadTime: '3–4 weeks after PO & deposit',
      packaging: ['10 kg / 20 kg lined cartons', 'Vacuum-packed inner bags'],
      incoterms: ['FOB Colombo', 'CIF', 'CFR'],
      privateLabel: true,
    },
    retailPacks: [
      { id: '50g', label: '50 g tube', netKg: 0.05, priceUsd: 7.5 },
      { id: '250g', label: '250 g pouch', netKg: 0.25, priceUsd: 26 },
      { id: '1kg', label: '1 kg trade pack', netKg: 1, priceUsd: 85 },
    ],
  },
  {
    id: 'quills-c5',
    sku: 'SEY-Q-C5',
    name: 'Ceylon Cinnamon Quills · C5',
    category: 'quills',
    grade: 'C5',
    shortDescription: 'The workhorse continental grade for importers, repackers and food manufacturers.',
    sensoryProfile: 'Rounded, sweet-woody aroma with a clean, warming finish.',
    image: '/images/sticks-powder.jpg',
    imageAlt: 'Ceylon cinnamon quills showing multiple paper-thin bark layers',
    highlights: { moisture: '≤ 12%', volatileOil: '≥ 0.8% v/w', size: 'Ø ≈ 10–12 mm' },
    specs: [
      BOTANICAL,
      ORIGIN,
      { label: 'Grade', value: 'C5 (Continental)', reference: 'SLS 81:2021' },
      { label: 'Quill diameter', value: '≈ 10–12 mm' },
      { label: 'Quill length', value: '42 cm, or cut to size' },
      { label: 'Moisture', value: '≤ 12% m/m', reference: 'ISO 939' },
      { label: 'Volatile oil', value: '≥ 0.8% v/w (typical)', reference: 'ISO 6571' },
      { label: 'Foreign matter', value: '≤ 1% m/m', reference: 'ISO 927' },
      { label: 'Coumarin', value: 'Naturally low; value reported on lot COA' },
    ],
    compliance: STANDARD_COMPLIANCE,
    bulk: {
      moq: '500 kg',
      leadTime: '3–5 weeks after PO & deposit',
      packaging: ['20 kg / 25 kg lined cartons', 'Pressed bales on request'],
      incoterms: ['FOB Colombo', 'CIF', 'CFR'],
      privateLabel: true,
    },
    retailPacks: [
      { id: '250g', label: '250 g pouch', netKg: 0.25, priceUsd: 21 },
      { id: '1kg', label: '1 kg trade pack', netKg: 1, priceUsd: 68 },
    ],
  },
  {
    id: 'quills-c4',
    sku: 'SEY-Q-C4',
    name: 'Ceylon Cinnamon Quills · C4',
    category: 'quills',
    grade: 'C4',
    shortDescription: 'Robust, value-oriented continental grade for food service and industrial infusion.',
    sensoryProfile: 'Bold, woody-sweet and full-bodied.',
    image: '/images/quills-white.jpg',
    imageAlt: 'Cinnamon quills on a white surface',
    highlights: { moisture: '≤ 12%', volatileOil: '≥ 0.7% v/w', size: 'Ø ≈ 13–14 mm' },
    specs: [
      BOTANICAL,
      ORIGIN,
      { label: 'Grade', value: 'C4 (Continental)', reference: 'SLS 81:2021' },
      { label: 'Quill diameter', value: '≈ 13–14 mm' },
      { label: 'Quill length', value: '42 cm, or cut to size' },
      { label: 'Moisture', value: '≤ 12% m/m', reference: 'ISO 939' },
      { label: 'Volatile oil', value: '≥ 0.7% v/w (typical)', reference: 'ISO 6571' },
      { label: 'Foreign matter', value: '≤ 1% m/m', reference: 'ISO 927' },
      { label: 'Coumarin', value: 'Naturally low; value reported on lot COA' },
    ],
    compliance: STANDARD_COMPLIANCE,
    bulk: {
      moq: '500 kg',
      leadTime: '3–5 weeks after PO & deposit',
      packaging: ['20 kg / 25 kg lined cartons', 'Pressed bales'],
      incoterms: ['FOB Colombo', 'CIF', 'CFR'],
      privateLabel: false,
    },
    retailPacks: [{ id: '1kg', label: '1 kg trade pack', netKg: 1, priceUsd: 58 }],
  },
  {
    id: 'chips',
    sku: 'SEY-CHIPS',
    name: 'Ceylon Cinnamon Chips & Broken Quills',
    category: 'chips',
    shortDescription: 'Featherings, quillings and chips for milling, oil extraction and tea blending.',
    sensoryProfile: 'Warm, sweet-spicy; ideal for infusion and steam distillation.',
    image: '/images/hero.jpg',
    imageAlt: 'A dense pile of cinnamon sticks and broken pieces',
    highlights: { moisture: '≤ 12%', volatileOil: '≥ 0.5% v/w', size: '3–10 mm cut' },
    specs: [
      BOTANICAL,
      ORIGIN,
      { label: 'Form', value: 'Quillings / featherings / chips', reference: 'SLS 81:2021' },
      { label: 'Cut size', value: 'TBC (3–5 mm tea-cut, 5–10 mm chips)' },
      { label: 'Moisture', value: '≤ 12% m/m', reference: 'ISO 939' },
      { label: 'Volatile oil', value: '≥ 0.5% v/w (typical)', reference: 'ISO 6571' },
      { label: 'Foreign matter', value: '≤ 2% m/m', reference: 'ISO 927' },
      { label: 'Sieving / dust', value: 'Dust-extracted for tea-cut' },
    ],
    compliance: STANDARD_COMPLIANCE,
    bulk: {
      moq: '1 MT',
      leadTime: '2–4 weeks after PO',
      packaging: ['25 kg PP bags with liner', 'Jumbo bags (on request)'],
      incoterms: ['FOB Colombo', 'CIF', 'CFR'],
      privateLabel: false,
    },
    retailPacks: [],
  },
  {
    id: 'powder',
    sku: 'SEY-PWD-LAB',
    name: 'Lab-Tested Ceylon Cinnamon Powder',
    category: 'powder',
    shortDescription: 'Fine-mesh ground Ceylon cinnamon, micro-tested batch by batch, with naturally low coumarin.',
    sensoryProfile: 'Soft, sweet, aromatic and delicately citrus. No harsh bite.',
    image: '/images/powder.jpg',
    imageAlt: 'A spoon heaped with fine cinnamon powder',
    highlights: { moisture: '≤ 10%', volatileOil: '≥ 0.7% v/w', size: '60–80 mesh' },
    specs: [
      BOTANICAL,
      ORIGIN,
      { label: 'Mesh', value: '60 / 80 mesh (custom on request)' },
      { label: 'Moisture', value: '≤ 10% m/m', reference: 'ISO 939' },
      { label: 'Volatile oil', value: '≥ 0.7% v/w (typical)', reference: 'ISO 6571' },
      { label: 'Total ash', value: '≤ 5% m/m', reference: 'ISO 928' },
      { label: 'Acid-insoluble ash', value: '≤ 1% m/m', reference: 'ISO 930' },
      // Compliance: coumarin is stated as an indicative figure tied to the COA, never as a health claim.
      { label: 'Coumarin', value: 'Naturally low (~0.004%, indicative); verified per lot COA', reference: 'HPLC' },
      { label: 'Microbial treatment', value: 'Steam-sterilised option available (no irradiation)' },
    ],
    compliance: [MICRO_COMPLIANCE, ...STANDARD_COMPLIANCE],
    bulk: {
      moq: '250 kg',
      leadTime: '2–3 weeks after PO',
      packaging: ['25 kg multi-wall paper bags with PE liner', '1 kg foil pouches', 'Private-label jars'],
      incoterms: ['FOB Colombo', 'CIF', 'DAP (air)'],
      privateLabel: true,
    },
    retailPacks: [
      { id: '100g', label: '100 g resealable pouch', netKg: 0.1, priceUsd: 8 },
      { id: '500g', label: '500 g pouch', netKg: 0.5, priceUsd: 29 },
      { id: '1kg', label: '1 kg trade pack', netKg: 1, priceUsd: 52 },
    ],
  },
  {
    id: 'blends',
    sku: 'SEY-TEA',
    name: 'Tea Bags & Botanical Blends',
    category: 'blends',
    shortDescription: 'Ceylon cinnamon infusions and custom botanical blends for tea brands and hospitality.',
    sensoryProfile: 'Formulated to brief. Tell us your target profile.',
    image: '/images/spice-bowls.jpg',
    imageAlt: 'Bowls of dried herbs, spice powders and oil',
    highlights: { moisture: 'TBC', volatileOil: 'TBC' },
    specs: [BOTANICAL, ORIGIN, { label: 'Status', value: 'In development. Inquire for custom blends.' }],
    compliance: [],
    bulk: {
      moq: 'On request',
      leadTime: 'On request',
      packaging: ['Pyramid / flat tea bags', 'Bulk tea-cut'],
      incoterms: ['FOB Colombo', 'CIF'],
      privateLabel: true,
    },
    retailPacks: [],
    comingSoon: true,
  },
]

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id)

export const CATEGORY_LABELS: Record<Product['category'] | 'all', string> = {
  all: 'All',
  quills: 'Whole Quills',
  chips: 'Chips & Broken',
  powder: 'Powder',
  blends: 'Tea & Blends',
}
