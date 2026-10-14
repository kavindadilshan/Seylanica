import { ComplianceBadges } from '../ui/ComplianceBadges'

/** Trust & compliance strip. Badges are gated by COMPLIANCE flags (see config/site.ts). */
export function TrustBanner() {
  return (
    <section aria-label="Quality and compliance" className="relative z-10 -mt-10">
      <div className="container-x">
        <div className="card p-4 sm:p-6">
          <ComplianceBadges />
          <p className="mt-4 text-center text-xs text-cinnamon/55">
            Lot-based COA available on request · Processing aligned with ISO / GMP principles · Graded to SLS 81
          </p>
        </div>
      </div>
    </section>
  )
}
