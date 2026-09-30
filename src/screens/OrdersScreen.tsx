import { useNavigate } from 'react-router-dom'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import { useLang } from '../contexts/LanguageContext'
import { ORDERS, type OrderStatus } from '../data/orders'
import {
  IconReceipt,
  IconArrowRight,
  IconTelegram,
  IconExchange,
  IconClock,
  IconCheckCircle,
  IconClose,
} from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'

const CHAT = 'https://t.me/AllTrustMe_Ge'

const STATUS: Record<OrderStatus, { key: string; color: string; dim: string; Icon: typeof IconClock }> = {
  pending: { key: 'ord_status_pending', color: 'var(--gold)', dim: 'var(--gold-dim)', Icon: IconClock },
  confirmed: { key: 'ord_status_confirmed', color: 'var(--blue)', dim: 'var(--blue-dim)', Icon: IconCheckCircle },
  completed: { key: 'ord_status_completed', color: 'var(--green)', dim: 'var(--green-dim)', Icon: IconCheckCircle },
  cancelled: { key: 'ord_status_cancelled', color: 'var(--text3)', dim: 'var(--card2)', Icon: IconClose },
}

export default function OrdersScreen() {
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const l = lang === 'ru' ? 'ru' : 'en'
  const orders = ORDERS

  if (orders.length === 0) {
    return (
      <ScreenShell header={<TitleHeader title={t('orders_header')} back />}>
        <div className="flex flex-col items-center px-6 pt-24 text-center">
          <span className="card flex h-20 w-20 items-center justify-center rounded-full text-[var(--text3)]">
            <IconReceipt size={38} />
          </span>
          <h2 className="mt-5 text-[18px] font-bold">{t('orders_empty_title')}</h2>
          <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-[var(--text2)]">
            {t('orders_empty_sub')}
          </p>
          <button
            onClick={() => {
              haptic()
              navigate('/exchange')
            }}
            className="btn btn-primary mt-6 px-6"
          >
            <IconExchange size={18} />
            {t('orders_empty_cta')}
          </button>
        </div>
      </ScreenShell>
    )
  }

  return (
    <ScreenShell header={<TitleHeader title={t('orders_header')} back />}>
      <p className="section-label mb-3 mt-4">{t('orders_title')}</p>
      <div className="stagger flex flex-col gap-3">
        {orders.map((o) => {
          const st = STATUS[o.status]
          const active = o.status === 'pending' || o.status === 'confirmed'
          return (
            <div key={o.id} className="card p-5">
              {/* шапка: id/дата + статус */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-[13px] font-semibold">{o.id}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--text3)]">{o.date[l]}</p>
                </div>
                <span
                  className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
                  style={{ background: st.dim, color: st.color }}
                >
                  <st.Icon size={13} />
                  {t(st.key)}
                </span>
              </div>

              {/* отдал → получил */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text3)]">{t('ord_gave')}</p>
                  <p className="mt-0.5 font-mono text-[16px] font-bold">
                    {o.give.amount} <span className="text-[var(--text2)]">{o.give.ticker}</span>
                  </p>
                </div>
                <span className="shrink-0 text-[var(--text3)]">
                  <IconArrowRight size={18} />
                </span>
                <div className="flex-1 text-right">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--text3)]">{t('ord_got')}</p>
                  <p className="mt-0.5 font-mono text-[16px] font-bold text-[var(--green)]">
                    {o.get.amount} <span className="opacity-80">{o.get.ticker}</span>
                  </p>
                </div>
              </div>

              <p className="mt-3 text-[12px] text-[var(--text3)]">{o.office[l]}</p>

              {/* действия */}
              <div className="mt-4 flex gap-2">
                {active ? (
                  <button
                    onClick={() => {
                      haptic()
                      openExternal(CHAT)
                    }}
                    className="btn btn-sm btn-soft-blue flex-1"
                  >
                    <IconTelegram size={16} />
                    {t('ord_open_chat')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      haptic()
                      navigate('/exchange')
                    }}
                    className="btn btn-sm btn-secondary flex-1"
                  >
                    <IconExchange size={16} />
                    {t('ord_repeat')}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </ScreenShell>
  )
}
