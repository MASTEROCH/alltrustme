import { useState } from 'react'
import ModalOverlay, { useSheetDismiss } from './ModalOverlay'
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
  const [submitting, setSubmitting] = useState(false)
  return (
    // пока подписка отправляется — окно не закрыть (раньше «пустой» onClose оставлял невидимый слой)
    <ModalOverlay onClose={onClose} bare dismissible={!submitting}>
      <Body submitting={submitting} setSubmitting={setSubmitting} onSubscribed={onSubscribed} />
    </ModalOverlay>
  )
}

function Body({
  submitting,
  setSubmitting,
  onSubscribed,
}: {
  submitting: boolean
  setSubmitting: (v: boolean) => void
  onSubscribed: () => void
}) {
  const { t } = useLang()
  const dismiss = useSheetDismiss()

  const subscribe = () => {
    haptic()
    setSubmitting(true)
    setTimeout(() => {
      hapticNotify('success')
      onSubscribed()
      setSubmitting(false)
      dismiss()
    }, 900)
  }

  return (
    <>
      <div className="sheet-hero">
        <span className="icon-chip sheet-hero-icon bg-[var(--blue-dim)] text-[var(--blue)]">
          <IconBell size={28} />
        </span>
        <h2 className="sheet-hero-title">{t('notify_title')}</h2>
        <p className="sheet-hero-sub">{t('notify_text')}</p>
      </div>

      <button
        onClick={subscribe}
        className={`btn btn-primary btn-block mt-6 ${submitting ? 'is-loading' : ''}`}
        aria-busy={submitting}
      >
        <span>{t('notify_subscribe')}</span>
      </button>
      <button onClick={dismiss} disabled={submitting} className="btn btn-secondary btn-block mt-2.5">
        {t('cancel')}
      </button>
    </>
  )
}
