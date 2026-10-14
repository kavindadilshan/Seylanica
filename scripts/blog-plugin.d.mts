import type { Plugin } from 'vite'

export function blogPlugin(options?: { root?: string }): Plugin
export function parseFrontmatter(raw: string, file: string): { data: Record<string, unknown>; body: string }
