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
    } else toast(t('toast_copy_failed'), 'error')
  }

  return (
    <div
      className="relative overflow-hidden rounded-[var(--r)] border border-[rgba(245,176,66,0.3)] p-5"
      style={{ background: 'linear-gradient(135deg, rgba(245,176,66,0.1), rgba(245,176,66,0.03)), var(--card-solid)' }}
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
        <button onClick={copy} className="btn btn-xs btn-soft-blue">
          {copied ? <IconCheck size={14} /> : t('copy')}
        </button>
      </div>

      <button
        onClick={() => {
          haptic('medium')
          navigate('/exchange')
        }}
        className="btn btn-positive btn-block mt-4"
      >
        <IconExchange size={18} />
        {t('abb_go_ex')}
      </button>
    </div>
  )
}
