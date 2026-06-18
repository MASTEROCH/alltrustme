import type { RateChip } from '../types'

/* Тикер курсов на главной (мок-данные, бэкенд подключим позже). */
export const TICKER_RATES: RateChip[] = [
  { pair: 'BTC/GEL', value: '176 240', change: '+1.2%', up: true },
  { pair: 'ETH/USD', value: '9 180', change: '-0.4%', up: false },
  { pair: 'USDT/GEL', value: '2.71', change: '+0.1%', up: true },
  { pair: 'TON/USD', value: '18.40', change: '+3.8%', up: true },
  { pair: 'BNB/GEL', value: '1 620', change: '-1.1%', up: false },
  { pair: 'SOL/USD', value: '512', change: '+2.0%', up: true },
]

/* Курсы калькулятора → к USD (мок, для проверки раскладки).
   Кросс-курсы считаются через USD автоматически. */
export const USD_RATES: Record<string, number> = {
  USDT: 1.0,
  USDC: 1.0,
  DAI: 1.0,
  BTC: 96000,
  ETH: 3600,
  TON: 5.2,
  SOL: 180,
  TRX: 0.12,
  XRP: 0.52,
  BNB: 600,
  ADA: 0.45,
  MATIC: 0.55,
  LTC: 85,
  XLM: 0.11,
  USD: 1.0,
  GEL: 0.37,
}

/** Курс пары from→to через USD. */
export function rate(from: string, to: string): number {
  const f = USD_RATES[from]
  const t = USD_RATES[to]
  if (!f || !t) return 0
  return f / t
}
