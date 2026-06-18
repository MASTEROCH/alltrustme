import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconRocket, IconStories, IconUsers, IconStopwatch, IconBolt } from '../components/icons'
import { haptic } from '../utils/telegram'

interface Props {
  refsCurrent: number
  bonusAvailable: number
  onRepost: () => void
  onClose: () => void
}

export default function UpgradeModal({ refsCurrent, bonusAvailable, onRepost, onClose }: Props) {
  const { t } = useLang()
  const pct = Math.round((refsCurrent / 3) * 100)

  return (
    <ModalOverlay onClose={onClose} bare>
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="icon-chip h-14 w-14 bg-[var(--gold-dim)] text-[var(--gold)]">
          <IconRocket size={28} />
        </span>
        <h2 className="mt-4 text-[18px] font-bold">{t('upg_title')}</h2>
        <p className="mt-1 text-[14px] text-[var(--text2)]">{t('upg_sub')}</p>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {/* Репост */}
        <button
          onClick={() => {
            haptic()
            onRepost()
          }}
          className="press flex items-start gap-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5 text-left"
        >
          <span className="icon-chip h-10 w-10 bg-[var(--gold-dim)] text-[var(--gold)]">
            <IconStories size={20} />
          </span>
          <div className="flex-1">
            <h4 className="text-[15px] font-semibold">{t('upg_repost_t')}</h4>
            <p className="text-[13px] text-[var(--text3)]">{t('upg_repost_s')}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[12px] text-[var(--text3)]">
              <IconStopwatch size={12} />
              {t('upg_repost_note')}
            </p>
          </div>
        </button>

        {/* 3 реферала */}
        <div className="rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="flex items-start gap-3">
            <span className="icon-chip h-10 w-10 bg-[var(--blue-dim)] text-[var(--blue)]">
              <IconUsers size={20} />
            </span>
            <div className="flex-1">
              <h4 className="text-[15px] font-semibold">{t('upg_refs_t')}</h4>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--text3)]">
                <IconBolt size={13} className="text-[var(--gold)]" />
                {t('upg_refs_note')}
              </p>
            </div>
          </div>
          {bonusAvailable > 0 && (
            <p className="mt-4 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--gold)]">
              <IconBolt size={13} />
              {t('promo_bonus_count', { n: bonusAvailable })}
            </p>
          )}
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.08)]">
            <div className="bar-blue h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-[12px] text-[var(--text3)]">
            {t('promo_ref_progress', { cur: refsCurrent, total: 3 })}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          haptic()
          onClose()
        }}
        className="press mt-4 w-full rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] py-3.5 text-[15px] font-semibold"
      >
        {t('close')}
      </button>
    </ModalOverlay>
  )
}
