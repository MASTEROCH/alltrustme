import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import CurrencyIcon from '../components/CurrencyIcon'
import CurrencyModal from '../modals/CurrencyModal'
import QuickSend from '../components/QuickSend'
import PromoModal from '../modals/PromoModal'
import ExchangeInfoModal, { EXINFO_FLAG } from '../modals/ExchangeInfoModal'
import { useLang } from '../contexts/LanguageContext'
import { useExchange, type ExchangeInit } from '../hooks/useExchange'
import { getFlag } from '../utils/persist'
import { OFFICES } from '../data/offices'
import { rate } from '../data/rates'
import { networkFeeUsd, SERVICE_FEE_PCT } from '../data/fees'
import { parseAmount, formatAmount } from '../utils/format'
import { officeStatus } from '../utils/office'
import type { Currency } from '../types'
import {
  IconChevronDown,
  IconSwapV,
  IconTicket,
  IconArrowRight,
  IconCash,
  IconCard,
  IconWallet,
  IconPlane,
  IconShield,
  IconClock,
  IconCheck,
} from '../components/icons'
import { haptic, hapticSelection } from '../utils/telegram'

/** Фиат-эквивалент суммы в USD: «≈ $X». */
function fiatEquiv(amount: string, ticker: string): string {
  const usd = parseAmount(amount) * rate(ticker, 'USD')
  if (!usd) return '$0.00'
  return '$' + formatAmount(Math.round(usd * 100) / 100)
}

