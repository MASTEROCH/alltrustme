import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'

/** Плейсхолдеры фото офиса (нейтральные skeleton-плитки, без эмодзи). */
function PhotoTile({ ratio }: { ratio: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card2)]"
      style={{ aspectRatio: ratio }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="14" rx="2.4" />
        <circle cx="8.5" cy="10" r="1.8" />
        <path d="m4 17 4.5-4 3.5 3 3-3L20 17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export default function PhotosModal({ office, onClose }: { office: string; onClose: () => void }) {
  const { t } = useLang()
  return (
    <ModalOverlay title={`${t('photos_office')}: ${office}`} onClose={onClose}>
      <PhotoTile ratio="16 / 9" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <PhotoTile ratio="4 / 3" />
        <PhotoTile ratio="4 / 3" />
        <PhotoTile ratio="4 / 3" />
        <PhotoTile ratio="4 / 3" />
      </div>
      <p className="mt-4 text-center text-[12px] text-[var(--text3)]">{t('photos_placeholder')}</p>
      <button
        onClick={onClose}
        className="mt-4 w-full rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] py-3.5 text-[15px] font-semibold transition-transform active:scale-[0.98]"
      >
        {t('close')}
      </button>
    </ModalOverlay>
  )
}
