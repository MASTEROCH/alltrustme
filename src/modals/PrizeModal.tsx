import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import Glyph, { TONE_COLOR, TONE_DIM } from '../components/Glyph'
import { IconChevronRight } from '../components/icons'
import { haptic, hapticSelection } from '../utils/telegram'
import type { Prize } from '../data/prizes'

export default function PrizeModal({ prize, onClose }: { prize: Prize; onClose: () => void }) {
  const { t, rtl } = useLang()
  const [slide, setSlide] = useState(0)
  const color = TONE_COLOR[prize.tone]
  const dim = TONE_DIM[prize.tone]
  const carousel = prize.carousel ?? [prize.icon]
  const multi = carousel.length > 1

  const move = (dir: number) => {
    hapticSelection()
    setSlide((s) => (s + dir + carousel.length) % carousel.length)
  }

  return (
    <ModalOverlay onClose={onClose} bare>
      {/* Хедер */}
      <div className="mb-4 flex items-center gap-3">
        <span className="icon-chip h-12 w-12" style={{ background: dim, color }}>
          <Glyph name={prize.icon} size={26} />
        </span>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wider text-[var(--text3)]">
            {t(prize.placeKey)}
          </p>
          <h2 className="text-[18px] font-bold" style={{ color }}>
            {t(prize.titleKey)}
          </h2>
        </div>
      </div>

      {/* Карусель / большая иконка */}
      <div
        className="relative flex h-[180px] items-center justify-center overflow-hidden rounded-[var(--r)]"
        style={{ background: `linear-gradient(135deg, ${dim}, transparent), var(--card)` }}
      >
        <span style={{ color }}>
          <Glyph name={carousel[slide]} size={84} />
        </span>
        {multi && (
          <>
            <button
              onClick={() => move(-1)}
              className="press absolute left-2 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] text-white"
              style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
            >
              <IconChevronRight size={18} className="rotate-180" />
            </button>
            <button
              onClick={() => move(1)}
              className="press absolute right-2 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] text-white"
              style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
            >
              <IconChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 flex gap-1.5">
              {carousel.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === slide ? 16 : 6,
                    background: i === slide ? color : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Детали */}
      <div className="mt-4 overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)]">
        {prize.details.map((d, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-5 py-4"
            style={{ borderTop: i ? '1px solid var(--border)' : 'none' }}
          >
            <span className="mt-0.5 shrink-0" style={{ color }}>
              <Glyph name={d.icon} size={18} />
            </span>
            <div>
              <h4 className="text-[15px] font-medium">{t(d.title)}</h4>
              {d.sub && <p className="text-[13px] text-[var(--text3)]">{t(d.sub)}</p>}
            </div>
          </div>
        ))}
      </div>

      {prize.footerKey && (
        <div
          className="mt-4 rounded-[var(--rs)] border border-[rgba(245,158,11,0.25)] px-3.5 py-3.5 text-[13px] text-[var(--gold)]"
          style={{ background: 'var(--gold-dim)' }}
        >
          {t(prize.footerKey)}
        </div>
      )}

      <button
        onClick={() => {
          haptic()
          onClose()
        }}
        className="press mt-4 w-full rounded-[var(--r)] py-3.5 text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 50%, var(--blue2))', color: 'var(--on-accent)' }}
      >
        {t('close')}
      </button>
    </ModalOverlay>
  )
}
