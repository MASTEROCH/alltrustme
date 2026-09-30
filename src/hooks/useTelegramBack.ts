import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { tg } from '../utils/telegram'
import { sheets } from '../utils/sheets'

/** Telegram BackButton: на внутренних экранах виден и ведёт назад.
   Если открыт bottom-sheet — сначала закрывает его (через history.back → popstate). */
export function useTelegramBack(): void {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const bb = tg()?.BackButton
    if (!bb) return
    const isRoot = pathname === '/'
    const handler = () => {
      if (sheets.n > 0) {
        window.history.back()
        return
      }
      navigate(-1)
    }
    // обработчик регистрируем ВСЕГДА (модалка на главной тоже показывает кнопку),
    // видимостью управляем отдельно
    bb.onClick(handler)
    if (isRoot && sheets.n === 0) bb.hide()
    else bb.show()
    return () => {
      bb.offClick(handler)
    }
  }, [pathname, navigate])
}
