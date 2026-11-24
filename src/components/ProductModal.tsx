import { Check, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NOTE_PRESETS, toggleNote } from '@/lib/notes'
import { useAddToCart } from '@/lib/useAddToCart'
import { cn, money } from '@/lib/utils'
import { useMenu } from '@/store/menu'
import type { Product } from '@/types'
import { ProductBadge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/input'
import { ProductImage } from './ProductImage'

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const category = useMenu((s) => s.categories.find((c) => c.id === product?.categoryId))
  const addToCart = useAddToCart()
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState<string[]>([])
  const [custom, setCustom] = useState('')

  useEffect(() => {
    if (product) { setQty(1); setNotes([]); setCustom('') }
  }, [product])

  const presets = NOTE_PRESETS[category?.notesPreset ?? 'espeto']
  const accent = category?.accent ?? '#F07832'

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-0 sm:max-h-[90vh] sm:overflow-hidden">
        {product && (
          <div className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden bg-profundo sm:aspect-auto sm:h-full sm:min-h-[520px]">
              <div className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 50% 50%, ${accent}55, transparent 70%)` }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(240,120,50,.3),transparent_60%)]" />
              <ProductImage image={product.image} art={product.art} alt={product.name} eager className="h-full w-full" imgClassName={product.image ? '' : 'scale-110'} />
              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">{product.badges.map((b) => <ProductBadge key={b} id={b} />)}</div>
            </div>

            <div className="flex min-w-0 flex-col sm:max-h-[90vh] sm:overflow-y-auto">
              <div className="flex-1 p-6 sm:p-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>{category?.name}</span>
                <DialogTitle className="mt-2 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tight text-bege sm:text-5xl">{product.name}</DialogTitle>
                <DialogDescription className="mt-4 text-[15px] leading-relaxed text-bege/70">{product.longDescription || product.description}</DialogDescription>

                {product.comboItems && product.comboItems.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {product.comboItems.map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-bege/85"><Check className="h-4 w-4 text-brasa" /> {i}</li>
                    ))}
                  </ul>
                )}
                {product.ingredients.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.ingredients.map((i) => <span key={i} className="rounded-full border border-white/10 px-3 py-1 text-xs text-bege/75">{i}</span>)}
                  </div>
                )}

                <p className="mt-6 font-display text-4xl font-bold text-bege">{money(product.price)}</p>

                {presets.length > 0 && (
                  <fieldset className="mt-6">
                    <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-bege/55">Observações</legend>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((n) => {
                        const on = notes.includes(n)
                        return (
                          <button key={n} type="button" aria-pressed={on} onClick={() => setNotes((l) => toggleNote(l, n))}
                            className={cn('inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition active:scale-95', on ? 'border-brasa bg-brasa/15 text-bege' : 'border-white/10 text-bege/70 hover:border-white/30')}>
                            {on && <Check className="h-4 w-4 text-brasa" />}{n}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                )}
                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-bege/55">Observação personalizada</span>
                  <Textarea value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={140} placeholder={category?.notesPreset === 'bebida' ? 'Ex.: sabor laranja' : 'Ex.: capricha na farofa'} />
                </label>
              </div>

              <div className="pb-safe sticky bottom-0 flex items-center gap-3 border-t border-white/10 bg-carvao/95 p-4 backdrop-blur sm:p-6">
                <div className="flex items-center rounded-full border border-white/15">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-bege disabled:opacity-30" disabled={qty <= 1} aria-label="Diminuir quantidade"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-12 w-12 place-items-center text-bege" aria-label="Aumentar quantidade"><Plus className="h-4 w-4" /></button>
                </div>
                <Button
                  className="h-12 min-w-0 flex-1 text-xs uppercase tracking-[0.1em] sm:text-sm"
                  disabled={!product.available}
                  onClick={(e) => { addToCart(product, e.currentTarget, qty, notes, custom.trim()); onClose() }}
                >
                  {product.available ? <><span className="hidden min-[400px]:inline">Adicionar ·</span><span className="min-[400px]:hidden">Adicionar</span> {money(product.price * qty)}</> : 'Indisponível'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
