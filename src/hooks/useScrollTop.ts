import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** При смене маршрута — мгновенно проматывает скролл-зону наверх. */
export function useScrollTop(ref: React.RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation()
  useEffect(() => {
    ref.current?.scrollTo({ top: 0, behavior: 'auto' })
    window.scrollTo({ top: 0 })
  }, [pathname, ref])
}
