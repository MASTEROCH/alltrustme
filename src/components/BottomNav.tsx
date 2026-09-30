import { NavLink, useLocation } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { IconHome, IconExchange, IconPin, IconGift, IconConfetti, type IconProps } from './icons'
import { hapticSelection } from '../utils/telegram'

interface Tab {
  to: string
  key: string
  Icon: (p: IconProps) => React.ReactElement
}

const TABS: Tab[] = [
  { to: '/', key: 'n_home', Icon: IconHome },
  { to: '/exchange', key: 'n_ex', Icon: IconExchange },
  { to: '/offices', key: 'n_off', Icon: IconPin },
  { to: '/raffle', key: 'n_raf', Icon: IconGift },
  { to: '/events', key: 'n_ev', Icon: IconConfetti },
]

/** Плавающий liquid-glass таб-бар. Активный сегмент — ОДНА стеклянная «капля»,
   которая скользит между вкладками (а не перерисовывается на месте). */
export default function BottomNav() {
  const { pathname } = useLocation()
  const { t } = useLang()
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))
  // -1 на push-экранах (KYC, заявки): ни одна вкладка не активна, капля прячется
  const activeIdx = TABS.findIndex((tab) => isActive(tab.to))

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[150] mx-auto w-full max-w-[480px] px-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
      aria-label="Main"
    >
      <div className="liquid-glass pointer-events-auto relative flex items-stretch gap-0.5 rounded-[26px] p-1.5">
        <span
          className="nav-thumb"
          style={{ '--i': Math.max(0, activeIdx), opacity: activeIdx < 0 ? 0 : 1, transition: 'transform var(--dur-3) var(--ease), opacity var(--dur-2) ease' } as React.CSSProperties}
          aria-hidden="true"
        />
        {TABS.map(({ to, key, Icon }) => {
          const active = isActive(to)
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => hapticSelection()}
              aria-current={active ? 'page' : undefined}
              className="press relative flex flex-1 flex-col items-center gap-1 rounded-[19px] py-2"
            >
              <span
                className="relative"
                style={{
                  color: active ? 'var(--blue)' : 'var(--text3)',
                  transform: active ? 'scale(1.12)' : 'scale(1)',
                  transition: 'transform var(--dur-3) var(--spring), color var(--dur-2) ease',
                }}
              >
                <Icon size={22} />
              </span>
              <span
                className="relative text-[11px] font-medium leading-none"
                style={{
                  color: active ? 'var(--blue)' : 'var(--text3)',
                  transition: 'color var(--dur-2) ease',
                }}
              >
                {t(key)}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
