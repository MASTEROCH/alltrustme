import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { IconBolt, IconCheck, IconStopwatch, IconExchange } from '../components/icons'
import { haptic, hapticNotify } from '../utils/telegram'
import { copyToClipboard } from '../utils/format'

const MOCK_CODE = 'ATM-BONUS-7F3K'

interface Props {
  onActivated: (code: string) => void
  onUseNow: () => void
  onClose: () => void
}

type Stage = 'confirm' | 'loading' | 'success'

export default function ActivateBonusModal({ onActivated, onUseNow, onClose }: Props) {
  const { t } = useLang()
  const { toast } = useToast()
  const [stage, setStage] = useState<Stage>('confirm')
  const [copied, setCopied] = useState(false)

  const activate = () => {
    haptic('medium')
    setStage('loading')
    setTimeout(() => {
      hapticNotify('success')
      setStage('success')
      onActivated(MOCK_CODE)
    }, 1100)
  }

  const copy = async () => {
    haptic()
    if (await copyToClipboard(MOCK_CODE)) {
      setCopied(true)
      toast(t('toast_bonus_copied'))
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <ModalOverlay onClose={stage === 'loading' ? () => {} : onClose} bare>
      <div className="flex flex-col items-center pt-2 text-center">
        <span
          className={`icon-chip h-16 w-16 ${stage === 'success' ? 'pop-in' : ''}`}
          style={
            stage === 'success'
              ? { background: 'var(--green-dim)', color: 'var(--green)' }
              : { background: 'var(--gold-dim)', color: 'var(--gold)' }
          }
        >
          {stage === 'success' ? <IconCheck size={32} /> : <IconBolt size={30} />}
        </span>

        {stage !== 'success' ? (
          <>
            <h2 className="mt-4 text-[18px] font-bold">{t('act_title')}</h2>
            <p className="mt-1.5 max-w-[320px] text-[14px] text-[var(--text2)]">{t('act_sub')}</p>
          </>
        ) : (
          <h2 className="mt-4 text-[20px] font-bold text-[var(--green)]">{t('act_success_title')}</h2>
        )}
      </div>

      {stage !== 'success' ? (
        <>
          <div
            className="mt-6 rounded-[var(--r)] border border-[rgba(245,158,11,0.25)] p-5"
            style={{ background: 'var(--gold-dim)' }}
          >
            <p className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--gold)]">
              <IconStopwatch size={15} />
              {t('act_conditions')}
            </p>
            <ul className="mt-2 flex flex-col gap-1 text-[13px] text-[var(--text2)]">
              <li>— {t('act_cond1')}</li>
              <li>— {t('act_cond2')}</li>
            </ul>
          </div>
          <p className="mt-4 text-center text-[12px] text-[var(--text3)]">{t('act_note')}</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={onClose}
              disabled={stage === 'loading'}
              className="press flex-1 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] py-3.5 text-[15px] font-semibold disabled:opacity-50"
            >
              {t('cancel')}
            </button>
            <button
              onClick={activate}
              disabled={stage === 'loading'}
              className="btn-glow-border press flex-1 rounded-[var(--r)] py-4 text-[15px] font-bold text-white"
              style={{ background: 'linear-gradient(150deg, #ffd27a, var(--gold) 55%, #e08a1e)', color: '#2a1800' }}
            >
              {stage === 'loading' ? '…' : t('act_do')}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-4 text-center text-[14px] text-[var(--text2)]">{t('act_code_label')}</p>
          <div className="mt-2 flex items-center gap-2 rounded-[var(--r)] border border-[rgba(245,158,11,0.3)] bg-[var(--card2)] p-4">
            <span className="flex-1 break-all font-mono text-[15px] font-bold text-[var(--gold)]">
              {MOCK_CODE}
            </span>
            <button
              onClick={copy}
              className="press flex items-center gap-1 rounded-full bg-[var(--blue-dim)] px-3 py-1.5 text-[13px] font-semibold text-[var(--blue)]"
            >
              {copied ? <IconCheck size={14} /> : t('copy')}
            </button>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-[12px] text-[var(--text3)]">
            <IconStopwatch size={12} />
            {t('act_code_hint')}
          </p>
          <button
            onClick={() => {
              haptic('medium')
              onUseNow()
            }}
            className="press mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-3.5 text-[15px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, var(--green), #16a34a)' }}
          >
            <IconExchange size={18} />
            {t('act_use_now')}
          </button>
          <button onClick={onClose} className="mt-2 w-full py-2 text-[14px] text-[var(--text3)]">
            {t('close')}
          </button>
        </>
      )}
    </ModalOverlay>
  )
}
