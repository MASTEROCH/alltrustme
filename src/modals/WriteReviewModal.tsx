import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconStar, IconCheck } from '../components/icons'
import { haptic } from '../utils/telegram'

/** Окно «оставить отзыв» — рейтинг звёздами + имя + текст.
   Фронт-only: реальной отправки нет, показываем экран благодарности (мок). */
export default function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<'form' | 'sending' | 'done'>('form')

  const canSubmit = rating > 0 && text.trim().length >= 3 && phase === 'form'

  const submit = () => {
    if (!canSubmit) return
    haptic()
    setPhase('sending')
    // мок-отправка; реальный POST подключим на бэке
    setTimeout(() => setPhase('done'), 1100)
    setTimeout(onClose, 2600)
  }

  if (phase === 'done') {
    return (
      <ModalOverlay title={t('review_modal_title')} onClose={onClose} bare>
        <div className="flex flex-col items-center px-2 py-8 text-center">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-[var(--green)]"
            style={{ background: 'var(--green-dim)', boxShadow: '0 0 32px -6px rgba(52,210,126,0.55)' }}
          >
            <IconCheck size={34} />
          </span>
          <h2 className="mt-5 text-[19px] font-bold">{t('review_thanks_title')}</h2>
          <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-[var(--text2)]">
            {t('review_thanks_sub')}
          </p>
        </div>
      </ModalOverlay>
    )
  }

  const sending = phase === 'sending'
  const active = hover || rating

  return (
    <ModalOverlay title={t('review_modal_title')} onClose={onClose}>
      <div className="pb-3">
        {/* рейтинг */}
        <p className="text-[14px] font-medium text-[var(--text2)]">{t('review_rate_q')}</p>
        <div className="mt-3 flex items-center justify-center gap-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                haptic()
                setRating(n)
              }}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform active:scale-90"
              style={{
                color: n <= active ? 'var(--gold)' : 'var(--card2)',
                transform: n <= active ? 'scale(1.08)' : 'scale(1)',
                filter: n <= active ? 'drop-shadow(0 0 10px rgba(245,176,66,0.5))' : 'none',
                transition: 'transform 0.15s, color 0.15s',
              }}
              aria-label={`${n}`}
            >
              <IconStar size={34} />
            </button>
          ))}
        </div>
        {!rating && (
          <p className="mt-2 text-center text-[12px] text-[var(--text3)]">{t('review_rate_hint')}</p>
        )}

        {/* имя */}
        <label className="mt-6 block text-[13px] font-medium text-[var(--text3)]">
          {t('review_name_label')}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('review_name_ph')}
          maxLength={32}
          className="mt-2 w-full rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-[var(--text3)] focus:border-[rgba(61,139,255,0.5)]"
        />

        {/* текст */}
        <label className="mt-4 block text-[13px] font-medium text-[var(--text3)]">
          {t('review_text_label')}
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('review_text_ph')}
          maxLength={400}
          rows={4}
          className="mt-2 w-full resize-none rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-[var(--text3)] focus:border-[rgba(61,139,255,0.5)]"
        />
        <p className="mt-1 text-right text-[11px] text-[var(--text3)]">{text.length}/400</p>

        {/* submit */}
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="btn btn-primary btn-block mt-3"
        >
          {sending ? t('review_sending') : t('review_submit')}
        </button>
      </div>
    </ModalOverlay>
  )
}
