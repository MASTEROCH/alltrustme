import { useState } from 'react'
import type { Currency } from '../types'

interface Props {
  currency: Currency
  size?: number
}

/** Иконка валюты: круглый логотип по URL, иначе — символьный глиф-фолбэк. */
export default function CurrencyIcon({ currency, size = 24 }: Props) {
  const [failed, setFailed] = useState(false)
  const showImg = currency.logo && !failed

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--card2)] font-mono font-semibold text-[var(--text2)]"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      {showImg ? (
        <img
          src={currency.logo}
          alt={currency.ticker}
          loading="lazy"
          width={size}
          height={size}
          className="h-full w-full object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        currency.glyph ?? currency.ticker.slice(0, 1)
      )}
    </span>
  )
}
