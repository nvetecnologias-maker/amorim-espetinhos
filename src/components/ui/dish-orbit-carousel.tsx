import gsap from 'gsap'
import { ChevronLeft, ChevronRight, Heart, Plus } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { cn, prefersReducedMotion } from '@/lib/utils'

/**
 * Dish Orbit Carousel — destaques do cardápio (só produtos com foto real).
 *
 * Mapeamento do componente original:
 *  - Dish        → produto em destaque (OrbitDish)
 *  - Chef        → removido (a marca já aparece no cabeçalho)
 *  - Ingredients → composição do prato
 *  - Rating      → removido: não exibimos avaliações sem dados reais
 *  - Likes       → favoritos do próprio cliente (salvos no aparelho)
 *  - Order       → adicionar ao pedido
 *
 * A imagem gira em órbita ao redor de um eixo à esquerda: a atual sai pelo
 * topo e a próxima entra por baixo. O título entra em duas linhas com pesos
 * diferentes. A cor de destaque acompanha o produto selecionado.
 */

export interface OrbitDish {
  id: string
  titleTop: string
  titleBottom: string
  description: string
  price: string
  ingredients: string[]
  accent: string
  categoryLabel?: string
  badge?: ReactNode
  available?: boolean
}

export interface DishOrbitCarouselProps {
  dishes: OrbitDish[]
  renderImage: (dish: OrbitDish, variant: 'main' | 'thumb') => ReactNode
  onOrder: (dish: OrbitDish, trigger: HTMLElement) => void
  onOpenDetails?: (dish: OrbitDish) => void
  isLiked?: (id: string) => boolean
  onToggleLike?: (id: string) => void
  className?: string
  /** Rótulo para leitores de tela */
  label?: string
}

const SWIPE = 45
const pad = (n: number) => String(n).padStart(2, '0')

