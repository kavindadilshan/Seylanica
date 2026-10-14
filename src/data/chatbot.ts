/*
 * CHATBOT KNOWLEDGE BASE
 * ------------------------------------------------------------------
 * A lightweight, offline intent matcher: no API key or backend needed.
 * Each intent has trigger keywords, a reply, and optional follow-up actions.
 *
 * Compliance guardrails built into the replies:
 *  - No medical / health-benefit claims (see the "health" intent).
 *  - Coumarin and other figures are always tied to the lot COA.
 *  - Certifications are never claimed unless enabled in config/site.ts.
 */

export type ChatAction =
  | { kind: 'link'; label: string; to: string }
  | { kind: 'whatsapp'; label: string; message: string }

export interface Intent {
  id: string
  keywords: string[]
  reply: string
  actions?: ChatAction[]
  suggestions?: string[]
}

export const WELCOME_SUGGESTIONS = ['Product grades', 'MOQ & pricing', 'Request samples', 'Coumarin levels', 'Shipping & Incoterms', 'Order on WhatsApp']

export const INTENTS: Intent[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good evening', 'ayubowan'],
    reply: "Hello and welcome to Seylanica! I can help with grades, specs, MOQ, samples, shipping and orders. What are you looking for today?",
    suggestions: WELCOME_SUGGESTIONS,
  },
  {
    id: 'grades',
    keywords: ['grade', 'grades', 'alba', 'c5', 'c4', 'quill', 'quills', 'stick', 'sticks', 'continental'],
    reply:
      'We export whole Ceylon cinnamon quills graded under Sri Lanka Standard SLS 81:\n\n• **Alba**: thinnest (≤ 6 mm), most delicate and sweet\n• **C5 Special**: premium continental grade for gourmet retail\n• **C5**: the popular all-round import grade\n• **C4**: robust and value-oriented\n\nAll quills are available at 42 cm or cut to 5 / 8 / 10 cm.',
    actions: [{ kind: 'link', label: 'Compare grades', to: '/products' }],
    suggestions: ['View spec sheets', 'MOQ & pricing', 'Request samples'],
  },
  {
    id: 'powder',
    keywords: ['powder', 'ground', 'mesh', 'milled'],
    reply:
      'Our Ceylon cinnamon powder is ground to 60 or 80 mesh and every batch is lab-tested for moisture, ash, volatile oil and microbiology. A steam-sterilised option is available. MOQ for bulk powder is 250 kg; retail packs start at 100 g.',
    actions: [{ kind: 'link', label: 'Powder spec sheet', to: '/products?spec=powder' }],
    suggestions: ['Coumarin levels', 'Private label', 'Order on WhatsApp'],
  },
  {
    id: 'chips',
    keywords: ['chips', 'broken', 'featherings', 'quillings', 'tea cut', 'extraction', 'distillation', 'tea blending'],
    reply: 'Our chips and broken quills (quillings / featherings) suit milling, oil extraction and tea blending. Tea-cut 3–5 mm is dust-extracted. MOQ is 1 MT, packed in lined 25 kg bags.',
    actions: [{ kind: 'link', label: 'Chips specification', to: '/products?spec=chips' }],
    suggestions: ['Shipping & Incoterms', 'Request a quote'],
  },
  {
    id: 'coumarin',
    keywords: ['coumarin', 'cumarin'],
    reply:
      'True Ceylon cinnamon (Cinnamomum verum) naturally contains far less coumarin than cassia. Our indicative figure for powder is around 0.004%, but the binding value for any shipment is the one on that lot\'s Certificate of Analysis (HPLC method). We share the COA before you confirm an order.',
    actions: [{ kind: 'link', label: 'Ceylon vs Cassia', to: '/quality' }],
    suggestions: ['Documents & COA', 'Request samples'],
  },
  {
    id: 'cassia',
    keywords: ['cassia', 'difference', 'true cinnamon', 'real cinnamon', 'fake', 'chinese cinnamon', 'saigon'],
    reply:
      'Ceylon cinnamon (C. verum) is made of many paper-thin bark layers rolled into a soft, brittle quill, with a sweet, delicate flavour. Cassia (C. cassia) is a single thick, hard layer of bark with a stronger, harsher taste and naturally much higher coumarin.',
    actions: [{ kind: 'link', label: 'Full comparison', to: '/quality' }],
    suggestions: ['Coumarin levels', 'Product grades'],
  },
  {
    id: 'moq',
    keywords: ['moq', 'minimum', 'price', 'pricing', 'cost', 'rate', 'quote', 'quotation', 'how much', 'bulk', 'wholesale'],
    reply:
      'Indicative MOQs: Alba 100 kg · C5 Special 200 kg · C5 / C4 500 kg · Powder 250 kg · Chips 1 MT.\n\nBulk prices depend on grade, volume, packing and Incoterm, so we quote per inquiry, usually within 24 hours. Small retail packs are priced on our Shop page.',
    actions: [
      { kind: 'link', label: 'Request a B2B quote', to: '/quote' },
      { kind: 'whatsapp', label: 'Ask for prices on WhatsApp', message: 'Hello Seylanica, I would like a price quotation for Ceylon cinnamon.' },
    ],
    suggestions: ['Shipping & Incoterms', 'Lead time'],
  },
  {
    id: 'samples',
    keywords: ['sample', 'samples', 'trial', 'test'],
    reply:
      'Verified buyers can request physical samples (usually 100–250 g per grade) sent by air courier. Tell us your destination country so we can include the right documents for import clearance.',
    actions: [
      { kind: 'link', label: 'Sample request form', to: '/quote?type=sample' },
      { kind: 'whatsapp', label: 'Request on WhatsApp', message: 'Hello Seylanica, I would like to request cinnamon samples.' },
    ],
    suggestions: ['Documents & COA', 'Shipping & Incoterms'],
  },
  {
    id: 'shipping',
    keywords: ['ship', 'shipping', 'freight', 'incoterm', 'incoterms', 'fob', 'cif', 'cfr', 'dap', 'air', 'sea', 'container', 'port', 'delivery', 'deliver'],
    reply:
      'We ship by sea from Colombo on **FOB**, **CFR** or **CIF** terms, and by air (DAP) for samples and urgent small orders. A 20 ft container typically holds about 6–8 MT of quills, depending on packing.',
    actions: [{ kind: 'link', label: 'Shipping inquiry form', to: '/buyer-hub#shipping' }],
    suggestions: ['Lead time', 'Documents & COA'],
  },
  {
    id: 'lead',
    keywords: ['lead time', 'how long', 'when', 'dispatch', 'production time', 'eta'],
    reply: 'Typical lead time is 2–5 weeks from confirmed PO and deposit, depending on grade and volume, plus transit time to your port.',
    suggestions: ['Shipping & Incoterms', 'Request a quote'],
  },
  {
    id: 'documents',
    keywords: ['coa', 'certificate', 'document', 'documents', 'spec', 'specification', 'sds', 'msds', 'phytosanitary', 'npqs', 'origin certificate', 'lab', 'analysis'],
    reply:
      'Each export lot ships with a Certificate of Analysis, NPQS phytosanitary certificate and certificate of origin. Spec sheets and a sample COA are available in the B2B Buyer Hub, and SDS on request.',
    actions: [{ kind: 'link', label: 'Open Buyer Hub', to: '/buyer-hub' }],
    suggestions: ['Request samples', 'Coumarin levels'],
  },
  {
    id: 'privatelabel',
    keywords: ['private label', 'white label', 'own brand', 'custom pack', 'packaging', 'oem', 'branding'],
    reply: 'Yes. We offer private labelling for quills, cut sticks and powder (tubes, pouches, jars and trade packs). Share your brief and target volumes and we will propose options.',
    actions: [{ kind: 'link', label: 'Start a private-label inquiry', to: '/quote?privateLabel=1' }],
    suggestions: ['MOQ & pricing', 'Request samples'],
  },
  {
    id: 'organic',
    keywords: ['organic', 'usda', 'non-gmo', 'gmo', 'pgi', 'certified', 'certification', 'iso', 'haccp', 'gmp'],
    reply:
      'Our cinnamon is sourced via Good Agricultural Practices (GAP) and processed in line with ISO/GMP principles. We only state certifications that are held for a specific lot. Ask us what is currently available for your grade. Ceylon Cinnamon is PGI-eligible; our registration is pending.',
    suggestions: ['Documents & COA', 'Request a quote'],
  },
  {
    id: 'health',
    keywords: ['health', 'diabetes', 'weight', 'cure', 'medicine', 'benefit', 'benefits', 'blood sugar', 'safe', 'pregnan'],
    // Compliance: no medical claims; redirect to factual info + professional advice.
    reply:
      'We are a spice supplier, so we can\'t give medical or health advice. Please speak to a qualified healthcare professional. What we can share are factual, lab-verified quality data (moisture, volatile oil, microbiology and coumarin) on each lot\'s COA.',
    suggestions: ['Coumarin levels', 'Documents & COA'],
  },
  {
    id: 'payment',
    keywords: ['payment', 'pay', 'lc', 'letter of credit', 'tt', 'bank', 'stripe', 'card', 'paypal', 'currency'],
    reply:
      'Bulk orders: T/T (typically 30–50% deposit, balance against documents) or L/C at sight. Small orders: we confirm by WhatsApp and send a secure payment link in USD, EUR or GBP.',
    suggestions: ['Order on WhatsApp', 'Request a quote'],
  },
  {
    id: 'order',
    keywords: ['order', 'buy', 'purchase', 'whatsapp', 'checkout', 'cart'],
    reply: 'You can order directly on WhatsApp. Our team replies quickly and confirms availability, pricing and shipping. For retail packs, add them to your cart in the Shop and check out via WhatsApp.',
    actions: [
      { kind: 'whatsapp', label: 'Order on WhatsApp', message: 'Hello Seylanica, I would like to place an order.' },
      { kind: 'link', label: 'Go to Shop', to: '/shop' },
    ],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'phone', 'call', 'human', 'agent', 'person', 'talk', 'speak'],
    reply: 'Happy to connect you with our export team. WhatsApp is the fastest way to reach us.',
    actions: [{ kind: 'whatsapp', label: 'Chat with the team', message: 'Hello Seylanica, I would like to speak with your export team.' }],
  },
]

