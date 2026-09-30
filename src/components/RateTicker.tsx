import { useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useRates } from '../contexts/RatesContext'
import { IconWarning } from './icons'
import { haptic } from '../utils/telegram'

/** Детерминированный мини-спарклайн (path) из строки-пары + направления. */
function sparkPath(seed: string, up: boolean): string {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  const n = 8
  const w = 50
  const hgt = 18
  const ys: number[] = []
  for (let i = 0; i < n; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0
    const r = (h % 1000) / 1000
    ys.push(hgt - 2 - r * (hgt - 4))
  }
  ys[n - 1] = up ? Math.min(...ys) : Math.max(...ys)
  ys[0] = up ? Math.max(...ys) : Math.min(...ys)
  let d = `M0 ${ys[0].toFixed(1)}`
  for (let i = 1; i < n; i++) d += ` L${((i / (n - 1)) * w).toFixed(1)} ${ys[i].toFixed(1)}`
  return d
}

/** Бесшовная бегущая лента курсов. Каждая пара — живая: тап открывает калькулятор
   с этой парой (раньше лента была «мёртвым» UI). */
export default function RateTicker() {
  const { t } = useLang()
  const { ticker, live } = useRates()
  const navigate = useNavigate()
  const doubled = [...ticker, ...ticker]

  const openPair = (pair: string) => {
    const [from, to] = pair.split('/')
    haptic()
    navigate('/exchange', { state: { from, to } })
  }

  return (
    <div className="liquid-glass relative overflow-hidden rounded-[var(--r)] p-4">
      {/* mask-фейд: карточки растворяются по краям, а не режутся */}
      <div
        className="overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <div className="ticker-scroll flex w-max gap-2">
          {doubled.map((r, i) => (
            <button
              key={i}
              onClick={() => openPair(r.pair)}
              aria-label={`${r.pair} ${r.value}`}
              tabIndex={i >= ticker.length ? -1 : 0}
              className="card-inset press flex shrink-0 flex-col items-start gap-1 px-3.5 py-3 text-start"
            >
              <span className="text-[12px] text-[var(--text3)]">{r.pair}</span>
              <svg
                width="50"
                height="18"
                viewBox="0 0 50 18"
                fill="none"
                aria-hidden="true"
                className="my-0.5"
                style={{ color: r.up ? 'var(--green)' : 'var(--red)' }}
              >
                <path d={`${sparkPath(r.pair, r.up)} L50 22 L0 22 Z`} fill="currentColor" opacity="0.12" />
                <path
                  d={sparkPath(r.pair, r.up)}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-mono text-[15px] font-bold">{r.value}</span>
              <span
                className="inline-flex w-fit items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                style={{
                  background: r.up ? 'var(--green-dim)' : 'rgba(255,90,106,0.15)',
                  color: r.up ? 'var(--green)' : 'var(--red)',
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
                  <path d={r.up ? 'M4 1 7 6H1Z' : 'M4 7 1 2h6Z'} fill="currentColor" />
                </svg>
                {r.change.replace(/^[+-]/, '')}
              </span>
            </button>
          ))}
        </div>
      </div>
      {!live && (
        <p className="relative z-20 mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] leading-snug text-[var(--text3)]">
          <IconWarning size={14} className="shrink-0 text-[var(--gold)]" />
          {t('ticker_warn')}
        </p>
      )}
    </div>
  )
}
