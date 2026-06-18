import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tg } from '../utils/telegram'

/** Показывает Telegram BackButton на внутренних экранах и навигирует назад. */
export function useTelegramBack(): void {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const bb = tg()?.BackButton
    if (!bb) return
    const isRoot = pathname === '/'
    const handler = () => navigate(-1)

    if (isRoot) {
      bb.hide()
    } else {
      bb.show()
      bb.onClick(handler)
    }
    return () => {
      bb.offClick(handler)
    }
  }, [pathname, navigate])
}
