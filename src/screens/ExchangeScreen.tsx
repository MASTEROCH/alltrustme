import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import CurrencyIcon from '../components/CurrencyIcon'
import CurrencyModal from '../modals/CurrencyModal'
import QuickSend from '../components/QuickSend'
import PromoModal from '../modals/PromoModal'
import ExchangeInfoModal, { EXINFO_FLAG } from '../modals/ExchangeInfoModal'
import { useLang } from '../contexts/LanguageContext'
import { useExchange } from '../hooks/useExchange'
import { getFlag } from '../utils/persist'
import { OFFICES } from '../data/offices'
import { rate } from '../data/rates'
import { networkFeeUsd, SERVICE_FEE_PCT } from '../data/fees'
import { parseAmount, formatAmount } from '../utils/format'
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
  const ex = useExchange()

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

  // выбранная сеть/метод (верхний-правый селектор карточки, как «Arbitrum ⌄»)
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
    // первый раз — показать инфо-модалку перехода; далее сразу
    if (!getFlag(EXINFO_FLAG)) setInfoOpen(true)
    else proceed()
  }

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
              className="press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text2)]"
            >
              <IconClock size={18} />
            </button>
          }
        />
      }
    >
      {/* FROM / SWAP / TO — swap-карточки, кнопка строго на шве */}
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
        />

        {/* круглая swap-кнопка внахлёст ровно по центру шва между карточками */}
        <div className="relative z-10 -my-6 flex justify-center">
          <button
            onClick={onSwap}
            aria-label="Swap"
            className="press flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-300"
            style={{
              background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 55%, var(--blue2))',
              boxShadow: '0 6px 20px var(--blue-glow), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 5px var(--bg)',
              transform: `rotate(${swapSpin ? 180 : 0}deg)`,
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
        <p className="mt-2 flex items-center justify-center gap-1.5 px-2 text-center text-[12px] font-medium text-[var(--red)]">
          {t('ex_min_hint', { min: '$' + MIN_USD })}
        </p>
      ) : (
        <p className="mt-2 px-2 text-center text-[12px] text-[var(--text3)]">{t('to_hint')}</p>
      )}

      {/* QUICK SEND — недавние получатели */}
      <QuickSend />

      {/* OFFICE */}
      <p className="section-label mt-6 mb-2">{t('office')}</p>
      <div className="overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)]">
        {OFFICES.map((o, i) => {
          const selected = o.id === officeId
          return (
            <button
              key={o.id}
              onClick={() => {
                hapticSelection()
                setOfficeId(o.id)
              }}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors"
              style={{
                background: selected ? 'var(--blue-dim)' : 'transparent',
                borderTop: i ? '1px solid var(--border)' : 'none',
              }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full transition-all"
                style={{
                  background: selected ? 'var(--blue)' : 'var(--text3)',
                  boxShadow: selected ? '0 0 8px var(--blue)' : 'none',
                }}
              />
              <span className="flex flex-1 flex-col">
                <span className="flex items-center gap-1.5 text-[15px] font-medium">
                  {o.name}
                  {o.alwaysOpen && <IconPlane size={14} />}
                </span>
                <span
                  className="text-[12px]"
                  style={{ color: o.alwaysOpen ? 'var(--blue)' : 'var(--green)' }}
                >
                  {o.alwaysOpen ? t('always_open') : t('open_status')}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* METHOD */}
      <p className="section-label mt-6 mb-2">{t('method')}</p>
      <div className="flex gap-2">
        {methods.map((m) => {
          const active = m === method
          const Icon = m === 'cash' ? IconCash : m === 'card' ? IconCard : IconWallet
          return (
            <button
              key={m}
              onClick={() => {
                hapticSelection()
                setMethod(m)
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-[var(--rs)] border-[1.5px] py-3 text-[14px] font-medium transition-all active:scale-[0.97]"
              style={{
                background: active ? 'var(--blue-dim)' : 'var(--card)',
                borderColor: active ? 'var(--blue)' : 'var(--border)',
                color: active ? 'var(--blue)' : 'var(--text)',
              }}
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
        className="press mt-6 flex w-full items-center gap-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] px-5 py-3.5 text-left"
      >
        <span className="text-[var(--blue)]">
          <IconTicket size={20} />
        </span>
        <span className="flex-1 text-[14px]">
          {t('promo_label')}: <span className="font-mono font-semibold text-[var(--blue)]">{promo}</span>
        </span>
        <span className="text-[13px] text-[var(--text3)]">{t('change')}</span>
      </button>

      {/* CTA */}
      <button
        onClick={goExchange}
        className="relative overflow-hidden shine mt-6 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-4 text-[15px] font-bold text-white transition-all active:scale-[0.98]"
        style={{
          background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 50%, var(--blue2))', color: 'var(--on-accent)',
          boxShadow: '0 8px 28px var(--blue-glow)',
          opacity: canProceed ? 1 : 0.45,
        }}
      >
        <span style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}>
          <IconArrowRight size={19} />
        </span>
        {t('go_ex')}
      </button>
      <p className="mt-2.5 px-2 text-center text-[12px] text-[var(--text3)]">{t('go_ex_disclaimer')}</p>

      {modalSide && (
        <CurrencyModal
          selected={modalSide === 'from' ? ex.from : ex.to}
          onSelect={(tk) => (modalSide === 'from' ? ex.selectFrom(tk) : ex.selectTo(tk))}
          onClose={() => setModalSide(null)}
        />
      )}
      {promoOpen && (
        <PromoModal initial={promo} onApply={setPromo} onClose={() => setPromoOpen(false)} />
      )}
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

/** Прозрачная сводка: курс, сервисная комиссия (0%), сетевой сбор и итог.
   Появляется плавно, когда сумма валидна. */
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

  // сетевой сбор берём только при получении крипты, конвертируем USD → валюту «to»
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
    <div className="mt-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] px-5 py-3">
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
}) {
  const multiNet = (cur?.networks.length ?? 0) > 1
  return (
    <div
      className={`rounded-[var(--r)] bg-[var(--card)] p-5 transition-colors ${
        error
          ? 'border-[1.5px] border-[var(--red)]'
          : focusRing
            ? 'border-[1.5px] border-[var(--border)] focus-within:border-[var(--blue)]'
            : 'border border-[var(--border)]'
      }`}
    >
      {/* верх: лейбл + селектор сети */}
      <div className="flex items-center justify-between">
        <span className="section-label">{label}</span>
        {net && (
          <button
            onClick={onCycleNet}
            className="flex items-center gap-1 rounded-full bg-[var(--card2)] px-2.5 py-1 text-[12px] font-medium text-[var(--text2)] transition-transform active:scale-95"
          >
            {net}
            {multiNet && <IconChevronDown size={13} className="text-[var(--text3)]" />}
          </button>
        )}
      </div>

      {/* середина: монета-пилюля слева + крупная сумма справа */}
      <div className="mt-3.5 flex items-center justify-between gap-3">
        <button
          onClick={() => {
            haptic()
            onPickCur()
          }}
          className="press flex shrink-0 items-center gap-2 rounded-full bg-[var(--card2)] py-2 pl-2 pr-3"
        >
          {cur && <CurrencyIcon currency={cur} size={28} />}
          <span className="font-mono text-[17px] font-bold">{cur?.ticker}</span>
          <IconChevronDown size={16} className="text-[var(--text3)]" />
        </button>
        <input
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmount(e.target.value)}
          placeholder="0"
          className="w-0 flex-1 bg-transparent text-right font-mono text-[30px] font-bold outline-none placeholder:text-[var(--text3)]"
          style={amountColor ? { color: amountColor } : undefined}
        />
      </div>

      {/* низ: фиат-эквивалент справа */}
      <div className="mt-2 flex justify-end">
        <span className="font-mono text-[12px] text-[var(--text3)]">≈ {fiat}</span>
      </div>
    </div>
  )
}
