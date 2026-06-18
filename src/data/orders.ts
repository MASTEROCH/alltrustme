/* Мок-история заявок (backend заменит на GET /orders).
   status: pending → confirmed → completed | cancelled. */
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface OrderMock {
  id: string
  date: Record<'ru' | 'en', string>
  give: { amount: string; ticker: string }
  get: { amount: string; ticker: string }
  office: Record<'ru' | 'en', string>
  status: OrderStatus
}

export const ORDERS: OrderMock[] = [
  {
    id: 'AT-104238',
    date: { ru: '17 июня, 14:20', en: 'Jun 17, 14:20' },
    give: { amount: '1 000', ticker: 'USDT' },
    get: { amount: '2 710', ticker: 'GEL' },
    office: { ru: 'Тбилиси · Агмашенебели', en: 'Tbilisi · Agmashenebeli' },
    status: 'pending',
  },
  {
    id: 'AT-104102',
    date: { ru: '15 июня, 11:05', en: 'Jun 15, 11:05' },
    give: { amount: '0.5', ticker: 'BTC' },
    get: { amount: '32 480', ticker: 'USD' },
    office: { ru: 'Батуми · Набережная', en: 'Batumi · Seaside' },
    status: 'confirmed',
  },
  {
    id: 'AT-103877',
    date: { ru: '9 июня, 18:42', en: 'Jun 9, 18:42' },
    give: { amount: '5 000', ticker: 'USDT' },
    get: { amount: '5 000', ticker: 'USD' },
    office: { ru: 'Тбилиси · Ваке', en: 'Tbilisi · Vake' },
    status: 'completed',
  },
  {
    id: 'AT-103540',
    date: { ru: '2 июня, 10:11', en: 'Jun 2, 10:11' },
    give: { amount: '300', ticker: 'TON' },
    get: { amount: '1 620', ticker: 'GEL' },
    office: { ru: 'Тбилиси · Агмашенебели', en: 'Tbilisi · Agmashenebeli' },
    status: 'cancelled',
  },
]
