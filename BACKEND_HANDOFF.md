# AllTrust.me — Backend Handoff

Документ для backend-разработчика. Frontend готов и работает на **моках**.
Ниже — все «швы» (seams): где сейчас лежат мок-данные, какой API нужно построить,
и какие контракты запрос/ответ ожидает фронт.

**Принцип:** фронт нигде не ходит в сеть сам (кроме Telegram SDK и внешних `window.open`).
Вся интеграция локализована в `src/data/*` и нескольких контекстах/хуках. Замените
мок-источники на реальные вызовы API — UI менять не придётся.

Базовый URL API в примерах: `{{API}}` (например `https://api.alltrust.me/v1`).

---

## 0. Авторизация (Telegram initData)

Сейчас фронт **не авторизуется**. `src/utils/telegram.ts` оборачивает только UI-стороны
SDK (haptics, BackButton, expand). Для реального бэка:

1. На старте фронт должен прочитать `window.Telegram.WebApp.initData` (строка) и отправить:
   ```
   POST {{API}}/auth/telegram
   body: { initData: "<raw initData string>" }
   → 200 { token: "<JWT>", user: { id, firstName, languageCode, isPremium } }
   ```
2. Backend **обязан** валидировать `initData` по HMAC-SHA256 с `bot_token`
   (см. Telegram «Validating data received via the Mini App»). Не доверять `user.id` с клиента.
3. Фронт хранит `token` в памяти и шлёт `Authorization: Bearer <token>` во все вызовы ниже.

> Seam: добавить `src/utils/api.ts` (fetch-обёртка с токеном). Точка вызова — `src/main.tsx` (`initTelegram()`).

---

## 1. Курсы валют — `src/data/rates.ts` + `src/contexts/RatesContext.tsx`

**Мок сейчас:**
- `TICKER_RATES` — бегущая строка на главной.
- `USD_RATES` — таблица «валюта → USD», кросс-курс считается через USD функцией `rate(from,to)`.
- `RatesContext.live = false` → UI показывает дисклеймер «курс ориентировочный».

**Нужно:**
```
GET {{API}}/rates
→ 200 {
    live: true,
    base: "USD",
    rates: { "USDT": 1.0, "BTC": 96000, "GEL": 0.37, ... },   // валюта → USD
    ticker: [ { pair: "BTC/GEL", value: "176 240", change: "+1.2%", up: true }, ... ]
  }
```
- Обновление: polling 15–30 c или WebSocket.
- Когда `live: true` — фронт убирает дисклеймер (`RatesContext.live`).
- Формат `value`/`change` — строки уже отформатированы для показа (или присылайте числа и форматируйте на фронте через `src/utils/format.ts`).

---

## 2. Список валют — `src/data/currencies.ts`

**Мок:** 14 крипто + 2 фиата (`Currency[]`, тип в `src/types/index.ts`), логотипы — CoinGecko.

**Нужно:**
```
GET {{API}}/currencies
→ 200 [ { ticker, name, kind: "crypto"|"fiat", networks: string[], logo?, glyph? } ]
```
- `networks` — для крипты сети (TRC20/ERC20/…), для фиата методы. Используется в селекторе сети на карточках обмена.
- Список доступных пар может зависеть от офиса/ликвидности — если так, добавьте `GET /currencies?office=<id>`.

---

## 3. Калькулятор обмена + котировка — `src/hooks/useExchange.ts`

**Мок:** пересчёт идёт локально через `rate()` (см. §1). Минимальная сумма зашита в
`src/screens/ExchangeScreen.tsx` (`MIN_USD = 50`).

**Нужно (рекомендуется серверная котировка с фиксацией):**
```
POST {{API}}/quote
body: { from, to, fromNetwork, toNetwork, amount, side: "from"|"to" }
→ 200 {
    rate: 2.71,
    fromAmount: "1000", toAmount: "2710",
    serviceFeePct: 0,            // см. src/data/fees.ts (сейчас 0)
    networkFeeUsd: 1.0,          // сетевой сбор за вывод крипты
    min: 50, max: 100000,        // лимиты (USD-эквивалент)
    quoteId: "q_abc", expiresAt: "2026-06-18T12:00:00Z"
  }
```
- Комиссии сейчас в `src/data/fees.ts` (`SERVICE_FEE_PCT`, `NETWORK_FEE_USD`) — замените значения из `/quote`.
- `min/max` → заменить хардкод `MIN_USD`; фронт уже показывает ошибку «минимальная сумма».
- `quoteId` передавать в создание заявки (§4) для фиксации курса.

---

## 4. Создание заявки на обмен — `src/screens/ExchangeScreen.tsx` → `SuccessScreen.tsx`

**Мок:** при «Перейти к обмену» фронт навигейтит на `/exchange/success` и передаёт
данные через router `state` (`ExchangeSummary`). Реальная сделка происходит офлайн
(дисклеймер: «данные передаются на AllTrust.me, менеджер свяжется в Telegram»).

**Нужно:**
```
POST {{API}}/orders
body: { quoteId, from, to, fromNetwork, toNetwork, fromAmount, toAmount,
        officeId, method: "cash"|"card"|"wallet", promo?: string }
→ 201 { id: "AT-104238", status: "pending", createdAt, telegramChatUrl? }
```
- Ответ показать на `SuccessScreen` (сейчас данные из router state — заменить на ответ API).
- Промокод валидировать здесь же или отдельным `POST /promo/validate { code }`.

---

## 5. История заявок — `src/data/orders.ts` + `src/screens/OrdersScreen.tsx`

**Мок:** `ORDERS: OrderMock[]` (4 заявки, статусы pending/confirmed/completed/cancelled).
Экран уже умеет рендерить пустое состояние (если массив пуст).

