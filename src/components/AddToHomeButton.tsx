import { useEffect, useRef, useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { IconHome, IconChevronRight, IconCheck } from './icons'
import { haptic } from '../utils/telegram'

type Phase = 'idle' | 'busy' | 'done'

/** Кнопка «добавить на домашний экран».
   В вебе системного API нет → показываем подсказку и состояние «готово», но
   кнопка НИКОГДА не пропадает (раньше уезжала под blur навбара и исчезала). */
export default function AddToHomeButton() {
  const { t, rtl } = useLang()
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const onClick = () => {
    if (phase !== 'idle') return
    haptic()
    setPhase('busy')
    timers.current.push(
      window.setTimeout(() => setPhase('done'), 900),
      // возвращаем в исходное состояние — кнопка остаётся доступной
      window.setTimeout(() => setPhase('idle'), 3600),
    )
  }

  const done = phase === 'done'
  const busy = phase === 'busy'

  return (
    <button
      onClick={onClick}
      disabled={busy}
      aria-live="polite"
      className="press mt-4 flex w-full items-center gap-3 rounded-[var(--r)] border p-5 text-left transition-colors duration-300"
      style={{
        borderColor: done ? 'rgba(52,210,126,0.4)' : 'var(--border)',
        background: done
          ? 'linear-gradient(135deg, rgba(52,210,126,0.16), rgba(52,210,126,0.06))'
          : 'var(--card)',
      }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--rs)] border transition-colors duration-300"
        style={{
          borderColor: done ? 'rgba(52,210,126,0.35)' : 'rgba(61,139,255,0.25)',
          background: done ? 'var(--green-dim)' : 'var(--blue-dim)',
          color: done ? 'var(--green)' : 'var(--blue)',
        }}
      >
        {done ? <IconCheck size={23} /> : <IconHome size={24} />}
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[15px] font-semibold">
          {done ? t('add_home_done_title') : t('add_home_hint_title')}
        </span>
        <span className="text-[12px] leading-snug text-[var(--text3)]">
          {busy ? '…' : done ? t('add_home_done_sub') : t('add_home_hint_sub')}
        </span>
      </span>

      {!done && (
        <span
          className="shrink-0 text-[var(--blue)] transition-opacity"
          style={{ transform: rtl ? 'scaleX(-1)' : 'none', opacity: busy ? 0.4 : 1 }}
        >
          <IconChevronRight size={18} />
        </span>
      )}
    </button>
  )
}
