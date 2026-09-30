import type { Office } from '../types'

const PHONE = '+995511131952'
const WA = '995511131952'

/* Мок-офисы (бэкенд подключим позже) — 4 офиса в Грузии. */
export const OFFICES: Office[] = [
  {
    id: 'tbilisi-atoneli',
    cityKey: 'city_tbilisi',
    name: 'Тбилиси, Атонели',
    address: '18 Atoneli St.',
    addressFull: '18 Atoneli St., Тбилиси',
    hours: '11:00 – 21:00',
    alwaysOpen: false,
    phone: PHONE,
    whatsapp: WA,
    mapsUrl: 'https://maps.google.com/?q=18+Atoneli+St+Tbilisi',
    boltUrl: 'https://bolt.eu/',
    yandexUrl: 'https://taxi.yandex.com/',
  },
  {
    id: 'batumi',
    cityKey: 'city_batumi',
    name: 'Батуми',
    address: 'Gorgiladze St. 111',
    addressFull: 'Zurab Gorgiladze St. 111, Батуми',
    hours: '11:00 – 21:00',
    alwaysOpen: false,
    phone: PHONE,
    whatsapp: WA,
    mapsUrl: 'https://maps.google.com/?q=Gorgiladze+St+111+Batumi',
    boltUrl: 'https://bolt.eu/',
    yandexUrl: 'https://taxi.yandex.com/',
  },
  {
    id: 'tbilisi-airport',
    cityKey: 'city_tbilisi',
    name: 'Аэропорт Тбилиси',
    address: 'Departure hall',
    addressFull: 'Tbilisi International Airport, Departure hall',
    hours: '24/7',
    alwaysOpen: true,
    phone: PHONE,
    whatsapp: WA,
    mapsUrl: 'https://maps.google.com/?q=Tbilisi+International+Airport',
    boltUrl: 'https://bolt.eu/',
    yandexUrl: 'https://taxi.yandex.com/',
  },
  {
    id: 'rustavi',
    cityKey: 'city_rustavi',
    name: 'Рустави',
    address: 'Рустави',
    addressFull: 'Rustavi',
    hours: '11:00 – 21:00',
    alwaysOpen: false,
    phone: PHONE,
    whatsapp: WA,
    mapsUrl: 'https://maps.google.com/?q=Rustavi',
    boltUrl: 'https://bolt.eu/',
    yandexUrl: 'https://taxi.yandex.com/',
  },
]

export const DEFAULT_OFFICE = OFFICES[0]
