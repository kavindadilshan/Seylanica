import type { Lot } from '../types'

/*
 * LOT REGISTER (sample data)
 * ------------------------------------------------------------------
 * Sourcing origin and coumarin values are rendered ONLY from these records.
 * Replace with real lot data (or fetch from your CMS / ERP) before launch.
 * If a field is unverified, leave it undefined and the UI shows "Per COA".
 */
export const LOTS: Lot[] = [
  { lotNo: 'SEY-2026-Q-014', productId: 'quills-alba', harvestSeason: 'May–Aug 2026', sourcingRegion: undefined, coumarinPct: undefined, coaAvailable: true },
  { lotNo: 'SEY-2026-Q-011', productId: 'quills-c5sp', harvestSeason: 'May–Aug 2026', coaAvailable: true },
  { lotNo: 'SEY-2026-P-007', productId: 'powder', harvestSeason: 'May–Aug 2026', coumarinPct: '~0.004%', coaAvailable: true },
]

export const lotsFor = (productId: string) => LOTS.filter((l) => l.productId === productId)
