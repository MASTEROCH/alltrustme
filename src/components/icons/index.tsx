import type { SVGProps } from 'react'

/* Единый inline-SVG набор (line/duotone, наследует currentColor).
   Заменяет ВСЕ эмодзи-иконки по эмодзи-аудиту брифа.
   Бренд-иконки (Telegram, WhatsApp, Google Maps, Bolt, Yandex) — внизу, цветные. */

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

function Base({ size = 24, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* ─── Навигация ─────────────────────────────────────────── */
export const IconHome = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </Base>
)

export const IconExchange = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8h13l-3.5-3.5" />
    <path d="M20 16H7l3.5 3.5" />
  </Base>
)

export const IconPin = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21c4-4.5 7-7.8 7-11a7 7 0 1 0-14 0c0 3.2 3 6.5 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Base>
)

export const IconGift = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 11h16v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8Z" />
    <path d="M3 8h18v3H3z" />
    <path d="M12 8v12" />
    <path d="M12 8S10.5 4 8 4a2 2 0 0 0 0 4h4Zm0 0s1.5-4 4-4a2 2 0 0 1 0 4h-4Z" />
  </Base>
)

export const IconConfetti = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20l5-13 8 8-13 5Z" />
    <path d="M14 4.5c1 .5 1.5 1.5 1 2.5M18 6c1.2.2 2 .8 2 2M16.5 10.5c1 0 1.8.6 2 1.6" />
  </Base>
)

/* ─── Хром / общие ──────────────────────────────────────── */
export const IconChat = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-5.1A8 8 0 1 1 21 11.5Z" />
    <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
  </Base>
)

export const IconChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 5 7 7-7 7" />
  </Base>
)

export const IconChevronDown = (p: IconProps) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
)

export const IconArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </Base>
)

export const IconSwapV = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 4v16" />
    <path d="m4 8 4-4 4 4" />
    <path d="M16 20V4" />
    <path d="m20 16-4 4-4-4" />
  </Base>
)

export const IconClose = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)

export const IconCheck = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Base>
)

export const IconPencil = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </Base>
)

export const IconCheckCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.2 2.6 2.6L16 9.4" />
  </Base>
)

export const IconSearch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Base>
)

export const IconCopy = (p: IconProps) => (
  <Base {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2.2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </Base>
)

export const IconCamera = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z" />
    <circle cx="12" cy="12.5" r="3.2" />
  </Base>
)

export const IconPhone = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 4h3l1.5 4.5L7.5 10a11 11 0 0 0 5 5l1.5-2 4.5 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Base>
)

/* ─── Home / статусы ────────────────────────────────────── */
export const IconStar = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M12 3.2l2.6 5.3 5.9.86-4.3 4.18 1 5.86L12 16.8l-5.2 2.6 1-5.86L3.5 9.36l5.9-.86L12 3.2Z" />
  </Base>
)

export const IconWarning = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4 2.5 20h19L12 4Z" />
    <path d="M12 10v4.5M12 17.5h.01" />
  </Base>
)

export const IconShield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 5 6v5.5c0 4.3 3 7.5 7 9.5 4-2 7-5.2 7-9.5V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Base>
)

export const IconSmartphone = (p: IconProps) => (
  <Base {...p}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.4" />
    <path d="M11 18.5h2" />
  </Base>
)

/* ─── Exchange ──────────────────────────────────────────── */
export const IconTicket = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4Z" />
    <path d="M14 6v12" strokeDasharray="2 2.5" />
  </Base>
)

export const IconBolt = (p: IconProps) => (
  <Base {...p}>
    <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" />
  </Base>
)

export const IconWallet = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H17a1 1 0 0 1 1 1v1" />
    <rect x="3" y="7" width="18" height="12" rx="2.5" />
    <path d="M16 13h2" />
  </Base>
)

export const IconCash = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.4" />
    <path d="M6 9.5h.01M18 14.5h.01" />
  </Base>
)

export const IconCard = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
    <path d="M2.5 9.5h19" />
    <path d="M6 14.5h4" />
  </Base>
)

export const IconPlane = (p: IconProps) => (
  <Base {...p}>
    <path d="M10.5 13.5 3 11l1-2 7 1.3L16 4.2c.8-.9 2.2-1 3 0 .7.8.6 2-.2 2.8L13.5 13l1.3 7-2 1-2.3-7.5Z" />
  </Base>
)

