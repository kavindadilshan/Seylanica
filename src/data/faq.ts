/*
 * BUYER FAQ
 * ------------------------------------------------------------------
 * Rendered as a visible FAQ section AND as FAQPage structured data, and
 * listed in /llms.txt. Answers lead with the direct answer in the first
 * sentence so search snippets and AI assistants can quote them verbatim.
 *
 * Same guardrails as the chatbot: no health claims, figures tied to the lot COA,
 * no certification claims unless enabled in config/site.ts.
 */

export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  {
    q: 'What is the difference between Ceylon cinnamon and cassia?',
    a: 'Ceylon cinnamon (Cinnamomum verum) and cassia (Cinnamomum cassia and related species) are different plants. Ceylon quills are many paper-thin layers of inner bark rolled together, soft enough to crumble by hand, light tan in colour and sweet and delicate in flavour. Cassia is a single thick, hard layer of darker bark with a stronger, harsher taste and naturally much higher coumarin.',
  },
  {
    q: 'How much coumarin does Ceylon cinnamon contain?',
    a: 'True Ceylon cinnamon naturally contains far less coumarin than cassia. Our indicative figure for powder is around 0.004%, but the binding value for any shipment is the HPLC result printed on that lot\'s Certificate of Analysis, which we share before you confirm an order.',
  },
  {
    q: 'What are the Ceylon cinnamon quill grades?',
    a: 'Seylanica exports whole quills in four grades under Sri Lanka Standard SLS 81: Alba (thinnest, quill diameter 6 mm or less, the most delicate and sweet), C5 Special (premium continental grade for gourmet retail), C5 (the popular all-round import grade) and C4 (robust and value-oriented). Quills are supplied at 42 cm or cut to 5, 8 or 10 cm.',
  },
  {
    q: 'What is the minimum order quantity (MOQ) for bulk Ceylon cinnamon?',
    a: 'Indicative MOQs are 100 kg for Alba quills, 200 kg for C5 Special, 500 kg for C5 and C4, 250 kg for powder and 1 metric tonne for chips. Bulk prices depend on grade, volume, packing and Incoterm, and we quote each inquiry, usually within 24 hours.',
  },
  {
    q: 'Can I get samples before placing a bulk order?',
    a: 'Yes. Verified buyers can request physical samples, usually 100 to 250 g per grade, sent by air courier. Tell us your destination country so the right import documents are included.',
  },
  {
    q: 'Which shipping terms (Incoterms) do you offer?',
    a: 'We ship by sea from Colombo, Sri Lanka on FOB, CFR or CIF terms, and by air on DAP terms for samples and urgent small orders. A 20 ft container typically holds about 6 to 8 metric tonnes of quills, depending on packing.',
  },
  {
    q: 'What is the lead time for an export order?',
    a: 'Typical lead time is 2 to 5 weeks from a confirmed purchase order and deposit, depending on grade and volume, plus transit time to your port.',
  },
  {
    q: 'Which documents ship with each order?',
    a: 'Every export lot ships with a Certificate of Analysis (moisture, volatile oil, ash, microbiology, pesticide residues, heavy metals and coumarin), an NPQS Sri Lanka phytosanitary certificate and a certificate of origin. Spec sheets and a sample COA are in the B2B Buyer Hub; SDS is available on request.',
  },
  {
    q: 'Do you offer private-label Ceylon cinnamon?',
    a: 'Yes. Seylanica private-labels quills, cut sticks and powder in tubes, pouches, jars and trade packs. Share your brief and target volumes and we will propose packing options.',
  },
  {
    q: 'Is your cinnamon organic or PGI certified?',
    a: 'We only state certifications that are held for a specific lot. Our cinnamon is sourced through Good Agricultural Practices and processed in line with ISO 22000 / GMP principles. Ceylon Cinnamon is eligible for EU PGI protection; our producer registration is pending.',
  },
  {
    q: 'How do I pay for an order?',
    a: 'Bulk orders are paid by T/T (typically a 30 to 50% deposit with the balance against documents) or by letter of credit at sight. Small retail orders are confirmed on WhatsApp with a secure payment link in USD, EUR or GBP.',
  },
]
