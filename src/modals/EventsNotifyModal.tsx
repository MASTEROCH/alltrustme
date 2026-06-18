import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconBell } from '../components/icons'
import { haptic, hapticNotify } from '../utils/telegram'

export default function EventsNotifyModal({
  onSubscribed,
  onClose,
}: {
  onSubscribed: () => void
  onClose: () => void
}) {
  const { t } = useLang()
  const [submitting, setSubmitting] = useState(false)

  const subscribe = () => {
    haptic()
    setSubmitting(true)
    setTimeout(() => {
      hapticNotify('success')
      onSubscribed()
      onClose()
    }, 900)
  }

  return (
    <ModalOverlay onClose={submitting ? () => {} : onClose} bare>
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="icon-chip h-14 w-14 bg-[var(--blue-dim)] text-[var(--blue)]">
          <IconBell size={28} />
        </span>
        <h2 className="mt-4 text-[19px] font-bold">{t('notify_title')}</h2>
        <p className="mt-2 max-w-[330px] text-[15px] text-[var(--text2)]">{t('notify_text')}</p>
      </div>

      <button
        onClick={subscribe}
        disabled={submitting}
        className="relative overflow-hidden shine press mt-6 w-full rounded-[var(--r)] bg-[var(--blue)] py-4 text-[15px] font-bold text-white disabled:opacity-60"
        style={{ boxShadow: '0 8px 28px var(--blue-glow)' }}
      >
        {submitting ? '…' : t('notify_subscribe')}
      </button>
      <button
        onClick={onClose}
        disabled={submitting}
        className="press mt-2.5 w-full rounded-[var(--r)] border border-[var(--border)] bg-[var(--card2)] py-3.5 text-[15px] font-semibold text-[var(--text2)] disabled:opacity-60"
      >
        {t('cancel')}
      </button>
    </ModalOverlay>
  )
}
