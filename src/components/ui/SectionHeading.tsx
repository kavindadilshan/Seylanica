import type { ReactNode } from 'react'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  light = false,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
}) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`mt-3 text-4xl leading-[1.05] font-semibold sm:text-5xl ${light ? 'text-cream' : 'text-cinnamon'}`}>{title}</h2>
      {intro && <p className={`mt-4 text-base leading-relaxed ${light ? 'text-cream/70' : 'text-cinnamon/70'}`}>{intro}</p>}
    </div>
  )
}
