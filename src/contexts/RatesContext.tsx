import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { TICKER_RATES, rate } from '../data/rates'
import type { RateChip } from '../types'

interface RatesCtx {
  ticker: RateChip[]
  /** «живые» ли курсы — мок всегда false → показываем дисклеймер */
  live: boolean
  rate: (from: string, to: string) => number
}

const Ctx = createContext<RatesCtx | null>(null)

export function RatesProvider({ children }: { children: ReactNode }) {
  const value = useMemo<RatesCtx>(
    () => ({ ticker: TICKER_RATES, live: false, rate }),
    [],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRates(): RatesCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useRates must be used within RatesProvider')
  return ctx
}
