import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconGift, IconExchange, IconUsers, IconRocket, IconStories, IconTicket } from '../components/icons'
import { haptic } from '../utils/telegram'
import { setFlag } from '../utils/persist'

export const RAFFLE_WELCOME_FLAG = 'alltrust_raffle_welcome_seen'

export default function RaffleWelcomeModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  const dismiss = () => {
    haptic()
    setFlag(RAFFLE_WELCOME_FLAG)
    onClose()
  }

  return (
    <ModalOverlay onClose={dismiss} bare>
      <div className="flex flex-col items-center pt-2 text-center">
        <span
          className="icon-chip pop-in h-16 w-16 text-[var(--gold)]"
          style={{ background: 'var(--gold-dim)' }}
        >
          <IconGift size={34} />
        </span>
        <h2 className="mt-4 text-[20px] font-bold">{t('rwm_title')}</h2>
        <p className="mt-1.5 max-w-[320px] text-[14px] text-[var(--text2)]">{t('rwm_sub')}</p>
      </div>

      <p className="section-label mb-2 mt-6">{t('rwm_how')}</p>
      <div className="overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)]">
        <EarnRow icon={<IconExchange size={20} />} title={t('rwm_e1_t')} sub={t('rwm_e1_s')} />
        <div className="h-px bg-[var(--border)]" />
        <EarnRow icon={<IconUsers size={20} />} title={t('rwm_e2_t')} sub={t('rwm_e2_s')} />
      </div>

      <div
        className="mt-4 rounded-[var(--r)] border border-[rgba(245,158,11,0.25)] p-5"
        style={{ background: 'var(--gold-dim)' }}
      >
        <h4 className="flex items-center gap-2 text-[15px] font-bold text-[var(--gold)]">
          <IconRocket size={18} />
          {t('rwm_bonus_title')}
        </h4>
        <ul className="mt-2 flex flex-col gap-2">
          <li className="flex items-start gap-2 text-[13px] text-[var(--text2)]">
            <span className="mt-0.5 shrink-0 text-[var(--gold)]">
              <IconStories size={15} />
            </span>
            {t('rwm_b1')}
          </li>
          <li className="flex items-start gap-2 text-[13px] text-[var(--text2)]">
            <span className="mt-0.5 shrink-0 text-[var(--gold)]">
              <IconUsers size={15} />
            </span>
            {t('rwm_b2')}
          </li>
        </ul>
      </div>

      <button
        onClick={dismiss}
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-3.5 text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(150deg, #ffd27a, var(--gold) 55%, #e08a1e)', color: '#2a1800' }}
      >
        <IconTicket size={18} />
        {t('rwm_cta')}
      </button>
      <button onClick={dismiss} className="mt-2 w-full py-2 text-[14px] text-[var(--text3)]">
        {t('rwm_dont_show')}
      </button>
    </ModalOverlay>
  )
}

function EarnRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  const { t } = useLang()
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="icon-chip h-10 w-10 bg-[var(--gold-dim)] text-[var(--gold)]">{icon}</span>
      <div className="flex-1">
        <h4 className="text-[15px] font-semibold">{title}</h4>
        <p className="text-[13px] text-[var(--text3)]">{sub}</p>
      </div>
      <span className="flex items-center gap-1 rounded-full bg-[var(--gold-dim)] px-2.5 py-1 text-[13px] font-bold text-[var(--gold)]">
        +1
        <IconTicket size={15} />
      </span>
      <span className="sr-only">{t('tickets')}</span>
    </div>
  )
}
