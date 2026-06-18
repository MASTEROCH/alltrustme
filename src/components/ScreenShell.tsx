import { useEffect, useRef, type ReactNode } from 'react'
import { useScrollTop } from '../hooks/useScrollTop'

interface Props {
  header: ReactNode
  children: ReactNode
}

/** Каркас экрана: .screen + sticky header + скролл-зона со scroll-reveal.
   IntersectionObserver вешает .rv-out на секции вне вьюпорта (плавно тают),
   снимает на вернувшиеся — появление/исчезновение в обе стороны скролла. */
export default function ScreenShell({ header, children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useScrollTop(scrollRef)

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          e.target.classList.toggle('rv-out', !e.isIntersecting)
        }
      },
      { root, rootMargin: '-4% 0px -12% 0px', threshold: 0 },
    )

    const observe = () => {
      Array.from(root.children).forEach((c) => io.observe(c))
    }
    // наблюдаем после первого кадра (контент отрисован)
    const raf = requestAnimationFrame(observe)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])

  return (
    <div className="screen">
      {header}
      <div ref={scrollRef} className="scroll scroll-hide reveal-scroll">
        {children}
      </div>
    </div>
  )
}
