import { useState } from 'react'
import ScreenShell from '../components/ScreenShell'
import TitleHeader from '../components/TitleHeader'
import PhotosModal from '../modals/PhotosModal'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { OFFICES } from '../data/offices'
import {
  IconCopy,
  IconCamera,
  IconPhone,
  IconWhatsApp,
  IconTelegram,
  IconGoogleMaps,
  IconBoltBrand,
  IconYandexGo,
} from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'
import { copyToClipboard } from '../utils/format'
import type { Office } from '../types'

const TG = 'https://t.me/AllTrustMe_Ge'

export default function OfficesScreen() {
  const { t } = useLang()
  const [photosFor, setPhotosFor] = useState<string | null>(null)

  return (
    <ScreenShell header={<TitleHeader title={t('off_header')} />}>
      <div className="mt-2 flex flex-col gap-3">
        {OFFICES.map((o) => (
          <OfficeCard key={o.id} office={o} onPhotos={() => setPhotosFor(o.name)} />
        ))}
      </div>
      {photosFor && <PhotosModal office={photosFor} onClose={() => setPhotosFor(null)} />}
    </ScreenShell>
  )
}

function OfficeCard({ office, onPhotos }: { office: Office; onPhotos: () => void }) {
  const { t } = useLang()
  const { toast } = useToast()

  const copyAddr = async () => {
    haptic()
    if (await copyToClipboard(office.addressFull)) toast(t('toast_address_copied'))
  }

  return (
    <div className="overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)]">
      {/* Зона 1 — шапка */}
      <div className="flex items-start justify-between gap-2 border-b border-[var(--border)] p-5">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-bold">{office.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <button
              onClick={copyAddr}
              className="flex items-center gap-1 text-[13px] text-[var(--text3)] transition-colors active:text-[var(--blue)]"
            >
              {office.address}
              <IconCopy size={13} />
            </button>
            <button
              onClick={() => {
                haptic()
                onPhotos()
              }}
              className="flex items-center gap-1 rounded-full bg-[var(--card2)] px-2 py-0.5 text-[12px] text-[var(--text3)] transition-colors active:text-[var(--blue)]"
            >
              <IconCamera size={12} />
              {t('photos_btn')}
            </button>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={
            office.alwaysOpen
              ? { background: 'var(--blue-dim)', color: 'var(--blue)' }
              : { background: 'var(--green-dim)', color: 'var(--green)' }
          }
        >
          {office.alwaysOpen ? t('always_open') : t('open')}
        </span>
      </div>

      {/* Зона 2 — часы */}
      <div className="border-b border-[var(--border)] px-5 py-3.5 text-[14px]">
        {office.alwaysOpen ? (
          <span className="font-semibold text-[var(--blue)]">{t('always_open_full')}</span>
        ) : (
          <span className="text-[var(--text2)]">{office.hours}</span>
        )}
      </div>

      {/* Зона 3 — навигация */}
      <div className="grid grid-cols-3 gap-2 border-b border-[var(--border)] p-4">
        <NavBtn icon={<IconGoogleMaps size={26} />} label="Google Maps" onClick={() => openExternal(office.mapsUrl)} />
        <NavBtn icon={<IconBoltBrand size={26} />} label="Bolt" onClick={() => openExternal(office.boltUrl)} />
        <NavBtn icon={<IconYandexGo size={26} />} label="Яндекс Go" onClick={() => openExternal(office.yandexUrl)} />
      </div>

      {/* Зона 4 — контакты */}
      <div className="flex gap-2 p-4">
        <div className="flex flex-1 flex-col gap-2">
          <ContactBtn
            icon={<IconPhone size={19} />}
            label={t('call')}
            onClick={() => openExternal(`tel:${office.phone}`)}
          />
          <ContactBtn
            icon={<IconWhatsApp size={19} />}
            label={t('whatsapp')}
            onClick={() => openExternal(`https://wa.me/${office.whatsapp}`)}
          />
        </div>
        <button
          onClick={() => {
            haptic()
            openExternal(TG)
          }}
          className="press flex flex-[1.4] flex-col items-center justify-center gap-1 rounded-[var(--rs)] py-3 text-white"
          style={{
            background: 'linear-gradient(150deg, #5aa0ff, var(--blue) 50%, var(--blue2))',
            boxShadow: '0 4px 16px var(--blue-glow), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          <IconTelegram size={26} />
          <span className="text-[13px] font-bold">{t('telegram')}</span>
          <span className="text-[11px] text-[rgba(255,255,255,0.8)]">{t('tg_hint')}</span>
        </button>
      </div>
    </div>
  )
}

function NavBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={() => {
        haptic()
        onClick()
      }}
      className="flex flex-col items-center gap-1.5 rounded-[var(--rs)] bg-[var(--card2)] py-3.5 transition-all active:scale-95 active:bg-[var(--blue-dim)]"
    >
      {icon}
      <span className="text-[12px] text-[var(--text2)]">{label}</span>
    </button>
  )
}

function ContactBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={() => {
        haptic()
        onClick()
      }}
      className="flex items-center justify-center gap-1.5 rounded-[var(--rs)] bg-[var(--card2)] py-3.5 text-[13px] text-[var(--text3)] transition-colors active:text-[var(--text)]"
    >
      {icon}
      {label}
    </button>
  )
}
