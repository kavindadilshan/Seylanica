# Seylanica: Exquisite Ceylon Cinnamon

Export-ready B2B and retail website for Seylanica, built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide icons**.

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to /dist
npm run preview   # serve the production build
```

## Features

- **WhatsApp ordering** (`+94 76 373 7145`): floating Order button, quote and sample forms, shop checkout, spec-sheet actions and chatbot handoffs all open WhatsApp with a prefilled, formatted message (`src/lib/whatsapp.ts`).
- **Chatbot assistant**: offline, rule-based intent matcher with quick replies, typing indicator, page links and WhatsApp handoff. Edit answers in `src/data/chatbot.ts`.
- **Interactive spec sheets**: tabbed modal (Specifications / Compliance / MOQ & Shipping / Lot Traceability) with Print/PDF and deep links (`/products?spec=powder`).
- **B2B Buyer Hub**: spec viewer, quality dossier (CSV spec download, COA/SDS requests), Incoterms and container-planning estimator.
- **Quote and sample system**: validated form, quote/sample switch, freight preference, destination import checklist, sent by WhatsApp or email.
- **Shop (B2C)**: retail packs, persistent cart, USD/EUR/GBP display, WhatsApp checkout. Includes a Stripe/PayHere hook point.
- **Compliance guardrails**: certification badges are gated by flags, origin and coumarin are shown only from lot data, and no health claims are made.

## Folder architecture

```
public/
  favicon.svg
  images/                 # Unsplash photos (free licence), stored locally
src/
  config/site.ts          # brand, WhatsApp number, COMPLIANCE flags, FX rates, nav
  types/index.ts          # Product, Lot, QuoteRequest, CartLine… interfaces
  data/
    products.ts           # SKU catalog + indicative specs
    lots.ts               # lot register (drives origin / coumarin display)
    chatbot.ts            # chatbot knowledge base + intent matcher
    comparison.ts         # Ceylon vs Cassia facts
  context/                # CurrencyContext, CartContext (persisted)
  lib/                    # whatsapp, currency, storage helpers
  components/
    brand/                # Logo (SVG vector), WhatsAppIcon
    layout/               # Header (currency toggle, CTA), Footer, Layout
    home/                 # Hero, TrustBanner, TraceabilityFlow, SampleCTA
    product/              # ProductCard, ProductMatrix, SpecSheet (modal)
    forms/QuoteForm.tsx
    chat/ChatBot.tsx
    ui/                   # SectionHeading, PageHero, ComplianceBadges, Reveal
  pages/                  # Home, Products, BuyerHub, Quality, Quote, Shop, NotFound
  index.css               # Tailwind v4 @theme tokens (colours, fonts, animations)
```

## Before launch (TODO)

1. **Verify every spec value** in `src/data/products.ts` against your SLS 81 grading and lab reports.
2. **Replace sample lots** in `src/data/lots.ts` with real lot data.
3. **Set the real email** in `src/config/site.ts`.
4. **Replace stock photos** with your own product photography. Some stock images may show cassia rather than Ceylon cinnamon, and using real photos of your own lots avoids any misleading impression.
5. Flip `COMPLIANCE` flags **only** once the certificate and the licence to use its mark are on file.
6. Card payments: create a Stripe Checkout Session (or PayHere) **on a server** and redirect from `ShopPage.tsx`.
7. Hosting: as a single-page app, configure the host to rewrite all paths to `/index.html` (Netlify `_redirects`, Vercel rewrites).

## Image credits

Photos from [Unsplash](https://unsplash.com) (Unsplash License, free for commercial use).
