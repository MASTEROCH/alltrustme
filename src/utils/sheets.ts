/** Счётчик открытых bottom-sheet'ов — чтобы системный «назад» / Telegram BackButton
   сначала закрывали верхнее окно, а не уходили с экрана (закон модального окна). */
export const sheets = { n: 0 }

/* ── Отступающая сцена (iOS card presentation) ──
   Пока видна хоть одна шторка, приложение за ней уходит вглубь: <html class="sheet-open">.
   Счёт отдельный от sheets.n: сцена возвращается В МОМЕНТ начала закрытия, синхронно
   с уезжающей шторкой, а не после размонтирования. */
let raised = 0

function sync() {
  document.documentElement.classList.toggle('sheet-open', raised > 0)
}

export function raiseStage(): void {
  raised += 1
  sync()
}

export function lowerStage(): void {
  raised = Math.max(0, raised - 1)
  sync()
}

/** Доля «открытости» во время свайпа шторки: 1 — открыта, 0 — у края. Сцена следует за пальцем. */
export function setStageProgress(p: number | null): void {
  const root = document.documentElement
  root.classList.toggle('sheet-dragging', p !== null)
  if (p === null) root.style.removeProperty('--sheet-p')
  else root.style.setProperty('--sheet-p', p.toFixed(3))
}
