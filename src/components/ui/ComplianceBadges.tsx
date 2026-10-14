import { BadgeCheck, FlaskConical, Globe, Hourglass, Leaf, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { COMPLIANCE } from '../../config/site'

interface BadgeDef {
  key: string
  icon: ReactNode
  label: string
  sub: string
  pending?: boolean
}

/**
 * Returns only the trust badges that are SAFE to show.
 * Certification marks are gated by the COMPLIANCE flags in config/site.ts,
 * so nothing is claimed until the flag is switched on after verification.
 */
export function getComplianceBadges(): BadgeDef[] {
  const badges: BadgeDef[] = [
    { key: 'origin', icon: <Globe className="h-5 w-5" />, label: '100% Origin Guaranteed', sub: 'Sri Lanka' },
    { key: 'coa', icon: <FlaskConical className="h-5 w-5" />, label: 'Lot-based COA', sub: 'Every batch, on request' },
    { key: 'gap', icon: <Leaf className="h-5 w-5" />, label: 'Sourced via GAP', sub: 'Good Agricultural Practices' },
    { key: 'sls', icon: <ShieldCheck className="h-5 w-5" />, label: 'SLS 81 Graded', sub: 'Sri Lanka Standard' },
  ]

  // PGI: the registered mark only when verified, otherwise a neutral pending placeholder.
  badges.push(
    COMPLIANCE.pgiRegistered
      ? { key: 'pgi', icon: <BadgeCheck className="h-5 w-5" />, label: 'EU PGI Ceylon Cinnamon', sub: 'Registered producer' }
      : { key: 'pgi', icon: <Hourglass className="h-5 w-5" />, label: 'PGI Eligible', sub: 'Pending approval', pending: true },
  )

  if (COMPLIANCE.pureCeylonLionMark) badges.push({ key: 'lion', icon: <BadgeCheck className="h-5 w-5" />, label: 'Pure Ceylon Cinnamon', sub: 'EDB licensed mark' })
  if (COMPLIANCE.usdaOrganic) badges.push({ key: 'usda', icon: <BadgeCheck className="h-5 w-5" />, label: 'USDA Organic', sub: 'Certified' })
  if (COMPLIANCE.euOrganic) badges.push({ key: 'euorg', icon: <BadgeCheck className="h-5 w-5" />, label: 'EU Organic', sub: 'Certified' })
  if (COMPLIANCE.nonGmoProject) badges.push({ key: 'ngmo', icon: <BadgeCheck className="h-5 w-5" />, label: 'Non-GMO Project', sub: 'Verified' })

  return badges
}

export function ComplianceBadges({ dark = false }: { dark?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {getComplianceBadges().map((b) => (
        <li
          key={b.key}
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
            dark ? 'border-cream/10 bg-cream/5 text-cream' : 'border-cinnamon/10 bg-white text-cinnamon'
          } ${b.pending ? 'border-dashed' : ''}`}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/15 ${dark ? 'text-gold' : 'text-gold-600'}`}>{b.icon}</span>
          <span className="min-w-0">
            <span className="block text-sm leading-tight font-bold">{b.label}</span>
            <span className={`block text-xs ${dark ? 'text-cream/60' : 'text-cinnamon/60'}`}>{b.sub}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