export default function ExchangeScreen() {
  const { t, rtl } = useLang()
  const navigate = useNavigate()
  // стартовая пара может прийти из тапа по тикеру на главной
  const init = (useLocation().state ?? undefined) as ExchangeInit | undefined
  const ex = useExchange(init)

  const [officeId, setOfficeId] = useState(OFFICES[0].id)
  const [swapSpin, setSwapSpin] = useState(false)
  const [modalSide, setModalSide] = useState<'from' | 'to' | null>(null)
  const [promoOpen, setPromoOpen] = useState(false)
  const [promo, setPromo] = useState('APPHUB')
  const [infoOpen, setInfoOpen] = useState(false)

  // минимальная сумма обмена (мок-лимит; backend пришлёт реальный из /limits)
  const MIN_USD = 50
  const fromUsd = parseAmount(ex.fromAmount) * rate(ex.from, 'USD')
  const belowMin = fromUsd > 0 && fromUsd < MIN_USD
  const canProceed = ex.valid && !belowMin

  const toIsFiat = ex.toCur?.kind === 'fiat'
  const methods = toIsFiat ? ['cash', 'card'] : ['wallet']
  const [method, setMethod] = useState('cash')
  useEffect(() => {
    setMethod(methods[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toIsFiat])

  const [fromNet, setFromNet] = useState('')
  const [toNet, setToNet] = useState('')
  useEffect(() => setFromNet(ex.fromCur?.networks[0] ?? ''), [ex.from, ex.fromCur])
  useEffect(() => setToNet(ex.toCur?.networks[0] ?? ''), [ex.to, ex.toCur])
  const cycleNet = (cur: Currency | undefined, net: string, set: (n: string) => void) => {
    const nets = cur?.networks ?? []
    if (nets.length < 2) return
    hapticSelection()
    set(nets[(nets.indexOf(net) + 1) % nets.length])
  }

  const onSwap = () => {
    haptic('medium')
    setSwapSpin((s) => !s)
    ex.swap()
  }

  const proceed = () => {
    const office = OFFICES.find((o) => o.id === officeId)
    navigate('/exchange/success', {
      state: {
        give: `${ex.fromAmount} ${ex.from}`,
        get: `${ex.toAmount} ${ex.to}`,
        office: office?.name ?? '',
        promo,
      },
    })
  }

  const goExchange = () => {
    if (!canProceed) return
    haptic('medium')
    if (!getFlag(EXINFO_FLAG)) setInfoOpen(true)
    else proceed()
  }

  const methodIdx = Math.max(0, methods.indexOf(method))

  return (
    <ScreenShell
      header={
        <TitleHeader
          title={t('ex_header')}
          right={
            <button
              onClick={() => {
                haptic()
                navigate('/orders')
              }}
              aria-label={t('orders_history_a11y')}
              className="btn-icon"
            >
              <IconClock size={18} />
            </button>
          }
        />
      }
    >
      {/* FROM / SWAP / TO */}
      <div className="mt-2 flex flex-col">
        <SideCard
          label={t('give')}
          cur={ex.fromCur}
          amount={ex.fromAmount}
          onAmount={ex.onFromAmount}
          onPickCur={() => setModalSide('from')}
          net={fromNet}
          onCycleNet={() => cycleNet(ex.fromCur, fromNet, setFromNet)}
          fiat={fiatEquiv(ex.fromAmount, ex.from)}
          focusRing
          error={belowMin}
          autoFocus
        />

        <div className="relative z-10 -my-6 flex justify-center">
          <button
            onClick={onSwap}
            aria-label="Swap"
            className="btn btn-primary"
            style={{
              width: 48,
              height: 48,
              minHeight: 0,
              padding: 0,
              borderRadius: 999,
              boxShadow: '0 6px 20px var(--blue-glow), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 5px var(--bg)',
              transform: `rotate(${swapSpin ? 180 : 0}deg)`,
              transition: 'transform var(--dur-3) var(--spring)',
            }}
          >
            <IconSwapV size={20} />
          </button>
        </div>

        <SideCard
          label={t('get')}
          cur={ex.toCur}
          amount={ex.toAmount}
          onAmount={ex.onToAmount}
          onPickCur={() => setModalSide('to')}
          net={toNet}
          onCycleNet={() => cycleNet(ex.toCur, toNet, setToNet)}
          fiat={fiatEquiv(ex.toAmount, ex.to)}
          amountColor="var(--green)"
        />
      </div>

      {/* Детали обмена: курс + прозрачные комиссии + итог */}
      <FeeSummary
        from={ex.from}
        to={ex.to}
        toAmount={ex.toAmount}
        toIsCrypto={ex.toCur?.kind === 'crypto'}
        toNet={toNet}
        rateVal={rate(ex.from, ex.to)}
        show={ex.valid}
      />
      {belowMin ? (
        <p className="mt-2 px-2 text-center text-[12px] font-medium text-[var(--red)]" role="alert">
          {t('ex_min_hint', { min: '$' + MIN_USD })}
        </p>
      ) : (
        <p className="mt-2 px-2 text-center text-[12px] leading-snug text-[var(--text3)]">{t('to_hint')}</p>
      )}

      {/* QUICK SEND — недавние получатели */}
      <QuickSend />

      {/* OFFICE — iOS grouped list с чекмарком и живым статусом */}
      <p className="section-label mt-6 mb-2">{t('office')}</p>
      <div className="card list" role="radiogroup" aria-label={t('office')}>
        {OFFICES.map((o) => {
          const selected = o.id === officeId
          const st = officeStatus(o)
          const statusText = o.alwaysOpen
            ? t('always_open_full')
            : st.open
              ? t('open_until', { t: st.until ?? '' })
              : t('closed_opens', { t: st.opensAt ?? '' })
          return (
            <button
              key={o.id}
              role="radio"
              aria-checked={selected}
              onClick={() => {
                hapticSelection()
                setOfficeId(o.id)
              }}
              className={`row ${selected ? 'is-selected' : ''}`}
            >
              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-1.5 text-[15px] font-semibold">
                  {o.name}
                  {o.alwaysOpen && <IconPlane size={14} className="text-[var(--blue)]" />}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: o.alwaysOpen ? 'var(--blue)' : st.open ? 'var(--green)' : 'var(--text3)' }}
                >
                  {statusText}
                </span>
              </span>
              <span className={`check ${selected ? 'is-on' : ''}`}>
                <IconCheck size={13} strokeWidth={3} />
              </span>
            </button>
          )
        })}
      </div>

      {/* METHOD — сегмент-контрол со скользящим ползунком */}
      <p className="section-label mt-6 mb-2">{t('method')}</p>
      <div className="seg" style={{ '--n': methods.length } as React.CSSProperties} role="tablist">
        <span className="seg-thumb" style={{ '--i': methodIdx } as React.CSSProperties} aria-hidden="true" />
        {methods.map((m) => {
          const active = m === method
          const Icon = m === 'cash' ? IconCash : m === 'card' ? IconCard : IconWallet
          return (
            <button
              key={m}
              role="tab"
              aria-selected={active}
              onClick={() => {
                hapticSelection()
                setMethod(m)
              }}
              className={`seg-item ${active ? 'is-on' : ''}`}
            >
              <Icon size={17} />
              {t(m)}
            </button>
          )
        })}
      </div>

      {/* PROMO */}
      <button
        onClick={() => {
          haptic()
          setPromoOpen(true)
        }}
        className="card press mt-6 flex w-full items-center gap-3 px-5 py-3.5 text-left"
      >
        <span className="text-[var(--blue)]">
          <IconTicket size={20} />
        </span>
        <span className="flex-1 text-[14px]">
          {t('promo_label')}: <span className="font-mono font-semibold text-[var(--blue)]">{promo}</span>
        </span>
        <span className="text-[13px] font-medium text-[var(--blue)]">{t('change')}</span>
      </button>

      {/* CTA — disabled по-настоящему, причина — в подписи */}
      <button onClick={goExchange} disabled={!canProceed} className="btn btn-primary btn-block mt-6">
        <span style={{ transform: rtl ? 'scaleX(-1)' : 'none', display: 'inline-flex' }}>
          <IconArrowRight size={19} />
        </span>
        {t('go_ex')}
      </button>
      <p className="mt-2.5 px-2 text-center text-[12px] leading-snug text-[var(--text3)]">
        {canProceed ? t('go_ex_disclaimer') : ex.valid ? t('ex_min_hint', { min: '$' + MIN_USD }) : t('enter_amount')}
      </p>

      {modalSide && (
        <CurrencyModal
          selected={modalSide === 'from' ? ex.from : ex.to}
          onSelect={(tk) => (modalSide === 'from' ? ex.selectFrom(tk) : ex.selectTo(tk))}
          onClose={() => setModalSide(null)}
        />
      )}
      {promoOpen && <PromoModal initial={promo} onApply={setPromo} onClose={() => setPromoOpen(false)} />}
      {infoOpen && (
        <ExchangeInfoModal
          onProceed={() => {
            setInfoOpen(false)
            proceed()
          }}
          onClose={() => setInfoOpen(false)}
        />
      )}
    </ScreenShell>
  )
}

