import { useNavigate } from 'react-router-dom'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import { useLang } from '../contexts/LanguageContext'
import {
  IconShield,
  IconStopwatch,
  IconIdCard,
  IconQuestion,
  IconCheckCircle,
  IconExchange,
} from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'

const KYC_URL = 'https://alltrust.me/kyc'

export default function KycScreen() {
  const { t } = useLang()
  const navigate = useNavigate()

  const docs = [
    ['d1', 'd1s'],
    ['d2', 'd2s'],
    ['d3', 'd3s'],
  ]
  const questions = [
    ['q1', 'q1s'],
    ['q2', 'q2s'],
    ['q3', 'q3s'],
    ['q4', 'q4s'],
    ['q5', 'q5s'],
  ]
  const after = [
    ['ak1', 'ak1s'],
    ['ak2', 'ak2s'],
    ['ak3', 'ak3s'],
  ]

  return (
    <ScreenShell header={<TitleHeader title={t('kyc_header')} back />}>
      {/* Hero */}
      <section
        className="card mt-2 flex flex-col items-center px-5 py-6 text-center"
        style={{ borderColor: 'rgba(47,210,126,0.25)' }}
      >
        <span className="text-[var(--green)]">
          <IconShield size={48} />
        </span>
        <h2 className="mt-4 text-[20px] font-bold">{t('kyc_hero_title')}</h2>
        <p className="mt-1.5 text-[14px] text-[var(--text2)]">{t('kyc_hero_sub')}</p>
        <span className="mt-4 flex items-center gap-1.5 rounded-full bg-[var(--green-dim)] px-3 py-1.5 text-[13px] font-semibold text-[var(--green)]">
          <IconStopwatch size={15} />
          {t('kyc_timer')}
        </span>
      </section>

      {/* Алерт паспорт */}
      <div
        className="mt-4 flex items-center gap-3 rounded-[var(--r)] border border-[rgba(61,139,255,0.25)] p-5"
        style={{ background: 'var(--blue-dim)' }}
      >
        <span className="shrink-0 text-[var(--blue)]">
          <IconIdCard size={28} />
        </span>
        <div>
          <h3 className="text-[15px] font-semibold">{t('kyc_passport_title')}</h3>
          <p className="mt-0.5 text-[13px] text-[var(--text2)]">{t('kyc_passport_sub')}</p>
        </div>
      </div>

      {/* Документы */}
      <p className="section-label mt-6 mb-2">{t('kyc_docs')}</p>
      <NumberedList items={docs} />

      {/* Вопросы */}
      <p className="section-label mt-6 mb-2">{t('kyc_questions')}</p>
      <NumberedList items={questions} question />

      {/* После KYC */}
      <p className="section-label mt-6 mb-2">{t('kyc_after')}</p>
      <div className="card list">
        {after.map(([title, sub]) => (
          <div key={title} className="row items-start">
            <span className="mt-0.5 shrink-0 text-[var(--green)]">
              <IconCheckCircle size={20} />
            </span>
            <div>
              <h4 className="text-[15px] font-medium">{t(title)}</h4>
              <p className="text-[13px] text-[var(--text3)]">{t(sub)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          haptic('medium')
          openExternal(KYC_URL)
        }}
        className="btn btn-positive btn-block mt-6"
      >
        <IconShield size={19} />
        {t('kyc_online_cta')}
      </button>
      <button
        onClick={() => {
          haptic()
          navigate('/exchange')
        }}
        className="btn btn-secondary is-accent btn-block mt-2.5"
      >
        <IconExchange size={19} />
        {t('kyc_go_ex')}
      </button>
    </ScreenShell>
  )
}

function NumberedList({ items, question }: { items: string[][]; question?: boolean }) {
  const { t } = useLang()
  return (
    <div className="card list">
      {items.map(([title, sub], i) => (
        <div key={title} className="row items-start">
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[8px] border border-[rgba(61,139,255,0.3)] bg-[var(--blue-dim)] text-[var(--blue)]">
            {question ? <IconQuestion size={15} /> : <span className="font-mono text-[14px] font-bold">{i + 1}</span>}
          </span>
          <div>
            <h4 className="text-[15px] font-medium">{t(title)}</h4>
            <p className="text-[13px] text-[var(--text3)]">{t(sub)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
