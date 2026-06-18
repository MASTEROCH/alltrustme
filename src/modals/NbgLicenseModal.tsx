import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { IconBank, IconCheckCircle, IconExternal } from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'

export default function NbgLicenseModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang()

  const rows: Array<[string, React.ReactNode]> = [
    [t('nbg_license_number'), <span className="font-mono">N0010-9404</span>],
    [t('nbg_license_type'), 'VASP'],
    [t('nbg_regulator'), t('nbg_regulator_name')],
    [t('nbg_company'), 'AllTrust LLC'],
    [
      t('nbg_status'),
      <span className="flex items-center gap-1 font-semibold text-[var(--green)]">
        <IconCheckCircle size={15} />
        {t('nbg_status_active')}
      </span>,
    ],
  ]

  return (
    <ModalOverlay title={t('nbg_title')} onClose={onClose}>
      <div className="mb-4 flex items-center gap-3 rounded-[var(--r)] border border-[rgba(34,197,94,0.2)] bg-[var(--green-dim)] p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-[var(--rs)] bg-[rgba(34,197,94,0.15)] text-[var(--green)]">
          <IconBank size={24} />
        </span>
        <p className="text-[13px] leading-snug text-[var(--text2)]">{t('nbg_disclaimer')}</p>
      </div>

      <div className="overflow-hidden rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)]">
        {rows.map(([label, value], i) => (
          <div
            key={i}
            className="flex items-center justify-between px-5 py-4 text-[14px]"
            style={{ borderTop: i ? '1px solid var(--border)' : 'none' }}
          >
            <span className="text-[var(--text3)]">{label}</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          haptic()
          openExternal('https://nbg.gov.ge/')
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--rs)] border border-[var(--border)] bg-[var(--card)] py-3.5 text-[14px] font-semibold text-[var(--blue)] transition-transform active:scale-[0.98]"
      >
        <IconExternal size={17} />
        {t('nbg_check_btn')}
      </button>
    </ModalOverlay>
  )
}
