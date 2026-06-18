import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { haptic, openExternal } from '../utils/telegram'

const SUPPORT = 'https://t.me/AllTrustMe_Ge'

/** Появляется через ~2с после первого взаимодействия; прячется при смене экрана. */
export default function FloatingChat() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    let timer: ReturnType<typeof setTimeout> | null = null
    let fired = false

    const onInteract = () => {
      if (fired) return
      fired = true
      timer = setTimeout(() => setVisible(true), 2000)
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('scroll', onInteract, true)
      window.removeEventListener('click', onInteract)
    }

    window.addEventListener('touchstart', onInteract, { passive: true })
    window.addEventListener('scroll', onInteract, { capture: true, passive: true })
    window.addEventListener('click', onInteract)

    return () => {
      if (timer) clearTimeout(timer)
      cleanup()
    }
  }, [pathname])

  return (
    <button
      aria-label="Support chat"
      onClick={() => {
        haptic()
        openExternal(SUPPORT)
      }}
      className="fixed z-[160] flex h-[54px] w-[54px] items-center justify-center transition-[opacity,transform] duration-300"
      style={{
        insetInlineEnd: 18,
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 104px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.5)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      {/* пульсирующий блюр-glow за кнопкой */}
      <span className="fab-glow" aria-hidden="true" />
      {/* левитирующий логотип */}
      <span className="fab-float relative block h-full w-full">
        <img
          src={`${import.meta.env.BASE_URL}alltrust-logo.svg`}
          alt="AllTrust.me"
          className="h-full w-full"
          style={{ filter: 'drop-shadow(0 5px 14px var(--blue-glow))' }}
        />
      </span>
    </button>
  )
}