/** Maps quick-reply chip labels straight to an intent. */
export const SUGGESTION_TO_INTENT: Record<string, string> = {
  'Product grades': 'grades',
  'MOQ & pricing': 'moq',
  'Request samples': 'samples',
  'Coumarin levels': 'coumarin',
  'Shipping & Incoterms': 'shipping',
  'Order on WhatsApp': 'order',
  'View spec sheets': 'documents',
  'Documents & COA': 'documents',
  'Private label': 'privatelabel',
  'Request a quote': 'moq',
  'Lead time': 'lead',
}

export const FALLBACK: Intent = {
  id: 'fallback',
  keywords: [],
  reply: "I'm not sure about that one. Our export team can answer it directly on WhatsApp, or pick a topic below.",
  actions: [{ kind: 'whatsapp', label: 'Ask on WhatsApp', message: 'Hello Seylanica, I have a question: ' }],
  suggestions: WELCOME_SUGGESTIONS,
}

/** Scores each intent by keyword hits (longer phrases weigh more) and returns the best match. */
export function matchIntent(input: string): Intent {
  const text = ` ${input.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ')} `
  let best: Intent = FALLBACK
  let bestScore = 0
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce((s, k) => (text.includes(` ${k} `) || (k.length > 4 && text.includes(k)) ? s + k.length : s), 0)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return best
}

export const intentById = (id: string) => INTENTS.find((i) => i.id === id) ?? FALLBACK
