import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { IconClose, IconCheck, IconShare, IconTicket } from '../components/icons'
import { haptic } from '../utils/telegram'
import type { ExchangeSummary } from '../types'

export default function SuccessScreen() {
  const { t } = useLang()
  const navigate = useNavigate()
  const { toast } = useToast()
  const state = (useLocation().state ?? null) as Partial<ExchangeSummary> | null

  const give = state?.give ?? '—'
  const get = state?.get ?? '—'
  const office = state?.office || t('default_office')
  const promo = state?.promo ?? 'APPHUB'

  const home = () => {
    haptic()
    navigate('/')
  }

  const rows: Array<[string, React.ReactNode]> = [
    [t('give_label'), <span className="font-mono font-semibold">{give}</span>],
    [t('get_label'), <span className="font-mono font-semibold text-[var(--green)]">{get}</span>],
    [t('office_label'), <span className="font-medium">{office}</span>],
    [t('promo_short'), <span className="font-mono font-semibold text-[var(--blue)]">{promo}</span>],
  ]

  return (
    <div className="screen">
      <header className="chrome-header flex items-center justify-between px-5 py-3.5">
        <button
          onClick={home}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text2)] transition-transform active:scale-90"
          aria-label="Close"
        >
          <IconClose size={22} />
        </button>
        <h1 className="text-[16px] font-bold">{t('suc_header')}</h1>
        <span className="w-8" />
      </header>

      <div className="fade-in flex flex-1 flex-col items-center justify-center px-6 pb-10 text-center">
        <div
          className="pop-in flex h-[100px] w-[100px] items-center justify-center rounded-full border-2 border-[var(--green)] text-[var(--green)]"
          style={{ background: 'var(--green-dim)', boxShadow: '0 0 40px rgba(34,197,94,0.3)' }}
        >
          <IconCheck size={48} />
        </div>

        <h2 className="mt-6 text-[22px] font-extrabold">{t('data_sent')}</h2>
        <p className="mt-2.5 max-w-[300px] text-[14px] leading-relaxed text-[var(--text2)]">
          {t('suc_sub')}
        </p>

        <div className="mt-6 w-full overflow-hidden rounded-[var(--r)] bg-[var(--card)] p-1 text-left">
          {rows.map(([label, value], i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3.5 py-3 text-[15px]"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <span className="text-[var(--text2)]">{label}</span>
              {value}
            </div>
          ))}
        </div>

        <button
          onClick={home}
          className="relative overflow-hidden shine mt-6 w-full max-w-[280px] rounded-[var(--r)] py-4 text-[15px] font-bold text-white transition-transform active:scale-[0.98]"
          style={{
            background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 50%, var(--blue2))', color: 'var(--on-accent)',
            boxShadow: '0 8px 28px var(--blue-glow)',
          }}
        >
          {t('back_home')}
        </button>

        <div className="mt-4 flex w-full max-w-[280px] gap-2">
          <button
            onClick={() => {
              haptic()
              toast(t('toast_link_copied'))
            }}
            className="flex flex-[1] items-center justify-center gap-1.5 rounded-[var(--rs)] py-3 text-[14px] font-semibold text-white transition-transform active:scale-[0.97]"
            style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)' }}
          >
            <IconShare size={17} />
            {t('share_stories')}
          </button>
          <button
            onClick={() => {
              haptic()
              toast(t('toast_link_copied'))
            }}
            className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] py-3 text-[13px] text-[var(--text2)] transition-transform active:scale-[0.97]"
          >
            <IconTicket size={16} />
            {t('share_invite')}
          </button>
        </div>
      </div>
    </div>
  )
}
