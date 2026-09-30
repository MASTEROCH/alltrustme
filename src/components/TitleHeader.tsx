import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { IconChevronRight } from './icons'
import { haptic, hasTgBackButton } from '../utils/telegram'

/** Шапка внутренних экранов: заголовок по центру, слева — «назад» (на push-экранах,
   когда у клиента нет системной BackButton мини-аппа), справа — опциональное действие. */
export default function TitleHeader({
  title,
  right,
  back,
}: {
  title: string
  right?: ReactNode
  /** экран открыт «поверх» вкладки (KYC, заявки) — показать стрелку назад */
  back?: boolean
}) {
  const navigate = useNavigate()
  const { t } = useLang()
  const showBack = back && !hasTgBackButton()

  const goBack = () => {
    haptic()
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/', { replace: true })
  }

  return (
    <header className="chrome-header relative flex items-center justify-center px-4 py-3.5">
      {showBack && (
        <button onClick={goBack} aria-label={t('back')} className="btn-icon back-btn">
          <span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}>
            <IconChevronRight size={18} />
          </span>
        </button>
      )}
      <h1 className="text-[16px] font-bold tracking-tight">{title}</h1>
      {right && <div className="absolute end-3 top-1/2 -translate-y-1/2">{right}</div>}
    </header>
  )
}
