import type { ReactNode } from 'react'

/** Compact hero used on inner pages. */
export function PageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: ReactNode; intro?: ReactNode; image: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-cinnamon-950">
      <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-cinnamon-950 via-cinnamon-950/85 to-cinnamon-950/40" />
      <div className="container-x py-20 sm:py-28">
        <p className="eyebrow !text-gold">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl animate-fade-up text-5xl leading-[1.02] font-semibold text-cream sm:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-cream/75">{intro}</p>}
      </div>
    </section>
  )
}