export const IconShare = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 16V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
  </Base>
)

/* ─── KYC ───────────────────────────────────────────────── */
export const IconStopwatch = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 13.5V9.5" />
    <path d="M9.5 2.5h5M12 2.5V6" />
  </Base>
)

export const IconClock = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </Base>
)

export const IconReceipt = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 3.5h14v17l-2.3-1.4-2.4 1.4-2.3-1.4-2.3 1.4-2.4-1.4L5 20.5Z" />
    <path d="M9 8h6M9 12h6" />
  </Base>
)

export const IconIdCard = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.4" />
    <circle cx="8" cy="11" r="2" />
    <path d="M5.5 16c.4-1.5 1.4-2.2 2.5-2.2s2.1.7 2.5 2.2" />
    <path d="M14 9.5h4M14 12.5h4M14 15.5h2.5" />
  </Base>
)

export const IconQuestion = (p: IconProps) => (
  <Base {...p}>
    <path d="M9.2 9a2.8 2.8 0 0 1 5.5.8c0 1.9-2.7 2.2-2.7 3.7" />
    <path d="M12 17.5h.01" />
  </Base>
)

export const IconBank = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 9.5 12 4l9 5.5" />
    <path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8" />
    <path d="M3 20.5h18" />
  </Base>
)

export const IconExternal = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </Base>
)

/* ─── Events ────────────────────────────────────────────── */
export const IconCalendar = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="2.4" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </Base>
)

export const IconUsers = (p: IconProps) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.5-3 2.8-4.5 5.5-4.5s5 1.5 5.5 4.5" />
    <path d="M16 5.2a3 3 0 0 1 0 5.6M17.5 14.6c2 .5 3.4 1.9 3.7 4.4" />
  </Base>
)

export const IconFire = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3c.5 3-2 4-2 7a2 2 0 0 0 4 0c0-.8-.3-1.4-.3-1.4 2 1 3.3 3 3.3 5.4a5 5 0 0 1-10 0C7 10.5 12 9 12 3Z" />
  </Base>
)

export const IconMic = (p: IconProps) => (
  <Base {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M6 11a6 6 0 0 0 12 0" />
    <path d="M12 17v4M9 21h6" />
  </Base>
)

export const IconGlasses = (p: IconProps) => (
  <Base {...p}>
    <path d="M8 3.5 6 11M16 3.5 18 11" />
    <path d="M5 11h14l-5.5 5v5M10.5 21h7" />
  </Base>
)

/* ─── Raffle / призы / спонсоры / шеринг ─────────────────── */
export const IconMountain = (p: IconProps) => (
  <Base {...p}>
    <path d="m3 19 6-11 4 7 2-3 6 7H3Z" />
    <path d="m7.5 12 1.5-2.7" />
    <circle cx="17" cy="6.5" r="1.6" />
  </Base>
)

export const IconWine = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 3h10c0 4-2 7-5 7S7 7 7 3Z" />
    <path d="M12 10v7M8.5 21h7" />
  </Base>
)

export const IconPlate = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.4" />
  </Base>
)

export const IconCar = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12.5 5.6 8a2 2 0 0 1 1.9-1.4h9a2 2 0 0 1 1.9 1.4L20 12.5" />
    <path d="M3 12.5h18v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-.5h-9v.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4Z" />
    <path d="M6.5 15h.01M17.5 15h.01" />
  </Base>
)

export const IconSparkles = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3.5 13.6 9 19 10.5 13.6 12 12 17.5 10.4 12 5 10.5 10.4 9 12 3.5Z" />
    <path d="M18.5 4.5v3M20 6h-3" />
  </Base>
)

export const IconRocket = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 4c3.5.5 6 3 6.5 6.5-2 5-6 8-10.5 9l-3.5-3.5c1-4.5 4-8.5 9-10.5Z" />
    <circle cx="14.5" cy="9.5" r="1.6" />
    <path d="M6.5 16c-1.5.5-2.5 2-2.5 4 2 0 3.5-1 4-2.5" />
  </Base>
)

export const IconLink = (p: IconProps) => (
  <Base {...p}>
    <path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.5 1.5" />
    <path d="M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.5-1.5" />
  </Base>
)

