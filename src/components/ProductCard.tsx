import { Plus } from 'lucide-react'
import { money, cn } from '@/lib/utils'
import { useAddToCart } from '@/lib/useAddToCart'
import type { Category, Product } from '@/types'
import { ProductBadge } from './ui/badge'
import { ProductImage } from './ProductImage'

interface Props {
  product: Product
  category?: Category
  onOpen: (p: Product) => void
  variant?: 'grid' | 'compact' | 'large' | 'drinks'
}

/** Produtos com escolha obrigatória (ex.: sabor) abrem os detalhes antes de adicionar. */
export function useQuickAdd(onOpen: (p: Product) => void) {
  const addToCart = useAddToCart()
  return (product: Product, el: HTMLElement) => {
    const opts = product.options ?? []
    if (opts.length > 1) onOpen(product)
    else addToCart(product, el, 1, opts.length === 1 ? [opts[0]] : [])
  }
}

function AddButton({ product, onOpen, className }: { product: Product; onOpen: (p: Product) => void; className?: string }) {
  const quickAdd = useQuickAdd(onOpen)
  const needsChoice = (product.options?.length ?? 0) > 1
  return (
    <button
      type="button"
      disabled={!product.available}
      onClick={(e) => quickAdd(product, e.currentTarget)}
      aria-label={needsChoice ? `Escolher ${product.optionsLabel?.toLowerCase() ?? 'opção'} de ${product.name}` : `Adicionar ${product.name} ao pedido`}
      className={cn(
        'group/add grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brasa to-queimado text-white shadow-ember transition hover:scale-110 active:scale-90 disabled:from-white/10 disabled:to-white/10 disabled:shadow-none',
        className,
      )}
    >
      <Plus className="h-5 w-5 transition-transform duration-300 group-hover/add:rotate-90" />
    </button>
  )
}

export function ProductCard({ product, category, onOpen, variant = 'grid' }: Props) {
  const accent = category?.accent ?? '#F47A20'
  const unavailable = !product.available

  if (variant === 'compact' || variant === 'drinks') {
    return (
      <article className={cn('group relative flex items-center gap-4 rounded-3xl border border-white/[0.06] bg-carvao p-3 pr-4 transition duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-[#1a1a1a]', unavailable && 'opacity-55')}>
        <button type="button" onClick={() => onOpen(product)} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-profundo sm:h-28 sm:w-28" aria-label={`Ver ${product.name}`}>
          <div className="absolute inset-0 opacity-50 transition-opacity group-hover:opacity-80" style={{ background: `radial-gradient(closest-side, ${accent}55, transparent)` }} />
          <ProductImage image={product.image} categoryId={product.categoryId} alt={product.name} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
        </button>
        <div className="min-w-0 flex-1">
          {product.badges[0] && <ProductBadge id={product.badges[0]} className="mb-1.5" />}
          <button type="button" onClick={() => onOpen(product)} className="block text-left">
            <h4 className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-bege">{product.name}</h4>
          </button>
          {product.detail && <p className="text-[12px] font-semibold text-brasa/90">{product.detail}</p>}
          {product.description && <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-bege/55">{product.description}</p>}
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="font-display text-2xl font-bold text-bege">{money(product.price)}</span>
            {unavailable ? <span className="text-xs font-semibold uppercase text-bege/50">Esgotado</span> : <AddButton product={product} onOpen={onOpen} className="h-10 w-10" />}
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className={cn('group relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.06] bg-carvao transition duration-500 hover:-translate-y-1.5 hover:border-white/15 hover:shadow-deep', unavailable && 'opacity-55')}>
      <button type="button" onClick={() => onOpen(product)} className={cn('relative block overflow-hidden bg-profundo', variant === 'large' ? 'aspect-[4/3]' : 'aspect-[5/4]')} aria-label={`Ver ${product.name}`}>
        <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(60% 60% at 50% 55%, ${accent}40, transparent 70%)`, opacity: 0.7 }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(244,122,32,.25),transparent_60%)]" />
        <ProductImage
          image={product.image}
          categoryId={product.categoryId}
          alt={product.name}
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:-rotate-2"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.badges.map((b) => <ProductBadge key={b} id={b} />)}
        </div>
        {unavailable && <span className="absolute inset-x-0 bottom-0 bg-black/70 py-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-bege/80">Indisponível no momento</span>}
      </button>
      <div className="flex flex-1 flex-col p-5">
        <button type="button" onClick={() => onOpen(product)} className="text-left">
          <h4 className="font-display text-2xl font-bold uppercase leading-[0.95] tracking-wide text-bege transition group-hover:text-white">{product.name}</h4>
        </button>
        {product.detail && <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-brasa/90">{product.detail}</p>}
        {product.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bege/55">{product.description}</p>}
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-bege/40">Preço</span>
            <span className="font-display text-3xl font-bold leading-none text-bege">{money(product.price)}</span>
          </div>
          <AddButton product={product} onOpen={onOpen} />
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: `linear-gradient(90deg, #D9600F, ${accent})` }} />
    </article>
  )
}
