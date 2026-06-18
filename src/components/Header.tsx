import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { LANG_LABELS } from '../i18n'
import { IconShield as IconShieldMini } from './icons'
import { haptic } from '../utils/telegram'
import LanguageModal from '../modals/LanguageModal'
import NbgLicenseModal from '../modals/NbgLicenseModal'

export default function Header() {
  const { t, lang } = useLang()
  const [langOpen, setLangOpen] = useState(false)
  const [nbgOpen, setNbgOpen] = useState(false)

  return (
    <>
      <header className="chrome-header flex items-center justify-between gap-2 px-4 py-3">
        {/* Бренд */}
        <div className="flex min-w-0 items-center gap-2">
          <img
            src={`${import.meta.env.BASE_URL}alltrust-logo.svg`}
            alt="AllTrust.me"
            className="h-9 w-9 shrink-0"
            style={{ filter: 'drop-shadow(0 0 12px var(--blue-glow))' }}
          />
          <span className="truncate text-[16px] font-bold tracking-tight">
            All<span className="text-[var(--blue)]">Trust</span>.me
          </span>
        </div>

        {/* Язык + лицензия */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            onClick={() => {
              haptic()
              setLangOpen(true)
            }}
            className="press rounded-[9px] border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 text-[12px] font-bold tracking-wider text-[var(--text2)]"
          >
            {LANG_LABELS[lang]}
          </button>
          <button
            onClick={() => {
              haptic()
              setNbgOpen(true)
            }}
            className="press flex items-center gap-1 whitespace-nowrap rounded-full border border-[rgba(34,197,94,0.25)] bg-[var(--green-dim)] px-2.5 py-1.5 text-[11.5px] font-semibold text-[var(--green)]"
          >
            <IconShieldMini size={11} />
            {t('nbg_badge')}
          </button>
        </div>
      </header>

      {langOpen && <LanguageModal onClose={() => setLangOpen(false)} />}
      {nbgOpen && <NbgLicenseModal onClose={() => setNbgOpen(false)} />}
    </>
  )
}
