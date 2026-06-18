import type { ReactNode } from 'react'

/** «Липкая» шапка с заголовком по центру — для внутренних экранов.
   Опциональный right-слот (иконка-действие) не сдвигает центрованный заголовок. */
export default function TitleHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <header className="chrome-header relative flex items-center justify-center px-4 py-3.5">
      <h1 className="text-[16px] font-bold">{title}</h1>
      {right && <div className="absolute end-3 top-1/2 -translate-y-1/2">{right}</div>}
    </header>
  )
}
