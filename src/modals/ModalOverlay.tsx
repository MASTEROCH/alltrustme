import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from '../components/icons'
import { haptic, tg } from '../utils/telegram'
import { sheets } from '../utils/sheets'

interface Props {
  title?: string
  onClose: () => void
  children: ReactNode
  /** убрать верхнюю шапку с заголовком/крестиком */
  bare?: boolean
}

/* Глобальный реестр живых окон — защита от StrictMode-ремаунта (см. эффект ниже). */
const live = new Set<string>()
let seq = 0

/** Базовый bottom-sheet. ЗАКОН МОДАЛЬНОГО ОКНА (канон ROCH): закрывается тремя способами —
   (1) крестик, (2) тап по затемнению, (3) системный «назад» (аппаратная кнопка Android /
   Telegram BackButton). Третий — через history.pushState + popstate. */
export default function ModalOverlay({ title, onClose, children, bare }: Props) {
  const [closing, setClosing] = useState(false)
  const keyRef = useRef<string | null>(null)
  if (!keyRef.current) keyRef.current = `sheet-${++seq}`

  const close = () => {
    if (closing) return
    haptic()
    setClosing(true)
    setTimeout(onClose, 250) // дать доиграть анимацию закрытия
  }
  const closeRef = useRef(close)
  closeRef.current = close

  useEffect(() => {
    const key = keyRef.current!
    live.add(key)
    sheets.n += 1

    // (3) системный «назад»: своя запись истории поверх текущей
    const hs = (window.history.state ?? {}) as Record<string, unknown>
    if (hs.sheet !== key) window.history.pushState({ ...hs, sheet: key }, '')
    let popped = false
    const onPop = () => {
      popped = true
      closeRef.current()
    }
    window.addEventListener('popstate', onPop)

    // Telegram BackButton виден, пока окно открыто (клик → history.back в useTelegramBack)
    const bb = tg()?.BackButton
    const isRoot = () => {
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      const p = window.location.pathname.replace(base, '')
      return p === '' || p === '/'
    }
    try {
      bb?.show()
    } catch {
      /* noop */
    }

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      live.delete(key)
      sheets.n = Math.max(0, sheets.n - 1)
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      // окно закрыли изнутри (крестик/фон/действие) — снимаем свою запись истории,
      // иначе следующий «назад» уйдёт в пустоту. Отложенно: StrictMode ремаунтит синхронно.
      setTimeout(() => {
        if (live.has(key)) return
        const cur = (window.history.state ?? {}) as Record<string, unknown>
        if (!popped && cur.sheet === key) window.history.back()
        if (sheets.n === 0 && isRoot()) {
          try {
            bb?.hide()
          } catch {
            /* noop */
          }
        }
      }, 0)
    }
  }, [])

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex items-end justify-center ${closing ? 'backdrop-out' : 'backdrop-in'}`}
      style={{ background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`flex max-h-[90dvh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[calc(var(--r)+6px)] ${
          closing ? 'modal-slide-down' : 'modal-slide-up'
        }`}
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)',
          background: 'linear-gradient(180deg, rgba(20,28,52,0.96), rgba(11,17,34,0.99))',
          backdropFilter: 'blur(28px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
          borderTop: '1px solid rgba(150,180,255,0.16)',
          boxShadow: '0 -8px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-[rgba(160,188,255,0.28)]" />
        {!bare && (
          <div className="flex shrink-0 items-center justify-between px-6 pt-3 pb-1">
            <h2 className="text-[18px] font-bold tracking-tight">{title}</h2>
            <button onClick={close} className="btn-icon" aria-label="Close">
              <IconClose size={18} />
            </button>
          </div>
        )}
        {bare && (
          <button
            onClick={close}
            className="btn-icon absolute end-4 top-4 z-10"
            aria-label="Close"
            style={{ width: 32, height: 32 }}
          >
            <IconClose size={16} />
          </button>
        )}
        <div className="scroll-hide min-h-0 overflow-y-auto px-6 pt-3 pb-2" style={{ overscrollBehavior: 'contain' }}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
