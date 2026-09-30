/* Физика Apple для жестов (iOS-канон ROCH §5.5, WWDC18 «Designing Fluid Interfaces»).
   CSS-пружины живут в theme.css (--ease-smooth/snappy/bouncy); здесь — то, что после
   жеста можно сделать только в JS: пружина со стартовой скоростью пальца. */

export interface Spring {
  k: number
  c: number
}

/** duration/bounce как в SwiftUI: .smooth = (0.5, 0), .snappy = (0.5, 0.15). */
export function spring(duration = 0.5, bounce = 0): Spring {
  const k = ((2 * Math.PI) / duration) ** 2
  const z = bounce >= 0 ? 1 - bounce : 1 / (1 + bounce)
  return { k, c: 2 * Math.sqrt(k) * z }
}

/** Куда «доедет» флик со скоростью v (px/s) при замедлении UIScrollView .normal. */
export function project(v: number, r = 0.998): number {
  return ((v / 1000) * r) / (1 - r)
}

/** Резинка iOS на краю: чем дальше тянешь, тем туже. */
export function rubber(x: number, d: number, c = 0.55): number {
  return (1 - 1 / ((x * c) / d + 1)) * d
}

/** Траектория пружины от x к to со стартовой скоростью v (px/s), кадрами по 1/60 с.
   Считаем заранее и отдаём в Web Animations: играет композитор, главному потоку не нужен
   rAF на каждый кадр (и анимация не встаёт, если rAF притормозили). */
export function springPath(x: number, to: number, v: number, { k, c }: Spring, maxFrames = 120): number[] {
  const out: number[] = [x]
  const step = 1 / 60
  for (let f = 0; f < maxFrames; f++) {
    let dt = step
    while (dt > 0) {
      const h = Math.min(dt, 0.004)
      v += (-k * (x - to) - c * v) * h
      x += v * h
      dt -= h
    }
    out.push(x)
    if (Math.abs(v) < 1 && Math.abs(x - to) < 0.5) break
  }
  out[out.length - 1] = to
  return out
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}
