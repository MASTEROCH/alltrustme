/* Тонкая обёртка над Telegram WebApp SDK — ТОЛЬКО UI-стороны.
   Никаких initData/авторизации/сети. Всё деградирует gracefully вне Telegram. */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'

interface TgWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor?: (c: string) => void
  setBackgroundColor?: (c: string) => void
  BackButton?: {
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
  shareToStory?: (media: string, params?: { text?: string; widget_link?: unknown }) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp }
  }
}

export function tg(): TgWebApp | undefined {
  return window.Telegram?.WebApp
}

export function initTelegram(): void {
  const wa = tg()
  if (!wa) return
  try {
    wa.ready()
    wa.expand()
    wa.setHeaderColor?.('#0f0f13')
    wa.setBackgroundColor?.('#0f0f13')
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

/** Внешняя ссылка (Telegram-канал, карты, такси, сайт обмена) */
export function openExternal(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer')
}
