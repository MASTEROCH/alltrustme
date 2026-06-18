import {
  IconMountain,
  IconPlate,
  IconCash,
  IconStar,
  IconSparkles,
  IconWine,
  IconCar,
  IconCheck,
  IconLink,
  IconBolt,
  IconExchange,
  type IconProps,
} from './icons'

/* Карта строковых ключей иконок → компоненты (для призов/спонсоров/деталей). */
const MAP: Record<string, (p: IconProps) => React.ReactElement> = {
  mountain: IconMountain,
  plate: IconPlate,
  cash: IconCash,
  star: IconStar,
  sparkles: IconSparkles,
  wine: IconWine,
  car: IconCar,
  bed: IconMountain, // нет отдельной «кровати» — используем горный мотив отеля
  check: IconCheck,
  link: IconLink,
  bolt: IconBolt,
  swap: IconExchange,
}

export default function Glyph({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = MAP[name] ?? IconStar
  return <Icon size={size} />
}

/** Цветовые токены акцента приза. */
export const TONE_COLOR: Record<string, string> = {
  gold: 'var(--gold)',
  orange: '#f97316',
  gray: 'var(--text2)',
  blue: 'var(--blue)',
}
export const TONE_DIM: Record<string, string> = {
  gold: 'var(--gold-dim)',
  orange: 'rgba(249,115,22,0.14)',
  gray: 'rgba(136,136,168,0.14)',
  blue: 'var(--blue-dim)',
}
