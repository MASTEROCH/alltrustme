import { useRef } from 'react'
import ModalOverlay, { type SheetHandle } from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { LANGS, LANG_LABELS, LANG_NAMES, LANG_FLAGS } from '../i18n'
import { IconCheck } from '../components/icons'
import { hapticSelection } from '../utils/telegram'

export default function LanguageModal({ onClose }: { onClose: () => void }) {
  const { lang, setLang, t } = useLang()
  const sheet = useRef<SheetHandle>(null)

  return (
    <ModalOverlay title={t('lang_title')} onClose={onClose} sheet={sheet}>
      <div className="flex flex-col gap-1.5">
        {LANGS.map((l) => {
          const active = l === lang
          return (
            <button
              key={l}
              onClick={() => {
                hapticSelection()
                setLang(l)
                sheet.current?.dismiss()
              }}
              className={`card press flex items-center gap-3 px-3.5 py-3 text-start ${active ? 'is-selected' : ''}`}
              style={{ borderRadius: 'var(--rs)' }}
            >
              <span className="text-[22px] leading-none">{LANG_FLAGS[l]}</span>
              <span className="flex flex-1 flex-col">
                <span className="text-[15px] font-semibold">{LANG_NAMES[l]}</span>
                <span className="text-[12px] font-bold tracking-wider text-[var(--text3)]">
                  {LANG_LABELS[l]}
                </span>
              </span>
              {active && (
                <span className="text-[var(--blue)]">
                  <IconCheck size={20} />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </ModalOverlay>
  )
}
