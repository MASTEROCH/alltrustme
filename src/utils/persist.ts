/** Чтение/запись булевых флагов в localStorage (welcome-модалка, add-to-home и т.п.). */
export function getFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

export function setFlag(key: string, value = true): void {
  try {
    localStorage.setItem(key, value ? '1' : '0')
  } catch {
    /* noop */
  }
}
