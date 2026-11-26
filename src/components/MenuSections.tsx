import gsap from 'gsap'
import { Check, Plus } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn, money, prefersReducedMotion } from '@/lib/utils'
import { sortByOrder, useMenu } from '@/store/menu'
import type { Category, MenuSection, Product } from '@/types'
import { CategoryNavigation, categoryIcon } from './CategoryNavigation'
import { ProductBadge } from './ui/badge'
import { ProductCard, useQuickAdd } from './ProductCard'
import { ProductImage } from './ProductImage'

function SectionHeading({ category, count }: { category: Category; count: number }) {
  const Icon = categoryIcon(category.id)
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em]" style={{ color: category.accent }}>
          <Icon className="h-4 w-4" /> {count} {count === 1 ? 'opção' : 'opções'}
        </span>
        <h3 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-bege">{category.name}</h3>
        <p className="mt-2 max-w-lg text-sm text-bege/55 sm:text-base">{category.tagline}</p>
      </div>
      <span className="hidden h-px flex-1 translate-y-[-14px] sm:block" style={{ background: `linear-gradient(90deg, ${category.accent}99, transparent)` }} />
    </div>
  )
}

function ComboCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const quickAdd = useQuickAdd(onOpen)
  const hot = product.badges.includes('mais-pedido')
  return (
    <article className={cn('group relative flex flex-col overflow-hidden rounded-[32px] border p-6 transition duration-500 hover:-translate-y-1.5 sm:p-7', hot ? 'border-brasa/50 bg-gradient-to-b from-[#2a140c] to-carvao shadow-ember' : 'border-white/10 bg-carvao', !product.available && 'opacity-55')}>
      {hot && <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brasa/25 blur-3xl" />}
      <div className="flex flex-wrap gap-1.5">{product.badges.map((b) => <ProductBadge key={b} id={b} />)}</div>
      <button type="button" onClick={() => onOpen(product)} className="relative -mx-4 my-2 aspect-[16/10] overflow-hidden" aria-label={`Ver ${product.name}`}>
        <ProductImage image={product.image} categoryId={product.categoryId} alt={product.name} className="h-full w-full transition-transform duration-700 group-hover:scale-105" imgClassName="rounded-2xl" />
      </button>
      <h4 className="font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-bege">{product.name}</h4>
      {product.group && <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-brasa">{product.group}</p>}
      <ul className="mt-5 space-y-2.5">
        {(product.comboItems ?? []).map((i) => (
          <li key={i} className="flex items-center gap-3 text-[15px] text-bege/85">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brasa/15"><Check className="h-3.5 w-3.5 text-brasa" /></span>{i}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-end justify-between gap-3 pt-7">
        <span className="font-display text-5xl font-bold leading-none text-bege">{money(product.price)}</span>
        <button type="button" disabled={!product.available} onClick={(e) => quickAdd(product, e.currentTarget)}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-queimado to-brasa px-5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-ember transition hover:brightness-110 active:scale-95 disabled:opacity-40">
          <Plus className="h-4 w-4" /> Quero esse
        </button>
      </div>
    </article>
  )
}

const SECTION_TITLE: Record<MenuSection, string> = { cardapio: 'Cardápio', bebidas: 'Bebidas' }

/** Divisor de página, como o topo das artes: linhas duplas laranja + título. */
function PageDivider({ id, title }: { id: string; title: string }) {
  return (
    <div id={id} data-heading className="flex scroll-mt-36 items-center gap-4 pb-4 pt-6 sm:scroll-mt-40">
      <span className="rule-double flex-1" aria-hidden />
      <h2 className="font-display text-[clamp(2.6rem,8vw,4.5rem)] font-extrabold uppercase leading-none tracking-tight text-bege">{title}</h2>
      <span className="rule-double flex-1" aria-hidden />
    </div>
  )
}

/** Agrupa itens consecutivos pelo subtítulo (Garrafa 600ml, Long Neck, Combinho…). */
function groupsOf(items: Product[]) {
  const out: { name: string; items: Product[] }[] = []
  for (const p of items) {
    const name = p.group?.trim() ?? ''
    const last = out[out.length - 1]
    if (last && last.name === name) last.items.push(p)
    else out.push({ name, items: [p] })
  }
  return out
}

const GRID: Record<Category['layout'], string> = {
  grid: 'grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4',
  large: 'grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3',
  compact: 'grid gap-3 md:grid-cols-2 xl:grid-cols-3',
  drinks: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3',
  combo: 'grid gap-5 md:grid-cols-3',
}

export function MenuSections({ onOpen }: { onOpen: (p: Product) => void }) {
  const categories = useMenu((s) => s.categories)
  const products = useMenu((s) => s.products)
  const [active, setActive] = useState('todos')
  const root = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  const cats = useMemo(() => [...categories].sort(sortByOrder), [categories])
  const byCat = useMemo(() => {
    const m: Record<string, Product[]> = {}
    for (const p of [...products].sort(sortByOrder)) (m[p.categoryId] ??= []).push(p)
    return m
  }, [products])
  const counts = useMemo(() => Object.fromEntries(cats.map((c) => [c.id, byCat[c.id]?.length ?? 0])), [cats, byCat])
  const visible = cats.filter((c) => (active === 'todos' || c.id === active) && byCat[c.id]?.length)

  // Âncoras do menu (#combos, #bebidas…) mostram a categoria mesmo se outra estiver filtrada
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1)
      if (id === 'bebidas' || cats.some((c) => c.id === id)) {
        setActive('todos')
        requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' }))
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [cats])

  const change = (id: string) => {
    setActive(id)
    const top = root.current?.getBoundingClientRect().top ?? 0
    if (top < 0) root.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // Entrada dos cards ao rolar (IntersectionObserver: imune a mudanças de layout)
  // e transição ao trocar de categoria.
  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return
    const targets = Array.from(el.querySelectorAll<HTMLElement>('[data-card],[data-heading]'))
    const isSwitch = !first.current
    first.current = false
    gsap.set(targets, { opacity: 0, y: isSwitch ? 24 : 40 })
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)
        if (!shown.length) return
        shown.forEach((t) => io.unobserve(t))
        gsap.to(shown, { opacity: 1, y: 0, duration: isSwitch ? 0.5 : 0.7, stagger: 0.06, ease: 'power3.out', overwrite: true, clearProps: 'transform' })
      },
      { rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => {
      io.disconnect()
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'transform' })
    }
  }, [active, products.length])

  return (
    <section id="cardapio" className="scroll-mt-16 sm:scroll-mt-20" aria-labelledby="cardapio-title">
      <div className="container pb-6 pt-20 sm:pt-28">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brasa">Cardápio completo</span>
        <h2 id="cardapio-title" className="mt-2 font-display text-[clamp(3rem,9vw,6rem)] font-extrabold uppercase leading-[0.85] tracking-tight text-bege">
          Escolha o seu <span className="font-light text-brasa">prato</span>
        </h2>
        <span className="rule-double mt-5 block w-40" aria-hidden />
      </div>
      <CategoryNavigation categories={cats.filter((c) => counts[c.id] > 0)} active={active} onChange={change} counts={counts} />
      <div ref={root} className="container scroll-mt-36 space-y-20 py-12 sm:space-y-24 sm:py-16">
        {visible.map((c, i) => (
          <div key={c.id}>
            {(c.section ?? 'cardapio') === 'bebidas' && (i === 0 || (visible[i - 1].section ?? 'cardapio') !== 'bebidas') && <PageDivider id="bebidas" title={SECTION_TITLE.bebidas} />}
            <section id={c.id} className="scroll-mt-36 sm:scroll-mt-40" aria-label={c.name}>
              <div data-heading><SectionHeading category={c} count={byCat[c.id].length} /></div>
              {c.id === 'acompanhamentos' && (
                <p className="-mt-3 mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-bege/70">
                  <Plus className="h-3.5 w-3.5 text-brasa" /> Adicione junto com seu prato — tudo vai no mesmo pedido.
                </p>
              )}
              {groupsOf(byCat[c.id]).map((g) => (
                <div key={g.name || '_'} className={cn(g.name && 'mt-10 first:mt-0')}>
                  {g.name && <h4 data-heading className="mb-4 flex items-center gap-3 font-display text-2xl font-bold uppercase tracking-wide text-[#ffa560]"><span className="h-px w-6 bg-brasa" />{g.name}</h4>}
                  <div className={GRID[c.layout]}>
                    {g.items.map((p) => (
                      <div key={p.id} data-card className="flex [&>*]:flex-1">
                        {c.layout === 'combo' ? <ComboCard product={p} onOpen={onOpen} /> : <ProductCard product={p} category={c} onOpen={onOpen} variant={c.layout} />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          </div>
        ))}
        {!visible.length && <p className="py-20 text-center text-bege/50">Nenhum produto nesta categoria por enquanto.</p>}
      </div>
    </section>
  )
}
