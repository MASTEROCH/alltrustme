import { useState } from 'react'
import type { Currency } from '../types'

interface Props {
  currency: Currency
  size?: number
}

/** Иконка валюты: символьный глиф — всегда подложкой, логотип по URL проявляется поверх,
   когда загрузился. Раньше до загрузки (и на медленной сети) стоял пустой круг. */
export default function CurrencyIcon({ currency, size = 24 }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'failed'>('loading')
  const showImg = currency.logo && state !== 'failed'

  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--card2)] font-mono font-semibold text-[var(--text2)]"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      <span aria-hidden={state === 'ok'} style={{ opacity: state === 'ok' ? 0 : 1 }}>
        {currency.glyph ?? currency.ticker.slice(0, 1)}
      </span>
      {showImg && (
        <img
          src={currency.logo}
          alt={currency.ticker}
          loading="lazy"
          width={size}
          height={size}
          className="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
          style={{ opacity: state === 'ok' ? 1 : 0 }}
          onLoad={() => setState('ok')}
          onError={() => setState('failed')}
        />
      )}
    </span>
  )
}
