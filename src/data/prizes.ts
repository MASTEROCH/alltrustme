export type PrizeIcon = 'mountain' | 'plate' | 'cash' | 'star' | 'sparkles'
export type PrizeTone = 'gold' | 'orange' | 'gray' | 'blue'

export interface PrizeDetail {
  icon: PrizeIcon | 'check' | 'link' | 'bolt' | 'wine' | 'car' | 'bed' | 'swap'
  title: string
  sub?: string
}

export interface Prize {
  id: string
  icon: PrizeIcon
  tone: PrizeTone
  placeKey: string // «Суперприз · 1 место»
  winners: number
  titleKey: string
  descKey: string
  carousel?: PrizeIcon[] | ('mountain' | 'bed' | 'wine' | 'car' | 'plate')[]
  details: PrizeDetail[]
  footerKey?: string
}

/* Мок-призовой фонд (бэкенд подключим позже) — 5 призов. */
export const PRIZES: Prize[] = [
  {
    id: 'super',
    icon: 'mountain',
    tone: 'gold',
    placeKey: 'pz1_place',
    winners: 1,
    titleKey: 'pz1_title',
    descKey: 'pz1_desc',
    carousel: ['mountain', 'bed', 'wine', 'car'],
    details: [
      { icon: 'bed', title: 'pz1_d1', sub: 'pz1_d1s' },
      { icon: 'plate', title: 'pz1_d2', sub: 'pz1_d2s' },
      { icon: 'wine', title: 'pz1_d3', sub: 'pz1_d3s' },
      { icon: 'car', title: 'pz1_d4', sub: 'pz1_d4s' },
    ],
    footerKey: 'pz1_foot',
  },
  {
    id: 'dinner',
    icon: 'plate',
    tone: 'orange',
    placeKey: 'pz2_place',
    winners: 3,
    titleKey: 'pz2_title',
    descKey: 'pz2_desc',
    carousel: ['plate', 'wine', 'car'],
    details: [
      { icon: 'plate', title: 'pz2_d1', sub: 'pz2_d1s' },
      { icon: 'car', title: 'pz2_d2', sub: 'pz2_d2s' },
    ],
  },
  {
    id: 'usdt50',
    icon: 'cash',
    tone: 'gray',
    placeKey: 'pz3_place',
    winners: 3,
    titleKey: 'pz3_title',
    descKey: 'pz3_desc',
    details: [
      { icon: 'cash', title: 'pz3_d1', sub: 'pz3_d1s' },
      { icon: 'link', title: 'pz3_d2', sub: 'pz3_d2s' },
      { icon: 'bolt', title: 'pz3_d3', sub: 'pz3_d3s' },
    ],
  },
  {
    id: 'premium',
    icon: 'star',
    tone: 'blue',
    placeKey: 'pz4_place',
    winners: 20,
    titleKey: 'pz4_title',
    descKey: 'pz4_desc',
    details: [
      { icon: 'check', title: 'pz4_d1' },
      { icon: 'check', title: 'pz4_d2' },
      { icon: 'check', title: 'pz4_d3' },
      { icon: 'check', title: 'pz4_d4' },
    ],
    footerKey: 'pz4_foot',
  },
  {
    id: 'stars',
    icon: 'sparkles',
    tone: 'blue',
    placeKey: 'pz5_place',
    winners: 100,
    titleKey: 'pz5_title',
    descKey: 'pz5_desc',
    details: [
      { icon: 'star', title: 'pz5_d1', sub: 'pz5_d1s' },
      { icon: 'cash', title: 'pz5_d2', sub: 'pz5_d2s' },
      { icon: 'swap', title: 'pz5_d3', sub: 'pz5_d3s' },
    ],
    footerKey: 'pz5_foot',
  },
]
