export type { PostMeta, PostBody } from 'virtual:blog'

export interface BlogCategory {
  slug: string
  name: string
  description: string
  /** Fallback image for articles in this category until a real photo is added. */
  image: string
  /** Product promoted in this category's articles. */
  productId: string
}

export interface Author {
  slug: string
  name: string
  honorific: string
  jobTitle: string
  bio: string
  image: string
  linkedin: string
}
