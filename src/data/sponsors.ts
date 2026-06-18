export type SponsorIcon = 'mountain' | 'wine' | 'plate' | 'car'

export interface Sponsor {
  name: string
  roleKey: string
  icon: SponsorIcon
}

/* Мок-спонсоры (бэкенд подключим позже) — лента на экране розыгрыша. */
export const SPONSORS: Sponsor[] = [
  { name: 'Gudauri Mountain Hotel', roleKey: 'sp1', icon: 'mountain' },
  { name: "Pheasant's Tears Winery", roleKey: 'sp2', icon: 'wine' },
  { name: 'Shavi Lomi Restaurant', roleKey: 'sp3', icon: 'plate' },
  { name: 'Tbilisi Car Rental', roleKey: 'sp4', icon: 'car' },
]
