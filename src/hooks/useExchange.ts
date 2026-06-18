import { useCallback, useMemo, useState } from 'react'
import { useRates } from '../contexts/RatesContext'
import { getCurrency } from '../data/currencies'
import { formatAmount, parseAmount } from '../utils/format'

type Side = 'from' | 'to'

/** Двунаправленный калькулятор обмена (курсы — мок). */
export function useExchange() {
  const { rate } = useRates()
  const [from, setFrom] = useState('USDT')
  const [to, setTo] = useState('USD')
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [active, setActive] = useState<Side>('from')

  const recompute = useCallback(
    (f: string, tk: string, amt: string, side: Side) => {
      const r = rate(side === 'from' ? f : tk, side === 'from' ? tk : f)
      const val = parseAmount(amt)
      if (!val) return ''
      return formatAmount(val * r)
    },
    [rate],
  )

  const onFromAmount = useCallback(
    (v: string) => {
      setActive('from')
      setFromAmount(v)
      setToAmount(recompute(from, to, v, 'from'))
    },
    [from, to, recompute],
  )

  const onToAmount = useCallback(
    (v: string) => {
      setActive('to')
      setToAmount(v)
      setFromAmount(recompute(from, to, v, 'to'))
    },
    [from, to, recompute],
  )

  /** Смена валюты: активное поле сохраняется, второе пересчитывается. */
  const selectFrom = useCallback(
    (ticker: string) => {
      setFrom(ticker)
      if (active === 'from') setToAmount(recompute(ticker, to, fromAmount, 'from'))
      else setFromAmount(recompute(ticker, to, toAmount, 'to'))
    },
    [active, to, fromAmount, toAmount, recompute],
  )

  const selectTo = useCallback(
    (ticker: string) => {
      setTo(ticker)
      if (active === 'from') setToAmount(recompute(from, ticker, fromAmount, 'from'))
      else setFromAmount(recompute(from, ticker, toAmount, 'to'))
    },
    [active, from, fromAmount, toAmount, recompute],
  )

  const swap = useCallback(() => {
    const nf = to
    const nt = from
    setFrom(nf)
    setTo(nt)
    setActive('from')
    // сохраняем введённую сумму «отдаю», пересчитываем «получаю»
    const keep = fromAmount
    setFromAmount(keep)
    setToAmount(recompute(nf, nt, keep, 'from'))
  }, [from, to, fromAmount, recompute])

  const fromCur = useMemo(() => getCurrency(from), [from])
  const toCur = useMemo(() => getCurrency(to), [to])
  const valid = parseAmount(fromAmount) > 0

  return {
    from,
    to,
    fromAmount,
    toAmount,
    fromCur,
    toCur,
    valid,
    onFromAmount,
    onToAmount,
    selectFrom,
    selectTo,
    swap,
  }
}
