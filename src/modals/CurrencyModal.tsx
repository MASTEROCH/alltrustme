import { useMemo, useState } from 'react'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { CURRENCIES } from '../data/currencies'
import CurrencyIcon from '../components/CurrencyIcon'
import { IconSearch, IconCheck } from '../components/icons'
import { hapticSelection } from '../utils/telegram'
import type { Currency } from '../types'

interface Props {
  selected: string
  onSelect: (ticker: string) => void
  onClose: () => void
}

export default function CurrencyModal({ selected, onSelect, onClose }: Props) {
  const { t } = useLang()
  const [q, setQ] = useState('')

  const { crypto, fiat } = useMemo(() => {
    const term = q.trim().toLowerCase()
    const match = (c: Currency) =>
      !term || c.ticker.toLowerCase().includes(term) || c.name.toLowerCase().includes(term)
    return {
      crypto: CURRENCIES.filter((c) => c.kind === 'crypto' && match(c)),
      fiat: CURRENCIES.filter((c) => c.kind === 'fiat' && match(c)),
    }
  }, [q])

  const pick = (ticker: string) => {
    hapticSelection()
    onSelect(ticker)
    onClose()
  }

  const Row = ({ c }: { c: Currency }) => {
    const active = c.ticker === selected
    return (
      <button
        onClick={() => pick(c.ticker)}
        className={`card press flex w-full items-center gap-3 px-3 py-3.5 text-left ${active ? 'is-selected' : ''}`}
        style={{ borderRadius: 'var(--rs)' }}
      >
        <CurrencyIcon currency={c} size={30} />
        <span className="flex flex-1 flex-col">
          <span className="font-mono text-[15px] font-semibold">{c.ticker}</span>
          <span className="text-[12px] text-[var(--text3)]">{c.name}</span>
        </span>
        {c.networks.length > 1 && (
          <span className="text-[11px] text-[var(--text3)]">{t('networks_n', { n: c.networks.length })}</span>
        )}
        {active && (
          <span className="text-[var(--blue)]">
            <IconCheck size={18} />
          </span>
        )}
      </button>
    )
  }

  return (
    <ModalOverlay title={t('sel_cur')} onClose={onClose}>
      <div className="card mb-3 flex items-center gap-2 px-3" style={{ borderRadius: 'var(--rs)' }}>
        <span className="text-[var(--text3)]">
          <IconSearch size={18} />
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('cur_search')}
          className="w-full bg-transparent py-3 text-[16px] outline-none placeholder:text-[var(--text3)]"
          autoFocus
        />
      </div>

      {crypto.length > 0 && (
        <>
          <p className="section-label mb-2 mt-1">{t('cur_crypto')}</p>
          <div className="mb-3 flex flex-col gap-1.5">
            {crypto.map((c) => (
              <Row key={c.ticker} c={c} />
            ))}
          </div>
        </>
      )}

      {fiat.length > 0 && (
        <>
          <p className="section-label mb-2">{t('cur_fiat')}</p>
          <div className="flex flex-col gap-1.5">
            {fiat.map((c) => (
              <Row key={c.ticker} c={c} />
            ))}
          </div>
        </>
      )}
    </ModalOverlay>
  )
}
