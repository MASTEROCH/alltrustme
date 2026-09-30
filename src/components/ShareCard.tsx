import { forwardRef, type ReactNode } from 'react'
import { useLang } from '../contexts/LanguageContext'
import { useShare } from '../hooks/useShare'
import { IconGift, IconLink, IconShareArrow, IconStories } from './icons'

/** Блок шеринга — «Расскажи друзьям — получи больше билетов»: Stories · Пригласить · Поделиться.
   Один компонент на Розыгрыш и Обмен (на Обмене заменил «Быструю отправку» с фейковыми контактами).
   Stories — кольцо как у сторис Telegram (зелёный → голубой → синий из палитры), а не чужой
   градиент Instagram. glow — подсветка, когда к блоку прокрутили из «Как получить билеты». */
const ShareCard = forwardRef<HTMLElement, { glow?: boolean; className?: string }>(function ShareCard(
  { glow, className = '' },
  ref,
) {
  const { t } = useLang()
  const share = useShare()

  return (
    <section ref={ref} className={`card share-card p-5 ${glow ? 'glow-border' : ''} ${className}`}>
      <div className="flex items-center gap-3">
        <span className="icon-chip h-10 w-10 bg-[var(--gold-dim)] text-[var(--gold)]">
          <IconGift size={20} />
        </span>
        <p className="text-[15px] font-semibold leading-snug">{t('share_title')}</p>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <ShareTile
          tone="story"
          title={t('share_stories_t')}
          sub={t('share_stories_s')}
          icon={<IconStories size={20} />}
          onClick={share.story}
        />
        <ShareTile
          tone="blue"
          title={t('share_invite_t')}
          sub={t('share_invite_s')}
          icon={<IconLink size={20} />}
          onClick={share.invite}
        />
        <ShareTile
          tone="plain"
          title={t('share_native_t')}
          sub={t('share_native_s')}
          icon={<IconShareArrow size={20} />}
          onClick={share.native}
        />
      </div>
    </section>
  )
})

export default ShareCard

function ShareTile({
  tone,
  title,
  sub,
  icon,
  onClick,
}: {
  tone: 'story' | 'blue' | 'plain'
  title: string
  sub: string
  icon: ReactNode
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className={`share-tile is-${tone}`}>
      <span className="share-tile-icon">{icon}</span>
      <span className="text-[13px] font-bold leading-none">{title}</span>
      <span className="text-[10.5px] leading-tight text-[var(--text3)]">{sub}</span>
    </button>
  )
}
