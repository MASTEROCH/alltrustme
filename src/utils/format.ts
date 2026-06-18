/** Форматирование числа с пробелами-разделителями тысяч, до 6 знаков. */
export function formatAmount(n: number): string {
  if (!isFinite(n) || n === 0) return ''
  const rounded = Math.round(n * 1e6) / 1e6
  const [int, frac] = String(rounded).split('.')
  const intGrouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return frac ? `${intGrouped}.${frac}` : intGrouped
}

/** Парсинг строки ввода в число (пробелы/запятые игнорируются). */
export function parseAmount(s: string): number {
  const cleaned = s.replace(/\s/g, '').replace(',', '.')
  const n = parseFloat(cleaned)
  return isFinite(n) ? n : 0
}

/** Копирование в буфер с фолбэком. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}
