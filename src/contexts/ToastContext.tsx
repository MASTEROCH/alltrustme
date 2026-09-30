import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconCheck, IconWarning } from '../components/icons'
import { hapticNotify } from '../utils/telegram'

export type ToastKind = 'ok' | 'error'

interface ToastCtx {
  /** kind 'error' — красная иконка + error-хаптика (раньше любая ошибка шла зелёной галочкой) */
  toast: (msg: string, kind?: ToastKind) => void
}

const Ctx = createContext<ToastCtx | null>(null)

interface Item {
  id: number
  msg: string
  kind: ToastKind
  out: boolean
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<Item | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const seq = useRef(0)

  const toast = useCallback((msg: string, kind: ToastKind = 'ok') => {
    hapticNotify(kind === 'error' ? 'error' : 'success')
    // новый тост заменяет текущий «с нуля» (key) — анимация входа играет заново
    setItem({ id: ++seq.current, msg, kind, out: false })
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setItem((it) => (it ? { ...it, out: true } : it))
      timer.current = setTimeout(() => setItem(null), 260)
    }, 2200)
  }, [])

  const value = useMemo<ToastCtx>(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* Порталом в body и выше шторок: тост из модалки («Ссылка скопирована») раньше прятался под ней */}
      {item &&
        createPortal(
          <div
            key={item.id}
            className={`toast ${item.kind === 'error' ? 'is-error' : ''} ${item.out ? 'is-out' : ''}`}
            role={item.kind === 'error' ? 'alert' : 'status'}
          >
            <span className="toast-icon">
              {item.kind === 'error' ? <IconWarning size={15} /> : <IconCheck size={15} />}
            </span>
            {item.msg}
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
