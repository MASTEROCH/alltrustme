import { useNavigate } from 'react-router-dom'
import ScreenShell from '../components/ScreenShell'
import Header from '../components/Header'
import RateTicker from '../components/RateTicker'
import AddToHomeButton from '../components/AddToHomeButton'
import CountUp from '../components/CountUp'
import Reviews from '../components/Reviews'
import { useLang } from '../contexts/LanguageContext'
import {
  IconExchange,
  IconPin,
  IconShield,
  IconConfetti,
  IconGift,
  IconStar,
  IconChevronRight,
  IconTelegram,
  IconSmartphone,
  type IconProps,
} from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'

const CHANNEL = 'https://t.me/AllTrustMe_Ge'
const DOWNLOAD = 'https://alltrust.me/app'

export default function HomeScreen() {
  const { t, rtl } = useLang()
  const navigate = useNavigate()
  const go = (to: string) => {
    haptic()
    navigate(to)
  }

  const Chevron = (
    <span className="shrink-0" style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}>
      <IconChevronRight size={18} />
    </span>
  )

  return (
    <ScreenShell header={<Header />}>
      {/* Hero — живой mesh/aurora фон + Web3 иридесцентная кромка */}
      <section className="iridescent relative mt-2 overflow-hidden rounded-[var(--r)] border border-[var(--border)] px-5 py-6">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(150deg, #12325f 0%, #0c1430 52%, #1a1247 100%)' }}
        />
        <div
          className="aurora-blob pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(61,139,255,0.5), transparent 65%)' }}
        />
        <div
          className="aurora-blob pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,109,255,0.45), transparent 65%)', animationDelay: '-8s' }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(47,210,126,0.35)] bg-[var(--green-dim)] px-3 py-1.5 text-[12px] font-semibold text-[var(--green)]">
            <IconShield size={14} className="shrink-0" />
            {t('hero_tag')}
          </span>
          {/* Hero-типографика: clamp-масштаб, 800, tight tracking */}
          <h1
            className="mt-4 text-[clamp(26px,7.4vw,32px)] font-extrabold leading-[1.08] tracking-[-0.03em]"
            dangerouslySetInnerHTML={{ __html: t('hero_title') }}
          />
          <p className="mt-3 max-w-[32ch] text-[14px] leading-relaxed text-[var(--text2)]">{t('hero_sub')}</p>

          <div className="mt-6 flex items-stretch gap-3">
            <Stat value={<CountUp end={150} suffix="K+" />} label={t('clients')} />
            <span className="w-px self-stretch bg-[var(--border)]" />
            <Stat value={<CountUp end={750} suffix="K+" />} label={t('txns')} />
            <span className="w-px self-stretch bg-[var(--border)]" />
            <button
              onClick={() => {
                haptic()
                openExternal('https://www.google.com/search?q=AllTrust.me')
              }}
              className="press flex flex-col items-start"
            >
              <span className="flex items-center gap-1 font-mono text-[17px] font-bold">
                4.9
                <span className="text-[var(--gold)]">
                  <IconStar size={15} />
                </span>
              </span>
              <span className="text-[12px] text-[var(--text3)]">{t('rate_google')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Тикер — каждая пара открывает калькулятор */}
      <div className="mt-4">
        <RateTicker />
      </div>

      {/* Quick actions 2×2 */}
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <QuickAction primary Icon={IconExchange} title={t('exchange')} sub={t('ex_sub')} onClick={() => go('/exchange')} />
        <QuickAction accent="cyan" Icon={IconPin} title={t('offices')} sub={t('off_sub')} onClick={() => go('/offices')} />
        <QuickAction accent="blue" Icon={IconShield} title={t('kyc_action')} sub={t('kyc_sub')} onClick={() => go('/kyc')} />
        <QuickAction accent="gold" Icon={IconConfetti} title={t('events')} sub={t('ev_sub')} onClick={() => go('/events')} />
      </div>

      {/* Баннер розыгрыша — премиум золото (единственное место золота на главной) */}
      <button
        onClick={() => go('/raffle')}
        className="edge-gold press relative mt-4 w-full overflow-visible rounded-[var(--r)] p-5 text-start"
        style={{
          background:
            'radial-gradient(135% 100% at 100% 0%, rgba(245,176,66,0.34), transparent 52%), linear-gradient(135deg, #33240b 0%, #241906 55%, #1a1205 100%)',
        }}
      >
        <span className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--r)]" />

        <div className="relative flex items-center justify-between">
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-[#2a1800]"
            style={{ background: 'linear-gradient(135deg, #ffd27a, var(--gold))' }}
          >
            <IconGift size={17} />
            {t('gift_badge')}
          </span>
          <span className="text-[var(--gold)]" style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}>
            <IconChevronRight size={18} />
          </span>
        </div>

        <h3 className="relative mt-3 text-[20px] font-extrabold leading-tight tracking-tight text-[#fff4e0]">
          {t('raffle_header')}{' '}
          <span
            className="font-mono num-glow"
            style={{
              background: 'linear-gradient(135deg, #ffe0a3, var(--gold))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 24px rgba(245,176,66,0.5)',
            }}
          >
            1000 USDT
          </span>
        </h3>
        <p className="relative mt-1.5 text-[13px] text-[rgba(255,220,170,0.7)]">{t('gift_sub')}</p>

        <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-[rgba(0,0,0,0.35)]">
          <div
            className="h-full rounded-full"
            style={{
              width: '67%',
              background: 'linear-gradient(90deg, #ffd27a, var(--gold) 50%, #f97316)',
              boxShadow: '0 0 12px rgba(245,176,66,0.7)',
            }}
          />
        </div>
        <p className="relative mt-2 text-[12px] text-[rgba(255,220,170,0.55)]">
          <span className="font-mono text-[14px] font-bold text-[var(--gold)]">670</span>
          <span className="font-mono"> / 1000 </span>
          {t('tickets')}
        </p>
      </button>

      {/* Отзывы клиентов */}
      <Reviews />

      {/* Telegram-канал — главный внешний канал, отдельной строкой */}
      <button
        onClick={() => {
          haptic()
          openExternal(CHANNEL)
        }}
        className="card press mt-4 flex w-full items-center gap-3 p-5 text-start"
      >
        <span className="icon-chip h-11 w-11" style={{ background: '#229ED9', color: '#fff' }}>
          <IconTelegram size={26} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[15px] font-semibold">{t('channel_title')}</span>
          <span className="text-[12px] text-[var(--text3)]">{t('channel_sub')}</span>
        </span>
        <span className="text-[var(--text3)]">{Chevron}</span>
      </button>

      {/* Вторичные ссылки — компактно, одной строкой вместо трёх одинаковых баннеров */}
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            haptic()
            openExternal(DOWNLOAD)
          }}
          className="card press flex flex-col gap-3 p-4 text-start"
        >
          <span className="icon-chip h-10 w-10 border border-[rgba(61,139,255,0.25)] bg-[var(--blue-dim)] text-[var(--blue)]">
            <IconSmartphone size={20} />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="clamp-2 text-[14px] font-semibold leading-snug">{t('download_app_title')}</span>
            <span className="text-[11.5px] leading-snug text-[var(--text3)]">{t('download_app_sub')}</span>
          </span>
        </button>
        <AddToHomeButton compact />
      </div>
    </ScreenShell>
  )
}

