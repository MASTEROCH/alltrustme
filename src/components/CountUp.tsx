import { useEffect, useRef, useState } from 'react'

/** Плавный счёт числа 0 → end (easeOutCubic) при появлении. */
export default function CountUp({
  end,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  grouped = false,
}: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  grouped?: boolean
}) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [val, setVal] = useState(reduce ? end : 0)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    if (reduce) {
      setVal(end)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(end * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else setVal(end)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [end, duration, reduce])

  let s = decimals ? val.toFixed(decimals) : Math.round(val).toString()
  if (grouped) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (
    <>
      {prefix}
      {s}
      {suffix}
    </>
  )
}
