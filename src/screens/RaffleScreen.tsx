import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import Glyph, { TONE_COLOR, TONE_DIM } from '../components/Glyph'
import ActiveBonusBanner from '../components/ActiveBonusBanner'
import PrizeModal from '../modals/PrizeModal'
import RaffleWelcomeModal, { RAFFLE_WELCOME_FLAG } from '../modals/RaffleWelcomeModal'
import ActivateBonusModal from '../modals/ActivateBonusModal'
import UpgradeModal from '../modals/UpgradeModal'
import CountUp from '../components/CountUp'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { PRIZES, type Prize } from '../data/prizes'
import { SPONSORS } from '../data/sponsors'
import {
  IconTicket,
  IconGift,
  IconExchange,
  IconUsers,
  IconBolt,
  IconChevronRight,
  IconQuestion,
  IconRocket,
  IconStories,
  IconLink,
  IconShareArrow,
  IconCheck,
} from '../components/icons'
import { haptic } from '../utils/telegram'
import { copyToClipboard } from '../utils/format'
import { getFlag } from '../utils/persist'

// мок-данные (бэкенд подключим позже)
const TICKETS = 3
const SEASON_CUR = 670
const SEASON_GOAL = 1000
const REFERRALS = 7
const BONUS_AVAILABLE = 2
const BONUS_USED = 0

