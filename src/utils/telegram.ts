/* Тонкая обёртка над Telegram WebApp SDK — ТОЛЬКО UI-стороны.
   Никаких initData/авторизации/сети. Всё деградирует gracefully вне Telegram. */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'

interface TgWebApp {
  ready: () => void
  expand: () => void
  version?: string
  initData?: string
  isVersionAtLeast?: (v: string) => boolean
  setHeaderColor?: (c: string) => void
  setBackgroundColor?: (c: string) => void
  setBottomBarColor?: (c: string) => void
  disableVerticalSwipes?: () => void
  openLink?: (url: string, opts?: { try_instant_view?: boolean }) => void
  openTelegramLink?: (url: string) => void
  addToHomeScreen?: () => void
  checkHomeScreenStatus?: (cb: (status: 'unsupported' | 'unknown' | 'added' | 'missed') => void) => void
  BackButton?: {
    isVisible?: boolean
    show: () => void
    hide: () => void
    onClick: (cb: () => void) => void
    offClick: (cb: () => void) => void
  }
  HapticFeedback?: {
    impactOccurred: (s: HapticStyle) => void
    notificationOccurred: (t: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  shareToStory?: (
    media: string,
    params?: { text?: string; widget_link?: { url: string; name?: string } },
  ) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp }
  }
}

const BG = '#050609' // = --bg в theme.css (раньше стоял #0f0f13 → полоска другого цвета в шапке TMA)

export function tg(): TgWebApp | undefined {
  return window.Telegram?.WebApp
}

/** Реально ли мы внутри Telegram (скрипт SDK грузится и в обычном браузере). */
export function isTma(): boolean {
  return Boolean(tg()?.initData)
}

/** Есть ли у клиента системная BackButton мини-аппа (6.1+). */
export function hasTgBackButton(): boolean {
  const wa = tg()
  if (!wa || !isTma()) return false
  try {
    return wa.isVersionAtLeast?.('6.1') ?? false
  } catch {
    return false
  }
}

export function initTelegram(): void {
  installEdgeGuard()
  const wa = tg()
  if (!wa) return
  if (isTma()) document.documentElement.classList.add('tma')
  try {
    wa.ready()
    wa.expand()
    // SDK грузится и в обычном браузере (version 6.0) и ругается в консоль на любой
    // «новый» метод — поэтому гейт по реальной версии клиента, не по наличию функции
    const v = (min: string) => isTma() && (wa.isVersionAtLeast?.(min) ?? false)
    if (v('6.1')) {
      wa.setHeaderColor?.(BG)
      wa.setBackgroundColor?.(BG)
    }
    if (v('7.10')) wa.setBottomBarColor?.(BG)
    // «смахнуть вниз = закрыть» — официально выключаем, где клиент умеет (7.7+)
    if (v('7.7')) wa.disableVerticalSwipes?.()
  } catch {
    /* вне Telegram — игнорируем */
  }
}

export function haptic(style: HapticStyle = 'light'): void {
  try {
    tg()?.HapticFeedback?.impactOccurred(style)
  } catch {
    /* noop */
  }
}

export function hapticSelection(): void {
  try {
    tg()?.HapticFeedback?.selectionChanged()
  } catch {
    /* noop */
  }
}

export function hapticNotify(type: 'error' | 'success' | 'warning' = 'success'): void {
  try {
    tg()?.HapticFeedback?.notificationOccurred(type)
  } catch {
    /* noop */
  }
}

/** Внешняя ссылка (Telegram-канал, карты, такси, сайт обмена).
   В TMA t.me-ссылки открываем внутри Telegram, http — системным браузером. */
export function openExternal(url: string): void {
  const wa = tg()
  try {
    if (wa && isTma()) {
      if (/^https?:\/\/t\.me\//.test(url) && wa.openTelegramLink) return wa.openTelegramLink(url)
      if (/^https?:\/\//.test(url) && wa.openLink) return wa.openLink(url)
    }
  } catch {
    /* падаем на window.open */
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

/** Ярлык на домашний экран: настоящий API (Bot API 8.0+), иначе — нет. */
export function canAddToHome(): boolean {
  const wa = tg()
  return Boolean(wa && isTma() && wa.isVersionAtLeast?.('8.0') && typeof wa.addToHomeScreen === 'function')
}

/* ═══════════ КРАЕВОЙ СВАЙП: НЕ ЗАКРЫВАТЬ ПРИЛОЖЕНИЕ ═══════════ (канон ROCH)
   В iOS WebKit (браузер Telegram, Mini App) свайп от левого края — системный
   «назад», для веб-страницы = «закрыть». API отключить нет; ловим touchstart
   в краевой зоне и гасим первый горизонтальный touchmove.
   Оговорки: горизонтальные ленты у края должны листаться; вертикаль не трогаем. */
let edgeGuardInstalled = false
function installEdgeGuard(): void {
  if (edgeGuardInstalled || typeof document === 'undefined') return
  edgeGuardInstalled = true
  const EDGE = 26
  let st: { x: number; y: number; armed: boolean } | null = null

  const scrollableX = (el: EventTarget | null): boolean => {
    for (let n = el as HTMLElement | null; n && n !== document.body; n = n.parentElement) {
      try {
        if (n.scrollWidth - n.clientWidth > 4) {
          const ov = getComputedStyle(n).overflowX
          if (ov === 'auto' || ov === 'scroll') return true
        }
      } catch {
        /* noop */
      }
    }
    return false
  }

  document.addEventListener(
    'touchstart',
    (e) => {
      st = null
      if (e.touches.length !== 1) return
      const t = e.touches[0]
      const w = window.innerWidth
      if (t.clientX > EDGE && t.clientX < w - EDGE) return
      if (scrollableX(e.target)) return
      st = { x: t.clientX, y: t.clientY, armed: true }
    },
    { passive: false },
  )
  document.addEventListener(
    'touchmove',
    (e) => {
      if (!st || !st.armed || e.touches.length !== 1) return
      const t = e.touches[0]
      const dx = t.clientX - st.x
      const dy = t.clientY - st.y
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return
      if (Math.abs(dy) > Math.abs(dx)) {
        st.armed = false
        return
      }
      if (e.cancelable) e.preventDefault()
    },
    { passive: false },
  )
  const reset = () => {
    st = null
  }
  document.addEventListener('touchend', reset, { passive: true })
  document.addEventListener('touchcancel', reset, { passive: true })
}
