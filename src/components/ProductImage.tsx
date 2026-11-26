import { Beef, Beer, CookingPot, CupSoda, Flame, GlassWater, Package, Salad, Sandwich, Soup, UtensilsCrossed } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const ICONS: Record<string, typeof Flame> = {
  'prato-feito': UtensilsCrossed, porcoes: Soup, combos: Package, assados: Beef, escondidinho: CookingPot,
  lanches: Sandwich, sanduiches: Sandwich, acompanhamentos: Salad, cervejas: Beer, refrigerantes: CupSoda, diversos: GlassWater,
}
export const categoryArtIcon = (categoryId?: string) => (categoryId && ICONS[categoryId]) || Flame

/**
 * Foto REAL do produto quando houver. Sem foto, mostra a arte da marca
 * (brasa laranja + ícone da categoria) — nunca uma foto genérica que não
 * represente o produto.
 */
export function ProductImage({ image, categoryId, alt, className, imgClassName, eager, round }: {
  image?: string; categoryId?: string; alt: string; className?: string; imgClassName?: string; eager?: boolean; round?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const showPhoto = !!image && !failed
  const Icon = categoryArtIcon(categoryId)
  return (
    <div className={cn('relative', className)}>
      {showPhoto ? (
        <img src={image} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={cn('h-full w-full object-cover', imgClassName)} draggable={false} />
      ) : (
        <div className={cn('relative grid h-full w-full place-items-center overflow-hidden', round && 'rounded-full', imgClassName)} aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(244,122,32,.32),rgba(10,10,10,0)_62%)]" />
          <div className="relative grid aspect-square h-[72%] max-h-full max-w-full place-items-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-brasa/30" />
            <div className="absolute inset-[16%] rounded-full border-2 border-brasa/50 bg-black/40" />
            <Icon className="relative h-[30%] w-[30%] text-brasa drop-shadow-[0_0_18px_rgba(244,122,32,.65)]" strokeWidth={1.6} />
          </div>
        </div>
      )}
    </div>
  )
}
