import { useState } from 'react'
import ModalOverlay, { useSheetDismiss } from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import {
  IconShield,
  IconExchange,
  IconTelegram,
  IconCash,
  IconUsers,
  IconPin,
  IconCheckCircle,
  IconArrowRight,
} from '../components/icons'
import { hapticSelection } from '../utils/telegram'
import { setFlag } from '../utils/persist'

export const ONBOARDING_FLAG = 'alltrust_onboarding_seen'

const STEPS = 3

/** Онбординг первого запуска — 3 шага: приветствие → как работает → доверие.
   Паттерн Apple «What's New»: выход один и очевидный. Точки прогресса — в leading-слоте
   полосы шторки, «Пропустить» — в trailing-слоте ВМЕСТО крестика (раньше крестик ложился
   на «Пропустить»). Шаги въезжают по направлению, точки — кнопки. Запоминается флагом. */
export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const last = step === STEPS - 1

  const finish = () => {
    setFlag(ONBOARDING_FLAG)
    onClose()
  }
  const go = (i: number) => {
    if (i === step) return
    hapticSelection()
    setDir(i > step ? 1 : -1)
    setStep(i)
  }

  const dots = (
    <div className="onb-dots" role="tablist" aria-label={`${step + 1} / ${STEPS}`}>
      {Array.from({ length: STEPS }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === step}
          aria-label={`${i + 1}`}
          className={`onb-dot ${i === step ? 'is-on' : ''}`}
          onClick={() => go(i)}
        />
      ))}
    </div>
  )

  return (
    <ModalOverlay onClose={finish} bare leading={dots} trailing={last ? null : <SkipButton />}>
      {/* контент шага */}
      <div key={step} className={`onb-step min-h-[312px] ${dir < 0 ? 'is-back' : ''}`}>
        {step === 0 && <StepWelcome />}
        {step === 1 && <StepHow />}
        {step === 2 && <StepTrust />}
      </div>

      <OnbCta last={last} onNext={() => go(step + 1)} />
    </ModalOverlay>
  )
}

/** «Пропустить» закрывает шторку с анимацией — через контекст шторки, а не мгновенным onClose. */
function SkipButton() {
  const { t } = useLang()
  const dismiss = useSheetDismiss()
  return (
    <button onClick={dismiss} className="sheet-text-btn">
      {t('onb_skip')}
    </button>
  )
}

function OnbCta({ last, onNext }: { last: boolean; onNext: () => void }) {
  const { t, rtl } = useLang()
  const dismiss = useSheetDismiss()
  return (
    <button
      onClick={() => {
        if (last) dismiss()
        else onNext()
      }}
      className="btn btn-primary btn-block mt-5"
    >
      <span key={last ? 'start' : 'next'} className="onb-cta-label">
        {last ? t('onb_start') : t('onb_next')}
        <span style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} className="inline-flex">
          <IconArrowRight size={19} />
        </span>
      </span>
    </button>
  )
}

function StepWelcome() {
  const { t } = useLang()
  return (
    <div className="onb-list flex flex-col items-center pt-2 text-center">
      <span className="onb-logo" style={{ '--i': 0 } as React.CSSProperties}>
        <img src={`${import.meta.env.BASE_URL}alltrust-logo.svg`} alt="AllTrust.me" className="h-full w-full" />
      </span>
      <h2
        className="mt-6 text-[25px] font-extrabold leading-[1.15] tracking-[-0.03em]"
        style={{ '--i': 1 } as React.CSSProperties}
      >
        {t('onb1_title')}
      </h2>
      <p className="sheet-hero-sub mt-3" style={{ '--i': 2 } as React.CSSProperties}>
        {t('onb1_sub')}
      </p>
      <span className="badge-ok mt-5" style={{ '--i': 3 } as React.CSSProperties}>
        <IconShield size={14} />
        {t('onb3_b1')}
      </span>
    </div>
  )
}

function StepHow() {
  const { t } = useLang()
  const steps = [
    { Icon: IconExchange, t: t('onb2_s1_t'), s: t('onb2_s1_s') },
    { Icon: IconTelegram, t: t('onb2_s2_t'), s: t('onb2_s2_s') },
    { Icon: IconCash, t: t('onb2_s3_t'), s: t('onb2_s3_s') },
  ]
  return (
    <div>
      <h2 className="sheet-hero-title mt-0 text-center">{t('onb2_title')}</h2>
      <div className="onb-list mt-5 flex flex-col gap-2.5">
        {steps.map((st, i) => (
          <div key={i} className="card flex items-center gap-3.5 p-4" style={{ '--i': i } as React.CSSProperties}>
            <span className="icon-chip relative h-12 w-12 bg-[var(--blue-dim)] text-[var(--blue)]">
              <st.Icon size={23} />
              <span className="onb-num">{i + 1}</span>
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-snug">{st.t}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-[var(--text3)]">{st.s}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepTrust() {
  const { t } = useLang()
  const items = [
    { Icon: IconShield, text: t('onb3_b1') },
    { Icon: IconUsers, text: t('onb3_b2') },
    { Icon: IconPin, text: t('onb3_b3') },
  ]
  return (
    <div>
      <h2 className="sheet-hero-title mt-0 text-center">{t('onb3_title')}</h2>
      <div className="onb-list mt-5 flex flex-col gap-2.5">
        {items.map((it, i) => (
          <div key={i} className="card flex items-center gap-3 px-4 py-3.5" style={{ '--i': i } as React.CSSProperties}>
            <span className="icon-chip h-10 w-10 rounded-full bg-[var(--blue-dim)] text-[var(--blue)]">
              <it.Icon size={19} />
            </span>
            <span className="min-w-0 flex-1 text-[14px] font-medium leading-snug">{it.text}</span>
            <span className="onb-check" style={{ '--i': i } as React.CSSProperties}>
              <IconCheckCircle size={20} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
