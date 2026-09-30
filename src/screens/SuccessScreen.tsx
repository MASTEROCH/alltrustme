import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { IconClose, IconShare, IconTicket, IconTelegram } from '../components/icons'
import { haptic, hapticNotify, openExternal } from '../utils/telegram'
import { shareStory, copyLink, tgShareUrl } from '../utils/share'
import type { ExchangeSummary } from '../types'

const CHAT = 'https://t.me/AllTrustMe_Ge'
const CONFETTI_COLORS = ['var(--blue)', 'var(--cyan)', 'var(--green)', 'var(--gold)', '#fff', 'var(--violet)']

/** Пиковый момент — единственный cinematic в продукте: рисующаяся галочка,
   расходящееся кольцо, короткий залп конфетти, success-haptic. */
export default function SuccessScreen() {
  const { t } = useLang()
  const navigate = useNavigate()
  const { toast } = useToast()
  const state = (useLocation().state ?? null) as Partial<ExchangeSummary> | null

  const give = state?.give ?? '—'
  const get = state?.get ?? '—'
  const office = state?.office || t('default_office')
  const promo = state?.promo ?? 'APPHUB'

  useEffect(() => {
    hapticNotify('success')
  }, [])

  // детерминированный залп: 18 частиц по кругу с разбросом
  const confetti = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.35
        const r = 90 + (i % 4) * 26
        return {
          x: Math.round(Math.cos(a) * r),
          y: Math.round(Math.sin(a) * r - 40),
          rot: 360 + (i % 5) * 120,
          d: (i % 6) * 0.04,
          c: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        }
      }),
    [],
  )

  const home = () => {
    haptic()
    navigate('/', { replace: true })
  }

  const onStory = async () => {
    haptic('medium')
    const media = `${window.location.origin}${import.meta.env.BASE_URL}alltrust-logo.svg`
    const res = await shareStory(t('share_text'), media)
    if (res === 'shared') toast(t('toast_shared'))
    else if (res === 'copied') toast(t('toast_text_copied'))
    else toast(t('toast_copy_failed'))
  }

  const onInvite = async () => {
    haptic()
    // в Telegram — сразу share-лист чата; вне — копируем ссылку
    if (window.Telegram?.WebApp?.initData) {
      openExternal(tgShareUrl(t('share_text')))
      return
    }
    toast((await copyLink()) ? t('toast_link_copied') : t('toast_copy_failed'))
  }

  const rows: Array<[string, React.ReactNode]> = [
    [t('give_label'), <span className="font-mono font-semibold">{give}</span>],
    [t('get_label'), <span className="font-mono font-semibold text-[var(--green)]">{get}</span>],
    [t('office_label'), <span className="font-medium">{office}</span>],
    [t('promo_short'), <span className="font-mono font-semibold text-[var(--blue)]">{promo}</span>],
  ]

  return (
    <div className="screen">
      <header className="chrome-header flex items-center justify-between px-4 py-3.5">
        <button onClick={home} className="btn-icon" aria-label={t('close')}>
          <IconClose size={18} />
        </button>
        <h1 className="text-[16px] font-bold tracking-tight">{t('suc_header')}</h1>
        <span className="w-9" />
      </header>

      <div className="scroll scroll-hide relative flex flex-col items-center px-6 pt-6 text-center" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom,0px) + 28px)' }}>
        {/* конфетти-слой */}
        <div className="confetti" aria-hidden="true">
          {confetti.map((p, i) => (
            <i
              key={i}
              style={
                {
                  '--x': `${p.x}px`,
                  '--y': `${p.y}px`,
                  '--rot': `${p.rot}deg`,
                  '--d': `${p.d}s`,
                  '--c': p.c,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative mt-4">
          <span className="halo" aria-hidden="true" />
          <div
            className="ring-pop relative flex h-[104px] w-[104px] items-center justify-center rounded-full border-2 border-[var(--green)] text-[var(--green)]"
            style={{ background: 'var(--green-dim)', boxShadow: '0 0 48px rgba(47,210,126,0.35), inset 0 1px 0 rgba(255,255,255,0.2)' }}
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path className="check-draw" d="M4.5 12.5 9.5 17.5 19.5 6.5" />
            </svg>
          </div>
        </div>

        <h2 className="mt-6 text-[24px] font-extrabold tracking-[-0.02em]">{t('data_sent')}</h2>
        <p className="mt-2.5 max-w-[300px] text-[14px] leading-relaxed text-[var(--text2)]">{t('suc_sub')}</p>

        {/* петля лояльности: этот обмен = билет розыгрыша */}
        <button
          onClick={() => {
            haptic()
            navigate('/raffle')
          }}
          className="press mt-4 inline-flex items-center gap-1.5 rounded-full border border-[rgba(245,176,66,0.3)] bg-[var(--gold-dim)] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--gold)]"
        >
          <IconTicket size={15} />
          {t('suc_ticket')}
        </button>

        <div className="card list mt-6 w-full text-left">
          {rows.map(([label, value], i) => (
            <div key={i} className="row justify-between text-[15px]" style={{ paddingTop: '0.8rem', paddingBottom: '0.8rem' }}>
              <span className="text-[var(--text2)]">{label}</span>
              {value}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            haptic()
            openExternal(CHAT)
          }}
          className="btn btn-primary btn-block mt-6"
        >
          <IconTelegram size={19} />
          {t('ord_open_chat')}
        </button>
        <button onClick={home} className="btn btn-secondary btn-block mt-2.5">
          {t('back_home')}
        </button>

        <div className="mt-4 flex w-full gap-2">
          <button
            onClick={onStory}
            className="btn btn-sm flex-1 text-white"
            style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)' }}
          >
            <IconShare size={17} />
            {t('share_stories')}
          </button>
          <button onClick={onInvite} className="btn btn-sm btn-secondary flex-[1.4]">
            <IconTicket size={16} />
            {t('share_invite')}
          </button>
        </div>
      </div>
    </div>
  )
}
