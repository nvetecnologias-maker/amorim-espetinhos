import { Plus } from 'lucide-react'
import { useAddToCart } from '@/lib/useAddToCart'
import { cn, money } from '@/lib/utils'
import type { Product } from '@/types'
import { ProductBadge } from './ui/badge'

/** Preço no "selo" branco arredondado, como nas artes do cardápio. */
export function PricePill({ price, className, muted }: { price: number; className?: string; muted?: boolean }) {
  return (
    <span className={cn('inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[15px] font-extrabold tabular-nums', muted ? 'bg-white/15 text-white/50' : 'bg-white text-[#1d1d2b]', className)}>
      {money(price).replace('R$', '').trim()}
    </span>
  )
}

/**
 * Linha do cardápio: nome ··········· preço [+]
 * Toque no nome abre os detalhes (quantidade, observações, escolha de sabor).
 */
export function ProductCard({ product, onOpen }: { product: Product; onOpen: (p: Product) => void }) {
  const addToCart = useAddToCart()
  const unavailable = !product.available
  const needsChoice = (product.options?.length ?? 0) > 1

  return (
    <article className={cn('group flex gap-3 py-3', unavailable && 'opacity-55')}>
      {product.image && (
        <button type="button" onClick={() => onOpen(product)} className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-[72px] sm:w-[72px]" aria-label={`Ver ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-end gap-2">
          <button type="button" onClick={() => onOpen(product)} className="min-w-0 text-left">
            <h4 className="text-[1.08rem] font-extrabold leading-tight text-white transition group-hover:text-brasa sm:text-lg">{product.name}</h4>
          </button>
          <span className="leader" aria-hidden />
          <PricePill price={product.price} muted={unavailable} />
        </div>
        {product.detail && <p className="text-xs font-bold text-white/80">({product.detail})</p>}
        {product.description && <p className="mt-0.5 text-sm font-semibold leading-snug text-white/65">{product.description}</p>}
        {product.badges.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1.5">{product.badges.map((b) => <ProductBadge key={b} id={b} />)}</div>}
      </div>
      <div className="flex shrink-0 items-start pt-0.5">
        {unavailable ? (
          <span className="w-10 pt-1 text-center text-[10px] font-bold uppercase leading-tight text-white/50">Esgo&shy;tado</span>
        ) : (
          <button
            type="button"
            onClick={(e) => (needsChoice ? onOpen(product) : addToCart(product, e.currentTarget, 1, product.options?.length === 1 ? [product.options[0]] : []))}
            aria-label={needsChoice ? `Escolher ${product.optionsLabel?.toLowerCase() ?? 'opção'} de ${product.name}` : `Adicionar ${product.name} ao pedido`}
            className="grid h-10 w-10 place-items-center rounded-full bg-brasa text-black transition hover:scale-110 hover:bg-[#ff8a33] active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Plus className="h-5 w-5" strokeWidth={3} />
          </button>
        )}
      </div>
    </article>
  )
}
