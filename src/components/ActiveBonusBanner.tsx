import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { IconBolt, IconStopwatch, IconCheck, IconExchange } from './icons'
import { haptic } from '../utils/telegram'
import { copyToClipboard } from '../utils/format'

/** Баннер активного бонуса — показывается вместо кнопки «Активировать бонус». */
export default function ActiveBonusBanner({ code, timeLeft }: { code: string; timeLeft: string }) {
  const { t } = useLang()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    haptic()
    if (await copyToClipboard(code)) {
      setCopied(true)
      toast(t('toast_bonus_copied'))
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-[var(--r)] border border-[rgba(245,158,11,0.3)] p-5"
      style={{ background: 'linear-gradient(135deg, #1a0f00, #2d1800)' }}
    >
      <div className="flex items-center gap-2.5">
        <span className="bonus-pulse text-[var(--gold)]">
          <IconBolt size={22} />
        </span>
        <div>
          <h4 className="text-[14px] font-bold text-[var(--gold)]">{t('abb_title')}</h4>
          <p className="flex items-center gap-1 text-[12px] text-[var(--text3)]">
            <IconStopwatch size={12} />
            {t('abb_expires', { time: timeLeft })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card2)] p-2.5">
        <span className="flex-1 break-all font-mono text-[14px] font-bold text-[var(--gold)]">{code}</span>
        <button
          onClick={copy}
          className="press flex items-center gap-1 rounded-full bg-[var(--blue-dim)] px-3 py-1.5 text-[13px] font-semibold text-[var(--blue)]"
        >
          {copied ? <IconCheck size={14} /> : t('copy')}
        </button>
      </div>

      <button
        onClick={() => {
          haptic('medium')
          navigate('/exchange')
        }}
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--rs)] py-3 text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(135deg, var(--green), #16a34a)', boxShadow: '0 4px 16px rgba(34,197,94,0.25)' }}
      >
        <IconExchange size={18} />
        {t('abb_go_ex')}
      </button>
    </div>
  )
}