export const IconStories = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v9" />
    <path d="m8.5 7.5 3.5-3.5 3.5 3.5" />
    <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
  </Base>
)

export const IconShareArrow = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </Base>
)

export const IconTelegramStars = (p: IconProps) => (
  <Base {...p} fill="currentColor" stroke="none">
    <path d="M12 3.5 13.9 9l5.6.3-4.4 3.5 1.5 5.4L12 15.4 7.4 18.2l1.5-5.4L4.5 9.3 10.1 9 12 3.5Z" />
  </Base>
)

export const IconBell = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7Z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Base>
)

export const IconUser = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20c.6-3.6 3.3-5.5 7-5.5s6.4 1.9 7 5.5" />
  </Base>
)

export const IconPlus = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 5v14M5 12h14" />
  </Base>
)

export const IconRefresh = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 8a8 8 0 0 0-14-2M4 6v3.5h3.5" />
    <path d="M4 16a8 8 0 0 0 14 2M20 18v-3.5h-3.5" />
  </Base>
)

/* ─── Brand-логотип (₿-квадрат) ─────────────────────────── */
export const IconBrandMark = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <path
      d="M7.5 6h4.4a3 3 0 0 1 1 5.85A3.2 3.2 0 0 1 12.2 18H7.5V6Z"
      stroke="#fff"
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path d="M10 4v2.6M13 4v2.6M10 17.4V20M13 17.4V20" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
  </svg>
)

/* ─── Бренд-иконки (официальные, цветные) ──────────────── */
export const IconTelegram = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <path
      d="M21.8 4.3 18.6 19.4c-.24 1.07-.88 1.33-1.78.83l-4.92-3.63-2.37 2.28c-.26.26-.48.48-.99.48l.35-5 9.1-8.22c.4-.35-.09-.55-.62-.2L5.12 13.07.27 11.55c-1.05-.33-1.07-1.05.22-1.55L20.45 2.7c.88-.33 1.65.2 1.35 1.6Z"
      fill="#fff"
    />
  </svg>
)

export const IconWhatsApp = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <path
      d="M12 2a10 10 0 0 0-8.6 15.05L2 22l5.1-1.33A10 10 0 1 0 12 2Z"
      fill="#25D366"
    />
    <path
      d="M8.4 7.1c-.2-.45-.4-.46-.6-.47h-.5c-.18 0-.46.07-.7.33-.24.26-.92.9-.92 2.2 0 1.3.94 2.55 1.07 2.73.13.17 1.82 2.9 4.5 3.96 2.23.88 2.68.7 3.16.66.48-.04 1.56-.64 1.78-1.25.22-.62.22-1.14.16-1.25-.07-.11-.24-.18-.5-.31-.26-.13-1.56-.77-1.8-.86-.24-.09-.42-.13-.6.13-.17.26-.68.86-.84 1.04-.15.17-.3.2-.57.07-.26-.13-1.11-.41-2.12-1.31-.78-.7-1.31-1.56-1.47-1.82-.15-.26-.02-.4.12-.53.12-.12.26-.3.4-.46.13-.15.17-.26.26-.44.09-.17.04-.33-.02-.46-.07-.13-.58-1.45-.8-1.98Z"
      fill="#fff"
    />
  </svg>
)

export const IconGoogleMaps = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <path d="M12 22c4-5 7-8.4 7-12a7 7 0 0 0-14 0c0 3.6 3 7 7 12Z" fill="#EA4335" />
    <circle cx="12" cy="10" r="2.6" fill="#fff" />
  </svg>
)

export const IconBoltBrand = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8Z" fill="#34D186" />
  </svg>
)

export const IconYandexGo = ({ size = 24, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...rest}>
    <circle cx="12" cy="12" r="10" fill="#FFCC00" />
    <path d="M13.4 6.5h-1.9c-1.7 0-2.9 1-2.9 2.6 0 1.2.6 1.9 1.7 2.6L8 17.5h1.9l1.6-3.5h.7v3.5h1.7V6.5Zm-1.6 6H11c-.8 0-1.3-.5-1.3-1.4s.5-1.4 1.4-1.4h.7v2.8Z" fill="#000" />
  </svg>
)
