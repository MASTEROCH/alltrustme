import { useEffect, useRef, useState } from 'react'
import ModalOverlay, { type SheetHandle } from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconStar, IconCheck } from '../components/icons'
import { haptic, hapticNotify } from '../utils/telegram'

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

  const sheet = useRef<SheetHandle>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const submit = () => {
    if (!canSubmit) return
    haptic()
    setPhase('sending')
    // мок-отправка; реальный POST подключим на бэке. Благодарность — в ТОЙ ЖЕ шторке
    // (раньше монтировалась вторая: лист уезжал и въезжал заново), закрытие — с анимацией,
    // таймер снимается при размонтировании (раньше мог закрыть заново открытое окно).
    timers.current.push(
      setTimeout(() => {
        hapticNotify('success')
        setPhase('done')
        timers.current.push(setTimeout(() => sheet.current?.dismiss(), 1900))
      }, 1100),
    )
  }

  const thanks = (
    <div className="sheet-hero pb-6 pt-2">
      <span className="icon-chip sheet-hero-icon rounded-full bg-[var(--green-dim)] text-[var(--green)]">
        <IconCheck size={32} />
      </span>
      <h2 className="sheet-hero-title">{t('review_thanks_title')}</h2>
      <p className="sheet-hero-sub max-w-[280px]">{t('review_thanks_sub')}</p>
    </div>
  )

  const sending = phase === 'sending'
  const active = hover || rating

  return (
    <ModalOverlay
      title={phase === 'done' ? undefined : t('review_modal_title')}
      bare={phase === 'done'}
      onClose={onClose}
      dismissible={!sending}
      sheet={sheet}
    >
      {phase === 'done' ? (
        thanks
      ) : (
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
          {!rating && <p className="mt-2 text-center text-[12px] text-[var(--text3)]">{t('review_rate_hint')}</p>}

          {/* имя */}
          <label className="mt-6 block text-[13px] font-medium text-[var(--text3)]">{t('review_name_label')}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('review_name_ph')}
            maxLength={32}
            className="mt-2 w-full rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-[var(--text3)] focus:border-[rgba(61,139,255,0.5)]"
          />

          {/* текст */}
          <label className="mt-4 block text-[13px] font-medium text-[var(--text3)]">{t('review_text_label')}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('review_text_ph')}
            maxLength={400}
            rows={4}
            className="mt-2 w-full resize-none rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-[var(--text3)] focus:border-[rgba(61,139,255,0.5)]"
          />
          <p className="mt-1 text-end text-[11px] text-[var(--text3)]">{text.length}/400</p>

          {/* submit */}
          <button
            onClick={submit}
            disabled={!canSubmit && !sending}
            className={`btn btn-primary btn-block mt-3 ${sending ? 'is-loading' : ''}`}
            aria-busy={sending}
          >
            <span>{t('review_submit')}</span>
          </button>
        </div>
      )}
    </ModalOverlay>
  )
}
