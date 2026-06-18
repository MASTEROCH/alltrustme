import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
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

  return (
    <ModalOverlay title={t('promo_modal_title')} onClose={onClose}>
      <div className="rounded-[var(--r)] border-[1.5px] border-[var(--border)] bg-[var(--card)] px-5 py-4 transition-colors focus-within:border-[var(--blue)]">
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
          onClose()
        }}
        className="press mt-4 w-full rounded-[var(--r)] py-3.5 text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 50%, var(--blue2))', boxShadow: '0 8px 28px var(--blue-glow)', color: 'var(--on-accent)' }}
      >
        {t('apply')}
      </button>
    </ModalOverlay>
  )
}
