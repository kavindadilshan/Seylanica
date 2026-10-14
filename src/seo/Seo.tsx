import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta, headTags } from './meta'

/** Keeps <head> (title, meta, canonical, JSON-LD) in sync with the current route. */
export function Seo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const tags = headTags(getPageMeta(pathname))
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove())
    for (const { tag, attrs = {}, text } of tags) {
      const el = document.createElement(tag)
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
      el.setAttribute('data-seo', '')
      if (text != null) el.textContent = text
      document.head.appendChild(el)
    }
  }, [pathname])

  return null
}
