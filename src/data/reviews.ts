export interface Review {
  name: string
  role: { ru: string; en: string }
  avatar: string
  rating: number
  text: { ru: string; en: string }
}

/* Мок-отзывы (по мотивам реальных с alltrust.me). Аватарки — стоковые. */
export const REVIEWS: Review[] = [
  {
    name: 'Мария',
    role: { ru: 'Энергетик', en: 'Power engineer' },
    avatar: 'https://i.pravatar.cc/120?img=45',
    rating: 5,
    text: {
      ru: 'Меняла зарплату в крипте — быстро и по-человечески объяснили курс. А ещё кофе и вино в офисе 😄',
      en: 'Exchanged my crypto salary — fast, explained the rate kindly. Plus coffee and wine at the office 😄',
    },
  },
  {
    name: 'Давид',
    role: { ru: 'Основатель de-fi Canvas', en: 'Founder, de-fi Canvas' },
    avatar: 'https://i.pravatar.cc/120?img=12',
    rating: 5,
    text: {
      ru: 'Деньги после обмена ушли на аренду в тот же день. Работаю с ними с 2021 — ни разу не подвели.',
      en: 'Funds went to rent the same day. Been with them since 2021 — never let me down.',
    },
  },
  {
    name: 'Нино',
    role: { ru: 'Фрилансер', en: 'Freelancer' },
    avatar: 'https://i.pravatar.cc/120?img=47',
    rating: 5,
    text: {
      ru: 'Прошла KYC за 7 минут, теперь меняю прямо из приложения. Лицензия НБГ — спокойно за деньги.',
      en: 'Passed KYC in 7 minutes, now I exchange from the app. NBG license — calm about my money.',
    },
  },
  {
    name: 'Леван',
    role: { ru: 'Инвестор', en: 'Investor' },
    avatar: 'https://i.pravatar.cc/120?img=51',
    rating: 5,
    text: {
      ru: 'Лучший курс в Тбилиси и наличные сразу на руки. Рекомендую всем знакомым.',
      en: 'Best rate in Tbilisi and cash on the spot. I recommend it to everyone.',
    },
  },
]
