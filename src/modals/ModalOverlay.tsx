import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from '../components/icons'
import { haptic } from '../utils/telegram'

interface Props {
  title?: string
  onClose: () => void
  children: ReactNode
  /** убрать верхнюю шапку с заголовком/крестиком */
  bare?: boolean
}

/** Базовый bottom-sheet каркас для всех модалок: затемнение + выезд снизу. */
export default function ModalOverlay({ title, onClose, children, bare }: Props) {
  const [closing, setClosing] = useState(false)

  const close = () => {
    if (closing) return
    haptic()
    setClosing(true)
    setTimeout(onClose, 250) // дать доиграть анимацию закрытия
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(
    <div
      className={`fixed inset-0 z-[1000] flex items-end justify-center ${closing ? 'backdrop-out' : 'backdrop-in'}`}
      style={{ background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      onClick={close}
    >
      <div
        className={`flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-t-[calc(var(--r)+6px)] ${
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
        <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-[var(--card2)]" />
        {!bare && (
          <div className="flex items-center justify-between px-6 pt-3 pb-1">
            <h2 className="text-[18px] font-bold">{title}</h2>
            <button
              onClick={close}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--card)] text-[var(--text2)] transition-transform active:scale-90"
              aria-label="Close"
            >
              <IconClose size={18} />
            </button>
          </div>
        )}
        <div className="scroll-hide overflow-y-auto px-6 pt-3 pb-2">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
