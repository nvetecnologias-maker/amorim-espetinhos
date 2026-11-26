import gsap from 'gsap'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { cn, prefersReducedMotion } from '@/lib/utils'
import { sortByOrder, useMenu } from '@/store/menu'
import type { Category, MenuSection, Product } from '@/types'
import { CategoryNavigation } from './CategoryNavigation'
import { ProductCard } from './ProductCard'

const SECTION_TITLE: Record<MenuSection, string> = { cardapio: 'Cardápio', bebidas: 'Bebidas' }

/** Cabeçalho de página, como o topo das artes: linha dupla laranja + título branco. */
function PageHeading({ id, title }: { id: string; title: string }) {
  return (
    <div id={id} className="mb-10 flex scroll-mt-36 items-center gap-4 sm:scroll-mt-40" data-heading>
      <span className="rule-double flex-1" aria-hidden />
      <h2 className="text-[clamp(2.2rem,7vw,3.4rem)] font-extrabold leading-none text-white">{title}</h2>
      <span className="rule-double flex-1" aria-hidden />
    </div>
  )
}

/** Uma categoria: título laranja, linha fina laranja, itens com subtítulos opcionais. */
function CategoryBlock({ category, products, onOpen }: { category: Category; products: Product[]; onOpen: (p: Product) => void }) {
  return (
    <section id={category.id} aria-label={category.name} className="mb-12 break-inside-avoid scroll-mt-36 sm:scroll-mt-40" data-heading>
      <h3 className="text-[clamp(2rem,5.5vw,2.6rem)] font-extrabold leading-tight text-brasa">{category.name}</h3>
      {category.tagline && <p className="mt-1 text-sm font-semibold text-white/60">{category.tagline}</p>}
      <div className="mt-2 h-px bg-brasa/70" aria-hidden />
      <div className="divide-y divide-white/[0.07]">
        {products.map((p, i) => {
          const group = p.group?.trim() ?? ''
          const showGroup = group && group !== (products[i - 1]?.group?.trim() ?? '')
          return (
            <div key={p.id}>
              {showGroup && <h4 className="pb-1 pt-5 text-xl font-extrabold text-[#F7A35C]">{group}</h4>}
              <ProductCard product={p} onOpen={onOpen} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function MenuSections({ onOpen }: { onOpen: (p: Product) => void }) {
  const categories = useMenu((s) => s.categories)
  const products = useMenu((s) => s.products)
  const [active, setActive] = useState('todos')
  const root = useRef<HTMLDivElement>(null)

  const cats = useMemo(() => [...categories].sort(sortByOrder), [categories])
  const byCat = useMemo(() => {
    const m: Record<string, Product[]> = {}
    for (const p of [...products].sort(sortByOrder)) (m[p.categoryId] ??= []).push(p)
    return m
  }, [products])
  const counts = useMemo(() => Object.fromEntries(cats.map((c) => [c.id, byCat[c.id]?.length ?? 0])), [cats, byCat])
  const visible = cats.filter((c) => (active === 'todos' || c.id === active) && byCat[c.id]?.length)
  const sections = (['cardapio', 'bebidas'] as MenuSection[])
    .map((s) => ({ id: s, cats: visible.filter((c) => (c.section ?? 'cardapio') === s) }))
    .filter((s) => s.cats.length)

  // Âncoras do menu (#combos, #bebidas…) mostram tudo e rolam até o ponto certo
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

  // Entrada suave dos blocos ao trocar de categoria.
  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const targets = el.querySelectorAll<HTMLElement>('[data-heading]')
    const tween = gsap.fromTo(targets, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power2.out', clearProps: 'transform,opacity' })
    return () => { tween.kill(); gsap.set(targets, { clearProps: 'transform,opacity' }) }
  }, [active])

  const single = active !== 'todos'

  return (
    <section id="cardapio" className="scroll-mt-16 bg-black sm:scroll-mt-20" aria-label="Cardápio">
      <CategoryNavigation categories={cats.filter((c) => counts[c.id] > 0)} active={active} onChange={change} counts={counts} />
      <div ref={root} className="container scroll-mt-36 py-12 sm:py-16">
        {sections.map((s) => (
          <div key={s.id} className={cn(s.id === 'bebidas' && sections.length > 1 && 'mt-8')}>
            {(!single || s.id === 'bebidas') && <PageHeading id={s.id === 'bebidas' ? 'bebidas' : 'cardapio-topo'} title={SECTION_TITLE[s.id]} />}
            <div className={cn(!single && 'lg:columns-2 lg:gap-16 lg:[column-rule:2px_solid_#F47A20]')}>
              {s.cats.map((c) => <CategoryBlock key={c.id} category={c} products={byCat[c.id]} onOpen={onOpen} />)}
            </div>
          </div>
        ))}
        {!visible.length && <p className="py-20 text-center text-white/50">Nenhum produto nesta categoria por enquanto.</p>}
      </div>
    </section>
  )
}
