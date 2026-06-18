import type { Lang } from '../types'
import { ru } from './ru'
import { en } from './en'
import { ge } from './ge'
import { tr } from './tr'
import { ar } from './ar'

/* Полные переводы: RU/EN/GE/TR/AR. Грузинский — код всегда 'ge', НИКОГДА 'ka'.
   AR — RTL. Любой отсутствующий ключ падает на EN-фолбэк в translate(). */
export const dictionaries: Record<Lang, Record<string, string>> = {
  ru,
  en,
  ge,
  tr,
  ar,
}

export const LANGS: Lang[] = ['ru', 'en', 'ge', 'tr', 'ar']

export const LANG_LABELS: Record<Lang, string> = {
  ru: 'RU',
  en: 'EN',
  ge: 'GE',
  tr: 'TR',
  ar: 'AR',
}

export const LANG_NAMES: Record<Lang, string> = {
  ru: 'Русский',
  en: 'English',
  ge: 'ქართული',
  tr: 'Türkçe',
  ar: 'العربية',
}

export const LANG_FLAGS: Record<Lang, string> = {
  ru: '🇷🇺',
  en: '🇬🇧',
  ge: '🇬🇪',
  tr: '🇹🇷',
  ar: '🇸🇦',
}

export const RTL_LANGS: Lang[] = ['ar']

export const DEFAULT_LANG: Lang = 'ru'
export const STORAGE_KEY = 'alltrust_lang'

/** Перевод по ключу: выбранный язык → en → сам ключ. */
export function translate(lang: Lang, key: string): string {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key
}
