import { SITE } from '../../config/site'

/** Brand emblem: rolled cinnamon quill (gold spiral) with a cinnamon leaf. */
export function LogoMark({ className = 'h-10 w-10' }: { className?: string }) {
  return <img src={SITE.logoMarkImage} alt="" aria-hidden="true" className={`rounded-full object-contain ${className}`} />
}

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="leading-none">
        <span className={`block font-display text-2xl font-semibold tracking-wide ${light ? 'text-cream' : 'text-cinnamon'}`}>{SITE.brand}</span>
        {!compact && (
          <span className={`mt-0.5 block text-[10px] font-semibold tracking-[0.2em] uppercase ${light ? 'text-gold-200' : 'text-gold-600'}`}>
            {SITE.tagline}
          </span>
        )}
      </span>
    </span>
  )
}
