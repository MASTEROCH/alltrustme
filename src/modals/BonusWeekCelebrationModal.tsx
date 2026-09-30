import { useNavigate } from 'react-router-dom'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconBolt, IconExchange, IconUsers } from '../components/icons'
import { haptic } from '../utils/telegram'

/** Праздничная шторка «бонусный обмен получен» с парящим героем. */
export default function BonusWeekCelebrationModal({
  invited,
  available,
  onInviteMore,
  onClose,
}: {
  invited: number
  available: number
  onInviteMore: () => void
  onClose: () => void
}) {
  const { t } = useLang()
  const navigate = useNavigate()

  return (
    <ModalOverlay onClose={onClose} bare>
      <div className="flex flex-col items-center pt-3 text-center">
        <span className="bonus-bounce text-[var(--gold)]">
          <IconBolt size={64} />
        </span>
        <h2 className="mt-4 text-[22px] font-extrabold text-[var(--gold)]">{t('bw_title')}</h2>
        <p className="mt-2 max-w-[320px] text-[14px] text-[var(--text2)]">
          {t('bw_sub', { n: invited })}
        </p>

        <div
          className="mt-4 w-full rounded-[var(--r)] border border-[rgba(245,176,66,0.3)] py-4 text-center"
          style={{ background: 'var(--gold-dim)' }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text3)]">
            {t('bw_avail_label')}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[28px] font-bold text-[var(--gold)]">
            <IconBolt size={24} />
            {available}
          </p>
        </div>

        <button
          onClick={() => {
            haptic('medium')
            onClose()
            navigate('/exchange')
          }}
          className="btn btn-primary btn-block mt-4"
        >
          <IconExchange size={18} />
          {t('bw_use_now')}
        </button>
        <button
          onClick={() => {
            haptic()
            onClose()
            onInviteMore()
          }}
          className="press mt-2.5 flex w-full items-center justify-center gap-2 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card2)] py-3.5 text-[15px] font-semibold text-[var(--text2)]"
        >
          <IconUsers size={17} />
          {t('bw_invite_more')}
        </button>
      </div>
    </ModalOverlay>
  )
}