/** Прозрачная сводка: курс, сервисная комиссия (0%), сетевой сбор и итог. */
function FeeSummary({
  from,
  to,
  toAmount,
  toIsCrypto,
  toNet,
  rateVal,
  show,
}: {
  from: string
  to: string
  toAmount: string
  toIsCrypto: boolean
  toNet: string
  rateVal: number
  show: boolean
}) {
  const { t } = useLang()
  if (!show) {
    return (
      <p className="mt-3 text-center font-mono text-[13px] text-[var(--text2)]">
        1 {from} = <span className="font-bold text-[var(--text)]">{formatAmount(rateVal)}</span> {to}
      </p>
    )
  }

  const feeUsd = toIsCrypto ? networkFeeUsd(toNet) : 0
  const feeInTo = feeUsd * rate('USD', to)
  const received = Math.max(0, parseAmount(toAmount) - feeInTo)

  const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-1.5 text-[13px]">
      <span className="text-[var(--text3)]">{label}</span>
      <span className="font-mono font-medium text-[var(--text2)]">{children}</span>
    </div>
  )

  return (
    <div className="card rise mt-3 px-5 py-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="section-label">{t('fee_details')}</span>
        <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--green)]">
          <IconShield size={12} />
          {t('fee_no_hidden')}
        </span>
      </div>

      <Row label={t('fee_rate')}>
        1 {from} = {formatAmount(rateVal)} {to}
      </Row>
      <Row label={t('fee_service')}>
        <span className="rounded-full bg-[var(--green-dim)] px-2 py-0.5 text-[12px] font-semibold text-[var(--green)]">
          {SERVICE_FEE_PCT === 0 ? t('fee_service_free') : `${SERVICE_FEE_PCT}%`}
        </span>
      </Row>
      {toIsCrypto && feeUsd > 0 && (
        <Row label={t('fee_network')}>
          <span className="text-[var(--text2)]">
            ≈ {formatAmount(feeInTo)} {to}
          </span>
          <span className="ml-1.5 text-[11px] text-[var(--text3)]">· {t('fee_network_note')}</span>
        </Row>
      )}

      <div className="mt-1.5 flex items-center justify-between border-t border-[var(--border)] pt-2.5">
        <span className="text-[14px] font-semibold">{t('fee_total')}</span>
        <span className="font-mono text-[17px] font-bold text-[var(--green)]">
          {formatAmount(received)} {to}
        </span>
      </div>
    </div>
  )
}

