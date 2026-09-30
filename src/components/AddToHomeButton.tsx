import { useEffect, useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { IconHome, IconChevronRight, IconCheck } from './icons'
import { haptic, tg, canAddToHome } from '../utils/telegram'

/** «Добавить на домашний экран» — честно: в Telegram 8.0+ зовём настоящий API,
   вне его — показываем подсказку. Никаких фальшивых «Готово!». */
export default function AddToHomeButton({ compact }: { compact?: boolean }) {
  const { t, rtl } = useLang()
  const { toast } = useToast()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!canAddToHome()) return
    try {
      tg()?.checkHomeScreenStatus?.((s) => setAdded(s === 'added'))
    } catch {
      /* noop */
    }
  }, [])

  const onClick = () => {
    haptic()
    if (added) return
    if (canAddToHome()) {
      try {
        tg()!.addToHomeScreen!()
        return
      } catch {
        /* падаем на подсказку */
      }
    }
    toast(t('add_home_toast'))
  }

  const sub = added ? t('add_home_added') : t('add_home_sub')

  if (compact) {
    return (
      <button
        onClick={onClick}
        aria-live="polite"
        className="card press flex flex-col gap-3 p-4 text-left"
        style={added ? { borderColor: 'rgba(52,210,126,0.4)' } : undefined}
      >
        <span
          className="icon-chip h-10 w-10 border"
          style={{
            borderColor: added ? 'rgba(52,210,126,0.35)' : 'rgba(61,139,255,0.25)',
            background: added ? 'var(--green-dim)' : 'var(--blue-dim)',
            color: added ? 'var(--green)' : 'var(--blue)',
          }}
        >
          {added ? <IconCheck size={20} /> : <IconHome size={20} />}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="clamp-2 text-[14px] font-semibold leading-snug">{t('add_home_hint_title')}</span>
          <span className="text-[11.5px] leading-snug text-[var(--text3)]">{sub}</span>
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      aria-live="polite"
      className="card press flex w-full items-center gap-3 p-5 text-left"
      style={added ? { borderColor: 'rgba(52,210,126,0.4)' } : undefined}
    >
      <span
        className="icon-chip h-11 w-11 shrink-0 border"
        style={{
          borderColor: added ? 'rgba(52,210,126,0.35)' : 'rgba(61,139,255,0.25)',
          background: added ? 'var(--green-dim)' : 'var(--blue-dim)',
          color: added ? 'var(--green)' : 'var(--blue)',
        }}
      >
        {added ? <IconCheck size={22} /> : <IconHome size={22} />}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-semibold">{t('add_home_hint_title')}</span>
        <span className="text-[12px] leading-snug text-[var(--text3)]">{sub}</span>
      </span>
      {!added && (
        <span className="shrink-0 text-[var(--text3)]" style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}>
          <IconChevronRight size={18} />
        </span>
      )}
    </button>
  )
}
