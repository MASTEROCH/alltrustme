import { useState } from 'react'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import PhotosModal from '../modals/PhotosModal'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { OFFICES } from '../data/offices'
import { officeStatus } from '../utils/office'
import {
  IconCopy,
  IconCamera,
  IconPhone,
  IconWhatsApp,
  IconTelegram,
  IconGoogleMaps,
  IconBoltBrand,
  IconYandexGo,
  IconClock,
  IconPlane,
} from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'
import { copyToClipboard } from '../utils/format'
import type { Office } from '../types'

const TG = 'https://t.me/AllTrustMe_Ge'
const CITY_ORDER = ['city_tbilisi', 'city_batumi', 'city_rustavi']

/** Офисы: группы по городам → компактные карточки (шапка + один ряд действий +
   строка такси/фото) → ОДИН общий Telegram-CTA внизу вместо четырёх. */
export default function OfficesScreen() {
  const { t } = useLang()
  const [photosFor, setPhotosFor] = useState<string | null>(null)

  const groups = CITY_ORDER.map((key) => ({ key, items: OFFICES.filter((o) => o.cityKey === key) })).filter(
    (g) => g.items.length,
  )

  return (
    <ScreenShell header={<TitleHeader title={t('off_header')} />}>
      <div className="stagger">
        {groups.map((g) => (
          <section key={g.key} className="mt-4 first:mt-2">
            <p className="section-label mb-2 px-1">{t(g.key)}</p>
            <div className="flex flex-col gap-2.5">
              {g.items.map((o) => (
                <OfficeCard key={o.id} office={o} onPhotos={() => setPhotosFor(o.name)} />
              ))}
            </div>
          </section>
        ))}

        {/* Единый канал связи — один раз, крупно */}
        <button
          onClick={() => {
            haptic('medium')
            openExternal(TG)
          }}
          className="btn btn-primary btn-block mt-6 flex-col gap-0.5 py-3.5"
          style={{ whiteSpace: 'normal' }}
        >
          <span className="flex items-center gap-2">
            <IconTelegram size={20} />
            {t('offices_tg_cta')}
          </span>
          <span className="text-[12px] font-medium text-[rgba(255,255,255,0.8)]">{t('offices_tg_sub')}</span>
        </button>
      </div>

      {photosFor && <PhotosModal office={photosFor} onClose={() => setPhotosFor(null)} />}
    </ScreenShell>
  )
}

function OfficeCard({ office, onPhotos }: { office: Office; onPhotos: () => void }) {
  const { t } = useLang()
  const { toast } = useToast()
  const st = officeStatus(office)

  const copyAddr = async () => {
    haptic()
    if (await copyToClipboard(office.addressFull)) toast(t('toast_address_copied'))
    else toast(t('toast_copy_failed'), 'error')
  }

  const tone = office.alwaysOpen
    ? { text: t('always_open'), color: 'var(--blue)', bg: 'var(--blue-dim)' }
    : st.open
      ? { text: t('open'), color: 'var(--green)', bg: 'var(--green-dim)' }
      : { text: t('closed'), color: 'var(--text3)', bg: 'rgba(147,160,194,0.14)' }

  const hours = office.alwaysOpen
    ? t('always_open_full')
    : st.open
      ? `${t('open_until', { t: st.until ?? '' })} · ${office.hours}`
      : `${t('closed_opens', { t: st.opensAt ?? '' })} · ${office.hours}`

  const go = (url: string) => {
    haptic()
    openExternal(url)
  }
  // под заголовком города «Тбилиси, Атонели» → «Атонели»
  const title = office.name.includes(',') ? office.name.split(',').slice(1).join(',').trim() : office.name

  return (
    <article className="card p-4">
      {/* Шапка: имя + статус-пилюля; адрес; часы */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 text-[16px] font-bold leading-tight tracking-tight">
            {title}
            {office.alwaysOpen && <IconPlane size={14} className="shrink-0 text-[var(--blue)]" />}
          </h3>
          <button onClick={copyAddr} className="press mt-1 flex items-center gap-1.5 text-[13px] text-[var(--text2)]">
            <span className="truncate">{office.address}</span>
            <IconCopy size={13} className="shrink-0 text-[var(--text3)]" />
          </button>
        </div>
        <span
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: tone.bg, color: tone.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone.color, boxShadow: st.open ? `0 0 6px ${tone.color}` : 'none' }} />
          {tone.text}
        </span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--text3)]">
        <IconClock size={13} className="shrink-0" />
        <span className="truncate">{hours}</span>
      </p>

      {/* Один ряд действий — три равные плитки */}
      <div className="mt-3.5 grid grid-cols-3 gap-2">
        <ActionTile icon={<IconGoogleMaps size={22} />} label={t('route')} onClick={() => go(office.mapsUrl)} />
        <ActionTile icon={<IconPhone size={20} />} label={t('call')} onClick={() => go(`tel:${office.phone}`)} />
        <ActionTile icon={<IconWhatsApp size={22} />} label={t('whatsapp')} onClick={() => go(`https://wa.me/${office.whatsapp}`)} />
      </div>

      {/* Второстепенное: такси и фото — тихие чипы одной строкой */}
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="me-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--text3)]">{t('taxi')}</span>
        <Chip icon={<IconBoltBrand size={14} />} label="Bolt" onClick={() => go(office.boltUrl)} />
        <Chip icon={<IconYandexGo size={14} />} label="Yandex Go" onClick={() => go(office.yandexUrl)} />
        <span className="flex-1" />
        <Chip
          icon={<IconCamera size={14} />}
          label={t('photos_btn')}
          onClick={() => {
            haptic()
            onPhotos()
          }}
        />
      </div>
    </article>
  )
}

function ActionTile({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card-inset press flex min-h-[64px] flex-col items-center justify-center gap-1.5 px-1 py-2.5">
      <span className="flex h-6 items-center justify-center text-[var(--text)]">{icon}</span>
      <span className="max-w-full truncate text-[12px] font-medium text-[var(--text2)]">{label}</span>
    </button>
  )
}

function Chip({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="press flex h-8 items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 text-[12px] font-medium text-[var(--text2)]"
      style={{ background: 'rgba(48,66,116,0.28)' }}
    >
      {icon}
      {label}
    </button>
  )
}
