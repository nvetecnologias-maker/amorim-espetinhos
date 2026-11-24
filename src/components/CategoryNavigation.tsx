import { Beef, Coffee, CupSoda, Drumstick, Flame, LayoutGrid, Package, Salad, Soup, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Category } from '@/types'

const ICONS: Record<string, typeof Flame> = {
  todos: LayoutGrid, bovinos: Beef, frango: Drumstick, suinos: Flame, especiais: Sparkles,
  acompanhamentos: Salad, porcoes: Soup, combos: Package, bebidas: CupSoda,
}
export const categoryIcon = (id: string) => ICONS[id] ?? Coffee

export function CategoryNavigation({ categories, active, onChange, counts }: { categories: Category[]; active: string; onChange: (id: string) => void; counts: Record<string, number> }) {
  const strip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-cat="${active}"]`)
    const s = strip.current
    if (el && s) s.scrollTo({ left: el.getBoundingClientRect().left - s.getBoundingClientRect().left + s.scrollLeft - 16, behavior: 'smooth' })
  }, [active])

  const all = [{ id: 'todos', name: 'Todos', accent: '#F3E9D8' } as Pick<Category, 'id' | 'name' | 'accent'>, ...categories]

  return (
    <nav aria-label="Categorias do cardápio" className="sticky top-16 z-30 -mx-0 border-y border-white/5 bg-profundo/90 backdrop-blur-xl sm:top-20">
      <div ref={strip} className="no-scrollbar container flex gap-2 overflow-x-auto py-3" role="tablist">
        {all.map((c) => {
          const Icon = categoryIcon(c.id)
          const on = active === c.id
          return (
            <button
              key={c.id}
              data-cat={c.id}
              role="tab"
              aria-selected={on}
              onClick={() => onChange(c.id)}
              className={cn(
                'group relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-all duration-300 active:scale-95',
                on ? 'border-transparent text-profundo shadow-lg' : 'border-white/10 bg-white/[0.03] text-bege/70 hover:border-white/25 hover:text-bege',
              )}
              style={on ? { background: c.accent, boxShadow: `0 8px 30px -8px ${c.accent}` } : undefined}
            >
              <Icon className="h-4 w-4" style={on ? undefined : { color: c.accent }} />
              {c.name}
              {c.id !== 'todos' && counts[c.id] !== undefined && (
                <span className={cn('rounded-full px-1.5 text-[10px] font-bold', on ? 'bg-black/15' : 'bg-white/10 text-bege/60')}>{counts[c.id]}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
