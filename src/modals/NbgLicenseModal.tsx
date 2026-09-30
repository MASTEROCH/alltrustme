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
      <div className="card mb-4 flex items-center gap-3 p-5" style={{ borderColor: 'rgba(47,210,126,0.25)' }}>
        <span className="flex h-11 w-11 items-center justify-center rounded-[var(--rs)] bg-[rgba(47,210,126,0.15)] text-[var(--green)]">
          <IconBank size={24} />
        </span>
        <p className="text-[13px] leading-snug text-[var(--text2)]">{t('nbg_disclaimer')}</p>
      </div>

      <div className="card list">
        {rows.map(([label, value], i) => (
          <div key={i} className="row justify-between text-[14px]">
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
        className="btn btn-secondary is-accent btn-block mt-4"
      >
        <IconExternal size={17} />
        {t('nbg_check_btn')}
      </button>
    </ModalOverlay>
  )
}