export default function RaffleScreen() {
  const { t, rtl } = useLang()
  const { toast } = useToast()
  const navigate = useNavigate()
  const shareRef = useRef<HTMLDivElement>(null)

  const [prize, setPrize] = useState<Prize | null>(null)
  const [welcome, setWelcome] = useState(false)
  const [activate, setActivate] = useState(false)
  const [upgrade, setUpgrade] = useState(false)
  const [activeCode, setActiveCode] = useState<string | null>(null)
  const [shareGlow, setShareGlow] = useState(false)
  const [promoCopied, setPromoCopied] = useState(false)

  useEffect(() => {
    if (!getFlag(RAFFLE_WELCOME_FLAG)) setWelcome(true)
  }, [])

  const refProgress = REFERRALS % 3 // 1
  const seasonPct = Math.round((SEASON_CUR / SEASON_GOAL) * 100)

  const scrollToShare = () => {
    haptic()
    shareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setShareGlow(true)
    setTimeout(() => setShareGlow(false), 3200)
  }

  const copyPromo = async () => {
    haptic()
    if (await copyToClipboard('APPHUB')) {
      setPromoCopied(true)
      toast(t('toast_promo_copied'))
      setTimeout(() => setPromoCopied(false), 2000)
    }
  }

  const chevron = (
    <span style={{ transform: rtl ? 'scaleX(-1)' : undefined }}>
      <IconChevronRight size={18} />
    </span>
  )

  return (
    <ScreenShell header={<TitleHeader title={t('raffle_full_header')} />}>
      {/* Лента спонсоров — единый стиль с тикером курсов (liquid-glass) */}
      <div className="liquid-glass relative mt-2 overflow-hidden rounded-[var(--r)] p-3">
        <div className="shimmer pointer-events-none absolute inset-0 z-10" />
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <div className="sponsor-scroll flex w-max gap-2">
            {[...SPONSORS, ...SPONSORS].map((s, i) => (
              <div
                key={i}
                className="flex min-w-[230px] items-center gap-2.5 rounded-[var(--rs)] bg-[var(--card2)] px-3 py-3"
              >
                <span className="icon-chip h-10 w-10 bg-[var(--gold-dim)] text-[var(--gold)]">
                  <Glyph name={s.icon} size={22} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold">{s.name}</p>
                  <p className="truncate text-[12px] text-[var(--gold)]">{t(s.roleKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Счётчик билетов + прогресс сезона — премиум золото */}
      <button
        onClick={scrollToShare}
        className="edge-gold press relative mt-4 w-full overflow-hidden rounded-[var(--r)] p-6 text-center"
        style={{
          background:
            'radial-gradient(130% 95% at 80% -10%, rgba(245,176,66,0.32), transparent 55%), linear-gradient(135deg, #33240b 0%, #241906 55%, #1a1205 100%)',
        }}
      >
        <span className="shine pointer-events-none absolute inset-0 overflow-hidden rounded-[var(--r)]" />

        <p
          className="num-glow relative font-mono text-[58px] font-extrabold leading-none"
          style={{
            background: 'linear-gradient(135deg, #ffe0a3, var(--gold))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          <CountUp end={TICKETS} duration={900} />
        </p>
        <p className="relative mt-1.5 text-[15px] font-medium text-[rgba(255,224,170,0.8)]">
          {t('tickets_count_sub')}
        </p>

        <div className="relative mt-5 text-left">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[rgba(255,224,170,0.85)]">
              {t('season_progress')}
            </span>
            <span className="font-mono text-[14px] font-bold text-[var(--gold)]">
              <CountUp end={SEASON_CUR} grouped /> / {SEASON_GOAL}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[rgba(0,0,0,0.4)]">
            <div
              className="pulse-bar h-full rounded-full"
              style={{
                width: `${seasonPct}%`,
                background: 'linear-gradient(90deg, #ffd27a, var(--gold) 50%, #f97316)',
                boxShadow: '0 0 14px rgba(245,176,66,0.7)',
              }}
            />
          </div>
          <p className="mt-2.5 text-[13px] leading-snug text-[rgba(255,224,170,0.6)]">{t('season_note')}</p>
        </div>
      </button>

      {/* Призы */}
      <p className="section-label mb-2 mt-6">{t('prizes_section')}</p>
      <div className="flex flex-col gap-2">
        {PRIZES.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              haptic()
              setPrize(p)
            }}
            className="press flex items-center gap-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-4 text-left"
          >
            <span className="icon-chip h-[42px] w-[42px]" style={{ background: TONE_DIM[p.tone], color: TONE_COLOR[p.tone] }}>
              <Glyph name={p.icon} size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-[15px] font-semibold">{t(p.titleKey)}</h4>
              <p className="truncate text-[13px] text-[var(--text3)]">{t(p.descKey)}</p>
            </div>
            <span className="rounded-full bg-[var(--card2)] px-2 py-1 font-mono text-[12px] text-[var(--text2)]">
              × {p.winners}
            </span>
            <span className="text-[var(--text3)]">{chevron}</span>
          </button>
        ))}
      </div>

      {/* Рефералы */}
      <div className="mb-2 mt-6 flex items-center justify-between">
        <p className="section-label">{t('your_referrals')}</p>
        <button
          onClick={() => {
            haptic()
            setWelcome(true)
          }}
          className="press flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text3)]"
        >
          <IconQuestion size={14} />
        </button>
      </div>
      <button
        onClick={scrollToShare}
        className="press w-full rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5 text-left"
      >
        <p className="text-[13px] leading-snug text-[var(--text2)]">{t('ref_rule')}</p>

        <div className="mt-4 flex items-center gap-3">
          <span className={`icon-chip h-11 w-11 bg-[var(--gold-dim)] text-[var(--gold)] ${BONUS_AVAILABLE ? 'bonus-pulse' : ''}`}>
            <IconUsers size={22} />
          </span>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text3)]">
              {t('invited_friends')}
            </p>
            <p className="font-mono text-[26px] font-bold" style={{ color: BONUS_AVAILABLE ? 'var(--gold)' : 'var(--blue)' }}>
              {REFERRALS}
            </p>
          </div>
          {BONUS_AVAILABLE > 0 && (
            <span className="bonus-pulse flex items-center gap-1 rounded-full bg-[var(--gold-dim)] px-2.5 py-1.5 text-[13px] font-bold text-[var(--gold)]">
              <IconBolt size={13} />
              {BONUS_AVAILABLE} {t('ref_bonus_badge')}
            </span>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="text-[var(--text3)]">{t('ref_to_next')}</span>
            <span className="font-mono font-semibold text-[var(--blue)]">{refProgress} / 3</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div className="bar-blue h-full rounded-full" style={{ width: `${(refProgress / 3) * 100}%` }} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-[var(--rs)] bg-[var(--card2)] p-4">
          <IconBolt size={18} className="text-[var(--gold)]" />
          <div>
            <p className="text-[13px] font-semibold">
              {t('bonus_earned')}: {BONUS_AVAILABLE}
            </p>
            <p className="text-[12px] text-[var(--text3)]">
              {t('bonus_used_avail', { used: BONUS_USED, avail: BONUS_AVAILABLE })}
            </p>
          </div>
        </div>
      </button>

      {/* Управление бонусом: баннер или кнопка */}
      {activeCode ? (
        <div className="mt-2.5">
          <ActiveBonusBanner code={activeCode} timeLeft="23 ч 12 м" />
        </div>
      ) : (
        BONUS_AVAILABLE > 0 && (
          <button
            onClick={() => {
              haptic('medium')
              setActivate(true)
            }}
            className="btn-glow-border press mt-2.5 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-4 text-[15px] font-bold"
            style={{ background: 'linear-gradient(150deg, #ffd27a, var(--gold) 55%, #e08a1e)', color: '#2a1800', boxShadow: '0 8px 26px rgba(245,176,66,0.4)' }}
          >
            <IconBolt size={19} />
            {t('activate_bonus_btn')}
          </button>
        )
      )}

      {/* Как получить билеты */}
      <p className="section-label mb-2 mt-6">{t('how_get_tickets')}</p>
      <div className="overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)]">
        <EarnRow Icon={IconExchange} title={t('ticket_ex_title')} sub={t('ticket_ex_sub')} onClick={scrollToShare} />
        <div className="h-px bg-[var(--border)]" />
        <EarnRow Icon={IconUsers} title={t('ticket_ref_title')} sub={t('ticket_ref_sub')} onClick={scrollToShare} />
      </div>

      {/* Промокоды */}
      <p className="section-label mb-2 mt-6">{t('promo_section')}</p>
      <div className="rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5">
        <p className="flex items-center gap-1.5 text-[14px] font-semibold">
          <IconTicket size={16} className="text-[var(--blue)]" />
          {t('base_promo')}
        </p>
        <div className="mt-2.5 flex items-center gap-2 rounded-[var(--rs)] bg-[var(--card2)] p-2.5">
          <span className="flex-1 font-mono text-[16px] font-bold text-[var(--blue)]">APPHUB</span>
          <button
            onClick={copyPromo}
            className="press flex items-center gap-1 rounded-full bg-[var(--blue-dim)] px-3 py-1.5 text-[13px] font-semibold text-[var(--blue)]"
          >
            {promoCopied ? <IconCheck size={14} /> : t('copy')}
          </button>
        </div>

        {BONUS_AVAILABLE > 0 && (
          <p className="mt-4 flex items-center gap-1.5 rounded-[var(--rs)] bg-[var(--gold-dim)] px-3 py-2 text-[13px] font-semibold text-[var(--gold)]">
            <IconBolt size={16} />
            {t('promo_bonus_count', { n: BONUS_AVAILABLE })}
          </p>
        )}

        <div className="mt-4 rounded-[var(--rs)] bg-[var(--card2)] p-4">
          <p className="text-[12px] text-[var(--text3)]">
            {t('promo_ref_progress', { cur: refProgress, total: 3 })}
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div className="bar-blue h-full rounded-full" style={{ width: `${(refProgress / 3) * 100}%` }} />
          </div>
        </div>

        <button
          onClick={() => {
            haptic()
            setUpgrade(true)
          }}
          className="press mt-4 flex w-full items-center gap-3 rounded-[var(--rs)] border border-[rgba(245,158,11,0.25)] p-4 text-left"
          style={{ background: 'var(--gold-dim)' }}
        >
          <span className="text-[var(--gold)]">
            <IconRocket size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-[14px] font-semibold text-[var(--gold)]">{t('upgrade_promo_title')}</h4>
            <p className="truncate text-[12px] text-[var(--text3)]">{t('upgrade_promo_sub')}</p>
          </div>
          <span className="text-[var(--gold)]">{chevron}</span>
        </button>
      </div>

      {/* Блок шеринга */}
      <div
        ref={shareRef}
        className={`mt-6 rounded-[var(--r)] border bg-[var(--card)] p-5 ${shareGlow ? 'glow-border' : 'border-[var(--border)]'}`}
      >
        <p className="flex items-center gap-1.5 text-[14px] font-semibold">
          <IconGift size={16} className="text-[var(--gold)]" />
          {t('share_title')}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <ShareBtn
            title={t('share_stories_t')}
            sub={t('share_stories_s')}
            icon={<IconStories size={20} />}
            style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d 60%, #fcb045)', color: '#fff' }}
            onClick={() => {
              haptic()
              toast(t('toast_text_copied'))
            }}
          />
          <ShareBtn
            title={t('share_invite_t')}
            sub={t('share_invite_s')}
            icon={<IconLink size={20} />}
            style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}
            onClick={() => {
              haptic()
              toast(t('toast_link_copied'))
            }}
          />
          <ShareBtn
            title={t('share_native_t')}
            sub={t('share_native_s')}
            icon={<IconShareArrow size={20} />}
            style={{ background: 'var(--card2)', color: 'var(--text2)' }}
            onClick={() => {
              haptic()
              toast(t('toast_link_copied'))
            }}
          />
        </div>
      </div>

      {/* Нижний CTA */}
      <button
        onClick={() => {
          haptic('medium')
          navigate('/exchange')
        }}
        className="relative overflow-hidden shine press mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-4 text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 50%, var(--blue2))', boxShadow: '0 8px 28px var(--blue-glow)', color: 'var(--on-accent)' }}
      >
        <IconExchange size={19} />
        {t('raffle_bottom_cta')}
      </button>

      {/* Модалки */}
      {prize && <PrizeModal prize={prize} onClose={() => setPrize(null)} />}
      {welcome && <RaffleWelcomeModal onClose={() => setWelcome(false)} />}
      {upgrade && (
        <UpgradeModal
          refsCurrent={refProgress}
          bonusAvailable={BONUS_AVAILABLE}
          onRepost={() => {
            setUpgrade(false)
            setTimeout(scrollToShare, 300)
          }}
          onClose={() => {
            setUpgrade(false)
            setTimeout(scrollToShare, 300)
          }}
        />
      )}
      {activate && (
        <ActivateBonusModal
          onActivated={(code) => setActiveCode(code)}
          onUseNow={() => {
            setActivate(false)
            navigate('/exchange')
          }}
          onClose={() => setActivate(false)}
        />
      )}
    </ScreenShell>
  )
}

function EarnRow({
  Icon,
  title,
  sub,
  onClick,
}: {
  Icon: (p: { size?: number }) => React.ReactElement
  title: string
  sub: string
  onClick: () => void
}) {
  const { t } = useLang()
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-5 py-4 text-left active:bg-[var(--card2)]">
      <span className="icon-chip h-10 w-10 bg-[var(--gold-dim)] text-[var(--gold)]">
        <Icon size={20} />
      </span>
      <div className="flex-1">
        <h4 className="text-[15px] font-semibold">{title}</h4>
        <p className="text-[13px] text-[var(--text3)]">{sub}</p>
      </div>
      <span className="flex items-center gap-1 rounded-full bg-[var(--gold-dim)] px-2.5 py-1 text-[13px] font-bold text-[var(--gold)]">
        +1
        <IconTicket size={15} />
      </span>
      <span className="sr-only">{t('tickets')}</span>
    </button>
  )
}

function ShareBtn({
  title,
  sub,
  icon,
  style,
  onClick,
}: {
  title: string
  sub: string
  icon: React.ReactNode
  style: React.CSSProperties
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="press flex flex-col items-center gap-1.5 rounded-[var(--rs)] py-3"
      style={style}
    >
      {icon}
      <span className="text-[13px] font-bold leading-none">{title}</span>
      <span className="text-[9px] leading-none opacity-80">{sub}</span>
    </button>
  )
}