function SideCard({
  label,
  cur,
  amount,
  onAmount,
  onPickCur,
  net,
  onCycleNet,
  fiat,
  focusRing,
  amountColor,
  error,
  autoFocus,
}: {
  label: string
  cur: Currency | undefined
  amount: string
  onAmount: (v: string) => void
  onPickCur: () => void
  net: string
  onCycleNet: () => void
  fiat: string
  focusRing?: boolean
  amountColor?: string
  error?: boolean
  autoFocus?: boolean
}) {
  const multiNet = (cur?.networks.length ?? 0) > 1
  // крупная сумма ужимается, когда цифр много (32 → 22px), чтобы не ломать строку
  const len = amount.replace(/\s/g, '').length
  const fontSize = len > 12 ? 20 : len > 9 ? 24 : len > 7 ? 28 : 32
  return (
    <div
      className={`card p-5 transition-colors ${
        error
          ? 'border-[1.5px] border-[var(--red)]'
          : focusRing
            ? 'border-[1.5px] focus-within:border-[var(--blue)]'
            : ''
      }`}
      style={error ? { boxShadow: '0 0 0 4px rgba(255,90,106,0.12)' } : undefined}
    >
      <div className="flex items-center justify-between">
        <span className="section-label">{label}</span>
        {net && (
          <button
            onClick={onCycleNet}
            className="card-inset press flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-[var(--text2)]"
            aria-label={net}
          >
            {net}
            {multiNet && <IconChevronDown size={13} className="text-[var(--text3)]" />}
          </button>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            haptic()
            onPickCur()
          }}
          className="card-inset press flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-3"
        >
          {cur && <CurrencyIcon currency={cur} size={28} />}
          <span className="font-mono text-[17px] font-bold">{cur?.ticker}</span>
          <IconChevronDown size={16} className="text-[var(--text3)]" />
        </button>
        <input
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          placeholder="0"
          autoFocus={autoFocus}
          aria-label={label}
          className="w-0 flex-1 bg-transparent text-right font-mono font-bold outline-none placeholder:text-[var(--text3)]"
          style={{
            fontSize,
            transition: 'font-size var(--dur-2) ease',
            ...(amountColor ? { color: amountColor } : null),
          }}
        />
      </div>

      <div className="mt-2 flex justify-end">
        <span className="font-mono text-[12px] text-[var(--text3)]">≈ {fiat}</span>
      </div>
    </div>
  )
}
