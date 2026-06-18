import type { EventItem } from '../types'

/* Мок-события (бэкенд подключим позже). Даты/город/счётчики — мок.
   title/desc приходят из i18n (titleKey/descKey). */
export interface EventMock extends Omit<EventItem, 'title' | 'desc'> {
  titleKey: string
  descKey: string
  dateLabel: Record<'ru' | 'en', string>
  cityLabel: Record<'ru' | 'en', string>
  /* Превью-обложка со стоков (Unsplash). В проде заменим на реальные фото. */
  image?: string
}

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`

export const EVENTS: EventMock[] = [
  {
    id: 'meetup-4',
    illo: 'fire',
    titleKey: 'ev1t',
    descKey: 'ev1d',
    dateLabel: { ru: '25 апреля 2026', en: 'April 25, 2026' },
    cityLabel: { ru: 'Тбилиси', en: 'Tbilisi' },
    attendees: 142,
    image: U('1556761175-b413da4baf72'),
    gradient: 'linear-gradient(135deg, #0d1f35, #1a0f2e)',
    link: 'https://lu.ma/',
    past: false,
    date: '',
    city: '',
  },
  {
    id: 'licensing',
    illo: 'mic',
    titleKey: 'ev2t',
    descKey: 'ev2d',
    dateLabel: { ru: '15 февраля 2026', en: 'February 15, 2026' },
    cityLabel: { ru: 'Тбилиси', en: 'Tbilisi' },
    attendees: 230,
    image: U('1505373877841-8d25f7d46678'),
    gradient: 'linear-gradient(135deg, #1a1a0f, #2d2800)',
    past: true,
    date: '',
    city: '',
  },
  {
    id: 'ny-party',
    illo: 'glasses',
    titleKey: 'ev3t',
    descKey: 'ev3d',
    dateLabel: { ru: '20 декабря 2025', en: 'December 20, 2025' },
    cityLabel: { ru: 'Батуми', en: 'Batumi' },
    attendees: 180,
    image: U('1511795409834-ef04bbd61622'),
    gradient: 'linear-gradient(135deg, #0f1a1a, #0a1f1f)',
    past: true,
    date: '',
    city: '',
  },
]
