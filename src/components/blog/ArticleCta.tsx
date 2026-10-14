import { Link } from 'react-router-dom'
import { FileText, Package } from 'lucide-react'
import { getProduct } from '../../data/products'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'
import { whatsappLink } from '../../lib/whatsapp'

/** End-of-article conversion block: the product this topic leads to, plus the three ways to act. */
export function ArticleCta({ productId, topic }: { productId: string; topic: string }) {
  const product = getProduct(productId)
  return (
    <section aria-label="Next steps" className="overflow-hidden rounded-3xl bg-cinnamon text-cream shadow-xl shadow-cinnamon/20 sm:grid sm:grid-cols-[0.8fr_1.2fr]">
      {product && <img src={product.image} alt={product.imageAlt} loading="lazy" className="h-48 w-full object-cover sm:h-full" />}
      <div className="p-7 sm:p-9">
        <p className="eyebrow !text-gold">Source it from origin</p>
        <p className="mt-2 font-display text-3xl leading-tight font-semibold">{product ? product.name : 'True Ceylon cinnamon, direct from Sri Lanka'}</p>
        {product && <p className="mt-2 text-sm text-cream/70">{product.shortDescription}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/quote?type=sample" className="btn-gold !px-5 !py-2.5">
            <Package className="h-4 w-4" /> Request samples
          </Link>
          <Link to={`/products?spec=${productId}`} className="btn-ghost-light !px-5 !py-2.5">
            <FileText className="h-4 w-4" /> Spec sheet
          </Link>
          <a
            href={whatsappLink(`Hello Seylanica, I read your article "${topic}" and would like to discuss an order.`)}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-light !px-5 !py-2.5"
          >
            <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
