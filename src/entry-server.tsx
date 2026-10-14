import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App'

export { ROUTES, getPageMeta, headTags, headTagsToHtml } from './seo/meta'
export { SITE } from './config/site'
export { PRODUCTS } from './data/products'
export { FAQ } from './data/faq'
export { CEYLON_VS_CASSIA } from './data/comparison'

/** Renders one route to static HTML, waiting for lazy pages to resolve. Used by scripts/prerender.mjs. */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