**Нужно:**
```
GET {{API}}/orders            → 200 [ { id, date, give:{amount,ticker}, get:{amount,ticker}, office, status } ]
GET {{API}}/orders/{id}       → 200 { ...full, statusHistory, managerChatUrl }
```
- `status ∈ pending | confirmed | completed | cancelled`. Цвета/иконки статусов уже сопоставлены на фронте.
- Кнопки «Открыть чат» (active) / «Повторить» (done) — чат может приходить как `managerChatUrl`.

---

## 6. KYC — `src/screens/KycScreen.tsx`

**Мок:** информационный экран (статика). Реального аплоада/статуса нет.

**Нужно (когда дойдут руки до KYC-флоу):**
```
GET  {{API}}/kyc/status              → { status: "none"|"pending"|"approved"|"rejected", level }
POST {{API}}/kyc/start               → { sessionUrl }   // редирект на KYC-провайдера (Sumsub/Veriff)
```
- Сейчас можно отложить; экран не блокирует обмен.

---

## 7. Офисы — `src/data/offices.ts` + `src/screens/OfficesScreen.tsx`

**Мок:** 4 офиса (`Office[]`), телефон/WhatsApp/Maps/Bolt/Yandex — ссылки.

**Нужно:**
```
GET {{API}}/offices → 200 [ { id, name, address, addressFull, hours, alwaysOpen,
                              phone, whatsapp, mapsUrl, boltUrl, yandexUrl, lat?, lng? } ]
```
- Статус «открыто/закрыто» сейчас статичен — можно считать на фронте по `hours`+таймзоне или присылать `isOpenNow`.

---

## 8. Розыгрыш / билеты / рефералы — `src/screens/RaffleScreen.tsx`, `src/data/prizes.ts`, `src/data/sponsors.ts`

**Мок-константы в `RaffleScreen.tsx`:** `TICKETS=3`, `SEASON_CUR=670`, `REFERRALS=7`, `BONUS_AVAILABLE=2`.
Призы — `PRIZES`, спонсоры — `SPONSORS`.

**Нужно:**
```
GET  {{API}}/raffle            → { tickets, seasonProgress:{current,goal}, prizePoolUsd,
                                    referrals, bonusExchangesAvailable, seasonEndsAt, prizes:[...], sponsors:[...] }
POST {{API}}/raffle/activate-bonus → { ok, bonusExchangesAvailable }
GET  {{API}}/referral          → { code, link, invitedCount, ticketsEarned }
```
- Билет начисляется за обмен (§4) и за приглашённого друга — логика на бэке.

---

## 9. Quick Send / контакты — `src/data/contacts.ts` + `src/components/QuickSend.tsx`

**Мок:** 28 контактов со стоковыми аватарками (pravatar). Кнопка «Добавить» → Telegram share,
«Все» → полный список (модалка).

**Нужно (опционально):** список «недавних получателей» из истории переводов пользователя.
Аватарки/имена — из Telegram, если делитесь контактом. Share уже работает через `t.me/share/url`.

---

## 10. Отзывы — `src/data/reviews.ts` + `src/components/Reviews.tsx` + `src/modals/WriteReviewModal.tsx`

**Мок:** `REVIEWS[]` (4 отзыва). Форма «Оставить отзыв» показывает экран «спасибо», ничего не шлёт.

**Нужно:**
```
GET  {{API}}/reviews              → [ { name, role, avatar, rating, text, createdAt } ]
POST {{API}}/reviews              body: { rating: 1..5, name, text } → 201 { id, status: "pending_moderation" }
```
- Текст модерации уже есть в UI («публикуем после модерации»).

---

## 11. События + подписка — `src/data/events.ts` + `src/screens/EventsScreen.tsx` + `src/modals/EventsNotifyModal.tsx`

**Мок:** `EVENTS[]` (3 события, обложки — Unsplash-стоки, заменить на реальные фото).
Кнопка «Получать уведомления» → модалка → мок-успех.

**Нужно:**
```
GET  {{API}}/events                → [ { id, image, titleKey/title, descKey/desc, dateLabel, cityLabel, attendees, link, past } ]
POST {{API}}/events/subscribe      body: {} (по Telegram user) → { ok }
```
> ⚠️ Обложки событий сейчас — стоковые Unsplash-картинки (см. `src/data/events.ts`, функция `U(...)`). Заменить на реальные при выходе в прод.

---

## 12. Локальные флаги (localStorage) — оставить как есть

Это клиентское состояние, backend не нужен:
- `alltrust_lang` — выбранный язык.
- `alltrust_onboarding_seen` — онбординг показан.
- `alltrust_raffle_welcome_seen`, `alltrust_exinfo_seen` — одноразовые модалки.

---

## Сводка эндпоинтов

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/auth/telegram` | авторизация по initData |
| GET | `/rates` | курсы + тикер |
| GET | `/currencies` | список валют/сетей |
| POST | `/quote` | котировка + комиссии + лимиты |
| POST | `/orders` | создать заявку |
| GET | `/orders`, `/orders/{id}` | история/статус заявок |
| GET/POST | `/kyc/status`, `/kyc/start` | KYC |
| GET | `/offices` | офисы |
| GET/POST | `/raffle`, `/raffle/activate-bonus` | розыгрыш |
| GET | `/referral` | реферальная программа |
| GET/POST | `/reviews` | отзывы |
| GET/POST | `/events`, `/events/subscribe` | события |

**Все типы данных** уже описаны в `src/types/index.ts` (`Currency`, `Office`, `RateChip`,
`EventItem`, `ExchangeSummary`) и в `src/data/*.ts` (интерфейсы `OrderMock`, `Review`, `EventMock`).
Используйте их как готовую схему ответов.
