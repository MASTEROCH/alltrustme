export type Lang = 'ru' | 'en' | 'ge' | 'tr' | 'ar'

export type CurrencyKind = 'crypto' | 'fiat'

export interface Currency {
  ticker: string
  name: string
  kind: CurrencyKind
  /** доступные сети (для крипты) или методы (для фиата) */
  networks: string[]
  /** URL официального логотипа (CoinGecko-ассеты) — опционально */
  logo?: string
  /** символьный глиф-фолбэк (₿, $, ₾ …) */
  glyph?: string
}

export interface Office {
  id: string
  name: string
  /** короткий адрес для показа */
  address: string
  /** полный адрес для копирования */
  addressFull: string
  hours: string
  alwaysOpen: boolean
  phone: string
  whatsapp: string
  mapsUrl: string
  boltUrl: string
  yandexUrl: string
}

export interface RateChip {
  pair: string
  value: string
  change: string
  up: boolean
}

export interface EventItem {
  id: string
  illo: 'fire' | 'mic' | 'glasses'
  title: string
  date: string
  city: string
  attendees: number
  desc: string
  gradient: string
  link?: string
  past: boolean
}

export interface ExchangeSummary {
  give: string
  get: string
  office: string
  promo: string
}