function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-[17px] font-bold">{value}</span>
      <span className="text-[12px] text-[var(--text3)]">{label}</span>
    </div>
  )
}

type Accent = 'blue' | 'cyan' | 'gold'
const ACCENTS: Record<Accent, { color: string; dim: string; glow: string }> = {
  blue: { color: 'var(--blue)', dim: 'var(--blue-dim)', glow: 'rgba(61,139,255,0.45)' },
  cyan: { color: 'var(--cyan)', dim: 'var(--cyan-dim)', glow: 'rgba(127,208,255,0.45)' },
  gold: { color: 'var(--gold)', dim: 'var(--gold-dim)', glow: 'rgba(245,176,66,0.45)' },
}

function QuickAction({
  Icon,
  title,
  sub,
  onClick,
  primary,
  accent = 'blue',
}: {
  Icon: (p: IconProps) => React.ReactElement
  title: string
  sub: string
  onClick: () => void
  primary?: boolean
  accent?: Accent
}) {
  const acc = ACCENTS[accent]
  return (
    <button
      onClick={onClick}
      className={`press relative flex flex-col gap-3.5 rounded-[var(--r)] p-5 text-start ${primary ? 'edge-glow' : 'card'}`}
      style={
        primary
          ? {
              background:
                'radial-gradient(120% 95% at 82% 0%, rgba(255,255,255,0.38), transparent 48%), linear-gradient(150deg, var(--accent-hi) 0%, var(--blue) 48%, var(--blue2) 100%)',
              boxShadow: '0 10px 30px var(--blue-glow), inset 0 1px 0 rgba(255,255,255,0.45)',
            }
          : undefined
      }
    >
      <span
        className="icon-chip h-12 w-12"
        style={{
          background: primary ? 'rgba(255,255,255,0.22)' : acc.dim,
          color: primary ? 'var(--on-accent)' : acc.color,
          boxShadow: primary ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : `0 0 18px -3px ${acc.glow}`,
        }}
      >
        <Icon size={23} />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[16px] font-bold leading-snug tracking-tight" style={{ color: primary ? 'var(--on-accent)' : 'var(--text)' }}>
          {title}
        </span>
        <span className="text-[13.5px] font-medium leading-snug" style={{ color: primary ? 'rgba(255,255,255,0.88)' : 'var(--text2)' }}>
          {sub}
        </span>
      </span>
    </button>
  )
}
