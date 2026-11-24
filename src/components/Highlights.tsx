import { useMemo } from 'react'
import { DishOrbitCarousel, type OrbitDish } from '@/components/ui/dish-orbit-carousel'
import { useAddToCart } from '@/lib/useAddToCart'
import { money } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { sortByOrder, useMenu } from '@/store/menu'
import type { Product } from '@/types'
import { ProductBadge } from './ui/badge'
import { ProductImage } from './ProductImage'

/** Carrossel de destaque com os espetinhos marcados como "destaque" no painel. */
export function Highlights({ onOpen }: { onOpen: (p: Product) => void }) {
  const products = useMenu((s) => s.products)
  const categories = useMenu((s) => s.categories)
  const favorites = useCart((s) => s.favorites)
  const toggleFavorite = useCart((s) => s.toggleFavorite)
  const addToCart = useAddToCart()

  const featured = useMemo(() => products.filter((p) => p.featured).sort(sortByOrder), [products])
  const dishes: OrbitDish[] = useMemo(
    () =>
      featured.map((p) => {
        const c = categories.find((x) => x.id === p.categoryId)
        return {
          id: p.id,
          titleTop: p.titleTop,
          titleBottom: p.titleBottom || p.name,
          description: p.description,
          price: money(p.price),
          ingredients: p.ingredients,
          accent: c?.accent ?? '#F07832',
          categoryLabel: c?.name,
          badge: p.badges[0] ? <ProductBadge id={p.badges[0]} /> : undefined,
          available: p.available,
        }
      }),
    [featured, categories],
  )
  const byId = (id: string) => featured.find((p) => p.id === id)!

  if (!dishes.length) return null
  return (
    <section id="destaques" className="relative scroll-mt-20 bg-gradient-to-b from-profundo via-carvao to-profundo py-16 sm:py-24" aria-labelledby="destaques-title">
      <div className="container mb-6 sm:mb-10">
        <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brasa">Direto da churrasqueira</span>
        <h2 id="destaques-title" className="mt-2 font-display text-[clamp(2.6rem,8vw,5.5rem)] font-extrabold uppercase leading-[0.85] tracking-tight">
          Os espetos <span className="font-light">da casa</span>
        </h2>
        <p className="mt-3 text-sm text-bege/50">Deslize, use as setas ou toque nas miniaturas.</p>
      </div>
      <DishOrbitCarousel
        dishes={dishes}
        label="Espetinhos em destaque"
        renderImage={(d, variant) => {
          const p = byId(d.id)
          return <ProductImage image={p.image} art={p.art} alt={p.name} eager={variant === 'main'} className="h-full w-full" imgClassName={p.image ? (variant === 'main' ? 'rounded-full' : '') : variant === 'thumb' ? 'scale-[1.6]' : ''} />
        }}
        onOrder={(d, el) => addToCart(byId(d.id), el)}
        onOpenDetails={(d) => onOpen(byId(d.id))}
        isLiked={(id) => favorites.includes(id)}
        onToggleLike={toggleFavorite}
      />
    </section>
  )
}
