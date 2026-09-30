import { useState } from 'react'
import ModalOverlay, { useSheetDismiss } from './ModalOverlay'
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
  const [stage, setStage] = useState<Stage>('confirm')
  return (
    // пока идёт активация — окно не закрыть ничем (раньше «пустой» onClose оставлял невидимый слой)
    <ModalOverlay onClose={onClose} bare dismissible={stage !== 'loading'}>
      <Body stage={stage} setStage={setStage} onActivated={onActivated} onUseNow={onUseNow} />
    </ModalOverlay>
  )
}

function Body({
  stage,
  setStage,
  onActivated,
  onUseNow,
}: {
  stage: Stage
  setStage: (s: Stage) => void
  onActivated: (code: string) => void
  onUseNow: () => void
}) {
  const { t } = useLang()
  const { toast } = useToast()
  const dismiss = useSheetDismiss()
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
    } else toast(t('toast_copy_failed'), 'error')
  }

  const ok = stage === 'success'

  return (
    <>
      <div key={ok ? 'ok' : 'ask'} className="sheet-hero">
        <span
          className={`icon-chip sheet-hero-icon ${ok ? 'is-pop' : ''}`}
          style={
            ok
              ? { background: 'var(--green-dim)', color: 'var(--green)' }
              : { background: 'var(--gold-dim)', color: 'var(--gold)' }
          }
        >
          {ok ? <IconCheck size={30} /> : <IconBolt size={28} />}
        </span>
        {ok ? (
          <h2 className="sheet-hero-title text-[var(--green)]">{t('act_success_title')}</h2>
        ) : (
          <>
            <h2 className="sheet-hero-title">{t('act_title')}</h2>
            <p className="sheet-hero-sub">{t('act_sub')}</p>
          </>
        )}
      </div>

      {!ok ? (
        <>
          <div className="mt-6 rounded-[var(--r)] border border-[rgba(245,176,66,0.25)] bg-[var(--gold-dim)] p-5">
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
            <button onClick={dismiss} disabled={stage === 'loading'} className="btn btn-secondary flex-1">
              {t('cancel')}
            </button>
            <button
              onClick={activate}
              className={`btn btn-gold btn-glow-border flex-1 ${stage === 'loading' ? 'is-loading' : ''}`}
              aria-busy={stage === 'loading'}
            >
              <span>{t('act_do')}</span>
            </button>
          </div>
        </>
      ) : (
        <div className="sheet-reveal">
          <p className="mt-4 text-center text-[14px] text-[var(--text2)]">{t('act_code_label')}</p>
          <div className="mt-2 flex items-center gap-2 rounded-[var(--r)] border border-[rgba(245,176,66,0.3)] bg-[var(--card2)] p-4">
            <span className="flex-1 break-all font-mono text-[15px] font-bold text-[var(--gold)]">{MOCK_CODE}</span>
            <button onClick={copy} className="btn btn-xs btn-soft-blue">
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
            className="btn btn-positive btn-block mt-4"
          >
            <IconExchange size={18} />
            {t('act_use_now')}
          </button>
          <button onClick={dismiss} className="btn btn-tertiary is-muted btn-block mt-1">
            {t('close')}
          </button>
        </div>
      )}
    </>
  )
}
