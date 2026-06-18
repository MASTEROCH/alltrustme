import { useNavigate } from 'react-router-dom'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconRefresh, IconCheckCircle, IconUser, IconShield, IconArrowRight } from '../components/icons'
import { haptic } from '../utils/telegram'
import { setFlag } from '../utils/persist'

export const EXINFO_FLAG = 'alltrust_exinfo_seen'

export default function ExchangeInfoModal({
  onProceed,
  onClose,
}: {
  onProceed: () => void
  onClose: () => void
}) {
  const { t, rtl } = useLang()
  const navigate = useNavigate()

  return (
    <ModalOverlay onClose={onClose} bare>
      <div className="flex flex-col items-center pt-2 text-center">
        <span className="icon-chip h-14 w-14 bg-[var(--blue-dim)] text-[var(--blue)]">
          <IconRefresh size={28} />
        </span>
        <h2 className="mt-4 text-[18px] font-bold">{t('exinfo_title')}</h2>
        <p className="mt-1.5 max-w-[330px] text-[14px] text-[var(--text2)]">{t('exinfo_sub')}</p>
      </div>

      {/* Сценарий 1 */}
      <div className="mt-4 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-dim)] px-2.5 py-1 text-[12px] font-semibold text-[var(--green)]">
          <IconCheckCircle size={13} />
          {t('exinfo_registered')}
        </span>
        <h3 className="mt-2.5 text-[15px] font-bold">{t('exinfo_fast')}</h3>
        <Steps tone="blue" items={['exinfo_s1_1', 'exinfo_s1_2', 'exinfo_s1_3']} />
      </div>

      {/* Сценарий 2 */}
      <div className="mt-4 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold-dim)] px-2.5 py-1 text-[12px] font-semibold text-[var(--gold)]">
          <IconUser size={13} />
          {t('exinfo_newuser')}
        </span>
        <h3 className="mt-2.5 text-[15px] font-bold">{t('exinfo_needkyc')}</h3>
        <Steps tone="gold" items={['exinfo_s2_1', 'exinfo_s2_2']} />
        <p className="mt-2 text-[12px] italic text-[var(--text3)]">{t('exinfo_kyc_note')}</p>
      </div>

      <button
        onClick={() => {
          haptic()
          onClose()
          navigate('/kyc')
        }}
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--r)] border border-[rgba(34,197,94,0.4)] py-3.5 text-[15px] font-semibold text-[var(--green)]"
        style={{ background: 'rgba(34,197,94,0.08)' }}
      >
        <IconShield size={17} />
        {t('exinfo_kyc_btn')}
      </button>

      <button
        onClick={() => {
          haptic('medium')
          setFlag(EXINFO_FLAG)
          onProceed()
        }}
        className="relative overflow-hidden shine press mt-2.5 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-4 text-[15px] font-bold text-white"
        style={{ background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 50%, var(--blue2))', boxShadow: '0 8px 28px var(--blue-glow)', color: 'var(--on-accent)' }}
      >
        <span style={{ transform: rtl ? 'scaleX(-1)' : undefined }}>
          <IconArrowRight size={18} />
        </span>
        {t('exinfo_proceed')}
      </button>
      <button
        onClick={() => {
          setFlag(EXINFO_FLAG)
          onClose()
        }}
        className="mt-2 w-full py-2 text-[14px] text-[var(--text3)]"
      >
        {t('exinfo_dontshow')}
      </button>
    </ModalOverlay>
  )
}

function Steps({ tone, items }: { tone: 'blue' | 'gold'; items: string[] }) {
  const { t } = useLang()
  const color = tone === 'blue' ? 'var(--blue)' : 'var(--gold)'
  const dim = tone === 'blue' ? 'var(--blue-dim)' : 'var(--gold-dim)'
  return (
    <div className="mt-4 flex flex-col gap-2.5">
      {items.map((k, i) => (
        <div key={k} className="flex items-center gap-2.5">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[13px] font-bold"
            style={{ background: dim, color }}
          >
            {i + 1}
          </span>
          <span className="text-[14px] text-[var(--text2)]">{t(k)}</span>
        </div>
      ))}
    </div>
  )
}
