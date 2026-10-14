import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { CurrencyProvider } from './context/CurrencyContext'
import { CartProvider } from './context/CartContext'
import HomePage from './pages/HomePage'

// Inner pages are code-split so the homepage loads fast.
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const BuyerHubPage = lazy(() => import('./pages/BuyerHubPage'))
const QualityPage = lazy(() => import('./pages/QualityPage'))
const QuotePage = lazy(() => import('./pages/QuotePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogCategoryPage = lazy(() => import('./pages/BlogCategoryPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const AuthorPage = lazy(() => import('./pages/AuthorPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

/** Router-agnostic app: wrapped in BrowserRouter (main.tsx) or StaticRouter (entry-server.tsx). */
export default function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="buyer-hub" element={<BuyerHubPage />} />
              <Route path="quality" element={<QualityPage />} />
              <Route path="quote" element={<QuotePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/category/:category" element={<BlogCategoryPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
              <Route path="author/kavinda-dilshan" element={<AuthorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </CartProvider>
    </CurrencyProvider>
  )
}
