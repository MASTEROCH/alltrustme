import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { IconCheck } from '../components/icons'
import { hapticNotify } from '../utils/telegram'

interface ToastCtx {
  toast: (msg: string) => void
}

const Ctx = createContext<ToastCtx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toast = useCallback((m: string) => {
    setMsg(m)
    hapticNotify('success')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), 2200)
  }, [])

  const value = useMemo<ToastCtx>(() => ({ toast }), [toast])

  return (
    <Ctx.Provider value={value}>
      {children}
      {msg && (
        <div
          className="toast-in fixed left-1/2 z-[300] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card2)] px-4 py-2.5 text-[13px] font-medium shadow-lg"
          style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 110px)' }}
          role="status"
        >
          <span className="text-[var(--green)]">
            <IconCheck size={16} />
          </span>
          {msg}
        </div>
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
