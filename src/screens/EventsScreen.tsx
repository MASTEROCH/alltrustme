import { useState } from 'react'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import EventsNotifyModal from '../modals/EventsNotifyModal'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { EVENTS, type EventMock } from '../data/events'
import { IconCalendar, IconUsers, IconFire, IconMic, IconGlasses, IconBell, IconCheckCircle } from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'

const ILLO = { fire: IconFire, mic: IconMic, glasses: IconGlasses }

export default function EventsScreen() {
  const { t } = useLang()
  const { toast } = useToast()
  const upcoming = EVENTS.filter((e) => !e.past)
  const past = EVENTS.filter((e) => e.past)
  const [notify, setNotify] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  return (
    <ScreenShell header={<TitleHeader title={t('ev_header')} />}>
      <p className="section-label mt-4 mb-2">{t('upcoming')}</p>
      <div className="flex flex-col gap-3">
        {upcoming.map((e) => (
          <EventCard key={e.id} ev={e} />
        ))}
      </div>

      <p className="section-label mt-6 mb-2">{t('past_ev')}</p>
      <div className="flex flex-col gap-3">
        {past.map((e) => (
          <EventCard key={e.id} ev={e} />
        ))}
      </div>

      {/* Подписка на уведомления */}
      {subscribed ? (
        <div className="mt-6 flex items-center justify-center gap-2 rounded-[var(--r)] border border-[rgba(34,197,94,0.25)] bg-[var(--green-dim)] py-3.5 text-[14px] font-medium text-[var(--green)]">
          <IconCheckCircle size={17} />
          {t('notify_subscribed')}
        </div>
      ) : (
        <button
          onClick={() => {
            haptic()
            setNotify(true)
          }}
          className="press mt-6 flex w-full items-center justify-center gap-2 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] py-3.5 text-[15px] font-semibold text-[var(--blue)]"
        >
          <IconBell size={18} />
          {t('notify_cta')}
        </button>
      )}

      {notify && (
        <EventsNotifyModal
          onSubscribed={() => {
            setSubscribed(true)
            toast(t('notify_subscribed'))
          }}
          onClose={() => setNotify(false)}
        />
      )}
    </ScreenShell>
  )
}

function EventCard({ ev }: { ev: EventMock }) {
  const { t, lang } = useLang()
  const Illo = ILLO[ev.illo]
  const dateCity = `${ev.dateLabel[lang === 'ru' ? 'ru' : 'en']} · ${ev.cityLabel[lang === 'ru' ? 'ru' : 'en']}`

  const onClick = () => {
    if (ev.past || !ev.link) return
    haptic()
    openExternal(ev.link)
  }

  return (
    <button
      onClick={onClick}
      disabled={ev.past}
      className="overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] text-left transition-transform"
      style={{ ...(ev.past ? {} : { cursor: 'pointer' }) }}
    >
      {/* Обложка — стоковое фото (в проде заменим), иконка как фолбэк */}
      <div className="relative flex h-[140px] items-center justify-center overflow-hidden" style={{ background: ev.gradient }}>
        {ev.image ? (
          <>
            <img
              src={ev.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: ev.past ? 'saturate(0.7) brightness(0.78)' : 'none' }}
            />
            {/* затемнение снизу+сверху для читаемости шильдиков */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(5,6,9,0.35) 0%, transparent 38%, transparent 60%, rgba(5,6,9,0.5) 100%)' }}
            />
          </>
        ) : (
          <span style={{ color: 'rgba(255,255,255,0.85)' }}>
            <Illo size={52} />
          </span>
        )}
        <span
          className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold backdrop-blur-sm"
          style={
            ev.past
              ? { background: 'rgba(0,0,0,0.45)', color: 'var(--text3)' }
              : { background: 'var(--blue)', color: '#fff' }
          }
        >
          <Illo size={13} />
          {ev.past ? t('past_b') : t('soon')}
        </span>
      </div>

      {/* Тело */}
      <div className="px-5 py-4">
        <p className="flex items-center gap-1.5 text-[12px] text-[var(--text3)]">
          <IconCalendar size={13} />
          {dateCity}
        </p>
        <h3 className="mt-1 text-[15px] font-bold">{t(ev.titleKey)}</h3>
        <p className="mt-1 text-[13px] leading-snug text-[var(--text2)]">{t(ev.descKey)}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[13px] text-[var(--text3)]">
            <IconUsers size={15} />
            {ev.attendees} {ev.past ? t('ev_attended') : t('ev_going')}
          </span>
          <span
            className="rounded-full px-3 py-1.5 text-[13px] font-semibold"
            style={
              ev.past
                ? { background: 'var(--card2)', color: 'var(--text3)' }
                : { background: 'var(--blue)', color: '#fff' }
            }
          >
            {ev.past ? t('arch') : t('reg')}
          </span>
        </div>
      </div>
    </button>
  )
}
