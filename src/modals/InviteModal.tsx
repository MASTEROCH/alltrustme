import { useState } from 'react'
import ModalOverlay from './ModalOverlay'
import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { IconUsers, IconTelegram, IconCopy, IconCheck } from '../components/icons'
import { haptic, openExternal } from '../utils/telegram'
import { copyToClipboard } from '../utils/format'

const REF_LINK = 'https://t.me/AllTrustMe_Ge?start=ref_APPHUB'

/** Приглашение друга: реферальная ссылка + шеринг в Telegram. Бэкенд подключим позже. */
export default function InviteModal({ onClose }: { onClose: () => void }) {
  const { t } = useLang()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const shareTg = () => {
    haptic('medium')
    const url = encodeURIComponent(REF_LINK)
    const text = encodeURIComponent(t('invite_share_text'))
    openExternal(`https://t.me/share/url?url=${url}&text=${text}`)
  }

  const copy = async () => {
    haptic()
    if (await copyToClipboard(REF_LINK)) {
      setCopied(true)
      toast(t('toast_link_copied'))
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <ModalOverlay onClose={onClose} bare>
      <div className="flex flex-col items-center pt-2 text-center">
        <span
          className="icon-chip pop-in h-16 w-16 text-white"
          style={{
            background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 55%, var(--violet))',
            boxShadow: '0 8px 26px var(--blue-glow)',
          }}
        >
          <IconUsers size={32} />
        </span>
        <h2 className="mt-3.5 text-[20px] font-bold">{t('invite_title')}</h2>
        <p className="mt-2 max-w-[330px] text-[14px] leading-relaxed text-[var(--text2)]">
          {t('invite_sub')}
        </p>
      </div>

      {/* ссылка */}
      <p className="section-label mb-2 mt-5">{t('invite_link_label')}</p>
      <button
        onClick={copy}
        className="press flex w-full items-center gap-2 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card2)] p-3.5 text-left"
      >
        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-[var(--blue)]">{REF_LINK}</span>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-[var(--blue-dim)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--blue)]">
          {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
        </span>
      </button>

      {/* CTA */}
      <button
        onClick={shareTg}
        className="press mt-4 flex w-full items-center justify-center gap-2 rounded-[var(--r)] py-4 text-[15px] font-bold text-white"
        style={{
          background: 'linear-gradient(150deg, var(--accent-hi), var(--blue) 55%, var(--blue2))',
          boxShadow: '0 8px 28px var(--blue-glow)',
        }}
      >
        <IconTelegram size={20} />
        {t('invite_share_tg')}
      </button>
      <button
        onClick={copy}
        className="press mt-2.5 flex w-full items-center justify-center gap-2 rounded-[var(--r)] border border-[var(--border)] bg-[var(--card)] py-3.5 text-[14px] font-semibold text-[var(--text2)]"
      >
        <IconCopy size={17} />
        {t('invite_copy')}
      </button>
    </ModalOverlay>
  )
}
