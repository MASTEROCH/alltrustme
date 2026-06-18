# AllTrust.me — Telegram Mini App (Frontend)

Лицензированный криптообменник в Грузии (Тбилиси · Батуми). Telegram Mini App.
Это **frontend-only** реализация: вся логика на моках, с чистыми «швами» под backend.

> 🇬🇪 Бренд: AllTrust.me · Лицензия НБГ (National Bank of Georgia)

---

## Стек

| | |
|---|---|
| UI | React 19 + TypeScript (strict) |
| Сборка | Vite 6 |
| Стили | Tailwind CSS 4 (`@import 'tailwindcss'`, cascade layers) |
| Роутинг | React Router 7 (`BrowserRouter`) |
| Шрифты | Geologica (UI) + JetBrains Mono (цифры) |
| Telegram | Telegram WebApp SDK — **только UI** (haptics, BackButton, expand) |
| i18n | RU · EN · GE (ქართული) · TR · AR (RTL) — собственный словарь |

Иконки — инлайн-SVG (без emoji). Все модалки — через `createPortal`.

## Запуск

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # типчек + продакшн-сборка в dist/
npm run preview   # предпросмотр прод-сборки
```

## Структура

```
src/
  screens/      экраны-страницы (Home, Exchange, Offices, Kyc, Raffle, Events, Orders, Success)
  modals/       bottom-sheet модалки (createPortal), базовый ModalOverlay
  components/   переиспользуемые компоненты (Header, BottomNav, RateTicker, QuickSend …)
  components/icons/  инлайн-SVG набор
  contexts/     LanguageContext, RatesContext, ToastContext
  hooks/        useExchange (калькулятор), useTelegramBack, useScrollTop
  data/         👉 ВСЕ МОК-ДАННЫЕ (точки интеграции с backend) — см. BACKEND_HANDOFF.md
  i18n/         словари ru/en/ge/tr/ar + translate()
  utils/        telegram (SDK-обёртка), format, persist (localStorage флаги)
  theme.css     дизайн-система (токены, анимации, liquid-glass)
```

## Что НЕ входит во frontend (делает backend)

Реальные курсы, создание/статусы заявок, KYC-пайплайн, авторизация через Telegram
`initData`, отправка отзывов, подписки на события, розыгрыш/билеты, рефералы.
Все эти места помечены и описаны в **[BACKEND_HANDOFF.md](BACKEND_HANDOFF.md)**.
