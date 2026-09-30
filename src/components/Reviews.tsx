import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { REVIEWS } from '../data/reviews'
import { IconStar, IconPencil } from './icons'
import WriteReviewModal from '../modals/WriteReviewModal'
import { haptic } from '../utils/telegram'

/** Секция отзывов клиентов — доверие/конверсия. Горизонтальный скролл стеклянных карточек. */
export default function Reviews() {
  const { t, lang } = useLang()
  const l = lang === 'ru' ? 'ru' : 'en'
  const [open, setOpen] = useState(false)

  return (
    <section className="mt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="section-label">{t('reviews_title')}</p>
        <span className="flex items-center gap-1 text-[12px] font-medium text-[var(--text3)]">
          <IconStar size={13} className="text-[var(--gold)]" />
          {t('reviews_trust')}
        </span>
      </div>

      <div
        className="scroll-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-1"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 3%, #000 96%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, #000 3%, #000 96%, transparent)',
        }}
      >
        {REVIEWS.map((r, i) => (
          <div
            key={i}
            className="card flex w-[270px] shrink-0 flex-col p-4"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={r.avatar}
                alt={r.name}
                loading="lazy"
                width={40}
                height={40}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
                style={{ boxShadow: '0 0 0 1.5px rgba(160,188,255,0.2)' }}
              />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold">{r.name}</p>
                <p className="truncate text-[12px] text-[var(--text3)]">{r.role[l]}</p>
              </div>
              <div className="ml-auto flex gap-0.5 text-[var(--gold)]">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <IconStar key={s} size={12} />
                ))}
              </div>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--text2)]">{r.text[l]}</p>
          </div>
        ))}

        {/* CTA-карточка «оставить отзыв» в конце ленты */}
        <button
          onClick={() => {
            haptic()
            setOpen(true)
          }}
          className="press flex w-[150px] shrink-0 flex-col items-center justify-center gap-2 rounded-[var(--r)] border border-dashed border-[rgba(61,139,255,0.4)] bg-[var(--blue-dim)] p-4 text-center"
        >
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--blue)]"
            style={{ background: 'rgba(61,139,255,0.16)', boxShadow: '0 0 18px -4px rgba(61,139,255,0.5)' }}
          >
            <IconPencil size={20} />
          </span>
          <span className="text-[13px] font-semibold leading-snug text-[var(--blue)]">
            {t('reviews_write')}
          </span>
        </button>
      </div>

      {open && <WriteReviewModal onClose={() => setOpen(false)} />}
    </section>
  )
}
