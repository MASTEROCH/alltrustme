import { useState } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { CONTACTS } from '../data/contacts'
import { IconPlus } from './icons'
import { haptic, hapticSelection } from '../utils/telegram'
import AllContactsModal from '../modals/AllContactsModal'
import InviteModal from '../modals/InviteModal'

/** «Быстрая отправка» — рядок недавних получателей (мок-контакты, стоковые фото).
   Дополнительный блок на экране обмена. Бэкенд подключим позже. */
export default function QuickSend() {
  const { t } = useLang()
  const { toast } = useToast()
  const [active, setActive] = useState<string | null>(null)
  const [allOpen, setAllOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)

  const openInvite = () => {
    haptic()
    setInviteOpen(true)
  }

  const pick = (id: string) => {
    setActive(id)
    toast(t('quick_send_toast'))
  }

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <p className="section-label">{t('quick_send')}</p>
        <button
          onClick={() => {
            haptic()
            setAllOpen(true)
          }}
          className="press text-[13px] font-semibold text-[var(--blue)]"
        >
          {t('quick_send_all')}
        </button>
      </div>

      <div className="scroll-hide -mx-1 flex gap-3.5 overflow-x-auto px-1 pb-1">
        {/* Добавить → пригласить друга */}
        <button onClick={openInvite} className="press flex w-[62px] shrink-0 flex-col items-center gap-2">

          <span className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-dashed border-[rgba(160,188,255,0.3)] bg-[var(--card)] text-[var(--blue)]">
            <IconPlus size={22} />
          </span>
          <span className="text-[12px] text-[var(--text3)]">{t('quick_send_add')}</span>
        </button>

        {/* Контакты */}
        {CONTACTS.map((c, i) => {
          const isActive = active === c.id
          return (
            <button
              key={c.id}
              onClick={() => {
                hapticSelection()
                pick(c.id)
              }}
              className="press flex w-[62px] shrink-0 flex-col items-center gap-2"
            >
              <span className="relative">
                {/* градиентное кольцо у первого / активного — premium */}
                <span
                  className="block rounded-full p-[2px]"
                  style={{
                    background:
                      isActive || i === 0
                        ? 'linear-gradient(140deg, var(--accent-hi), var(--blue) 50%, var(--violet))'
                        : 'rgba(160,188,255,0.18)',
                  }}
                >
                  <span className="block overflow-hidden rounded-full border-[2.5px] border-[var(--bg)]">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      loading="lazy"
                      width={52}
                      height={52}
                      className="h-[52px] w-[52px] object-cover"
                    />
                  </span>
                </span>
                {c.online && (
                  <span
                    className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[var(--bg)]"
                    style={{ background: 'var(--green)' }}
                  />
                )}
              </span>
              <span className="max-w-full truncate text-[12px] text-[var(--text2)]">{c.name}</span>
            </button>
          )
        })}
      </div>

      {allOpen && (
        <AllContactsModal
          onPick={pick}
          onAdd={() => {
            setAllOpen(false)
            setInviteOpen(true)
          }}
          onClose={() => setAllOpen(false)}
        />
      )}
      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} />}
    </section>
  )
}
