import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '../types'
import { DEFAULT_LANG, LANGS, RTL_LANGS, STORAGE_KEY, translate } from '../i18n'

interface LanguageCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  rtl: boolean
}

const Ctx = createContext<LanguageCtx | null>(null)

function readStored(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY) as Lang | null
    if (v && LANGS.includes(v)) return v
  } catch {
    /* noop */
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStored)

  const rtl = RTL_LANGS.includes(lang)

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = rtl ? 'rtl' : 'ltr'
  }, [lang, rtl])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* noop */
    }
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let str = translate(lang, key)
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replaceAll(`{${k}}`, String(v))
        }
      }
      return str
    },
    [lang],
  )

  const value = useMemo<LanguageCtx>(() => ({ lang, setLang, t, rtl }), [lang, setLang, t, rtl])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang(): LanguageCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