export function DishOrbitCarousel({ dishes, renderImage, onOrder, onOpenDetails, isLiked, onToggleLike, className, label = 'Destaques' }: DishOrbitCarouselProps) {
  const [index, setIndex] = useState(0)
  const root = useRef<HTMLElement>(null)
  const layers = useRef<(HTMLDivElement | null)[]>([])
  const thumbs = useRef<HTMLDivElement>(null)
  const prev = useRef(0)
  const dir = useRef<1 | -1>(1)
  const busy = useRef(false)
  const drag = useRef<{ x: number; y: number; id: number } | null>(null)

  const count = dishes.length
  const safeIndex = Math.min(index, Math.max(0, count - 1))
  const dish = dishes[safeIndex]

  const go = useCallback(
    (to: number, direction?: 1 | -1) => {
      if (!count || busy.current) return
      const next = (to + count) % count
      if (next === safeIndex) return
      dir.current = direction ?? (next > safeIndex ? 1 : -1)
      setIndex(next)
    },
    [count, safeIndex],
  )
  const goNext = useCallback(() => go(safeIndex + 1, 1), [go, safeIndex])
  const goPrev = useCallback(() => go(safeIndex - 1, -1), [go, safeIndex])

  // Estado inicial das camadas
  useLayoutEffect(() => {
    layers.current.forEach((el, i) => el && gsap.set(el, { rotation: 0, autoAlpha: i === safeIndex ? 1 : 0, transformOrigin: '-55% 50%' }))
    prev.current = safeIndex
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  // Animação de órbita + título + cor de destaque
  useLayoutEffect(() => {
    const from = prev.current
    const to = safeIndex
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      if (root.current && dish) gsap.to(root.current, { '--accent': dish.accent, duration: reduce ? 0 : 0.8, ease: 'power2.out' })

      const inEl = layers.current[to]
      const outEl = layers.current[from]
      if (from !== to && inEl && outEl) {
        if (reduce) {
          gsap.set(outEl, { autoAlpha: 0 })
          gsap.set(inEl, { autoAlpha: 1, rotation: 0 })
        } else {
          busy.current = true
          const d = dir.current
          const inner = (el: HTMLElement) => el.querySelector('[data-spin]')
          gsap.timeline({ onComplete: () => { busy.current = false } })
            .to(outEl, { rotation: -62 * d, autoAlpha: 0, duration: 0.85, ease: 'power3.inOut' }, 0)
            .to(inner(outEl), { rotation: -50 * d, duration: 0.85, ease: 'power3.inOut' }, 0)
            .fromTo(inEl, { rotation: 62 * d, autoAlpha: 0 }, { rotation: 0, autoAlpha: 1, duration: 0.95, ease: 'power3.out' }, 0.12)
            .fromTo(inner(inEl), { rotation: 60 * d }, { rotation: 0, duration: 1.1, ease: 'power3.out' }, 0.12)
        }
      }

      if (!reduce) {
        gsap.fromTo('[data-orbit="t1"]', { yPercent: 105 }, { yPercent: 0, duration: 0.75, ease: 'power4.out', delay: 0.15 })
        gsap.fromTo('[data-orbit="t2"]', { yPercent: 105 }, { yPercent: 0, duration: 0.85, ease: 'power4.out', delay: 0.25 })
        gsap.fromTo('[data-orbit="fade"]', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.3 })
      }
    }, root)
    prev.current = to

    const t = thumbs.current?.querySelector<HTMLElement>(`[data-thumb="${to}"]`)
    const strip = thumbs.current
    if (t && strip) {
      const offset = t.getBoundingClientRect().left - strip.getBoundingClientRect().left + strip.scrollLeft
      strip.scrollTo({ left: offset - strip.clientWidth / 2 + t.clientWidth / 2, behavior: reduce ? 'auto' : 'smooth' })
    }
    return () => ctx.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex])

  // Entrada da seção ao rolar
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-orbit="stage"]', { x: -80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } })
        gsap.from('[data-orbit="ring"]', { rotate: -40, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 75%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev() }
  }

  // Gestos (swipe) no celular e arrastar no desktop
  const onPointerDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId } }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = drag.current
    drag.current = null
    if (!s || s.id !== e.pointerId) return
    const dx = e.clientX - s.x, dy = e.clientY - s.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.2) (dx < 0 ? goNext : goPrev)()
  }

  if (!dish) return null
  const liked = isLiked?.(dish.id) ?? false

  return (
    <section
      ref={root}
      aria-roledescription="carrossel"
      aria-label={label}
      tabIndex={-1}
      onKeyDown={onKey}
      className={cn('relative isolate overflow-hidden', className)}
      style={{ ['--accent' as string]: dish.accent }}
    >
      {/* brilho na cor do produto */}
      <div className="pointer-events-none absolute -left-[20%] top-1/2 -z-10 h-[120vmin] w-[120vmin] -translate-y-1/2 rounded-full opacity-25 blur-3xl" style={{ background: 'radial-gradient(closest-side, var(--accent), transparent)' }} aria-hidden />
      <span className="pointer-events-none absolute -right-4 top-4 -z-10 hidden select-none lg:block font-display text-[38vw] font-extrabold leading-none text-transparent opacity-[0.06] [-webkit-text-stroke:2px_var(--accent)] lg:text-[22vw]" aria-hidden>
        {pad(safeIndex + 1)}
      </span>

      <div className="container grid items-center gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* Palco com órbita */}
        <div
          data-orbit="stage"
          className="relative mx-auto aspect-square w-full max-w-[min(92vw,620px)] touch-pan-y select-none [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
        >
          {/* anel de órbita: centro no eixo de rotação (à esquerda) */}
          <div data-orbit="ring" className="pointer-events-none absolute rounded-full border-2 border-dashed transition-colors duration-700" style={{ left: '-118%', top: '-34%', width: '168%', height: '168%', borderColor: 'color-mix(in srgb, var(--accent) 55%, transparent)' }} aria-hidden />
          <div className="pointer-events-none absolute rounded-full border border-white/5" style={{ left: '-104%', top: '-20%', width: '140%', height: '140%' }} aria-hidden />
          {/* prato / grelha */}
          <div className="absolute inset-[13%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,.08),rgba(20,20,20,.6)_60%,transparent_72%)] shadow-[inset_0_0_80px_rgba(0,0,0,.8)]" aria-hidden />
          <div className="absolute inset-[13%] rounded-full opacity-60 blur-2xl transition-colors duration-700" style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, var(--accent) 45%, transparent), transparent)' }} aria-hidden />

          {dishes.map((d, i) => (
            <div key={d.id} ref={(el) => { layers.current[i] = el }} className="absolute inset-[6%]" aria-hidden={i !== safeIndex}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => onOpenDetails?.(d)}
                data-spin
                className="block h-full w-full cursor-pointer drop-shadow-[0_35px_40px_rgba(0,0,0,.85)]"
                aria-label={`Ver detalhes de ${d.titleTop} ${d.titleBottom}`}
              >
                {renderImage(d, 'main')}
              </button>
            </div>
          ))}

          {/* setas sobre o palco no celular */}
          <div className="absolute inset-x-0 bottom-[6%] flex justify-between px-2 lg:hidden">
            <ArrowBtn onClick={goPrev} label="Anterior"><ChevronLeft /></ArrowBtn>
            <ArrowBtn onClick={goNext} label="Próximo"><ChevronRight /></ArrowBtn>
          </div>
        </div>

        {/* Informações */}
        <div className="relative" aria-live="polite">
          <div data-orbit="fade" className="mb-3 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.24em]" style={{ color: 'var(--accent)' }}>
              {pad(safeIndex + 1)} / {pad(count)}
              {dish.categoryLabel && <span className="ml-3 text-bege/50">{dish.categoryLabel}</span>}
            </span>
            {dish.badge}
          </div>

          <h3 className="font-display uppercase leading-[0.85]">
            <span className="block overflow-hidden"><span data-orbit="t1" className="block text-[clamp(1.6rem,5vw,2.8rem)] font-light tracking-wide text-bege/80">{dish.titleTop || ' '}</span></span>
            <span className="block overflow-hidden pb-1"><span data-orbit="t2" className="block text-[clamp(2.8rem,10vw,6rem)] font-extrabold tracking-tight text-bege">{dish.titleBottom}</span></span>
          </h3>

          <p data-orbit="fade" className="mt-4 max-w-md text-base leading-relaxed text-bege/70">{dish.description}</p>

          {dish.ingredients.length > 0 && (
            <ul data-orbit="fade" className="mt-5 flex flex-wrap gap-2" aria-label="Composição">
              {dish.ingredients.map((ing) => (
                <li key={ing} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-bege/80">{ing}</li>
              ))}
            </ul>
          )}

          <div data-orbit="fade" className="mt-7 flex flex-wrap items-center gap-4">
            <span className="font-display text-5xl font-bold tracking-tight text-bege">{dish.price}</span>
            <button
              type="button"
              disabled={dish.available === false}
              onClick={(e) => onOrder(dish, e.currentTarget)}
              className="group inline-flex h-14 items-center gap-2 rounded-full px-7 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-ember transition hover:-translate-y-0.5 hover:brightness-110 active:scale-95 disabled:opacity-40"
              style={{ background: 'linear-gradient(90deg, #D9600F, var(--accent))' }}
            >
              <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
              {dish.available === false ? 'Indisponível' : 'Adicionar ao pedido'}
            </button>
            {onToggleLike && (
              <button
                type="button"
                onClick={() => onToggleLike(dish.id)}
                aria-pressed={liked}
                aria-label={liked ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                className={cn('grid h-14 w-14 place-items-center rounded-full border transition active:scale-90', liked ? 'border-transparent bg-queimado/25 text-[#ff8a70]' : 'border-white/15 text-bege/70 hover:text-bege')}
              >
                <Heart className={cn('h-5 w-5', liked && 'fill-current')} />
              </button>
            )}
          </div>

          {/* navegação */}
          <div className="mt-9 flex items-center gap-3">
            <div className="hidden gap-2 lg:flex">
              <ArrowBtn onClick={goPrev} label="Anterior"><ChevronLeft /></ArrowBtn>
              <ArrowBtn onClick={goNext} label="Próximo"><ChevronRight /></ArrowBtn>
            </div>
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
              <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${((safeIndex + 1) / count) * 100}%`, background: 'var(--accent)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* miniaturas */}
      <div className="container mt-8">
        <div ref={thumbs} className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 py-3" role="tablist" aria-label="Escolher destaque">
          {dishes.map((d, i) => (
            <div key={d.id} data-thumb={i} className="snap-center">
              <button
                type="button"
                role="tab"
                aria-selected={i === safeIndex}
                aria-label={`${d.titleTop} ${d.titleBottom}`}
                onClick={() => go(i)}
                className={cn(
                  'group relative flex w-[92px] flex-col items-center gap-2 rounded-2xl p-2 text-center transition sm:w-[108px]',
                  i === safeIndex ? 'bg-white/[0.07]' : 'opacity-60 hover:opacity-100',
                )}
              >
                <span className={cn('relative grid h-16 w-16 place-items-center overflow-hidden rounded-full border-2 bg-carvao transition sm:h-20 sm:w-20', i === safeIndex ? 'scale-105' : 'border-white/10')} style={i === safeIndex ? { borderColor: d.accent, boxShadow: `0 0 24px -4px ${d.accent}` } : undefined}>
                  {renderImage(d, 'thumb')}
                </span>
                <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-bege/80">{d.titleBottom}</span>
                {i === safeIndex && <span className="absolute -bottom-1 h-1 w-6 rounded-full" style={{ background: d.accent }} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArrowBtn({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-black/50 text-bege backdrop-blur transition hover:border-[color:var(--accent)] hover:text-white active:scale-90 [&_svg]:h-5 [&_svg]:w-5"
    >
      {children}
    </button>
  )
}

export default DishOrbitCarousel
