import { useLang } from '../contexts/LanguageContext'
import { useToast } from '../contexts/ToastContext'
import { copyLink, shareLink, shareStory, tgShareUrl } from '../utils/share'
import { haptic, isTma, openExternal } from '../utils/telegram'

/** Три способа поделиться — один источник для блока шеринга, экрана успеха и розыгрыша.
   Честный шеринг (playbook §5 п.12): тост — только по факту результата, ошибка — красным. */
export function useShare() {
  const { t } = useLang()
  const { toast } = useToast()

  /** Сторис Telegram (7.8+); вне TMA — копируем текст со ссылкой. */
  const story = async () => {
    haptic('medium')
    const media = `${window.location.origin}${import.meta.env.BASE_URL}alltrust-logo.svg`
    const r = await shareStory(t('share_text'), media)
    if (r === 'shared') toast(t('toast_shared'))
    else if (r === 'copied') toast(t('toast_text_copied'))
    else toast(t('toast_copy_failed'), 'error')
  }

  /** В Telegram — сразу share-лист чатов; вне — копируем реферальную ссылку. */
  const invite = async () => {
    haptic()
    if (isTma()) return openExternal(tgShareUrl(t('share_text')))
    if (await copyLink()) toast(t('toast_link_copied'))
    else toast(t('toast_copy_failed'), 'error')
  }

  /** Системный лист «Поделиться»; отмену листа не комментируем. */
  const native = async () => {
    haptic()
    const r = await shareLink(t('share_text'))
    if (r === 'shared') toast(t('toast_shared'))
    else if (r === 'copied') toast(t('toast_link_copied'))
  }

  return { story, invite, native }
}
