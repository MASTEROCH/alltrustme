import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
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
import { haptic, hapticSelection } from '../utils/telegram'
import { setFlag } from '../utils/persist'

export const ONBOARDING_FLAG = 'alltrust_onboarding_seen'

/** Онбординг первого запуска — 3 шага: приветствие → как работает → доверие.
   Точки прогресса + «Далее»/«Начать» + «Пропустить». Запоминается флагом. */
export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const { t, rtl } = useLang()
  const [step, setStep] = useState(0)
  const last = step === 2

  const finish = () => {
    haptic()
    setFlag(ONBOARDING_FLAG)
    onClose()
  }
  const next = () => {
    if (last) return finish()
    hapticSelection()
    setStep((s) => s + 1)
  }

  return (
    <ModalOverlay onClose={finish} bare>
      <div className="pt-1 pb-1">
        {/* шапка: точки + пропустить */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 22 : 7,
                  background: i === step ? 'var(--blue)' : 'var(--card2)',
                }}
              />
            ))}
          </div>
          {!last && (
            <button onClick={finish} className="text-[13px] font-medium text-[var(--text3)]">
              {t('onb_skip')}
            </button>
          )}
        </div>

        {/* контент шага */}
        <div key={step} className="onb-step mt-6 min-h-[300px]">
          {step === 0 && <StepWelcome />}
          {step === 1 && <StepHow />}
          {step === 2 && <StepTrust />}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="press shine relative mt-4 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--r)] py-4 text-[16px] font-bold text-[var(--on-accent)]"
          style={{
            background:
              'radial-gradient(120% 95% at 82% 0%, rgba(255,255,255,0.34), transparent 48%), linear-gradient(150deg, var(--accent-hi) 0%, var(--blue) 48%, var(--blue2) 100%)',
            boxShadow: '0 10px 30px var(--blue-glow), inset 0 1px 0 rgba(255,255,255,0.45)',
          }}
        >
          {last && (
            <span style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}>
              <IconArrowRight size={19} />
            </span>
          )}
          {last ? t('onb_start') : t('onb_next')}
        </button>
      </div>
    </ModalOverlay>
  )
}

function StepWelcome() {
  const { t } = useLang()
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className="pop-in flex h-20 w-20 items-center justify-center rounded-[22px] p-3"
        style={{ background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 55%, var(--blue2))', boxShadow: '0 12px 36px var(--blue-glow)' }}
      >
        <img src={`${import.meta.env.BASE_URL}alltrust-logo.svg`} alt="AllTrust.me" className="h-full w-full" />
      </span>
      <h2 className="mt-5 text-[22px] font-extrabold leading-tight tracking-tight">{t('onb1_title')}</h2>
      <p className="mt-3 max-w-[320px] text-[14px] leading-relaxed text-[var(--text2)]">{t('onb1_sub')}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(52,210,126,0.35)] bg-[var(--green-dim)] px-3 py-1.5 text-[12px] font-semibold text-[var(--green)]">
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
      <h2 className="text-center text-[21px] font-extrabold tracking-tight">{t('onb2_title')}</h2>
      <div className="mt-6 flex flex-col gap-3">
        {steps.map((st, i) => (
          <div key={i} className="flex items-center gap-3.5 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] p-4">
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--rs)] bg-[var(--blue-dim)] text-[var(--blue)]">
              <st.Icon size={23} />
              <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--blue)] font-mono text-[11px] font-bold text-white">
                {i + 1}
              </span>
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
      <h2 className="text-center text-[21px] font-extrabold tracking-tight">{t('onb3_title')}</h2>
      <div className="mt-6 flex flex-col gap-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-dim)] text-[var(--green)]">
              <IconCheckCircle size={19} />
            </span>
            <span className="flex items-center gap-2 text-[14px] font-medium leading-snug">
              <span className="text-[var(--blue)]">
                <it.Icon size={17} />
              </span>
              {it.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
