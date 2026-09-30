import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import ModalOverlay, { type SheetHandle } from './ModalOverlay'
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
  const sheet = useRef<SheetHandle>(null)

  return (
    <ModalOverlay onClose={onClose} bare sheet={sheet}>
      <div className="sheet-hero">
        <span className="icon-chip sheet-hero-icon bg-[var(--blue-dim)] text-[var(--blue)]">
          <IconRefresh size={28} />
        </span>
        <h2 className="sheet-hero-title">{t('exinfo_title')}</h2>
        <p className="sheet-hero-sub">{t('exinfo_sub')}</p>
      </div>

      {/* Сценарий 1 */}
      <div className="card mt-4 p-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-dim)] px-2.5 py-1 text-[12px] font-semibold text-[var(--green)]">
          <IconCheckCircle size={13} />
          {t('exinfo_registered')}
        </span>
        <h3 className="mt-2.5 text-[15px] font-bold">{t('exinfo_fast')}</h3>
        <Steps tone="blue" items={['exinfo_s1_1', 'exinfo_s1_2', 'exinfo_s1_3']} />
      </div>

      {/* Сценарий 2 */}
      <div className="card mt-4 p-5">
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
        className="btn btn-soft-green btn-block mt-4"
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
        className="btn btn-primary btn-block mt-2.5"
      >
        <span style={{ transform: rtl ? 'scaleX(-1)' : undefined }}>
          <IconArrowRight size={18} />
        </span>
        {t('exinfo_proceed')}
      </button>
      <button
        onClick={() => {
          setFlag(EXINFO_FLAG)
          sheet.current?.dismiss()
        }}
        className="btn btn-tertiary is-muted btn-block mt-1"
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
