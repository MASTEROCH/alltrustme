import { useRef, useState } from 'react'
import ModalOverlay, { type SheetHandle } from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import Glyph, { TONE_COLOR, TONE_DIM } from '../components/Glyph'
import { IconChevronRight } from '../components/icons'
import { hapticSelection } from '../utils/telegram'
import type { Prize } from '../data/prizes'

export default function PrizeModal({ prize, onClose }: { prize: Prize; onClose: () => void }) {
  const { t, rtl } = useLang()
  const [slide, setSlide] = useState(0)
  const color = TONE_COLOR[prize.tone]
  const dim = TONE_DIM[prize.tone]
  const carousel = prize.carousel ?? [prize.icon]
  const multi = carousel.length > 1
  const sheet = useRef<SheetHandle>(null)

  const move = (dir: number) => {
    hapticSelection()
    setSlide((s) => (s + dir + carousel.length) % carousel.length)
  }

  // Хедер приза живёт в leading-слоте полосы шторки (как заголовок навбара iOS):
  // крестик в своём слоте, длинное название больше не залезает под него
  const header = (
    <div className="flex min-w-0 items-center gap-3">
      <span className="icon-chip h-11 w-11" style={{ background: dim, color }}>
        <Glyph name={prize.icon} size={24} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text3)]">{t(prize.placeKey)}</p>
        <h2 className="clamp-2 text-[17px] font-bold leading-tight" style={{ color }}>
          {t(prize.titleKey)}
        </h2>
      </div>
    </div>
  )

  return (
    <ModalOverlay onClose={onClose} bare leading={header} sheet={sheet}>

      {/* Карусель / большая иконка */}
      <div
        className="relative flex h-[180px] items-center justify-center overflow-hidden rounded-[var(--r)]"
        style={{ background: `linear-gradient(135deg, ${dim}, transparent), var(--card)` }}
      >
        <span key={slide} className="prize-glyph" style={{ color }}>
          <Glyph name={carousel[slide]} size={84} />
        </span>
        {multi && (
          <>
            <button
              onClick={() => move(-1)}
              className="press absolute start-2 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] text-white"
              style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
            >
              <IconChevronRight size={18} className="rotate-180" />
            </button>
            <button
              onClick={() => move(1)}
              className="press absolute end-2 flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] text-white"
              style={{ transform: rtl ? 'scaleX(-1)' : undefined }}
            >
              <IconChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 flex gap-1.5">
              {carousel.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-[width,background-color] duration-500 ease-[var(--ease-snappy)]"
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
          className="mt-4 rounded-[var(--rs)] border border-[rgba(245,176,66,0.25)] px-3.5 py-3.5 text-[13px] text-[var(--gold)]"
          style={{ background: 'var(--gold-dim)' }}
        >
          {t(prize.footerKey)}
        </div>
      )}

      <button onClick={() => sheet.current?.dismiss()} className="btn btn-secondary btn-block mt-4">
        {t('close')}
      </button>
    </ModalOverlay>
  )
}
