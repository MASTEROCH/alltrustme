import {
  createContext,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from '../components/icons'
import { useLang } from '../contexts/LanguageContext'
import { haptic, hapticSelection, tg } from '../utils/telegram'
import { lowerStage, raiseStage, setStageProgress, sheets } from '../utils/sheets'
import { prefersReducedMotion, project, rubber, spring, springPath, type Spring } from '../utils/spring'

interface Props {
  title?: string
  onClose: () => void
  children: ReactNode
  /** без заголовка: полоса-хром остаётся (grabber + слоты), контент — свой */
  bare?: boolean
  /** false — окно занято (идёт отправка): крестик гаснет, фон / Esc / «назад» / свайп не закрывают */
  dismissible?: boolean
  /** leading-слот полосы вместо заголовка (онбординг: точки прогресса) */
  leading?: ReactNode
  /** trailing-слот вместо крестика (онбординг: «Пропустить»); null — пустой слот */
  trailing?: ReactNode
  /** ручка для кнопок-действий в самом окне: sheet.current.dismiss() — закрыть С анимацией */
  sheet?: Ref<SheetHandle>
}

export interface SheetHandle {
  dismiss: () => void
}

/** Закрыть текущую шторку С анимацией — для кнопок-действий внутри окна («Готово», «Закрыть»). */
const SheetCtx = createContext<() => void>(() => {})
// eslint-disable-next-line react-refresh/only-export-components
export function useSheetDismiss(): () => void {
  return useContext(SheetCtx)
}

/* Глобальный реестр живых окон — защита от StrictMode-ремаунта (см. эффект ниже). */
const live = new Set<string>()
let seq = 0

type Phase = 'enter' | 'idle' | 'closing'

/** Базовый bottom-sheet (iOS 26: парящий лист с отступом от краёв).
   ЗАКОН МОДАЛЬНОГО ОКНА (канон ROCH) — закрывается четырьмя способами: крестик, тап по затемнению,
   системный «назад» (Android / Telegram BackButton через history), свайп вниз за полосу-хром.
   Крестик живёт в СВОЁМ слоте полосы — наложиться на контент он не может в принципе. */
export default function ModalOverlay({
  title,
  onClose,
  children,
  bare,
  dismissible = true,
  leading,
  trailing,
  sheet,
}: Props) {
  const { t } = useLang()
  const [phase, setPhase] = useState<Phase>('enter')
  const sheetRef = useRef<HTMLDivElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const keyRef = useRef<string | null>(null)
  if (!keyRef.current) keyRef.current = `sheet-${++seq}`

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const lockedRef = useRef(!dismissible)
  lockedRef.current = !dismissible
  const closingRef = useRef(false)
  const doneRef = useRef(false)
  const stageUp = useRef(false)
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelAnim = useRef<(() => void) | null>(null)
  const yRef = useRef(0)

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onCloseRef.current()
  }
  const dropStage = () => {
    if (!stageUp.current) return
    stageUp.current = false
    lowerStage()
  }

  /** Закрытие с анимацией. Изнутри окна разрешено всегда (действие завершено). */
  const dismiss = () => {
    if (closingRef.current) return
    closingRef.current = true
    cancelAnim.current?.()
    haptic()
    dropStage()
    setStageProgress(null)
    // лист уезжает от ТЕКУЩЕЙ позиции (если его успели потянуть)
    sheetRef.current?.style.setProperty('--sheet-from', `${yRef.current}px`)
    setPhase('closing')
    fallback.current = setTimeout(finish, 480) // страховка, если animationend не придёт
  }
  /** Закрытие жестом/кнопкой пользователя — уважает dismissible. */
  const request = () => {
    if (lockedRef.current) return
    dismiss()
  }
  const requestRef = useRef(request)
  requestRef.current = request
  useImperativeHandle(sheet, () => ({ dismiss }))

  useEffect(() => {
    const key = keyRef.current!
    live.add(key)
    sheets.n += 1
    raiseStage()
    stageUp.current = true

    // системный «назад»: своя запись истории поверх текущей
    const hs = (window.history.state ?? {}) as Record<string, unknown>
    if (hs.sheet !== key) window.history.pushState({ ...hs, sheet: key }, '')
    let popped = false
    const onPop = () => {
      if (lockedRef.current) {
        // окно занято — возвращаем свою запись, «назад» ничего не ломает
        window.history.pushState({ ...((window.history.state ?? {}) as object), sheet: key }, '')
        return
      }
      popped = true
      requestRef.current()
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

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && requestRef.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      live.delete(key)
      sheets.n = Math.max(0, sheets.n - 1)
      if (stageUp.current) {
        stageUp.current = false
        lowerStage()
      }
      if (fallback.current) clearTimeout(fallback.current)
      cancelAnim.current?.()
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

  /* ── Свайп вниз за полосу-хром (iOS-канон §5.5: резинка, проекция флика, пружина со скоростью) ── */
  const drag = useRef<{ start: number; H: number; hist: { t: number; y: number }[]; armed: boolean } | null>(null)

  const setY = (y: number, H: number) => {
    yRef.current = y
    const el = sheetRef.current
    if (el) el.style.transform = y ? `translate3d(0, ${y}px, 0)` : ''
    const p = Math.max(0, Math.min(1, 1 - Math.max(0, y) / H))
    if (dimRef.current) dimRef.current.style.opacity = String(p)
    setStageProgress(p)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (closingRef.current || lockedRef.current) return
    if ((e.target as Element).closest('button, a, input')) return
    const el = sheetRef.current
    if (!el) return
    cancelAnim.current?.()
    if (phase === 'enter') setPhase('idle')
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { start: e.clientY - yRef.current, H: el.offsetHeight, hist: [], armed: false }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const raw = e.clientY - d.start
    const y = raw < 0 ? -rubber(-raw, d.H) : raw
    setY(y, d.H)
    d.hist.push({ t: e.timeStamp, y })
    d.hist = d.hist.filter((s) => e.timeStamp - s.t < 100)
    // хаптика на пороге: «отпустишь — закроется»
    const over = y > d.H * 0.35
    if (over !== d.armed) {
      d.armed = over
      hapticSelection()
    }
  }

  /** Пружина после жеста — Web Animations по заранее посчитанной траектории (см. springPath). */
  const runSpring = (to: number, v: number, sp: Spring, H: number, done?: () => void) => {
    const el = sheetRef.current
    const dim = dimRef.current
    if (!el) return
    const path = springPath(yRef.current, to, v, sp)
    const opts: KeyframeAnimationOptions = {
      duration: (path.length - 1) * (1000 / 60),
      easing: 'linear',
      fill: 'forwards',
    }
    const opacity = (y: number) => Math.max(0, Math.min(1, 1 - Math.max(0, y) / H))
    const a = el.animate(
      path.map((y) => ({ transform: `translate3d(0, ${y}px, 0)` })),
      opts,
    )
    const b = dim?.animate(
      path.map((y) => ({ opacity: opacity(y) })),
      opts,
    )
    // перехват на лету (канон §5.3): новый жест забирает лист с ТЕКУЩЕЙ точки
    cancelAnim.current = () => {
      try {
        a.commitStyles()
        b?.commitStyles()
      } catch {
        /* элемент уже не отрисован */
      }
      a.cancel()
      b?.cancel()
      yRef.current = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42
      cancelAnim.current = null
    }
    a.finished
      .then(() => {
        yRef.current = to
        el.style.transform = to ? `translate3d(0, ${to}px, 0)` : ''
        if (dim) dim.style.opacity = String(opacity(to))
        a.cancel()
        b?.cancel()
        cancelAnim.current = null
        done?.()
      })
      .catch(() => {
        /* отменена перехватом */
      })
  }

  const onPointerUp = () => {
    const d = drag.current
    if (!d) return
    drag.current = null
    const a = d.hist[0]
    const b = d.hist[d.hist.length - 1]
    const v = a && b && b.t > a.t ? ((b.y - a.y) / (b.t - a.t)) * 1000 : 0
    const y = yRef.current
    setStageProgress(null)
    if (y + project(v) > d.H / 2 && !lockedRef.current) {
      // улетает с той скоростью, с какой его бросили
      closingRef.current = true
      haptic()
      dropStage()
      runSpring(d.H + 24, Math.max(v, 400), spring(0.35, 0), d.H, finish)
    } else {
      runSpring(0, v, spring(0.5, prefersReducedMotion() ? 0 : 0.15), d.H)
    }
  }

  const closeBtn = (
    <button
      onClick={request}
      className={`btn-icon sheet-close ${dismissible ? '' : 'is-off'}`}
      aria-label={t('close')}
      aria-hidden={!dismissible}
      tabIndex={dismissible ? 0 : -1}
    >
      <IconClose size={15} />
    </button>
  )

  return createPortal(
    <SheetCtx.Provider value={dismiss}>
      <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={title}>
        <div ref={dimRef} className={`sheet-dim ${phase === 'closing' ? 'is-out' : ''}`} onClick={request} />
        <div
          ref={sheetRef}
          className={`sheet ${phase === 'enter' ? 'is-enter' : phase === 'closing' ? 'is-closing' : ''}`}
          onAnimationEnd={(e) => {
            if (e.target !== e.currentTarget) return
            if (phase === 'enter') setPhase('idle')
            else if (phase === 'closing') finish()
          }}
        >
          {/* Полоса-хром: grabber + leading/trailing слоты. Тянется пальцем. */}
          <div
            className="sheet-bar"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="sheet-grabber" aria-hidden="true" />
            <div className="sheet-lead">
              {leading ?? (!bare && title ? <h2 className="sheet-title">{title}</h2> : null)}
            </div>
            <div className="sheet-trail">{trailing !== undefined ? trailing : closeBtn}</div>
          </div>
          <div className="sheet-body scroll-hide">{children}</div>
        </div>
      </div>
    </SheetCtx.Provider>,
    document.body,
  )
}
