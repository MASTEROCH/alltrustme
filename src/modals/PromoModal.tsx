import { useRef, useState } from 'react'
import ModalOverlay, { type SheetHandle } from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { haptic } from '../utils/telegram'

export default function PromoModal({
  initial = 'APPHUB',
  onApply,
  onClose,
}: {
  initial?: string
  onApply: (code: string) => void
  onClose: () => void
}) {
  const { t } = useLang()
  const [code, setCode] = useState(initial)
  const sheet = useRef<SheetHandle>(null)

  return (
    <ModalOverlay title={t('promo_modal_title')} onClose={onClose} sheet={sheet}>
      <div className="card px-5 py-4 transition-colors focus-within:border-[var(--blue)]">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="APPHUB"
          autoFocus
          className="w-full bg-transparent font-mono text-[20px] font-semibold outline-none placeholder:text-[var(--text3)]"
        />
      </div>
      <p className="mt-2 text-[13px] text-[var(--text3)]">{t('promo_hint')}</p>
      <button
        onClick={() => {
          haptic()
          onApply(code.trim() || 'APPHUB')
          sheet.current?.dismiss()
        }}
        className="btn btn-primary btn-block mt-4"
      >
        {t('apply')}
      </button>
    </ModalOverlay>
  )
}
