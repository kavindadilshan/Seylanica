import { PageHero } from '../components/ui/PageHero'
import { ProductMatrix } from '../components/product/ProductMatrix'
import { TrustBanner } from '../components/home/TrustBanner'

export default function ProductsPage() {
  return (
    <>
      <PageHero
        image="/images/hero.jpg"
        eyebrow="Product Catalog"
        title="Ceylon cinnamon, graded for every buyer."
        intro="Whole quills in four SLS 81 grades, chips for milling and blending, and lab-tested powder. Switch to Compare view for a side-by-side spec table."
      />
      <TrustBanner />
      <section className="py-20">
        <div className="container-x">
          <ProductMatrix />
        </div>
      </section>
    </>
  )
}
