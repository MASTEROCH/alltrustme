import type { Office } from '../types'

export interface OfficeStatus {
  open: boolean
  /** до скольки открыто, «21:00» */
  until?: string
  /** во сколько откроется, «11:00» */
  opensAt?: string
}

/** Минуты от полуночи по Тбилиси (UTC+4, без перехода на летнее время). */
function tbilisiMinutes(d: Date): number {
  return ((d.getUTCHours() + 4) * 60 + d.getUTCMinutes()) % 1440
}

/** Живой статус офиса по строке часов «11:00 – 21:00»: «Открыто · до 21:00» / «Закрыто · откроется в 11:00». */
export function officeStatus(o: Office, now: Date = new Date()): OfficeStatus {
  if (o.alwaysOpen) return { open: true }
  const m = o.hours.match(/(\d{1,2}):(\d{2})\D+(\d{1,2}):(\d{2})/)
  if (!m) return { open: true }
  const from = Number(m[1]) * 60 + Number(m[2])
  const to = Number(m[3]) * 60 + Number(m[4])
  const cur = tbilisiMinutes(now)
  return cur >= from && cur < to
    ? { open: true, until: `${m[3].padStart(2, '0')}:${m[4]}` }
    : { open: false, opensAt: `${m[1].padStart(2, '0')}:${m[2]}` }
}
