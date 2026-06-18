import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { CONTACTS } from '../data/contacts'
import { IconPlus } from '../components/icons'
import { haptic, hapticSelection } from '../utils/telegram'

/** Полный список получателей «Быстрой отправки» (мок). Открывается по «Все». */
export default function AllContactsModal({
  onPick,
  onAdd,
  onClose,
}: {
  onPick: (id: string) => void
  onAdd: () => void
  onClose: () => void
}) {
  const { t } = useLang()
  return (
    <ModalOverlay title={t('quick_send')} onClose={onClose}>
      <div className="grid grid-cols-4 gap-x-3 gap-y-5 pt-1">
        {/* Добавить → пригласить */}
        <button
          onClick={() => {
            haptic()
            onAdd()
          }}
          className="press flex flex-col items-center gap-2"
        >
          <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-dashed border-[rgba(160,188,255,0.3)] bg-[var(--card)] text-[var(--blue)]">
            <IconPlus size={22} />
          </span>
          <span className="text-[12px] text-[var(--text3)]">{t('quick_send_add')}</span>
        </button>

        {CONTACTS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              hapticSelection()
              onPick(c.id)
              onClose()
            }}
            className="press flex flex-col items-center gap-2"
          >
            <span className="relative">
              <span
                className="block overflow-hidden rounded-full"
                style={{ boxShadow: '0 0 0 1.5px rgba(160,188,255,0.2)' }}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  loading="lazy"
                  width={58}
                  height={58}
                  className="h-[58px] w-[58px] object-cover"
                />
              </span>
              {c.online && (
                <span
                  className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg2)]"
                  style={{ background: 'var(--green)' }}
                />
              )}
            </span>
            <span className="max-w-full truncate text-[12px] text-[var(--text2)]">{c.name}</span>
          </button>
        ))}
      </div>
    </ModalOverlay>
  )
}
