import { isTma, tg } from './telegram'
import { copyToClipboard } from './format'

/** Реферальная ссылка на бота (промокод APPHUB зашит в start-параметр). */
export const REF_LINK = 'https://t.me/AllTrustMe_Ge?start=ref_APPHUB'

export type ShareResult = 'shared' | 'copied' | 'failed'

/** Честный шеринг (playbook §5 п.12): результат — только ПОСЛЕ факта.
   navigator.share → «shared»; отмена листа → «failed» (молчим); нет share — копируем текст+ссылку. */
export async function shareLink(text: string, url: string = REF_LINK): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text, url })
      return 'shared'
    } catch (e) {
      if ((e as Error | undefined)?.name === 'AbortError') return 'failed'
    }
  }
  return (await copyToClipboard(`${text} ${url}`)) ? 'copied' : 'failed'
}

export async function copyLink(url: string = REF_LINK): Promise<boolean> {
  return copyToClipboard(url)
}

/** Сторис Telegram (Bot API 7.8+) с виджет-ссылкой; вне TMA — копируем текст со ссылкой. */
export async function shareStory(text: string, media: string): Promise<ShareResult> {
  const wa = tg()
  if (wa && isTma() && wa.shareToStory && wa.isVersionAtLeast?.('7.8')) {
    try {
      wa.shareToStory(media, { text, widget_link: { url: REF_LINK, name: 'AllTrust.me' } })
      return 'shared'
    } catch {
      /* падаем в копирование */
    }
  }
  return (await copyToClipboard(`${text} ${REF_LINK}`)) ? 'copied' : 'failed'
}

/** Share-лист чатов Telegram. */
export function tgShareUrl(text: string, url: string = REF_LINK): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}
