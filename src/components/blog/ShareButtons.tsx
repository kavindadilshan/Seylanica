import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { FacebookIcon } from '../brand/FacebookIcon'
import { LinkedInIcon } from '../brand/LinkedInIcon'
import { WhatsAppIcon } from '../brand/WhatsAppIcon'

/** Share links (no third-party scripts): every share is free distribution and a potential backlink. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const links = [
    { label: 'Share on Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, icon: FacebookIcon },
    { label: 'Share on LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, icon: LinkedInIcon },
    { label: 'Share on WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, icon: WhatsAppIcon },
  ]
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked: the visible links still work */
    }
  }
  const cls = 'grid h-10 w-10 place-items-center rounded-full border border-cinnamon/15 text-cinnamon/70 transition hover:border-gold hover:text-cinnamon'
  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-bold tracking-wider text-cinnamon/50 uppercase">Share</span>
      {links.map(({ label, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className={cls}>
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button onClick={copy} aria-label="Copy link" className={cls}>
        {copied ? <Check className="h-4 w-4 text-forest" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
