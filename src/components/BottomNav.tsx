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

export default function BottomNav() {
  const { pathname } = useLocation()
  const { t } = useLang()
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[150] mx-auto w-full max-w-[480px] px-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)' }}
    >
      <div className="liquid-glass pointer-events-auto flex items-stretch gap-0.5 rounded-[26px] p-1.5">
        {TABS.map(({ to, key, Icon }) => {
          const active = isActive(to)
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => hapticSelection()}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-[19px] py-2 transition-transform duration-200 active:scale-90"
            >
              {/* активная стеклянная подложка-сегмент */}
              {active && (
                <span
                  className="absolute inset-0 rounded-[19px]"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(61,139,255,0.18), rgba(61,139,255,0.05))',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                />
              )}
              {/* заблёкшая подсветка-бэклайт за иконкой */}
              {active && (
                <span
                  className="pointer-events-none absolute top-1.5 h-9 w-9 rounded-full"
                  style={{ background: 'var(--blue)', filter: 'blur(13px)', opacity: 0.5 }}
                />
              )}
              <span
                className="relative transition-transform duration-200"
                style={{
                  color: active ? 'var(--blue)' : 'var(--text3)',
                  transform: active ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                <Icon size={22} />
              </span>
              <span
                className="relative text-[11px] font-medium leading-none"
                style={{ color: active ? 'var(--blue)' : 'var(--text3)' }}
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
