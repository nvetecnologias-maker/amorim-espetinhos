import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

export function CategoryNavigation({ categories, active, onChange, counts }: { categories: Category[]; active: string; onChange: (id: string) => void; counts: Record<string, number> }) {
  const strip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-cat="${active}"]`)
    const s = strip.current
    if (el && s) s.scrollTo({ left: el.getBoundingClientRect().left - s.getBoundingClientRect().left + s.scrollLeft - 16, behavior: 'smooth' })
  }, [active])

  const all = [{ id: 'todos', name: 'Todos' }, ...categories]

  return (
    <nav aria-label="Categorias do cardápio" className="sticky top-16 z-30 border-y border-brasa/40 bg-black/95 backdrop-blur sm:top-20">
      <div ref={strip} className="no-scrollbar container flex gap-2 overflow-x-auto py-3" role="tablist">
        {all.map((c) => {
          const on = active === c.id
          return (
            <button
              key={c.id}
              data-cat={c.id}
              role="tab"
              aria-selected={on}
              onClick={() => onChange(c.id)}
              className={cn(
                'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-extrabold transition active:scale-95',
                on ? 'border-brasa bg-brasa text-black' : 'border-white/15 text-white/80 hover:border-brasa hover:text-white',
              )}
            >
              {c.name}
              {c.id !== 'todos' && counts[c.id] !== undefined && (
                <span className={cn('text-[11px] font-bold', on ? 'text-black/60' : 'text-brasa')}>{counts[c.id]}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
