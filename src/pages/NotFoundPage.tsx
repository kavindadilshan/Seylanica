import { Link } from 'react-router-dom'
import { LogoMark } from '../components/brand/Logo'

export default function NotFoundPage() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <LogoMark className="mx-auto h-16 w-16" />
        <h1 className="mt-6 text-5xl font-semibold text-cinnamon">Page not found</h1>
        <p className="mt-3 text-cinnamon/65">The page you're looking for has moved or doesn't exist.</p>
        <Link to="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </section>
  )
}
